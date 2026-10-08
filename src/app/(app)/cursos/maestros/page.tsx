import { type Metadata } from 'next';
import { type ReactNode } from 'react';

import { AppCursosMaestrosView } from '@/views/app-cursos-maestros';

import {
  filterCourses,
  parseCourseQuery,
  type RawSearchParams,
} from '@/features/course-search';

import { type CourseProgress } from '@/entities/course';
import {
  listCourses,
  progressByCourse,
  requestedCategories,
} from '@/entities/course/server';
import { hasActiveSubscription } from '@/entities/subscription/server';

import { currentUser } from '@/shared/api/supabase/server';

export const metadata: Metadata = { title: 'Cursos maestros · El Charcu' };

interface MaestrosPageProps {
  readonly searchParams: Promise<RawSearchParams>;
}

export default async function MaestrosPage({
  searchParams,
}: MaestrosPageProps): Promise<ReactNode> {
  const userId = (await currentUser())?.id ?? null;

  const [params, courses, progress, isSubscribed, requested] = await Promise.all([
    searchParams,
    listCourses(),
    userId === null ? new Map<string, CourseProgress>() : progressByCourse(userId),
    userId === null ? false : hasActiveSubscription(userId),
    requestedCategories(),
  ]);

  // Aquí solo se buscan y filtran los cursos; ni categoría ni técnica.
  const query = { ...parseCourseQuery(params), categories: [], techniques: [] };
  const masters = courses.filter((c) => c.kind === 'curso' && c.status !== 'borrador');

  return (
    <AppCursosMaestrosView
      query={query}
      all={masters}
      visible={filterCourses(masters, query)}
      progress={progress}
      requested={requested}
      isSubscribed={isSubscribed}
      isSignedIn={userId !== null}
    />
  );
}
