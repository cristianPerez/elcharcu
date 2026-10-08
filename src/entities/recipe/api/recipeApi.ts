import { unstable_cache } from 'next/cache';

import {
  createSupabaseAdminClient,
  isSupabaseAdminConfigured,
} from '@/shared/api/supabase/server';

import { isRecipe } from '../lib/parseRecipe';
import {
  isRecipeCategory,
  type RecetarioEntry,
  type RecipeTeaser,
} from '../model/recetario.types';
import { type Recipe, type RecipeSummary } from '../model/types';

/** La etiqueta de caché del recetario. `revalidateTag('recetario')` lo refresca. */
export const RECETARIO_CACHE_TAG = 'recetario';

/** Cada cuánto se vuelve a leer, aunque nadie lo invalide. */
const RECETARIO_REVALIDATE_S = 60 * 60;

/**
 * El recetario entero, leído UNA vez y guardado en la caché de datos de Next
 * (2026-10-07).
 *
 * ⚠️ POR QUÉ ASÍ. Las recetas eran JSON en el repo: leerlas no costaba nada.
 * Al pasar a la base, una consulta por visita le sumaría latencia a cada
 * página de receta y a cada pregunta a El Charcu — lo que no se podía
 * permitir. Con `unstable_cache` es una consulta por hora (o al invalidar la
 * etiqueta) para todo el sitio, y las páginas de receta siguen siendo
 * estáticas.
 *
 * Lee con la clave de servicio: quien decide qué se enseña es el SERVIDOR de
 * la app (la página de una receta es pública por su link; el listado completo
 * solo se le da a Pro). Lo que protege RLS es la API pública de Supabase, a la
 * que cualquiera puede llamar con la clave pública.
 *
 * Si la base falla, LANZA: no se guarda en caché un recetario vacío. Cada
 * quien decide qué hacer con el error (ver `recetarioOrLastGood`).
 */
const cachedRecetario = unstable_cache(
  async (): Promise<readonly RecetarioEntry[]> => {
    if (!isSupabaseAdminConfigured()) {
      throw new Error('recetario: falta la configuración de Supabase');
    }
    const { data, error } = await createSupabaseAdminClient()
      .from('recetario')
      .select('slug, category, origin, course_slug, capsule_slug, content')
      .eq('published', true)
      .order('position');

    if (error !== null || data === null) {
      throw new Error(`recetario: ${error?.message ?? 'sin datos'}`);
    }

    return data.flatMap((row): RecetarioEntry[] =>
      isRecipe(row.content) && isRecipeCategory(row.category)
        ? [
            {
              recipe: row.content,
              category: row.category,
              origin: row.origin,
              courseSlug: row.course_slug,
              capsuleSlug: row.capsule_slug,
            },
          ]
        : [],
    );
  },
  ['recetario-v1'],
  { revalidate: RECETARIO_REVALIDATE_S, tags: [RECETARIO_CACHE_TAG] },
);

/** El recetario completo. Lanza si la base falla. */
export async function getRecetario(): Promise<readonly RecetarioEntry[]> {
  return cachedRecetario();
}

let lastGood: readonly RecetarioEntry[] | null = null;

/**
 * El recetario, o la última versión buena que vio esta instancia, o vacío.
 * NUNCA lanza.
 *
 * Es el que usa El Charcu: si la base tiene un mal momento, el asistente
 * contesta sin el contexto de las recetas —como cuando nadie tiene una
 * abierta— en vez de devolverle un error a quien está preguntando.
 */
export async function recetarioOrLastGood(): Promise<readonly RecetarioEntry[]> {
  try {
    const entries = await cachedRecetario();
    lastGood = entries;
    return entries;
  } catch {
    return lastGood ?? [];
  }
}

export async function getRecipes(): Promise<readonly Recipe[]> {
  return (await getRecetario()).map((entry) => entry.recipe);
}

/**
 * Los slugs que se pre-generan en el build (`generateStaticParams`).
 *
 * Sin configuración de Supabase —el job de calidad de CI compila sin claves, a
 * propósito— no hay recetario que leer: se devuelve vacío y cada receta se
 * genera al pedirla (ISR). Con claves, como en Vercel, si la base falla el
 * build falla: mejor eso que publicar un sitio sin recetas.
 */
export async function staticRecipeSlugs(): Promise<readonly string[]> {
  if (!isSupabaseAdminConfigured()) {
    return [];
  }
  return (await getRecipes()).map((recipe) => recipe.slug);
}

export async function getRecetarioEntry(
  slug: string,
): Promise<RecetarioEntry | undefined> {
  return (await getRecetario()).find((entry) => entry.recipe.slug === slug);
}

export async function getRecipeBySlug(slug: string): Promise<Recipe | undefined> {
  return (await getRecetarioEntry(slug))?.recipe;
}

export async function getRecipeSummaries(): Promise<readonly RecipeSummary[]> {
  return (await getRecipes()).map(({ slug, name, description, image, tags }) => ({
    slug,
    name,
    description,
    image,
    tags,
  }));
}

/** La vitrina con candado: nombre, foto y categoría. Sin slug ni contenido. */
export async function getRecipeTeasers(): Promise<readonly RecipeTeaser[]> {
  return (await getRecetario()).map((entry) => ({
    name: entry.recipe.name,
    category: entry.category,
    image: entry.recipe.image,
    hasCourse: entry.courseSlug !== null,
  }));
}
