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
  const title = `${tabla.name} · El Charcu`;
  return {
    title,
    description: tabla.description,
    openGraph: {
      title,
      description: tabla.description,
      type: 'article',
      images: [{ url: tabla.image, width: 430, height: 180, alt: tabla.name }],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description: tabla.description,
      images: [tabla.image],
    },
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
