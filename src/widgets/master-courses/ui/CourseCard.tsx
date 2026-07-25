import { type ReactNode } from 'react';

import { type Course } from '../model/courses';

interface CourseCardProps {
  readonly course: Course;
}

/** Fila de curso con calificación de la Academia. */
export function CourseCard({ course }: CourseCardProps): ReactNode {
  return (
    <article className="flex items-start justify-between gap-6 border-b border-cream/15 py-6 last:border-b-0">
      <div>
        <h3 className="font-serif text-xl font-semibold text-cream">{course.name}</h3>
        <p className="mt-2 max-w-md text-sm leading-relaxed text-cream/60">
          {course.description}
        </p>
      </div>
      <div className="flex shrink-0 items-center gap-1 rounded-full bg-cream/10 px-3 py-1.5">
        <span aria-hidden className="text-terracota">
          ★
        </span>
        <span className="text-sm font-medium text-cream">{course.rating}</span>
      </div>
    </article>
  );
}
