import Link from 'next/link';
import { type ReactNode } from 'react';

import { type Course, type CourseProgress } from '@/entities/course';

import { cn } from '@/shared/lib';
import { IconChevron, IconLock, NavPendingBar } from '@/shared/ui';

interface CapsuleTrackProps {
  readonly capsules: readonly Course[];
  readonly progress: ReadonlyMap<string, CourseProgress>;
}

type CapsuleState = 'terminada' | 'actual' | 'bloqueada';

/**
 * La ruta de cápsulas, dibujada como una RUTA y no como una lista de tarjetas.
 *
 * ⚠️ Rehecho el 2026-08-31. La versión anterior pintaba cinco tarjetas del
 * mismo tamaño y fallaba en las dos cosas que tenía que hacer:
 *
 *   · **No se entendía que hay que terminar una para abrir la siguiente.**
 *     La regla estaba escrita, pero repetida en cada tarjeta bloqueada —"se
 *     abre cuando termines la 1 de 5", "la 2 de 5", "la 3 de 5"…— y algo que
 *     se repite cuatro veces se lee como relleno, no como una mecánica. Ahora
 *     lo dice la FORMA: una línea vertical une los pasos, y eso se entiende
 *     antes de leer nada.
 *   · **No escalaba.** Con cinco cápsulas ya llenaba la pantalla; con veinte
 *     habría sido scroll infinito de tarjetas idénticas.
 *
 * La solución de las dos es la misma: **jerarquía**. Solo la cápsula ACTUAL se
 * despliega —con su resumen y su botón—, porque es la única sobre la que hay
 * que decidir algo. Las terminadas y las bloqueadas ocupan una línea. Pasar de
 * cinco tarjetas a una tarjeta y cuatro filas baja la altura a menos de la
 * mitad, y esa proporción se mantiene con treinta.
 *
 * Y la regla del desbloqueo se dice UNA vez, arriba de la sección.
 *
 * El candado se PINTA aquí; quien lo aplica es `can_open_lesson()` en Postgres
 * (D12). Esta pantalla solo cuenta lo que allá ya se decidió.
 */
export function CapsuleTrack({ capsules, progress }: CapsuleTrackProps): ReactNode {
  const isFinished = (course: Course): boolean => {
    const p = progress.get(course.id);
    return p !== undefined && p.totalLessons > 0 && p.doneLessons === p.totalLessons;
  };

  // La actual es la primera sin terminar. Si están todas hechas, no hay actual.
  const currentIndex = capsules.findIndex((course) => !isFinished(course));

  return (
    <ol className="relative mt-4">
      {capsules.map((course, index) => {
        const state: CapsuleState = isFinished(course)
          ? 'terminada'
          : index === currentIndex
            ? 'actual'
            : 'bloqueada';

        return (
          <CapsuleStep
            key={course.id}
            course={course}
            index={index + 1}
            state={state}
            isLast={index === capsules.length - 1}
          />
        );
      })}
    </ol>
  );
}

interface CapsuleStepProps {
  readonly course: Course;
  readonly index: number;
  readonly state: CapsuleState;
  readonly isLast: boolean;
}

function CapsuleStep({ course, index, state, isLast }: CapsuleStepProps): ReactNode {
  const isCurrent = state === 'actual';
  const isLocked = state === 'bloqueada';

  const marker = (
    <span
      className={cn(
        'relative z-10 grid size-7 shrink-0 place-items-center rounded-full text-xs font-semibold',
        state === 'terminada' && 'bg-sage text-cream-white',
        isCurrent && 'bg-terracota text-cream-white',
        isLocked && 'bg-cream text-cocoa/35 ring-1 ring-cocoa/10',
      )}
    >
      {state === 'terminada' ? '✓' : isLocked ? <IconLock size={12} /> : index}
    </span>
  );

  return (
    <li className="relative pb-2 pl-11 last:pb-0">
      {/*
        La línea que hace que esto se lea como una ruta. Va detrás de los
        marcadores y se corta en el último, para que no quede un rabo colgando.
        Es lo que explica el desbloqueo sin una sola palabra.
      */}
      {isLast ? null : (
        <span
          aria-hidden="true"
          className="absolute bottom-0 left-[14px] top-7 w-px -translate-x-1/2 bg-cocoa/[0.12]"
        />
      )}

      <span className="absolute left-0 top-0">{marker}</span>

      {isCurrent ? (
        <Link
          href={`/cursos/${course.slug}`}
          className="relative block overflow-hidden rounded-2xl border border-terracota/30 bg-cream-white p-4 shadow-surface transition-transform active:scale-[0.99]"
        >
          <NavPendingBar />
          <div className="flex items-start gap-3">
            <div className="min-w-0 flex-1">
              <h3 className="font-serif text-lg font-semibold leading-snug text-forest">
                {course.title}
              </h3>
              <p className="mt-1 text-sm leading-relaxed text-cocoa/65">
                {course.summary}
              </p>
              <span className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-terracota-dark">
                Empezar
                <IconChevron size={15} />
              </span>
            </div>
          </div>
        </Link>
      ) : state === 'terminada' ? (
        /* Terminada sigue siendo un enlace: volver a mirar una cápsula que ya
           viste es exactamente lo que hace alguien con las manos en la carne. */
        <Link
          href={`/cursos/${course.slug}`}
          className="relative flex min-h-7 items-center gap-2 rounded-lg py-0.5 transition-colors active:bg-cream"
        >
          <span className="flex-1 text-base leading-snug text-cocoa/60">
            {course.title}
          </span>
          <IconChevron size={15} className="shrink-0 text-cocoa/25" />
        </Link>
      ) : (
        /* Bloqueada: sin enlace y sin resumen. Un enlace que lleva a un muro
           gasta un toque y una espera para no dar nada. */
        <div className="flex min-h-7 items-center py-0.5">
          <span className="text-base leading-snug text-cocoa/35">{course.title}</span>
        </div>
      )}
    </li>
  );
}
