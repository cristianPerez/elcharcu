import { type ReactNode } from 'react';

import { SkeletonCard, SkeletonHeader, SkeletonLabel } from '@/shared/ui';

/**
 * El hueco de "Mis cursos" mientras llega la lista.
 *
 * Que este archivo exista es lo que hace que tocar la pestaña cambie de
 * pantalla AL INSTANTE. Sin él, Next se espera a que el servidor termine antes
 * de mover nada, y el usuario se queda mirando la pestaña anterior sin señal
 * de que su toque hizo algo — así que vuelve a tocar.
 */
export default function CursosLoading(): ReactNode {
  return (
    <>
      <SkeletonLabel>Cargando tus cursos</SkeletonLabel>
      <SkeletonHeader />
      <div className="mt-6 space-y-4">
        <SkeletonCard />
        <SkeletonCard />
      </div>
    </>
  );
}
