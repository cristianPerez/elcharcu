import { redirect } from 'next/navigation';
import { type ReactNode } from 'react';

import { AppFrame } from '@/widgets/app-frame';

import { OnboardingFlow } from '@/features/onboarding';

import { readProfile } from '@/entities/curing-profile/server';
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
 *
 * Y aquí vive la PUERTA DEL ONBOARDING (2026-08-29). Quien vuelve del enlace
 * del correo por primera vez tiene `onboarding_status = 'pendiente'` y no ve la
 * app hasta que contesta.
 *
 * ⚠️ Se RENDERIZA en el sitio, no se redirige a `/bienvenido`. Con un `redirect`
 * el formulario sería una ruta más: bastaría escribir `/charcu` en la barra
 * para saltárselo, y habría que repetir la comprobación en cada pantalla —el
 * mismo error que este layout evita con el login. Devolviendo el formulario en
 * vez de `children`, no hay URL dentro de la app que lo esquive.
 *
 * Y va SIN `AppFrame`: la barra de abajo invita a irse a otra pestaña, y de
 * este formulario no se sale hasta completarlo.
 */
export default async function AppLayout({
  children,
}: AppLayoutProps): Promise<ReactNode> {
  const user = await currentUser();

  if (user === null) {
    redirect(appRoutes.login);
  }

  /*
    Las tres lecturas van EN PARALELO.

    Estaban en cadena y era un error mío del 2026-08-29: al meter `readProfile`
    para la puerta del onboarding lo puse antes de `readQuota`, así que cada
    navegación dentro de la app esperaba un viaje a Supabase para poder empezar
    el siguiente. Ninguno depende del otro — los dos solo necesitan el `user.id`
    que ya tenemos.

    El visitante se lee aquí también, en vez de dentro del `if`, porque la
    cookie ya está puesta por el middleware y leerla no cuesta red.
  */
  const [profile, visitorId] = await Promise.all([
    readProfile(user.id),
    readVisitorIdFromCookies(),
  ]);

  if (profile.needsOnboarding) {
    return (
      <main className="mx-auto min-h-dvh max-w-lg px-5 py-12">
        <OnboardingFlow />
      </main>
    );
  }

  const quota = visitorId === null ? null : await readQuota(visitorId, user.id);

  return (
    <QuotaProvider initial={quota}>
      <AppFrame>{children}</AppFrame>
    </QuotaProvider>
  );
}
