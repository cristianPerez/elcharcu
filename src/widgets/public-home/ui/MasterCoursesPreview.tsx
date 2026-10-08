import Link from 'next/link';
import { type ReactNode } from 'react';

import { categoryLabel, CourseCard, levelLabel, type Course } from '@/entities/course';

import { appRoutes } from '@/shared/config';

interface MasterCoursesPreviewProps {
  readonly courses: readonly Course[];
  readonly lessonsByCourse: Readonly<Record<string, number>>;
}

/** Cuántos cursos enseña la portada: una fila en escritorio, como en la 01. */
const PREVIEW_COUNT = 4;

function lessonsLabel(count: number): string | undefined {
  if (count === 0) {
    return undefined;
  }
  return count === 1 ? '1 lección' : `${String(count)} lecciones`;
}

/**
 * "Cursos maestros" de la portada sin cuenta (diseño final 01/02). Los
 * primeros por posición —el gratis va primero— y "Ver todos". El número de
 * lecciones sale de la base.
 */
export function MasterCoursesPreview({
  courses,
  lessonsByCourse,
}: MasterCoursesPreviewProps): ReactNode {
  if (courses.length === 0) {
    return null;
  }

  return (
    <section
      aria-labelledby="maestros-title"
      className="mx-auto w-full max-w-app px-5 md:px-8"
    >
      <div className="flex items-baseline justify-between gap-3">
        <div className="flex flex-col md:flex-row md:items-baseline md:gap-3">
          <h2
            id="maestros-title"
            className="font-serif text-2xl font-semibold text-forest"
          >
            Cursos maestros
          </h2>
          <p className="hidden text-sm text-cocoa-soft md:block">
            Una receta de principio a fin, en video
          </p>
        </div>
        <Link
          href={appRoutes.appMasterCourses}
          className="shrink-0 text-sm font-semibold text-brasa-tinta"
        >
          Ver todos →
        </Link>
      </div>
      <ul className="-mx-5 mt-4 flex snap-x scroll-px-5 gap-3 overflow-x-auto px-5 pb-1 [scrollbar-width:none] md:mx-0 md:grid md:grid-cols-4 md:gap-5 md:overflow-visible md:px-0 [&::-webkit-scrollbar]:hidden">
        {courses.slice(0, PREVIEW_COUNT).map((course) => {
          const isFree = course.access === 'libre';
          const eyebrow = [
            course.category === null ? null : categoryLabel(course.category),
            levelLabel(course.level),
          ]
            .filter((part): part is string => part !== null)
            .join(' · ');
          return (
            <li key={course.id} className="w-[262px] shrink-0 snap-start md:w-auto">
              <CourseCard
                slug={course.slug}
                title={course.title}
                plainTitle={course.title}
                coverUrl={course.coverUrl}
                variant={isFree ? 'gratis' : 'pro'}
                badgeLabel={isFree ? 'Gratis con cuenta' : undefined}
                eyebrow={eyebrow}
                summary={course.summary}
                meta={lessonsLabel(lessonsByCourse[course.id] ?? 0)}
                className="h-full"
              />
            </li>
          );
        })}
      </ul>
    </section>
  );
}
