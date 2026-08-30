import Link from 'next/link';
import { type ReactNode } from 'react';

import { type Course, type CourseProgress } from '@/entities/course';

import { IconChevron, NavPendingBar } from '@/shared/ui';

interface CapsuleRowProps {
  readonly course: Course;
  readonly progress: CourseProgress | undefined;
  /** Su sitio en la ruta: 1 de 5. */
  readonly index: number;
  readonly total: number;
  /** `false` mientras no haya terminado la anterior. */
  readonly isOpen: boolean;
}

/**
 * Una cápsula de la ruta gratis.
 *
 * Es deliberadamente MÁS PEQUEÑA que `CourseRow`: sin foto grande, sin velo,
 * en una fila. Una cápsula resuelve una duda en tres minutos y una tarjeta de
 * 44 px de alto de foto le promete al ojo algo que no es. El curso es el que
 * merece la foto de la pieza terminada.
 *
 * El candado del secuencial se PINTA aquí, pero quien lo aplica es la base
 * (`can_open_lesson`). Esta pantalla solo cuenta lo que ya se decidió.
 */
export function CapsuleRow({
  course,
  progress,
  index,
  total,
  isOpen,
}: CapsuleRowProps): ReactNode {
  const done = progress?.doneLessons ?? 0;
  const lessons = progress?.totalLessons ?? 0;
  const isFinished = lessons > 0 && done === lessons;

  const body = (
    <div className="flex items-start gap-3.5">
      {/* El número de orden. Es lo que convierte cinco cosas sueltas en una
          ruta, y lo que hace que "vas 2 de 5" signifique algo. */}
      <span
        className={`mt-0.5 grid size-7 shrink-0 place-items-center rounded-full text-xs font-semibold ${
          isFinished
            ? 'bg-sage text-cream-white'
            : isOpen
              ? 'bg-terracota text-cream-white'
              : 'bg-cocoa/10 text-cocoa/40'
        }`}
      >
        {isFinished ? '✓' : index}
      </span>

      <div className="min-w-0 flex-1">
        <h3
          className={`font-serif text-lg font-semibold leading-snug ${
            isOpen ? 'text-forest' : 'text-cocoa/45'
          }`}
        >
          {course.title}
        </h3>
        <p
          className={`mt-1 text-sm leading-relaxed ${
            isOpen ? 'text-cocoa/65' : 'text-cocoa/40'
          }`}
        >
          {isOpen
            ? course.summary
            : `Se abre cuando termines la ${String(index - 1)} de ${String(total)}.`}
        </p>
      </div>

      {isOpen ? <IconChevron size={18} className="mt-1 shrink-0 text-cocoa/30" /> : null}
    </div>
  );

  const shell =
    'relative block overflow-hidden rounded-2xl border border-cocoa/10 bg-cream-white p-4 shadow-surface';

  // Sin enlace cuando está cerrada: un enlace que lleva a un muro gasta un
  // toque y una espera para no dar nada.
  return isOpen ? (
    <Link
      href={`/cursos/${course.slug}`}
      className={`${shell} transition-transform active:scale-[0.99]`}
    >
      <NavPendingBar />
      {body}
    </Link>
  ) : (
    <div className={`${shell} opacity-80`}>{body}</div>
  );
}
