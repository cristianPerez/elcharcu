import { type ReactNode } from 'react';

import { type TablaIngredient } from '@/entities/tabla';

interface IngredientRowProps {
  readonly ingredient: TablaIngredient;
}

/** Fila de ingrediente: nombre, precio, participación en el presupuesto y nota. */
export function IngredientRow({ ingredient }: IngredientRowProps): ReactNode {
  return (
    <div className="flex flex-col gap-1 border-b border-cocoa/10 py-3.5 last:border-b-0">
      <div className="flex items-center justify-between gap-4">
        <span className="text-sm text-cocoa">{ingredient.name}</span>
        <span className="flex shrink-0 gap-2.5 text-[13px] text-cocoa/70">
          <span>{ingredient.amount}</span>
          <span className="font-semibold text-terracota">{ingredient.pct}</span>
        </span>
      </div>
      {ingredient.note ? (
        <p className="text-xs leading-relaxed text-cocoa/65">{ingredient.note}</p>
      ) : null}
    </div>
  );
}
