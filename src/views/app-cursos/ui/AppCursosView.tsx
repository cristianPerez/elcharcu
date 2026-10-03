import Link from 'next/link';
import { type ReactNode } from 'react';

import { AskCharcuCard } from '@/widgets/ask-charcu';
import {
  CapsuleRail,
  ContinueCourseCard,
  MasterCoursesStrip,
  TechniqueGrid,
  UpcomingCourses,
} from '@/widgets/course-home';

import { CourseSearchField, courseSearchHref } from '@/features/course-search';

import {
  COURSE_CATEGORIES,
  type ContinueCourse,
  type Course,
  type CourseProgress,
} from '@/entities/course';

import { appRoutes } from '@/shared/config';
import { Chip, ChipRow, IconSliders, PageTitle } from '@/shared/ui';

interface AppCursosViewProps {
  readonly capsules: readonly Course[];
  readonly masters: readonly Course[];
  readonly upcoming: readonly Course[];
  readonly progress: ReadonlyMap<string, CourseProgress>;
  readonly continueWith: ContinueCourse | null;
  /** El número de la siguiente lección en el orden del curso. */
  readonly continueLessonNumber: number | null;
  /** Los cursos con alguna actividad (de `lesson_progress`). */
  readonly touchedIds: ReadonlySet<string>;
  readonly isSubscribed: boolean;
}

/**
 * Primera pestaña: lo que el usuario vino a aprender (rediseño 2026-10).
 *
 * El orden sigue la maqueta y tiene su lógica: arriba lo que ya es suyo
 * ("Sigue donde ibas"), después la ruta gratis, y el catálogo al final. La
 * lista sale de la base y RLS decide qué entra: aquí no hay ni un `if` de
 * permisos (D12).
 */
export function AppCursosView({
  capsules,
  masters,
  upcoming,
  progress,
  continueWith,
  continueLessonNumber,
  touchedIds,
  isSubscribed,
}: AppCursosViewProps): ReactNode {
  return (
    <div className="reveal flex flex-col gap-9 md:gap-12">
      <div className="flex flex-col gap-5">
        <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
          <PageTitle>Mis cursos</PageTitle>
          <div className="flex gap-2.5 md:w-[420px]">
            <CourseSearchField className="flex-1" />
            <Link
              href={appRoutes.appCoursesSearch}
              aria-label="Filtrar cursos"
              className="grid size-[52px] shrink-0 place-items-center rounded-full bg-forest text-cream-white md:hidden"
            >
              <IconSliders size={20} />
            </Link>
          </div>
        </div>

        <ChipRow label="Categorías">
          <li>
            <Chip href={appRoutes.appCourses} active>
              Todos
            </Chip>
          </li>
          {COURSE_CATEGORIES.map((category) => (
            <li key={category.id}>
              <Chip href={courseSearchHref({ categories: [category.id] })}>
                {category.label}
              </Chip>
            </li>
          ))}
        </ChipRow>
      </div>

      {/*
        Con un curso en marcha, en escritorio "Pregúntale" va a su lado. Sin él,
        no se estira a todo el ancho: baja al pie, como en el celular.
      */}
      {continueWith === null ? null : (
        <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_400px]">
          <ContinueCourseCard
            slug={continueWith.course.slug}
            title={continueWith.course.title}
            coverUrl={continueWith.course.coverUrl}
            nextLessonHref={
              continueWith.progress.nextLessonId === null
                ? `/cursos/${continueWith.course.slug}`
                : `/cursos/${continueWith.course.slug}/${continueWith.progress.nextLessonId}`
            }
            nextLessonNumber={
              continueLessonNumber ?? continueWith.progress.doneLessons + 1
            }
            totalLessons={continueWith.progress.totalLessons}
            percent={continueWith.progress.percent}
          />
          <AskCharcuCard variant="panel" className="hidden lg:flex" />
        </div>
      )}

      <CapsuleRail capsules={capsules} progress={progress} touchedIds={touchedIds} />

      {/*
        Una sola copia de cada bloque, reordenada con CSS: en el celular va
        técnica → cursos → próximos; en escritorio los cursos suben a ancho
        completo y técnica y próximos quedan lado a lado.
      */}
      <div className="grid gap-9 md:gap-12 lg:grid-cols-2 lg:gap-x-10">
        <div className="lg:order-2">
          <TechniqueGrid />
        </div>
        <div className="lg:order-1 lg:col-span-2">
          <MasterCoursesStrip courses={masters} progress={progress} />
        </div>
        <div className="lg:order-3">
          <UpcomingCourses courses={upcoming} isSubscribed={isSubscribed} />
        </div>
      </div>

      <AskCharcuCard
        variant="quiet"
        className={continueWith === null ? undefined : 'lg:hidden'}
      />
    </div>
  );
}
