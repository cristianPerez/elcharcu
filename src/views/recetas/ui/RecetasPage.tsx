import { type ReactNode } from 'react';

import { RecipeSearch } from '@/widgets/recipe-search';
import { SiteFooter } from '@/widgets/site-footer';
import { SiteHeader } from '@/widgets/site-header';

import { getRecipeSummaries } from '@/entities/recipe';

/**
 * FSD `views` layer: página de listado de recetas.
 * Carga los resúmenes en el servidor y los pasa al buscador (cliente).
 */
export function RecetasPage(): ReactNode {
  const recipes = getRecipeSummaries();

  return (
    <>
      <SiteHeader />
      <main>
        <RecipeSearch recipes={recipes} />
      </main>
      <SiteFooter />
    </>
  );
}
