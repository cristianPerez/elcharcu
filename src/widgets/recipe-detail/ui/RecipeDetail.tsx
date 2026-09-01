import { type ReactNode } from 'react';

import { publishedCourseSlugs } from '@/entities/course/server';
import { type Recipe } from '@/entities/recipe';

import { recipeDoubts } from '../lib/recipeDoubts';
import { RecipeAssistantProvider } from '../model/RecipeAssistantProvider';

import { RecipeClosing } from './RecipeClosing';
import { RecipeCooking } from './RecipeCooking';
import { RecipeHero } from './RecipeHero';
import { RecipeIngredients } from './RecipeIngredients';
import { RecipeOverview } from './RecipeOverview';
import { RecipePreparation } from './RecipePreparation';
import { RecipeQuote } from './RecipeQuote';
import { RecipeSection } from './RecipeSection';
import { RecipeViewTracker } from './RecipeViewTracker';

interface RecipeDetailProps {
  readonly recipe: Recipe;
}

/** Cuerpo completo de la página de receta, compuesto por secciones. */
export async function RecipeDetail({ recipe }: RecipeDetailProps): Promise<ReactNode> {
  /*
    Qué cursos están grabados se resuelve al COMPILAR, no en cada visita.

    Se lee una sola vez para las 45 recetas (`cache()` de React) y sin tocar
    cookies, que es lo que permite que estas páginas sigan siendo estáticas.
    Si no hay curso grabado para esta receta, `courseSlug` es `null` y el cierre
    ofrece la cuenta en su lugar.
  */
  const publicados = await publishedCourseSlugs();
  const courseSlug = publicados.has(recipe.slug) ? recipe.slug : null;

  // Se calculan aquí, en el servidor, y bajan ya resueltas: las dos secciones
  // solo reciben la frase que les toca y no tienen que saber nada de cómo se
  // decide (Interface Segregation).
  const doubts = recipeDoubts({ ...recipe, doubts: recipe.doubts });

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
          doubt={doubts.onIntro}
        />

        <RecipeSection tight>
          <RecipeQuote quote={recipe.quote} size="lg" />
        </RecipeSection>

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
          doubt={doubts.onServing}
        />

        <RecipeSection>
          <RecipeQuote
            quote={recipe.finalQuote}
            caption={recipe.finalQuoteCaption}
            size="md"
          />

          {/* La oferta va LA ÚLTIMA y solo una vez: ya leyó la receta entera,
              así que es el único punto de la página donde pedir algo no
              interrumpe nada. */}
          <div className="mt-10">
            <RecipeClosing recipeName={recipe.name} courseSlug={courseSlug} />
          </div>
        </RecipeSection>
      </article>
    </RecipeAssistantProvider>
  );
}
