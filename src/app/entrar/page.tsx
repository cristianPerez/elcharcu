import { type Metadata } from 'next';
import { redirect } from 'next/navigation';
import { type ReactNode } from 'react';

import { EntrarPage } from '@/views/entrar';

import { currentUser } from '@/shared/api/supabase/server';
import { appRoutes } from '@/shared/config';

export const metadata: Metadata = {
  title: 'Entrar · El Charcu',
  description: 'Entra con tu correo para que tus curados no se pierdan.',
  robots: { index: false, follow: false },
};

/**
 * El formulario de entrada — salvo que ya hayas entrado.
 *
 * Con sesión abierta esto se salta y va derecho a la app (2026-08-31). Pedirle
 * el correo a alguien que ya lo dio, para mandarle un enlace que le va a dejar
 * donde ya estaba, es hacerle repetir un trámite completo por nada. Y el enlace
 * tarda: llega al correo, se abre, vuelve. Todo para acabar en `/charcu`.
 *
 * La comprobación va en el SERVIDOR: así no se llega a pintar el formulario ni
 * un instante. La cabecera hace lo mismo en el cliente cambiando su botón, pero
 * eso es cosmético — esto es lo que de verdad cierra la puerta.
 */
export default async function Page(): Promise<ReactNode> {
  if ((await currentUser()) !== null) {
    redirect(appRoutes.appAssistant);
  }

  return <EntrarPage />;
}
