import { type ReactNode } from 'react';

import { cn } from '@/shared/lib';

interface QuoteProps {
  readonly quote: string;
  readonly caption?: string;
  readonly size?: 'lg' | 'md';
}

/** Cita editorial centrada, reutilizada en la cita intermedia y la final. */
export function Quote({ quote, caption, size = 'lg' }: QuoteProps): ReactNode {
  return (
    <figure className="mx-auto max-w-[680px] text-center">
      <span aria-hidden className="font-serif text-5xl text-terracota/40">
        &ldquo;
      </span>
      <blockquote
        className={cn(
          '-mt-3 font-serif font-medium italic leading-snug text-forest',
          size === 'lg' ? 'text-xl md:text-2xl' : 'text-lg md:text-[22px]',
        )}
      >
        {quote}
      </blockquote>
      {caption ? (
        <figcaption className="mt-5 text-xs uppercase tracking-eyebrow text-cocoa/50">
          {caption}
        </figcaption>
      ) : null}
    </figure>
  );
}
