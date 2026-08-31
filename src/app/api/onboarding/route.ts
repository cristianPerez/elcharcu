import { NextResponse, type NextRequest } from 'next/server';

import {
  createSupabaseAdminClient,
  createSupabaseServerClient,
  isSupabaseAdminConfigured,
} from '@/shared/api/supabase/server';
import { attachVisitorCookie, ensureVisitorId } from '@/shared/api/visitor';
import { parseInterests } from '@/shared/config';

/**
 * Guarda las respuestas del onboarding contra el visitante.
 *
 * Se llama en CADA paso, no solo al final: la mitad de la gente abandona a
 * medias, y saber que alguien es de México y va por "salame" ya vale, aunque
 * nunca termine. El día que cree la cuenta, esas respuestas se atan a ella.
 */

const MAX_FIELD = 40;
/** Un nombre completo no cabe en 40; "María Fernanda Restrepo Ochoa" son 29. */
const MAX_NAME = 80;
/** +57 300 123 45 67 con separadores, y aire de sobra para otros países. */
const MAX_PHONE = 24;

function clean(value: unknown, max: number = MAX_FIELD): string | null {
  if (typeof value !== 'string') {
    return null;
  }
  const trimmed = value.trim().slice(0, max);
  return trimmed === '' ? null : trimmed;
}

export async function POST(request: NextRequest): Promise<NextResponse> {
  const visitorId = ensureVisitorId(request);
  const payload: unknown = await request.json().catch(() => null);

  if (typeof payload !== 'object' || payload === null) {
    return attachVisitorCookie(
      NextResponse.json({ error: 'datos-invalidos' }, { status: 400 }),
      visitorId,
    );
  }

  const { country, level, product, fullName, whatsapp, interests, consent } =
    payload as Record<string, unknown>;

  const phone = clean(whatsapp, MAX_PHONE);

  // ⚠️ El teléfono es dato personal (Ley 1581 de 2012). Sin la casilla marcada
  // no se guarda: un número sin permiso no se puede usar para nada, así que
  // guardarlo solo sería quedarse el riesgo sin quedarse el beneficio.
  const consented = consent === true;
  const acceptedPhone = consented ? phone : null;

  if (!isSupabaseAdminConfigured()) {
    // Sin base no se guarda, pero el onboarding NO se rompe: el visitante
    // sigue su camino y el dato se pierde. Perder un dato es molesto; dejarlo
    // atascado en la pantalla 2 de 3 es peor.
    return attachVisitorCookie(NextResponse.json({ ok: false }), visitorId);
  }

  const supabase = await createSupabaseServerClient();
  const { data: authData } = await supabase.auth.getUser();

  const { error } = await createSupabaseAdminClient().rpc('save_onboarding', {
    p_visitor_id: visitorId,
    p_user_id: authData.user?.id ?? (null as unknown as string),
    p_country: clean(country) as string,
    p_level: clean(level) as string,
    p_product: clean(product) as string,
    p_full_name: clean(fullName, MAX_NAME) as string,
    p_whatsapp: acceptedPhone as string,
    // `{}` y no null: la función distingue el array vacío ("este paso no sabe
    // nada de intereses") de una lista real, y con `nullif` no pisa lo ya
    // guardado. Ver la 0014.
    p_interests: parseInterests(interests),
    // Solo hay fecha si además hay algo que autorizar.
    p_consent_at:
      consented && acceptedPhone !== null
        ? new Date().toISOString()
        : (null as unknown as string),
  });

  if (error !== null) {
    console.error('[onboarding] no se pudo guardar:', error.message);
    return attachVisitorCookie(NextResponse.json({ ok: false }), visitorId);
  }

  return attachVisitorCookie(NextResponse.json({ ok: true }), visitorId);
}
