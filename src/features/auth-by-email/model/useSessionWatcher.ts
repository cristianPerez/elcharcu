'use client';

import { useEffect } from 'react';

import { createSupabaseBrowserClient, isSupabaseConfigured } from '@/shared/api/supabase';

/** Cada cuánto se mira si ya entró, mientras la hoja espera. */
const POLL_MS = 3000;

/**
 * "Puedes dejar esta pestaña abierta: cuando toques el enlace (…) esta
 * pestaña también entra sola" (diseño final 06, 2026-10-07).
 *
 * Mientras el paso 2 está abierto, se mira si ya hay sesión: al volver a la
 * pestaña y cada pocos segundos. El enlace abierto en OTRA pestaña del mismo
 * navegador deja la sesión en las cookies, que esta lee.
 *
 * ⚠️ Solo LEE la sesión: no cambia nada del flujo de entrada (PKCE,
 * callback). Y solo sirve en el mismo navegador; el caso del navegador de
 * Instagram se investiga aparte (docs/auth-magic-link-dropoff.md).
 */
export function useSessionWatcher(isActive: boolean, onSignedIn: () => void): void {
  useEffect(() => {
    if (!isActive || !isSupabaseConfigured()) {
      return undefined;
    }

    const supabase = createSupabaseBrowserClient();
    let isDone = false;

    const check = (): void => {
      void supabase.auth.getSession().then(({ data }) => {
        if (!isDone && data.session !== null) {
          isDone = true;
          onSignedIn();
        }
      });
    };

    const onVisible = (): void => {
      if (document.visibilityState === 'visible') {
        check();
      }
    };

    const timer = window.setInterval(check, POLL_MS);
    document.addEventListener('visibilitychange', onVisible);
    window.addEventListener('focus', check);

    return () => {
      isDone = true;
      window.clearInterval(timer);
      document.removeEventListener('visibilitychange', onVisible);
      window.removeEventListener('focus', check);
    };
  }, [isActive, onSignedIn]);
}
