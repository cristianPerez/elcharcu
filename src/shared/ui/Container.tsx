import { type ReactNode } from 'react';

import { cn } from '@/shared/lib';

interface ContainerProps {
  readonly children: ReactNode;
  readonly className?: string;
}

/** Ancho máximo consistente y padding lateral para todas las secciones. */
export function Container({ children, className }: ContainerProps): ReactNode {
  return (
    <div className={cn('mx-auto w-full max-w-content px-6 md:px-10', className)}>
      {children}
    </div>
  );
}
