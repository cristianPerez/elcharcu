import { createSupabaseBrowserClient } from '@/shared/api/supabase';

import { isCountryCode, isCuringProductId, isExperienceLevel } from '../model/options';
import { type CuringProfile } from '../model/profile.types';

/**
 * Guardado del perfil.
 *
 * Con cuenta, la verdad vive en `charcu.profiles` (país y nivel), que es lo
 * que sobrevive a un cambio de celular. Sin cuenta se queda en el navegador,
 * porque el asistente se usa sin registrarse (D14) y algo hay que recordar.
 *
 * `freeRecipe` sigue siendo local a propósito: era la unidad del modelo viejo
 * —una receta gratis— y ya no manda nada (D15). Se conserva solo para que la
 * pantalla de sesión siga sabiendo qué receta eligió.
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
  // Y si hay cuenta, que quede también en la base. No se espera la respuesta:
  // el onboarding no debe quedarse colgado porque la red vaya lenta.
  void syncProfileToSupabase(profile);
}

export function clearProfile(): void {
  if (typeof window === 'undefined') {
    return;
  }
  window.localStorage.removeItem(STORAGE_KEY);
}

/**
 * Sube país y nivel a `charcu.profiles`. Si no hay sesión, no hace nada:
 * la fila del perfil pertenece a una cuenta y sin cuenta no hay dónde escribir.
 */
export async function syncProfileToSupabase(profile: CuringProfile): Promise<void> {
  try {
    const supabase = createSupabaseBrowserClient();
    const { data } = await supabase.auth.getUser();
    const userId = data.user?.id;

    if (userId === undefined) {
      return;
    }

    const { error } = await supabase
      .from('profiles')
      .update({ country: profile.country, experience_level: profile.level })
      .eq('id', userId);

    if (error !== null) {
      console.error('[perfil] no se pudo guardar en la base:', error.message);
    }
  } catch {
    // Sin Supabase configurado se sigue con el guardado local, sin ruido.
  }
}

/**
 * Trae el perfil de la base y lo deja también en el navegador.
 * Se llama al entrar: es lo que hace que el perfil siga al usuario de un
 * dispositivo a otro.
 */
export async function hydrateProfileFromSupabase(): Promise<CuringProfile | null> {
  try {
    const supabase = createSupabaseBrowserClient();
    const { data: auth } = await supabase.auth.getUser();
    const userId = auth.user?.id;

    if (userId === undefined) {
      return null;
    }

    const { data, error } = await supabase
      .from('profiles')
      .select('country, experience_level')
      .eq('id', userId)
      .maybeSingle();

    if (error !== null || data === null) {
      return null;
    }

    const local = loadProfile();
    const country = isCountryCode(data.country) ? data.country : (local?.country ?? 'co');
    const level = isExperienceLevel(data.experience_level)
      ? data.experience_level
      : (local?.level ?? 'curioso');

    if (local === null) {
      return null;
    }

    const merged: CuringProfile = { ...local, country, level };
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(merged));
    return merged;
  } catch {
    return null;
  }
}
