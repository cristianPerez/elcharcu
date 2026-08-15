import { type BillingCycle, type Plan, type PlanPrice } from './plan.types';

/**
 * DOS planes y nada más: el gratis y el de pago (2026-08-14).
 *
 * El de pago se cobra al mes o al año — es el mismo plan, con el mismo cupo,
 * y el año solo cambia el precio. Antes eran tres tarjetas y la del anual
 * competía con la del mensual en vez de complementarla.
 *
 * Los cupos tienen que coincidir con `charcu.plan_quotas`: la pantalla promete
 * y la base cumple. Cuentas detrás de los números en ESTADO.md.
 */

const MONTHLY_COP = 29900;
const YEARLY_COP = 239000;

/** El año sale por 8 mensualidades: se regalan 4 meses, un 33%. */
const YEARLY_PER_MONTH_COP = Math.round(YEARLY_COP / 12);
const YEARLY_SAVING_PERCENT = Math.round((1 - YEARLY_PER_MONTH_COP / MONTHLY_COP) * 100);

export const proPrices: readonly PlanPrice[] = [
  {
    cycle: 'mensual',
    priceCop: MONTHLY_COP,
    perMonthCop: MONTHLY_COP,
    billingId: 'mensual',
    note: 'Cancelas cuando quieras, desde la app.',
    savingPercent: 0,
  },
  {
    cycle: 'anual',
    priceCop: YEARLY_COP,
    perMonthCop: YEARLY_PER_MONTH_COP,
    billingId: 'anual',
    note: 'Un solo cobro al año. Precio congelado por 12 meses.',
    savingPercent: YEARLY_SAVING_PERCENT,
  },
];

export const plans: readonly Plan[] = [
  {
    id: 'aprendiz',
    name: 'Aprendiz',
    quota: { questionsPerMonth: 8, imagesPerMonth: 2 },
    pitch: 'Para probar el asistente con una duda de verdad.',
    features: [
      'La primera pregunta sin registrarte, sin dar nada',
      '8 preguntas al mes dejando nombre, correo y WhatsApp',
      '2 fotos al mes para diagnóstico de moho',
      'Dosis de sal de cura siempre revisada por seguridad',
      'Dos videos de introducción de los cursos',
    ],
    ctaLabel: 'Preguntar gratis',
    prices: [],
    note: 'Sin tarjeta. En serio.',
    isHighlighted: false,
  },
  {
    id: 'pro',
    name: 'El Charcu Pro',
    quota: { questionsPerMonth: 200, imagesPerMonth: 30 },
    pitch: 'Para el que ya cura seguido y no quiere perder una pieza más.',
    features: [
      '200 preguntas al mes — unas 6 o 7 al día',
      '30 fotos al mes para revisar moho, color y textura',
      'Todos los mini-cursos en video, completos',
      'Ajuste por tu clima, tu región y tu temporada',
      'Costo por porción y precio sugerido si vendes',
      'Tu historial guardado durante todo el curado',
    ],
    ctaLabel: 'Suscribirme',
    prices: proPrices,
    note: '',
    isHighlighted: true,
  },
];

export const freePlan = plans[0] as Plan;
export const proPlan = plans[1] as Plan;

/** El precio del plan para el ciclo elegido. `null` si el plan es gratis. */
export function priceFor(plan: Plan, cycle: BillingCycle): PlanPrice | null {
  return plan.prices.find((price) => price.cycle === cycle) ?? null;
}

/** Compra por una sola vez, para quien no quiere suscripción. */
export const oneTimeCourseCop = 89000;
