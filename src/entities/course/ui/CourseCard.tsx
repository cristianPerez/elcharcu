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

const BADGES: Record<CourseCardVariant, { label: string; tone: BadgeTone }> = {
  gratis: { label: 'Gratis', tone: 'brasa' },
  pro: { label: 'Pro', tone: 'cream' },
  'en-curso': { label: 'En curso', tone: 'brasa' },
  proximo: { label: 'Próximo', tone: 'cream' },
  'te-avisamos': { label: 'Te avisamos', tone: 'sage' },
};

/**
 * Las tres formas de la tarjeta. `null` = esa pieza no sale en esa forma.
 * La etiqueta va sobre la portada cuando hay portada grande, y junto al título
 * cuando la portada es una miniatura.
 */
const LAYOUTS = {
  vertical: {
    root: 'flex-col',
    cover: 'h-32 md:h-36',
    letter: 'md',
    coverBadge: '',
    bodyBadge: null,
    body: 'p-4',
  },
  horizontal: {
    root: 'flex-row items-stretch gap-3 p-3',
    cover: 'size-24 shrink-0 rounded-xl',
    letter: 'sm',
    coverBadge: null,
    bodyBadge: '',
    body: '',
  },
  responsive: {
    root: 'flex-row items-stretch gap-3 p-3 md:flex-col md:gap-0 md:p-0',
    cover: 'size-24 shrink-0 rounded-xl md:h-32 md:w-full md:rounded-none',
    letter: 'sm-md',
    coverBadge: 'hidden md:inline-flex',
    bodyBadge: 'md:hidden',
    body: 'md:p-4',
  },
} as const;

interface CourseCardProps {
  readonly slug: string;
  /** Puede venir con el término resaltado; `plainTitle` es para la inicial. */
  readonly title: ReactNode;
  readonly plainTitle: string;
  readonly coverUrl: string | null;
  readonly variant: CourseCardVariant;
  /** Para cambiar el texto de la etiqueta sin cambiar su forma ("Gratis con cuenta"). */
  readonly badgeLabel?: string | undefined;
  /** "Curados · Para empezar", encima del título. */
  readonly eyebrow?: string | undefined;
  /** "7 lecciones", "Aún no está grabado". */
  readonly meta?: ReactNode | undefined;
  readonly summary?: string | undefined;
  readonly progress?: { readonly done: number; readonly total: number } | undefined;
  /** La llamada de abajo ("Ver curso →") o el botón de la lista de espera. */
  readonly action?: ReactNode | undefined;
  /**
   * `responsive`: fila con miniatura en el celular y tarjeta con portada desde
   * 768 px. Una sola tarjeta, no dos escondidas: el botón de la lista de espera
   * no puede existir dos veces.
   */
  readonly layout?: 'vertical' | 'horizontal' | 'responsive' | undefined;
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
  badgeLabel,
  eyebrow,
  meta,
  summary,
  progress,
  action,
  layout = 'vertical',
  className,
}: CourseCardProps): ReactNode {
  const badge = BADGES[variant];
  const styles = LAYOUTS[layout];

  return (
    <article
      className={cn(
        'relative flex overflow-hidden rounded-card border bg-cream-white transition-colors',
        variant === 'en-curso' ? 'border-brasa' : 'border-cocoa/10 hover:border-cocoa/20',
        styles.root,
        className,
      )}
    >
      <CoverPanel
        title={plainTitle}
        imageUrl={coverUrl}
        tone={coverToneFor(slug)}
        size={styles.letter}
        className={styles.cover}
      >
        {styles.coverBadge === null ? null : (
          <Badge
            tone={badge.tone}
            className={cn('absolute left-3 top-3', styles.coverBadge)}
          >
            {badgeLabel ?? badge.label}
          </Badge>
        )}
      </CoverPanel>

      <div className={cn('flex min-w-0 flex-1 flex-col', styles.body)}>
        {styles.bodyBadge === null ? null : (
          <Badge
            tone={
              variant === 'pro' ? 'forest' : badge.tone === 'cream' ? 'muted' : badge.tone
            }
            className={cn('mb-1 self-start', styles.bodyBadge)}
          >
            {variant === 'proximo' ? 'En preparación' : (badgeLabel ?? badge.label)}
          </Badge>
        )}
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
