'use client';

import Link from 'next/link';
import { type ReactNode, useEffect, useMemo, useState } from 'react';

import { RecipeCard, type RecipeSummary } from '@/entities/recipe';

import { cn, track } from '@/shared/lib';
import { Container, Eyebrow, SearchBar } from '@/shared/ui';

interface RecipeSearchProps {
  readonly recipes: readonly RecipeSummary[];
}

/** Buscador de recetas: SearchBar + filtro por etiquetas + grid de RecipeCard. */
export function RecipeSearch({ recipes }: RecipeSearchProps): ReactNode {
  const [query, setQuery] = useState('');
  const [activeTags, setActiveTags] = useState<readonly string[]>([]);

  const allTags = useMemo(
    () =>
      [...new Set(recipes.flatMap((recipe) => recipe.tags))].sort((a, b) =>
        a.localeCompare(b, 'es'),
      ),
    [recipes],
  );

  const toggleTag = (tag: string): void => {
    setActiveTags((current) =>
      current.includes(tag) ? current.filter((item) => item !== tag) : [...current, tag],
    );
  };

  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return recipes.filter((recipe) => {
      const matchesText =
        !needle || `${recipe.name} ${recipe.description}`.toLowerCase().includes(needle);
      const matchesTags =
        activeTags.length === 0 || activeTags.some((tag) => recipe.tags.includes(tag));
      return matchesText && matchesTags;
    });
  }, [query, activeTags, recipes]);

  useEffect(() => {
    const trimmed = query.trim();
    if (!trimmed) {
      return undefined;
    }
    const timeout = setTimeout(() => {
      track('recipe_search', { query: trimmed, results_count: filtered.length });
    }, 500);
    return () => clearTimeout(timeout);
  }, [query, filtered]);

  return (
    <div>
      <section className="bg-grain bg-forest py-12 text-cream md:py-16">
        <Container>
          <Eyebrow className="text-sage">La Academia</Eyebrow>
          <h1 className="mt-4 font-serif text-3xl font-semibold leading-tight md:text-4xl">
            Recetario guiado.
          </h1>
          <p className="mt-3 max-w-lg text-sm leading-relaxed text-cream/75 md:text-[15px]">
            Cada receta con la técnica exacta — sal, humo y tiempo.
          </p>
        </Container>
      </section>

      <section className="bg-cream pt-8 md:pt-10">
        <Container>
          <SearchBar value={query} onChange={setQuery} className="max-w-md" />
          <div className="mt-4 flex flex-wrap gap-2">
            {allTags.map((tag) => {
              const isActive = activeTags.includes(tag);
              return (
                <button
                  key={tag}
                  type="button"
                  aria-pressed={isActive}
                  onClick={() => {
                    toggleTag(tag);
                    track('recipe_tag_filter_toggle', { tag, active: !isActive });
                  }}
                  className={cn(
                    'rounded-full border px-3 py-1 text-[13px] transition-colors',
                    isActive
                      ? 'border-transparent bg-terracota text-cream'
                      : 'border-cocoa/15 text-cocoa/70 hover:border-cocoa/30',
                  )}
                >
                  {tag}
                </button>
              );
            })}
          </div>
        </Container>
      </section>

      <section className="bg-cream py-8 md:py-12">
        <Container>
          {filtered.length === 0 ? (
            <p className="text-sm text-cocoa/50">
              No encontramos recetas con esos filtros.
            </p>
          ) : (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-6 lg:grid-cols-3">
              {filtered.map((recipe) => (
                <Link
                  key={recipe.slug}
                  href={`/recetas/${recipe.slug}`}
                  className="text-inherit no-underline"
                  onClick={() => {
                    track('recipe_card_click', {
                      recipe_slug: recipe.slug,
                      recipe_name: recipe.name,
                      tags: recipe.tags.join(','),
                    });
                  }}
                >
                  <RecipeCard recipe={recipe} />
                </Link>
              ))}
            </div>
          )}
        </Container>
      </section>
    </div>
  );
}
