'use client';

import { useEffect, useRef, type ReactNode } from 'react';

import {
  ANALYTICS_EVENTS,
  currentAuthAttempt,
  startAuthAttempt,
  track,
  browserContextOf,
  type AuthTrigger,
} from '@/shared/lib/analytics';

/**
 * El motivo que Supabase deja en el FRAGMENTO cuando rechaza el enlace antes
 * del callback: `#error=access_denied&error_code=otp_expired&…`. El servidor
 * no ve el fragmento; solo se puede leer aquí.
 */
function linkErrorFromHash(): string | null {
  const hash = window.location.hash.replace(/^#/, '');
  if (hash === '') {
    return null;
  }
  const code = new URLSearchParams(hash).get('error_code');
  return code !== null && /^[a-z_]{1,60}$/.test(code) ? code : null;
}

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

    // Antes de abrir un intento nuevo: si viene de un enlace rechazado, se
    // apunta el motivo real con el intento que tenía (si es el mismo navegador).
    const linkError = linkErrorFromHash();
    if (linkError !== null) {
      const previous = currentAuthAttempt();
      track(ANALYTICS_EVENTS.authLinkError, {
        ...browserContextOf(navigator.userAgent),
        reason: linkError,
        intento: previous?.id,
        trigger: previous?.trigger,
        same_browser: previous !== null,
      });
    }

    startAuthAttempt(trigger, origin);
  }, [trigger, origin]);

  return null;
}
