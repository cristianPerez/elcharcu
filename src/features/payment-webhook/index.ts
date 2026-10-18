/**
 * El webhook de las pasarelas de pago (OnePay hoy). Solo para el servidor: lo
 * usa `app/api/webhooks/[proveedor]/route.ts`.
 */
export { handlePaymentWebhook } from './model/handlePaymentWebhook';
export type { WebhookResponse } from './model/handlePaymentWebhook';
