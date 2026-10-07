import { RECIPE_CATEGORIES, type RecetarioEntry } from '@/entities/recipe';

import { type CookbookCard, type LockedCard } from './model';

function labelOf(category: string): string {
  return RECIPE_CATEGORIES.find((item) => item.id === category)?.label ?? '';
}

/** Tarjetas ABIERTAS, con slug: solo para Pro o para "Las que te llegaron". */
export function toCookbookCards(entries: readonly RecetarioEntry[]): CookbookCard[] {
  return entries.map((entry) => ({
    slug: entry.recipe.slug,
    name: entry.recipe.name,
    image: entry.recipe.image,
    category: entry.category,
    categoryLabel: labelOf(entry.category),
    origin: entry.origin,
    hasCourse: entry.courseSlug !== null,
  }));
}

/** Tarjetas con CANDADO: nombre y foto, sin slug (no se pueden abrir ni enumerar). */
export function toLockedCards(entries: readonly RecetarioEntry[]): LockedCard[] {
  return entries.map((entry) => ({
    name: entry.recipe.name,
    image: entry.recipe.image,
    categoryLabel: labelOf(entry.category),
  }));
}
