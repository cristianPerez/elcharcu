'use client';

import { useState, type ReactNode } from 'react';

import { ANALYTICS_EVENTS, track } from '@/shared/lib';

import { useAssistantChat, type AssistantChatParams } from '../model/useAssistantChat';

import { ChatComposer } from './ChatComposer';
import { ChatHistoryDrawer } from './ChatHistoryDrawer';
import { MessageBubble } from './MessageBubble';
import { StarterPrompts } from './StarterPrompts';

interface AssistantChatProps extends AssistantChatParams {
  /** `false` cuando se agotó el cupo de fotos del mes. Por defecto, se puede. */
  readonly canSendImages?: boolean;
  /** Por qué no se puede preguntar hoy. `null` = se puede. */
  readonly blockedReason?: string | null;
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
  blockedReason = null,
  pendingPrompt = null,
  ...params
}: AssistantChatProps): ReactNode {
  const { messages, isThinking, error, send, recipeTitle, openRecipe, startNewRecipe } =
    useAssistantChat(params, pendingPrompt);
  const hasStarted = messages.length > 0;
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);

  return (
    <section aria-label="El Charcu, tu maestro charcutero">
      {/*
        La cabecera va SIEMPRE, también con el chat en blanco.
        Estuvo escondida en el estado vacío durante medio día y era un error:
        justo cuando no tienes nada delante es cuando quieres llegar a lo que
        hablaste antes. Esconder la puerta al historial precisamente ahí deja
        al usuario creyendo que perdió sus conversaciones.
      */}
      <header className="mb-4 flex items-center gap-2 border-b border-cocoa/10 pb-3">
        <button
          type="button"
          onClick={() => {
            setIsHistoryOpen(true);
          }}
          aria-label="Ver tus recetas"
          className="flex size-9 shrink-0 flex-col items-center justify-center gap-[3px] rounded-lg transition-colors active:bg-cream"
        >
          <span aria-hidden="true" className="h-0.5 w-4 rounded-full bg-cocoa/60" />
          <span aria-hidden="true" className="h-0.5 w-4 rounded-full bg-cocoa/60" />
          <span aria-hidden="true" className="h-0.5 w-4 rounded-full bg-cocoa/60" />
        </button>

        <h2 className="min-w-0 flex-1 truncate text-sm font-medium text-cocoa/70">
          {recipeTitle ?? (hasStarted ? 'Receta sin nombre' : 'Receta nueva')}
        </h2>

        {/* "Nueva" solo cuando hay algo que dejar atrás: en un chat en blanco
            sería un botón que no hace nada. */}
        {hasStarted ? (
          <button
            type="button"
            onClick={startNewRecipe}
            className="shrink-0 rounded-full border border-cocoa/15 px-3 py-1.5 text-xs font-medium text-cocoa/70 transition-colors active:bg-cream"
          >
            Nueva
          </button>
        ) : null}
      </header>

      <ChatHistoryDrawer
        isOpen={isHistoryOpen}
        onClose={() => {
          setIsHistoryOpen(false);
        }}
        currentRecipeId={null}
        onPick={(id) => {
          void openRecipe(id);
        }}
        onNew={startNewRecipe}
      />

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
        blockedReason={blockedReason}
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
