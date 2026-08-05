import { isCountryCode, isCuringProductId, isExperienceLevel } from '../model/options';
import { type CuringProfile } from '../model/profile.types';

/**
 * Guardado del perfil en el navegador.
 *
 * ⚠️ TEMPORAL: vive en `localStorage` porque Supabase todavía no está conectado.
 * Este archivo es el ÚNICO punto que hay que cambiar cuando lleguen las
 * credenciales: la app entera solo conoce `loadProfile` / `saveProfile`.
 */
const STORAGE_KEY = 'elcharcu:curing-profile';

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
