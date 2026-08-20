import { type ReactNode } from 'react';

import { Skeleton, SkeletonHeader, SkeletonLabel } from '@/shared/ui';

/** El hueco de "Mi cuenta": la tarjeta del cupo y los datos. */
export default function CuentaLoading(): ReactNode {
  return (
    <>
      <SkeletonLabel>Cargando tu cuenta</SkeletonLabel>
      <SkeletonHeader />

      <div className="mt-6 rounded-2xl border border-cocoa/10 bg-cream-white p-5 shadow-raised">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="mt-5 h-4 w-2/3" />
        <Skeleton className="mt-2 h-1.5 w-full" />
        <Skeleton className="mt-5 h-4 w-1/2" />
        <Skeleton className="mt-2 h-1.5 w-full" />
      </div>

      <Skeleton className="mt-4 h-[68px] w-full rounded-2xl" />
      <Skeleton className="mt-8 h-[70px] w-full rounded-xl" />
    </>
  );
}
