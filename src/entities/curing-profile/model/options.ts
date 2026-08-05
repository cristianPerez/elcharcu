/**
 * Las opciones del onboarding. Son datos, no UI: la misma lista alimenta el
 * flujo de preguntas, el resumen de la sesión y —más adelante— el prompt del
 * asistente y el método de pago por país.
 */

export const COUNTRIES = [
  { id: 'co', name: 'Colombia' },
  { id: 'mx', name: 'México' },
  { id: 'ar', name: 'Argentina' },
  { id: 'pe', name: 'Perú' },
  { id: 'cl', name: 'Chile' },
  { id: 'ec', name: 'Ecuador' },
  { id: 'es', name: 'España' },
  { id: 'otro', name: 'Otro país' },
] as const;

export type CountryCode = (typeof COUNTRIES)[number]['id'];

export const EXPERIENCE_LEVELS = [
  {
    id: 'curioso',
    name: 'Curioso',
    description: 'Nunca he curado nada, o casi nada. Quiero empezar bien.',
  },
  {
    id: 'apasionado',
    name: 'Apasionado',
    description: 'Ya he hecho varias piezas en casa. Unas salieron, otras no.',
  },
  {
    id: 'avanzado',
    name: 'Avanzado',
    description: 'Curo seguido y ya vendo algo de lo que hago.',
  },
] as const;

export type ExperienceLevel = (typeof EXPERIENCE_LEVELS)[number]['id'];

export const CURING_PRODUCTS = [
  { id: 'chorizo', name: 'Chorizo' },
  { id: 'longaniza', name: 'Longaniza' },
  { id: 'salame', name: 'Salame' },
  { id: 'jamon-curado', name: 'Jamón curado' },
  { id: 'jamon-cocido', name: 'Jamón cocido' },
  { id: 'bondiola', name: 'Bondiola o tocineta' },
  { id: 'queso', name: 'Queso' },
  { id: 'otro', name: 'Otra cosa' },
] as const;

export type CuringProductId = (typeof CURING_PRODUCTS)[number]['id'];

export function isCountryCode(value: unknown): value is CountryCode {
  return typeof value === 'string' && COUNTRIES.some((country) => country.id === value);
}

export function isExperienceLevel(value: unknown): value is ExperienceLevel {
  return (
    typeof value === 'string' && EXPERIENCE_LEVELS.some((level) => level.id === value)
  );
}

export function isCuringProductId(value: unknown): value is CuringProductId {
  return (
    typeof value === 'string' && CURING_PRODUCTS.some((product) => product.id === value)
  );
}

export function countryName(id: CountryCode): string {
  return COUNTRIES.find((country) => country.id === id)?.name ?? 'tu país';
}

export function experienceLevelName(id: ExperienceLevel): string {
  return EXPERIENCE_LEVELS.find((level) => level.id === id)?.name ?? 'Curioso';
}

export function curingProductName(id: CuringProductId): string {
  return CURING_PRODUCTS.find((product) => product.id === id)?.name ?? 'tu receta';
}
