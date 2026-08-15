import { type NextRequest, type NextResponse } from 'next/server';

/**
 * Identidad del visitante ANÓNIMO, para poder contarle el cupo antes de que
 * tenga cuenta.
 *
 * Es una cookie `httpOnly`: el JavaScript de la página no la puede leer ni
 * cambiar, solo el servidor. No es infalible —quien borre sus cookies estrena
 * cupo— pero ya no basta con abrir las herramientas del navegador y editar
 * `localStorage`, que es donde estábamos antes.
 */
export const VISITOR_COOKIE = 'elcharcu_vid';

const ONE_YEAR_SECONDS = 60 * 60 * 24 * 365;

/** ¿Esto que viene en la cookie tiene pinta de UUID? Nunca se confía a ciegas. */
function isUuid(value: string): boolean {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(value);
}

export function readVisitorId(request: NextRequest): string | null {
  const raw = request.cookies.get(VISITOR_COOKIE)?.value;
  if (raw === undefined || !isUuid(raw)) {
    return null;
  }
  return raw;
}

/** El de la cookie, o uno nuevo si no traía (o traía basura). */
export function ensureVisitorId(request: NextRequest): string {
  return readVisitorId(request) ?? crypto.randomUUID();
}

/** Deja la cookie puesta en la respuesta. Hay que llamarlo en cada salida. */
export function attachVisitorCookie(
  response: NextResponse,
  visitorId: string,
): NextResponse {
  response.cookies.set({
    name: VISITOR_COOKIE,
    value: visitorId,
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: ONE_YEAR_SECONDS,
  });
  return response;
}
