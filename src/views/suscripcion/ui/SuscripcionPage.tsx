import { type ReactNode } from 'react';

import { AppShell } from '@/widgets/app-shell';
import { Paywall } from '@/widgets/paywall';

import { type CheckoutLinks } from '@/entities/plan';

interface SuscripcionPageProps {
  /** De dónde llegó: `muro`, `menu`, `directo`. Solo para medir. */
  readonly source: string;
  readonly checkoutLinks: CheckoutLinks;
}

/** El muro de suscripción. Solo composición. */
export function SuscripcionPage({
  source,
  checkoutLinks,
}: SuscripcionPageProps): ReactNode {
  return (
    <AppShell withHeaderBorder>
      <Paywall source={source} checkoutLinks={checkoutLinks} />
    </AppShell>
  );
}
