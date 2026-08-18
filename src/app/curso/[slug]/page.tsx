import { type Metadata } from 'next';
import { notFound } from 'next/navigation';
import { type ReactNode } from 'react';

import { CursoPage } from '@/views/curso';

import { bondiolaCurada } from '@/entities/guided-recipe';

/**
 * Ruta EXPERIMENTAL: el curso y el asistente en la misma pantalla.
 *
 * Hoy solo existe una receta, a propósito — es una prueba de la idea, no un
 * catálogo. Si funciona, esto pasa a leerse de la base como el resto.
 */
const RECIPES = { [bondiolaCurada.slug]: bondiolaCurada } as const;

interface PageProps {
  readonly params: Promise<{ readonly slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const recipe = RECIPES[slug as keyof typeof RECIPES];

  return recipe === undefined
    ? { title: 'Receta · El Charcu' }
    : {
        title: `${recipe.name} · El Charcu`,
        description: recipe.summary,
      };
}

export default async function Page({ params }: PageProps): Promise<ReactNode> {
  const { slug } = await params;
  const recipe = RECIPES[slug as keyof typeof RECIPES];

  if (recipe === undefined) {
    notFound();
  }

  return <CursoPage recipe={recipe} />;
}
