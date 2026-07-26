import { type ReactNode } from 'react';

import { type TitleDescription } from '@/entities/recipe';

interface CookMethodCardProps {
  readonly method: TitleDescription;
}

/** Tarjeta de método de cocción (parrilla, sartén…), sobre fondo verde. */
export function CookMethodCard({ method }: CookMethodCardProps): ReactNode {
  return (
    <div className="min-w-0 flex-1 rounded-2xl border border-cream/15 bg-cream/5 p-6">
      <h3 className="font-serif text-xl font-semibold text-cream">{method.title}</h3>
      <p className="mt-2.5 text-sm leading-relaxed text-cream/75">{method.description}</p>
    </div>
  );
}
