/**
 * Puerta pública de `auth-by-email` para el SERVIDOR. Usa `next/server` y las
 * cookies de la petición, así que no puede viajar al navegador.
 */
export { authLanding } from './lib/authLanding';
export type { AuthLanding } from './lib/authLanding';
export { authTriggerFrom } from './lib/authTrigger';
