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
  const title = `${recipe.name} · El Charcu`;
  return {
    title,
    description: recipe.description,
    openGraph: {
      title,
      description: recipe.description,
      type: 'article',
      images: [{ url: recipe.image, width: 430, height: 180, alt: recipe.name }],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description: recipe.description,
      images: [recipe.image],
    },
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
