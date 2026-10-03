import { type ReactNode } from 'react';

import { RequestCategoryButton } from '@/features/request-course';

import {
  COURSE_CATEGORIES,
  type Course,
  type CourseCategory,
  type CourseProgress,
} from '@/entities/course';

import { cn } from '@/shared/lib';
import { EmptyState } from '@/shared/ui';

import { CatalogCourseCard } from './CatalogCourseCard';

interface MasterCatalogProps {
  /** Todos los cursos maestros: decide qué categorías están vacías de verdad. */
  readonly all: readonly Course[];
  /** Los que quedan tras buscar y filtrar: lo que se pinta. */
  readonly visible: readonly Course[];
  readonly progress: ReadonlyMap<string, CourseProgress>;
  readonly requested: ReadonlySet<CourseCategory>;
  readonly isSubscribed: boolean;
}

/**
 * Los cursos maestros agrupados por categoría.
 *
 * Una categoría SIN NINGÚN curso se enseña igual, con su "Quiero un curso de…":
 * un hueco que pide es más útil que un hueco que se esconde. Pero si está vacía
 * solo porque el filtro la vació (Disponibles, una búsqueda), se esconde: decir
 * "todavía no hay cursos de chorizos" con cuatro en camino sería mentir.
 */
export function MasterCatalog({
  all,
  visible,
  progress,
  requested,
  isSubscribed,
}: MasterCatalogProps): ReactNode {
  const groups = COURSE_CATEGORIES.map((category) => ({
    ...category,
    total: all.filter((c) => c.category === category.id).length,
    courses: visible.filter((c) => c.category === category.id),
  })).filter((group) => group.total === 0 || group.courses.length > 0);

  return (
    <div className="grid gap-10 lg:grid-cols-2 lg:gap-x-8">
      {groups.map((group) => {
        const isWide = group.courses.length > 1;
        const headingId = `catalog-${group.id}`;

        return (
          <section
            key={group.id}
            aria-labelledby={headingId}
            className={cn(isWide && 'lg:col-span-2')}
          >
            <h2
              id={headingId}
              className="mb-4 flex items-baseline justify-between gap-3 md:justify-start"
            >
              <span className="font-serif text-[19px] font-semibold text-forest md:text-xl">
                {group.label}
              </span>
              <span className="text-sm text-cocoa-soft">
                <span aria-hidden="true" className="hidden md:inline">
                  ·{' '}
                </span>
                {group.courses.length}
                <span className="sr-only"> cursos</span>
              </span>
            </h2>

            {group.total === 0 ? (
              <EmptyState
                action={
                  <RequestCategoryButton
                    category={group.id}
                    label={group.label.toLowerCase()}
                    initiallyRequested={requested.has(group.id)}
                  />
                }
              >
                Todavía no hay cursos de {group.label.toLowerCase()}. El más pedido se
                graba primero.
              </EmptyState>
            ) : (
              <ul className="grid grid-cols-2 gap-3 md:grid-cols-[repeat(auto-fill,minmax(240px,1fr))] md:gap-5">
                {group.courses.map((course) => (
                  <li key={course.id}>
                    <CatalogCourseCard
                      course={course}
                      progress={progress.get(course.id)}
                      isSubscribed={isSubscribed}
                    />
                  </li>
                ))}
              </ul>
            )}
          </section>
        );
      })}
    </div>
  );
}
