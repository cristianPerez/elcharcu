/**
 * Puerta pública para el SERVIDOR (Server Components, route handlers, acciones).
 *
 * Está separada de `./index` a propósito: usa `next/headers`, que no puede
 * viajar al navegador. Nunca importes este archivo desde un componente cliente.
 */
export { createSupabaseServerClient } from './serverClient';
export type { SupabaseServerClient } from './serverClient';
