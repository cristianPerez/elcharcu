import { type ReactNode } from 'react';

import { cn } from '@/shared/lib';

import { type TablaSummary } from '../model/types';

interface TablaCardProps {
  readonly tabla: TablaSummary;
  readonly className?: string;
}

/** Tarjeta de tabla para el grid del listado — foto, título, descripción corta. */
export function TablaCard({ tabla, className }: TablaCardProps): ReactNode {
  return (
    <article
      className={cn(
        'flex flex-col overflow-hidden rounded-2xl border border-cocoa/10 bg-white',
        className,
      )}
    >
      <div className="relative h-[180px]">
        {tabla.image ? (
          <div
            role="img"
            aria-label={tabla.name}
            className="h-full w-full bg-cover bg-center"
            style={{ backgroundImage: `url(${tabla.image})` }}
          />
        ) : (
          <div className="bg-grain flex h-full items-center justify-center bg-forest">
            <span className="font-serif text-4xl font-semibold text-cream/90">
              {tabla.name.charAt(0)}
            </span>
          </div>
        )}
      </div>
      <div className="flex flex-1 flex-col p-5">
        <h3 className="font-serif text-xl font-semibold text-cocoa">{tabla.name}</h3>
        <p className="mt-2 flex-1 text-sm leading-relaxed text-cocoa/70">
          {tabla.description}
        </p>
        {tabla.tags.length > 0 ? (
          <div className="mt-4 flex flex-wrap gap-1.5">
            {tabla.tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="rounded-full border border-cocoa/10 bg-cream px-2.5 py-0.5 text-[11px] text-cocoa/60"
              >
                {tag}
              </span>
            ))}
          </div>
        ) : null}
      </div>
    </article>
  );
}
