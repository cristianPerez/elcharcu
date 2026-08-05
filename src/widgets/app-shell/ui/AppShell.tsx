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
 * Marco de las pantallas del producto: fondo de marca y logo, sin la navegación
 * del sitio público. Menos salidas, más gente que termina lo que empezó.
 */
export function AppShell({
  children,
  withHeaderBorder = false,
  centered = false,
}: AppShellProps): ReactNode {
  return (
    <div className="bg-grain flex min-h-screen flex-col bg-forest">
      <header
        className={cn(
          'px-6 py-6 md:px-10',
          withHeaderBorder && 'border-b border-cream/10',
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
