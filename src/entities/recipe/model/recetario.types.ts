import { type Recipe } from './types';

/**
 * La categoría de los filtros del recetario. Son los mismos ids que
 * `courses.category` (el `check` de `charcu.recetario` los fija); se repiten
 * aquí y no se importan de `entities/course` porque una entidad no importa de
 * otra (FSD).
 */
export type RecipeCategory =
  'chorizos' | 'jamones-curados' | 'jamones-cocidos' | 'embutidos-frescos' | 'quesos';

export const RECIPE_CATEGORIES: readonly { id: RecipeCategory; label: string }[] = [
  { id: 'chorizos', label: 'Chorizos' },
  { id: 'jamones-curados', label: 'Jamones curados' },
  { id: 'jamones-cocidos', label: 'Jamones cocidos' },
  { id: 'embutidos-frescos', label: 'Embutidos frescos' },
  { id: 'quesos', label: 'Quesos' },
];

export function isRecipeCategory(value: unknown): value is RecipeCategory {
  return RECIPE_CATEGORIES.some((category) => category.id === value);
}

/** Una receta del recetario con lo que la rodea: categoría, curso y cápsula. */
export interface RecetarioEntry {
  readonly recipe: Recipe;
  readonly category: RecipeCategory;
  /** "Colombia · 1 kg". */
  readonly origin: string | null;
  /** El curso que la enseña (publicado o en lista de espera), si hay. */
  readonly courseSlug: string | null;
  /** La cápsula con la que termina, si hay. */
  readonly capsuleSlug: string | null;
}

/** La tarjeta con candado: lo que ve quien no tiene Pro. Sin slug a propósito. */
export interface RecipeTeaser {
  readonly name: string;
  readonly category: RecipeCategory;
  readonly image: string;
  readonly hasCourse: boolean;
}
