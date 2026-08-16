import { type Metadata } from 'next';
import { type ReactNode } from 'react';

import { SuscripcionPage } from '@/views/suscripcion';

export const metadata: Metadata = {
  title: 'Suscríbete · El Charcu',
  description:
    'El asistente al lado durante todo el curado. Pago seguro con tarjeta, PSE o Nequi.',
  robots: { index: false, follow: false },
};

interface PageProps {
  readonly searchParams: Promise<Record<string, string | readonly string[] | undefined>>;
}

export default async function Page({ searchParams }: PageProps): Promise<ReactNode> {
  // `?de=muro` cuando llega porque se le acabó el cupo, `?de=menu` desde el
  // menú. Saber por qué camino llega es la mitad del valor de esta página.
  const params = await searchParams;
  const de = params['de'];

  return <SuscripcionPage source={typeof de === 'string' ? de : 'directo'} />;
}
