import { type ReactNode } from 'react';

import { cn } from '@/shared/lib';

interface ProgressBarProps {
  /** 0 a 100. */
  readonly value: number;
  readonly label: string;
  /** Sobre verde el carril es más claro y el relleno, naranja. */
  readonly tone?: 'light' | 'dark';
  readonly className?: string;
}

export function ProgressBar({
  value,
  label,
  tone = 'light',
  className,
}: ProgressBarProps): ReactNode {
  const clamped = Math.min(100, Math.max(0, Math.round(value)));

  return (
    <div
      role="progressbar"
      aria-label={label}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={clamped}
      className={cn(
        'h-1.5 w-full overflow-hidden rounded-full',
        tone === 'dark' ? 'bg-cream-white/15' : 'bg-cream-muted',
        className,
      )}
    >
      <div
        className={cn('h-full rounded-full', tone === 'dark' ? 'bg-brasa' : 'bg-forest')}
        style={{ width: `${clamped}%` }}
      />
    </div>
  );
}
