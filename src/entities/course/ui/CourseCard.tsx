import Link from 'next/link';
import { type ReactNode } from 'react';

import { cn } from '@/shared/lib';
import {
  Badge,
  CoverPanel,
  ProgressBar,
  coverToneFor,
  type BadgeTone,
} from '@/shared/ui';

import { type CourseCardVariant } from '../lib/courseState';

/**
 * Las fotos de los cursos, apagadas a propósito (rediseño 2026-10).
 *
 * Cuatro cursos tienen `cover_url` en la base, pero el rediseño pide paneles
 * de color con la inicial "por ahora". Volver a las fotos es cambiar esto a
 * `true`: `CoverPanel` ya sabe pintarlas.
 */
const SHOW_COVER_PHOTOS = false;

const BADGES: Record<CourseCardVariant, { label: string; tone: BadgeTone }> = {
  gratis: { label: 'Gratis', tone: 'brasa' },
  pro: { label: 'Pro', tone: 'cream' },
  'en-curso': { label: 'En curso', tone: 'brasa' },
  proximo: { label: 'Próximo', tone: 'cream' },
  'te-avisamos': { label: 'Te avisamos', tone: 'sage' },
};

interface CourseCardProps {
  readonly slug: string;
  /** Puede venir con el término resaltado; `plainTitle` es para la inicial. */
  readonly title: ReactNode;
  readonly plainTitle: string;
  readonly coverUrl: string | null;
  readonly variant: CourseCardVariant;
  /** "Curados · Para empezar", encima del título. */
  readonly eyebrow?: string | undefined;
  /** "7 lecciones", "Aún no está grabado". */
  readonly meta?: ReactNode | undefined;
  readonly summary?: string | undefined;
  readonly progress?: { readonly done: number; readonly total: number } | undefined;
  /** La llamada de abajo ("Ver curso →") o el botón de la lista de espera. */
  readonly action?: ReactNode | undefined;
  readonly layout?: 'vertical' | 'horizontal' | undefined;
  /** La tarjeta del curso en marcha se marca con el borde naranja. */
  readonly className?: string | undefined;
}

/**
 * La tarjeta de un curso, en sus cinco caras: gratis, pro, en curso, próximo y
 * "te avisamos".
 *
 * El enlace es el TÍTULO, estirado sobre toda la tarjeta con un `::after`. Así
 * la tarjeta entera se toca, y aun así la acción de abajo puede ser un botón
 * de verdad —"Avísame"— sin meter un botón dentro de un enlace, que los
 * lectores de pantalla no saben anunciar.
 */
export function CourseCard({
  slug,
  title,
  plainTitle,
  coverUrl,
  variant,
  eyebrow,
  meta,
  summary,
  progress,
  action,
  layout = 'vertical',
  className,
}: CourseCardProps): ReactNode {
  const badge = BADGES[variant];
  const isHorizontal = layout === 'horizontal';

  return (
    <article
      className={cn(
        'relative flex overflow-hidden rounded-card border bg-cream-white transition-colors',
        variant === 'en-curso' ? 'border-brasa' : 'border-cocoa/10 hover:border-cocoa/20',
        isHorizontal ? 'flex-row items-stretch gap-3 p-3' : 'flex-col',
        className,
      )}
    >
      <CoverPanel
        title={plainTitle}
        imageUrl={SHOW_COVER_PHOTOS ? coverUrl : null}
        tone={coverToneFor(slug)}
        size={isHorizontal ? 'sm' : 'md'}
        className={cn(isHorizontal ? 'size-24 shrink-0 rounded-xl' : 'h-32 md:h-36')}
      >
        {isHorizontal ? null : (
          <Badge tone={badge.tone} className="absolute left-3 top-3">
            {badge.label}
          </Badge>
        )}
      </CoverPanel>

      <div className={cn('flex min-w-0 flex-1 flex-col', !isHorizontal && 'p-4')}>
        {isHorizontal ? (
          <Badge
            tone={
              variant === 'pro' ? 'forest' : badge.tone === 'cream' ? 'muted' : badge.tone
            }
            className="mb-1 self-start"
          >
            {variant === 'proximo' ? 'En preparación' : badge.label}
          </Badge>
        ) : null}
        {eyebrow === undefined ? null : (
          <p className="mb-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-brasa-tinta">
            {eyebrow}
          </p>
        )}
        <h3 className="font-serif text-[17px] font-semibold leading-snug text-cocoa">
          <Link
            href={`/cursos/${slug}`}
            className="after:absolute after:inset-0 after:content-[''] focus-visible:outline-none focus-visible:after:rounded-card focus-visible:after:ring-2 focus-visible:after:ring-forest"
          >
            {title}
          </Link>
        </h3>
        {summary === undefined ? null : (
          <p className="mt-1.5 line-clamp-2 text-sm leading-relaxed text-cocoa-soft">
            {summary}
          </p>
        )}
        {progress === undefined ? null : (
          <div className="mt-2 flex items-center gap-3">
            <ProgressBar
              value={progress.total === 0 ? 0 : (progress.done / progress.total) * 100}
              label={`Avance en ${plainTitle}`}
            />
            <span className="shrink-0 text-xs font-semibold text-cocoa">
              {progress.done}/{progress.total}
            </span>
          </div>
        )}
        {meta === undefined ? null : (
          <p className="mt-1 text-[13px] text-cocoa-soft">{meta}</p>
        )}
        {action === undefined ? null : (
          <div className="relative z-10 mt-auto pt-1">{action}</div>
        )}
      </div>
    </article>
  );
}
