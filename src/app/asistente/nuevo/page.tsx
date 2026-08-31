import { type Metadata } from 'next';
import { type ReactNode } from 'react';

import { OnboardingPage } from '@/views/onboarding';

export const metadata: Metadata = {
  title: 'Empezar tu receta gratis · El Charcu',
  description:
    'Tres preguntas cortas y arrancas: tu país, tu experiencia y qué vas a curar. Sin tarjeta.',
  robots: { index: false, follow: false },
};

export default function Page(): ReactNode {
  return <OnboardingPage />;
}
