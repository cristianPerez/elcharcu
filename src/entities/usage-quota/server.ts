/**
 * Puerta pública del cupo para el SERVIDOR.
 *
 * Separada de `./index` a propósito: esto usa la clave secreta de Supabase y
 * no puede viajar al navegador ni por accidente.
 */
export { consumeQuota, refundQuota, readQuota, linkVisitorToUser } from './api/quotaApi';
export type { ConsumeResult } from './api/quotaApi';
