export type PlanId = 'aprendiz' | 'pro';

/** Cada cuánto se cobra el plan de pago. */
export type BillingCycle = 'mensual' | 'anual';

/**
 * Lo que de verdad se vende (D15): preguntas e imágenes al mes.
 * Es la unidad que el usuario entiende y la que cuesta dinero — cada pregunta
 * gasta tokens de Gemini y cada imagen gasta bastante más.
 */
export interface PlanQuota {
  readonly questionsPerMonth: number;
  readonly imagesPerMonth: number;
}

/**
 * Una forma de pagar el mismo plan.
 *
 * El cupo NO cambia entre mensual y anual a propósito: el toggle promete
 * "el mismo plan, más barato si pagas el año". Si además cambiara lo que
 * incluye, dejaría de ser un toggle y serían dos productos distintos.
 */
export interface PlanPrice {
  readonly cycle: BillingCycle;
  /** Lo que se cobra de una vez. */
  readonly priceCop: number;
  /** A cuánto sale el mes, para poder comparar de verdad. */
  readonly perMonthCop: number;
  /** El `plan_id` que entienden `charcu.plan_quotas` y la pasarela. */
  readonly billingId: string;
  /** Nota chica bajo el botón. */
  readonly note: string;
  /** Ahorro frente a pagar mes a mes. 0 en el mensual. */
  readonly savingPercent: number;
}

export interface Plan {
  readonly id: PlanId;
  readonly name: string;
  readonly quota: PlanQuota;
  /** Una frase que resume para quién es el plan. */
  readonly pitch: string;
  readonly features: readonly string[];
  readonly ctaLabel: string;
  /** Vacío en el gratis: no se cobra nunca. */
  readonly prices: readonly PlanPrice[];
  /** Nota del plan gratis, que no tiene ciclo de cobro. */
  readonly note: string;
  readonly isHighlighted: boolean;
}
