'use client';

import {
  useEffect,
  useRef,
  useState,
  type FormEvent,
  type KeyboardEvent,
  type RefObject,
} from 'react';

/** Hasta dónde crece la caja antes de hacer scroll por dentro. */
const MAX_TEXTAREA_PX = 200;

/**
 * Texto que se escribe en la caja desde FUERA (un acceso directo, el borrador
 * que llega de la búsqueda). El `nonce` deja repetir el mismo texto: tocar dos
 * veces "Resolver una duda" tiene que volver a ponerlo.
 */
export interface ComposerPrefill {
  readonly text: string;
  readonly nonce: number;
  /** Abre el selector de fotos además de escribir ("Revisar con una foto"). */
  readonly pickPhoto?: boolean | undefined;
}

interface UseComposerOptions {
  readonly isThinking: boolean;
  /** Manda la pregunta. `true` si se aceptó: solo entonces se vacía la caja. */
  readonly onSend: (text: string, file: File | null) => boolean;
  readonly prefill?: ComposerPrefill | null | undefined;
}

export interface Composer {
  readonly text: string;
  readonly setText: (text: string) => void;
  readonly file: File | null;
  readonly setFile: (file: File | null) => void;
  readonly clearFile: () => void;
  readonly isEmpty: boolean;
  readonly fileInput: RefObject<HTMLInputElement | null>;
  readonly textarea: RefObject<HTMLTextAreaElement | null>;
  readonly handleSubmit: (event: FormEvent<HTMLFormElement>) => void;
  readonly handleKeyDown: (event: KeyboardEvent<HTMLTextAreaElement>) => void;
}

/**
 * La lógica de la caja de escribir, sin su aspecto: la usan la caja del sitio
 * público y la de la app, que se ven distinto y se comportan igual.
 *
 * Enter envía y Shift+Enter hace salto de línea; la caja crece con lo escrito;
 * y lo escrito solo se borra cuando la pregunta salió de verdad.
 */
export function useComposer({
  isThinking,
  onSend,
  prefill = null,
}: UseComposerOptions): Composer {
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

  useEffect(() => {
    if (prefill === null) {
      return;
    }
    setText(prefill.text);
    const node = textarea.current;
    if (node !== null) {
      node.focus();
      node.setSelectionRange(prefill.text.length, prefill.text.length);
    }
    if (prefill.pickPhoto === true) {
      fileInput.current?.click();
    }
  }, [prefill]);

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
    if (!onSend(text, file)) {
      return;
    }
    setText('');
    clearFile();
  };

  return {
    text,
    setText,
    file,
    setFile,
    clearFile,
    isEmpty,
    fileInput,
    textarea,
    handleSubmit: (event) => {
      event.preventDefault();
      submit();
    },
    handleKeyDown: (event) => {
      if (event.key === 'Enter' && !event.shiftKey) {
        event.preventDefault();
        submit();
      }
    },
  };
}
