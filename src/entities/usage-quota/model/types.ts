/** Cupo de uso: preguntas e imágenes que le quedan al usuario. */
export interface UsageQuota {
  /** Preguntas de texto enviadas hoy (o en el periodo actual). */
  readonly questionsUsed: number;
  /** Imágenes enviadas hoy (o en el periodo actual). */
  readonly imagesUsed: number;
  /** Fecha del último uso (ISO string) para resetear contadores diarios. */
  readonly lastUsedAt: string;
}

/** Los límites del plan gratuito. Ajustables según lo que Cristian decida. */
export interface FreeTierLimits {
  /** Preguntas gratis antes del muro blando (captura de datos). */
  readonly questionsBeforeLead: number;
  /** Preguntas gratis TOTALES tras dejar los datos. */
  readonly questionsAfterLead: number;
  /** Imágenes gratis TOTALES. */
  readonly imagesTotal: number;
}

/** Límites propuestos. Se ajustan cuando Cristian decida los números finales. */
export const FREE_TIER_LIMITS: FreeTierLimits = {
  questionsBeforeLead: 1, // Solo la primera pregunta gratis sin datos
  questionsAfterLead: 5, // 5 preguntas totales tras dejar datos (propuesta)
  imagesTotal: 2, // 2 imágenes totales (propuesta)
};
