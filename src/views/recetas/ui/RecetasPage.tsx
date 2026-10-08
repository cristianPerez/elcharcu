import { type ReactNode } from 'react';

import { AppFooter } from '@/widgets/app-footer';
import { AppFrame, type FrameViewer } from '@/widgets/app-frame';
import {
  CookbookFull,
  CookbookLocked,
  type CookbookCard,
  type LockedCard,
} from '@/widgets/recipe-catalog';

import { RECIPE_CATEGORIES } from '@/entities/recipe';

type RecetasPageProps = {
  readonly viewer: FrameViewer;
} & (
  | { readonly isPro: true; readonly recipes: readonly CookbookCard[] }
  | {
      readonly isPro: false;
      readonly received: readonly CookbookCard[];
      readonly locked: readonly LockedCard[];
      readonly total: number;
    }
);

/**
 * La pestaña Recetas (diseño final 08, 09 y 10). Pro y Maestro: el recetario
 * completo. Aprendiz y sin cuenta: "Las que te llegaron" y el resto con
 * candado. Solo composición: qué recibe cada quien lo decide la página.
 */
export function RecetasPage(props: RecetasPageProps): ReactNode {
  return (
    <AppFrame viewer={props.viewer} layout="bleed">
      {props.isPro ? (
        <CookbookFull recipes={props.recipes} categories={RECIPE_CATEGORIES} />
      ) : (
        <CookbookLocked
          received={props.received}
          locked={props.locked}
          total={props.total}
        />
      )}
      <AppFooter />
    </AppFrame>
  );
}
