'use client';

import { usePathname } from 'next/navigation';
import { useEffect, useRef, type ReactNode } from 'react';

import {
  ANALYTICS_EVENTS,
  clearAuthDone,
  peekAuthDone,
  trackAuthStep,
} from '@/shared/lib/analytics';

/** `/cursos/sal-de-cura?x=1` → `/cursos/sal-de-cura`. */
function pathOf(origin: string): string {
  return origin.split(/[?#]/)[0] ?? origin;
}

/**
 * Mide `returned_to_origin`: si, después de entrar, llegó a la página que
 * quería ver cuando se le pidió la cuenta (2026-10-07). No pinta nada.
 *
 * Vigila cada cambio de ruta mientras exista la cookie que dejó el callback
 * (dura 30 min). `pasos` dice cuántas páginas tuvo que recorrer antes:
 * 0 sería que el enlace lo dejó justo ahí. Hoy el enlace lleva siempre a
 * `/charcu`, así que lo esperable es que casi nunca llegue, o que llegue
 * buscándolo a mano — que es exactamente lo que se quiere ver.
 */
export function ReturnToOriginTracker(): ReactNode {
  const pathname = usePathname();
  const pasos = useRef(0);

  useEffect(() => {
    const done = peekAuthDone();
    if (done === null) {
      pasos.current = 0;
      return;
    }
    const origin = done.attempt.origin;
    if (origin === null) {
      clearAuthDone();
      return;
    }

    const target = pathOf(origin);
    if (pathname === target || pathname.startsWith(`${target}/`)) {
      trackAuthStep(ANALYTICS_EVENTS.returnedToOrigin, done.attempt, {
        same_browser: done.sameBrowser ?? undefined,
        pasos: pasos.current,
        directo: pasos.current === 0,
      });
      clearAuthDone();
      pasos.current = 0;
      return;
    }
    pasos.current += 1;
  }, [pathname]);

  return null;
}
