import { type Metadata } from 'next';
import { type ReactNode } from 'react';

import { BienvenidoPage } from '@/views/bienvenido';

export const metadata: Metadata = {
  title: 'Bienvenido · El Charcu',
  description: 'Tu suscripción a El Charcu Pro.',
  // No se indexa: es una página de aterrizaje tras pagar, no contenido.
  robots: { index: false, follow: false },
};

export default function Page(): ReactNode {
  return <BienvenidoPage />;
}
