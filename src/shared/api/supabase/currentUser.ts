import { cache } from 'react';

import { createSupabaseServerClient } from './serverClient';

export interface CurrentUser {
  readonly id: string;
  readonly email: string;
}

/**
 * Quién está pidiendo esta página. UNA sola vez por petición.
 *
 * El `cache()` de React no guarda nada entre peticiones: deduplica dentro de
 * la misma. Y eso es justo lo que hacía falta — el layout preguntaba quién
 * eres, la página lo volvía a preguntar y la ruta de la API otra vez, así que
 * un simple toque en la barra de abajo se iba en tres viajes a Supabase para
 * responder tres veces lo mismo.
 *
 * Se usa `getUser()` y no `getSession()`: `getSession` se cree la cookie, y la
 * cookie la escribe el navegador.
 */
export const currentUser = cache(async (): Promise<CurrentUser | null> => {
  const supabase = await createSupabaseServerClient();
  const { data } = await supabase.auth.getUser();

  if (data.user === null) {
    return null;
  }

  return { id: data.user.id, email: data.user.email ?? '' };
});
