import { type Metadata } from 'next';
import { notFound } from 'next/navigation';
import { type ReactNode } from 'react';

import { RecetaDetallePage } from '@/views/receta-detalle';

import { getRecipeBySlug, getRecipes } from '@/entities/recipe';

interface RecetaRouteProps {
  readonly params: Promise<{ readonly slug: string }>;
}

export function generateStaticParams(): Array<{ slug: string }> {
  return getRecipes().map((recipe) => ({ slug: recipe.slug }));
}

export async function generateMetadata({ params }: RecetaRouteProps): Promise<Metadata> {
  const { slug } = await params;
  const recipe = getRecipeBySlug(slug);
  if (!recipe) {
    return { title: 'Receta no encontrada · El Charcu' };
  }
  return {
    title: `${recipe.name} · El Charcu`,
    description: recipe.description,
  };
}

export default async function Page({ params }: RecetaRouteProps): Promise<ReactNode> {
  const { slug } = await params;
  const recipe = getRecipeBySlug(slug);

  if (!recipe) {
    notFound();
  }

  return <RecetaDetallePage recipe={recipe} />;
}
