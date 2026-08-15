'use client';

import {
  useEffect,
  useRef,
  useState,
  type FormEvent,
  type KeyboardEvent,
  type ReactNode,
} from 'react';

import { cn } from '@/shared/lib';

interface ChatComposerProps {
  readonly isThinking: boolean;
  /** `false` cuando se agotó el cupo de fotos: se puede escribir, no adjuntar. */
  readonly canSendImages: boolean;
  readonly onSend: (text: string, file: File | null) => void;
}

/** Hasta dónde crece la caja antes de hacer scroll por dentro. */
const MAX_TEXTAREA_PX = 200;

/**
 * La caja de escribir, con las costumbres que el usuario ya trae aprendidas
 * de ChatGPT: todo dentro de una sola pastilla, el `+` a la izquierda para
 * adjuntar, el botón de enviar a la derecha, la caja que crece sola y Enter
 * para enviar (Shift+Enter hace salto de línea).
 *
 * Se conservan los colores de la marca a propósito: lo que se copia es la
 * ergonomía —dónde está cada cosa y cómo responde— no la paleta gris. La idea
 * es que no tenga que aprender nada nuevo, no que crea que cambió de app.
 */
export function ChatComposer({
  isThinking,
  canSendImages,
  onSend,
}: ChatComposerProps): ReactNode {
  const [text, setText] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const fileInput = useRef<HTMLInputElement>(null);
  const textarea = useRef<HTMLTextAreaElement>(null);

  // La caja crece con lo que se escribe y vuelve a su sitio al enviar.
  useEffect(() => {
    const node = textarea.current;
    if (node === null) {
      return;
    }
    node.style.height = 'auto';
    node.style.height = `${String(Math.min(node.scrollHeight, MAX_TEXTAREA_PX))}px`;
  }, [text]);

  const isEmpty = text.trim() === '' && file === null;

  const clearFile = (): void => {
    setFile(null);
    if (fileInput.current !== null) {
      fileInput.current.value = '';
    }
  };

  const submit = (): void => {
    if (isThinking || isEmpty) {
      return;
    }
    onSend(text, file);
    setText('');
    clearFile();
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>): void => {
    event.preventDefault();
    submit();
  };

  // Enter envía; Shift+Enter hace salto de línea. Es lo que la gente espera.
  const handleKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>): void => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      submit();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mt-6">
      <div className="rounded-3xl border border-cream/20 bg-cream/5 p-2 transition-colors focus-within:border-cream/40">
        {file === null ? null : (
          <div className="mb-2 flex items-center justify-between gap-3 rounded-2xl bg-cream/10 px-4 py-2.5 text-sm text-cream/80">
            <span className="truncate">{file.name}</span>
            <button
              type="button"
              onClick={clearFile}
              aria-label="Quitar la foto"
              className="shrink-0 rounded-full px-2 text-lg leading-none text-cream/50 transition-colors hover:text-cream"
            >
              ×
            </button>
          </div>
        )}

        <div className="flex items-end gap-2">
          {canSendImages ? (
            <label
              className="flex h-10 w-10 shrink-0 cursor-pointer items-center justify-center rounded-full border border-cream/25 text-xl leading-none text-cream/70 transition-colors focus-within:ring-2 focus-within:ring-terracota hover:border-cream/50 hover:text-cream"
              title="Adjuntar una foto"
            >
              <span aria-hidden>+</span>
              <span className="sr-only">Adjuntar una foto</span>
              <input
                ref={fileInput}
                type="file"
                accept="image/*"
                className="sr-only"
                onChange={(event) => {
                  setFile(event.target.files?.[0] ?? null);
                }}
              />
            </label>
          ) : (
            <span
              title="Se acabaron tus fotos del mes"
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-cream/10 text-xl leading-none text-cream/20"
            >
              <span aria-hidden>+</span>
              <span className="sr-only">Se acabaron tus fotos del mes</span>
            </span>
          )}

          <textarea
            ref={textarea}
            value={text}
            onChange={(event) => {
              setText(event.target.value);
            }}
            onKeyDown={handleKeyDown}
            rows={1}
            placeholder="Pregúntale al maestro…"
            className="max-h-[200px] flex-1 resize-none self-center bg-transparent px-2 py-2.5 text-sm leading-relaxed text-cream placeholder:text-cream/35 focus:outline-none"
          />

          <button
            type="submit"
            disabled={isThinking || isEmpty}
            aria-label="Enviar"
            className={cn(
              'flex h-10 w-10 shrink-0 items-center justify-center rounded-full transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-terracota',
              isThinking || isEmpty
                ? 'bg-cream/15 text-cream/30'
                : 'bg-terracota text-cream hover:bg-terracota-dark',
            )}
          >
            <span aria-hidden className="text-lg leading-none">
              ↑
            </span>
          </button>
        </div>
      </div>

      <p className="mt-2 px-2 text-[11px] text-cream/35">
        Enter envía · Shift + Enter hace salto de línea
      </p>
    </form>
  );
}
