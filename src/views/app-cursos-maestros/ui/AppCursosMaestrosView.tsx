import Link from 'next/link';
import { type ReactNode } from 'react';

import { MasterCatalog } from '@/widgets/master-catalog';

import {
  CourseSearchField,
  courseSearchHref,
  type CourseQuery,
} from '@/features/course-search';
import { ProposeCourse } from '@/features/request-course';

import { type Course, type CourseCategory, type CourseProgress } from '@/entities/course';

import { appRoutes } from '@/shared/config';
import { IconArrowLeft, PageTitle, SegmentedControl } from '@/shared/ui';

interface AppCursosMaestrosViewProps {
  readonly query: CourseQuery;
  readonly all: readonly Course[];
  readonly visible: readonly Course[];
  readonly progress: ReadonlyMap<string, CourseProgress>;
  readonly requested: ReadonlySet<CourseCategory>;
  readonly isSubscribed: boolean;
}

type View = 'todos' | 'disponibles' | 'proximos';

function currentView(query: CourseQuery): View {
  if (query.states.length !== 1) {
    return 'todos';
  }
  return query.states[0] === 'proximos' ? 'proximos' : 'disponibles';
}

/**
 * "Ver todos" de los cursos maestros (rediseño 2026-10).
 *
 * Usa los mismos parámetros que la búsqueda (`?q=&estado=`) pero sobre su
 * propia ruta. En escritorio, migas de pan en vez de botón de atrás.
 */
export function AppCursosMaestrosView({
  query,
  all,
  visible,
  progress,
  requested,
  isSubscribed,
}: AppCursosMaestrosViewProps): ReactNode {
  const base = appRoutes.appMasterCourses;
  const view = currentView(query);
  const total = visible.length;

  return (
    <div className="reveal flex flex-col gap-6 md:gap-8">
      <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
        <div>
          <nav aria-label="Migas de pan" className="mb-6 hidden text-sm md:block">
            <ol className="flex items-center gap-1.5">
              <li>
                <Link
                  href={appRoutes.appCourses}
                  className="font-semibold text-brasa-tinta hover:text-brasa-dark"
                >
                  Mis cursos
                </Link>
              </li>
              <li aria-hidden="true" className="text-cocoa-muted">
                /
              </li>
              <li aria-current="page" className="text-cocoa-soft">
                Cursos maestros
              </li>
            </ol>
          </nav>
          <div className="flex items-center gap-1">
            <Link
              href={appRoutes.appCourses}
              aria-label="Volver a Mis cursos"
              className="-ml-3 grid size-11 place-items-center rounded-full text-forest hover:bg-cream-white md:hidden"
            >
              <IconArrowLeft size={22} />
            </Link>
            <PageTitle>Cursos maestros</PageTitle>
          </div>
        </div>

        <div className="flex flex-col gap-3 md:w-[480px]">
          <CourseSearchField
            query={query}
            live
            basePath={base}
            label="Buscar en cursos maestros"
            placeholder="Buscar en cursos maestros"
          />
          <SegmentedControl
            label="Qué cursos ver"
            activeId={view}
            className="md:self-start"
            segments={[
              {
                id: 'todos',
                label: 'Todos',
                href: courseSearchHref({ q: query.q }, base),
              },
              {
                id: 'disponibles',
                label: 'Disponibles',
                href: courseSearchHref({ q: query.q, states: ['disponibles'] }, base),
              },
              {
                id: 'proximos',
                label: 'Próximos',
                href: courseSearchHref({ q: query.q, states: ['proximos'] }, base),
              },
            ]}
          />
        </div>
      </div>

      <p role="status" className="text-sm text-cocoa-soft">
        {total === 1 ? '1 curso' : `${String(total)} cursos`} · ordenados por categoría
      </p>

      <MasterCatalog
        all={all}
        visible={visible}
        progress={progress}
        requested={requested}
        isSubscribed={isSubscribed}
      />

      <ProposeCourse />
    </div>
  );
}
