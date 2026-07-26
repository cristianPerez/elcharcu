import longanizaColombiana from '../recipes/longaniza-colombiana.json';

import { type Recipe, type RecipeSummary } from './types';

/**
 * Recetas cargadas desde `entities/recipe/recipes/*.json` vía import estático
 * (resolveJsonModule): tipado en compilación contra `Recipe` — sin `any`, sin
 * validación en runtime — e isomórfico (server y client).
 * Para añadir una receta: crea el `.json` y regístralo en esta lista.
 */
const recipes: readonly Recipe[] = [longanizaColombiana];

export function getRecipes(): readonly Recipe[] {
  return recipes;
}

export function getRecipeBySlug(slug: string): Recipe | undefined {
  return recipes.find((recipe) => recipe.slug === slug);
}

export function getRecipeSummaries(): readonly RecipeSummary[] {
  return recipes.map(({ slug, name, description, image }) => ({
    slug,
    name,
    description,
    image,
  }));
}
