import { type ReactNode } from 'react';

import { type LabelValue } from '@/entities/recipe';

interface StatChipProps {
  readonly stat: LabelValue;
}

/** Chip con una métrica de la receta (rendimiento, nivel, tiempos…). */
export function StatChip({ stat }: StatChipProps): ReactNode {
  return (
    <div className="rounded-xl border border-cocoa/10 bg-white p-4 md:p-5">
      <div className="text-[11px] uppercase tracking-eyebrow text-cocoa/70">
        {stat.label}
      </div>
      <div className="mt-1.5 font-serif text-[19px] font-semibold text-forest md:text-[21px]">
        {stat.value}
      </div>
    </div>
  );
}
