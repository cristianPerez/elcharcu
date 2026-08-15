'use client';

import { useCallback, useState } from 'react';

import { type ChatMessage } from '@/entities/charcu-assistant';
import { publishQuotaFrom } from '@/entities/usage-quota';

import { ANALYTICS_EVENTS, track } from '@/shared/lib';

export interface AssistantChatParams {
  readonly product: string;
  readonly level: string;
  readonly country: string;
}

export interface AssistantChatController {
  readonly messages: readonly ChatMessage[];
  readonly isThinking: boolean;
  readonly error: string | null;
  readonly send: (text: string, file: File | null) => Promise<void>;
}

interface ApiAnswer {
  readonly text?: unknown;
  readonly wasBlocked?: unknown;
  /** El cupo que queda tras esta pregunta, tal como lo contó la base. */
  readonly quota?: unknown;
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

/** El chat con el asistente. Toda la llamada a la IA pasa por el servidor. */
export function useAssistantChat(params: AssistantChatParams): AssistantChatController {
  // Arranca VACÍO. Antes abría con un saludo de seis líneas que explicaba qué
  // escribir; ahora esa explicación son cuatro preguntas de ejemplo que se
  // tocan, y el asistente pregunta lo que le falte cuando le falte.
  const [messages, setMessages] = useState<readonly ChatMessage[]>([]);
  const [isThinking, setIsThinking] = useState(false);
  const [error, setError] = useState<string | null>(null);

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

      const history = [...messages, userMessage];
      setMessages(history);

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
          body: JSON.stringify({ ...params, turns }),
        });

        if (!response.ok) {
          if (response.status === 402) {
            // Se acabó el cupo. Se publica el cupo que devuelve el servidor
            // para que la portada levante el muro sin preguntar otra vez.
            const spent: ApiAnswer = (await response.json()) as ApiAnswer;
            publishQuotaFrom(spent.quota);
            track(ANALYTICS_EVENTS.assistantFailed, {
              reason: 'sin-cupo',
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

        setMessages([
          ...history,
          {
            id: createId(),
            role: 'assistant',
            content: answer.text,
            wasBlocked: answer.wasBlocked === true,
          },
        ]);

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
    [isThinking, messages, params],
  );

  return { messages, isThinking, error, send };
}
