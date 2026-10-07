import { type Metadata } from 'next';
import { type ReactNode } from 'react';

import { AppCursosView } from '@/views/app-cursos';
import { PublicCursosView } from '@/views/public-cursos';

import { pickContinueCourse, type CourseProgress } from '@/entities/course';
import {
  lessonNumberIn,
  listCourses,
  progressByCourse,
  publicCatalog,
  recentCourseIds,
} from '@/entities/course/server';
import { hasActiveSubscription } from '@/entities/subscription/server';

import { currentUser } from '@/shared/api/supabase/server';

/**
 * Cursos es el inicio (diseño final, 2026-10-07): sin sesión se ve la portada
 * pública; con sesión, el Mis cursos de siempre, sin cambios. Se decide AQUÍ,
 * en el servidor, así que no hay parpadeo de una versión a la otra.
 */
export async function generateMetadata(): Promise<Metadata> {
  return (await currentUser()) === null
    ? {
        title: 'El Charcu · Aprende charcutería artesanal en video',
        description:
          'Cursos maestros de chorizos, jamones y curados, con El Charcu a tu lado para cada duda. Empieza gratis con las cápsulas y el curso de lomo.',
        alternates: { canonical: '/cursos' },
      }
    : { title: 'Mis cursos · El Charcu' };
}

export default async function CursosPage(): Promise<ReactNode> {
  // Sin viaje extra: el layout ya preguntó quién es y `currentUser()` está
  // deduplicado dentro de la misma petición.
  const userId = (await currentUser())?.id ?? null;

  if (userId === null) {
    return <PublicCursosView catalog={await publicCatalog()} />;
  }

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

  const continueWith = pickContinueCourse(fullCourses, progress, recent);
  const nextId = continueWith?.progress.nextLessonId ?? null;
  const nextNumber =
    continueWith === null || nextId === null
      ? null
      : await lessonNumberIn(continueWith.course.slug, nextId);

  return (
    <AppCursosView
      capsules={capsules}
      masters={fullCourses.filter((course) => course.status === 'publicado')}
      upcoming={fullCourses.filter((course) => course.status === 'lista-de-espera')}
      progress={progress}
      continueWith={continueWith}
      continueLessonNumber={nextNumber}
      touchedIds={new Set(recent)}
      isSubscribed={isSubscribed}
    />
  );
}
