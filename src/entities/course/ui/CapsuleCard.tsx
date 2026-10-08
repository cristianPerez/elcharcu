import Link from 'next/link';
import { type ReactNode } from 'react';

import { cn } from '@/shared/lib';
import { IconArrowRight, IconCheck, IconLock } from '@/shared/ui';

import { type CapsuleStep } from '../lib/courseState';
import { type CapsuleIcon } from '../model/catalog';

import { CapsuleDrawing } from './CapsuleDrawing';

/**
 * `vista` es la tarjeta de quien todavía no tiene cuenta (diseño final 01/02):
 * número, título y su pastel, sin candado ni "Hecha". No hay ruta que seguir
 * todavía; al tocarla se le pide la cuenta.
 */
export type CapsuleState = CapsuleStep | 'vista';

/** Los pasteles de la ruta sin cuenta, en orden: verde, verde, crema, durazno. */
const PREVIEW_TONES = [
  {
    card: 'bg-capsule-done',
    number: 'text-forest',
    drawing: 'text-forest-light opacity-30',
  },
  {
    card: 'bg-capsule-done-alt',
    number: 'text-forest',
    drawing: 'text-forest-light opacity-30',
  },
  {
    card: 'bg-capsule-locked',
    number: 'text-cocoa-soft',
    drawing: 'text-cocoa-muted opacity-[0.22]',
  },
  {
    card: 'bg-capsule-locked-alt',
    number: 'text-brasa-tinta',
    drawing: 'text-brasa-tinta opacity-[0.22]',
  },
] as const;

function previewTone(position: number): (typeof PREVIEW_TONES)[number] {
  return (
    PREVIEW_TONES[(position - 2 + PREVIEW_TONES.length) % PREVIEW_TONES.length] ??
    PREVIEW_TONES[0]
  );
}

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
 * Los colores salen del ESTADO y de la POSICIÓN, nunca de la base. Todo en
 * tonos pastel derivados de la paleta (Cristian, 2026-10-03): el Naranja
 * Brasa pleno queda solo para el botón de la actual, que es donde tiene que
 * llamar.
 *
 *   · Hecha: sage claro, alternando. Dibujo en bosque claro al 30 %.
 *   · Actual: durazno con borde Naranja Claro. Dibujo en tinta.
 *   · Bloqueada: crema neutro / crema cálido, alternando. Dibujo al 22 %.
 *
 * Todos los textos pasan AA: cocoa sobre cualquiera de los fondos ≥ 14:1;
 * el número en tinta sobre durazno 5,0:1; "Se abre…" (#5B4E45) sobre los
 * cremas ≥ 6,3:1; "Hecha" (#233B31) sobre blanco 12:1.
 */
function palette(
  state: CapsuleState,
  position: number,
): {
  readonly card: string;
  readonly drawing: string;
} {
  const isOdd = position % 2 === 1;
  if (state === 'vista') {
    const tone = previewTone(position);
    return { card: tone.card, drawing: tone.drawing };
  }
  if (state === 'completada') {
    return {
      card: isOdd ? 'bg-capsule-done' : 'bg-capsule-done-alt',
      drawing: 'text-forest-light opacity-30',
    };
  }
  if (state === 'actual') {
    return {
      card: 'bg-capsule-current ring-[1.5px] ring-inset ring-brasa-light',
      drawing: 'text-brasa-tinta opacity-30',
    };
  }
  return {
    card: isOdd ? 'bg-capsule-locked-alt' : 'bg-capsule-locked',
    drawing: 'text-cocoa-muted opacity-[0.22]',
  };
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
          className="relative grid size-7 place-items-center rounded-full bg-cocoa/[0.07] text-cocoa-muted"
        >
          <IconLock size={13} strokeWidth={2.2} />
        </span>
        <span className="relative">
          <span className="block font-serif text-base font-semibold leading-tight text-cocoa">
            {title}
          </span>
          <span className="mt-1 block text-xs text-cocoa-soft">
            Se abre al terminar la {position - 1}
          </span>
        </span>
      </div>
    );
  }

  if (state === 'vista') {
    return (
      <Link href={`/cursos/${slug}`} className={classes}>
        {drawing}
        <span
          aria-hidden="true"
          className={cn(
            'relative font-serif text-4xl font-semibold leading-none',
            previewTone(position).number,
          )}
        >
          {position}
        </span>
        <span className="relative font-serif text-base font-semibold leading-tight text-cocoa">
          {title}
        </span>
      </Link>
    );
  }

  if (state === 'actual') {
    return (
      <Link href={`/cursos/${slug}`} className={cn(classes, 'group')}>
        {drawing}
        <span
          aria-hidden="true"
          className="relative font-serif text-4xl font-semibold leading-none text-brasa-tinta"
        >
          {position}
        </span>
        <span className="relative flex flex-col gap-2.5">
          <span className="font-serif text-[17px] font-semibold leading-tight text-cocoa">
            {title}
          </span>
          <span className="inline-flex h-8 items-center gap-1 self-start rounded-full bg-brasa px-3.5 text-[13px] font-semibold text-cocoa transition-colors group-hover:bg-brasa-dark">
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
      <span className="relative inline-flex h-6 items-center gap-1 self-start rounded-full bg-cream-white pl-1.5 pr-2.5 text-[11px] font-semibold text-forest-dark">
        <IconCheck size={12} strokeWidth={3} />
        Hecha
      </span>
      <span className="relative font-serif text-base font-semibold leading-tight text-cocoa">
        {title}
      </span>
    </Link>
  );
}
