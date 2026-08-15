'use client';

import { type ReactNode } from 'react';

import { useAssistantChat, type AssistantChatParams } from '../model/useAssistantChat';

import { ChatComposer } from './ChatComposer';
import { MessageBubble } from './MessageBubble';

interface AssistantChatProps extends AssistantChatParams {
  /** `false` cuando se agotó el cupo de fotos del mes. Por defecto, se puede. */
  readonly canSendImages?: boolean;
}

/** El asistente de charcutería, atado a la receta que el usuario está haciendo. */
export function AssistantChat({
  canSendImages = true,
  ...params
}: AssistantChatProps): ReactNode {
  const { messages, isThinking, error, send } = useAssistantChat(params);

  return (
    <section aria-label="Asistente de charcutería">
      <div className="flex flex-col gap-4">
        {messages.map((message) => (
          <MessageBubble key={message.id} message={message} />
        ))}

        {isThinking ? (
          <div className="flex justify-start">
            <div className="rounded-2xl border border-cream/15 px-5 py-3.5 text-sm text-cream/40">
              Pensando…
            </div>
          </div>
        ) : null}
      </div>

      {error === null ? null : (
        <p
          role="alert"
          className="mt-4 rounded-xl border border-terracota/40 bg-terracota/10 px-4 py-3 text-sm text-cream"
        >
          {error}
        </p>
      )}

      <ChatComposer
        isThinking={isThinking}
        canSendImages={canSendImages}
        onSend={(text, file) => {
          void send(text, file);
        }}
      />

      <p className="mt-4 text-xs leading-relaxed text-cream/40">
        El asistente acompaña tu criterio, no lo reemplaza. Nunca recomienda más de 2,5 g
        de sal de cura #1 por kilo, y ante un moho dudoso siempre dice descartar. La
        manipulación higiénica y la decisión final son tuyas.
      </p>
    </section>
  );
}
