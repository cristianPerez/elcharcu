'use client';

import Link from 'next/link';
import { useMemo, useState, type ReactNode } from 'react';

import { cn } from '@/shared/lib';

import { matches } from '../lib';
import { type CookbookCard } from '../model';

import { RecipeTile } from './RecipeTile';
import { SearchField } from './SearchField';

const PAGE = 12;

interface CookbookFullProps {
  readonly recipes: readonly CookbookCard[];
  readonly categories: readonly { readonly id: string; readonly label: string }[];
}

/**
 * El recetario completo, para Pro y Maestro (diseño final 10): buscador,
 * categorías, la etiqueta "Tiene curso" y "Cargar más". Solo lo recibe quien
 * paga: el servidor no le manda los slugs a nadie más.
 */
export function CookbookFull({ recipes, categories }: CookbookFullProps): ReactNode {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState<string | null>(null);
  const [shown, setShown] = useState(PAGE);

  const filtered = useMemo(
    () =>
      recipes.filter(
        (r) => matches(r.name, query) && (category === null || r.category === category),
      ),
    [recipes, query, category],
  );

  return (
    <section className="mx-auto max-w-app px-5 pt-6 md:px-8 md:pt-10">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="font-serif text-[30px] font-semibold text-forest md:text-[34px]">
            Recetario
          </h1>
          <p className="mt-1 text-sm text-cocoa-soft">
            {recipes.length} recetas · incluido en tu plan
          </p>
        </div>
        <SearchField
          value={query}
          onChange={(value) => {
            setQuery(value);
            setShown(PAGE);
          }}
          placeholder="Busca en el recetario: longaniza, salami, jamón…"
          className="md:w-[440px]"
        />
      </div>

      <div
        role="group"
        aria-label="Categorías"
        className="-mx-5 mt-5 flex gap-2 overflow-x-auto px-5 pb-1 [scrollbar-width:none] md:mx-0 md:flex-wrap md:px-0"
      >
        {[{ id: null, label: 'Todas' }, ...categories].map((item) => (
          <button
            key={item.id ?? 'todas'}
            type="button"
            aria-pressed={category === item.id}
            onClick={() => {
              setCategory(item.id);
              setShown(PAGE);
            }}
            className={cn(
              'min-h-11 shrink-0 rounded-full border px-4 text-sm',
              category === item.id
                ? 'border-forest bg-forest font-semibold text-cream-white'
                : 'border-cocoa/15 bg-cream-white text-cocoa',
            )}
          >
            {item.label}
          </button>
        ))}
        {/* Las tablas no son recetas del recetario: el chip lleva a su página. */}
        <Link
          href="/tablas"
          className="flex min-h-11 shrink-0 items-center rounded-full border border-cocoa/15 bg-cream-white px-4 text-sm text-cocoa"
        >
          Tablas
        </Link>
      </div>

      {filtered.length === 0 ? (
        <p className="mt-10 text-center text-cocoa-soft">No hay recetas con «{query}».</p>
      ) : (
        <ul className="mt-6 grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-5">
          {filtered.slice(0, shown).map((recipe) => (
            <li key={recipe.slug}>
              <RecipeTile
                name={recipe.name}
                image={recipe.image}
                eyebrow={recipe.categoryLabel}
                meta={recipe.origin}
                href={`/recetas/${recipe.slug}`}
                hasCourse={recipe.hasCourse}
              />
            </li>
          ))}
        </ul>
      )}

      {filtered.length > shown ? (
        <div className="mt-8 flex justify-center">
          <button
            type="button"
            onClick={() => setShown((value) => value + PAGE)}
            className="min-h-12 rounded-full border border-forest px-8 text-[15px] font-semibold text-forest hover:bg-cream-white"
          >
            Cargar más recetas
          </button>
        </div>
      ) : null}
    </section>
  );
}
