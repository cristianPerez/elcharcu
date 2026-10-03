import Link from 'next/link';
import { type ReactNode } from 'react';

import { AskCharcuCard } from '@/widgets/ask-charcu';
import { SearchResults } from '@/widgets/search-results';

import {
  activeLabels,
  courseSearchHref,
  CourseSearchField,
  FilterChips,
  FilterSidebar,
  hasFilters,
  type CourseQuery,
} from '@/features/course-search';

import { type CapsuleStep, type Course, type CourseProgress } from '@/entities/course';

import { appRoutes } from '@/shared/config';
import { EmptyState, IconArrowLeft } from '@/shared/ui';

interface AppBusquedaViewProps {
  readonly query: CourseQuery;
  readonly courses: readonly Course[];
  readonly capsules: readonly Course[];
  readonly steps: ReadonlyMap<
    string,
    { readonly position: number; readonly state: CapsuleStep }
  >;
  readonly progress: ReadonlyMap<string, CourseProgress>;
  readonly isSubscribed: boolean;
}

function summary(total: number, query: CourseQuery): ReactNode {
  const labels = activeLabels(query);
  const count = total === 1 ? '1 resultado' : `${String(total)} resultados`;
  return (
    <>
      {count}
      {query.q.trim() === '' ? null : (
        <>
          {' para '}
          <strong className="font-semibold text-cocoa">“{query.q.trim()}”</strong>
        </>
      )}
      {labels.length === 0 ? null : ` en ${labels.join(', ')}`}
    </>
  );
}

/**
 * La búsqueda de cursos (rediseño 2026-10).
 *
 * Todo el estado vive en la URL; esta vista solo compone. En el celular los
 * filtros son chips bajo el buscador; en escritorio, una columna a la izquierda.
 */
export function AppBusquedaView({
  query,
  courses,
  capsules,
  steps,
  progress,
  isSubscribed,
}: AppBusquedaViewProps): ReactNode {
  const total = courses.length + capsules.length;
  const term = query.q.trim();

  return (
    <div className="flex flex-col gap-5 md:gap-6">
      <h1 className="sr-only">Buscar cursos</h1>
      <div className="flex items-center gap-2 md:gap-4">
        <Link
          href={appRoutes.appCourses}
          aria-label="Volver a Mis cursos"
          className="grid size-11 shrink-0 place-items-center rounded-full text-forest hover:bg-cream-white md:hidden"
        >
          <IconArrowLeft size={22} />
        </Link>
        <Link
          href={appRoutes.appCourses}
          className="hidden min-h-11 shrink-0 items-center gap-1 text-sm font-semibold text-brasa-tinta hover:text-brasa-dark md:inline-flex"
        >
          <IconArrowLeft size={15} strokeWidth={2} />
          Mis cursos
        </Link>
        <CourseSearchField
          query={query}
          live
          autoFocus={term === '' && !hasFilters(query)}
          className="flex-1"
        />
      </div>

      <FilterChips query={query} className="md:hidden" />

      <div className="grid gap-6 md:grid-cols-[240px_minmax(0,1fr)] md:gap-8 lg:grid-cols-[300px_minmax(0,1fr)]">
        <FilterSidebar query={query} className="hidden self-start md:block" />

        <div className="flex min-w-0 flex-col gap-6">
          <p role="status" className="text-sm text-cocoa-soft">
            {summary(total, query)}
          </p>

          {total === 0 ? (
            <>
              <EmptyState
                action={
                  hasFilters(query) ? (
                    <Link
                      href={courseSearchHref({ q: query.q })}
                      className="inline-flex min-h-11 items-center rounded-full border border-forest px-5 text-sm font-semibold text-forest hover:bg-forest hover:text-cream-white"
                    >
                      Quitar los filtros
                    </Link>
                  ) : undefined
                }
              >
                Todavía no hay un curso de esto. El Charcu sí te puede ayudar con tu duda.
              </EmptyState>
              <AskCharcuCard variant="brand" query={term} />
            </>
          ) : (
            <SearchResults
              courses={courses}
              capsules={capsules}
              steps={steps}
              progress={progress}
              term={term}
              isSubscribed={isSubscribed}
            />
          )}
        </div>
      </div>
    </div>
  );
}
