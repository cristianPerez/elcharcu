import { type Metadata } from 'next';
import { type ReactNode } from 'react';

import { EntrarPage } from '@/views/entrar';

export const metadata: Metadata = {
  title: 'Entrar · El Charcu',
  description: 'Entra con tu correo para que tus curados no se pierdan.',
  robots: { index: false, follow: false },
};

export default function Page(): ReactNode {
  return <EntrarPage />;
}
