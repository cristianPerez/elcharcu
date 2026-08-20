import Link from 'next/link';
import { type ReactNode } from 'react';

import { type Course, type CourseProgress } from '@/entities/course';

import { IconChevron } from '@/shared/ui';

interface CourseRowProps {
  readonly course: Course;
  readonly progress: CourseProgress | undefined;
}

/**
 * Una fila de la lista de cursos.
 *
 * Lleva el progreso a la vista —la barra y el "2 de 4"— porque eso es lo que
 * convierte un índice en un sitio al que se vuelve. Sin él, quien abre la app
 * tiene que acordarse de por dónde iba, y acordarse es fricción.
 */
export function CourseRow({ course, progress }: CourseRowProps): ReactNode {
  const done = progress?.doneLessons ?? 0;
  const total = progress?.totalLessons ?? 0;
  const percent = progress?.percent ?? 0;
  const isStarted = done > 0;
  const isFinished = total > 0 && done === total;

  return (
    <Link
      href={`/cursos/${course.slug}`}
      className="block rounded-2xl border border-cocoa/10 bg-cream-white p-5 shadow-raised transition-transform active:scale-[0.98]"
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-medium uppercase tracking-eyebrow text-terracota-dark">
            {isFinished ? 'Terminado' : isStarted ? 'Sigue donde ibas' : 'Empieza aquí'}
          </p>
          <h2 className="mt-2 font-serif text-2xl font-semibold leading-tight text-forest">
            {course.title}
          </h2>
        </div>
        {course.access === 'libre' ? (
          <span className="mt-1 shrink-0 rounded-full bg-sage/15 px-2.5 py-1 text-xs font-medium text-forest">
            Gratis
          </span>
        ) : null}
      </div>

      <p className="mt-2 text-base leading-relaxed text-cocoa/70">{course.summary}</p>

      {total > 0 ? (
        <div className="mt-4">
          <div className="flex items-baseline justify-between text-sm">
            <span className="text-cocoa/55">
              {done} de {total} lecciones
            </span>
            <span className="font-medium text-cocoa">{percent}%</span>
          </div>
          <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-cream">
            <div
              className="h-full rounded-full bg-sage transition-[width] duration-500"
              style={{ width: `${percent}%` }}
            />
          </div>
        </div>
      ) : null}

      <span className="mt-4 flex items-center gap-1 text-sm font-medium text-terracota-dark">
        {isStarted && !isFinished ? 'Continuar' : 'Abrir el curso'}
        <IconChevron size={16} />
      </span>
    </Link>
  );
}
