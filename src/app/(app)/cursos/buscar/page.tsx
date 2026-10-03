import { type Metadata } from 'next';
import { type ReactNode } from 'react';

import { AppBusquedaView } from '@/views/app-busqueda';

import {
  filterCourses,
  parseCourseQuery,
  type RawSearchParams,
} from '@/features/course-search';

import { capsuleSteps, type CourseProgress } from '@/entities/course';
import { listCourses, progressByCourse } from '@/entities/course/server';
import { hasActiveSubscription } from '@/entities/subscription/server';

import { currentUser } from '@/shared/api/supabase/server';

export const metadata: Metadata = { title: 'Buscar cursos · El Charcu' };

interface BuscarPageProps {
  readonly searchParams: Promise<RawSearchParams>;
}

export default async function BuscarPage({
  searchParams,
}: BuscarPageProps): Promise<ReactNode> {
  const userId = (await currentUser())?.id ?? null;

  const [params, courses, progress, isSubscribed] = await Promise.all([
    searchParams,
    listCourses(),
    userId === null ? new Map<string, CourseProgress>() : progressByCourse(userId),
    userId === null ? false : hasActiveSubscription(userId),
  ]);

  const query = parseCourseQuery(params);
  const found = filterCourses(courses, query);
  const allCapsules = courses.filter(
    (c) => c.kind === 'capsula' && c.status === 'publicado',
  );

  return (
    <AppBusquedaView
      query={query}
      courses={found.filter((c) => c.kind === 'curso')}
      capsules={found.filter((c) => c.kind === 'capsula')}
      steps={capsuleSteps(allCapsules, progress)}
      progress={progress}
      isSubscribed={isSubscribed}
    />
  );
}
