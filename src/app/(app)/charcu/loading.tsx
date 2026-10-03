import { type ReactNode } from 'react';

import { Skeleton, SkeletonLabel } from '@/shared/ui';

/**
 * El hueco del asistente: el saludo en el centro y la caja de escribir abajo,
 * con la columna de recetas en escritorio.
 */
export default function CharcuLoading(): ReactNode {
  return (
    <div className="lg:grid lg:grid-cols-[280px_1fr]">
      <SkeletonLabel>Abriendo el asistente</SkeletonLabel>
      <div className="hidden h-[calc(100dvh-72px)] border-r border-cocoa/10 bg-cream-white p-4 lg:block">
        <Skeleton className="h-12 w-full rounded-full" />
        <Skeleton className="mt-3 h-11 w-full rounded-full" />
      </div>
      <div className="mx-auto flex min-h-[calc(100dvh-8rem)] w-full max-w-[760px] flex-col items-center justify-center gap-4 px-4">
        <Skeleton className="size-12 rounded-full" />
        <Skeleton className="h-8 w-64" />
        <Skeleton className="mt-6 h-14 w-full rounded-full" />
      </div>
    </div>
  );
}
