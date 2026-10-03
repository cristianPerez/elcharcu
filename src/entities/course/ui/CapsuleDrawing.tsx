import { type ReactNode } from 'react';

import { cn } from '@/shared/lib';

import { type CapsuleIcon } from '../model/catalog';

/**
 * Los trazos de cada dibujo, en caja de 24 y línea de 1 px: se pintan a
 * 96–104 px, así que la línea fina sale fina de verdad.
 */
const PATHS: Record<CapsuleIcon | 'generico', ReactNode> = {
  // Un salero.
  sal: (
    <>
      <path d="M8 9h8l1 12H7z" />
      <path d="M9 9V6a3 3 0 0 1 6 0v3" />
      <path d="M10.5 4.5h0M12 3.5h0M13.5 4.5h0" />
    </>
  ),
  // Una báscula.
  bascula: (
    <>
      <path d="M4 18h16" />
      <path d="M6 18l2-8h8l2 8" />
      <path d="M12 10V6" />
      <path d="M8 6h8" />
    </>
  ),
  // Un jamón bridado.
  jamon: (
    <>
      <path d="M12 2v3" />
      <path d="M8 7c-2 3-2 8 1 12 2 2 4 2 6 0 3-4 3-9 1-12-2-2-6-2-8 0z" />
      <path d="M7.5 10h9M7 13.5h10M8 17h8" />
    </>
  ),
  // Un chorizo en herradura.
  chorizo: (
    <>
      <path d="M5 8c-2 4 0 10 6 11 6 1 9-3 9-7" />
      <path d="M20 12c0-4-3-7-8-7-3 0-5 1-7 3" />
      <path d="M4 7l2 2M19 13l2-1" />
    </>
  ),
  // Un amarre: la tripa con su nudo.
  amarre: (
    <>
      <path d="M3 12h4M17 12h4" />
      <ellipse cx="12" cy="12" rx="5" ry="3" />
      <path d="M10 9.5l4 5M14 9.5l-4 5" />
    </>
  ),
  // Sin `icon`: una pieza colgada, que vale para cualquier cosa del oficio.
  generico: (
    <>
      <path d="M12 2.5v4" />
      <path d="M9.5 6.5h5l-.8 13a1.7 1.7 0 0 1-3.4 0Z" />
    </>
  ),
};

interface CapsuleDrawingProps {
  readonly icon: CapsuleIcon | null;
  /** Color y opacidad, que dependen del estado de la tarjeta. */
  readonly className?: string | undefined;
  readonly size?: number | undefined;
}

/**
 * El dibujo grande de la esquina de una cápsula. Decorativo: `aria-hidden`.
 * La tarjeta lo recorta con `overflow-hidden`; asoma por el borde a propósito.
 */
export function CapsuleDrawing({
  icon,
  className,
  size = 96,
}: CapsuleDrawingProps): ReactNode {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={cn('pointer-events-none absolute', className)}
    >
      {PATHS[icon ?? 'generico']}
    </svg>
  );
}
