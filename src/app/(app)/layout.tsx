import { redirect } from 'next/navigation';
import { type ReactNode } from 'react';

import { AppFrame } from '@/widgets/app-frame';

import { QuotaProvider } from '@/entities/usage-quota';
import { readQuota } from '@/entities/usage-quota/server';

import { currentUser } from '@/shared/api/supabase/server';
import { readVisitorIdFromCookies } from '@/shared/api/visitor/server';
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
 *
 * Aquí también se lee el CUPO una sola vez y se reparte por contexto. Antes
 * cada pestaña montaba su propio `useUsageQuota` y salía otra petición a
 * `/api/cupo`: 1,4 s por cambio de pestaña para traer un número que el
 * servidor ya tenía en la mano al pintar la página.
 */
export default async function AppLayout({
  children,
}: AppLayoutProps): Promise<ReactNode> {
  const user = await currentUser();

  if (user === null) {
    redirect(appRoutes.login);
  }

  const visitorId = await readVisitorIdFromCookies();
  const quota = visitorId === null ? null : await readQuota(visitorId, user.id);

  return (
    <QuotaProvider initial={quota}>
      <AppFrame>{children}</AppFrame>
    </QuotaProvider>
  );
}
