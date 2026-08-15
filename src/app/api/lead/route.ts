import { NextResponse, type NextRequest } from 'next/server';

import { readQuota } from '@/entities/usage-quota/server';

import {
  createSupabaseAdminClient,
  createSupabaseServerClient,
  isSupabaseAdminConfigured,
} from '@/shared/api/supabase/server';
import { attachVisitorCookie, ensureVisitorId } from '@/shared/api/visitor';

/** Tope defensivo: nadie necesita un nombre de 500 letras. */
const MAX_FIELD = 120;

interface LeadPayload {
  readonly name: string;
  readonly email: string;
  readonly whatsapp: string;
}

function parseLead(value: unknown): LeadPayload | null {
  if (typeof value !== 'object' || value === null) {
    return null;
  }

  const { name, email, whatsapp } = value as Record<string, unknown>;

  if (typeof name !== 'string' || typeof email !== 'string') {
    return null;
  }
  if (typeof whatsapp !== 'string') {
    return null;
  }

  const clean = {
    name: name.trim().slice(0, MAX_FIELD),
    email: email.trim().toLowerCase().slice(0, MAX_FIELD),
    whatsapp: whatsapp.trim().slice(0, MAX_FIELD),
  };

  if (clean.name === '' || !clean.email.includes('@') || clean.whatsapp === '') {
    return null;
  }

  return clean;
}

/**
 * Guarda nombre, correo y WhatsApp del muro blando (D16).
 *
 * ⚠️ Son datos personales: Ley 1581 de 2012 (Colombia). El formulario lleva la
 * nota de privacidad visible y el usuario puede pedir que se borren.
 */
export async function POST(request: NextRequest): Promise<NextResponse> {
  const visitorId = ensureVisitorId(request);
  const payload: unknown = await request.json().catch(() => null);
  const lead = parseLead(payload);

  if (lead === null) {
    return attachVisitorCookie(
      NextResponse.json({ error: 'datos-invalidos' }, { status: 400 }),
      visitorId,
    );
  }

  if (!isSupabaseAdminConfigured()) {
    return attachVisitorCookie(
      NextResponse.json({ error: 'sin-base-de-datos' }, { status: 503 }),
      visitorId,
    );
  }

  const supabase = await createSupabaseServerClient();
  const { data: authData } = await supabase.auth.getUser();
  const userId = authData.user?.id ?? null;

  // Cuánto lleva usado se lee de la base, no de lo que diga el navegador.
  const quota = await readQuota(visitorId, userId);

  const { error } = await createSupabaseAdminClient()
    .from('leads')
    .insert({
      name: lead.name,
      email: lead.email,
      whatsapp: lead.whatsapp,
      visitor_id: visitorId,
      user_id: userId,
      questions_used: quota?.questionsUsed ?? 0,
      images_used: quota?.imagesUsed ?? 0,
    });

  if (error !== null) {
    console.error('[lead] no se pudo guardar:', error.message);
    return attachVisitorCookie(
      NextResponse.json({ error: 'no-se-pudo-guardar' }, { status: 500 }),
      visitorId,
    );
  }

  return attachVisitorCookie(NextResponse.json({ ok: true }), visitorId);
}
