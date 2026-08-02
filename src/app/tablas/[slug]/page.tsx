import { type Metadata } from 'next';
import { notFound } from 'next/navigation';
import { type ReactNode } from 'react';

import { TablaDetallePage } from '@/views/tabla-detalle';

import { getTablaBySlug, getTablas } from '@/entities/tabla';

interface TablaRouteProps {
  readonly params: Promise<{ readonly slug: string }>;
}

export function generateStaticParams(): Array<{ slug: string }> {
  return getTablas().map((tabla) => ({ slug: tabla.slug }));
}

export async function generateMetadata({ params }: TablaRouteProps): Promise<Metadata> {
  const { slug } = await params;
  const tabla = getTablaBySlug(slug);
  if (!tabla) {
    return { title: 'Tabla no encontrada · El Charcu' };
  }
  return {
    title: `${tabla.name} · El Charcu`,
    description: tabla.description,
  };
}

export default async function Page({ params }: TablaRouteProps): Promise<ReactNode> {
  const { slug } = await params;
  const tabla = getTablaBySlug(slug);

  if (!tabla) {
    notFound();
  }

  return <TablaDetallePage tabla={tabla} />;
}
