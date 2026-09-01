import { type ReactNode } from 'react';

import { type TitleDescription } from '@/entities/recipe';

import { Eyebrow } from '@/shared/ui';

import { type RecipeDoubt as Doubt } from '../lib/recipeDoubts';

import { CookMethodCard } from './CookMethodCard';
import { RecipeDoubt } from './RecipeDoubt';
import { RecipeSection } from './RecipeSection';

interface RecipeCookingProps {
  readonly cookMethods: readonly TitleDescription[];
  readonly recommendations: readonly string[];
  readonly resultNote: string;
  readonly doubt: Doubt;
}

/** Cocción y recomendaciones (fondo verde): métodos, checklist y nota final. */
export function RecipeCooking({
  cookMethods,
  recommendations,
  resultNote,
  doubt,
}: RecipeCookingProps): ReactNode {
  return (
    <RecipeSection tone="forest">
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
            className="flex max-w-[52ch] gap-2.5 text-[15px] leading-relaxed text-cream/75 md:text-base"
          >
            <span aria-hidden className="text-terracota">
              ✓
            </span>
            {recommendation}
          </li>
        ))}
      </ul>

      <p className="mt-7 max-w-[52ch] text-[15px] italic leading-relaxed text-cream/75 md:text-base">
        {resultNote}
      </p>

      {/* La última: ya lo tiene hecho o casi. Aquí es donde ofrece mandar la
            foto, que es lo que más impresiona y lo que hace volver. */}
      <div className="mt-7 max-w-[52ch]">
        <RecipeDoubt doubt={doubt} tone="dark" variant="compact" slot="coccion" />
      </div>
    </RecipeSection>
  );
}
