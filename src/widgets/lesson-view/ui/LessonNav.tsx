import Link from 'next/link';
import { type ReactNode } from 'react';

import { cn } from '@/shared/lib';

interface LessonNavProps {
  readonly courseHref: string;
  readonly courseTitle: string;
  readonly moduleTitle: string;
  readonly previousHref: string | null;
  readonly nextHref: string | null;
  /** "3 de 4", para saber cuánto falta sin abrir el índice. */
  readonly step: string;
}

/**
 * La barra de navegación de dentro del curso.
 *
 * Va ARRIBA y no abajo: abajo ya están las tres pestañas de la app, y dos
 * barras peleándose por el mismo pulgar es la forma más rápida de que alguien
 * salga del curso sin querer.
 *
 * Tiene que responder tres preguntas de un vistazo: dónde estoy, cómo vuelvo,
 * y qué viene ahora. Sin lo último la gente termina una lección y se va, que
 * es justo lo contrario de lo que queremos.
 */
export function LessonNav({
  courseHref,
  courseTitle,
  moduleTitle,
  previousHref,
  nextHref,
  step,
}: LessonNavProps): ReactNode {
  return (
    <nav
      aria-label="Navegación del curso"
      className="-mx-4 mb-6 border-b border-cocoa/10 bg-cream-white px-4 py-3"
    >
      <Link
        href={courseHref}
        className="flex items-center gap-1.5 text-sm font-medium text-terracota-dark"
      >
        <span aria-hidden="true">‹</span>
        <span className="truncate">{courseTitle}</span>
      </Link>

      <div className="mt-2 flex items-center justify-between gap-3">
        <p className="min-w-0 flex-1 truncate text-xs text-cocoa/55">
          {moduleTitle} · {step}
        </p>

        <div className="flex shrink-0 gap-2">
          <NavArrow href={previousHref} label="Lección anterior" glyph="‹" />
          <NavArrow href={nextHref} label="Lección siguiente" glyph="›" />
        </div>
      </div>
    </nav>
  );
}

interface NavArrowProps {
  readonly href: string | null;
  readonly label: string;
  readonly glyph: string;
}

/**
 * La flecha, apagada cuando no hay a dónde ir.
 *
 * Se pinta igual aunque no lleve a ningún lado —en gris y sin enlace— en vez
 * de desaparecer: si el botón se va, los otros se mueven de sitio y el dedo
 * acaba pulsando lo que no era.
 */
function NavArrow({ href, label, glyph }: NavArrowProps): ReactNode {
  const shape =
    'flex size-9 items-center justify-center rounded-full border text-lg leading-none';

  if (href === null) {
    return (
      <span aria-hidden="true" className={cn(shape, 'border-cocoa/10 text-cocoa/25')}>
        {glyph}
      </span>
    );
  }

  return (
    <Link
      href={href}
      aria-label={label}
      className={cn(
        shape,
        'border-cocoa/15 text-cocoa/70 transition-colors active:scale-95 active:bg-cream',
      )}
    >
      <span aria-hidden="true">{glyph}</span>
    </Link>
  );
}
