'use client';

import { useLinkStatus } from 'next/link';
import { type ReactNode } from 'react';

import { cn } from '@/shared/lib';

interface NavPendingProps {
  /** Qué pintar mientras se va. Por defecto, un punto que late. */
  readonly children?: ReactNode;
  readonly className?: string;
}

/**
 * Señal de "te oí" desde el instante del toque.
 *
 * ⚠️ RESUELVE ALGO QUE EL `loading.tsx` NO PUEDE (2026-08-29).
 *
 * Los esqueletos ya existen en las cinco rutas, pero llegan tarde: el
 * `loading.tsx` se pinta cuando la navegación YA EMPEZÓ, y antes de eso hay un
 * hueco en el que el navegador está esperando la respuesta del servidor y en
 * pantalla no se mueve nada. En ese hueco caben el middleware, la sesión de
 * Supabase y —en desarrollo— la compilación de la ruta. El usuario toca, no
 * pasa nada, y vuelve a tocar.
 *
 * `useLinkStatus` vive DENTRO del `<Link>` y se pone en `pending` en el mismo
 * clic, sin esperar a nadie. Es lo que tapa ese hueco.
 *
 * Solo funciona como descendiente de un `<Link>` de Next; fuera devuelve
 * `pending: false` y esto no pinta nada, que es el comportamiento correcto.
 */
export function NavPending({ children, className }: NavPendingProps): ReactNode {
  const { pending } = useLinkStatus();

  if (!pending) {
    return null;
  }

  return (
    <span aria-hidden="true" className={cn('inline-flex items-center', className)}>
      {children ?? <span className="size-1.5 animate-pulse rounded-full bg-terracota" />}
    </span>
  );
}

/**
 * La versión para una tarjeta entera: una barra fina que corre por arriba.
 *
 * Se usa donde el elemento tocado es grande —una tarjeta de curso, una fila de
 * cápsula— y un punto se perdería. La barra ocupa el borde superior, que es lo
 * que el ojo ya asocia con "esto está cargando" de los navegadores.
 */
export function NavPendingBar(): ReactNode {
  const { pending } = useLinkStatus();

  if (!pending) {
    return null;
  }

  return (
    <span
      aria-hidden="true"
      className="absolute inset-x-0 top-0 h-0.5 overflow-hidden rounded-t-2xl bg-terracota/20"
    >
      <span className="block h-full w-1/3 animate-[nav-sweep_1s_ease-in-out_infinite] rounded-full bg-terracota" />
    </span>
  );
}
