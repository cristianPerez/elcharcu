import { type ReactNode } from 'react';

import {
  CapsuleCard,
  isFinished,
  type CapsuleState,
  type Course,
  type CourseProgress,
} from '@/entities/course';

import { SectionHeader } from '@/shared/ui';

interface CapsulePathProps {
  readonly capsules: readonly Course[];
  readonly progress: ReadonlyMap<string, CourseProgress>;
}

/**
 * "Empieza por aquí": las cápsulas gratis, en ruta.
 *
 * La actual es la primera sin terminar; las de después, cerradas. Se abre una
 * al terminar la anterior — la regla vive en `can_open_lesson()` (D12) y aquí
 * solo se pinta. En el celular se deslizan de lado; en escritorio caben las
 * cinco en fila.
 */
export function CapsulePath({ capsules, progress }: CapsulePathProps): ReactNode {
  if (capsules.length === 0) {
    return null;
  }

  const done = capsules.filter((c) => isFinished(progress.get(c.id))).length;
  const currentIndex = capsules.findIndex((c) => !isFinished(progress.get(c.id)));

  return (
    <section aria-labelledby="capsules-title">
      <SectionHeader
        id="capsules-title"
        title="Empieza por aquí"
        aside={`${String(done)} de ${String(capsules.length)} · gratis`}
      />
      <ol className="-mx-5 mt-4 flex snap-x scroll-px-5 gap-3 overflow-x-auto px-5 pb-1 [scrollbar-width:none] md:mx-0 md:grid md:grid-cols-[repeat(auto-fit,minmax(150px,1fr))] md:overflow-visible md:px-0 [&::-webkit-scrollbar]:hidden">
        {capsules.map((capsule, index) => {
          const state: CapsuleState = isFinished(progress.get(capsule.id))
            ? 'completada'
            : index === currentIndex
              ? 'actual'
              : 'bloqueada';

          return (
            <li key={capsule.id} className="w-[150px] shrink-0 snap-start md:w-auto">
              <CapsuleCard
                slug={capsule.slug}
                title={capsule.title}
                position={index + 1}
                state={state}
                className="h-full"
              />
            </li>
          );
        })}
      </ol>
    </section>
  );
}
