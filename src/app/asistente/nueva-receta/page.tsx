import { type Metadata } from 'next';
import { type ReactNode } from 'react';

import { NuevaRecetaPage } from '@/views/nueva-receta';

export const metadata: Metadata = {
  title: 'Empezar otra receta · El Charcu',
  description: 'Elige la siguiente pieza que vas a curar con el asistente.',
  robots: { index: false, follow: false },
};

export default function Page(): ReactNode {
  return <NuevaRecetaPage />;
}
