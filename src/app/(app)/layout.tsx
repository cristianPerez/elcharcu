import { redirect } from 'next/navigation';
import { type ReactNode } from 'react';

import { AppFrame } from '@/widgets/app-frame';

import { createSupabaseServerClient } from '@/shared/api/supabase/server';
import { appRoutes } from '@/shared/config';

interface AppLayoutProps {
  readonly children: ReactNode;
}

/**
 * La puerta de la app: aquí dentro solo se entra con cuenta.
 *
 * La comprobación va en el SERVIDOR y en el layout, no en cada pantalla: si
 * cada `page` tuviera que acordarse de mirar, el día que se añada la cuarta se
 * olvida y queda abierta. Se usa `getUser()` y no `getSession()` a propósito —
 * `getSession` se fía de la cookie, y la cookie la escribe el navegador.
 */
export default async function AppLayout({
  children,
}: AppLayoutProps): Promise<ReactNode> {
  const supabase = await createSupabaseServerClient();
  const { data } = await supabase.auth.getUser();

  if (data.user === null) {
    redirect(appRoutes.login);
  }

  return <AppFrame>{children}</AppFrame>;
}
