import { NextResponse, type NextRequest } from 'next/server';

import { buildSystemPrompt } from '@/entities/charcu-assistant';
import { auditCureDoses, MAX_CURE_1_G_PER_KG } from '@/entities/cure-safety';

import { generateAnswer, type GeminiTurn } from '@/shared/api/gemini';

/** Tope de la imagen en base64 (~3 MB de foto). */
const MAX_IMAGE_CHARS = 4_000_000;
const MAX_TURNS = 30;

interface AssistantRequest {
  readonly product: string;
  readonly level: string;
  readonly country: string;
  readonly turns: readonly GeminiTurn[];
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

  const { product, level, country, turns } = value as {
    product?: unknown;
    level?: unknown;
    country?: unknown;
    turns?: unknown;
  };

  if (
    typeof product !== 'string' ||
    typeof level !== 'string' ||
    typeof country !== 'string' ||
    !Array.isArray(turns) ||
    turns.length === 0
  ) {
    return null;
  }

  const parsed = turns
    .slice(-MAX_TURNS)
    .map((turn: unknown) => parseTurn(turn))
    .filter((turn): turn is GeminiTurn => turn !== null);

  return parsed.length === 0 ? null : { product, level, country, turns: parsed };
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

export async function POST(request: NextRequest): Promise<NextResponse> {
  const payload: unknown = await request.json().catch(() => null);
  const parsed = parseRequest(payload);

  if (parsed === null) {
    return NextResponse.json({ error: 'peticion-invalida' }, { status: 400 });
  }

  const systemPrompt = buildSystemPrompt({
    product: parsed.product,
    level: parsed.level,
    country: parsed.country,
  });

  const result = await generateAnswer(systemPrompt, parsed.turns);

  if (!result.ok) {
    const status = result.reason === 'sin-clave' ? 503 : 502;
    return NextResponse.json({ error: result.reason }, { status });
  }

  // Segunda barrera: se revisa la respuesta antes de que la vea nadie.
  const verdict = auditCureDoses(result.text);

  if (!verdict.isSafe) {
    console.warn(
      '[asistente] respuesta bloqueada por dosis insegura:',
      verdict.dangerous.map((finding) => finding.excerpt),
    );
    return NextResponse.json({ text: blockedAnswer(), wasBlocked: true });
  }

  return NextResponse.json({ text: result.text, wasBlocked: false });
}
