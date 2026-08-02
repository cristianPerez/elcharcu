import { type Metadata } from 'next';
import { type ReactNode } from 'react';

import { TablasPage } from '@/views/tablas';

export const metadata: Metadata = {
  title: 'Tablas · El Charcu',
  description:
    'Guías de armado paso a paso para tablas de quesos y embutidos — presentación, cortes y maridajes, con presupuestos reales.',
};

export default function Page(): ReactNode {
  return <TablasPage />;
}
