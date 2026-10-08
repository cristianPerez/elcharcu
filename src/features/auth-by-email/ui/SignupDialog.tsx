'use client';

import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useState, type ReactNode } from 'react';

import { Dialog } from '@/shared/ui';

import { useSignupPrompt } from '../model/signupPrompt';
import { useEmailAuth } from '../model/useEmailAuth';
import { useSessionWatcher } from '../model/useSessionWatcher';

import { SignupHeader } from './SignupHeader';
import { SignupStepCheck } from './SignupStepCheck';
import { SignupStepEmail } from './SignupStepEmail';

const DEFAULT_HEADING = 'Crea tu cuenta gratis para empezar';

/**
 * Crear cuenta (diseño final 03–06): UN componente, dos presentaciones —hoja
 * desde abajo por debajo de 768 px, modal centrado por encima— que pone el
 * `Dialog` nativo (foco atrapado, Esc cierra, el foco vuelve a quien la abrió).
 *
 * Paso 1, el correo; paso 2, "Revisa tu correo". El enlace vuelve a lo que
 * eligió (`destination`), no al inicio.
 *
 * ⚠️ Reusa el flujo de entrada tal cual (`signInWithOtp`, callback, PKCE):
 * solo le pasa el destino.
 */
export function SignupDialog(): ReactNode {
  const router = useRouter();
  const { request, closeSignup } = useSignupPrompt();
  const { state, sendLink, reset } = useEmailAuth();
  const [email, setEmail] = useState('');

  // Una hoja nueva empieza siempre en el paso 1.
  useEffect(() => {
    if (request !== null) {
      reset();
    }
  }, [request, reset]);

  const destination = request?.destination ?? null;
  const onSignedIn = useCallback((): void => {
    closeSignup();
    if (destination !== null) {
      router.push(destination);
      router.refresh();
    }
  }, [closeSignup, destination, router]);

  useSessionWatcher(request !== null && state.status === 'sent', onSignedIn);

  if (request === null) {
    return null;
  }

  const send = (value: string): void => {
    setEmail(value);
    void sendLink(value, { next: request.destination });
  };

  return (
    <Dialog
      open
      onClose={closeSignup}
      title={`${request.eyebrow} · ${request.title}`}
      placement="sheet"
      bare
      closeTone="onImage"
    >
      <span
        aria-hidden="true"
        className="mx-auto mt-3 block h-1 w-10 rounded-full bg-cocoa/15 md:hidden"
      />
      <SignupHeader request={request} />
      {state.status === 'sent' ? (
        <SignupStepCheck
          email={state.email}
          returnLabel={request.returnLabel}
          onChangeEmail={reset}
          onResend={() => void sendLink(state.email, { next: request.destination })}
        />
      ) : (
        <SignupStepEmail
          heading={request.heading ?? DEFAULT_HEADING}
          isSignIn={request.intent === 'entrar'}
          initialEmail={email}
          isSending={state.status === 'sending'}
          error={state.status === 'error' ? state.message : null}
          onSubmit={send}
        />
      )}
    </Dialog>
  );
}
