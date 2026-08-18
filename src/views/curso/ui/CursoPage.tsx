import { type ReactNode } from 'react';

import { AppShell } from '@/widgets/app-shell';
import { GuidedRecipe } from '@/widgets/guided-recipe';

import { type GuidedRecipe as Recipe } from '@/entities/guided-recipe';

interface CursoPageProps {
  readonly recipe: Recipe;
}

/** Receta guiada. Solo composición. */
export function CursoPage({ recipe }: CursoPageProps): ReactNode {
  return (
    <AppShell withHeaderBorder>
      <GuidedRecipe recipe={recipe} />
    </AppShell>
  );
}
