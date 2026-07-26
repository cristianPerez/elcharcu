import { type ReactNode } from 'react';

import { type TitleDescription } from '@/entities/recipe';

import { Container, Eyebrow } from '@/shared/ui';

import { CookMethodCard } from './CookMethodCard';

interface RecipeCookingProps {
  readonly cookMethods: readonly TitleDescription[];
  readonly recommendations: readonly string[];
  readonly resultNote: string;
}

/** Cocción y recomendaciones (fondo verde): métodos, checklist y nota final. */
export function RecipeCooking({
  cookMethods,
  recommendations,
  resultNote,
}: RecipeCookingProps): ReactNode {
  return (
    <section className="bg-grain bg-forest py-16 text-cream md:py-24">
      <Container>
        <Eyebrow className="text-sage">El punto final</Eyebrow>
        <h2 className="mt-4 font-serif text-2xl font-semibold md:text-4xl">
          Cocción y recomendaciones
        </h2>

        <div className="mt-7 flex flex-col gap-4 md:flex-row">
          {cookMethods.map((method) => (
            <CookMethodCard key={method.title} method={method} />
          ))}
        </div>

        <ul className="mt-7 flex list-none flex-col gap-2.5 p-0">
          {recommendations.map((recommendation) => (
            <li
              key={recommendation}
              className="flex gap-2.5 text-sm leading-relaxed text-cream/75"
            >
              <span aria-hidden className="text-terracota">
                ✓
              </span>
              {recommendation}
            </li>
          ))}
        </ul>

        <p className="mt-7 max-w-2xl text-sm italic leading-relaxed text-cream/75">
          {resultNote}
        </p>
      </Container>
    </section>
  );
}
