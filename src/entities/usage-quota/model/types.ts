/**
 * Cupo de uso, medido en PREGUNTAS e IMÁGENES (D15).
 *
 * Desde el 2026-08-14 la verdad vive en Postgres (`charcu.usage_counters`) y
 * la manda el servidor; el navegador solo la muestra. El periodo es el MES
 * natural en hora de Colombia — los planes se venden por mes, así que el cupo
 * gratis se mide con la misma vara.
 */
export interface QuotaSnapshot {
  /** Plan que le aplica ahora mismo: `aprendiz`, `pro-anual`, `maestro-…` */
  readonly plan: string;
  readonly questionsUsed: number;
  readonly imagesUsed: number;
  readonly recipesUsed: number;
  /** Tope del mes, según el plan. Lo decide la base, no la pantalla. */
  readonly questionsLimit: number;
  readonly imagesLimit: number;
  /** `null` = recetas ILIMITADAS. Solo el plan gratis tiene tope (1). */
  readonly recipesLimit: number | null;
}

/** Cuál de los tres topes cerró la puerta. */
export type QuotaDeniedBy = 'preguntas' | 'fotos' | 'recetas';

/** Qué le queda al visitante y contra qué muro está. */
export interface QuotaStatus {
  readonly questionsLeft: number;
  readonly imagesLeft: number;
  /** `null` cuando son ilimitadas. */
  readonly recipesLeft: number | null;
  /** Se acabaron las recetas: solo le pasa al plan gratis. */
  readonly areRecipesExhausted: boolean;
  /** Se acabaron las preguntas: toca el muro de suscripción. */
  readonly isExhausted: boolean;
  /** Quedan preguntas, pero ya no puede mandar más fotos. */
  readonly areImagesExhausted: boolean;
}

/**
 * Cuántas preguntas se contestan antes de pedir nombre, correo y WhatsApp (D16).
 *
 * Esto NO vive en la base: no es un tope de gasto sino una regla del embudo.
 * La primera pregunta es la demostración; el muro blando viene justo después,
 * en el momento de máximo interés.
 */
export const QUESTIONS_BEFORE_LEAD = 1;

/** Cupo vacío, para el primer render antes de que conteste el servidor. */
export const EMPTY_QUOTA: QuotaSnapshot = {
  plan: 'aprendiz',
  questionsUsed: 0,
  imagesUsed: 0,
  recipesUsed: 0,
  questionsLimit: 0,
  imagesLimit: 0,
  recipesLimit: 0,
};

export function quotaStatus(snapshot: QuotaSnapshot): QuotaStatus {
  const questionsLeft = Math.max(0, snapshot.questionsLimit - snapshot.questionsUsed);
  const imagesLeft = Math.max(0, snapshot.imagesLimit - snapshot.imagesUsed);
  const recipesLeft =
    snapshot.recipesLimit === null
      ? null
      : Math.max(0, snapshot.recipesLimit - snapshot.recipesUsed);

  return {
    questionsLeft,
    imagesLeft,
    recipesLeft,
    isExhausted: questionsLeft === 0,
    areImagesExhausted: imagesLeft === 0,
    areRecipesExhausted: recipesLeft === 0,
  };
}

/** Valida lo que llega del servidor: nunca se confía en una respuesta a ciegas. */
export function parseQuotaSnapshot(value: unknown): QuotaSnapshot | null {
  if (typeof value !== 'object' || value === null) {
    return null;
  }

  const {
    plan,
    questionsUsed,
    imagesUsed,
    recipesUsed,
    questionsLimit,
    imagesLimit,
    recipesLimit,
  } = value as Record<string, unknown>;

  if (
    typeof plan !== 'string' ||
    typeof questionsUsed !== 'number' ||
    typeof imagesUsed !== 'number' ||
    typeof recipesUsed !== 'number' ||
    typeof questionsLimit !== 'number' ||
    typeof imagesLimit !== 'number' ||
    (typeof recipesLimit !== 'number' && recipesLimit !== null)
  ) {
    return null;
  }

  return {
    plan,
    questionsUsed,
    imagesUsed,
    recipesUsed,
    questionsLimit,
    imagesLimit,
    recipesLimit,
  };
}
