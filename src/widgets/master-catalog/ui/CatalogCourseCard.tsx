import { type ReactNode } from 'react';

import { WaitlistButton } from '@/features/join-waitlist';

import {
  CourseCard,
  courseCardVariant,
  lessonCountLabel,
  type Course,
  type CourseProgress,
} from '@/entities/course';

import { IconArrowRight } from '@/shared/ui';

interface CatalogCourseCardProps {
  readonly course: Course;
  readonly progress: CourseProgress | undefined;
  readonly isSubscribed: boolean;
}

/** La llamada de abajo. No es un enlace: la tarjeta entera ya lo es. */
function Cue({ children }: { readonly children: string }): ReactNode {
  return (
    <span className="inline-flex min-h-8 items-center gap-1 text-sm font-semibold text-brasa-tinta">
      {children}
      <IconArrowRight size={15} strokeWidth={2} />
    </span>
  );
}

/** Un curso dentro de "Cursos maestros", con la llamada que le toca. */
export function CatalogCourseCard({
  course,
  progress,
  isSubscribed,
}: CatalogCourseCardProps): ReactNode {
  const variant = courseCardVariant(course, progress);
  const isWaiting = variant === 'proximo' || variant === 'te-avisamos';

  return (
    <CourseCard
      slug={course.slug}
      title={course.title}
      plainTitle={course.title}
      coverUrl={course.coverUrl}
      variant={variant}
      className="h-full"
      meta={
        isWaiting
          ? 'Aún no está grabado'
          : variant === 'en-curso'
            ? undefined
            : (lessonCountLabel(progress) ?? undefined)
      }
      progress={
        variant === 'en-curso' && progress !== undefined
          ? { done: progress.doneLessons, total: progress.totalLessons }
          : undefined
      }
      action={
        isWaiting ? (
          <WaitlistButton
            variant="link"
            courseId={course.id}
            courseSlug={course.slug}
            courseTitle={course.title}
            initiallyJoined={course.isInWaitlist}
            canJoin={isSubscribed}
          />
        ) : (
          <Cue>
            {variant === 'en-curso'
              ? 'Continuar'
              : variant === 'gratis'
                ? 'Empezar'
                : 'Ver curso'}
          </Cue>
        )
      }
    />
  );
}
