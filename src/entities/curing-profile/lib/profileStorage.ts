import { createSupabaseBrowserClient } from '@/shared/api/supabase';
import { parseInterests } from '@/shared/config';

import { type CuringProfile } from '../model/profile.types';

/**
 * Guardado del perfil.
 *
 * Con cuenta, la verdad vive en `charcu.profiles`, que es lo que sobrevive a un
 * cambio de celular. Sin cuenta se queda en el navegador, porque el asistente
 * se usa sin registrarse (D14) y algo hay que recordar.
 */
const STORAGE_KEY = 'elcharcu:curing-profile';

/** Valida lo que salga del navegador: nunca confiamos en `localStorage`. */
function parseProfile(value: unknown): CuringProfile | null {
  if (typeof value !== 'object' || value === null) {
    return null;
  }

  const { interests, createdAt } = value as Record<string, unknown>;
  const parsed = parseInterests(interests);

  // Un perfil sin intereses no sirve para nada: ni configura el panel ni le
  // dice al asistente de qué hablar. Vale más devolver null y que el
  // onboarding vuelva a preguntar.
  if (parsed.length === 0 || typeof createdAt !== 'string') {
    return null;
  }

  return { interests: parsed, createdAt };
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
 * Sube los intereses a `charcu.profiles`. Si no hay sesión, no hace nada: la
 * fila del perfil pertenece a una cuenta y sin cuenta no hay dónde escribir.
 *
 * El `update` directo funciona porque `profiles_update_own` existe desde la
 * 0001 y el `grant` de la 0001 lo cubre. No hace falta una ruta de API.
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
      .update({ interests: [...profile.interests] })
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
 *
 * Se llama al entrar: es lo que hace que el perfil siga al usuario de un
 * dispositivo a otro. La base MANDA sobre lo local — si cambió sus intereses
 * en el celular, el portátil tiene que enterarse.
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
      .select('interests')
      .eq('id', userId)
      .maybeSingle();

    if (error !== null || data === null) {
      return null;
    }

    const remote = parseInterests(data.interests);

    if (remote.length === 0) {
      return loadProfile();
    }

    const local = loadProfile();
    const merged: CuringProfile = {
      interests: remote,
      createdAt: local?.createdAt ?? new Date().toISOString(),
    };

    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(merged));
    return merged;
  } catch {
    return null;
  }
}
