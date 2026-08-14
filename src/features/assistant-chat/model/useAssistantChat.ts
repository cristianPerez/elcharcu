'use client';

import { useCallback, useState } from 'react';

import { type ChatMessage } from '@/entities/charcu-assistant';
import { incrementImages, incrementQuestions } from '@/entities/usage-quota';

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

function greeting(product: string): ChatMessage {
  return {
    id: 'saludo',
    role: 'assistant',
    content: `Vamos con tu ${product.toLowerCase()}. Cuéntame cuántos kilos de carne tienes y a qué temperatura y humedad está el lugar donde lo vas a colgar. Si ya lo tienes colgado y algo no te cuadra, mándame una foto.`,
  };
}

/** El chat con el asistente. Toda la llamada a la IA pasa por el servidor. */
export function useAssistantChat(params: AssistantChatParams): AssistantChatController {
  const [messages, setMessages] = useState<readonly ChatMessage[]>([
    greeting(params.product),
  ]);
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

      // Incrementar contadores de uso
      incrementQuestions();
      if (file !== null) {
        incrementImages();
      }

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
      });

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
          if (response.status === 429) {
            setError(
              'El asistente descansa hasta mañana: hoy ya atendió a mucha gente. Escríbenos por WhatsApp si es urgente.',
            );
            track(ANALYTICS_EVENTS.aiBudgetExhausted, { recipe: params.product });
            return;
          }

          setError(
            response.status === 503
              ? 'El asistente todavía no está conectado.'
              : 'No pude responder ahora mismo. Inténtalo otra vez en un momento.',
          );
          return;
        }

        const answer: ApiAnswer = (await response.json()) as ApiAnswer;
        if (typeof answer.text !== 'string') {
          setError('Me llegó una respuesta vacía. Vuelve a preguntarme.');
          return;
        }

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
      } finally {
        setIsThinking(false);
      }
    },
    [isThinking, messages, params],
  );

  return { messages, isThinking, error, send };
}
