import { type BillingCycle, type Plan, type PlanPrice } from './plan.types';

/**
 * TRES planes: el gratis, el de en medio y uno grande (2026-08-15).
 *
 * El de en medio es el que se quiere vender, y el grande está para que se
 * entienda que lo es. Con solo dos opciones no hay contra qué comparar; con
 * una tercera cara al lado, el de en medio deja de ser "el que cuesta dinero"
 * y pasa a ser "el que está bien de precio".
 *
 * ⚠️ Los precios están en DÓLARES por decisión de Cristian (2026-08-14), en
 * contra de D4. Ojo: el propio ESTADO documenta que la desconfianza hacia las
 * suscripciones en dólares es la objeción nº1 de este mercado.
 *
 * El ciclo por defecto es el ANUAL, también a propósito: lo primero que se ve
 * es el precio por mes más bajo.
 *
 * Los cupos tienen que coincidir con `charcu.plan_quotas`: la pantalla promete
 * y la base cumple.
 */

/**
 * Los precios se escriben a mano, no se calculan.
 *
 * Pagar el año cuesta unas 9 mensualidades —se regalan 3 meses, un 25%— pero
 * el redondeo es una decisión comercial: 9 × 9,99 da 89,91 y el precio que se
 * vende es 89,90. Calcularlo dejaba en la web un céntimo que nadie eligió.
 */
const PRO_MONTHLY_USD = 9.99;
const PRO_YEARLY_USD = 89.9;
const MAESTRO_MONTHLY_USD = 24.99;
const MAESTRO_YEARLY_USD = 224.9;

function pricesFor(
  monthlyUsd: number,
  yearlyUsd: number,
  idPrefix: string,
): readonly PlanPrice[] {
  const perMonthUsd = yearlyUsd / 12;

  return [
    {
      cycle: 'anual',
      priceUsd: yearlyUsd,
      perMonthUsd,
      billingId: `${idPrefix}-anual`,
      note: 'Un solo cobro al año. Precio congelado por 12 meses.',
      savingPercent: Math.round((1 - perMonthUsd / monthlyUsd) * 100),
    },
    {
      cycle: 'mensual',
      priceUsd: monthlyUsd,
      perMonthUsd: monthlyUsd,
      billingId: `${idPrefix}-mensual`,
      note: 'Cancelas cuando quieras, desde la app.',
      savingPercent: 0,
    },
  ];
}

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
    ],
    ctaLabel: 'Probar gratis',
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
      'Tu historial guardado durante todo el curado',
    ],
    ctaLabel: 'Suscribirme',
    prices: pricesFor(PRO_MONTHLY_USD, PRO_YEARLY_USD, 'pro'),
    note: '',
    isHighlighted: true,
  },
  {
    id: 'maestro',
    name: 'El Charcu Maestro',
    quota: { questionsPerMonth: 600, imagesPerMonth: 90 },
    pitch: 'Para charcutería profesional: si de esto vives, no se te para la línea.',
    features: [
      'El triple de todo: 600 preguntas y 90 fotos al mes',
      'Todo lo del plan El Charcu Pro',
      'Costo por porción y precio sugerido de venta',
      'Escalado de recetas a lotes grandes',
      'Respuesta prioritaria por WhatsApp cuando se complique',
    ],
    ctaLabel: 'Suscribirme',
    prices: pricesFor(MAESTRO_MONTHLY_USD, MAESTRO_YEARLY_USD, 'maestro'),
    note: '',
    isHighlighted: false,
  },
];

export const freePlan = plans[0] as Plan;
export const proPlan = plans[1] as Plan;
export const maestroPlan = plans[2] as Plan;

/** El precio del plan para el ciclo elegido. `null` si el plan es gratis. */
export function priceFor(plan: Plan, cycle: BillingCycle): PlanPrice | null {
  return plan.prices.find((price) => price.cycle === cycle) ?? null;
}

/**
 * El ciclo con el que abre la página: el ANUAL.
 *
 * Lo primero que ve el visitante es el precio por mes más bajo, y el mensual
 * queda como la opción que cuesta más. Al revés, el anual parecía un desembolso
 * grande al lado de una cifra chica.
 */
export const DEFAULT_BILLING_CYCLE: BillingCycle = 'anual';

/** Compra por una sola vez, para quien no quiere suscripción. */
export const oneTimeCourseCop = 89000;
