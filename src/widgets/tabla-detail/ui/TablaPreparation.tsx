import { type ReactNode } from 'react';

import { type TablaStep, type TitleDescription } from '@/entities/tabla';

import { Container, Eyebrow } from '@/shared/ui';

import { NoteBox } from './NoteBox';
import { StepRow } from './StepRow';

interface TablaPreparationProps {
  readonly steps: readonly TablaStep[];
  readonly tips: readonly TitleDescription[];
}

/**
 * Sección de armado: pasos numerados con foto de técnica intercalada — el
 * formato editorial propio de Tablas, distinto del paso a paso solo-texto
 * de las recetas de curados.
 */
export function TablaPreparation({ steps, tips }: TablaPreparationProps): ReactNode {
  return (
    <section className="bg-cream py-16 text-cocoa md:py-24">
      <Container>
        <Eyebrow className="text-terracota">Manos a la obra</Eyebrow>
        <h2 className="mt-4 font-serif text-2xl font-semibold text-cocoa md:text-4xl">
          Armado
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
