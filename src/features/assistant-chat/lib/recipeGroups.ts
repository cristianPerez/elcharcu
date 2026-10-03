import { type RecipeSummary } from './recipeHistory';

export interface RecipeSection {
  readonly id: 'en-proceso' | 'terminadas';
  readonly label: string;
  readonly items: readonly RecipeSummary[];
}

/**
 * El menú de recetas, por estado: "En proceso" y "Terminadas".
 *
 * ⚠️ "Dudas sueltas" (las conversaciones que no son una receta) todavía NO se
 * puede separar: la base no sabe distinguirlas. Llega con el estado de la
 * receta y el contrato estructurado del asistente, aplazados a propósito.
 */
export function recipeSections(
  recipes: readonly RecipeSummary[],
  search: string,
): readonly RecipeSection[] {
  const needle = search.trim().toLocaleLowerCase('es');
  const found =
    needle === ''
      ? recipes
      : recipes.filter((r) => r.title.toLocaleLowerCase('es').includes(needle));

  return [
    {
      id: 'en-proceso' as const,
      label: 'En proceso',
      items: found.filter((r) => r.status === 'activa'),
    },
    {
      id: 'terminadas' as const,
      label: 'Terminadas',
      items: found.filter((r) => r.status === 'terminada'),
    },
  ].filter((section) => section.items.length > 0);
}

const DAY_MS = 24 * 60 * 60 * 1000;

/** "Hoy", "Ayer", "Hace 4 días", "12 sep". Lo que se recuerda de una charla. */
export function whenLabel(iso: string, now: Date = new Date()): string {
  const then = new Date(iso);
  if (Number.isNaN(then.getTime())) {
    return '';
  }
  const startOfToday = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate(),
  ).getTime();
  const days = Math.floor((startOfToday - then.getTime()) / DAY_MS) + 1;

  if (then.getTime() >= startOfToday) {
    return 'Hoy';
  }
  if (days <= 1) {
    return 'Ayer';
  }
  if (days < 7) {
    return `Hace ${String(days)} días`;
  }
  return then.toLocaleDateString('es-CO', { day: 'numeric', month: 'short' });
}
