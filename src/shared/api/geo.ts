import { type NextRequest } from 'next/server';

/**
 * De dónde escribe, sin preguntárselo.
 *
 * El asistente necesita el país para dos cosas reales: el vocabulario y el
 * clima ("Manizales no es Buenos Aires"). Hasta hoy salía de una pantalla del
 * onboarding, y esa pantalla se quitó (Cristian, 2026-08-29) porque el dato ya
 * llega solo: Vercel pone `x-vercel-ip-country` en cada petición.
 *
 * ⚠️ Por qué el servidor y no el cliente: el país venía en el cuerpo de la
 * petición, o sea que se podía escribir cualquier cosa desde la consola del
 * navegador y acababa dentro del prompt. Con la cabecera, el dato no lo pone
 * quien pregunta.
 *
 * En local no existe la cabecera y cae en Colombia, que es el mercado primero
 * (D8) y el default de `charcu.profiles.country`.
 */

const COUNTRY_NAMES: Record<string, string> = {
  CO: 'Colombia',
  MX: 'México',
  AR: 'Argentina',
  PE: 'Perú',
  CL: 'Chile',
  EC: 'Ecuador',
  VE: 'Venezuela',
  ES: 'España',
  US: 'Estados Unidos',
};

const DEFAULT_COUNTRY = 'Colombia';

/** El nombre del país en español, para meterlo en el prompt tal cual. */
export function countryFromRequest(request: NextRequest): string {
  const code = request.headers.get('x-vercel-ip-country');

  if (code === null || code === '') {
    return DEFAULT_COUNTRY;
  }

  // Un país que no está en la lista igual sirve: el modelo entiende el código
  // ISO. Devolver "Colombia" para alguien que escribe desde Portugal sería
  // peor que devolver "PT" — le hablaría del clima equivocado.
  return COUNTRY_NAMES[code.toUpperCase()] ?? code.toUpperCase();
}
