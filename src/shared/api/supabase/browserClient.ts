import { createBrowserClient } from '@supabase/ssr';

import { supabaseConfig } from './config';
import { type Database } from './database.types';

export type SupabaseBrowserClient = ReturnType<
  typeof createBrowserClient<Database, 'charcu'>
>;

/**
 * Cliente de Supabase para el navegador. Usa solo la clave pública.
 * Apunta al esquema `charcu`, donde viven todas las tablas de la app.
 */
export function createSupabaseBrowserClient(): SupabaseBrowserClient {
  return createBrowserClient<Database, 'charcu'>(
    supabaseConfig.url,
    supabaseConfig.publishableKey,
    { db: { schema: 'charcu' } },
  );
}
