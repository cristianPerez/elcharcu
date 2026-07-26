import { type ReactNode } from 'react';

import { type Ingredient } from '@/entities/recipe';

import { Container, Eyebrow } from '@/shared/ui';

import { IngredientRow } from './IngredientRow';
import { NoteBox } from './NoteBox';

interface RecipeIngredientsProps {
  readonly note: string;
  readonly ingredients: readonly Ingredient[];
  readonly proportionNote: string;
  readonly charcuteroNote: string;
}

/** Sección de ingredientes (fondo verde oscuro) con tabla y notas de proporción. */
export function RecipeIngredients({
  note,
  ingredients,
  proportionNote,
  charcuteroNote,
}: RecipeIngredientsProps): ReactNode {
  return (
    <section className="bg-grain bg-forest-dark py-16 text-cream md:py-24">
      <Container>
        <Eyebrow className="text-sage">Mise en place</Eyebrow>
        <h2 className="mt-4 font-serif text-2xl font-semibold md:text-4xl">
          Ingredientes
        </h2>
        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-cream/75">{note}</p>

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
          </div>
        </div>
      </Container>
    </section>
  );
}
