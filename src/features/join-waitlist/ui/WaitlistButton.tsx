'use client';

import { type ReactNode } from 'react';

import { cn } from '@/shared/lib';
import { IconArrowRight, IconBell, IconCheck } from '@/shared/ui';

import { useWaitlist } from '../model/useWaitlist';

import { WaitlistUpsell } from './WaitlistUpsell';

interface WaitlistButtonProps {
  readonly courseId: string;
  readonly courseSlug: string;
  readonly courseTitle: string;
  readonly initiallyJoined: boolean;
  readonly canJoin: boolean;
  /**
   * `pill` en las filas de "Próximamente"; `link` dentro de una tarjeta, donde
   * un botón con borde competiría con la portada.
   */
  readonly variant?: 'pill' | 'link' | undefined;
  /** El texto de la llamada, si no es el de siempre. */
  readonly label?: string | undefined;
}

/**
 * "Avísame" ↔ "✓ Te aviso".
 *
 * Toca otra vez y te borras: apuntarse no puede ser una puerta de un solo
 * sentido. El nombre accesible dice qué curso es, porque en una lista hay
 * cuatro botones que se ven iguales.
 */
export function WaitlistButton({
  courseId,
  courseSlug,
  courseTitle,
  initiallyJoined,
  canJoin,
  variant = 'pill',
  label = 'Avísame',
}: WaitlistButtonProps): ReactNode {
  const { joined, isSaving, error, showUpsell, toggle, closeUpsell } = useWaitlist({
    courseId,
    courseSlug,
    initiallyJoined,
    canJoin,
  });

  const accessibleName = joined
    ? `Dejar de esperar ${courseTitle}`
    : `Avísame cuando abra ${courseTitle}`;

  return (
    <>
      <button
        type="button"
        aria-label={accessibleName}
        aria-pressed={joined}
        disabled={isSaving}
        onClick={(event) => {
          // Puede vivir dentro de una tarjeta que es un enlace.
          event.preventDefault();
          event.stopPropagation();
          toggle();
        }}
        className={cn(
          'inline-flex min-h-11 shrink-0 items-center gap-1.5 text-sm font-semibold transition-colors disabled:opacity-60',
          variant === 'pill' && 'rounded-full border px-4',
          variant === 'pill' &&
            (joined
              ? 'border-sage-light bg-sage-light text-cocoa'
              : 'border-forest text-forest hover:bg-forest hover:text-cream-white'),
          variant === 'link' &&
            (joined ? 'text-forest' : 'text-brasa-tinta hover:text-brasa-dark'),
        )}
      >
        {joined ? (
          <>
            <IconCheck size={15} strokeWidth={2.2} />
            {variant === 'pill' ? 'Te aviso' : 'Estás en la lista'}
          </>
        ) : variant === 'pill' ? (
          <>
            <IconBell size={15} />
            {label}
          </>
        ) : (
          <>
            {label}
            <IconArrowRight size={15} strokeWidth={2} />
          </>
        )}
      </button>
      {error === null ? null : (
        <span role="alert" className="block text-xs text-brasa-tinta">
          {error}
        </span>
      )}
      <WaitlistUpsell open={showUpsell} courseTitle={courseTitle} onClose={closeUpsell} />
    </>
  );
}
