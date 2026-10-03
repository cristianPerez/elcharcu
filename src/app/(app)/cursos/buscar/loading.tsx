import { type ReactNode } from 'react';

import { Skeleton, SkeletonLabel } from '@/shared/ui';

/** El hueco de la búsqueda: buscador arriba, filtros y resultados debajo. */
export default function BuscarLoading(): ReactNode {
  return (
    <div className="flex flex-col gap-6">
      <SkeletonLabel>Buscando</SkeletonLabel>
      <Skeleton className="h-[52px] w-full rounded-full" />
      <div className="grid gap-6 md:grid-cols-[240px_1fr] lg:grid-cols-[300px_1fr]">
        <Skeleton className="hidden h-96 rounded-card md:block" />
        <div className="flex flex-col gap-3">
          <Skeleton className="h-4 w-48" />
          <Skeleton className="h-28 w-full rounded-card" />
          <Skeleton className="h-28 w-full rounded-card" />
        </div>
      </div>
    </div>
  );
}
