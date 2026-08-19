'use client';

import { useEffect, useState } from 'react';

import { createSupabaseBrowserClient, isSupabaseConfigured } from '@/shared/api/supabase';

export interface AccountSessionState {
  /** `true` si hay cuenta abierta en este navegador. */
  readonly isSignedIn: boolean;
  /** `false` hasta que Supabase contesta, para no pintar el muro de más. */
  readonly isReady: boolean;
}

/**
 * ¿Este navegador tiene la cuenta abierta?
 *
 * Es lo que decide el muro tras la primera pregunta. Antes lo decidía una marca
 * en `localStorage`, que solo sabía si este navegador había mandado el
 * formulario alguna vez — no si la cuenta existe de verdad. Quien entra por el
 * enlace del correo aquí ya llega con sesión, y el muro se retira solo.
 *
 * Si Supabase no está configurado se deja pasar: sin cuentas conectadas, el
 * enlace no se podría enviar y el muro dejaría la app inservible.
 */
export function useAccountSession(): AccountSessionState {
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    if (!isSupabaseConfigured()) {
      setIsSignedIn(true);
      setIsReady(true);
      return undefined;
    }

    let isMounted = true;
    const supabase = createSupabaseBrowserClient();

    void supabase.auth.getSession().then(({ data }) => {
      if (!isMounted) {
        return;
      }
      setIsSignedIn(data.session !== null);
      setIsReady(true);
    });

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      if (isMounted) {
        setIsSignedIn(session !== null);
        setIsReady(true);
      }
    });

    return () => {
      isMounted = false;
      listener.subscription.unsubscribe();
    };
  }, []);

  return { isSignedIn, isReady };
}
