/* eslint-disable @next/next/no-img-element -- la foto del usuario es un data URL local, no pasa por el optimizador */
import { type ReactNode } from 'react';

import { type ChatMessage } from '@/entities/charcu-assistant';

import { cn } from '@/shared/lib';

import { splitBold, tidyMarkdown } from '../lib/tidyMarkdown';

interface MessageBubbleProps {
  readonly message: ChatMessage;
}

function Formatted({ content }: { readonly content: string }): ReactNode {
  return (
    <p className="whitespace-pre-wrap">
      {splitBold(tidyMarkdown(content)).map((chunk, index) =>
        chunk.isBold ? (
          <strong key={index} className="font-semibold">
            {chunk.text}
          </strong>
        ) : (
          <span key={index}>{chunk.text}</span>
        ),
      )}
    </p>
  );
}

/**
 * Un turno de la conversación, con el reparto que la gente ya conoce:
 * lo que escribe el usuario va en una burbuja a la derecha, y lo que responde
 * el asistente va suelto, a todo lo ancho y sin caja.
 *
 * Esa asimetría no es un descuido: la respuesta suele ser larga y con listas,
 * y encerrarla en una burbuja la vuelve una columna estrecha e incómoda de
 * leer. Es la misma razón por la que ChatGPT lo hace así.
 */
export function MessageBubble({ message }: MessageBubbleProps): ReactNode {
  const isUser = message.role === 'user';
  const wasBlocked = message.wasBlocked === true;

  if (isUser) {
    return (
      <div className="flex justify-end">
        <div className="max-w-[80%] rounded-3xl rounded-br-lg bg-cream px-5 py-3 text-sm leading-relaxed text-cocoa">
          {message.imageDataUrl === undefined ? null : (
            <img
              src={message.imageDataUrl}
              alt="Foto que enviaste al asistente"
              className="mb-3 max-h-64 w-full rounded-2xl object-cover"
            />
          )}
          <Formatted content={message.content} />
        </div>
      </div>
    );
  }

  return (
    <div
      className={cn(
        'text-sm leading-relaxed text-cream/90',
        wasBlocked && 'rounded-2xl border border-terracota/50 bg-terracota/10 px-5 py-4',
      )}
    >
      {wasBlocked ? (
        <p className="mb-2 text-xs uppercase tracking-eyebrow text-terracota">
          Respuesta corregida por seguridad
        </p>
      ) : null}

      <Formatted content={message.content} />
    </div>
  );
}
