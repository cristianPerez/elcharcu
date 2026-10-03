import { NextResponse, type NextRequest } from 'next/server';

import { createSupabaseServerClient } from '@/shared/api/supabase/server';
import { parseInterests } from '@/shared/config';
import { reportError } from '@/shared/lib';

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
    reportError('perfil', 'no se pudo cerrar el onboarding', { detail: error.message });
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

  /*
    Cambios PARCIALES (rediseño 2026-10): "Mi cuenta" guarda cada cosa al
    tocarla —un interés, un interruptor, el nombre—, así que llega solo lo que
    cambió. Lo que no viene, no se toca.

    Los intereses, si vienen, no pueden quedar vacíos: el prompt del asistente
    y "Qué quieres aprender" cuentan con al menos uno.
  */
  const fields = payload as Record<string, unknown>;
  const update: {
    full_name?: string;
    interests?: string[];
    notify_step_reminders?: boolean;
    notify_new_courses?: boolean;
    notify_news?: boolean;
  } = {};

  if ('interests' in fields) {
    const chosen = parseInterests(fields.interests);
    if (chosen.length === 0) {
      return NextResponse.json({ error: 'faltan-intereses' }, { status: 400 });
    }
    update.interests = chosen;
  }

  const name = clean(fields.fullName, MAX_NAME);
  if (name !== '') {
    update.full_name = name;
  }

  const flags = [
    ['notifyStepReminders', 'notify_step_reminders'],
    ['notifyNewCourses', 'notify_new_courses'],
    ['notifyNews', 'notify_news'],
  ] as const;
  for (const [key, column] of flags) {
    const value = fields[key];
    if (typeof value === 'boolean') {
      update[column] = value;
    }
  }

  if (Object.keys(update).length === 0) {
    return NextResponse.json({ error: 'datos-invalidos' }, { status: 400 });
  }

  const supabase = await createSupabaseServerClient();
  const { data: auth } = await supabase.auth.getUser();

  if (auth.user === null) {
    return NextResponse.json({ error: 'sin-sesion' }, { status: 401 });
  }

  const { error } = await supabase.from('profiles').update(update).eq('id', auth.user.id);

  if (error !== null) {
    reportError('perfil', 'no se pudo actualizar el perfil', { detail: error.message });
    return NextResponse.json({ error: 'no-se-pudo-guardar' }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
