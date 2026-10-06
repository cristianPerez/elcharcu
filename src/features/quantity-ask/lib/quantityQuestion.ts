/**
 * El hueco que una pregunta sugerida deja para los gramos de quien la hace.
 *
 * Se escribe tal cual en `lessons.ask` desde la migración:
 *
 *   "¿Qué cantidad de cada ingrediente le pongo si tengo {gramos} gramos de carne?"
 *
 * Una pregunta sin hueco sigue siendo el enlace de siempre; con hueco, la
 * lección pinta el selector de cantidad (`QuantityAsk`).
 */
export const GRAMS_SLOT = '{gramos}';

export const MIN_GRAMS = 100;
export const MAX_GRAMS = 50_000;
/** Lo que suma o resta cada toque del + y el −. */
export const GRAMS_STEP = 100;
/** Con lo que arranca: la receta base es de 1 kg. */
export const DEFAULT_GRAMS = 1_000;

const GRAMS_FORMAT = new Intl.NumberFormat('es-CO', { maximumFractionDigits: 0 });

export function hasGramsSlot(ask: string): boolean {
  return ask.includes(GRAMS_SLOT);
}

/** Dentro del rango y en gramos enteros. Lo que no es número vuelve al mínimo. */
export function clampGrams(value: number): number {
  if (!Number.isFinite(value)) {
    return MIN_GRAMS;
  }
  return Math.min(MAX_GRAMS, Math.max(MIN_GRAMS, Math.round(value)));
}

/** "1.250" — los gramos como se leen en Colombia. */
export function formatGrams(grams: number): string {
  return GRAMS_FORMAT.format(grams);
}

/** La pregunta lista para mandar, con los gramos puestos en el hueco. */
export function fillGrams(ask: string, grams: number): string {
  return ask.split(GRAMS_SLOT).join(formatGrams(clampGrams(grams)));
}

/** Lo que se ve antes de elegir: el hueco como "___". */
export function askPreview(ask: string): readonly string[] {
  return ask.split(GRAMS_SLOT);
}
