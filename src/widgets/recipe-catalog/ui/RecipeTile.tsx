import Link from 'next/link';
import { type ReactNode } from 'react';

import { cn } from '@/shared/lib';
import { IconLock } from '@/shared/ui';

interface RecipeTileProps {
  readonly name: string;
  readonly image: string;
  readonly eyebrow?: string | undefined;
  readonly meta?: string | null | undefined;
  /** Con slug es un enlace; sin él, un botón (la receta con candado). */
  readonly href?: string | undefined;
  readonly onLockedTap?: (() => void) | undefined;
  readonly hasCourse?: boolean | undefined;
  readonly isLocked?: boolean | undefined;
}

/** La tarjeta de receta del recetario (diseño final 08 y 10). */
export function RecipeTile({
  name,
  image,
  eyebrow,
  meta,
  href,
  onLockedTap,
  hasCourse = false,
  isLocked = false,
}: RecipeTileProps): ReactNode {
  const body = (
    <>
      <span className="relative block h-28 bg-cream-muted md:h-40">
        <span
          aria-hidden="true"
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${image})` }}
        />
        {hasCourse ? (
          <span className="absolute left-2.5 top-2.5 rounded-full bg-cream-white px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-forest">
            Tiene curso
          </span>
        ) : null}
        {isLocked ? (
          <span className="absolute right-2.5 top-2.5 inline-flex items-center gap-1 rounded-full bg-cocoa/85 px-2.5 py-1 text-xs font-semibold text-cream-white">
            <IconLock size={12} strokeWidth={2.2} /> Pro
          </span>
        ) : null}
      </span>
      <span className="block p-3.5 md:p-4">
        {eyebrow ? (
          <span className="block text-[10px] font-semibold uppercase tracking-eyebrow text-brasa-tinta">
            {eyebrow}
          </span>
        ) : null}
        <span className="mt-1 block font-serif text-[17px] font-semibold leading-tight text-cocoa">
          {name}
        </span>
        {meta ? <span className="mt-1 block text-xs text-cocoa-soft">{meta}</span> : null}
      </span>
    </>
  );
  const classes = cn(
    'block h-full overflow-hidden rounded-2xl bg-cream-white text-left transition-shadow hover:shadow-surface',
    hasCourse ? 'border-2 border-forest' : 'border border-cocoa/10',
  );

  if (href !== undefined) {
    return (
      <Link href={href} className={classes}>
        {body}
      </Link>
    );
  }
  return (
    <button
      type="button"
      onClick={onLockedTap}
      className={cn(classes, 'w-full')}
      aria-label={`${name}, receta Pro`}
    >
      {body}
    </button>
  );
}
