import Link from 'next/link';
import { type ReactNode } from 'react';

import { OnboardingFlow } from '@/features/onboarding';

import { Logo } from '@/shared/ui';

/**
 * Onboarding a pantalla completa, sin la navegación del sitio: menos salidas,
 * más gente que termina las tres preguntas.
 */
export function OnboardingPage(): ReactNode {
  return (
    <div className="bg-grain flex min-h-screen flex-col bg-forest">
      <header className="px-6 py-6 md:px-10">
        <Link href="/asistente" aria-label="Volver a El Charcu">
          <Logo tone="light" />
        </Link>
      </header>

      <main className="flex flex-1 items-center px-6 pb-16 md:px-10">
        <div className="mx-auto w-full max-w-xl">
          <OnboardingFlow />
        </div>
      </main>
    </div>
  );
}
