import { type ReactNode } from 'react';

import { type Step, type TitleDescription } from '@/entities/recipe';

import { Container, Eyebrow } from '@/shared/ui';

import { NoteBox } from './NoteBox';
import { StepRow } from './StepRow';

interface RecipePreparationProps {
  readonly steps: readonly Step[];
  readonly tips: readonly TitleDescription[];
}

/** Sección de preparación: pasos numerados y consejos de técnica. */
export function RecipePreparation({ steps, tips }: RecipePreparationProps): ReactNode {
  return (
    <section className="bg-cream py-16 text-cocoa md:py-24">
      <Container>
        <Eyebrow className="text-terracota">De la mezcla a la tripa</Eyebrow>
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
      </Container>
    </section>
  );
}
