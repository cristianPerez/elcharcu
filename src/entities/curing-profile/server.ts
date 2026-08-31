import { cache } from 'react';

import { createSupabaseServerClient } from '@/shared/api/supabase/server';
import { parseInterests, type InterestId } from '@/shared/config';

export interface ServerProfile {
  readonly fullName: string;
  readonly interests: readonly InterestId[];
  /** `true` mientras no haya contestado el formulario obligatorio. */
  readonly needsOnboarding: boolean;
}

/**
 * El perfil, leído en el SERVIDOR y una sola vez por petición.
 *
 * Va con `cache()` de React por lo mismo que `currentUser()`: el layout lo
 * necesita para decidir si tapa la app con el onboarding, y la pantalla de
 * cuenta para rellenar el formulario de edición. Sin deduplicar, un toque en la
 * pestaña de cuenta serían dos viajes a Supabase para traer la misma fila.
 *
 * ⚠️ Si la lectura falla, `needsOnboarding` sale en `false`. Es a propósito:
 * ante un error de red, dejar entrar a alguien que quizá ya contestó es mucho
 * menos grave que atrapar en un formulario a alguien que ya lo llenó, sin
 * ninguna puerta de salida.
 */
export const readProfile = cache(async (userId: string): Promise<ServerProfile> => {
  const fallback: ServerProfile = {
    fullName: '',
    interests: [],
    needsOnboarding: false,
  };

  try {
    const supabase = await createSupabaseServerClient();
    const { data, error } = await supabase
      .from('profiles')
      .select('full_name, interests, onboarding_status')
      .eq('id', userId)
      .maybeSingle();

    if (error !== null || data === null) {
      return fallback;
    }

    return {
      fullName: data.full_name ?? '',
      interests: parseInterests(data.interests),
      needsOnboarding: data.onboarding_status === 'pendiente',
    };
  } catch {
    return fallback;
  }
});
