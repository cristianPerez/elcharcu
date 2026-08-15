import { type ReactNode } from 'react';

import { AppShell } from '@/widgets/app-shell';
import { Paywall } from '@/widgets/paywall';

/** El muro de suscripción. Solo composición. */
export function SuscripcionPage(): ReactNode {
  return (
    <AppShell withHeaderBorder>
      <Paywall />
    </AppShell>
  );
}
