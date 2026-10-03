import Link from 'next/link';
import { type ReactNode } from 'react';

import { cn } from '@/shared/lib';

import { IconClose } from './icons';

interface ChipProps {
  readonly children: ReactNode;
  readonly active?: boolean;
  /** Con `href` es un enlace (el filtro vive en la URL); sin él, un botón. */
  readonly href?: string;
  readonly onClick?: () => void;
  /** Pinta la ✕ de "quitar este filtro". Solo tiene sentido activo. */
  readonly removable?: boolean;
  readonly className?: string;
}

/**
 * La píldora de los filtros y las categorías.
 *
 * Mide 44 px de alto aunque se vea de 40: el área táctil es la que cuenta, y un
 * chip de 36 en una fila apretada es justo donde el pulgar falla.
 */
export function Chip({
  children,
  active = false,
  href,
  onClick,
  removable = false,
  className,
}: ChipProps): ReactNode {
  const classes = cn(
    'inline-flex min-h-11 shrink-0 items-center gap-1.5 whitespace-nowrap rounded-full border px-4 text-sm font-medium transition-colors',
    active
      ? 'border-forest bg-forest text-cream-white'
      : 'border-cocoa/15 bg-cream-white text-cocoa hover:border-cocoa/30',
    className,
  );

  const content = (
    <>
      {children}
      {active && removable ? <IconClose size={14} strokeWidth={2} /> : null}
    </>
  );

  if (href !== undefined) {
    return (
      <Link
        href={href}
        scroll={false}
        aria-current={active ? 'true' : undefined}
        className={classes}
      >
        {content}
      </Link>
    );
  }

  return (
    <button type="button" aria-pressed={active} onClick={onClick} className={classes}>
      {content}
    </button>
  );
}
