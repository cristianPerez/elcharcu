'use client';

import { useState, type FormEvent, type ReactNode } from 'react';

import { Eyebrow } from '@/shared/ui';

import { useCodeSignIn } from '../model/useCodeSignIn';
import { useEmailAuth } from '../model/useEmailAuth';

import { CodeEntry } from './CodeEntry';

/** Entrar con el código (o el enlace) del correo. Sin contraseña. */
interface EmailAuthFormProps {
  /** A dónde vuelve al tocar el enlace (la página de la que vino). */
  readonly next?: string | null | undefined;
  /** Llegó desde un enlace que ya no sirve (`/entrar?error=…`). */
  readonly linkFailed?: boolean;
}

export function EmailAuthForm({
  next,
  linkFailed = false,
}: EmailAuthFormProps): ReactNode {
  const { state, sendLink, reset } = useEmailAuth();
  const code = useCodeSignIn();
  const [email, setEmail] = useState('');

  const handleSubmit = (event: FormEvent<HTMLFormElement>): void => {
    event.preventDefault();
    void sendLink(email, { next: next ?? undefined });
  };

  if (state.status === 'sent') {
    return (
      <div>
        <Eyebrow className="text-terracota-dark">Revisa tu correo</Eyebrow>
        <h1 className="mt-6 font-serif text-3xl font-semibold leading-tight text-forest md:text-4xl">
          Te mandamos un código.
        </h1>
        <p className="mt-4 text-base leading-relaxed text-cocoa/65">
          Abre el correo que llegó a <span className="text-forest">{state.email}</span> y
          escribe aquí el código, o toca el botón del correo.
        </p>
        <div className="mt-6">
          <CodeEntry
            onSubmit={(value) => void code.verify(state.email, value, next ?? undefined)}
            isChecking={code.state.status === 'checking'}
            error={code.state.status === 'error' ? code.state.message : null}
          />
        </div>
        <p className="mt-6 text-sm text-cocoa/65">
          ¿No llegó? Mira en spam, o{' '}
          <button
            type="button"
            onClick={reset}
            className="text-terracota underline underline-offset-4 hover:text-forest"
          >
            prueba con otro correo
          </button>
          .
        </p>
      </div>
    );
  }

  const isSending = state.status === 'sending';

  return (
    <div>
      <Eyebrow className="text-terracota-dark">Tu cuenta</Eyebrow>

      {/*
        ⚠️ Antes (hasta 2026-10-19) el callback mandaba aquí `?error=…` y la
        pantalla no decía nada: quien abría un enlace vencido caía en el
        formulario sin saber por qué. Y desde los pagos con OnePay importa más:
        la cuenta de quien pagó se crea con el correo del pago.
      */}
      {linkFailed ? (
        <p
          role="status"
          className="mt-6 rounded-2xl bg-terracota/10 px-5 py-4 text-sm leading-relaxed text-forest"
        >
          Ese enlace ya se usó o caducó. Escribe tu correo y te mandamos otro. Si pagaste
          tu suscripción, usa el correo con el que pagaste.
        </p>
      ) : null}

      <h1 className="mt-6 font-serif text-3xl font-semibold leading-tight text-forest md:text-4xl">
        Guarda tus recetas.
      </h1>
      <p className="mt-4 text-base leading-relaxed text-cocoa/65">
        Con una cuenta, tus curados te siguen aunque cambies de celular. Un curado dura
        semanas: no querrás perderlo a medias.
      </p>

      <form onSubmit={handleSubmit} className="mt-8">
        <label htmlFor="email" className="block text-sm text-cocoa/65">
          Tu correo
        </label>
        <input
          id="email"
          type="email"
          inputMode="email"
          autoComplete="email"
          required
          value={email}
          onChange={(event) => {
            setEmail(event.target.value);
          }}
          placeholder="tunombre@correo.com"
          className="mt-2 w-full rounded-2xl border border-cocoa/15 bg-cream-white px-5 py-4 text-forest placeholder:text-cocoa/65 focus:border-terracota focus:outline-none focus:ring-2 focus:ring-terracota/40"
        />

        <button
          type="submit"
          disabled={isSending}
          className="mt-4 inline-flex w-full items-center justify-center rounded-full bg-brasa px-6 py-4 text-sm font-medium tracking-wide text-cocoa shadow-surface transition-shadow hover:shadow-raised focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-terracota focus-visible:ring-offset-2 disabled:opacity-60"
        >
          {isSending ? 'Enviando…' : 'Enviarme el código'}
        </button>
      </form>

      {state.status === 'error' ? (
        <p role="alert" className="mt-4 text-sm text-terracota">
          {state.message}
        </p>
      ) : null}

      <p className="mt-6 text-xs leading-relaxed text-cocoa/65">
        No pedimos contraseña ni tarjeta. Solo el correo, para que tus recetas no se
        pierdan.
      </p>
    </div>
  );
}
