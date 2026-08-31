import Link from 'next/link';
import { type ReactNode } from 'react';

import { CourseOutline } from '@/widgets/course-outline';

import { type CourseProgress, type CourseWithModules } from '@/entities/course';

import { appRoutes } from '@/shared/config';
import { IconChevron, IconLock, Reveal } from '@/shared/ui';

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

  /*
    Lo calcula `findCourse` preguntándole a RLS, no la pantalla. Aquí solo se
    pinta: con el curso cerrado el índice SE VE igual —los títulos salen de
    `course_outline`, sin video ni texto detrás— y el muro aparece al intentar
    abrir una lección. Enseñar la tabla de contenidos es lo que da ganas de
    pagar; un candado sin nada detrás solo frustra.
  */
  const isLocked = course.isLocked;

  /*
    ⚠️ CERRADO NO ES LO MISMO QUE NO GRABADO, y confundirlos le decía a un
    suscriptor que pagara.

    `isLocked` sale de RLS y es `true` en los DOS casos: cuando falta pagar y
    cuando el curso está en lista de espera —ahí `can_read_course()` exige
    `status = 'publicado'`, así que no se abre para nadie, ni para quien paga—.
    La ficha pintaba el mismo cartel para ambos: "Con El Charcu Pro se te abre
    este curso". A un Pro mirando un curso sin grabar eso es doblemente falso:
    ya pagó, y pagar no lo abriría.

    `CourseRow` ya separaba los dos estados en el listado; esta pantalla no.
  */
  const isWaiting = course.status === 'lista-de-espera';
  const needsSubscription = isLocked && !isWaiting;

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

      {isWaiting ? (
        <Reveal delay={0.06}>
          {/* Sin candado ni botón de pagar: no hay nada que comprar todavía.
              Se dice la verdad y se enseña el temario, que es lo que hay. */}
          <section className="border-cocoa/12 mt-6 rounded-2xl border bg-cream p-5">
            <h2 className="font-medium text-forest">Todavía no está grabado</h2>
            <p className="mt-2 text-base leading-relaxed text-cocoa/70">
              Este es el temario que va a tener. Se está preparando; cuando esté listo
              aparece aquí completo.
            </p>
          </section>
        </Reveal>
      ) : null}

      {needsSubscription ? (
        <Reveal delay={0.06}>
          <section className="mt-6 rounded-2xl border border-terracota/25 bg-terracota/5 p-5">
            <div className="flex items-center gap-2">
              <IconLock size={18} className="text-terracota-dark" />
              <h2 className="font-medium text-forest">Este curso es de El Charcu Pro</h2>
            </div>
            <p className="mt-3 text-base leading-relaxed text-cocoa/70">
              Mira abajo todo lo que trae. Con El Charcu Pro se te abre este curso y todos
              los demás, y el asistente pasa de 8 preguntas al mes a 200.
            </p>
            <Link
              href={appRoutes.subscription}
              className="mt-5 flex items-center justify-center gap-1 rounded-full bg-terracota-dark px-6 py-3 font-medium text-cream-white shadow-surface transition-transform active:scale-[0.98]"
            >
              Ver la membresía
              <IconChevron size={16} />
            </Link>
          </section>
        </Reveal>
      ) : null}

      {/*
        Bloqueado: ni progreso ni "empezar el curso". `course_progress` es
        `security definer` y cuenta las lecciones saltándose RLS, así que
        devuelve 13 aunque no puedas ver ninguna — y el botón llevaría a una
        lección que la base no va a entregar. Un botón que no lleva a ninguna
        parte es peor que no tener botón.
      */}
      {!isLocked && total > 0 ? (
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

      <Reveal delay={0.1}>
        <section className="mt-8">
          <h2 className="mb-3 text-sm font-medium text-cocoa/65">Contenido</h2>
          <CourseOutline
            courseSlug={course.slug}
            modules={course.modules}
            completedIds={completedIds}
            openModuleId={openModuleId}
            isLocked={isLocked}
            isWaiting={isWaiting}
          />
        </section>
      </Reveal>
    </>
  );
}
