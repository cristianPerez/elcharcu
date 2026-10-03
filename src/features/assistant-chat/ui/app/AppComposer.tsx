'use client';

import { type ReactNode } from 'react';

import { cn } from '@/shared/lib';
import { IconCamera, IconClose, IconSend } from '@/shared/ui';

import { useComposer, type ComposerPrefill } from '../../model/useComposer';

interface AppComposerProps {
  readonly isThinking: boolean;
  readonly canSendImages: boolean;
  readonly blockedReason: string | null;
  readonly placeholder: string;
  readonly prefill: ComposerPrefill | null;
  readonly onSend: (text: string, file: File | null) => boolean;
}

/**
 * La caja de escribir de la app: una pastilla con la cámara a la izquierda y
 * el envío a la derecha. Misma lógica que la del sitio (`useComposer`).
 */
export function AppComposer({
  isThinking,
  canSendImages,
  blockedReason,
  placeholder,
  prefill,
  onSend,
}: AppComposerProps): ReactNode {
  const c = useComposer({ isThinking, onSend, prefill });
  const canSend = !isThinking && !c.isEmpty;

  return (
    <form onSubmit={c.handleSubmit} aria-label="Escribir a El Charcu">
      <div className="rounded-[28px] border border-cocoa/15 bg-cream-white p-1.5 transition-colors focus-within:border-forest">
        {c.file === null ? null : (
          <div className="m-1 mb-2 flex items-center justify-between gap-3 rounded-2xl bg-cream px-4 py-2 text-sm text-cocoa-soft">
            <span className="truncate">{c.file.name}</span>
            <button
              type="button"
              onClick={c.clearFile}
              aria-label="Quitar la foto"
              className="grid size-11 shrink-0 place-items-center rounded-full hover:bg-cream-muted"
            >
              <IconClose size={16} />
            </button>
          </div>
        )}
        <div className="flex items-end gap-1.5">
          <label
            className={cn(
              'grid size-11 shrink-0 place-items-center rounded-full bg-cream text-cocoa',
              canSendImages
                ? 'cursor-pointer focus-within:ring-2 focus-within:ring-forest hover:bg-cream-muted'
                : 'cursor-not-allowed opacity-40',
            )}
          >
            <IconCamera size={19} />
            <span className="sr-only">
              {canSendImages ? 'Adjuntar una foto' : 'Se acabaron tus fotos del mes'}
            </span>
            <input
              ref={c.fileInput}
              type="file"
              accept="image/*"
              disabled={!canSendImages}
              className="sr-only"
              onChange={(event) => {
                c.setFile(event.target.files?.[0] ?? null);
              }}
            />
          </label>
          <label className="min-w-0 flex-1">
            <span className="sr-only">Tu pregunta</span>
            <textarea
              ref={c.textarea}
              value={c.text}
              onChange={(event) => {
                c.setText(event.target.value);
              }}
              onKeyDown={c.handleKeyDown}
              rows={1}
              disabled={blockedReason !== null}
              placeholder={blockedReason ?? placeholder}
              className="block max-h-[200px] w-full resize-none bg-transparent px-1 py-2.5 text-base leading-relaxed text-cocoa placeholder:text-cocoa-muted focus:outline-none disabled:cursor-not-allowed"
            />
          </label>
          <button
            type="submit"
            disabled={!canSend}
            aria-label="Enviar"
            className={cn(
              'grid size-11 shrink-0 place-items-center rounded-full transition-colors',
              canSend
                ? 'bg-brasa text-cocoa hover:bg-brasa-dark'
                : 'bg-cream-muted text-cocoa-muted',
            )}
          >
            <IconSend size={19} strokeWidth={2} />
          </button>
        </div>
      </div>
    </form>
  );
}
