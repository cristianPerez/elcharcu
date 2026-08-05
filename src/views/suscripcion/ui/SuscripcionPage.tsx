import { type ReactNode } from 'react';

import { AppShell } from '@/widgets/app-shell';
import { Paywall } from '@/widgets/paywall';

interface SuscripcionPageProps {
  readonly attemptedProduct: string | null;
}

/** El muro de suscripción. Solo composición. */
export function SuscripcionPage({ attemptedProduct }: SuscripcionPageProps): ReactNode {
  return (
    <AppShell withHeaderBorder>
      <Paywall attemptedProduct={attemptedProduct} />
    </AppShell>
  );
}
