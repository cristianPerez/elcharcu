import { type Metadata } from 'next';
import { type ReactNode } from 'react';

import { SuscripcionPage } from '@/views/suscripcion';

export const metadata: Metadata = {
  title: 'Suscripción · El Charcu',
  description:
    'El asistente al lado durante todo el curado, en pesos colombianos y con métodos locales.',
  robots: { index: false, follow: false },
};

export default function Page(): ReactNode {
  return <SuscripcionPage />;
}
