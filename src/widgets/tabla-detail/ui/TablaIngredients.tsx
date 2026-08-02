import { type ReactNode } from 'react';

import { type TablaIngredient } from '@/entities/tabla';

import { Container, Eyebrow } from '@/shared/ui';

import { IngredientRow } from './IngredientRow';
import { NoteBox } from './NoteBox';

interface TablaIngredientsProps {
  readonly note: string;
  readonly ingredients: readonly TablaIngredient[];
  readonly proportionNote: string;
  readonly expertNote: string;
}

/** Sección de ingredientes (fondo verde oscuro) con tabla de precios y notas. */
export function TablaIngredients({
  note,
  ingredients,
  proportionNote,
  expertNote,
}: TablaIngredientsProps): ReactNode {
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
            <NoteBox title="Nota del experto" tone="dark">
              {expertNote}
            </NoteBox>
          </div>
        </div>
      </Container>
    </section>
  );
}
