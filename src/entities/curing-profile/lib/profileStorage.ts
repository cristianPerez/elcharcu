import {
  COUNTRIES,
  CURING_PRODUCTS,
  EXPERIENCE_LEVELS,
  type CountryCode,
  type CuringProductId,
  type ExperienceLevel,
} from '../model/options';
import { type CuringProfile } from '../model/profile.types';

/**
 * Guardado del perfil en el navegador.
 *
 * ⚠️ TEMPORAL: vive en `localStorage` porque Supabase todavía no está conectado.
 * Este archivo es el ÚNICO punto que hay que cambiar cuando lleguen las
 * credenciales: la app entera solo conoce `loadProfile` / `saveProfile`.
 */
const STORAGE_KEY = 'elcharcu:curing-profile';

function isCountryCode(value: unknown): value is CountryCode {
  return typeof value === 'string' && COUNTRIES.some((country) => country.id === value);
}

function isExperienceLevel(value: unknown): value is ExperienceLevel {
  return (
    typeof value === 'string' && EXPERIENCE_LEVELS.some((level) => level.id === value)
  );
}

function isCuringProductId(value: unknown): value is CuringProductId {
  return (
    typeof value === 'string' && CURING_PRODUCTS.some((product) => product.id === value)
  );
}

/** Valida lo que salga del navegador: nunca confiamos en `localStorage`. */
function parseProfile(value: unknown): CuringProfile | null {
  if (typeof value !== 'object' || value === null) {
    return null;
  }

  const candidate: Record<string, unknown> = { ...value };
  const { country, level, freeRecipe, createdAt } = candidate;

  if (
    !isCountryCode(country) ||
    !isExperienceLevel(level) ||
    !isCuringProductId(freeRecipe) ||
    typeof createdAt !== 'string'
  ) {
    return null;
  }

  return { country, level, freeRecipe, createdAt };
}

export function loadProfile(): CuringProfile | null {
  if (typeof window === 'undefined') {
    return null;
  }

  const raw = window.localStorage.getItem(STORAGE_KEY);
  if (raw === null) {
    return null;
  }

  try {
    const parsed: unknown = JSON.parse(raw);
    return parseProfile(parsed);
  } catch {
    return null;
  }
}

export function saveProfile(profile: CuringProfile): void {
  if (typeof window === 'undefined') {
    return;
  }
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
}

export function clearProfile(): void {
  if (typeof window === 'undefined') {
    return;
  }
  window.localStorage.removeItem(STORAGE_KEY);
}
