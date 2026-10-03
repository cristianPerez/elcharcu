/* eslint-disable @next/next/no-img-element -- la foto del usuario es un data URL local, no pasa por el optimizador */
import { type ReactNode } from 'react';

import { type ChatMessage } from '@/entities/charcu-assistant';

import { cn } from '@/shared/lib';
import { IconCharcu } from '@/shared/ui';

import { splitBold, tidyMarkdown } from '../lib/tidyMarkdown';

interface MessageBubbleProps {
  readonly message: ChatMessage;
  /**
   * `app` es el rediseño de la app (2026-10): quien pregunta en burbuja verde
   * y El Charcu sin burbuja, con su avatar. `site` es el de la web pública.
   */
  readonly tone?: 'site' | 'app' | undefined;
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
export function MessageBubble({ message, tone = 'site' }: MessageBubbleProps): ReactNode {
  const isUser = message.role === 'user';
  const wasBlocked = message.wasBlocked === true;

  if (isUser) {
    return (
      <div className="flex justify-end">
        <div
          className={cn(
            'max-w-[85%] rounded-2xl rounded-br-md px-4 py-3 text-base leading-relaxed',
            tone === 'app'
              ? 'bg-forest text-cream-white [&_strong]:text-cream-white'
              : 'bg-cream text-cocoa',
          )}
        >
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

  if (tone === 'app') {
    return (
      <div className="flex gap-3">
        <span
          aria-hidden="true"
          className="mt-0.5 grid size-8 shrink-0 place-items-center rounded-full bg-forest text-brasa"
        >
          <IconCharcu size={14} />
        </span>
        <div
          className={cn(
            'min-w-0 flex-1 text-base leading-[1.65] text-cocoa',
            wasBlocked && 'rounded-card border border-brasa/40 bg-brasa/5 px-4 py-4',
          )}
        >
          <span className="sr-only">El Charcu: </span>
          {wasBlocked ? (
            <p className="mb-2 text-xs font-semibold text-brasa-tinta">
              Respuesta corregida por seguridad
            </p>
          ) : null}
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
