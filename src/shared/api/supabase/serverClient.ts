import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

import { type Database } from './database.types';
import {
  serverSupabasePublishableKey,
  serverSupabaseUrl,
  warnIfMisconfigured,
} from './serverConfig';

export type SupabaseServerClient = ReturnType<
  typeof createServerClient<Database, 'charcu'>
>;

/**
 * Cliente de Supabase para el servidor (Server Components, rutas y acciones).
 * Lee y refresca la sesión desde las cookies, y apunta al esquema `charcu`.
 */
export async function createSupabaseServerClient(): Promise<SupabaseServerClient> {
  const cookieStore = await cookies();
  warnIfMisconfigured('createSupabaseServerClient');

  return createServerClient<Database, 'charcu'>(
    serverSupabaseUrl(),
    serverSupabasePublishableKey(),
    {
      db: { schema: 'charcu' },
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            for (const { name, value, options } of cookiesToSet) {
              cookieStore.set(name, value, options);
            }
          } catch {
            // Desde un Server Component no se pueden escribir cookies.
            // No pasa nada: el middleware ya refrescó la sesión antes de llegar aquí.
          }
        },
      },
    },
  );
}
