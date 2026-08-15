export type PlanId = 'aprendiz' | 'mensual' | 'anual';

/** Cada cuánto se cobra. `gratis` no cobra nunca. */
export type PlanBilling = 'gratis' | 'mensual' | 'anual';

/**
 * Lo que de verdad se vende (D15): preguntas e imágenes al mes.
 * Es la unidad que el usuario entiende y la que cuesta dinero — cada pregunta
 * gasta tokens de Gemini y cada imagen gasta bastante más.
 */
export interface PlanQuota {
  readonly questionsPerMonth: number;
  readonly imagesPerMonth: number;
}

export interface Plan {
  readonly id: PlanId;
  readonly name: string;
  /** Precio en pesos colombianos. 0 = gratis. */
  readonly priceCop: number;
  readonly billing: PlanBilling;
  /** Cupo mensual del plan. En el anual es el cupo de CADA mes. */
  readonly quota: PlanQuota;
  /** Una frase que resume para quién es el plan. */
  readonly pitch: string;
  readonly features: readonly string[];
  readonly ctaLabel: string;
  /** Nota chica bajo el botón (ahorro, "sin tarjeta", etc.). */
  readonly note: string;
  /** Solo uno debería estar destacado. */
  readonly isHighlighted: boolean;
}
