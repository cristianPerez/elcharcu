import { type ReactNode } from 'react';

import { cn } from '@/shared/lib';

interface NoteBoxProps {
  readonly title: string;
  readonly children: ReactNode;
  readonly tone?: 'light' | 'dark';
}

/** Caja de nota (consejo técnico, proporción, nota del charcutero…). */
export function NoteBox({ title, children, tone = 'light' }: NoteBoxProps): ReactNode {
  const isDark = tone === 'dark';

  return (
    <div
      className={cn(
        'rounded-2xl border p-5',
        isDark ? 'border-cream/15 bg-cream/5' : 'border-cocoa/10 bg-white',
      )}
    >
      <div
        className={cn(
          'mb-2.5 text-[11px] uppercase tracking-eyebrow',
          isDark ? 'text-sage' : 'text-terracota',
        )}
      >
        {title}
      </div>
      <p
        className={cn(
          'text-[15px] leading-relaxed md:text-base',
          isDark ? 'text-cream/75' : 'text-cocoa/70',
        )}
      >
        {children}
      </p>
    </div>
  );
}
