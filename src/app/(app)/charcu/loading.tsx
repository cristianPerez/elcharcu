import { type ReactNode } from 'react';

import { Skeleton, SkeletonHeader, SkeletonLabel } from '@/shared/ui';

/**
 * El hueco del asistente.
 *
 * Se dibuja la caja de escribir con su forma real: es lo único que el usuario
 * tiene que hacer aquí, y verla ya en su sitio dice a dónde va el pulgar antes
 * de que la pantalla termine de cargar.
 */
export default function CharcuLoading(): ReactNode {
  return (
    <>
      <SkeletonLabel>Abriendo el asistente</SkeletonLabel>
      <SkeletonHeader />

      <div className="mt-6 rounded-2xl border border-cocoa/10 bg-cream-white p-4 shadow-raised">
        <Skeleton className="h-4 w-40" />
        <Skeleton className="mt-4 h-11 w-4/5 rounded-full" />
        <Skeleton className="mt-3 h-11 w-3/5 rounded-full" />
        <Skeleton className="mt-3 h-11 w-2/3 rounded-full" />
        <Skeleton className="mt-6 h-14 w-full rounded-full" />
      </div>
    </>
  );
}
