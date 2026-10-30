import { type EmailOtpType } from '@supabase/supabase-js';
import { after, NextResponse, type NextRequest } from 'next/server';

import { authLanding, type AuthLanding } from '@/features/auth-by-email/server';

import { createSupabaseServerClient } from '@/shared/api/supabase/server';
import { safeDestination } from '@/shared/lib/access';

import { adoptAnonymousTrail, conEntrada, esCuentaNueva } from '../_lib/afterSignIn';

const EMAIL_OTP_TYPES: readonly EmailOtpType[] = [
  'email',
  'signup',
  'invite',
  'magiclink',
  'recovery',
  'email_change',
];

function isEmailOtpType(value: string | null): value is EmailOtpType {
  return value !== null && EMAIL_OTP_TYPES.some((type) => type === value);
}

/**
 * A dónde se le manda después de entrar.
 *
 * Solo rutas de esta casa. `next` viene de un enlace que llegó por correo, y
 * pegarlo tal cual detrás del origen convierte `//otro-sitio.co` en un redirect
 * fuera del dominio — con la sesión recién creada, que es lo peor posible.
 */
function safeNext(value: string | null): string {
  // Desde el 2026-10-07 la regla vive en `shared/lib/access` y además rechaza
  // `/\otro.co`, que algunos navegadores leen como `//otro.co`.
  return safeDestination(value);
}

/**
 * Aterrizaje del enlace del correo.
 *
 * Acepta las DOS formas en que Supabase puede devolver al usuario, porque
 * dependen de la plantilla del correo y es un fallo clásico atender solo una:
 *   · `?code=…`                    → flujo PKCE (también el de Google, más adelante)
 *   · `?token_hash=…&type=…`       → plantilla recomendada para apps con servidor
 *
 * Si algo falla, vuelve a `/entrar` con el motivo, nunca a una pantalla en blanco.
 */
export async function GET(request: NextRequest): Promise<NextResponse> {
  const { searchParams, origin } = new URL(request.url);
  const next = safeNext(searchParams.get('next'));

  const code = searchParams.get('code');
  const tokenHash = searchParams.get('token_hash');
  const type = searchParams.get('type');

  const supabase = await createSupabaseServerClient();

  // Solo mide: nada de lo que hace `landing` cambia a dónde se redirige.
  const landing = authLanding(
    request,
    code !== null ? 'pkce' : tokenHash !== null ? 'token_hash' : 'ninguno',
  );

  if (code !== null) {
    const { data, error } = await supabase.auth.exchangeCodeForSession(code);
    if (error) {
      landing.failed(error.code ?? error.name);
      return withTracking(landing, `${origin}/entrar?error=enlace-vencido`);
    }
    await adoptAnonymousTrail(request, data.user?.id ?? null);
    return withTracking(landing, `${origin}${conEntrada(next, data.user)}`, data.user);
  }

  if (tokenHash !== null && isEmailOtpType(type)) {
    const { data, error } = await supabase.auth.verifyOtp({
      type,
      token_hash: tokenHash,
    });
    if (error) {
      landing.failed(error.code ?? error.name);
      return withTracking(landing, `${origin}/entrar?error=enlace-vencido`);
    }
    await adoptAnonymousTrail(request, data.user?.id ?? null);
    return withTracking(landing, `${origin}${conEntrada(next, data.user)}`, data.user);
  }

  // Sin `code` ni `token_hash`: lo normal es que Supabase rechazara el enlace
  // antes (vencido o ya usado). El motivo lo deja en el FRAGMENTO de la URL,
  // que aquí no se ve; lo mide `/entrar` como `auth_link_error`.
  landing.failed(searchParams.get('error_code') ?? 'sin_codigo');
  return withTracking(landing, `${origin}/entrar?error=sin-codigo`);
}

/**
 * La redirección de siempre, más la medición (2026-10-07).
 *
 * Los eventos salen con `after()`: no hacen esperar a nadie para entrar. Y si
 * entró, deja la cookie con la que el navegador mide si llegó a donde iba
 * (`returned_to_origin`).
 */
function withTracking(
  landing: AuthLanding,
  to: string,
  user?: { readonly created_at?: string } | null,
): NextResponse {
  const response = NextResponse.redirect(to);
  if (user !== undefined) {
    landing.completed(esCuentaNueva(user));
    landing.markDone(response);
  }
  after(landing.flush);
  return response;
}
