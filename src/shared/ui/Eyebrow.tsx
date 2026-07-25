import { type ReactNode } from 'react';

import { cn } from '@/shared/lib';

interface EyebrowProps {
  readonly children: ReactNode;
  readonly className?: string;
}

/** Etiqueta superior en versalitas — el "— LABEL" del sistema editorial. */
export function Eyebrow({ children, className }: EyebrowProps): ReactNode {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-2 text-xs font-medium uppercase tracking-eyebrow',
        className,
      )}
    >
      <span aria-hidden className="h-px w-6 bg-current opacity-50" />
      {children}
    </span>
  );
}
