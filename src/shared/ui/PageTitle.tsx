import { type ReactNode } from 'react';

import { cn } from '@/shared/lib';

interface PageTitleProps {
  readonly children: ReactNode;
  readonly className?: string | undefined;
}

/**
 * El h1 de cada pestaña. Minimalista a propósito (pedido de Cristian,
 * 2026-10): sin antetítulo y sin subtítulo debajo.
 */
export function PageTitle({ children, className }: PageTitleProps): ReactNode {
  return (
    <h1
      className={cn(
        'font-serif text-2xl font-semibold leading-tight text-forest md:text-[28px]',
        className,
      )}
    >
      {children}
    </h1>
  );
}
