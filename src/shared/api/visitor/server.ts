import { cookies } from 'next/headers';

import { VISITOR_COOKIE } from './visitorId';

/** ¿Esto que viene en la cookie tiene pinta de UUID? Nunca se confía a ciegas. */
const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/**
 * El identificador del visitante, leído desde un Server Component.
 *
 * Hermano de `readVisitorId`, que necesita el `NextRequest` y por eso solo
 * sirve en middleware y rutas de API. Aquí se lee de `next/headers`, que es lo
 * único disponible al pintar una página — y por eso vive en su propio archivo:
 * `next/headers` no puede colarse en el paquete del navegador.
 */
export async function readVisitorIdFromCookies(): Promise<string | null> {
  const raw = (await cookies()).get(VISITOR_COOKIE)?.value;
  return raw !== undefined && UUID.test(raw) ? raw : null;
}
