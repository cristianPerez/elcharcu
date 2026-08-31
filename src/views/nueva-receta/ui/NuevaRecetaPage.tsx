import { type ReactNode } from 'react';

import { AppShell } from '@/widgets/app-shell';

import { NewRecipePicker } from '@/features/start-recipe';

/** Elegir otra receta. Aquí es donde se aplica el candado. Solo composición. */
export function NuevaRecetaPage(): ReactNode {
  return (
    <AppShell centered>
      <NewRecipePicker />
    </AppShell>
  );
}
