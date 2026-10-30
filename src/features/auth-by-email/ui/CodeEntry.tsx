'use client';

import { useState, type FormEvent, type ReactNode } from 'react';

import { CODE_MAX_LENGTH, CODE_MIN_LENGTH } from '../model/useCodeSignIn';

interface CodeEntryProps {
  readonly onSubmit: (code: string) => void;
  readonly isChecking: boolean;
  readonly error: string | null;
}

/**
 * La casilla del código de 6 dígitos (2026-10-30).
 *
 * Una sola casilla y no seis: el celular ofrece el código del correo encima
 * del teclado (`autocomplete="one-time-code"`) y lo pega entero, y pegar en
 * seis cajas separadas falla en más de un teclado. Al llegar a 6 números se
 * envía sola; el botón queda para quien lo escribe y para los de 8.
 */
export function CodeEntry({ onSubmit, isChecking, error }: CodeEntryProps): ReactNode {
  const [code, setCode] = useState('');

  const change = (value: string): void => {
    const digits = value.replace(/\D/g, '').slice(0, CODE_MAX_LENGTH);
    setCode(digits);
    if (digits.length === CODE_MIN_LENGTH && !isChecking) {
      onSubmit(digits);
    }
  };

  const submit = (event: FormEvent<HTMLFormElement>): void => {
    event.preventDefault();
    onSubmit(code);
  };

  return (
    <form onSubmit={submit} className="w-full">
      <label htmlFor="codigo" className="block text-sm font-semibold text-cocoa">
        Escribe el código del correo
      </label>
      <input
        id="codigo"
        name="codigo"
        type="text"
        inputMode="numeric"
        autoComplete="one-time-code"
        pattern="[0-9]*"
        maxLength={CODE_MAX_LENGTH}
        value={code}
        onChange={(event) => change(event.target.value)}
        disabled={isChecking}
        placeholder="000000"
        aria-invalid={error !== null}
        aria-describedby={error !== null ? 'codigo-error' : undefined}
        className="mt-2 w-full rounded-2xl border border-cocoa/15 bg-cream-white px-5 py-4 text-center font-mono text-2xl tracking-[0.4em] text-forest placeholder:text-cocoa/25 focus:border-terracota focus:outline-none focus:ring-2 focus:ring-terracota/40 disabled:opacity-60"
      />
      {error !== null ? (
        <p id="codigo-error" role="alert" className="mt-2 text-sm text-terracota-dark">
          {error}
        </p>
      ) : null}
      <button
        type="submit"
        disabled={isChecking || code.length < CODE_MIN_LENGTH}
        className="mt-3 inline-flex min-h-12 w-full items-center justify-center rounded-full bg-forest px-6 text-[15px] font-semibold text-cream-white disabled:opacity-50"
      >
        {isChecking ? 'Entrando…' : 'Entrar'}
      </button>
    </form>
  );
}
