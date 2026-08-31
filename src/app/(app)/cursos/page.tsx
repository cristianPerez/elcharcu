import { type Metadata } from 'next';
import { type ReactNode } from 'react';

import { AppCursosView } from '@/views/app-cursos';

import { type CourseProgress } from '@/entities/course';
import { listCourses, progressByCourse } from '@/entities/course/server';

import { currentUser } from '@/shared/api/supabase/server';

export const metadata: Metadata = { title: 'Mis cursos · El Charcu' };

export default async function CursosPage(): Promise<ReactNode> {
  // Sin viaje extra: el layout ya preguntó quién es y `currentUser()` está
  // deduplicado dentro de la misma petición.
  const userId = (await currentUser())?.id ?? null;

  // Las dos consultas a la vez: son independientes y encadenarlas solo suma
  // espera en un celular con mala señal.
  const [courses, progress] = await Promise.all([
    listCourses(),
    userId === null ? new Map<string, CourseProgress>() : progressByCourse(userId),
  ]);

  return <AppCursosView courses={courses} progress={progress} />;
}
