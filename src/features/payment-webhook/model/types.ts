/**
 * El contrato que cumple CUALQUIER pasarela de pago (copiado de Manos
 * Creadoras, `lib/webhooks/tipos.ts`, 2026-10-17).
 *
 * ⚠️ ESTA CAPA EXISTE PORQUE LA PASARELA YA CAMBIÓ UNA VEZ (Hotmart → OnePay,
 * D17 → D21). Lo que cambia entre pasarelas es poco: cómo se firma la petición
 * y cómo se llaman los campos. Guardar el evento, no procesarlo dos veces y
 * mover la fecha de vencimiento es igual. Añadir una pasarela = un archivo que
 * cumpla `PaymentProvider` y una línea en `providers.ts`.
 */

/**
 * Lo que la app entiende, sin saber de quién vino.
 *
 * ⚠️ Es la MISMA lista que el `check` de `charcu.webhook_eventos.tipo`
 * (migración 0050): se mueven juntas o la ruta devuelve 500.
 */
export type PaymentEventType =
  | 'suscripcion.pagada'
  | 'suscripcion.cancelada'
  /** Le rebotó la tarjeta en la renovación. */
  | 'suscripcion.impagada'
  | 'suscripcion.vencida'
  | 'desconocido';

export interface NormalizedPaymentEvent {
  /** El nombre del evento tal cual lo manda la pasarela: "subscription.paid". */
  readonly evento: string;
  readonly tipo: PaymentEventType;
  /** El id del recurso en la pasarela (la suscripción, el pago…). */
  readonly recursoId: string;
  /**
   * El correo de quien paga, si la pasarela lo manda. ⚠️ Es el único puente
   * hasta la cuenta la primera vez: el enlace de cobro es genérico.
   */
  readonly correo: string | null;
  /**
   * El teléfono del checkout. ⚠️ El checkout de OnePay pide WhatsApp y NO el
   * correo (llega `hola@onepay.ai`), así que es el segundo puente: se cruza
   * con el WhatsApp del perfil.
   */
  readonly telefono: string | null;
  /** El id del cliente EN LA PASARELA. No es nuestro `user_id`. */
  readonly clienteId: string | null;
  /** El id del plan en la pasarela: con él se sabe si es el mensual o el anual. */
  readonly planExternoId: string | null;
  /** Hasta cuándo está pagado (la próxima cobranza). Solo en un pago. */
  readonly venceEl: string | null;
  /** Cuándo se cobró. Si no llega `venceEl`, el vencimiento se calcula de aquí. */
  readonly pagadoEl: string | null;
  /**
   * ⚠️ Lo que distingue una ocurrencia de un reintento: cambia entre el pago
   * de enero y el de febrero de la MISMA suscripción, pero no entre los
   * reintentos de uno solo. La próxima cobranza o el id del cobro cumplen las dos.
   */
  readonly marca: string | null;
}

export type VerificationResult =
  { readonly valido: true } | { readonly valido: false; readonly motivo: string };

export interface PaymentProvider {
  /** Su nombre en la URL y en la base: "onepay". */
  readonly nombre: string;
  /**
   * ¿Este mensaje es suyo? Recibe el cuerpo CRUDO: la firma se calcula sobre
   * esos bytes exactos, y `JSON.parse` + `JSON.stringify` los cambia.
   */
  verificar(cabeceras: Headers, cuerpoCrudo: string): VerificationResult;
  /** Su vocabulario → el nuestro. `null` si el cuerpo no tiene la forma esperada. */
  leer(cuerpo: unknown): NormalizedPaymentEvent | null;
}
