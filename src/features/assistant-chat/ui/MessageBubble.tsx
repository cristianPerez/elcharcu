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
          <strong key={index} className="font-semibold text-cocoa">
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
 * Un turno de la conversación, sobre superficie clara.
 *
 * Lo que escribe el usuario va en burbuja a la derecha; lo que responde el
 * asistente va suelto y a todo lo ancho. La respuesta trae listas y cifras, y
 * encerrarla en una burbuja la vuelve una columna incómoda de leer.
 *
 * La burbuja usa `cream` sobre la tarjeta `cream-white`: el tercer nivel de
 * profundidad sale de la propia paleta, sin inventar un gris.
 */
export function MessageBubble({ message }: MessageBubbleProps): ReactNode {
  const isUser = message.role === 'user';
  const wasBlocked = message.wasBlocked === true;

  if (isUser) {
    return (
      <div className="flex justify-end">
        <div className="max-w-[85%] rounded-2xl rounded-br-md bg-cream px-4 py-3 text-base leading-relaxed text-cocoa">
          {message.imageDataUrl === undefined ? null : (
            <img
              src={message.imageDataUrl}
              alt="Foto que enviaste al asistente"
              className="mb-3 max-h-64 w-full rounded-xl object-cover"
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
        'text-base leading-[1.65] text-cocoa/80',
        wasBlocked && 'rounded-2xl border border-terracota/35 bg-terracota/5 px-4 py-4',
      )}
    >
      {wasBlocked ? (
        <p className="mb-2 text-xs font-medium text-terracota-dark">
          Respuesta corregida por seguridad
        </p>
      ) : null}

      <Formatted content={message.content} />
    </div>
  );
}
