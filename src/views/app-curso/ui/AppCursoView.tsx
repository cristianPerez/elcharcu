import Link from 'next/link';
import { type ReactNode } from 'react';

import { CourseOutline } from '@/widgets/course-outline';

import { type CourseProgress, type CourseWithModules } from '@/entities/course';

import { IconChevron, Reveal } from '@/shared/ui';

interface AppCursoViewProps {
  readonly course: CourseWithModules;
  readonly progress: CourseProgress | undefined;
  readonly completedIds: readonly string[];
  /** El módulo que se abre solo: el de la lección por la que iba. */
  readonly openModuleId: string | null;
}

/**
 * La pantalla de un curso: la portada y el índice.
 *
 * Lo primero que se ve arriba es el botón de continuar, no el índice. Quien
 * vuelve a un curso casi nunca viene a elegir: viene a seguir. Poner el índice
 * primero le obliga a buscar su sitio cada vez.
 */
export function AppCursoView({
  course,
  progress,
  completedIds,
  openModuleId,
}: AppCursoViewProps): ReactNode {
  const done = progress?.doneLessons ?? 0;
  const total = progress?.totalLessons ?? 0;
  const percent = progress?.percent ?? 0;
  const nextLessonId = progress?.nextLessonId ?? null;

  return (
    <>
      <Reveal>
        <header>
          <Link
            href="/cursos"
            className="flex items-center gap-1.5 text-sm font-medium text-terracota-dark"
          >
            <span aria-hidden="true">‹</span> Mis cursos
          </Link>
          <h1 className="mt-3 font-serif text-3xl font-semibold leading-tight text-forest">
            {course.title}
          </h1>
          <p className="mt-2 text-base leading-relaxed text-cocoa/70">{course.summary}</p>
        </header>
      </Reveal>

      {total > 0 ? (
        <Reveal delay={0.06}>
          <section className="mt-5 rounded-2xl border border-cocoa/10 bg-cream-white p-5 shadow-surface">
            <div className="flex items-baseline justify-between text-sm">
              <span className="text-cocoa/55">
                {done} de {total} lecciones
              </span>
              <span className="font-medium text-cocoa">{percent}%</span>
            </div>
            <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-cream">
              <div
                className="h-full rounded-full bg-sage transition-[width] duration-500"
                style={{ width: `${percent}%` }}
              />
            </div>

            {nextLessonId === null ? (
              <p className="mt-4 text-sm font-medium text-forest">
                Terminaste el curso. Ahora toca curar.
              </p>
            ) : (
              <Link
                href={`/cursos/${course.slug}/${nextLessonId}`}
                className="mt-4 flex items-center justify-center gap-1 rounded-full bg-terracota-dark px-6 py-3 font-medium text-cream-white shadow-surface transition-transform active:scale-[0.98]"
              >
                {done === 0 ? 'Empezar el curso' : 'Continuar'}
                <IconChevron size={16} />
              </Link>
            )}
          </section>
        </Reveal>
      ) : null}

      <Reveal delay={0.12}>
        <section className="mt-8">
          <h2 className="mb-3 text-sm font-medium text-cocoa/65">Contenido</h2>
          <CourseOutline
            courseSlug={course.slug}
            modules={course.modules}
            completedIds={completedIds}
            openModuleId={openModuleId}
          />
        </section>
      </Reveal>
    </>
  );
}
