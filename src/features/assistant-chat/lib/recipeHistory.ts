export interface RecipeSummary {
  readonly id: string;
  readonly title: string;
  readonly lastMessageAt: string;
}

interface RecipesResponse {
  readonly recipes?: unknown;
}

/** Nunca se cree lo que llega: se comprueba fila por fila. */
function parse(value: unknown): readonly RecipeSummary[] {
  if (!Array.isArray(value)) {
    return [];
  }

  return value.flatMap((row: unknown): RecipeSummary[] => {
    if (typeof row !== 'object' || row === null) {
      return [];
    }
    const { id, title, lastMessageAt } = row as Record<string, unknown>;
    if (
      typeof id !== 'string' ||
      typeof title !== 'string' ||
      typeof lastMessageAt !== 'string'
    ) {
      return [];
    }
    return [{ id, title, lastMessageAt }];
  });
}

/** Las conversaciones de quien pregunta. Lista vacía si algo falla. */
export async function fetchRecipes(): Promise<readonly RecipeSummary[]> {
  try {
    const response = await fetch('/api/recetas', { cache: 'no-store' });
    if (!response.ok) {
      return [];
    }
    const payload = (await response.json()) as RecipesResponse;
    return parse(payload.recipes);
  } catch {
    return [];
  }
}

export interface RecipeGroup {
  readonly label: string;
  readonly items: readonly RecipeSummary[];
}

const DAY_MS = 24 * 60 * 60 * 1000;

/**
 * Agrupa por cercanía en el tiempo, no por fecha exacta.
 *
 * "Hoy · Esta semana · Antes" y no "20 de agosto" porque nadie recuerda el día
 * en que preguntó algo; recuerda que fue *hace poco* o *hace tiempo*. Un
 * curado dura semanas, así que la última franja se llena rápido y por eso la
 * lista ya viene ordenada por el último mensaje.
 */
export function groupByDate(recipes: readonly RecipeSummary[]): readonly RecipeGroup[] {
  const ahora = Date.now();
  const hoy: RecipeSummary[] = [];
  const semana: RecipeSummary[] = [];
  const antes: RecipeSummary[] = [];

  for (const recipe of recipes) {
    const cuando = new Date(recipe.lastMessageAt).getTime();
    const edad = ahora - cuando;

    if (Number.isNaN(cuando) || edad > 7 * DAY_MS) {
      antes.push(recipe);
    } else if (edad > DAY_MS) {
      semana.push(recipe);
    } else {
      hoy.push(recipe);
    }
  }

  return [
    { label: 'Hoy', items: hoy },
    { label: 'Esta semana', items: semana },
    { label: 'Antes', items: antes },
  ].filter((grupo) => grupo.items.length > 0);
}
