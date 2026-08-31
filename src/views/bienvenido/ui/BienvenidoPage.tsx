import { type ReactNode } from 'react';

import { AppShell } from '@/widgets/app-shell';
import { PurchaseWelcome } from '@/widgets/purchase-welcome';

/** Aterrizaje tras la compra en Hotmart. Solo composición. */
export function BienvenidoPage(): ReactNode {
  return (
    <AppShell withHeaderBorder>
      <PurchaseWelcome />
    </AppShell>
  );
}
