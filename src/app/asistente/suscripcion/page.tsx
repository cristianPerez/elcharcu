import { type Metadata } from 'next';
import { type ReactNode } from 'react';

import { SuscripcionPage } from '@/views/suscripcion';

export const metadata: Metadata = {
  title: 'Suscripción · El Charcu',
  description:
    'Recetas ilimitadas con el asistente, en pesos colombianos y con métodos locales.',
  robots: { index: false, follow: false },
};

interface PageProps {
  readonly searchParams: Promise<Record<string, string | readonly string[] | undefined>>;
}

export default async function Page({ searchParams }: PageProps): Promise<ReactNode> {
  const params = await searchParams;
  const receta = params['receta'];

  return (
    <SuscripcionPage attemptedProduct={typeof receta === 'string' ? receta : null} />
  );
}
