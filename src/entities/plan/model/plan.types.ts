export type PlanId = 'aprendiz' | 'mensual' | 'anual';

/** Cada cuánto se cobra. `gratis` no cobra nunca. */
export type PlanBilling = 'gratis' | 'mensual' | 'anual';

export interface Plan {
  readonly id: PlanId;
  readonly name: string;
  /** Precio en pesos colombianos. 0 = gratis. */
  readonly priceCop: number;
  readonly billing: PlanBilling;
  /** Una frase que resume para quién es el plan. */
  readonly pitch: string;
  readonly features: readonly string[];
  readonly ctaLabel: string;
  /** Nota chica bajo el botón (ahorro, "sin tarjeta", etc.). */
  readonly note: string;
  /** Solo uno debería estar destacado. */
  readonly isHighlighted: boolean;
}
