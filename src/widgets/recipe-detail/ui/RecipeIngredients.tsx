import { type ReactNode } from 'react';

import { type Ingredient } from '@/entities/recipe';

import { Eyebrow } from '@/shared/ui';

import { type RecipeDoubt as Doubt } from '../lib/recipeDoubts';

import { IngredientRow } from './IngredientRow';
import { NoteBox } from './NoteBox';
import { RecipeDoubt } from './RecipeDoubt';
import { RecipeSection } from './RecipeSection';

interface RecipeIngredientsProps {
  readonly note: string;
  readonly ingredients: readonly Ingredient[];
  readonly proportionNote: string;
  readonly charcuteroNote: string;
  readonly doubt: Doubt;
}

/** Sección de ingredientes (fondo verde oscuro) con tabla y notas de proporción. */
export function RecipeIngredients({
  note,
  ingredients,
  proportionNote,
  charcuteroNote,
  doubt,
}: RecipeIngredientsProps): ReactNode {
  return (
    <RecipeSection tone="forest-dark">
      <Eyebrow className="text-sage">Mise en place</Eyebrow>
      <h2 className="mt-4 font-serif text-2xl font-semibold md:text-4xl">Ingredientes</h2>
      <p className="mt-3 max-w-[52ch] text-[15px] leading-relaxed text-cream/75 md:text-base">
        {note}
      </p>

      <div className="mt-8 grid gap-6 md:grid-cols-[1.3fr_1fr] md:gap-10">
        <div className="rounded-2xl bg-white px-4 py-2 md:px-6">
          {ingredients.map((ingredient) => (
            <IngredientRow key={ingredient.name} ingredient={ingredient} />
          ))}
        </div>
        <div className="flex flex-col gap-4">
          <NoteBox title="Proporción base" tone="dark">
            {proportionNote}
          </NoteBox>
          <NoteBox title="Nota del charcutero" tone="dark">
            {charcuteroNote}
          </NoteBox>

          {/* Junto a la nota del charcutero, y no al final de la página: la
                duda de las cantidades se tiene MIRANDO la tabla, no después de
                haberla dejado atrás. */}
          <RecipeDoubt doubt={doubt} tone="dark" />
        </div>
      </div>
    </RecipeSection>
  );
}
