'use client';

import { type ReactNode } from 'react';

import { cn } from '@/shared/lib';

import { useComposer } from '../model/useComposer';

interface ChatComposerProps {
  readonly isThinking: boolean;
  /** `false` cuando se agotó el cupo de fotos: se puede escribir, no adjuntar. */
  readonly canSendImages: boolean;
  /**
   * Por qué no se puede escribir, o `null` si sí se puede.
   *
   * Se bloquea AQUÍ y no se deja mandar para que el servidor conteste 402: el
   * usuario escribiría una duda entera —a veces larga, con las manos sucias— y
   * la recibiría de vuelta como un error. Mejor que el sitio donde se escribe
   * diga desde el principio que hoy no.
   */
  readonly blockedReason?: string | null;
  /**
   * Manda la pregunta. Devuelve `true` si se aceptó.
   *
   * Devuelve booleano y no `void` porque la caja solo debe VACIARSE cuando la
   * pregunta salió de verdad. Si algo la para —el muro de la cuenta—, lo que
   * escribió se queda escrito: se le pide el correo y al volver sigue ahí.
   * Borrarlo sería cobrarle el trámite con su propia pregunta.
   */
  readonly onSend: (text: string, file: File | null) => boolean;
}

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
  blockedReason = null,
  onSend,
}: ChatComposerProps): ReactNode {
  const {
    text,
    setText,
    file,
    setFile,
    clearFile,
    isEmpty,
    fileInput,
    textarea,
    handleSubmit,
    handleKeyDown,
  } = useComposer({ isThinking, onSend });

  return (
    <form onSubmit={handleSubmit} className="mt-6">
      <div className="rounded-3xl border border-cocoa/15 bg-cream p-2 transition-shadow focus-within:ring-2 focus-within:ring-terracota/45">
        {file === null ? null : (
          <div className="mb-2 flex items-center justify-between gap-3 rounded-2xl bg-cream-white px-4 py-2.5 text-sm text-cocoa/75">
            <span className="truncate">{file.name}</span>
            <button
              type="button"
              onClick={clearFile}
              aria-label="Quitar la foto"
              className="shrink-0 rounded-full px-2 text-lg leading-none text-cocoa/65 transition-colors hover:text-cocoa"
            >
              ×
            </button>
          </div>
        )}

        <div className="flex items-center gap-2">
          {canSendImages ? (
            <label
              className="flex h-10 w-10 shrink-0 cursor-pointer items-center justify-center rounded-full border border-cocoa/25 text-xl leading-none text-cocoa/70 transition-colors focus-within:ring-2 focus-within:ring-terracota hover:border-terracota hover:bg-cream-white hover:text-terracota"
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
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-cocoa/[0.12] text-xl leading-none text-cocoa/25"
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
            disabled={blockedReason !== null}
            placeholder={blockedReason ?? 'Escribe tu duda…'}
            className="max-h-[200px] flex-1 resize-none bg-transparent px-1 py-2.5 text-base leading-relaxed text-cocoa placeholder:text-cocoa/65 focus:outline-none disabled:cursor-not-allowed"
          />

          <button
            type="submit"
            disabled={isThinking || isEmpty}
            aria-label="Enviar"
            className={cn(
              'flex h-10 w-10 shrink-0 items-center justify-center rounded-full transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-terracota',
              isThinking || isEmpty
                ? 'bg-cocoa/10 text-cocoa/35'
                : 'bg-brasa text-cocoa shadow-surface hover:shadow-raised active:scale-[0.97]',
            )}
          >
            <span aria-hidden className="text-lg leading-none">
              ↑
            </span>
          </button>
        </div>
      </div>

      <p className="mt-2 hidden px-2 text-xs text-cocoa/65 md:block">
        Enter envía · Shift + Enter hace salto de línea
      </p>
    </form>
  );
}
