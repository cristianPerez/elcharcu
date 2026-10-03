import { type ReactNode } from 'react';

import {
  categoryLabel,
  CourseCard,
  courseCardVariant,
  lessonCountLabel,
  levelLabel,
  type Course,
  type CourseProgress,
} from '@/entities/course';

import { appRoutes } from '@/shared/config';
import { SectionHeader } from '@/shared/ui';

interface MasterCoursesStripProps {
  /** Solo los cursos publicados; los que esperan van en "Próximamente". */
  readonly courses: readonly Course[];
  readonly progress: ReadonlyMap<string, CourseProgress>;
}

/**
 * "Cursos maestros": carrusel en el celular, grilla en escritorio.
 *
 * Sale solo lo que hay en la base. Si hoy es un curso, es un curso: inventar
 * tarjetas para llenar la fila sería prometer algo que no está grabado.
 */
export function MasterCoursesStrip({
  courses,
  progress,
}: MasterCoursesStripProps): ReactNode {
  if (courses.length === 0) {
    return null;
  }

  return (
    <section aria-labelledby="masters-title">
      <SectionHeader
        id="masters-title"
        title="Cursos maestros"
        action={{ href: appRoutes.appMasterCourses, label: 'Ver todos' }}
      />
      <ul className="-mx-5 mt-4 flex snap-x scroll-px-5 gap-3 overflow-x-auto px-5 pb-1 [scrollbar-width:none] md:mx-0 md:grid md:grid-cols-[repeat(auto-fill,minmax(240px,1fr))] md:gap-5 md:overflow-visible md:px-0 [&::-webkit-scrollbar]:hidden">
        {courses.map((course) => {
          const p = progress.get(course.id);
          const variant = courseCardVariant(course, p);
          const count = lessonCountLabel(p);
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
                variant={variant}
                eyebrow={eyebrow}
                summary={course.summary}
                meta={[count, variant === 'en-curso' ? 'En curso' : null]
                  .filter((part): part is string => part !== null)
                  .join(' · ')}
                className="h-full"
              />
            </li>
          );
        })}
      </ul>
    </section>
  );
}
