'use client';

import { useEffect, useRef, type ReactNode } from 'react';

import { type SignupRequest, useSignupPrompt } from '../model/signupPrompt';

interface SignupTargetsProps {
  readonly targets: readonly SignupRequest[];
  /** Abre la hoja al montarse con el que tenga este destino (`/cursos?abrir=`). */
  readonly openOnMount?: string | null | undefined;
}

/**
 * Una pantalla dice qué enlaces suyos piden cuenta y con qué contexto. No
 * pinta nada. Lo arma el servidor —que sabe el número de cada cápsula y su
 * título— y lo usa `SignupInterceptor`.
 */
export function SignupTargets({ targets, openOnMount }: SignupTargetsProps): ReactNode {
  const { registerTargets, openSignup } = useSignupPrompt();

  useEffect(() => registerTargets(targets), [registerTargets, targets]);

  // Solo al llegar: si cierra la hoja, no se vuelve a abrir sola.
  const hasOpened = useRef(false);
  useEffect(() => {
    if (hasOpened.current || openOnMount === null || openOnMount === undefined) {
      return;
    }
    hasOpened.current = true;
    const match = targets.find((target) => openOnMount.startsWith(target.destination));
    if (match !== undefined) {
      openSignup({ ...match, destination: openOnMount });
    }
  }, [openOnMount, targets, openSignup]);

  return null;
}
