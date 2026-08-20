/**
 * Puerta pública para el SERVIDOR (Server Components, route handlers, acciones).
 *
 * Está separada de `./index` a propósito: usa `next/headers` y la clave secreta,
 * y ninguna de las dos cosas puede viajar al navegador. Nunca importes este
 * archivo desde un componente cliente.
 */
export { createSupabaseServerClient } from './serverClient';
export { currentUser } from './currentUser';
export type { CurrentUser } from './currentUser';
export type { SupabaseServerClient } from './serverClient';
export { createSupabaseAdminClient, isSupabaseAdminConfigured } from './adminClient';
export type { SupabaseAdminClient } from './adminClient';
