import Link from 'next/link';
import { type ReactNode } from 'react';

import { appRoutes } from '@/shared/config';
import { cn } from '@/shared/lib';
import { Logo } from '@/shared/ui';

interface AppShellProps {
  readonly children: ReactNode;
  /** Separa visualmente el encabezado cuando el contenido empieza pegado. */
  readonly withHeaderBorder?: boolean | undefined;
  /** Centra el contenido verticalmente (onboarding, muro). */
  readonly centered?: boolean | undefined;
}

/**
 * Marco de las pantallas del producto: sin la navegación del sitio público.
 * Menos salidas, más gente que termina lo que empezó.
 *
 * Fondo CLARO desde el 2026-08-15. Antes era verde oscuro, y al rehacer el chat
 * para superficie clara quedaron dos sistemas de diseño en el mismo producto:
 * el home en crema y todo `/asistente/*` en verde, con los textos de apoyo del
 * chat (`cocoa/40`) ilegibles sobre el verde. Se arregla en el marco y no
 * pantalla por pantalla, que es donde estaba la causa.
 *
 * La barra de arriba se queda verde a propósito: es la firma de marca y separa
 * el encabezado del lienzo de trabajo.
 */
export function AppShell({
  children,
  withHeaderBorder = false,
  centered = false,
}: AppShellProps): ReactNode {
  return (
    <div className="flex min-h-screen flex-col bg-cream">
      <header
        className={cn(
          'bg-forest px-6 py-6 md:px-10',
          withHeaderBorder && 'border-b border-cocoa/10',
        )}
      >
        <Link href={appRoutes.sales} aria-label="Volver a El Charcu">
          <Logo tone="light" />
        </Link>
      </header>

      <main className={cn('flex-1', centered && 'flex items-center px-6 pb-16 md:px-10')}>
        {centered ? <div className="mx-auto w-full max-w-xl">{children}</div> : children}
      </main>
    </div>
  );
}
