import { type Metadata } from 'next';
import { type ReactNode } from 'react';

import { RecetasPage } from '@/views/recetas';

const TITLE = 'Recetas · El Charcu';
const DESCRIPTION =
  'Recetario guiado de charcutería artesanal — cada receta con la técnica exacta: sal, humo y tiempo.';
const IMAGE = '/recipes/chorizo-iberico.jpg';

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    type: 'website',
    images: [{ url: IMAGE, width: 430, height: 180, alt: TITLE }],
  },
  twitter: {
    card: 'summary_large_image',
    title: TITLE,
    description: DESCRIPTION,
    images: [IMAGE],
  },
};

export default function Page(): ReactNode {
  return <RecetasPage />;
}
