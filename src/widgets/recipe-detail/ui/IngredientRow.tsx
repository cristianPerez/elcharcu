import { type ReactNode } from 'react';

import { type Ingredient } from '@/entities/recipe';

interface IngredientRowProps {
  readonly ingredient: Ingredient;
}

/** Fila de ingrediente: nombre, cantidad y porcentaje sobre carne + grasa. */
export function IngredientRow({ ingredient }: IngredientRowProps): ReactNode {
  return (
    <div className="flex items-center justify-between gap-4 border-b border-cocoa/10 py-3.5 last:border-b-0">
      <span className="text-sm text-cocoa">{ingredient.name}</span>
      <span className="flex shrink-0 gap-2.5 text-[15px] text-cocoa/70">
        <span>{ingredient.amount}</span>
        <span className="font-semibold text-terracota">{ingredient.pct}</span>
      </span>
    </div>
  );
}
