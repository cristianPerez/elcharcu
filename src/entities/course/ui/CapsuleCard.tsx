import Link from 'next/link';
import { type ReactNode } from 'react';

import { cn } from '@/shared/lib';
import { IconArrowRight, IconCheck, IconLock } from '@/shared/ui';

import { type CapsuleStep } from '../lib/courseState';

export type CapsuleState = CapsuleStep;

interface CapsuleCardProps {
  readonly slug: string;
  readonly title: string;
  /** Su lugar en la ruta, empezando en 1. */
  readonly position: number;
  readonly state: CapsuleState;
  readonly className?: string | undefined;
}

/**
 * Una cápsula de "Empieza por aquí".
 *
 * La bloqueada NO es un enlace: llevar a un muro gasta un toque y una espera
 * para no dar nada. Se dice por qué está cerrada en el nombre accesible, que es
 * donde un lector de pantalla lo busca.
 *
 * El candado se PINTA aquí; quien lo aplica es `can_open_lesson()` en Postgres
 * (D12).
 */
export function CapsuleCard({
  slug,
  title,
  position,
  state,
  className,
}: CapsuleCardProps): ReactNode {
  const classes = cn(
    'flex min-h-[148px] flex-col justify-between rounded-card border p-4 transition-colors',
    state === 'actual' && 'border-brasa bg-cream-white',
    state === 'completada' && 'border-cocoa/10 bg-cream-white hover:border-cocoa/20',
    state === 'bloqueada' && 'border-transparent bg-cream-muted',
    className,
  );

  const marker = (
    <span
      aria-hidden="true"
      className={cn(
        'grid size-7 place-items-center rounded-full text-xs font-semibold',
        state === 'completada' && 'bg-sage-light text-forest',
        state === 'actual' && 'bg-brasa text-cocoa',
        state === 'bloqueada' && 'text-cocoa-muted ring-1 ring-cocoa/20',
      )}
    >
      {state === 'completada' ? (
        <IconCheck size={14} strokeWidth={2.4} />
      ) : state === 'bloqueada' ? (
        <IconLock size={12} />
      ) : (
        position
      )}
    </span>
  );

  if (state === 'bloqueada') {
    return (
      <div className={classes}>
        {marker}
        <p className="text-sm leading-snug text-cocoa-muted">
          {title}
          <span className="sr-only">
            {` — se abre al terminar la cápsula ${String(position - 1)}`}
          </span>
        </p>
      </div>
    );
  }

  return (
    <Link href={`/cursos/${slug}`} className={classes}>
      {marker}
      {state === 'actual' ? (
        <span>
          <span className="block font-serif text-base font-semibold leading-snug text-forest">
            {title}
          </span>
          <span className="mt-1 inline-flex items-center gap-1 text-sm font-semibold text-brasa-tinta">
            Empezar
            <IconArrowRight size={14} strokeWidth={2} />
          </span>
        </span>
      ) : (
        <span className="text-sm leading-snug text-cocoa-soft">
          {title}
          <span className="sr-only"> — completada</span>
        </span>
      )}
    </Link>
  );
}
