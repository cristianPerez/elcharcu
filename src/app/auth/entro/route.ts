import { after, NextResponse, type NextRequest } from 'next/server';

import { authLanding } from '@/features/auth-by-email/server';

import { createSupabaseServerClient } from '@/shared/api/supabase/server';
import { safeDestination } from '@/shared/lib/access';

import { adoptAnonymousTrail, conEntrada, esCuentaNueva } from '../_lib/afterSignIn';

interface EntroBody {
  readonly next?: unknown;
}

function isEntroBody(value: unknown): value is EntroBody {
  return typeof value === 'object' && value !== null;
}

/**
 * Lo que hace el callback del enlace, para quien entró con el CÓDIGO de 6
 * dígitos (2026-10-30).
 *
 * El código lo verifica el NAVEGADOR con Supabase (`verifyOtp`), no este
 * servidor: así el límite de intentos de Supabase, que va por IP, sigue siendo
 * por persona. Si lo verificara aquí, todas las peticiones saldrían de la IP de
 * Vercel y un solo intruso agotaría los intentos de todos.
 *
 * Cuando ya hay sesión, el navegador llama aquí para lo demás: el rastro
 * anónimo pasa a su cuenta, se mide `auth_completed` (`flow: 'codigo'`) y se le
 * dice a dónde ir, con `?entrada=nueva|vuelve` como el enlace.
 *
 * Sin sesión responde 401 y no hace nada: llamarla no abre la puerta a nadie.
 */
export async function POST(request: NextRequest): Promise<NextResponse> {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user === null) {
    return NextResponse.json({ error: 'sin-sesion' }, { status: 401 });
  }

  const body: unknown = await request.json().catch(() => null);
  const rawNext = isEntroBody(body) && typeof body.next === 'string' ? body.next : null;
  const next = safeDestination(rawNext);

  await adoptAnonymousTrail(request, user.id);

  const landing = authLanding(request, 'codigo');
  landing.completed(esCuentaNueva(user));
  const response = NextResponse.json({ to: conEntrada(next, user) });
  landing.markDone(response);
  after(landing.flush);
  return response;
}
