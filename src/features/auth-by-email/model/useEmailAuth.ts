'use client';

import { useCallback, useState } from 'react';

import { createSupabaseBrowserClient, isSupabaseConfigured } from '@/shared/api/supabase';

export type EmailAuthState =
  | { readonly status: 'idle' }
  | { readonly status: 'sending' }
  | { readonly status: 'sent'; readonly email: string }
  | { readonly status: 'error'; readonly message: string };

export interface EmailAuthController {
  readonly state: EmailAuthState;
  readonly sendLink: (email: string) => Promise<void>;
  readonly reset: () => void;
}

/**
 * Entrar con un enlace enviado al correo — sin contraseña que memorizar.
 * Es la menor fricción posible para un público móvil que no quiere otra clave.
 */
export function useEmailAuth(): EmailAuthController {
  const [state, setState] = useState<EmailAuthState>({ status: 'idle' });

  const sendLink = useCallback(async (email: string): Promise<void> => {
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
    const { error } = await supabase.auth.signInWithOtp({
      email: trimmed,
      options: { emailRedirectTo: `${window.location.origin}/auth/callback` },
    });

    if (error) {
      setState({
        status: 'error',
        message: 'No pudimos enviar el correo. Revisa la dirección e inténtalo de nuevo.',
      });
      return;
    }

    setState({ status: 'sent', email: trimmed });
  }, []);

  const reset = useCallback((): void => {
    setState({ status: 'idle' });
  }, []);

  return { state, sendLink, reset };
}
