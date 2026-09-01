import { type ReactNode } from 'react';

import { type Step, type TitleDescription } from '@/entities/recipe';

import { Eyebrow } from '@/shared/ui';

import { type RecipeDoubt as Doubt } from '../lib/recipeDoubts';

import { NoteBox } from './NoteBox';
import { RecipeDoubt } from './RecipeDoubt';
import { RecipeSection } from './RecipeSection';
import { StepRow } from './StepRow';

interface RecipePreparationProps {
  readonly steps: readonly Step[];
  readonly tips: readonly TitleDescription[];
  readonly doubt: Doubt;
}

/** Sección de preparación: pasos numerados y consejos de técnica. */
export function RecipePreparation({
  steps,
  tips,
  doubt,
}: RecipePreparationProps): ReactNode {
  return (
    <RecipeSection>
      <Eyebrow className="text-terracota">Manos a la obra</Eyebrow>
      <h2 className="mt-4 font-serif text-2xl font-semibold text-cocoa md:text-4xl">
        Preparación
      </h2>

      <ol className="mt-6 list-none p-0">
        {steps.map((step) => (
          <StepRow key={step.n} step={step} />
        ))}
      </ol>

      <div className="mt-8 grid gap-4 md:grid-cols-3">
        {tips.map((tip) => (
          <NoteBox key={tip.title} title={tip.title}>
            {tip.description}
          </NoteBox>
        ))}
      </div>

      {/* Cerrando los pasos: aquí es donde empieza la espera de semanas sin
            que nadie te diga si va bien. */}
      <div className="mt-8">
        <RecipeDoubt doubt={doubt} />
      </div>
    </RecipeSection>
  );
}
