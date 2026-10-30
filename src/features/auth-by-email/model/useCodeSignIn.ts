'use client';

import { useCallback, useState } from 'react';

import { createSupabaseBrowserClient, isSupabaseConfigured } from '@/shared/api/supabase';
import { safeDestination } from '@/shared/lib/access';
import {
  ANALYTICS_EVENTS,
  currentAuthAttempt,
  trackAuthStep,
} from '@/shared/lib/analytics';

/**
 * Largo del código. El correo lo manda de 6 (`Email OTP Length` del panel de
 * Supabase); se aceptan hasta 8 para que la app no dependa del orden en que se
 * cambie esa configuración en cada entorno (antes del 2026-10-30 eran 8).
 */
export const CODE_MIN_LENGTH = 6;
export const CODE_MAX_LENGTH = 8;

export type CodeSignInState =
  | { readonly status: 'idle' }
  | { readonly status: 'checking' }
  | { readonly status: 'error'; readonly message: string };

export interface CodeSignInController {
  readonly state: CodeSignInState;
  readonly verify: (
    email: string,
    code: string,
    next: string | undefined,
  ) => Promise<void>;
}

interface EntroResponse {
  readonly to?: unknown;
}

function isEntroResponse(value: unknown): value is EntroResponse {
  return typeof value === 'object' && value !== null;
}

/** Qué se le dice según lo que contestó Supabase. Nunca el error en crudo. */
function messageFor(code: string | undefined): string {
  if (code === 'over_request_rate_limit' || code === 'over_email_send_rate_limit') {
    return 'Demasiados intentos. Espera un minuto y vuelve a probar.';
  }
  // Supabase contesta `otp_expired` tanto si el código está mal como si venció.
  return 'Ese código no sirve: revisa los números o pide uno nuevo.';
}

/**
 * Entrar con el código de 6 dígitos del correo (2026-10-30).
 *
 * Es la puerta que abre sesión DONDE SE PIDIÓ —también en el navegador de
 * Instagram— y que no gastan los filtros de Outlook/Hotmail: la razón está en
 * `docs/auth-magic-link-dropoff.md`. El correo no trae enlace: compartía el
 * token con el código y, si un filtro lo abría, el código llegaba gastado.
 *
 * El navegador verifica con Supabase (el límite de intentos va por IP, o sea
 * por persona); luego `/auth/entro` hace lo que hacía el callback del enlace.
 */
export function useCodeSignIn(): CodeSignInController {
  const [state, setState] = useState<CodeSignInState>({ status: 'idle' });

  const verify = useCallback(
    async (email: string, code: string, next: string | undefined): Promise<void> => {
      const token = code.replace(/\D/g, '');
      if (token.length < CODE_MIN_LENGTH) {
        setState({ status: 'error', message: 'Escribe los 6 números del correo.' });
        return;
      }
      if (!isSupabaseConfigured()) {
        setState({ status: 'error', message: 'Las cuentas no están conectadas.' });
        return;
      }

      setState({ status: 'checking' });
      const attempt = currentAuthAttempt();
      const supabase = createSupabaseBrowserClient();
      const { error } = await supabase.auth.verifyOtp({ email, token, type: 'email' });

      if (error) {
        if (attempt !== null) {
          trackAuthStep(ANALYTICS_EVENTS.authFailed, attempt, {
            flow: 'codigo',
            reason: error.code ?? error.name,
          });
        }
        setState({ status: 'error', message: messageFor(error.code) });
        return;
      }

      // Ya hay sesión. Si `/auth/entro` falla, se entra igual: perder la
      // medición o el rastro anónimo es menos grave que quedarse fuera.
      const destination = safeDestination(next);
      const to = await fetch('/auth/entro', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ next: destination }),
      })
        .then((response) => response.json())
        .then((body: unknown) =>
          isEntroResponse(body) && typeof body.to === 'string' ? body.to : destination,
        )
        .catch(() => destination);

      // Navegación completa: el servidor vuelve a leer la sesión, y
      // `AppProviders` lee `?entrada=` para el onboarding y `account_created`.
      window.location.assign(safeDestination(to));
    },
    [],
  );

  return { state, verify };
}
