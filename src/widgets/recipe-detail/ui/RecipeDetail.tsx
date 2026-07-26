import { type ReactNode } from 'react';

import { type Recipe } from '@/entities/recipe';

import { Container } from '@/shared/ui';

import { RecipeCooking } from './RecipeCooking';
import { RecipeHero } from './RecipeHero';
import { RecipeIngredients } from './RecipeIngredients';
import { RecipeOverview } from './RecipeOverview';
import { RecipePreparation } from './RecipePreparation';
import { RecipeQuote } from './RecipeQuote';
import { RecipeViewTracker } from './RecipeViewTracker';

interface RecipeDetailProps {
  readonly recipe: Recipe;
}

/** Cuerpo completo de la página de receta, compuesto por secciones. */
export function RecipeDetail({ recipe }: RecipeDetailProps): ReactNode {
  return (
    <article>
      <RecipeViewTracker slug={recipe.slug} name={recipe.name} tags={recipe.tags} />
      <RecipeHero
        eyebrow={recipe.eyebrow}
        name={recipe.name}
        subtitle={recipe.subtitle}
      />
      <RecipeOverview
        name={recipe.name}
        image={recipe.image}
        intro={recipe.intro}
        stats={recipe.stats}
        details={recipe.details}
      />

      <section className="bg-cream pb-16 text-cocoa md:pb-24">
        <Container>
          <RecipeQuote quote={recipe.quote} size="lg" />
        </Container>
      </section>

      <RecipeIngredients
        note={recipe.ingredientsNote}
        ingredients={recipe.ingredients}
        proportionNote={recipe.proportionNote}
        charcuteroNote={recipe.charcuteroNote}
      />
      <RecipePreparation steps={recipe.steps} tips={recipe.tips} />
      <RecipeCooking
        cookMethods={recipe.cookMethods}
        recommendations={recipe.recommendations}
        resultNote={recipe.resultNote}
      />

      <section className="bg-cream py-16 text-cocoa md:py-24">
        <Container>
          <RecipeQuote
            quote={recipe.finalQuote}
            caption={recipe.finalQuoteCaption}
            size="md"
          />
        </Container>
      </section>
    </article>
  );
}
