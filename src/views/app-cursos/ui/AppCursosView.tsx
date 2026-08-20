import { type ReactNode } from 'react';

import { CourseRow } from '@/widgets/course-list';

import { type Course, type CourseProgress } from '@/entities/course';

import { Reveal } from '@/shared/ui';

interface AppCursosViewProps {
  readonly courses: readonly Course[];
  readonly progress: ReadonlyMap<string, CourseProgress>;
}

/**
 * Primera pestaña: lo que el usuario vino a aprender.
 *
 * La lista sale de la base y RLS decide qué entra: el curso de pago no llega
 * siquiera al servidor de quien no tiene suscripción. Por eso aquí no hay ni
 * un `if` de permisos — no le toca decidir a la pantalla (D12).
 */
export function AppCursosView({ courses, progress }: AppCursosViewProps): ReactNode {
  return (
    <>
      <Reveal>
        <header>
          <p className="text-xs font-medium uppercase tracking-eyebrow text-sage">
            El Charcu
          </p>
          <h1 className="mt-2 font-serif text-3xl font-semibold leading-tight text-forest">
            Mis cursos
          </h1>
        </header>
      </Reveal>

      {courses.length === 0 ? (
        <Reveal delay={0.06}>
          <p className="mt-6 rounded-2xl border border-cocoa/10 bg-cream-white p-5 text-base leading-relaxed text-cocoa/65 shadow-surface">
            Todavía no hay cursos publicados. Se están grabando: en cuanto haya uno,
            aparece aquí.
          </p>
        </Reveal>
      ) : (
        <ul className="mt-6 space-y-4">
          {courses.map((course, index) => (
            <li key={course.id}>
              <Reveal delay={0.06 + index * 0.06}>
                <CourseRow course={course} progress={progress.get(course.id)} />
              </Reveal>
            </li>
          ))}
        </ul>
      )}

      <Reveal delay={0.18}>
        <p className="mt-8 text-sm leading-relaxed text-cocoa/60">
          Los videos se están grabando. Mientras tanto, cada lección lleva los pasos
          escritos y El Charcu te responde en cualquiera de ellos.
        </p>
      </Reveal>
    </>
  );
}
