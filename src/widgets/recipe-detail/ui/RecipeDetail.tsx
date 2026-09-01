import { type ReactNode } from 'react';

import { type Recipe } from '@/entities/recipe';

import { Container } from '@/shared/ui';

import { recipeDoubts } from '../lib/recipeDoubts';
import { RecipeAssistantProvider } from '../model/RecipeAssistantProvider';

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
  // Se calculan aquí, en el servidor, y bajan ya resueltas: las dos secciones
  // solo reciben la frase que les toca y no tienen que saber nada de cómo se
  // decide (Interface Segregation).
  const doubts = recipeDoubts(recipe);

  return (
    <RecipeAssistantProvider slug={recipe.slug} name={recipe.name}>
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
          doubt={doubts.onIngredients}
        />
        <RecipePreparation
          steps={recipe.steps}
          tips={recipe.tips}
          doubt={doubts.onProcess}
        />
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
    </RecipeAssistantProvider>
  );
}
