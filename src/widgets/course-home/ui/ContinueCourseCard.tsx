import Link from 'next/link';
import { type ReactNode } from 'react';

import { CoverPanel, IconPlay, ProgressBar, coverToneFor } from '@/shared/ui';

interface ContinueCourseCardProps {
  readonly slug: string;
  readonly title: string;
  readonly coverUrl: string | null;
  readonly nextLessonHref: string;
  /** La lección que toca, contando desde 1. */
  readonly nextLessonNumber: number;
  readonly totalLessons: number;
  readonly percent: number;
}

/**
 * "Sigue donde ibas": el último curso que la persona tocó y no terminó.
 *
 * Es verde con grano (al 6 %) porque es lo único de la pantalla que ya es SUYO; el resto
 * es catálogo. Si no hay ninguno en marcha, la vista ni la monta: una tarjeta
 * vacía de "empieza algo" repetiría lo que ya dice "Empieza por aquí".
 */
export function ContinueCourseCard({
  slug,
  title,
  coverUrl,
  nextLessonHref,
  nextLessonNumber,
  totalLessons,
  percent,
}: ContinueCourseCardProps): ReactNode {
  return (
    <section
      aria-labelledby="continue-title"
      className="bg-grain-strong relative flex items-center gap-7 overflow-hidden rounded-card bg-forest p-[22px] md:p-7"
    >
      {/* El aro y la pieza colgada: decoración del celular, como en la maqueta.
          En escritorio ese sitio lo ocupa la portada. */}
      <svg
        width="150"
        height="150"
        viewBox="0 0 150 150"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.2"
        aria-hidden="true"
        className="pointer-events-none absolute -right-[30px] -top-[30px] text-sage-light opacity-[0.18] lg:hidden"
      >
        <circle cx="75" cy="75" r="70" />
        <circle cx="75" cy="75" r="56" />
        <path d="M75 40v20M68 60h14l-3 40h-8z" />
      </svg>
      <CoverPanel
        title={title}
        imageUrl={coverUrl}
        tone={coverToneFor(slug)}
        size="lg"
        className="hidden size-36 shrink-0 rounded-xl lg:block"
      />
      <div className="relative min-w-0 flex-1 md:flex md:items-center md:gap-8">
        <div className="min-w-0 flex-1">
          <p className="flex items-center gap-2.5 text-[11px] font-semibold uppercase tracking-[0.24em] text-sage-light">
            <span aria-hidden="true" className="h-px w-[18px] bg-sage-light lg:hidden" />
            Sigue donde ibas
          </p>
          <h2
            id="continue-title"
            className="mt-2 font-serif text-[22px] font-semibold leading-tight text-cream"
          >
            {title}
          </h2>
          <p className="mt-1 text-sm text-cream/85">
            Siguiente: lección {nextLessonNumber} de {totalLessons}
          </p>
          <div className="mt-4 flex items-center gap-3">
            <ProgressBar value={percent} tone="dark" label={`Avance en ${title}`} />
            <span className="shrink-0 text-sm font-semibold text-brasa-light">
              {percent}%
            </span>
          </div>
        </div>
        <Link
          href={nextLessonHref}
          className="mt-5 inline-flex min-h-12 shrink-0 items-center gap-2.5 rounded-full bg-brasa px-6 text-[15px] font-semibold text-cocoa transition-colors hover:bg-brasa-dark md:mt-0"
        >
          <IconPlay size={12} />
          Continuar lección
        </Link>
      </div>
    </section>
  );
}
