import { type ReactNode } from 'react';

import { cn } from '@/shared/lib';

interface ChipRowProps {
  readonly children: ReactNode;
  readonly label: string;
  readonly className?: string;
}

/**
 * Una fila de chips que en el celular se desliza de lado y en escritorio se
 * reparte en varias líneas.
 *
 * El desborde lo absorbe la FILA, nunca la página: el margen negativo deja que
 * los chips lleguen al borde de la pantalla sin abrir scroll horizontal en el
 * documento.
 */
export function ChipRow({ children, label, className }: ChipRowProps): ReactNode {
  return (
    <nav aria-label={label} className={cn('-mx-5 md:mx-0', className)}>
      <ul className="flex gap-2 overflow-x-auto px-5 pb-1 [scrollbar-width:none] md:flex-wrap md:overflow-visible md:px-0 [&::-webkit-scrollbar]:hidden">
        {children}
      </ul>
    </nav>
  );
}
