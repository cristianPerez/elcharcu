import { NextResponse, type NextRequest } from 'next/server';

import {
  createSupabaseAdminClient,
  createSupabaseServerClient,
  isSupabaseAdminConfigured,
} from '@/shared/api/supabase/server';
import { attachVisitorCookie, ensureVisitorId } from '@/shared/api/visitor';

/**
 * Guarda las respuestas del onboarding contra el visitante.
 *
 * Se llama en CADA paso, no solo al final: la mitad de la gente abandona a
 * medias, y saber que alguien es de México y va por "salame" ya vale, aunque
 * nunca termine. El día que cree la cuenta, esas respuestas se atan a ella.
 */

const MAX_FIELD = 40;

function clean(value: unknown): string | null {
  if (typeof value !== 'string') {
    return null;
  }
  const trimmed = value.trim().slice(0, MAX_FIELD);
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

  const { country, level, product } = payload as Record<string, unknown>;

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
  });

  if (error !== null) {
    console.error('[onboarding] no se pudo guardar:', error.message);
    return attachVisitorCookie(NextResponse.json({ ok: false }), visitorId);
  }

  return attachVisitorCookie(NextResponse.json({ ok: true }), visitorId);
}
