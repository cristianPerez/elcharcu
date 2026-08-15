import { type Metadata } from 'next';
import { type ReactNode } from 'react';

import { SuscripcionPage } from '@/views/suscripcion';

export const metadata: Metadata = {
  title: 'Suscripción · El Charcu',
  description:
    'El asistente al lado durante todo el curado. Pago seguro con tarjeta, PSE o Nequi.',
  robots: { index: false, follow: false },
};

export default function Page(): ReactNode {
  return <SuscripcionPage />;
}
