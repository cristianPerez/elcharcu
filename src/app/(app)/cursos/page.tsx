import { type Metadata } from 'next';
import { type ReactNode } from 'react';

import { AppCursosView, type ContinueCourse } from '@/views/app-cursos';

import { isInProgress, type CourseProgress } from '@/entities/course';
import { listCourses, progressByCourse, recentCourseIds } from '@/entities/course/server';
import { hasActiveSubscription } from '@/entities/subscription/server';

import { currentUser } from '@/shared/api/supabase/server';

export const metadata: Metadata = { title: 'Mis cursos · El Charcu' };

export default async function CursosPage(): Promise<ReactNode> {
  // Sin viaje extra: el layout ya preguntó quién es y `currentUser()` está
  // deduplicado dentro de la misma petición.
  const userId = (await currentUser())?.id ?? null;

  // Todo a la vez: son independientes y encadenarlas solo suma espera en un
  // celular con mala señal.
  const [courses, progress, isSubscribed, recent] = await Promise.all([
    listCourses(),
    userId === null ? new Map<string, CourseProgress>() : progressByCourse(userId),
    userId === null ? false : hasActiveSubscription(userId),
    userId === null ? [] : recentCourseIds(userId),
  ]);

  const visible = courses.filter((course) => course.status !== 'borrador');
  const capsules = visible.filter((course) => course.kind === 'capsula');
  const fullCourses = visible.filter((course) => course.kind === 'curso');

  // "Sigue donde ibas": el curso tocado más hace menos que siga a medias.
  const continueWith = recent
    .map((id) => fullCourses.find((course) => course.id === id))
    .map((course): ContinueCourse | null => {
      const p = course === undefined ? undefined : progress.get(course.id);
      return course !== undefined && p !== undefined && isInProgress(p)
        ? { course, progress: p }
        : null;
    })
    .find((candidate): candidate is ContinueCourse => candidate !== null);

  return (
    <AppCursosView
      capsules={capsules}
      masters={fullCourses.filter((course) => course.status === 'publicado')}
      upcoming={fullCourses.filter((course) => course.status === 'lista-de-espera')}
      progress={progress}
      continueWith={continueWith ?? null}
      isSubscribed={isSubscribed}
    />
  );
}
