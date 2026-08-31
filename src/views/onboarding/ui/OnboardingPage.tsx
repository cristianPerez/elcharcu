import { type ReactNode } from 'react';

import { AppShell } from '@/widgets/app-shell';

import { OnboardingFlow } from '@/features/onboarding';

/** Onboarding a pantalla completa. Solo composición. */
export function OnboardingPage(): ReactNode {
  return (
    <AppShell centered>
      <OnboardingFlow />
    </AppShell>
  );
}
