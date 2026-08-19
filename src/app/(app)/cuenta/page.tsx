import { type Metadata } from 'next';
import { type ReactNode } from 'react';

import { AppCuentaView } from '@/views/app-cuenta';

import { createSupabaseServerClient } from '@/shared/api/supabase/server';

export const metadata: Metadata = { title: 'Mi cuenta · El Charcu' };

/**
 * El correo lo lee el servidor y baja como prop.
 *
 * El layout ya garantizó que hay sesión, así que aquí no se vuelve a decidir
 * nada: si no hubiera usuario no se habría llegado a pintar esta pantalla.
 */
export default async function CuentaPage(): Promise<ReactNode> {
  const supabase = await createSupabaseServerClient();
  const { data } = await supabase.auth.getUser();

  return <AppCuentaView email={data.user?.email ?? ''} />;
}
