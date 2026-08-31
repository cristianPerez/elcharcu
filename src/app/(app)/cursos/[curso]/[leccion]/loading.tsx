import { type ReactNode } from 'react';

import { Skeleton, SkeletonLabel } from '@/shared/ui';

/**
 * El hueco de una lección.
 *
 * La barra de navegación de arriba se dibuja entera —incluidas las dos
 * flechas— porque es lo que no debe moverse: si apareciera después, el dedo
 * que ya iba a "siguiente" acabaría pulsando otra cosa.
 */
export default function LeccionLoading(): ReactNode {
  return (
    <>
      <SkeletonLabel>Abriendo la lección</SkeletonLabel>

      <div className="-mx-4 mb-6 border-b border-cocoa/10 bg-cream-white px-4 py-3">
        <Skeleton className="h-4 w-32" />
        <div className="mt-2 flex items-center justify-between gap-3">
          <Skeleton className="h-3 w-40" />
          <div className="flex shrink-0 gap-2">
            <Skeleton className="size-9 rounded-full" />
            <Skeleton className="size-9 rounded-full" />
          </div>
        </div>
      </div>

      <Skeleton className="h-8 w-3/4" />
      <Skeleton className="mt-5 h-40 w-full rounded-2xl" />
      <Skeleton className="mt-5 h-24 w-full rounded-2xl" />
      <Skeleton className="mt-8 h-12 w-full rounded-full" />
    </>
  );
}
