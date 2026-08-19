import { type EmailOtpType } from '@supabase/supabase-js';
import { NextResponse, type NextRequest } from 'next/server';

import { createSupabaseServerClient } from '@/shared/api/supabase/server';
import { appRoutes } from '@/shared/config';

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
  if (value === null || !value.startsWith('/') || value.startsWith('//')) {
    return appRoutes.appAssistant;
  }
  return value;
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

  if (code !== null) {
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    return error
      ? NextResponse.redirect(`${origin}/entrar?error=enlace-vencido`)
      : NextResponse.redirect(`${origin}${next}`);
  }

  if (tokenHash !== null && isEmailOtpType(type)) {
    const { error } = await supabase.auth.verifyOtp({ type, token_hash: tokenHash });
    return error
      ? NextResponse.redirect(`${origin}/entrar?error=enlace-vencido`)
      : NextResponse.redirect(`${origin}${next}`);
  }

  return NextResponse.redirect(`${origin}/entrar?error=sin-codigo`);
}
