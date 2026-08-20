import Link from 'next/link';
import { type ReactNode } from 'react';

import { LessonBody, LessonNav } from '@/widgets/lesson-view';

import { CompleteLessonButton } from '@/features/lesson-progress';

import { type CourseWithModules, type Lesson } from '@/entities/course';

import { appRoutes } from '@/shared/config';
import { Reveal } from '@/shared/ui';

interface AppLeccionViewProps {
  readonly course: CourseWithModules;
  readonly lesson: Lesson;
  readonly moduleTitle: string;
  readonly isDone: boolean;
  readonly previousId: string | null;
  readonly nextId: string | null;
  /** "3 de 4" dentro del curso entero, no del módulo. */
  readonly step: string;
}

/**
 * Una lección: la barra de navegación, el contenido y la duda ya escrita.
 *
 * El botón de "Listo, siguiente" está ABAJO del todo a propósito: es lo último
 * que se toca. Y encima va la pregunta del paso, porque la duda aparece
 * mientras se lee, no después.
 */
export function AppLeccionView({
  course,
  lesson,
  moduleTitle,
  isDone,
  previousId,
  nextId,
  step,
}: AppLeccionViewProps): ReactNode {
  const courseHref = `/cursos/${course.slug}`;
  const hrefFor = (id: string | null): string | null =>
    id === null ? null : `${courseHref}/${id}`;

  return (
    <>
      <LessonNav
        courseHref={courseHref}
        courseTitle={course.title}
        moduleTitle={moduleTitle}
        previousHref={hrefFor(previousId)}
        nextHref={hrefFor(nextId)}
        step={step}
      />

      <Reveal>
        <header>
          <h1 className="font-serif text-2xl font-semibold leading-tight text-forest">
            {lesson.title}
          </h1>
          {/* En una lección de TEXTO el cuerpo ya es el contenido, y el
              resumen quedaría repitiendo su primer párrafo palabra por
              palabra. En video o PDF sí hace falta: dice de qué va antes de
              darle al play. */}
          {lesson.kind === 'texto' || lesson.summary === '' ? null : (
            <p className="mt-2 text-base leading-relaxed text-cocoa/70">
              {lesson.summary}
            </p>
          )}
        </header>
      </Reveal>

      <Reveal delay={0.06}>
        <div className="mt-5">
          <LessonBody lesson={lesson} />
        </div>
      </Reveal>

      {/* La duda de siempre, ya escrita. Es lo que une el curso con el
          asistente: en vez de terminar y quedarte con la pregunta, la
          pregunta es el siguiente botón. */}
      {lesson.ask === null ? null : (
        <Reveal delay={0.1}>
          <Link
            href={`${appRoutes.appAssistant}?pregunta=${encodeURIComponent(lesson.ask)}`}
            className="mt-5 block rounded-2xl border border-terracota/30 bg-terracota/5 p-4"
          >
            <span className="text-xs font-medium uppercase tracking-eyebrow text-terracota-dark">
              Pregúntale al maestro
            </span>
            <span className="mt-2 block text-base leading-relaxed text-cocoa">
              {lesson.ask}
            </span>
          </Link>
        </Reveal>
      )}

      <Reveal delay={0.14}>
        <div className="mt-8">
          <CompleteLessonButton
            lessonId={lesson.id}
            isDone={isDone}
            nextHref={hrefFor(nextId) ?? courseHref}
          />
          {isDone ? (
            <p className="mt-3 text-center text-xs text-cocoa/55">
              Esta lección ya la diste por vista.
            </p>
          ) : null}
        </div>
      </Reveal>
    </>
  );
}
