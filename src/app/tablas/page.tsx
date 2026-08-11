import { type Metadata } from 'next';
import { type ReactNode } from 'react';

import { TablasPage } from '@/views/tablas';

const TITLE = 'Tablas · El Charcu';
const DESCRIPTION =
  'Guías de armado paso a paso para tablas de quesos y embutidos — presentación, cortes y maridajes, con presupuestos reales.';
const IMAGE = '/recipes/tabla-de-quesos-d1.jpg';

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
  return <TablasPage />;
}
