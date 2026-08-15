import { NextResponse, type NextRequest } from 'next/server';

import { linkVisitorToUser, readQuota } from '@/entities/usage-quota/server';

import { createSupabaseServerClient } from '@/shared/api/supabase/server';
import { attachVisitorCookie, ensureVisitorId } from '@/shared/api/visitor';

/**
 * Cuánto cupo le queda a quien pregunta.
 *
 * Es la primera parada de la portada: además de contestar, deja puesta la
 * cookie del visitante, que es lo que permite contarle el cupo a alguien que
 * todavía no tiene cuenta.
 */
export async function GET(request: NextRequest): Promise<NextResponse> {
  const visitorId = ensureVisitorId(request);

  const supabase = await createSupabaseServerClient();
  const { data } = await supabase.auth.getUser();
  const userId = data.user?.id ?? null;

  // Si acaba de entrar con su correo, sus contadores de antes se atan a la
  // cuenta. A partir de aquí el cupo se cuenta por cuenta, no por navegador.
  if (userId !== null) {
    await linkVisitorToUser(visitorId, userId);
  }

  const snapshot = await readQuota(visitorId, userId);

  if (snapshot === null) {
    return attachVisitorCookie(
      NextResponse.json({ error: 'cupo-no-disponible' }, { status: 503 }),
      visitorId,
    );
  }

  return attachVisitorCookie(NextResponse.json(snapshot), visitorId);
}
