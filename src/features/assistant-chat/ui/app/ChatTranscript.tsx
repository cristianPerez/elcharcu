'use client';

import { useEffect, useRef, type ReactNode } from 'react';

import { type ChatMessage } from '@/entities/charcu-assistant';

import { MessageBubble } from '../MessageBubble';

interface ChatTranscriptProps {
  readonly messages: readonly ChatMessage[];
  readonly isThinking: boolean;
  readonly error: string | null;
}

/**
 * La conversación. `aria-live` para que un lector de pantalla cante la
 * respuesta cuando llega, y baja sola al último mensaje.
 */
export function ChatTranscript({
  messages,
  isThinking,
  error,
}: ChatTranscriptProps): ReactNode {
  const end = useRef<HTMLDivElement>(null);

  useEffect(() => {
    end.current?.scrollIntoView({ block: 'end', behavior: 'smooth' });
  }, [messages.length, isThinking]);

  return (
    <div className="flex flex-col gap-6 py-6">
      <div className="flex flex-col gap-6" aria-live="polite">
        {messages.map((message) => (
          <MessageBubble key={message.id} message={message} tone="app" />
        ))}
        {isThinking ? (
          <div
            className="flex items-center gap-1.5 pl-11"
            role="status"
            aria-label="Pensando"
          >
            <span className="size-2 animate-pulse rounded-full bg-brasa-dark" />
            <span className="size-2 animate-pulse rounded-full bg-brasa-dark [animation-delay:160ms]" />
            <span className="size-2 animate-pulse rounded-full bg-brasa-dark [animation-delay:320ms]" />
          </div>
        ) : null}
      </div>
      {error === null ? null : (
        <p
          role="alert"
          className="rounded-card border border-brasa/40 bg-brasa/5 px-4 py-3 text-sm text-cocoa"
        >
          {error}
        </p>
      )}
      <div ref={end} />
    </div>
  );
}
