'use client';

import Link from 'next/link';
import { type ReactNode, useEffect, useMemo, useState } from 'react';

import { TablaCard, type TablaSummary } from '@/entities/tabla';

import { cn, track } from '@/shared/lib';
import { Container, Eyebrow, SearchBar } from '@/shared/ui';

interface TablaSearchProps {
  readonly tablas: readonly TablaSummary[];
}

/** Buscador de tablas: SearchBar + filtro por etiquetas + grid de TablaCard. */
export function TablaSearch({ tablas }: TablaSearchProps): ReactNode {
  const [query, setQuery] = useState('');
  const [activeTags, setActiveTags] = useState<readonly string[]>([]);

  const allTags = useMemo(
    () =>
      [...new Set(tablas.flatMap((tabla) => tabla.tags))].sort((a, b) =>
        a.localeCompare(b, 'es'),
      ),
    [tablas],
  );

  const toggleTag = (tag: string): void => {
    setActiveTags((current) =>
      current.includes(tag) ? current.filter((item) => item !== tag) : [...current, tag],
    );
  };

  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return tablas.filter((tabla) => {
      const matchesText =
        !needle || `${tabla.name} ${tabla.description}`.toLowerCase().includes(needle);
      const matchesTags =
        activeTags.length === 0 || activeTags.some((tag) => tabla.tags.includes(tag));
      return matchesText && matchesTags;
    });
  }, [query, activeTags, tablas]);

  useEffect(() => {
    const trimmed = query.trim();
    if (!trimmed) {
      return undefined;
    }
    const timeout = setTimeout(() => {
      track('tabla_search', { query: trimmed, results_count: filtered.length });
    }, 500);
    return () => clearTimeout(timeout);
  }, [query, filtered]);

  return (
    <div>
      <section className="bg-grain bg-forest py-12 text-cream md:py-24">
        <Container>
          <Eyebrow className="text-sage">El Montaje</Eyebrow>
          <h1 className="mt-4 font-serif text-3xl font-semibold leading-tight md:text-4xl">
            Tablas que impresionan.
          </h1>
          <p className="mt-3 max-w-lg text-sm leading-relaxed text-cream/75 md:text-[15px]">
            Guías de armado paso a paso — quesos, embutidos y la técnica para lucir una
            tabla de autor, sin gastar de más.
          </p>
        </Container>
      </section>

      <section className="bg-cream pt-8 md:pt-10">
        <Container>
          <SearchBar
            value={query}
            onChange={setQuery}
            placeholder="Buscar tablas…"
            className="max-w-md"
          />
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
                    track('tabla_tag_filter_toggle', { tag, active: !isActive });
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

      <section className="bg-cream py-10 md:py-16">
        <Container>
          {filtered.length === 0 ? (
            <p className="text-sm text-cocoa/65">
              No encontramos tablas con esos filtros.
            </p>
          ) : (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-6 lg:grid-cols-3">
              {filtered.map((tabla) => (
                <Link
                  key={tabla.slug}
                  href={`/tablas/${tabla.slug}`}
                  className="text-inherit no-underline"
                  onClick={() => {
                    track('tabla_card_click', {
                      tabla_slug: tabla.slug,
                      tabla_name: tabla.name,
                      tags: tabla.tags.join(','),
                    });
                  }}
                >
                  <TablaCard tabla={tabla} />
                </Link>
              ))}
            </div>
          )}
        </Container>
      </section>
    </div>
  );
}
