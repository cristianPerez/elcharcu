import { type ReactNode } from 'react';

import { cn } from '@/shared/lib';

export type BadgeTone = 'brasa' | 'forest' | 'cream' | 'sage' | 'muted';

interface BadgeProps {
  readonly children: ReactNode;
  readonly tone?: BadgeTone;
  readonly className?: string;
}

const TONES: Record<BadgeTone, string> = {
  brasa: 'bg-brasa text-cocoa',
  forest: 'bg-forest text-cream-white',
  cream: 'bg-cream-white text-cocoa',
  sage: 'bg-sage-light text-cocoa',
  muted: 'bg-cream-muted text-cocoa-soft',
};

/** La etiqueta corta: GRATIS, PRO, PRÓXIMO, TE AVISAMOS. */
export function Badge({ children, tone = 'cream', className }: BadgeProps): ReactNode {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wider',
        TONES[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}
