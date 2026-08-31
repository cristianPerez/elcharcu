import { type CSSProperties, type ReactNode } from 'react';

import { cn } from '@/shared/lib';

interface RevealProps {
  readonly children: ReactNode;
  /** Segundos de retraso, para que las tarjetas entren en cascada. */
  readonly delay?: number;
  readonly className?: string;
}

/**
 * Aparición de un bloque al cargar la pantalla.
 *
 * No es decoración: escalonar la entrada dice en qué orden hay que leer, que
 * en un móvil con la mano llena de carne es la diferencia entre encontrar el
 * dato y perderse. Va sin JavaScript — la clase `.reveal` es CSS puro, así que
 * funciona aunque nada hidrate.
 */
export function Reveal({ children, delay = 0, className }: RevealProps): ReactNode {
  return (
    <div
      className={cn('reveal', className)}
      style={{ '--reveal-delay': `${delay}s` } as CSSProperties}
    >
      {children}
    </div>
  );
}
