'use client';

import { useId, useState, type FormEvent, type ReactNode } from 'react';

import { IconCheck } from '@/shared/ui';

const PERKS = [
  'Las 5 cápsulas, con tu avance guardado',
  'El curso de lomo de cerdo curado, completo',
  '8 preguntas y 2 fotos al mes con El Charcu',
] as const;

interface SignupStepEmailProps {
  readonly heading: string;
  readonly initialEmail: string;
  readonly isSending: boolean;
  readonly error: string | null;
  readonly onSubmit: (email: string) => void;
}

/** Paso 1 (diseño final 03/05): qué trae la cuenta, el correo y el botón. */
export function SignupStepEmail({
  heading,
  initialEmail,
  isSending,
  error,
  onSubmit,
}: SignupStepEmailProps): ReactNode {
  const inputId = useId();
  const [email, setEmail] = useState(initialEmail);

  const submit = (event: FormEvent<HTMLFormElement>): void => {
    event.preventDefault();
    onSubmit(email);
  };

  return (
    <form onSubmit={submit} className="px-5 pb-6 pt-5 md:px-8 md:pb-8 md:pt-6">
      <p className="font-serif text-[28px] font-semibold leading-tight text-forest md:text-[26px]">
        {heading}
      </p>
      <ul className="mt-4 flex flex-col gap-2.5">
        {PERKS.map((perk) => (
          <li key={perk} className="flex gap-2.5 text-[15px] text-cocoa">
            <IconCheck size={17} className="mt-0.5 shrink-0 text-forest" />
            {perk}
          </li>
        ))}
      </ul>
      <label htmlFor={inputId} className="mt-5 block text-sm text-cocoa-soft">
        Tu correo
      </label>
      <input
        id={inputId}
        type="email"
        required
        autoComplete="email"
        inputMode="email"
        value={email}
        onChange={(event) => setEmail(event.target.value)}
        placeholder="tunombre@correo.com"
        aria-invalid={error !== null}
        aria-describedby={error === null ? undefined : `${inputId}-error`}
        className="mt-2 min-h-14 w-full rounded-2xl border border-cocoa/15 bg-cream-white px-5 text-cocoa placeholder:text-cocoa-muted focus:border-forest focus:outline-none focus:ring-2 focus:ring-forest/20"
      />
      {error === null ? null : (
        <p id={`${inputId}-error`} role="alert" className="mt-2 text-sm text-brasa-tinta">
          {error}
        </p>
      )}
      <button
        type="submit"
        disabled={isSending}
        className="mt-4 min-h-14 w-full rounded-full bg-brasa text-base font-semibold text-cocoa transition-colors hover:bg-brasa-dark disabled:opacity-60"
      >
        {isSending ? 'Enviando…' : 'Enviarme el enlace'}
      </button>
      <p className="mt-4 text-center text-sm text-cocoa-soft">
        No pedimos contraseña ni tarjeta. Si ya tienes cuenta, es el mismo paso.
      </p>
    </form>
  );
}
