'use client';

import { useEffect, useRef, type ReactNode } from 'react';

import { ANALYTICS_EVENTS, track } from '@/shared/lib';

import { useAssistantChat, type AssistantChatParams } from '../model/useAssistantChat';

import { ChatComposer } from './ChatComposer';
import { MessageBubble } from './MessageBubble';
import { StarterPrompts } from './StarterPrompts';

interface AssistantChatProps extends AssistantChatParams {
  /** `false` cuando se agotó el cupo de fotos del mes. Por defecto, se puede. */
  readonly canSendImages?: boolean;
  /**
   * Una pregunta que llega de fuera del chat — hoy, de los pasos de una receta
   * guiada. Se manda sola en cuanto cambia, para que tocar la duda de un paso
   * lleve directo a la respuesta sin escribir nada.
   */
  readonly pendingPrompt?: string | null;
}

/** El asistente de charcutería, atado a la receta que el usuario está haciendo. */
export function AssistantChat({
  canSendImages = true,
  pendingPrompt = null,
  ...params
}: AssistantChatProps): ReactNode {
  // `recipeTitle` no se pinta todavía: hoy el título ES la primera pregunta,
  // así que una cabecera repetiría palabra por palabra el mensaje de abajo.
  // Gana sentido en la lista de "Mis recetas", donde hay varias que distinguir.
  const { messages, isThinking, error, send } = useAssistantChat(params);
  const hasStarted = messages.length > 0;

  // Se guarda la última pregunta que llegó de fuera para no reenviarla en cada
  // render: sin esta guarda, un re-render cualquiera gastaría otra pregunta
  // del cupo del usuario.
  const lastExternal = useRef<string | null>(null);

  useEffect(() => {
    if (pendingPrompt === null || pendingPrompt === lastExternal.current) {
      return;
    }
    lastExternal.current = pendingPrompt;
    void send(pendingPrompt, null);
  }, [pendingPrompt, send]);

  return (
    <section aria-label="El Charcu, tu maestro charcutero">
      {hasStarted ? null : (
        <StarterPrompts
          isDisabled={isThinking}
          onPick={(prompt) => {
            void send(prompt, null);
          }}
        />
      )}

      {/* `aria-live` para que un lector de pantalla cante la respuesta cuando
          llega, en vez de dejarla en silencio a mitad de la página. */}
      <div className="flex flex-col gap-6 empty:hidden" aria-live="polite">
        {messages.map((message) => (
          <MessageBubble key={message.id} message={message} />
        ))}

        {isThinking ? (
          <div className="flex items-center gap-1.5" aria-label="Pensando">
            <span className="h-2 w-2 animate-pulse rounded-full bg-terracota [animation-delay:0ms]" />
            <span className="h-2 w-2 animate-pulse rounded-full bg-terracota [animation-delay:160ms]" />
            <span className="h-2 w-2 animate-pulse rounded-full bg-terracota [animation-delay:320ms]" />
          </div>
        ) : null}
      </div>

      {error === null ? null : (
        <p
          role="alert"
          className="mt-4 rounded-2xl border border-terracota/35 bg-terracota/5 px-4 py-3 text-sm text-cocoa"
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

      {/*
        El aviso de seguridad se pliega. Sigue estando —es importante y no se
        esconde— pero cuatro líneas de gris pesaban más que la caja de escribir,
        que es lo único que el visitante tiene que hacer aquí.
      */}
      <details
        className="group mt-4"
        onToggle={(event) => {
          if (event.currentTarget.open) {
            track(ANALYTICS_EVENTS.assistantSafetyOpened, {});
          }
        }}
      >
        <summary className="cursor-pointer list-none text-xs text-cocoa/65 transition-colors hover:text-cocoa/70">
          Cómo funciona la seguridad
          <span
            aria-hidden
            className="ml-1 inline-block transition-transform group-open:rotate-90"
          >
            ›
          </span>
        </summary>
        <p className="mt-2 text-xs leading-relaxed text-cocoa/65">
          El Charcu acompaña tu criterio, no lo reemplaza. Nunca recomienda más de 2,5 g
          de sal de cura #1 por kilo, y ante un moho dudoso siempre dice descartar. La
          manipulación higiénica y la decisión final son tuyas.
        </p>
      </details>
    </section>
  );
}
