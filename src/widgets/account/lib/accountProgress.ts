import {
  isFinished,
  isInProgress,
  type Course,
  type CourseProgress,
} from '@/entities/course';
import { type RecipeCounts } from '@/entities/recipe-chat/server';

import { type AccountProgress } from '../ui/ProgressSummary';

/**
 * "Tu avance", contado de datos reales: cursos a medias, cápsulas terminadas
 * de las publicadas, y conversaciones en marcha y terminadas.
 */
export function accountProgress(
  courses: readonly Course[],
  progress: ReadonlyMap<string, CourseProgress>,
  recipes: RecipeCounts,
): AccountProgress {
  const published = courses.filter((c) => c.status === 'publicado');
  const capsules = published.filter((c) => c.kind === 'capsula');
  const inProgress = published.filter(
    (c) => c.kind === 'curso' && isInProgress(progress.get(c.id)),
  );
  const only = inProgress.length === 1 ? inProgress[0] : undefined;

  return {
    coursesInProgress: inProgress.length,
    courseDetail:
      only === undefined
        ? null
        : `${only.title} ${String(progress.get(only.id)?.percent ?? 0)}%`,
    capsulesDone: capsules.filter((c) => isFinished(progress.get(c.id))).length,
    capsulesTotal: capsules.length,
    recipesActive: recipes.active,
    recipesFinished: recipes.finished,
  };
}
