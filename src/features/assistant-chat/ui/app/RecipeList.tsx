'use client';

import { useEffect, useState, type ReactNode } from 'react';

import { cn } from '@/shared/lib';
import { IconPlus, IconSearch, ProgressBar, coverToneFor } from '@/shared/ui';

import { recipeSections, whenLabel } from '../../lib/recipeGroups';
import { fetchRecipes, type RecipeSummary } from '../../lib/recipeHistory';

export interface RecipeUsage {
  readonly used: number;
  readonly limit: number;
}

interface RecipeListProps {
  readonly currentId: string | null;
  /** Cambia cuando hay que volver a pedir la lista (nació una receta). */
  readonly refreshKey: string;
  readonly usage: RecipeUsage | null;
  readonly onPick: (id: string) => void;
  readonly onNew: () => void;
}

const TILE: Record<ReturnType<typeof coverToneFor>, string> = {
  forest: 'bg-forest-light text-brasa-light',
  'forest-dark': 'bg-forest-dark text-brasa-light',
  'forest-light': 'bg-forest text-brasa-light',
  tinta: 'bg-brasa-tinta text-cream-white',
  sage: 'bg-sage-light text-forest',
};

/** La primera LETRA del título: "**Moho…" o "¿Cuánta…" no empiezan por letra. */
function initialOf(title: string): string {
  return (/\p{L}/u.exec(title)?.[0] ?? '·').toUpperCase();
}

/**
 * "Mis recetas": cada conversación es una receta. La comparten el cajón del
 * celular y la columna fija de escritorio.
 */
export function RecipeList({
  currentId,
  refreshKey,
  usage,
  onPick,
  onNew,
}: RecipeListProps): ReactNode {
  const [recipes, setRecipes] = useState<readonly RecipeSummary[] | null>(null);
  const [search, setSearch] = useState('');

  useEffect(() => {
    let alive = true;
    void fetchRecipes().then((history) => {
      if (alive) {
        setRecipes(history.recipes);
      }
    });
    return () => {
      alive = false;
    };
  }, [refreshKey]);

  const sections = recipeSections(recipes ?? [], search);

  return (
    <div className="flex h-full min-h-0 flex-col">
      <div className="flex flex-col gap-3 px-4 pt-4">
        <button
          type="button"
          onClick={onNew}
          className="flex min-h-12 items-center justify-center gap-2 rounded-full bg-brasa text-[15px] font-semibold text-cocoa transition-colors hover:bg-brasa-dark"
        >
          <IconPlus size={18} strokeWidth={2} />
          Receta nueva
        </button>
        <label className="flex min-h-11 items-center gap-2.5 rounded-full bg-cream px-4">
          <IconSearch size={16} className="text-cocoa-soft" />
          <span className="sr-only">Buscar receta</span>
          <input
            type="search"
            value={search}
            onChange={(event) => {
              setSearch(event.target.value);
            }}
            placeholder="Buscar receta"
            className="min-w-0 flex-1 bg-transparent text-[15px] text-cocoa outline-none placeholder:text-cocoa-muted"
          />
        </label>
      </div>

      <nav
        aria-label="Mis recetas"
        className="min-h-0 flex-1 overflow-y-auto px-2 pb-4 pt-2"
      >
        {recipes === null ? (
          <p className="px-3 py-4 text-sm text-cocoa-soft">Cargando…</p>
        ) : sections.length === 0 ? (
          <p className="px-3 py-4 text-sm text-cocoa-soft">
            {search === ''
              ? 'Todavía no tienes recetas.'
              : 'Ninguna receta con ese nombre.'}
          </p>
        ) : (
          sections.map((section) => (
            <section
              key={section.id}
              aria-labelledby={`recipes-${section.id}`}
              className="mt-3"
            >
              <h3
                id={`recipes-${section.id}`}
                className="px-3 pb-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-brasa-tinta"
              >
                {section.label}
              </h3>
              <ul>
                {section.items.map((recipe) => (
                  <li key={recipe.id}>
                    <button
                      type="button"
                      aria-current={recipe.id === currentId ? 'true' : undefined}
                      onClick={() => {
                        onPick(recipe.id);
                      }}
                      className={cn(
                        'flex min-h-14 w-full items-center gap-3 rounded-xl px-3 py-2 text-left transition-colors',
                        recipe.id === currentId ? 'bg-cream' : 'hover:bg-cream/70',
                      )}
                    >
                      <span
                        aria-hidden="true"
                        className={cn(
                          'grid size-9 shrink-0 place-items-center rounded-lg font-serif text-base font-semibold',
                          TILE[coverToneFor(recipe.title)],
                        )}
                      >
                        {initialOf(recipe.title)}
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-[15px] font-semibold text-cocoa">
                          {recipe.title}
                        </span>
                        <span className="block text-[13px] text-cocoa-soft">
                          {recipe.status === 'terminada' ? 'Terminada · ' : ''}
                          {whenLabel(recipe.lastMessageAt)}
                        </span>
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
            </section>
          ))
        )}
      </nav>

      {usage === null ? null : (
        <div className="border-t border-cocoa/10 px-4 py-4">
          <div className="mb-2 flex justify-between text-[13px]">
            <span className="text-cocoa-soft">Preguntas este mes</span>
            <span className="font-semibold text-cocoa">
              {usage.used} de {usage.limit}
            </span>
          </div>
          <ProgressBar
            value={usage.limit === 0 ? 0 : (usage.used / usage.limit) * 100}
            label="Preguntas usadas este mes"
          />
        </div>
      )}
    </div>
  );
}
