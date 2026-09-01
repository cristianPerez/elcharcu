import { type EmailOtpType } from '@supabase/supabase-js';
import { NextResponse, type NextRequest } from 'next/server';

import { linkVisitorToUser } from '@/entities/usage-quota/server';

import { createSupabaseServerClient } from '@/shared/api/supabase/server';
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
    return NextResponse.redirect(`${origin}${conEntrada(next, data.user)}`);
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
    return NextResponse.redirect(`${origin}${conEntrada(next, data.user)}`);
  }

  return NextResponse.redirect(`${origin}/entrar?error=sin-codigo`);
}

/**
 * Marca en la URL si esta entrada estrena cuenta o es alguien que vuelve.
 *
 * ⚠️ ESTE ES EL ÚNICO MOMENTO EN QUE SE PUEDE SABER, y es a propósito.
 * Preguntarle al servidor "¿existe este correo?" mientras se escribe en el muro
 * es justo lo que permite enumerar los usuarios de un sitio, y Supabase se
 * niega a contestarlo. Aquí ya abrió el enlace que le llegó a su buzón: la
 * cuenta es demostrablemente suya y decirlo no le abre la puerta a nadie.
 *
 * Cómo se distingue: `created_at` es cuando se pidió el enlace por primera vez
 * y `last_sign_in_at` es ahora mismo. En una cuenta recién nacida esos dos
 * momentos están a segundos; en alguien que vuelve, el alta es de días o
 * semanas atrás. El enlace caduca en una hora, así que no hay zona gris — para
 * caer del lado equivocado habría que haberse dado de alta hace menos de una
 * hora, que es precisamente ser nuevo.
 */
function conEntrada(next: string, user: { created_at?: string } | null): string {
  if (user?.created_at === undefined) {
    return next;
  }

  const nacio = new Date(user.created_at).getTime();
  const esNueva = Number.isFinite(nacio) && Date.now() - nacio < 60 * 60 * 1000;

  const url = new URL(next, 'https://x.invalid');
  url.searchParams.set('entrada', esNueva ? 'nueva' : 'vuelve');
  return `${url.pathname}${url.search}`;
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

  /*
    Solo queda atar el rastro del cupo. El `link_onboarding_to_user` que iba
    aquí se fue con `charcu.onboarding_answers` (2026-08-31): esa tabla existía
    para guardar respuestas de alguien SIN cuenta, y el onboarding se mudó
    detrás del login en la 0016. Desde entonces no la escribía nadie.
  */
  await linkVisitorToUser(visitorId, userId);
}
