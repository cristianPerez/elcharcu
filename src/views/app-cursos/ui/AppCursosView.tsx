import { type ReactNode } from 'react';

import { CapsuleRow, CourseRow } from '@/widgets/course-list';

import { type Course, type CourseProgress } from '@/entities/course';

import { Reveal } from '@/shared/ui';

interface AppCursosViewProps {
  readonly courses: readonly Course[];
  readonly progress: ReadonlyMap<string, CourseProgress>;
}

/**
 * Primera pestaña: lo que el usuario vino a aprender.
 *
 * Dos bloques, y el orden importa (2026-08-29):
 *
 *   1. **Las cápsulas.** Cortas, gratis y en ruta. Es lo que se puede ver YA, y
 *      va arriba porque una pantalla que abre con cosas cerradas se lee como
 *      "aquí no hay nada para ti".
 *   2. **Los cursos.** Los grandes. Casi todos en lista de espera mientras se
 *      graban, con su temario visible y su barra de cuánta gente los espera.
 *
 * Esto reemplaza a la lista plana de antes, que enseñaba cinco cursos de pago
 * que nadie podía abrir —`subscriptions` está vacía— y ninguna cápsula. Era la
 * pantalla más vacía de la app justo en la pestaña que abre la app.
 *
 * La lista sigue saliendo de la base y RLS decide qué entra, así que aquí no
 * hay ni un `if` de permisos: no le toca decidir a la pantalla (D12).
 */
export function AppCursosView({ courses, progress }: AppCursosViewProps): ReactNode {
  const capsules = courses.filter((course) => course.kind === 'capsula');
  const rest = courses.filter((course) => course.kind === 'curso');

  /*
    Hasta dónde llega la ruta secuencial.

    Se abre la siguiente a la primera sin terminar. No se pregunta a la base
    lección por lección: `course_progress` ya trae cuántas van hechas de cada
    cápsula, y la regla de la ruta es la misma contada a nivel de cápsula.
    Quien de verdad aplica el candado es `can_open_lesson()` en Postgres — esto
    solo pinta lo que allá ya se decidió.
  */
  const firstUnfinished = capsules.findIndex((course) => {
    const p = progress.get(course.id);
    return p === undefined || p.totalLessons === 0 || p.doneLessons < p.totalLessons;
  });
  const openUntil = firstUnfinished === -1 ? capsules.length - 1 : firstUnfinished;

  const doneCount = capsules.filter((course) => {
    const p = progress.get(course.id);
    return p !== undefined && p.totalLessons > 0 && p.doneLessons === p.totalLessons;
  }).length;

  return (
    <>
      <Reveal>
        <header>
          <p className="text-xs font-medium uppercase tracking-eyebrow text-sage">
            El Charcu
          </p>
          <h1 className="mt-2 font-serif text-3xl font-semibold leading-tight text-forest">
            Aprende el oficio
          </h1>
        </header>
      </Reveal>

      {capsules.length > 0 ? (
        <section className="mt-7">
          <Reveal delay={0.04}>
            <div className="flex items-baseline justify-between gap-4">
              <h2 className="font-serif text-xl font-semibold text-forest">
                Empieza por aquí
              </h2>
              {/* "Vas 2 de 5" y no un porcentaje: en una ruta de cinco pasos,
                  el número entero es el dato y el porcentaje es ruido. */}
              <span className="text-sm text-cocoa/55">
                {doneCount} de {capsules.length}
              </span>
            </div>
            <p className="mt-1 text-sm leading-relaxed text-cocoa/60">
              Cápsulas cortas y gratis. Se abren en orden.
            </p>
          </Reveal>

          <ul className="mt-4 space-y-2.5">
            {capsules.map((course, index) => (
              <li key={course.id}>
                <Reveal delay={0.06 + Math.min(index, 3) * 0.03}>
                  <CapsuleRow
                    course={course}
                    progress={progress.get(course.id)}
                    index={index + 1}
                    total={capsules.length}
                    isOpen={index <= openUntil}
                  />
                </Reveal>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {rest.length > 0 ? (
        <section className="mt-10">
          <Reveal delay={0.08}>
            <h2 className="font-serif text-xl font-semibold text-forest">
              Los cursos completos
            </h2>
            <p className="mt-1 text-sm leading-relaxed text-cocoa/60">
              Una receta de principio a fin. Los que todavía no están grabados abren
              cuando haya gente suficiente esperándolos.
            </p>
          </Reveal>

          <ul className="mt-4 space-y-4">
            {rest.map((course, index) => (
              <li key={course.id}>
                <Reveal delay={0.1 + Math.min(index, 3) * 0.04}>
                  <CourseRow course={course} progress={progress.get(course.id)} />
                </Reveal>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {courses.length === 0 ? (
        <Reveal delay={0.06}>
          <p className="mt-6 rounded-2xl border border-cocoa/10 bg-cream-white p-5 text-base leading-relaxed text-cocoa/65 shadow-surface">
            Todavía no hay nada publicado. Se está grabando: en cuanto haya algo, aparece
            aquí.
          </p>
        </Reveal>
      ) : null}

      <Reveal delay={0.16}>
        <p className="mt-8 text-sm leading-relaxed text-cocoa/60">
          En cualquier paso puedes preguntarle a El Charcu. Es para lo que está.
        </p>
      </Reveal>
    </>
  );
}
