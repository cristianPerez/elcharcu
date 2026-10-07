import { type ReactNode } from 'react';

import { SignupTargets } from '@/features/auth-by-email';

import { publicCatalog } from '@/entities/course/server';
import { type Recipe } from '@/entities/recipe';
import { getRecetarioEntry } from '@/entities/recipe/server';

import { recipeDoubts } from '../lib/recipeDoubts';
import { recipeSignupTargets } from '../lib/recipeSignupTargets';
import { RecipeAssistantProvider } from '../model/RecipeAssistantProvider';

import { RecipeCapsuleCard } from './RecipeCapsuleCard';
import { RecipeCooking } from './RecipeCooking';
import { RecipeCourseWidget } from './RecipeCourseWidget';
import { RecipeHero } from './RecipeHero';
import { RecipeIngredients } from './RecipeIngredients';
import { RecipeLinkTracker } from './RecipeLinkTracker';
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
    El curso y la cápsula de esta receta se resuelven al COMPILAR (y al
    regenerar), no en cada visita: el recetario sale de su caché y el
    catálogo, de memoria, los dos sin tocar cookies. Así la página sigue
    siendo estática (diseño final 07, 2026-10-07).
  */
  const [entry, catalog] = await Promise.all([
    getRecetarioEntry(recipe.slug),
    publicCatalog(),
  ]);
  const course = catalog.masters.find((item) => item.slug === entry?.courseSlug) ?? null;
  const capsuleIndex = catalog.capsules.findIndex(
    (item) => item.slug === entry?.capsuleSlug,
  );
  const capsule = capsuleIndex === -1 ? null : (catalog.capsules[capsuleIndex] ?? null);

  // Sin cuenta, el curso y la cápsula abren la hoja de crear cuenta aquí
  // mismo, y al entrar vuelven a ellos.
  const signupTargets = recipeSignupTargets(
    course,
    capsule,
    capsuleIndex,
    catalog.capsules.length,
  );

  // Se calculan aquí, en el servidor, y bajan ya resueltas: las dos secciones
  // solo reciben la frase que les toca y no tienen que saber nada de cómo se
  // decide (Interface Segregation).
  const doubts = recipeDoubts({ ...recipe, doubts: recipe.doubts });

  return (
    <RecipeAssistantProvider slug={recipe.slug} name={recipe.name}>
      <article>
        <RecipeViewTracker slug={recipe.slug} name={recipe.name} tags={recipe.tags} />
        <RecipeLinkTracker slug={recipe.slug} />
        <SignupTargets targets={signupTargets} />
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

          {/* El final de la receta (diseño final 07): el curso que la enseña y
              la cápsula que ayuda a hacerla. Sin Pro no hay "recetas
              parecidas": termina en lo que enseña, no en más recetas. */}
          <div className="mt-10 flex flex-col gap-4">
            <RecipeCourseWidget
              recipeSlug={recipe.slug}
              recipeName={recipe.name}
              recipeImage={recipe.image}
              course={
                course === null
                  ? null
                  : { slug: course.slug, title: course.title, coverUrl: course.coverUrl }
              }
            />
            {capsule === null ? null : (
              <RecipeCapsuleCard
                slug={capsule.slug}
                title={capsule.title}
                number={capsuleIndex + 1}
              />
            )}
          </div>
        </RecipeSection>
      </article>
    </RecipeAssistantProvider>
  );
}
