import { type ReactNode } from 'react';

import { AppShell } from '@/widgets/app-shell';

import { EmailAuthForm } from '@/features/auth-by-email';

/** Pantalla de entrada. Solo composición. */
export function EntrarPage(): ReactNode {
  return (
    <AppShell centered>
      <EmailAuthForm />
    </AppShell>
  );
}
