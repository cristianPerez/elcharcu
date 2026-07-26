'use client';

import { type ReactNode, useEffect } from 'react';

import { track } from '@/shared/lib';

interface RecipeViewTrackerProps {
  readonly slug: string;
  readonly name: string;
  readonly tags: readonly string[];
}

/** Envía el evento de vista de receta sin convertir el resto del árbol en cliente. */
export function RecipeViewTracker({
  slug,
  name,
  tags,
}: RecipeViewTrackerProps): ReactNode {
  useEffect(() => {
    track('recipe_detail_view', {
      recipe_slug: slug,
      recipe_name: name,
      tags: tags.join(','),
    });
  }, [slug, name, tags]);

  return null;
}
