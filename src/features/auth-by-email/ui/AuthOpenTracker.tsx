'use client';

import { useEffect, useRef, type ReactNode } from 'react';

import { startAuthAttempt, type AuthTrigger } from '@/shared/lib/analytics';

interface AuthOpenTrackerProps {
  readonly trigger: AuthTrigger;
  readonly origin: string | null;
}

/**
 * Abre el intento de entrada al pintarse el formulario de `/entrar` y mide
 * `auth_modal_opened`. No pinta nada.
 *
 * Una sola vez por montaje: el `ref` frena el doble efecto del modo estricto
 * de React en desarrollo, que contaría dos aperturas.
 */
export function AuthOpenTracker({ trigger, origin }: AuthOpenTrackerProps): ReactNode {
  const opened = useRef(false);

  useEffect(() => {
    if (opened.current) {
      return;
    }
    opened.current = true;
    startAuthAttempt(trigger, origin);
  }, [trigger, origin]);

  return null;
}
