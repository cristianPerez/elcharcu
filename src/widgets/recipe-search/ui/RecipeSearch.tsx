'use client';

import Link from 'next/link';
import { type ReactNode, useEffect, useMemo, useState } from 'react';

import { RecipeCard, type RecipeSummary } from '@/entities/recipe';

import { track } from '@/shared/lib';
import { Container, Eyebrow, SearchBar } from '@/shared/ui';

import { FACET_LABELS, FACETS, getTagFacet } from '../lib/tagFacets';

import { TagFacetDropdown } from './TagFacetDropdown';

interface RecipeSearchProps {
  readonly recipes: readonly RecipeSummary[];
}

/** Buscador de recetas: SearchBar + filtro por facetas de etiquetas + grid de RecipeCard. */
export function RecipeSearch({ recipes }: RecipeSearchProps): ReactNode {
  const [query, setQuery] = useState('');
  const [activeTags, setActiveTags] = useState<readonly string[]>([]);

  const facetGroups = useMemo(() => {
    const counts = new Map<string, number>();
    for (const recipe of recipes) {
      for (const tag of recipe.tags) {
        counts.set(tag, (counts.get(tag) ?? 0) + 1);
      }
    }
    const tags = [...counts.keys()].sort((a, b) => a.localeCompare(b, 'es'));

    return FACETS.map((facet) => ({
      facet,
      label: FACET_LABELS[facet],
      options: tags
        .filter((tag) => getTagFacet(tag) === facet)
        .map((tag) => ({
          tag,
          count: counts.get(tag) ?? 0,
          active: activeTags.includes(tag),
        })),
    }));
  }, [recipes, activeTags]);

  const toggleTag = (tag: string): void => {
    const willBeActive = !activeTags.includes(tag);
    setActiveTags((current) =>
      current.includes(tag) ? current.filter((item) => item !== tag) : [...current, tag],
    );
    track('recipe_tag_filter_toggle', { tag, active: willBeActive });
  };

  const clearFilters = (): void => setActiveTags([]);

  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return recipes.filter((recipe) => {
      const matchesText =
        !needle || `${recipe.name} ${recipe.description}`.toLowerCase().includes(needle);
      const matchesTags = FACETS.every((facet) => {
        const facetActiveTags = activeTags.filter((tag) => getTagFacet(tag) === facet);
        return (
          facetActiveTags.length === 0 ||
          facetActiveTags.some((tag) => recipe.tags.includes(tag))
        );
      });
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
      <section className="bg-grain bg-forest py-6 text-cream md:py-7">
        <Container>
          <div className="flex flex-wrap items-baseline gap-4">
            <Eyebrow className="text-sage">La Academia</Eyebrow>
            <h1 className="font-serif text-3xl font-semibold leading-tight md:text-4xl">
              Recetario guiado.
            </h1>
            <p className="max-w-lg text-sm leading-relaxed text-cream/75 md:text-[15px]">
              Cada receta con la técnica exacta — sal, humo y tiempo.
            </p>
          </div>
        </Container>
      </section>

      <section className="bg-cream pt-8 md:pt-10">
        <Container>
          <SearchBar value={query} onChange={setQuery} className="max-w-md" />
          <div className="mt-4 flex flex-wrap gap-2">
            {facetGroups.map(({ facet, label, options }) => (
              <TagFacetDropdown
                key={facet}
                label={label}
                options={options}
                onToggle={toggleTag}
              />
            ))}
          </div>

          {activeTags.length > 0 ? (
            <div className="mt-3 flex flex-wrap items-center gap-2">
              {activeTags.map((tag) => (
                <button
                  key={tag}
                  type="button"
                  onClick={() => toggleTag(tag)}
                  className="flex items-center gap-1 rounded-full border border-cocoa/15 bg-white px-2.5 py-0.5 text-[12px] text-cocoa/70 hover:border-cocoa/30"
                >
                  {tag}
                  <span aria-hidden>×</span>
                </button>
              ))}
              <button
                type="button"
                onClick={clearFilters}
                className="text-[12px] text-cocoa/50 underline hover:text-cocoa/70"
              >
                Limpiar filtros
              </button>
            </div>
          ) : null}
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
                  <RecipeCard recipe={recipe} className="h-[340px] md:h-[390px]" />
                </Link>
              ))}
            </div>
          )}
        </Container>
      </section>
    </div>
  );
}
