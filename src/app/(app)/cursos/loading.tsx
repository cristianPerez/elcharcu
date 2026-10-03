import { type ReactNode } from 'react';

import { Skeleton, SkeletonLabel } from '@/shared/ui';

/**
 * El hueco de "Mis cursos" mientras llega la lista.
 *
 * Que este archivo exista es lo que hace que tocar la pestaña cambie de
 * pantalla AL INSTANTE. Sin él, Next se espera a que el servidor termine antes
 * de mover nada, y el usuario se queda mirando la pestaña anterior sin señal
 * de que su toque hizo algo — así que vuelve a tocar.
 *
 * Tiene la forma de la pantalla nueva (título, buscador, chips, tarjeta,
 * cápsulas) para que al llegar el contenido no salte nada de sitio.
 */
export default function CursosLoading(): ReactNode {
  return (
    <div className="flex flex-col gap-9">
      <SkeletonLabel>Cargando tus cursos</SkeletonLabel>
      <div className="flex flex-col gap-5">
        <div className="flex flex-col gap-5 md:flex-row md:justify-between">
          <Skeleton className="h-8 w-40" />
          <Skeleton className="h-[52px] w-full rounded-full md:w-[420px]" />
        </div>
        <div className="flex gap-2 overflow-hidden">
          {[64, 92, 140, 140].map((width) => (
            <Skeleton
              key={width}
              className="h-11 shrink-0 rounded-full"
              style={{ width }}
            />
          ))}
        </div>
      </div>
      <Skeleton className="h-52 w-full rounded-card" />
      <div className="flex gap-3 overflow-hidden">
        {[1, 2, 3, 4, 5].map((n) => (
          <Skeleton
            key={n}
            className="h-[148px] w-[150px] shrink-0 rounded-card md:flex-1"
          />
        ))}
      </div>
    </div>
  );
}
