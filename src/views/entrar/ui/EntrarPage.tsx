import { type ReactNode } from 'react';

import { AppShell } from '@/widgets/app-shell';

import { AuthOpenTracker, EmailAuthForm } from '@/features/auth-by-email';

import { type AuthTrigger } from '@/shared/lib/analytics';

interface EntrarPageProps {
  /** Por qué se le pidió la cuenta. Solo para medir. */
  readonly trigger: AuthTrigger;
  /** La página a la que iba. Solo para medir. */
  readonly origin: string | null;
}

/** Pantalla de entrada. Solo composición. */
export function EntrarPage({ trigger, origin }: EntrarPageProps): ReactNode {
  return (
    <AppShell centered>
      <AuthOpenTracker trigger={trigger} origin={origin} />
      <EmailAuthForm />
    </AppShell>
  );
}
