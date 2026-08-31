import { type ReactNode } from 'react';

import { RecipeSearch } from '@/widgets/recipe-search';
import { SiteFooter } from '@/widgets/site-footer';
import { SiteHeader } from '@/widgets/site-header';
import { TablasStrip } from '@/widgets/tablas-strip';

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
        {/* Las tablas viven aquí desde que dejaron de tener ítem propio en el
            menú. Van DESPUÉS del buscador: quien llega busca una receta, y la
            tabla es lo que se encuentra de paso. */}
        <TablasStrip />
      </main>
      <SiteFooter />
    </>
  );
}
