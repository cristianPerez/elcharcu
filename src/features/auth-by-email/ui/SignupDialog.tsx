'use client';

import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useRef, useState, type ReactNode } from 'react';

import {
  ANALYTICS_EVENTS,
  currentAuthAttempt,
  trackAuthStep,
} from '@/shared/lib/analytics';
import { Dialog } from '@/shared/ui';

import { useSignupPrompt } from '../model/signupPrompt';
import { useCodeSignIn } from '../model/useCodeSignIn';
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
 * El correo trae un código de 6 dígitos y un enlace (2026-10-30). El código
 * entra aquí mismo (`useCodeSignIn`); el enlace sigue el flujo de siempre
 * (`signInWithOtp`, callback, PKCE) y esta hoja lo detecta sola si se abre en
 * otra pestaña del mismo navegador.
 */
export function SignupDialog(): ReactNode {
  const router = useRouter();
  const { request, closeSignup } = useSignupPrompt();
  const { state, sendLink, reset } = useEmailAuth();
  const code = useCodeSignIn();
  const [email, setEmail] = useState('');

  // Para medir el abandono (`auth_modal_closed`): cuándo se abrió y si llegó
  // a escribir. Nunca se guarda QUÉ escribió.
  const openedAt = useRef(0);
  const hasTyped = useRef(false);

  // Una hoja nueva empieza siempre en el paso 1.
  useEffect(() => {
    if (request !== null) {
      reset();
      openedAt.current = Date.now();
      hasTyped.current = false;
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

  // Mientras se verifica el código, la sesión aparece en este navegador: la
  // navegación la hace `useCodeSignIn`, no el vigilante.
  useSessionWatcher(
    request !== null && state.status === 'sent' && code.state.status !== 'checking',
    onSignedIn,
  );

  if (request === null) {
    return null;
  }

  /** Cerrar sin haber entrado: la X, Esc o el fondo. Entrar no pasa por aquí. */
  const dismiss = (): void => {
    const attempt = currentAuthAttempt();
    if (attempt !== null) {
      trackAuthStep(ANALYTICS_EVENTS.authModalClosed, attempt, {
        paso: state.status === 'sent' ? 'revisa_correo' : 'correo',
        escribio_correo: hasTyped.current,
        hubo_error: state.status === 'error',
        segundos_abierta: Math.round((Date.now() - openedAt.current) / 1000),
      });
    }
    closeSignup();
  };

  const send = (value: string): void => {
    setEmail(value);
    void sendLink(value, { next: request.destination });
  };

  return (
    <Dialog
      open
      onClose={dismiss}
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
          onCode={(value) => void code.verify(state.email, value, request.destination)}
          isCheckingCode={code.state.status === 'checking'}
          codeError={code.state.status === 'error' ? code.state.message : null}
        />
      ) : (
        <SignupStepEmail
          heading={request.heading ?? DEFAULT_HEADING}
          isSignIn={request.intent === 'entrar'}
          onTyped={() => {
            hasTyped.current = true;
          }}
          initialEmail={email}
          isSending={state.status === 'sending'}
          error={state.status === 'error' ? state.message : null}
          onSubmit={send}
        />
      )}
    </Dialog>
  );
}
