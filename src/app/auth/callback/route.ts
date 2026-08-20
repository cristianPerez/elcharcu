import { type EmailOtpType } from '@supabase/supabase-js';
import { NextResponse, type NextRequest } from 'next/server';

import { linkVisitorToUser } from '@/entities/usage-quota/server';

import {
  createSupabaseAdminClient,
  createSupabaseServerClient,
  isSupabaseAdminConfigured,
} from '@/shared/api/supabase/server';
import { readVisitorId } from '@/shared/api/visitor';
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
    const { data, error } = await supabase.auth.exchangeCodeForSession(code);
    if (error) {
      return NextResponse.redirect(`${origin}/entrar?error=enlace-vencido`);
    }
    await adoptAnonymousTrail(request, data.user?.id ?? null);
    return NextResponse.redirect(`${origin}${next}`);
  }

  if (tokenHash !== null && isEmailOtpType(type)) {
    const { data, error } = await supabase.auth.verifyOtp({
      type,
      token_hash: tokenHash,
    });
    if (error) {
      return NextResponse.redirect(`${origin}/entrar?error=enlace-vencido`);
    }
    await adoptAnonymousTrail(request, data.user?.id ?? null);
    return NextResponse.redirect(`${origin}${next}`);
  }

  return NextResponse.redirect(`${origin}/entrar?error=sin-codigo`);
}

/**
 * Lo que hizo de anónimo pasa a ser suyo: cupo, recetas y onboarding.
 *
 * Vive AQUÍ, en el único momento en que alguien deja de ser anónimo, y no en
 * `/api/cupo` como antes. Allí se ejecutaba en cada llamada —o sea, en cada
 * cambio de pestaña— y eran dos escrituras a la base para volver a atar lo que
 * ya estaba atado desde el primer segundo.
 *
 * Si algo falla no se corta la entrada. Perder el rastro anónimo es una
 * molestia; dejar a alguien fuera de su cuenta con el enlace del correo ya
 * gastado es mucho peor.
 */
async function adoptAnonymousTrail(
  request: NextRequest,
  userId: string | null,
): Promise<void> {
  if (userId === null) {
    return;
  }

  const visitorId = readVisitorId(request);
  if (visitorId === null) {
    return;
  }

  await linkVisitorToUser(visitorId, userId);

  if (!isSupabaseAdminConfigured()) {
    return;
  }

  const { error } = await createSupabaseAdminClient().rpc('link_onboarding_to_user', {
    p_visitor_id: visitorId,
    p_user_id: userId,
  });

  if (error !== null) {
    console.error('[entrar] no se pudo atar el onboarding a la cuenta:', error.message);
  }
}
