import { type Metadata } from 'next';
import { redirect } from 'next/navigation';
import { type ReactNode } from 'react';

import { EntrarPage } from '@/views/entrar';

import { authTriggerFrom } from '@/features/auth-by-email/server';

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
export default async function Page({
  searchParams,
}: {
  readonly searchParams: Promise<{ readonly desde?: string | string[] }>;
}): Promise<ReactNode> {
  if ((await currentUser()) !== null) {
    redirect(appRoutes.appAssistant);
  }

  // `desde` lo pone el layout de la app al expulsar a alguien sin sesión.
  // Solo sirve para medir por qué se le pidió la cuenta (2026-10-07).
  const { desde } = await searchParams;
  const { trigger, origin } = await authTriggerFrom(
    typeof desde === 'string' ? desde : null,
  );

  return <EntrarPage trigger={trigger} origin={origin} />;
}
