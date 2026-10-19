import { createHash } from 'node:crypto';

import { type Json } from '@/shared/api/supabase/database.types';
import { createSupabaseAdminClient } from '@/shared/api/supabase/server';

/** Deja constancia de un cuerpo que no se pudo entender. */
export async function recordUnreadable(
  proveedor: string,
  nota: string,
  crudo: string,
  cuerpo: Json | null,
  traza: string,
): Promise<void> {
  await createSupabaseAdminClient()
    .from('webhook_eventos')
    .insert({
      proveedor,
      evento: '(desconocido)',
      tipo: 'desconocido',
      recurso_id: '(desconocido)',
      huella: createHash('sha256').update(crudo).digest('hex'),
      cuerpo: cuerpo ?? { crudo: crudo.slice(0, 4000) },
      estado: 'error',
      nota,
      traza,
    });
}
