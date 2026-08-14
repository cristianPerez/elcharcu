import { createClient } from '@supabase/supabase-js';

import { supabaseConfig } from './config';
import { type Database } from './database.types';

/**
 * ⚠️ SOLO SERVIDOR Y SOLO PARA LO QUE NO TIENE DUEÑO.
 *
 * Este cliente usa la clave SECRETA y por diseño **se salta los permisos por
 * fila (RLS)**. Nunca lo uses para leer o escribir datos de un usuario: para
 * eso está `createSupabaseServerClient`, que respeta quién es cada quien.
 *
 * Aquí solo entra lo que no pertenece a nadie, como el contador de gasto de la
 * IA, que ninguna cuenta debe poder ver ni tocar.
 */
export type SupabaseAdminClient = ReturnType<typeof createClient<Database, 'charcu'>>;

export function createSupabaseAdminClient(): SupabaseAdminClient {
  return createClient<Database, 'charcu'>(
    supabaseConfig.url,
    process.env.SUPABASE_SECRET_KEY ?? '',
    {
      db: { schema: 'charcu' },
      auth: { persistSession: false, autoRefreshToken: false },
    },
  );
}

export function isSupabaseAdminConfigured(): boolean {
  return supabaseConfig.url !== '' && (process.env.SUPABASE_SECRET_KEY ?? '') !== '';
}
