import { type Metadata } from 'next';
import { type ReactNode } from 'react';

import { TiendaPage } from '@/views/tienda';

export const metadata: Metadata = {
  title: 'Tienda · El Charcu',
  description:
    'Embutidos y curados hechos a mano en Manizales. Lotes pequeños, venta directa por WhatsApp.',
};

export default function Page(): ReactNode {
  return <TiendaPage />;
}
