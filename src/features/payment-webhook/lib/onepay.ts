import { createHmac, timingSafeEqual } from 'node:crypto';

import {
  type NormalizedPaymentEvent,
  type PaymentEventType,
  type PaymentProvider,
  type VerificationResult,
} from '../model/types';

/**
 * OnePay (copiado de Manos Creadoras, `lib/webhooks/onepay.ts`, donde está
 * probado de punta a punta). Documentación:
 * https://docs.onepay.la/guides/implementar-webhooks
 */

type Fields = Readonly<Record<string, unknown>>;

function asFields(value: unknown): Fields | null {
  return typeof value === 'object' && value !== null ? (value as Fields) : null;
}

function asString(value: unknown): string | null {
  return typeof value === 'string' && value !== '' ? value : null;
}

/** Compara sin filtrar cuánto coincide por el tiempo que tarda. */
function safeEqual(a: string | null, b: string): boolean {
  const left = Buffer.from(a ?? '');
  const right = Buffer.from(b);
  // `timingSafeEqual` revienta si las longitudes difieren.
  return left.length === right.length && timingSafeEqual(left, right);
}

/*
 * Su vocabulario → el nuestro. ⚠️ El panel ofrece más eventos de los que
 * documentan; se cubren las variantes razonables y el que no acierte cae en
 * 'desconocido', se guarda igual y se ve en la tabla.
 */
const TYPES: Readonly<Record<string, PaymentEventType>> = {
  'subscription.paid': 'suscripcion.pagada',
  'subscription.canceled': 'suscripcion.cancelada',
  'subscription.unpaid': 'suscripcion.impagada',
  'subscription.payment_failed': 'suscripcion.impagada',
  'subscription.past_due': 'suscripcion.impagada',
  'subscription.pass_due': 'suscripcion.impagada',
  'subscription.frozen': 'suscripcion.impagada',
  'subscription.expired': 'suscripcion.vencida',
  'subscription.ended': 'suscripcion.vencida',
  'subscription.finished': 'suscripcion.vencida',
  // ⚠️ `created` NO activa nada: una suscripción creada todavía no se cobró.
  // El acceso lo abre el PAGO; si no, quien abandona con la tarjeta rechazada
  // entraría igual.
  'subscription.created': 'desconocido',
};

/**
 * ⚠️ SU DOCUMENTACIÓN SE CONTRADICE y hay que aguantar las dos formas:
 *   la guía:    { "payment": {…}, "event": { "type": "…" } }
 *   ejemplos:   { "event": "subscription.paid", "data": {…} }
 */
function eventAndData(body: Fields): { evento: string; datos: Fields } | null {
  const event = body.event;
  if (typeof event === 'string') {
    const datos = asFields(body.data);
    return datos === null ? null : { evento: event, datos };
  }
  const nested = asFields(event);
  const evento = asString(nested?.type);
  const datos =
    asFields(body.subscription) ?? asFields(body.payment) ?? asFields(body.charge);
  return evento === null || datos === null ? null : { evento, datos };
}

export const onepay: PaymentProvider = {
  nombre: 'onepay',

  verificar(cabeceras, cuerpoCrudo): VerificationResult {
    const secret = process.env.ONEPAY_WEBHOOK_SECRET ?? '';
    const token = process.env.ONEPAY_WEBHOOK_TOKEN ?? '';

    // ⚠️ FALLAR CERRADO: sin las claves, dejarlo pasar sería que cualquiera
    // que conozca la URL active suscripciones gratis.
    if (secret === '' || token === '') {
      return {
        valido: false,
        motivo: 'faltan ONEPAY_WEBHOOK_SECRET y/o ONEPAY_WEBHOOK_TOKEN',
      };
    }
    // ⚠️ SON DOS PUERTAS: el token identifica el endpoint; la firma demuestra
    // que el cuerpo no se tocó por el camino.
    if (!safeEqual(cabeceras.get('x-webhook-token'), token)) {
      return { valido: false, motivo: 'x-webhook-token no coincide' };
    }
    const expected = createHmac('sha256', secret).update(cuerpoCrudo).digest('hex');
    if (!safeEqual(cabeceras.get('signature'), expected)) {
      return { valido: false, motivo: 'la firma no coincide' };
    }
    return { valido: true };
  },

  leer(cuerpo): NormalizedPaymentEvent | null {
    const body = asFields(cuerpo);
    const parsed = body === null ? null : eventAndData(body);
    if (body === null || parsed === null) {
      return null;
    }
    const { evento, datos } = parsed;
    const recursoId = asString(datos.id);
    if (recursoId === null) {
      return null;
    }

    // El correo puede venir de varias formas según el evento: se buscan todas.
    const customer = asFields(datos.customer);
    const correo = [
      datos.email,
      datos.customer_email,
      customer?.email,
      asFields(body.customer)?.email,
    ]
      .map(asString)
      .find((value) => value !== null && value.includes('@'));

    const plan = asFields(datos.plan);
    const tipo = TYPES[evento] ?? 'desconocido';
    const proximaCobranza = asString(datos.next_billing_at);

    return {
      evento,
      tipo,
      recursoId,
      correo: correo?.toLowerCase().trim() ?? null,
      clienteId: asString(datos.customer_id) ?? asString(customer?.id),
      planExternoId: asString(datos.plan_id) ?? asString(plan?.id),
      // ⚠️ SOLO UN PAGO MUEVE EL VENCIMIENTO: quien cancela conserva el acceso
      // hasta el final del período que ya pagó.
      venceEl: tipo === 'suscripcion.pagada' ? proximaCobranza : null,
      marca: proximaCobranza ?? asString(datos.canceled_at),
    };
  },
};
