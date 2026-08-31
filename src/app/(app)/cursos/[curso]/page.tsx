import { type Metadata } from 'next';
import { notFound } from 'next/navigation';
import { type ReactNode } from 'react';

import { AppCursoView } from '@/views/app-curso';

import { type CourseProgress } from '@/entities/course';
import {
  completedLessonIds,
  findCourse,
  listCourses,
  progressByCourse,
} from '@/entities/course/server';

import { currentUser } from '@/shared/api/supabase/server';

interface PageProps {
  readonly params: Promise<{ readonly curso: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { curso } = await params;
  const course = await findCourse(curso);

  return course === null
    ? { title: 'Curso · El Charcu' }
    : { title: `${course.title} · El Charcu`, description: course.summary };
}

export default async function CursoPage({ params }: PageProps): Promise<ReactNode> {
  const { curso } = await params;
  const course = await findCourse(curso);

  // `null` es a la vez "no existe" y "no te toca": RLS no devuelve el curso de
  // pago a quien no paga. Se contesta lo mismo en los dos casos a propósito —
  // un 404 distinto del "no tienes acceso" delata qué cursos existen.
  if (course === null) {
    notFound();
  }

  const userId = (await currentUser())?.id ?? null;

  const [progressMap, completed] = await Promise.all([
    userId === null ? new Map<string, CourseProgress>() : progressByCourse(userId),
    userId === null ? new Set<string>() : completedLessonIds(userId),
  ]);

  const progress = progressMap.get(course.id);
  const nextLessonId = progress?.nextLessonId ?? null;

  /*
    La siguiente cápsula de la ruta, para ofrecerla al terminar esta.

    Terminar una cápsula dejaba un "Terminaste el curso. Ahora toca curar." y
    nada más: un callejón sin salida justo en el momento de más impulso. La
    ruta es secuencial, así que la siguiente es la del `position` que sigue.

    Solo aplica a CÁPSULAS. Un curso completo no forma parte de una ruta, y
    encadenarlo con otro sería inventarse un orden que no existe.

    `listCourses()` va con `cache()`, así que esto no añade un viaje si algo
    más de la misma petición ya lo pidió.
  */
  const nextCapsule =
    course.kind !== 'capsula'
      ? null
      : ((await listCourses())
          .filter((c) => c.kind === 'capsula')
          .sort((a, b) => a.position - b.position)
          .find((c) => c.position > course.position) ?? null);

  // El acordeón abre el módulo donde quedó, no el primero: abrir siempre el
  // primero obliga a buscar su sitio cada vez que vuelve.
  const openModuleId =
    course.modules.find((m) => m.lessons.some((l) => l.id === nextLessonId))?.id ?? null;

  return (
    <AppCursoView
      course={course}
      progress={progress}
      completedIds={[...completed]}
      openModuleId={openModuleId}
      nextCapsule={
        nextCapsule === null ? null : { slug: nextCapsule.slug, title: nextCapsule.title }
      }
    />
  );
}
