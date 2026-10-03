import { type ReactNode } from 'react';

import { WaitlistButton } from '@/features/join-waitlist';

import { categoryLabel, type Course } from '@/entities/course';

import { CoverPanel, SectionHeader, coverToneFor } from '@/shared/ui';

interface UpcomingCoursesProps {
  readonly courses: readonly Course[];
  /** Si quien mira paga: solo así se apunta (0021); si no, ve la invitación. */
  readonly isSubscribed: boolean;
}

/** "Próximamente": los cursos en lista de espera, con su "Avísame". */
export function UpcomingCourses({
  courses,
  isSubscribed,
}: UpcomingCoursesProps): ReactNode {
  if (courses.length === 0) {
    return null;
  }

  return (
    <section aria-labelledby="upcoming-title">
      <SectionHeader id="upcoming-title" title="Próximamente" />
      <ul className="mt-4 divide-y divide-cocoa/10 overflow-hidden rounded-card border border-cocoa/10 bg-cream-white">
        {courses.map((course) => (
          <li key={course.id} className="flex items-center gap-3 px-4 py-3">
            <CoverPanel
              title={course.title}
              imageUrl={course.coverUrl}
              tone={coverToneFor(course.slug)}
              size="xs"
              className="size-10 shrink-0 rounded-lg"
            />
            <div className="min-w-0 flex-1">
              <p className="text-[15px] font-semibold leading-snug text-cocoa">
                {course.title}
              </p>
              {course.category === null ? null : (
                <p className="text-[13px] text-cocoa-soft">
                  {categoryLabel(course.category)} · En preparación
                </p>
              )}
            </div>
            <WaitlistButton
              courseId={course.id}
              courseSlug={course.slug}
              courseTitle={course.title}
              initiallyJoined={course.isInWaitlist}
              canJoin={isSubscribed}
            />
          </li>
        ))}
      </ul>
    </section>
  );
}
