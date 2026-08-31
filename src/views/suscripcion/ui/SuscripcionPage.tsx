import { type ReactNode } from 'react';

import { AppShell } from '@/widgets/app-shell';
import { Paywall } from '@/widgets/paywall';

interface SuscripcionPageProps {
  /** De dónde llegó: `muro`, `menu`, `directo`. Solo para medir. */
  readonly source: string;
}

/** El muro de suscripción. Solo composición. */
export function SuscripcionPage({ source }: SuscripcionPageProps): ReactNode {
  return (
    <AppShell withHeaderBorder>
      <Paywall source={source} />
    </AppShell>
  );
}
