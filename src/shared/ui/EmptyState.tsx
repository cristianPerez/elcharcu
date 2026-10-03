import { type ReactNode } from 'react';

import { cn } from '@/shared/lib';

interface EmptyStateProps {
  readonly children: ReactNode;
  /** El botón o enlace que saca del vacío. */
  readonly action?: ReactNode;
  readonly className?: string;
}

/** Lo que se ve cuando no hay nada: fondo apagado, una frase y una salida. */
export function EmptyState({ children, action, className }: EmptyStateProps): ReactNode {
  return (
    <div className={cn('rounded-card bg-cream-muted p-5', className)}>
      <p className="text-[15px] leading-relaxed text-cocoa">{children}</p>
      {action === undefined ? null : <div className="mt-4">{action}</div>}
    </div>
  );
}
