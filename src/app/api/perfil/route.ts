import { NextResponse, type NextRequest } from 'next/server';

import { createSupabaseServerClient } from '@/shared/api/supabase/server';
import { parseInterests } from '@/shared/config';

/**
 * El perfil del usuario: cerrarlo la primera vez (POST) y cambiarlo después
 * (PATCH).
 *
 * Las dos usan el cliente CON SESIÓN, no la clave de servicio. Nadie escribe
 * el perfil de otro: `complete_onboarding` saca el `auth.uid()` por dentro, y
 * el `update` lo acota `profiles_update_own`. Con la clave de servicio habría
 * que confiar en un `userId` del cuerpo, que es justo lo que no se hace.
 */

const MAX_NAME = 80;
const MAX_PHONE = 24;

function clean(value: unknown, max: number): string {
  return typeof value === 'string' ? value.trim().slice(0, max) : '';
}

/** Cierra el onboarding: escribe todo y pone el flag en 'listo'. */
export async function POST(request: NextRequest): Promise<NextResponse> {
  const payload: unknown = await request.json().catch(() => null);

  if (typeof payload !== 'object' || payload === null) {
    return NextResponse.json({ error: 'datos-invalidos' }, { status: 400 });
  }

  const { fullName, interests, whatsapp, consent } = payload as Record<string, unknown>;
  const chosen = parseInterests(interests);

  if (chosen.length === 0) {
    return NextResponse.json({ error: 'faltan-intereses' }, { status: 400 });
  }

  const supabase = await createSupabaseServerClient();
  const { data: auth } = await supabase.auth.getUser();

  if (auth.user === null) {
    return NextResponse.json({ error: 'sin-sesion' }, { status: 401 });
  }

  const { error } = await supabase.rpc('complete_onboarding', {
    p_full_name: clean(fullName, MAX_NAME),
    p_interests: chosen,
    p_whatsapp: clean(whatsapp, MAX_PHONE),
    // ⚠️ Sin la casilla, el número no se guarda. Lo vuelve a comprobar la
    // función en Postgres: un teléfono sin permiso no se puede usar para nada
    // (Ley 1581), así que guardarlo sería quedarse el riesgo sin el beneficio.
    p_consent: consent === true,
  });

  if (error !== null) {
    console.error('[perfil] no se pudo cerrar el onboarding:', error.message);
    return NextResponse.json({ error: 'no-se-pudo-guardar' }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}

/** Cambiar nombre e intereses desde la pantalla de cuenta. */
export async function PATCH(request: NextRequest): Promise<NextResponse> {
  const payload: unknown = await request.json().catch(() => null);

  if (typeof payload !== 'object' || payload === null) {
    return NextResponse.json({ error: 'datos-invalidos' }, { status: 400 });
  }

  const { fullName, interests } = payload as Record<string, unknown>;
  const chosen = parseInterests(interests);

  // Dejarse sin intereses no es un cambio válido: son lo que usa el Charcu AI
  // para saber de qué hablarle. La pantalla ya lo impide; esto es el cinturón.
  if (chosen.length === 0) {
    return NextResponse.json({ error: 'faltan-intereses' }, { status: 400 });
  }

  const supabase = await createSupabaseServerClient();
  const { data: auth } = await supabase.auth.getUser();

  if (auth.user === null) {
    return NextResponse.json({ error: 'sin-sesion' }, { status: 401 });
  }

  const name = clean(fullName, MAX_NAME);

  const { error } = await supabase
    .from('profiles')
    .update({
      interests: chosen,
      // Un nombre en blanco no borra el que había: es más probable que sea un
      // campo que se vació sin querer que una decisión de no llamarse nada.
      ...(name === '' ? {} : { full_name: name }),
    })
    .eq('id', auth.user.id);

  if (error !== null) {
    console.error('[perfil] no se pudo actualizar:', error.message);
    return NextResponse.json({ error: 'no-se-pudo-guardar' }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
