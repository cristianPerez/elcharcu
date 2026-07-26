'use client';

import Link from 'next/link';
import { type ReactNode, useMemo, useState } from 'react';

import { RecipeCard, type RecipeSummary } from '@/entities/recipe';

import { Container, Eyebrow, SearchBar } from '@/shared/ui';

interface RecipeSearchProps {
  readonly recipes: readonly RecipeSummary[];
}

/** Buscador de recetas: SearchBar + grid de RecipeCard filtrado en cliente. */
export function RecipeSearch({ recipes }: RecipeSearchProps): ReactNode {
  const [query, setQuery] = useState('');

  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase();
    if (!needle) {
      return recipes;
    }
    return recipes.filter((recipe) =>
      `${recipe.name} ${recipe.description}`.toLowerCase().includes(needle),
    );
  }, [query, recipes]);

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
        </Container>
      </section>

      <section className="bg-cream py-8 md:py-12">
        <Container>
          {filtered.length === 0 ? (
            <p className="text-sm text-cocoa/50">
              No encontramos recetas para “{query}”.
            </p>
          ) : (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-6 lg:grid-cols-3">
              {filtered.map((recipe) => (
                <Link
                  key={recipe.slug}
                  href={`/recetas/${recipe.slug}`}
                  className="text-inherit no-underline"
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
