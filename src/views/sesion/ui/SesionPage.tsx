import { type ReactNode } from 'react';

import { AppShell } from '@/widgets/app-shell';
import { FreeSession } from '@/widgets/free-session';

/** Marco de la sesión de curado. Solo composición. */
export function SesionPage(): ReactNode {
  return (
    <AppShell withHeaderBorder>
      <FreeSession />
    </AppShell>
  );
}
