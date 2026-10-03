import { type ReactNode } from 'react';

import { AskCharcuCard } from '@/widgets/ask-charcu';

import { type CapsuleStep, type Course, type CourseProgress } from '@/entities/course';

import { CapsuleResults } from './CapsuleResults';
import { CourseResultCard } from './CourseResultCard';

interface SearchResultsProps {
  readonly courses: readonly Course[];
  readonly capsules: readonly Course[];
  readonly steps: ReadonlyMap<
    string,
    { readonly position: number; readonly state: CapsuleStep }
  >;
  readonly progress: ReadonlyMap<string, CourseProgress>;
  readonly term: string;
  readonly isSubscribed: boolean;
}

function GroupTitle({
  id,
  children,
}: {
  readonly id: string;
  readonly children: string;
}): ReactNode {
  return (
    <h2 id={id} className="mb-3 font-serif text-[19px] font-semibold text-forest">
      {children}
    </h2>
  );
}

/**
 * Los resultados, agrupados en Cursos y Cápsulas, y al final la salida al
 * asistente con lo buscado ya escrito.
 */
export function SearchResults({
  courses,
  capsules,
  steps,
  progress,
  term,
  isSubscribed,
}: SearchResultsProps): ReactNode {
  return (
    <div className="flex flex-col gap-8">
      {courses.length === 0 ? null : (
        <section aria-labelledby="results-courses">
          <GroupTitle id="results-courses">Cursos</GroupTitle>
          <ul className="grid gap-3 md:grid-cols-[repeat(auto-fill,minmax(200px,1fr))] md:gap-4">
            {courses.map((course) => (
              <li key={course.id}>
                <CourseResultCard
                  course={course}
                  progress={progress.get(course.id)}
                  term={term}
                  isSubscribed={isSubscribed}
                />
              </li>
            ))}
          </ul>
        </section>
      )}

      <div className="grid gap-8 lg:grid-cols-2 lg:items-end lg:gap-5">
        {capsules.length === 0 ? null : (
          <section aria-labelledby="results-capsules">
            <GroupTitle id="results-capsules">Cápsulas gratis</GroupTitle>
            <CapsuleResults capsules={capsules} steps={steps} term={term} />
          </section>
        )}
        <AskCharcuCard
          variant="brand"
          query={term}
          className={capsules.length === 0 ? 'lg:col-span-2' : 'h-full'}
        />
      </div>
    </div>
  );
}
