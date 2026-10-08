'use client';

import { useCallback, useState } from 'react';

import { createSupabaseBrowserClient, isSupabaseConfigured } from '@/shared/api/supabase';
import { safeDestination } from '@/shared/lib/access';
import {
  ANALYTICS_EVENTS,
  attemptRedirectParams,
  attemptVisitorId,
  ensureAuthAttempt,
  trackAuthStep,
} from '@/shared/lib/analytics';

export type EmailAuthState =
  | { readonly status: 'idle' }
  | { readonly status: 'sending' }
  | { readonly status: 'sent'; readonly email: string }
  | { readonly status: 'error'; readonly message: string };

export interface SendLinkOptions {
  readonly next?: string | undefined;
}

export interface EmailAuthController {
  readonly state: EmailAuthState;
  /** `next`: a dónde vuelve al tocar el enlace. Solo rutas internas. */
  readonly sendLink: (email: string, options?: SendLinkOptions) => Promise<void>;
  readonly reset: () => void;
}

/**
 * Entrar con un enlace enviado al correo — sin contraseña que memorizar.
 * Es la menor fricción posible para un público móvil que no quiere otra clave.
 */
export function useEmailAuth(): EmailAuthController {
  const [state, setState] = useState<EmailAuthState>({ status: 'idle' });

  const sendLink = useCallback(
    async (email: string, options?: SendLinkOptions): Promise<void> => {
      const trimmed = email.trim();

      if (trimmed === '') {
        setState({ status: 'error', message: 'Escribe tu correo.' });
        return;
      }

      if (!isSupabaseConfigured()) {
        setState({
          status: 'error',
          message: 'Las cuentas todavía no están conectadas. Vuelve en un rato.',
        });
        return;
      }

      setState({ status: 'sending' });

      const supabase = createSupabaseBrowserClient();
      // El intento une este paso con el aterrizaje, aunque el enlace se abra en
      // otro navegador. Sus parámetros SE SUMAN a `next`, no lo cambian.
      const attempt = ensureAuthAttempt('menu_entrar');
      // Vuelve a lo que eligió (la cápsula, el curso, la receta), no al inicio.
      // El callback lo vuelve a validar: nunca sale de esta web.
      const next = encodeURIComponent(safeDestination(options?.next));
      const tracking = attemptRedirectParams(attempt, attemptVisitorId()).toString();
      const { error } = await supabase.auth.signInWithOtp({
        email: trimmed,
        // Quien entra por `/entrar` también cae dentro de la app.
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback?next=${next}&${tracking}`,
        },
      });

      if (error) {
        setState({
          status: 'error',
          message:
            'No pudimos enviar el correo. Revisa la dirección e inténtalo de nuevo.',
        });
        return;
      }

      trackAuthStep(ANALYTICS_EVENTS.magicLinkRequested, attempt);
      setState({ status: 'sent', email: trimmed });
    },
    [],
  );

  const reset = useCallback((): void => {
    setState({ status: 'idle' });
  }, []);

  return { state, sendLink, reset };
}
