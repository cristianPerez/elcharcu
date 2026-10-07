import { type ReactNode } from 'react';

import { AppFrame } from '@/widgets/app-frame';
import { RecipeSearch } from '@/widgets/recipe-search';
import { SiteFooter } from '@/widgets/site-footer';
import { TablasStrip } from '@/widgets/tablas-strip';

import { getRecipeSummaries } from '@/entities/recipe/server';

/**
 * FSD `views` layer: página de listado de recetas.
 * Carga los resúmenes en el servidor y los pasa al buscador (cliente).
 */
export async function RecetasPage(): Promise<ReactNode> {
  const recipes = await getRecipeSummaries();

  return (
    <AppFrame viewer={{ kind: 'client' }} layout="bleed">
      <RecipeSearch recipes={recipes} />
      {/* Las tablas viven aquí desde que dejaron de tener ítem propio en el
            menú. Van DESPUÉS del buscador: quien llega busca una receta, y la
            tabla es lo que se encuentra de paso. */}
      <TablasStrip />
      <SiteFooter />
    </AppFrame>
  );
}
