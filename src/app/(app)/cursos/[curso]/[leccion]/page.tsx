import { type Metadata } from 'next';
import { notFound } from 'next/navigation';
import { type ReactNode } from 'react';

import { AppLeccionView } from '@/views/app-leccion';

import { type CourseWithModules, type Lesson } from '@/entities/course';
import { completedLessonIds, findCourse } from '@/entities/course/server';

import { currentUser } from '@/shared/api/supabase/server';

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
