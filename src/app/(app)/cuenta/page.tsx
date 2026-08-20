import { type Metadata } from 'next';
import { type ReactNode } from 'react';

import { AppCuentaView } from '@/views/app-cuenta';

import { currentUser } from '@/shared/api/supabase/server';

export const metadata: Metadata = { title: 'Mi cuenta · El Charcu' };

/**
 * El correo lo lee el servidor y baja como prop.
 *
 * El layout ya garantizó que hay sesión, así que aquí no se vuelve a decidir
 * nada. Y `currentUser()` no cuesta otro viaje a Supabase: está deduplicado
 * dentro de la misma petición, así que devuelve lo que ya trajo el layout.
 */
export default async function CuentaPage(): Promise<ReactNode> {
  const user = await currentUser();

  return <AppCuentaView email={user?.email ?? ''} />;
}
