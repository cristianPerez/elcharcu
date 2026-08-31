import { type ReactNode } from 'react';

import { CapsuleTrack, CourseRow } from '@/widgets/course-list';

import { type Course, type CourseProgress } from '@/entities/course';

import { Reveal } from '@/shared/ui';

interface AppCursosViewProps {
  readonly courses: readonly Course[];
  readonly progress: ReadonlyMap<string, CourseProgress>;
  /**
   * Si quien mira paga. Decide si ve la lista de espera o solo el temario.
   *
   * Viaja como prop desde el servidor en vez de leerse aquí: esta vista es un
   * componente de servidor y preguntarlo dentro la volvería cliente, o
   * añadiría un viaje a Supabase por tarjeta.
   */
  readonly isSubscribed: boolean;
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
export function AppCursosView({
  courses,
  progress,
  isSubscribed,
}: AppCursosViewProps): ReactNode {
  const capsules = courses.filter((course) => course.kind === 'capsula');
  const rest = courses.filter((course) => course.kind === 'curso');

  // Cuántas lleva hechas, para el "2 de 5" de la cabecera. El resto del
  // cálculo —cuál es la actual, cuáles están cerradas— vive en `CapsuleTrack`,
  // que es quien lo necesita para dibujar la ruta.
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
              {/* La regla del desbloqueo, dicha UNA vez. Estaba repetida en
                  cada cápsula cerrada —"se abre cuando termines la 2 de 5", "la
                  3 de 5"…— y algo repetido cuatro veces se lee como relleno. */}
              Cápsulas cortas y gratis. Termina una y se abre la siguiente.
            </p>
          </Reveal>

          <CapsuleTrack capsules={capsules} progress={progress} />
        </section>
      ) : null}

      {rest.length > 0 ? (
        <section className="mt-10">
          <Reveal delay={0.08}>
            <h2 className="font-serif text-xl font-semibold text-forest">
              Los cursos completos
            </h2>
            <p className="mt-1 text-sm leading-relaxed text-cocoa/60">
              {/* Al gratis no se le menciona la lista de espera: es una función
                  de suscriptor, y nombrarla sin poder usarla solo frustra. */}
              {isSubscribed
                ? 'Una receta de principio a fin. Los que todavía no están grabados abren cuando haya gente suficiente esperándolos.'
                : 'Una receta de principio a fin. Mira el temario de cada uno para saber qué trae.'}
            </p>
          </Reveal>

          <ul className="mt-4 space-y-4">
            {rest.map((course, index) => (
              <li key={course.id}>
                <Reveal delay={0.1 + Math.min(index, 3) * 0.04}>
                  <CourseRow
                    course={course}
                    progress={progress.get(course.id)}
                    isSubscribed={isSubscribed}
                  />
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
