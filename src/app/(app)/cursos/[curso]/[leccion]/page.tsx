import { type Metadata } from 'next';
import { notFound, redirect } from 'next/navigation';
import { type ReactNode } from 'react';

import { AppLeccionView } from '@/views/app-leccion';

import { type CourseWithModules, type Lesson } from '@/entities/course';
import { completedLessonIds, findCourse } from '@/entities/course/server';

import { currentUser } from '@/shared/api/supabase/server';
import { appRoutes } from '@/shared/config';

interface PageProps {
  readonly params: Promise<{
    readonly curso: string;
    readonly leccion: string;
  }>;
}

/**
 * Todas las lecciones del curso en el orden en que se ven.
 *
 * Aplanar módulo a módulo es lo que permite que "siguiente" salte al primer
 * paso del módulo de al lado en vez de morir al final de cada uno. Un curso
 * que obliga a volver al índice cada tres lecciones no se termina.
 */
function flatten(course: CourseWithModules): readonly Lesson[] {
  return course.modules.flatMap((module) => module.lessons);
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { curso, leccion } = await params;
  const course = await findCourse(curso);
  const lesson =
    course === null ? undefined : flatten(course).find((l) => l.id === leccion);

  return lesson === undefined
    ? { title: 'Lección · El Charcu' }
    : { title: `${lesson.title} · El Charcu` };
}

export default async function LeccionPage({ params }: PageProps): Promise<ReactNode> {
  const { curso, leccion } = await params;
  const course = await findCourse(curso);

  if (course === null) {
    notFound();
  }

  /*
    El índice de un curso cerrado SÍ se ve, así que desde el 2026-08-21 esta
    página puede recibir una lección que existe pero que esta persona no tiene
    pagada. Aquí es donde aparece el muro: se manda a la página de precios, no
    a un 404. Decirle "no existe" a algo que acaba de ver en el índice es una
    mentira que además no vende nada.

    Esto no es LA puerta —la puerta es RLS, que no entrega ni el video ni el
    texto—; es solo dónde aterriza quien la toca.
  */
  if (course.isLocked) {
    redirect(appRoutes.subscription);
  }

  const lessons = flatten(course);
  const index = lessons.findIndex((l) => l.id === leccion);
  const lesson = lessons[index];

  if (lesson === undefined) {
    notFound();
  }

  const userId = (await currentUser())?.id ?? null;
  const completed =
    userId === null ? new Set<string>() : await completedLessonIds(userId);

  const moduleTitle =
    course.modules.find((m) => m.id === lesson.moduleId)?.title ?? course.title;

  return (
    <AppLeccionView
      course={course}
      lesson={lesson}
      moduleTitle={moduleTitle}
      isDone={completed.has(lesson.id)}
      previousId={lessons[index - 1]?.id ?? null}
      nextId={lessons[index + 1]?.id ?? null}
      step={`${index + 1} de ${lessons.length}`}
    />
  );
}
