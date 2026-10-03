import { type ReactNode } from 'react';

import { WaitlistButton } from '@/features/join-waitlist';

import {
  CourseCard,
  courseCardVariant,
  lessonCountLabel,
  type Course,
  type CourseProgress,
} from '@/entities/course';

import { Highlight } from '@/shared/ui';

interface CourseResultCardProps {
  readonly course: Course;
  readonly progress: CourseProgress | undefined;
  readonly term: string;
  readonly isSubscribed: boolean;
}

/** Un curso dentro de una búsqueda: con el término resaltado en el título. */
export function CourseResultCard({
  course,
  progress,
  term,
  isSubscribed,
}: CourseResultCardProps): ReactNode {
  const variant = courseCardVariant(course, progress);
  const isWaiting = variant === 'proximo' || variant === 'te-avisamos';

  return (
    <CourseCard
      slug={course.slug}
      title={<Highlight text={course.title} term={term} />}
      plainTitle={course.title}
      coverUrl={course.coverUrl}
      variant={variant}
      layout="responsive"
      className="h-full"
      progress={
        variant === 'en-curso' && progress !== undefined
          ? { done: progress.doneLessons, total: progress.totalLessons }
          : undefined
      }
      meta={
        isWaiting || variant === 'en-curso'
          ? undefined
          : (lessonCountLabel(progress) ?? undefined)
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
        ) : undefined
      }
    />
  );
}
