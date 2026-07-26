import { type ReactNode } from 'react';

import { RecipeDetail } from '@/widgets/recipe-detail';
import { SiteFooter } from '@/widgets/site-footer';
import { SiteHeader } from '@/widgets/site-header';

import { type Recipe } from '@/entities/recipe';

interface RecetaDetallePageProps {
  readonly recipe: Recipe;
}

/** FSD `views` layer: página de detalle de una receta. */
export function RecetaDetallePage({ recipe }: RecetaDetallePageProps): ReactNode {
  return (
    <>
      <SiteHeader />
      <main>
        <RecipeDetail recipe={recipe} />
      </main>
      <SiteFooter />
    </>
  );
}
