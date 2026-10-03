'use client';

import { useState, type ReactNode } from 'react';

import { cn } from '@/shared/lib';
import { Dialog } from '@/shared/ui';

import { useAssistantChat } from '../../model/useAssistantChat';
import { type ComposerPrefill } from '../../model/useComposer';

import { AppChatHeader } from './AppChatHeader';
import { AppComposer } from './AppComposer';
import { ChatShortcuts } from './ChatShortcuts';
import { ChatTranscript } from './ChatTranscript';
import { ChatWelcome } from './ChatWelcome';
import { RecipeList, type RecipeUsage } from './RecipeList';
import { SafetyLink } from './SafetyLink';

export interface AppChatProps {
  /** Pregunta que se manda sola al llegar (`?pregunta=`, desde una lección). */
  readonly pendingPrompt: string | null;
  /** Texto que se deja ESCRITO sin mandar (`?borrador=`, desde la búsqueda). */
  readonly draft: string | null;
  readonly canSendImages: boolean;
  readonly blockedReason: string | null;
  readonly usage: RecipeUsage | null;
  /** Lo que queda del mes. `null` si no se sabe o ya se acabó. */
  readonly remaining: { readonly questions: number; readonly images: number } | null;
  /** El aviso de cupo que se pinta sobre la caja ("te quedan 2 preguntas"). */
  readonly notice?: ReactNode | undefined;
}

// Fuera del componente: un objeto nuevo en cada render rehacería `send`.
const APP_PARAMS = {};

/** El título provisional, hasta que el servidor escriba el de verdad. */
function provisionalTitle(firstQuestion: string | undefined): string {
  const clean = (firstQuestion ?? '').trim().replace(/\s+/g, ' ');
  return clean.length > 40 ? `${clean.slice(0, 38)}…` : clean || 'Receta sin nombre';
}

/**
 * El asistente de la app (rediseño 2026-10): "receta nueva" con sus cuatro
 * accesos, la conversación, y "Mis recetas" — cajón en el celular, columna
 * fija en escritorio. El motor es el mismo `useAssistantChat` del sitio.
 *
 * El orden de los bloques se decide con CSS para no montar dos cajas de
 * escribir: en el celular la caja va abajo y los accesos en el centro; en
 * escritorio, con el chat en blanco, la caja sube bajo el saludo.
 */
export function AppChat({
  pendingPrompt,
  draft,
  canSendImages,
  blockedReason,
  usage,
  remaining,
  notice,
}: AppChatProps): ReactNode {
  const chat = useAssistantChat(APP_PARAMS, pendingPrompt);
  const [menuOpen, setMenuOpen] = useState(false);
  const [prefill, setPrefill] = useState<ComposerPrefill | null>(
    draft === null ? null : { text: draft, nonce: 0 },
  );
  const hasStarted = chat.messages.length > 0;
  const title = hasStarted
    ? (chat.recipeTitle ??
      provisionalTitle(chat.messages.find((m) => m.role === 'user')?.content))
    : 'Receta nueva';

  const startNew = (): void => {
    chat.startNewRecipe();
    setMenuOpen(false);
  };
  const list = (
    <RecipeList
      currentId={chat.currentRecipeId}
      refreshKey={`${chat.currentRecipeId ?? ''}|${chat.recipeTitle ?? ''}`}
      usage={usage}
      onPick={(id) => {
        void chat.openRecipe(id);
        setMenuOpen(false);
      }}
      onNew={startNew}
    />
  );

  return (
    <div className="lg:grid lg:grid-cols-[280px_minmax(0,1fr)]">
      <aside className="sticky top-[72px] hidden h-[calc(100dvh-72px)] border-r border-cocoa/10 bg-cream-white lg:block">
        {list}
      </aside>
      <Dialog
        open={menuOpen}
        onClose={() => {
          setMenuOpen(false);
        }}
        title="Mis recetas"
        placement="left"
      >
        {menuOpen ? list : null}
      </Dialog>

      <div className="flex min-h-[calc(100dvh-4rem)] flex-col md:min-h-[calc(100dvh-72px)]">
        <AppChatHeader
          title={title}
          hasStarted={hasStarted}
          onOpenMenu={() => {
            setMenuOpen(true);
          }}
          onNew={startNew}
        />
        <div
          className={cn(
            'mx-auto flex w-full max-w-[760px] flex-1 flex-col px-4 md:px-8',
            !hasStarted && 'lg:justify-center lg:gap-6',
          )}
        >
          {hasStarted ? (
            <div className="order-1 flex-1">
              <ChatTranscript
                messages={chat.messages}
                isThinking={chat.isThinking}
                error={chat.error}
              />
            </div>
          ) : (
            <>
              <div className="order-1 mb-6 mt-auto lg:my-0">
                <ChatWelcome />
              </div>
              <div className="order-2 mb-auto lg:order-3 lg:mb-0">
                <ChatShortcuts
                  canSendImages={canSendImages}
                  onPick={(next) => {
                    setPrefill({ ...next, nonce: Date.now() });
                  }}
                />
              </div>
            </>
          )}

          <div
            className={cn(
              'sticky bottom-[calc(4rem+env(safe-area-inset-bottom))] order-3 bg-cream pb-1 pt-3 md:bottom-0',
              !hasStarted && 'lg:static lg:order-2 lg:pt-0',
            )}
          >
            {notice}
            <AppComposer
              isThinking={chat.isThinking}
              canSendImages={canSendImages}
              blockedReason={blockedReason}
              placeholder={
                hasStarted ? 'Pregunta sobre esta receta…' : 'Escribe tu duda o la pieza…'
              }
              prefill={prefill}
              onSend={(text, file) => {
                void chat.send(text, file);
                return true;
              }}
            />
            <div
              className={cn(
                'flex items-center justify-between gap-3 px-1',
                !hasStarted && 'lg:justify-center',
              )}
            >
              <SafetyLink />
              {remaining === null ? null : (
                <p className="whitespace-nowrap text-[13px] text-cocoa-soft">
                  {remaining.questions} preguntas · {remaining.images} fotos
                  <span className="hidden md:inline"> este mes</span>
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
