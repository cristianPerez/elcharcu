/* eslint-disable @next/next/no-img-element -- la foto del usuario es un data URL local, no pasa por el optimizador */
import { type ReactNode } from 'react';

import { type ChatMessage } from '@/entities/charcu-assistant';

import { cn } from '@/shared/lib';

import { splitBold, tidyMarkdown } from '../lib/tidyMarkdown';

interface MessageBubbleProps {
  readonly message: ChatMessage;
}

export function MessageBubble({ message }: MessageBubbleProps): ReactNode {
  const isUser = message.role === 'user';

  return (
    <div className={cn('flex', isUser ? 'justify-end' : 'justify-start')}>
      <div
        className={cn(
          'max-w-[85%] rounded-2xl px-5 py-3.5 text-sm leading-relaxed',
          isUser
            ? 'bg-cream text-cocoa'
            : message.wasBlocked === true
              ? 'border border-terracota/50 bg-terracota/10 text-cream'
              : 'border border-cream/15 text-cream/90',
        )}
      >
        {message.imageDataUrl === undefined ? null : (
          <img
            src={message.imageDataUrl}
            alt="Foto que enviaste al asistente"
            className="mb-3 max-h-64 w-full rounded-xl object-cover"
          />
        )}

        {message.wasBlocked === true ? (
          <p className="mb-2 text-xs uppercase tracking-eyebrow text-terracota">
            Respuesta corregida por seguridad
          </p>
        ) : null}

        <p className="whitespace-pre-wrap">
          {splitBold(tidyMarkdown(message.content)).map((chunk, index) =>
            chunk.isBold ? (
              <strong key={index} className="font-semibold">
                {chunk.text}
              </strong>
            ) : (
              <span key={index}>{chunk.text}</span>
            ),
          )}
        </p>
      </div>
    </div>
  );
}
