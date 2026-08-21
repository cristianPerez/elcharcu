import Image from 'next/image';
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
 * La tarjeta tiene DOS mitades a propósito (2026-08-21):
 *
 *   · Arriba, la foto de la pieza terminada con un velo oscuro encima y el
 *     título en blanco. Es lo que vende: nadie se apunta a un curso de curado
 *     por leer un título, se apunta por ver el lomo cortado.
 *   · Abajo, superficie clara y los colores de siempre para lo que se LEE — el
 *     resumen y el progreso. Texto largo sobre una foto se lee mal por más
 *     velo que se le ponga.
 *
 * El velo no es decoración: sin él, el blanco sobre una foto clara desaparece,
 * y una foto de carne cruda tiene zonas claras y oscuras en la misma imagen.
 * Va en degradado —más oscuro abajo, donde está el texto— para que la foto se
 * siga viendo arriba.
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
      className="block overflow-hidden rounded-2xl border border-cocoa/10 bg-cream-white shadow-raised transition-transform active:scale-[0.98]"
    >
      <div className="relative h-44 w-full">
        {course.coverUrl === null ? (
          <div className="absolute inset-0 bg-forest" />
        ) : (
          <Image
            src={course.coverUrl}
            alt=""
            fill
            sizes="(max-width: 448px) 100vw, 448px"
            className="object-cover"
            priority
          />
        )}

        {/* El velo. Degradado y no plano: arriba deja ver la foto, abajo
            garantiza que el blanco se lea pase lo que pase en la imagen. */}
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-gradient-to-t from-cocoa/85 via-cocoa/45 to-cocoa/20"
        />

        {course.access === 'libre' ? (
          <span className="absolute right-3 top-3 rounded-full bg-terracota px-3 py-1 text-xs font-semibold uppercase tracking-wide text-cream-white shadow-surface">
            Gratis
          </span>
        ) : null}

        <div className="absolute inset-x-0 bottom-0 p-5">
          <p className="text-xs font-medium uppercase tracking-eyebrow text-cream/85">
            {isFinished ? 'Terminado' : isStarted ? 'Sigue donde ibas' : 'Empieza aquí'}
          </p>
          <h2 className="mt-1.5 font-serif text-2xl font-semibold leading-tight text-cream-white">
            {course.title}
          </h2>
        </div>
      </div>

      <div className="p-5">
        <p className="text-base leading-relaxed text-cocoa/70">{course.summary}</p>

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
      </div>
    </Link>
  );
}
