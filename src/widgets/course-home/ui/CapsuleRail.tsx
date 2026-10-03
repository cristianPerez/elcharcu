import Link from 'next/link';
import { type ReactNode } from 'react';

import {
  CapsuleCard,
  capsuleSteps,
  isFinished,
  type Course,
  type CourseProgress,
} from '@/entities/course';

import { appRoutes } from '@/shared/config';
import { cn } from '@/shared/lib';
import { IconArrowRight, IconCheck } from '@/shared/ui';

import { CapsuleScroller } from './CapsuleScroller';

interface CapsuleRailProps {
  readonly capsules: readonly Course[];
  readonly progress: ReadonlyMap<string, CourseProgress>;
  /** Cursos con alguna actividad: la actual dice "Continuar" si está aquí. */
  readonly touchedIds: ReadonlySet<string>;
}

/**
 * "Empieza por aquí": las cápsulas gratis, en ruta. Se abre una al terminar
 * la anterior; el orden es `courses.position`.
 *
 * Con las cinco hechas la sección ya no tiene nada que ofrecer, así que se
 * queda en una línea que lleva al siguiente escalón.
 */
export function CapsuleRail({
  capsules,
  progress,
  touchedIds,
}: CapsuleRailProps): ReactNode {
  if (capsules.length === 0) {
    return null;
  }

  const done = capsules.filter((c) => isFinished(progress.get(c.id))).length;

  if (done === capsules.length) {
    return (
      <p className="flex flex-wrap items-center gap-x-2 gap-y-1 text-[15px] text-cocoa-soft">
        <IconCheck size={16} strokeWidth={2.4} className="text-forest" />
        Completaste las cápsulas gratis.
        <Link
          href={appRoutes.appMasterCourses}
          className="inline-flex min-h-11 items-center gap-1 font-semibold text-brasa-tinta hover:text-brasa-dark"
        >
          Lo que sigue está en los cursos maestros
          <IconArrowRight size={15} strokeWidth={2} />
        </Link>
      </p>
    );
  }

  const steps = capsuleSteps(capsules, progress);
  const currentIndex = capsules.findIndex((c) => steps.get(c.id)?.state === 'actual');

  return (
    <section aria-labelledby="capsules-title">
      <div className="flex items-baseline justify-between gap-4">
        <h2
          id="capsules-title"
          className="font-serif text-lg font-semibold text-forest md:text-xl"
        >
          Empieza por aquí
        </h2>
        <span className="shrink-0 text-[13px] text-cocoa-soft">
          {done} de {capsules.length} · gratis
        </span>
      </div>
      <CapsuleScroller currentIndex={currentIndex}>
        {capsules.map((capsule, index) => {
          const state = steps.get(capsule.id)?.state ?? 'bloqueada';
          return (
            <li
              key={capsule.id}
              className={cn(
                'shrink-0 snap-start md:w-auto',
                state === 'actual' ? 'w-[170px]' : 'w-[150px]',
              )}
            >
              <CapsuleCard
                slug={capsule.slug}
                title={capsule.title}
                position={index + 1}
                state={state}
                icon={capsule.icon}
                isStarted={
                  touchedIds.has(capsule.id) ||
                  (progress.get(capsule.id)?.doneLessons ?? 0) > 0
                }
              />
            </li>
          );
        })}
      </CapsuleScroller>
    </section>
  );
}
