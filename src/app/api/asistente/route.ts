import { after, NextResponse, type NextRequest } from 'next/server';

import { checkBudget, recordSpend } from '@/entities/ai-budget';
import {
  buildSystemPrompt,
  cleanTitle,
  TITLE_SYSTEM_PROMPT,
} from '@/entities/charcu-assistant';
import { auditCureDoses, MAX_CURE_1_G_PER_KG } from '@/entities/cure-safety';
import {
  createRecipe,
  ownsRecipe,
  renameRecipe,
  saveExchange,
  touchRecipe,
} from '@/entities/recipe-chat/server';
import { consumeQuota, refundQuota } from '@/entities/usage-quota/server';

import { generateAnswer, type GeminiTurn } from '@/shared/api/gemini';
import { countryFromRequest } from '@/shared/api/geo';
import { createSupabaseServerClient } from '@/shared/api/supabase/server';
import { attachVisitorCookie, ensureVisitorId } from '@/shared/api/visitor';

/** Tope de la imagen en base64 (~3 MB de foto). */
const MAX_IMAGE_CHARS = 4_000_000;
const MAX_TURNS = 30;

interface AssistantRequest {
  readonly product: string;
  readonly turns: readonly GeminiTurn[];
  /**
   * La receta a la que pertenece esta pregunta.
   *
   * Si no viene, la pregunta ABRE una receta nueva: es la opción B que decidió
   * Cristian, la receta se crea sola con la primera pregunta en vez de pedirle
   * al visitante que rellene un formulario antes de poder escribir.
   */
  readonly recipeId: string | null;
}

function parseTurn(value: unknown): GeminiTurn | null {
  if (typeof value !== 'object' || value === null) {
    return null;
  }

  const { role, text, image } = value as {
    role?: unknown;
    text?: unknown;
    image?: unknown;
  };

  if ((role !== 'user' && role !== 'model') || typeof text !== 'string') {
    return null;
  }

  if (typeof image !== 'object' || image === null) {
    return { role, text };
  }

  const { mimeType, base64 } = image as { mimeType?: unknown; base64?: unknown };
  if (
    typeof mimeType !== 'string' ||
    typeof base64 !== 'string' ||
    base64.length > MAX_IMAGE_CHARS
  ) {
    return { role, text };
  }

  return { role, text, image: { mimeType, base64 } };
}

function parseRequest(value: unknown): AssistantRequest | null {
  if (typeof value !== 'object' || value === null) {
    return null;
  }

  const { product, turns, recipeId } = value as {
    product?: unknown;
    turns?: unknown;
    recipeId?: unknown;
  };

  // `level` y `country` ya no se leen del cuerpo. El nivel no existe (todos son
  // charcus) y el país lo pone el servidor desde la cabecera de Vercel, no
  // quien pregunta. Si un cliente viejo los sigue mandando, se ignoran.
  if (typeof product !== 'string' || !Array.isArray(turns) || turns.length === 0) {
    return null;
  }

  const parsed = turns
    .slice(-MAX_TURNS)
    .map((turn: unknown) => parseTurn(turn))
    .filter((turn): turn is GeminiTurn => turn !== null);

  return parsed.length === 0
    ? null
    : {
        product,
        turns: parsed,
        recipeId: typeof recipeId === 'string' && recipeId !== '' ? recipeId : null,
      };
}

/**
 * Lo que se muestra cuando el modelo propuso una dosis por encima del tope.
 * No se le enseña al usuario la cifra peligrosa: se corrige y se explica.
 */
function blockedAnswer(): string {
  return `Paré la respuesta a propósito: me salió una dosis de sal de cura por encima del máximo seguro y prefiero no dártela.

El tope es **${String(MAX_CURE_1_G_PER_KG)} g de sal de cura #1 por kilo de carne** (unas 156 ppm de nitrito, el máximo permitido). Por encima de ahí no curas mejor: solo metes más nitrito del que debería comerse una persona.

Cuéntame cuántos kilos tienes exactamente y qué sal de cura estás usando (#1 o #2), y te doy la cantidad justa.`;
}

/** Cuántas fotos trae esta pregunta. Las imágenes cuestan bastante más. */
function countImages(turns: readonly GeminiTurn[]): number {
  const last = turns[turns.length - 1];
  return last?.image === undefined ? 0 : 1;
}

export async function POST(request: NextRequest): Promise<NextResponse> {
  const visitorId = ensureVisitorId(request);
  const payload: unknown = await request.json().catch(() => null);
  const parsed = parseRequest(payload);

  if (parsed === null) {
    return attachVisitorCookie(
      NextResponse.json({ error: 'peticion-invalida' }, { status: 400 }),
      visitorId,
    );
  }

  // Freno de gasto: se comprueba ANTES de llamar a Gemini, que es lo que cuesta.
  const budget = await checkBudget();
  if (budget.isExhausted) {
    console.warn(
      `[presupuesto] tope diario alcanzado: ${budget.spentUsd.toFixed(4)} de ${String(budget.budgetUsd)} USD`,
    );
    return attachVisitorCookie(
      NextResponse.json({ error: 'sin-presupuesto' }, { status: 429 }),
      visitorId,
    );
  }

  // El cupo del visitante, también ANTES de llamar a Gemini. Aquí es donde el
  // muro deja de ser una pantalla y se vuelve una regla: por más que alguien
  // llame a esta ruta a mano, sin cupo no hay respuesta.
  const supabase = await createSupabaseServerClient();
  const { data: authData } = await supabase.auth.getUser();
  const userId = authData.user?.id ?? null;

  const images = countImages(parsed.turns);

  // Si viene con receta, tiene que ser suya. Si no lo es, se ignora: nunca se
  // escribe en la receta de otro ni se le devuelve su historial.
  const ownsIt =
    parsed.recipeId !== null && (await ownsRecipe(parsed.recipeId, visitorId, userId));

  /**
   * Si no viene receta, se abre una NUEVA. El servidor ya no adivina.
   *
   * Hasta el 2026-08-20 aquí se retomaba "la última abierta", porque el id
   * vivía en memoria del navegador y una recarga lo perdía. Ese rescate
   * automático tenía un efecto que no queríamos: era IMPOSIBLE empezar un chat
   * nuevo — daba igual lo que pidiera el navegador, siempre volvía al anterior.
   *
   * Ahora el id vive en `sessionStorage` con la regla de las 6 horas, así que
   * el navegador sí sabe en qué receta iba y una recarga ya no es amnesia.
   * Quien decide es él; aquí solo se comprueba que la receta sea suya.
   */
  const recipeId = ownsIt ? parsed.recipeId : null;
  const isNewRecipe = recipeId === null;

  const quota = await consumeQuota(visitorId, userId, images, isNewRecipe);

  if (quota !== null && !quota.allowed) {
    return attachVisitorCookie(
      NextResponse.json(
        { error: 'sin-cupo', deniedBy: quota.deniedBy, quota: quota.snapshot },
        { status: 402 },
      ),
      visitorId,
    );
  }

  const systemPrompt = buildSystemPrompt({
    product: parsed.product,
    country: countryFromRequest(request),
  });

  const result = await generateAnswer(systemPrompt, parsed.turns);

  if (!result.ok) {
    // No llegó respuesta: se le devuelve la pregunta que se le acababa de
    // cobrar. El fallo es nuestro (o de Google), no suyo.
    if (quota !== null) {
      await refundQuota(visitorId, userId, images, isNewRecipe);
    }

    const status = result.reason === 'sin-clave' ? 503 : 502;
    return attachVisitorCookie(
      NextResponse.json({ error: result.reason }, { status }),
      visitorId,
    );
  }

  // Se apunta lo que de verdad consumió, no una estimación.
  await recordSpend(result.usage);

  // La receta se crea DESPUÉS de que la respuesta llegó bien. Si se creara
  // antes, un fallo de Gemini dejaría recetas vacías en el historial de la
  // gente, que es basura que después hay que explicar.
  const lastTurn = parsed.turns[parsed.turns.length - 1];
  const activeRecipeId = isNewRecipe
    ? await createRecipe(visitorId, userId, lastTurn?.text ?? '')
    : recipeId;

  if (activeRecipeId !== null && !isNewRecipe) {
    await touchRecipe(activeRecipeId);
  }

  // Ponerle nombre a la receta va DESPUÉS de contestar, con `after()`: es una
  // segunda llamada al modelo y no tiene por qué hacer esperar a nadie. El
  // usuario ve su respuesta y el título se escribe por detrás.
  //
  // Solo la primera vez de cada receta. Si falla, se queda el título
  // provisional —la primera pregunta recortada— que es feo pero no roto.
  if (isNewRecipe && activeRecipeId !== null) {
    const recipeToTitle = activeRecipeId;
    const firstQuestion = lastTurn?.text ?? '';
    after(async () => {
      const titled = await generateAnswer(TITLE_SYSTEM_PROMPT, [
        { role: 'user', text: firstQuestion },
      ]);
      if (titled.ok) {
        await renameRecipe(recipeToTitle, cleanTitle(titled.text));
      }
    });
  }

  // Segunda barrera: se revisa la respuesta antes de que la vea nadie.
  const verdict = auditCureDoses(result.text);

  if (!verdict.isSafe) {
    console.warn(
      '[asistente] respuesta bloqueada por dosis insegura:',
      verdict.dangerous.map((finding) => finding.excerpt),
    );
    // Se guarda la corregida, no la peligrosa: el historial que después lee el
    // modelo no debe contener nunca la dosis que bloqueamos.
    const corregida = blockedAnswer();
    if (activeRecipeId !== null) {
      await saveExchange({
        recipeId: activeRecipeId,
        visitorId,
        userId,
        question: lastTurn?.text ?? '',
        answer: corregida,
      });
    }

    return attachVisitorCookie(
      NextResponse.json({
        text: corregida,
        wasBlocked: true,
        quota: quota?.snapshot ?? null,
        recipeId: activeRecipeId,
      }),
      visitorId,
    );
  }

  if (activeRecipeId !== null) {
    await saveExchange({
      recipeId: activeRecipeId,
      visitorId,
      userId,
      question: lastTurn?.text ?? '',
      answer: result.text,
    });
  }

  return attachVisitorCookie(
    NextResponse.json({
      text: result.text,
      wasBlocked: false,
      quota: quota?.snapshot ?? null,
      recipeId: activeRecipeId,
    }),
    visitorId,
  );
}
