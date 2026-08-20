import { type ReactNode } from 'react';

import { Skeleton, SkeletonLabel } from '@/shared/ui';

/** El hueco de un curso: portada, progreso y el acordeón de módulos. */
export default function CursoLoading(): ReactNode {
  return (
    <>
      <SkeletonLabel>Abriendo el curso</SkeletonLabel>
      <Skeleton className="h-4 w-24" />
      <Skeleton className="mt-3 h-9 w-3/4" />
      <Skeleton className="mt-3 h-4 w-full" />
      <Skeleton className="mt-2 h-4 w-5/6" />

      <div className="mt-5 rounded-2xl border border-cocoa/10 bg-cream-white p-5 shadow-surface">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="mt-2 h-1.5 w-full" />
        <Skeleton className="mt-4 h-12 w-full rounded-full" />
      </div>

      <Skeleton className="mt-8 h-4 w-24" />
      <div className="mt-3 space-y-3">
        <Skeleton className="h-[72px] w-full rounded-2xl" />
        <Skeleton className="h-[72px] w-full rounded-2xl" />
      </div>
    </>
  );
}
