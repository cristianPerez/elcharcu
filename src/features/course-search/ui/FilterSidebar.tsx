'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { startTransition, useOptimistic, type ReactNode } from 'react';

import { cn } from '@/shared/lib';

import { filterGroups } from '../model/filterOptions';
import { courseSearchHref, hasFilters, type CourseQuery } from '../model/searchParams';

interface FilterSidebarProps {
  readonly query: CourseQuery;
  readonly className?: string | undefined;
}

/**
 * Los filtros de escritorio: casillas de verdad, agrupadas en `fieldset`.
 *
 * Marcar una casilla cambia la URL (`router.replace`, sin apilar historial por
 * cada casilla). "Limpiar filtros" deja el término buscado y quita el resto.
 */
export function FilterSidebar({ query, className }: FilterSidebarProps): ReactNode {
  const router = useRouter();
  // La casilla se marca en el mismo clic, sin esperar a que el servidor
  // devuelva la página filtrada; si la navegación falla, vuelve sola.
  const [shown, setShown] = useOptimistic(query);

  return (
    <aside
      aria-label="Filtros"
      className={cn('rounded-card border border-cocoa/10 bg-cream-white p-5', className)}
    >
      <div className="flex flex-col gap-6">
        {filterGroups(shown).map((group) => (
          <fieldset key={group.id}>
            <legend className="mb-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-brasa-tinta">
              {group.label}
            </legend>
            <ul>
              {group.options.map((option) => (
                <li key={option.id}>
                  <label className="flex min-h-11 cursor-pointer items-center gap-3 text-[15px] text-cocoa">
                    <input
                      type="checkbox"
                      checked={option.active}
                      onChange={() => {
                        startTransition(() => {
                          setShown(option.next);
                          router.replace(courseSearchHref(option.next), {
                            scroll: false,
                          });
                        });
                      }}
                      className="size-[18px] shrink-0 cursor-pointer rounded accent-forest"
                    />
                    {option.label}
                  </label>
                </li>
              ))}
            </ul>
          </fieldset>
        ))}
      </div>

      {hasFilters(shown) ? (
        <Link
          href={courseSearchHref({ q: query.q })}
          scroll={false}
          className="mt-4 inline-flex min-h-11 items-center text-sm font-semibold text-brasa-tinta hover:text-brasa-dark"
        >
          Limpiar filtros
        </Link>
      ) : null}
    </aside>
  );
}
