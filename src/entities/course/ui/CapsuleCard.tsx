import Link from 'next/link';
import { type ReactNode } from 'react';

import { cn } from '@/shared/lib';
import { IconArrowRight, IconCheck, IconLock } from '@/shared/ui';

import { type CapsuleStep } from '../lib/courseState';
import { type CapsuleIcon } from '../model/catalog';

import { CapsuleDrawing } from './CapsuleDrawing';

export type CapsuleState = CapsuleStep;

interface CapsuleCardProps {
  readonly slug: string;
  readonly title: string;
  /** Su lugar en la ruta, desde 1. Decide el número y la alternancia de color. */
  readonly position: number;
  readonly state: CapsuleState;
  readonly icon: CapsuleIcon | null;
  /** La actual ya tiene algo visto: el botón dice "Continuar", no "Empezar". */
  readonly isStarted?: boolean | undefined;
  readonly className?: string | undefined;
}

/**
 * Los colores salen del ESTADO y de la POSICIÓN, nunca de la base: hecha va en
 * bosque claro / bosque oscuro, bloqueada en sage / durazno, alternando.
 * Todos los textos pasan AA sobre su fondo (crema sobre bosque ≥ 6,6:1;
 * cocoa sobre brasa 7,2:1; #233B31 sobre sage 5,8:1; #6B3417 sobre durazno 6,6:1).
 */
function palette(
  state: CapsuleState,
  position: number,
): {
  readonly card: string;
  readonly drawing: string;
} {
  const isOdd = position % 2 === 1;
  if (state === 'completada') {
    return {
      card: isOdd ? 'bg-forest-light' : 'bg-forest-dark',
      drawing: 'text-sage-light opacity-45',
    };
  }
  if (state === 'actual') {
    return { card: 'bg-brasa', drawing: 'text-brasa-tinta opacity-50' };
  }
  return isOdd
    ? { card: 'bg-peach', drawing: 'text-brasa-tinta opacity-35' }
    : { card: 'bg-sage-light', drawing: 'text-forest-dark opacity-30' };
}

/**
 * Una cápsula de "Empieza por aquí", en sus tres estados.
 *
 *   · Hecha: enlace, para repasar.
 *   · Actual: enlace, más ancha, con su número grande y "Empezar →".
 *   · Bloqueada: NO es enlace —llevar a un muro gasta un toque para nada—,
 *     lleva `aria-disabled` y dice cuándo se abre.
 *
 * El candado se PINTA aquí; quien lo aplica es `can_open_lesson()` en
 * Postgres (D12).
 */
export function CapsuleCard({
  slug,
  title,
  position,
  state,
  icon,
  isStarted = false,
  className,
}: CapsuleCardProps): ReactNode {
  const colors = palette(state, position);
  const isPeach = state === 'bloqueada' && position % 2 === 1;
  const classes = cn(
    'relative flex h-[196px] flex-col justify-between overflow-hidden rounded-capsule p-3.5',
    colors.card,
    className,
  );
  const drawing = (
    <CapsuleDrawing
      icon={icon}
      size={state === 'actual' ? 104 : 96}
      className={cn(
        state === 'actual' ? '-right-4 top-[22px]' : '-right-3.5 top-[30px]',
        colors.drawing,
      )}
    />
  );

  if (state === 'bloqueada') {
    return (
      <div
        role="group"
        aria-disabled="true"
        aria-label={`${title}, bloqueada`}
        className={classes}
      >
        {drawing}
        <span
          aria-hidden="true"
          className={cn(
            'relative grid size-7 place-items-center rounded-full',
            isPeach
              ? 'bg-brasa-tinta/15 text-brasa-tinta'
              : 'bg-forest-dark/15 text-forest-dark',
          )}
        >
          <IconLock size={13} strokeWidth={2.2} />
        </span>
        <span className="relative">
          <span className="block font-serif text-base font-semibold leading-tight text-cocoa">
            {title}
          </span>
          <span
            className={cn(
              'mt-1 block text-xs',
              isPeach ? 'text-brasa-deep' : 'text-forest-dark',
            )}
          >
            Se abre al terminar la {position - 1}
          </span>
        </span>
      </div>
    );
  }

  if (state === 'actual') {
    return (
      <Link href={`/cursos/${slug}`} className={cn(classes, 'group')}>
        {drawing}
        <span
          aria-hidden="true"
          className="relative font-serif text-4xl font-semibold leading-none text-cocoa"
        >
          {position}
        </span>
        <span className="relative flex flex-col gap-2.5">
          <span className="font-serif text-[17px] font-semibold leading-tight text-cocoa">
            {title}
          </span>
          <span className="inline-flex h-8 items-center gap-1 self-start rounded-full bg-cocoa px-3.5 text-[13px] font-semibold text-cream transition-colors group-hover:bg-forest-dark">
            {isStarted ? 'Continuar' : 'Empezar'}
            <IconArrowRight size={13} strokeWidth={2.2} />
          </span>
        </span>
      </Link>
    );
  }

  return (
    <Link href={`/cursos/${slug}`} className={classes}>
      {drawing}
      <span className="relative inline-flex h-6 items-center gap-1 self-start rounded-full bg-sage-light pl-1.5 pr-2.5 text-[11px] font-semibold text-cocoa">
        <IconCheck size={12} strokeWidth={3} />
        Hecha
      </span>
      <span className="relative font-serif text-base font-semibold leading-tight text-cream">
        {title}
      </span>
    </Link>
  );
}
