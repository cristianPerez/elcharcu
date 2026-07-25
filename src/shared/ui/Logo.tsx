import { type ReactNode } from 'react';

import { cn } from '@/shared/lib';

interface LogoProps {
  /** 'light' para fondos oscuros (crema), 'dark' para fondos claros (verde). */
  readonly tone?: 'light' | 'dark';
  readonly className?: string;
  readonly stacked?: boolean;
}

/** Wordmark tipográfico de El Charcu (recrea el logo de marca). */
export function Logo({
  tone = 'light',
  stacked = false,
  className,
}: LogoProps): ReactNode {
  const wordmarkColor = tone === 'light' ? 'text-cream' : 'text-forest';

  return (
    <span
      className={cn('inline-flex flex-col leading-none', className)}
      aria-label="El Charcu Artesanal"
    >
      <span
        className={cn(
          'font-serif font-semibold uppercase tracking-tight',
          stacked ? 'text-2xl' : 'text-xl',
          wordmarkColor,
        )}
      >
        El Charcu
      </span>
      <span className="mt-1 text-[0.6rem] font-medium uppercase tracking-eyebrow text-sage">
        Artesanal
      </span>
    </span>
  );
}
