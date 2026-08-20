'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

import { type ChatMessage } from '@/entities/charcu-assistant';
import { publishQuotaFrom } from '@/entities/usage-quota';

import { ANALYTICS_EVENTS, track } from '@/shared/lib';

import {
  activeRecipeId,
  clearActiveRecipe,
  rememberActiveRecipe,
} from '../lib/activeChat';
import { recallChat, rememberChat } from '../lib/chatMemory';

export interface AssistantChatParams {
  readonly product: string;
  readonly level: string;
  readonly country: string;
}

export interface AssistantChatController {
  readonly messages: readonly ChatMessage[];
  readonly isThinking: boolean;
  readonly error: string | null;
  /** El nombre de la receta abierta, si hay una. */
  readonly recipeTitle: string | null;
  readonly send: (text: string, file: File | null) => Promise<void>;
  /** Salta a una conversación del historial. */
  readonly openRecipe: (id: string) => Promise<void>;
  /** Deja el chat en blanco: la siguiente pregunta abre receta nueva. */
  readonly startNewRecipe: () => void;
}

interface StoredRecipe {
  readonly recipeId?: unknown;
  readonly title?: unknown;
  readonly messages?: unknown;
}

/** Lo que devuelve `/api/receta`, validado antes de creerlo. */
function parseHistory(value: unknown): readonly ChatMessage[] {
  if (!Array.isArray(value)) {
    return [];
  }

  return value.flatMap((row: unknown): ChatMessage[] => {
    if (typeof row !== 'object' || row === null) {
      return [];
    }
    const { id, role, content } = row as Record<string, unknown>;
    if (typeof id !== 'string' || typeof content !== 'string') {
      return [];
    }
    return [{ id, role: role === 'user' ? 'user' : 'assistant', content }];
  });
}

/**
 * Qué decirle cuando el servidor le cierra la puerta, según el motivo.
 *
 * Ya no hay entrada para `recetas`: desde el 2026-08-20 las recetas se cuentan
 * pero no topan en ningún plan. Si alguna vez volviera a llegar ese motivo,
 * cae en el texto genérico de más abajo en vez de prometer una regla que no
 * existe — que es justo el fallo que tuvo el texto anterior.
 */
const SIN_CUPO: Record<string, string> = {
  preguntas:
    'Se acabaron tus preguntas de este mes. Abajo te dejo los planes — tu cupo vuelve a cero el mes que viene, pagues o no.',
  fotos:
    'Se acabaron tus fotos de este mes. Puedes seguir preguntando por texto sin problema.',
};

interface ApiAnswer {
  readonly text?: unknown;
  readonly wasBlocked?: unknown;
  /** El cupo que queda tras esta pregunta, tal como lo contó la base. */
  readonly quota?: unknown;
  /** La receta de esta conversación. La crea el servidor con la 1ª pregunta. */
  readonly recipeId?: unknown;
  /** Cuál de los topes cerró la puerta: `preguntas`, `fotos` o `recetas`. */
  readonly deniedBy?: unknown;
}

function createId(): string {
  return typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function'
    ? crypto.randomUUID()
    : `m-${String(Date.now())}-${String(Math.random()).slice(2, 8)}`;
}

function readFileAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      resolve(typeof reader.result === 'string' ? reader.result : '');
    };
    reader.onerror = () => {
      reject(new Error('no se pudo leer la imagen'));
    };
    reader.readAsDataURL(file);
  });
}

/**
 * El chat con el asistente. Toda la llamada a la IA pasa por el servidor.
 *
 * `externalPrompt` es una duda que llega de fuera del chat — hoy, la pregunta
 * de una lección. Se maneja AQUÍ y no en el componente porque hay que decidir
 * antes de nada si se retoma la conversación abierta o se abre un hilo nuevo,
 * y desde fuera esas dos cosas competían: el envío salía antes de que la
 * conversación terminara de cargarse, así que el `recipeId` iba vacío y se
 * abría receta nueva de todas formas — pero por accidente, y a veces por
 * duplicado.
 */
export function useAssistantChat(
  params: AssistantChatParams,
  externalPrompt: string | null = null,
): AssistantChatController {
  // Arranca VACÍO. Antes abría con un saludo de seis líneas que explicaba qué
  // escribir; ahora esa explicación son cuatro preguntas de ejemplo que se
  // tocan, y el asistente pregunta lo que le falte cuando le falte.
  const [messages, setMessages] = useState<readonly ChatMessage[]>([]);
  const [isThinking, setIsThinking] = useState(false);

  /**
   * La misma lista, en una ref.
   *
   * `send` la necesita para armar el historial que va al modelo, y leerla del
   * estado significaba leer el de HACE UN RENDER. Se notaba justo aquí:
   * empezar un hilo nuevo y mandar en el mismo tirón le colaba al modelo la
   * conversación anterior, porque el `setMessages([])` todavía no había
   * llegado.
   */
  const messagesRef = useRef<readonly ChatMessage[]>([]);
  const replaceMessages = useCallback((next: readonly ChatMessage[]): void => {
    messagesRef.current = next;
    setMessages(next);
  }, []);
  const [error, setError] = useState<string | null>(null);

  // La receta a la que pertenece esta conversación. Vacía al empezar: la
  // primera pregunta la crea en el servidor y aquí solo se guarda el id para
  // que las siguientes vayan a la misma y no abran una nueva cada vez.
  const recipeId = useRef<string | null>(null);
  const [recipeTitle, setRecipeTitle] = useState<string | null>(null);

  /**
   * Trae una conversación concreta y la pinta.
   *
   * Sirve para tres cosas distintas que son la misma: retomar la que estaba
   * abierta al cargar, y saltar a otra desde el historial.
   */
  const openRecipe = useCallback(
    async (id: string): Promise<void> => {
      const recordado = recallChat();
      // Si es la que ya está en memoria, no se vuelve a pedir. Abrir el
      // historial y volver a la misma no es motivo para otro viaje a la base.
      if (recordado !== null && recordado.recipeId === id) {
        recipeId.current = id;
        setRecipeTitle(recordado.title);
        replaceMessages(recordado.messages);
        return;
      }

      try {
        const response = await fetch(`/api/receta?id=${encodeURIComponent(id)}`, {
          cache: 'no-store',
        });
        if (!response.ok) {
          return;
        }
        const data = (await response.json()) as StoredRecipe;
        if (typeof data.recipeId !== 'string' || data.recipeId === '') {
          // El servidor no la reconoce como suya: se suelta en vez de insistir.
          clearActiveRecipe();
          return;
        }

        const historial = parseHistory(data.messages);
        const titulo = typeof data.title === 'string' ? data.title : null;

        recipeId.current = data.recipeId;
        setRecipeTitle(titulo);
        replaceMessages(historial);
        setError(null);
        rememberActiveRecipe(data.recipeId);
        rememberChat({ recipeId: data.recipeId, title: titulo, messages: historial });
      } catch {
        // Sin historial se empieza en blanco: molesto, no roto.
      }
    },
    [replaceMessages],
  );

  /** Deja el chat en blanco. La siguiente pregunta abrirá una receta nueva. */
  const startNewRecipe = useCallback((): void => {
    recipeId.current = null;
    setRecipeTitle(null);
    replaceMessages([]);
    setError(null);
    clearActiveRecipe();
    rememberChat({ recipeId: null, title: null, messages: [] });
  }, [replaceMessages]);

  /**
   * Una duda que llega de una lección abre SIEMPRE un hilo aparte.
   *
   * Se decide en el primer render y se guarda en una ref, para que los dos
   * efectos de abajo no se peleen: o se retoma lo que había, o se empieza de
   * cero, nunca las dos cosas.
   */
  const isFromLesson = useRef(externalPrompt !== null);

  /**
   * Al cargar: se retoma la conversación abierta, si la hay.
   *
   * `activeRecipeId()` devuelve `null` cuando pasó más de una hora desde el
   * último mensaje o cuando se cerró la pestaña, y entonces se empieza en
   * blanco. Eso NO es un fallo: es la regla de sesión que pidió Cristian
   * (2026-08-20).
   */
  useEffect(() => {
    if (isFromLesson.current) {
      // Viene de una lección: la duda del curso no se mezcla con lo que
      // estuvieras hablando. Se deja el chat limpio y el efecto de abajo la
      // manda en un hilo nuevo.
      clearActiveRecipe();
      return;
    }

    const abierta = activeRecipeId();
    if (abierta === null) {
      return;
    }
    void openRecipe(abierta);
  }, [openRecipe]);

  const send = useCallback(
    async (text: string, file: File | null): Promise<void> => {
      const trimmed = text.trim();
      if ((trimmed === '' && file === null) || isThinking) {
        return;
      }

      setError(null);
      setIsThinking(true);
      const startedAt = Date.now();

      // El cupo ya no se cuenta aquí: lo descuenta el servidor antes de llamar
      // a Gemini, y nos devuelve cómo quedó. El navegador solo lo muestra.
      const dataUrl = file === null ? '' : await readFileAsDataUrl(file);
      const userMessage: ChatMessage = {
        id: createId(),
        role: 'user',
        content: trimmed === '' ? 'Mira esta foto, por favor.' : trimmed,
        imageDataUrl: dataUrl === '' ? undefined : dataUrl,
      };

      const history = [...messagesRef.current, userMessage];
      replaceMessages(history);

      track(ANALYTICS_EVENTS.assistantMessageSent, {
        recipe: params.product,
        with_photo: file !== null,
        // Cuántos turnos lleva la conversación: mide si de verdad conversan
        // o si preguntan una vez y se van.
        turn: history.length,
        characters: trimmed.length,
      });

      if (file !== null) {
        track(ANALYTICS_EVENTS.assistantPhotoAttached, {
          recipe: params.product,
          size_kb: Math.round(file.size / 1024),
        });
      }

      const turns = history.map((message) => {
        const base = {
          role: message.role === 'user' ? ('user' as const) : ('model' as const),
          text: message.content,
        };

        if (message.imageDataUrl === undefined) {
          return base;
        }

        const [header = '', body = ''] = message.imageDataUrl.split(',');
        const mimeType = header.slice(header.indexOf(':') + 1, header.indexOf(';'));
        return { ...base, image: { mimeType, base64: body } };
      });

      try {
        const response = await fetch('/api/asistente', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...params, turns, recipeId: recipeId.current }),
        });

        if (!response.ok) {
          if (response.status === 402) {
            // Se acabó el cupo. Se publica para que la portada levante el muro,
            // y se DICE cuál se acabó: antes esto se quedaba en silencio y el
            // usuario veía su pregunta sin respuesta y sin explicación, que es
            // el peor final posible.
            const spent: ApiAnswer = (await response.json()) as ApiAnswer;
            publishQuotaFrom(spent.quota);

            const motivo = typeof spent.deniedBy === 'string' ? spent.deniedBy : '';
            setError(
              SIN_CUPO[motivo] ??
                'Se acabó tu cupo de este mes. Mira los planes para seguir.',
            );
            track(ANALYTICS_EVENTS.assistantFailed, {
              reason: 'sin-cupo',
              denied_by: motivo,
              recipe: params.product,
            });
            return;
          }

          if (response.status === 429) {
            setError(
              'El asistente descansa hasta mañana: hoy ya atendió a mucha gente. Escríbenos por WhatsApp si es urgente.',
            );
            track(ANALYTICS_EVENTS.aiBudgetExhausted, { recipe: params.product });
            track(ANALYTICS_EVENTS.assistantFailed, {
              reason: 'sin-presupuesto',
              recipe: params.product,
            });
            return;
          }

          setError(
            response.status === 503
              ? 'El asistente todavía no está conectado.'
              : 'No pude responder ahora mismo. Inténtalo otra vez en un momento.',
          );
          track(ANALYTICS_EVENTS.assistantFailed, {
            reason: String(response.status),
            recipe: params.product,
          });
          return;
        }

        const answer: ApiAnswer = (await response.json()) as ApiAnswer;
        publishQuotaFrom(answer.quota);

        if (typeof answer.recipeId === 'string' && answer.recipeId !== '') {
          recipeId.current = answer.recipeId;
          // Cada respuesta reinicia la hora de inactividad: mientras se
          // conversa, la sesión sigue viva.
          rememberActiveRecipe(answer.recipeId);
        }

        if (typeof answer.text !== 'string') {
          setError('Me llegó una respuesta vacía. Vuelve a preguntarme.');
          track(ANALYTICS_EVENTS.assistantFailed, {
            reason: 'respuesta-vacia',
            recipe: params.product,
          });
          return;
        }

        // El tiempo de respuesta es la métrica de producto que más importa
        // aquí: si sube, la gente deja de preguntar aunque conteste bien.
        track(ANALYTICS_EVENTS.assistantAnswerReceived, {
          recipe: params.product,
          with_photo: file !== null,
          seconds: Math.round((Date.now() - startedAt) / 100) / 10,
          was_blocked: answer.wasBlocked === true,
        });

        const conversacion: readonly ChatMessage[] = [
          ...history,
          {
            id: createId(),
            role: 'assistant',
            content: answer.text,
            wasBlocked: answer.wasBlocked === true,
          },
        ];
        replaceMessages(conversacion);

        // Se guarda en memoria lo que ya está escrito en la base, para que
        // volver a esta pestaña no obligue a ir a buscarlo otra vez.
        rememberChat({
          recipeId: recipeId.current,
          title: recipeTitle,
          messages: conversacion,
        });

        if (answer.wasBlocked === true) {
          track(ANALYTICS_EVENTS.unsafeDoseBlocked, { recipe: params.product });
        }
      } catch {
        setError('Se cayó la conexión. Inténtalo otra vez.');
        track(ANALYTICS_EVENTS.assistantFailed, {
          reason: 'conexion',
          recipe: params.product,
        });
      } finally {
        setIsThinking(false);
      }
    },
    [isThinking, params, recipeTitle, replaceMessages],
  );

  /**
   * Manda la duda que llegó de fuera, UNA sola vez.
   *
   * La guarda de la ref no es un detalle: la pregunta viaja en la URL
   * (`/charcu?pregunta=…`), así que cada vez que esta pantalla se montaba se
   * volvía a mandar. Pasó de verdad — tres recetas idénticas, "Especias para
   * bondiola", y tres preguntas del cupo gastadas por volver a la misma
   * lección (2026-08-20).
   */
  const lastExternal = useRef<string | null>(null);

  useEffect(() => {
    if (externalPrompt === null || externalPrompt === lastExternal.current) {
      return;
    }
    lastExternal.current = externalPrompt;
    void send(externalPrompt, null);
  }, [externalPrompt, send]);

  return { messages, isThinking, error, recipeTitle, send, openRecipe, startNewRecipe };
}
