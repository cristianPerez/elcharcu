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

export type CapsuleStep = 'completada' | 'actual' | 'bloqueada';

/**
 * El estado de cada cápsula dentro de su ruta: la actual es la primera sin
 * terminar; las de después, cerradas.
 *
 * Se calcula sobre la ruta ENTERA aunque se vayan a pintar solo algunas (una
 * búsqueda que devuelve la 4 y la 5 tiene que saber que la 3 no está hecha).
 */
export function capsuleSteps(
  capsules: readonly Course[],
  progress: ReadonlyMap<string, CourseProgress>,
): ReadonlyMap<string, { readonly position: number; readonly state: CapsuleStep }> {
  const currentIndex = capsules.findIndex((c) => !isFinished(progress.get(c.id)));

  return new Map(
    capsules.map((capsule, index) => [
      capsule.id,
      {
        position: index + 1,
        state: isFinished(progress.get(capsule.id))
          ? 'completada'
          : index === currentIndex
            ? 'actual'
            : 'bloqueada',
      },
    ]),
  );
}
