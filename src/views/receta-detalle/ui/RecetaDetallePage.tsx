import { type ReactNode } from 'react';

import { AppFrame } from '@/widgets/app-frame';
import { RecipeDetail } from '@/widgets/recipe-detail';
import { SiteFooter } from '@/widgets/site-footer';

import { type Recipe } from '@/entities/recipe';

interface RecetaDetallePageProps {
  readonly recipe: Recipe;
}

/**
 * FSD `views` layer: página de detalle de una receta.
 *
 * Con el marco de la app (pestaña Recetas activa) desde el 2026-10-07. La
 * sesión se resuelve en el navegador (`viewer: client`): la página sigue
 * siendo estática y una visita no espera a nadie.
 */
export function RecetaDetallePage({ recipe }: RecetaDetallePageProps): ReactNode {
  return (
    <AppFrame viewer={{ kind: 'client' }} layout="bleed">
      <RecipeDetail recipe={recipe} />
      <SiteFooter />
    </AppFrame>
  );
}
