import { type Metadata } from 'next';
import { type ReactNode } from 'react';

import { SesionPage } from '@/views/sesion';

export const metadata: Metadata = {
  title: 'Tu receta · El Charcu',
  description: 'La sesión donde curas tu pieza con el asistente al lado.',
  robots: { index: false, follow: false },
};

export default function Page(): ReactNode {
  return <SesionPage />;
}
