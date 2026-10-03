import { type Course, type CourseProgress } from '../model/course.types';

export type CourseCardVariant = 'gratis' | 'pro' | 'en-curso' | 'proximo' | 'te-avisamos';

/** Lo empezó y no lo terminó. */
export function isInProgress(progress: CourseProgress | undefined): boolean {
  return (
    progress !== undefined &&
    progress.doneLessons > 0 &&
    progress.doneLessons < progress.totalLessons
  );
}

export function isFinished(progress: CourseProgress | undefined): boolean {
  return (
    progress !== undefined &&
    progress.totalLessons > 0 &&
    progress.doneLessons === progress.totalLessons
  );
}

/**
 * Qué cara enseña la tarjeta de un curso.
 *
 * Sale de lo que ya dice la base —estado, acceso, si me apunté, cuánto llevo—
 * y no de un campo guardado: así no hay dos verdades que se desincronicen.
 */
export function courseCardVariant(
  course: Course,
  progress: CourseProgress | undefined,
): CourseCardVariant {
  if (course.status === 'lista-de-espera') {
    return course.isInWaitlist ? 'te-avisamos' : 'proximo';
  }
  if (isInProgress(progress)) {
    return 'en-curso';
  }
  return course.access === 'libre' ? 'gratis' : 'pro';
}

/** "7 lecciones", "1 lección". `null` si no se sabe cuántas son. */
export function lessonCountLabel(progress: CourseProgress | undefined): string | null {
  const total = progress?.totalLessons ?? 0;
  if (total === 0) {
    return null;
  }
  return total === 1 ? '1 lección' : `${String(total)} lecciones`;
}
