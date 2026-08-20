import { NextResponse, type NextRequest } from 'next/server';

import { readQuota } from '@/entities/usage-quota/server';

import { currentUser } from '@/shared/api/supabase/server';
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

  // Atar el rastro anónimo a la cuenta se hacía AQUÍ, y por tanto en cada
  // llamada — o sea, en cada cambio de pestaña: dos escrituras a la base para
  // volver a atar lo que ya estaba atado. Ahora se hace una sola vez, en
  // `/auth/callback`, que es el único momento en que alguien deja de ser
  // anónimo.
  const user = await currentUser();
  const snapshot = await readQuota(visitorId, user?.id ?? null);

  if (snapshot === null) {
    return attachVisitorCookie(
      NextResponse.json({ error: 'cupo-no-disponible' }, { status: 503 }),
      visitorId,
    );
  }

  return attachVisitorCookie(NextResponse.json(snapshot), visitorId);
}
