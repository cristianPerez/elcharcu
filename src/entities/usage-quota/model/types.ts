/**
 * Cupo de uso del visitante, medido en PREGUNTAS e IMÁGENES (D15).
 *
 * El periodo es el MES natural, no el día: los planes se venden por mes, así
 * que el cupo gratis se mide con la misma vara. Un reseteo diario haría que el
 * plan gratis fuera, en la práctica, ilimitado.
 */
export interface UsageQuota {
  /** Preguntas de texto enviadas en el periodo actual. */
  readonly questionsUsed: number;
  /** Imágenes enviadas en el periodo actual. */
  readonly imagesUsed: number;
  /** Periodo al que pertenecen los contadores, como `YYYY-MM`. */
  readonly periodKey: string;
}

/** Los límites del plan gratuito, en preguntas e imágenes por mes. */
export interface FreeTierLimits {
  /** Preguntas gratis antes del muro blando de captura de datos. */
  readonly questionsBeforeLead: number;
  /** Preguntas gratis TOTALES al mes, ya con los datos dejados. */
  readonly questionsPerMonth: number;
  /** Imágenes gratis TOTALES al mes. */
  readonly imagesPerMonth: number;
}

/**
 * Números propuestos, alineados con el plan `aprendiz` de `entities/plan`.
 *
 * Con ~0,0055 USD por pregunta, 8 preguntas gratis cuestan ~0,044 USD por
 * visitante que agote el cupo: sostenible frente al tope diario de 5 USD.
 * Las imágenes van mucho más apretadas porque cuestan bastante más.
 */
export const FREE_TIER_LIMITS: FreeTierLimits = {
  questionsBeforeLead: 1,
  questionsPerMonth: 8,
  imagesPerMonth: 2,
};

/** Qué le queda al visitante y si ya chocó con el muro. */
export interface QuotaStatus {
  readonly questionsLeft: number;
  readonly imagesLeft: number;
  /** Se acabaron las preguntas: toca el muro de suscripción. */
  readonly isExhausted: boolean;
  /** Quedan preguntas, pero ya no puede mandar más fotos. */
  readonly areImagesExhausted: boolean;
}
