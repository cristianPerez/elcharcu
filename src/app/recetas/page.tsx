import { type Metadata } from 'next';
import { type ReactNode } from 'react';

import { RecetasPage } from '@/views/recetas';

export const metadata: Metadata = {
  title: 'Recetas · El Charcu',
  description:
    'Recetario guiado de charcutería artesanal — cada receta con la técnica exacta: sal, humo y tiempo.',
};

export default function Page(): ReactNode {
  return <RecetasPage />;
}
