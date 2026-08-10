'use client';

import { useRef, useState, type FormEvent, type ReactNode } from 'react';

interface ChatComposerProps {
  readonly isThinking: boolean;
  readonly onSend: (text: string, file: File | null) => void;
}

/** Caja para escribir la duda y adjuntar la foto del moho o del corte. */
export function ChatComposer({ isThinking, onSend }: ChatComposerProps): ReactNode {
  const [text, setText] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const fileInput = useRef<HTMLInputElement>(null);

  const handleSubmit = (event: FormEvent<HTMLFormElement>): void => {
    event.preventDefault();
    if (isThinking) {
      return;
    }
    onSend(text, file);
    setText('');
    setFile(null);
    if (fileInput.current !== null) {
      fileInput.current.value = '';
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mt-6">
      {file === null ? null : (
        <div className="mb-3 flex items-center justify-between gap-3 rounded-xl border border-cream/20 px-4 py-2.5 text-sm text-cream/70">
          <span className="truncate">📷 {file.name}</span>
          <button
            type="button"
            onClick={() => {
              setFile(null);
              if (fileInput.current !== null) {
                fileInput.current.value = '';
              }
            }}
            className="shrink-0 text-cream/50 hover:text-cream"
          >
            Quitar
          </button>
        </div>
      )}

      <div className="flex items-end gap-2">
        <label
          className="flex h-12 w-12 shrink-0 cursor-pointer items-center justify-center rounded-full border border-cream/20 text-lg text-cream/60 transition-colors hover:border-terracota hover:text-cream"
          title="Adjuntar una foto"
        >
          <span aria-hidden>📷</span>
          <span className="sr-only">Adjuntar una foto</span>
          <input
            ref={fileInput}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(event) => {
              setFile(event.target.files?.[0] ?? null);
            }}
          />
        </label>

        <textarea
          value={text}
          onChange={(event) => {
            setText(event.target.value);
          }}
          rows={1}
          placeholder="Escribe tu duda…"
          className="min-h-[3rem] flex-1 resize-none rounded-2xl border border-cream/20 bg-cream/5 px-5 py-3.5 text-sm text-cream placeholder:text-cream/30 focus:border-terracota focus:outline-none focus:ring-2 focus:ring-terracota/40"
        />

        <button
          type="submit"
          disabled={isThinking || (text.trim() === '' && file === null)}
          className="h-12 shrink-0 rounded-full bg-terracota px-6 text-sm font-medium text-cream transition-colors hover:bg-terracota-dark disabled:opacity-40"
        >
          {isThinking ? '…' : 'Enviar'}
        </button>
      </div>
    </form>
  );
}
