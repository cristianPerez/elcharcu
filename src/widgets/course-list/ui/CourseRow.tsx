import Image from 'next/image';
import Link from 'next/link';
import { type ReactNode } from 'react';

import { WaitlistButton } from '@/features/join-waitlist';

import { type Course, type CourseProgress } from '@/entities/course';

import { cn } from '@/shared/lib';
import { IconChevron, IconLock, NavPendingBar } from '@/shared/ui';

interface CourseRowProps {
  readonly course: Course;
  readonly progress: CourseProgress | undefined;
  /** Si quien mira paga. Solo el suscrito ve la lista de espera. */
  readonly isSubscribed: boolean;
}

/**
 * Una fila de la lista de cursos.
 *
 * La tarjeta tiene DOS mitades a propósito (2026-08-21):
 *
 *   · Arriba, la foto de la pieza terminada con un velo oscuro encima y el
 *     título en blanco. Es lo que vende: nadie se apunta a un curso de curado
 *     por leer un título, se apunta por ver el lomo cortado.
 *   · Abajo, superficie clara y los colores de siempre para lo que se LEE — el
 *     resumen y el progreso. Texto largo sobre una foto se lee mal por más
 *     velo que se le ponga.
 *
 * El velo no es decoración: sin él, el blanco sobre una foto clara desaparece,
 * y una foto de carne cruda tiene zonas claras y oscuras en la misma imagen.
 * Va en degradado —más oscuro abajo, donde está el texto— para que la foto se
 * siga viendo arriba.
 */
export function CourseRow({ course, progress, isSubscribed }: CourseRowProps): ReactNode {
  const done = progress?.doneLessons ?? 0;
  const total = progress?.totalLessons ?? 0;
  const percent = progress?.percent ?? 0;
  const isStarted = done > 0;
  const isFinished = total > 0 && done === total;

  // Lo decide la base, no esta pantalla: `listCourses` pregunta qué módulos
  // entrega RLS. Un suscriptor ve los mismos cursos sin candado.
  const isLocked = course.isLocked;

  // En lista de espera todavía no está grabado. Es un estado distinto de
  // "bloqueado": ahí el contenido existe y te falta pagarlo; aquí no existe
  // para nadie, ni para quien paga. Decir lo contrario sería mentir.
  const isWaiting = course.status === 'lista-de-espera';

  /*
    Apuntarse es cosa de suscriptores (2026-08-31).

    Al usuario gratis se le enseña el curso y su temario, y nada más: ni barra
    ni botón ni mención. Nombrar una función que no puede usar solo frustra, y
    además la lista existe para saber QUÉ GRABAR PRIMERO — para esa pregunta la
    señal de quien ya paga vale más.

    ⚠️ Esconder el botón NO es lo que lo cierra. Quien cierra es
    `join_waitlist()` en Postgres, que exige suscripción desde la 0021. Esto
    solo evita enseñar una puerta que la base va a rechazar.
  */
  const canJoinWaitlist = isWaiting && isSubscribed;

  return (
    <Link
      href={`/cursos/${course.slug}`}
      className="relative block overflow-hidden rounded-2xl border border-cocoa/10 bg-cream-white shadow-raised transition-transform active:scale-[0.98]"
    >
      <NavPendingBar />
      <div className="relative h-44 w-full">
        {course.coverUrl === null ? (
          <div className="absolute inset-0 bg-forest" />
        ) : (
          <Image
            src={course.coverUrl}
            alt=""
            fill
            sizes="(max-width: 448px) 100vw, 448px"
            /*
              El recorte se sube al 30%, no al centro.
              La foto es vertical y la tarjeta es una franja ancha, así que
              `object-cover` se queda con una banda. Centrada, esa banda cae en
              la tabla y el cuchillo; subiéndola cae en la CARA CORTADA del
              lomo, que es lo único que vende un curso de curado.
            */
            className={cn(
              'object-cover [object-position:50%_30%]',
              // Bloqueado: la foto se ve, pero apagada. Se entiende que hay
              // algo ahí y que todavía no es tuyo.
              isLocked && 'saturate-[0.55]',
            )}
            priority
          />
        )}

        {/* El velo. Degradado y no plano: arriba deja ver la foto, abajo
            garantiza que el blanco se lea pase lo que pase en la imagen. */}
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-gradient-to-t from-cocoa/85 via-cocoa/45 to-cocoa/20"
        />

        {isWaiting ? (
          <span className="absolute right-3 top-3 rounded-full bg-cream-white/90 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-cocoa/75 backdrop-blur-sm">
            En preparación
          </span>
        ) : course.access === 'libre' ? (
          <span className="absolute right-3 top-3 rounded-full bg-terracota px-3 py-1 text-xs font-semibold uppercase tracking-wide text-cream-white shadow-surface">
            Gratis
          </span>
        ) : (
          <span className="absolute right-3 top-3 flex items-center gap-1.5 rounded-full bg-cocoa/70 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-cream-white backdrop-blur-sm">
            <IconLock size={13} strokeWidth={2.2} />
            El Charcu Pro
          </span>
        )}

        <div className="absolute inset-x-0 bottom-0 p-5">
          <p className="text-xs font-medium uppercase tracking-eyebrow text-cream/85">
            {isWaiting
              ? 'Todavía no está grabado'
              : isFinished
                ? 'Terminado'
                : isStarted
                  ? 'Sigue donde ibas'
                  : 'Empieza aquí'}
          </p>
          <h2 className="mt-1.5 font-serif text-2xl font-semibold leading-tight text-cream-white">
            {course.title}
          </h2>
        </div>
      </div>

      <div className="p-5">
        <p className="text-base leading-relaxed text-cocoa/70">{course.summary}</p>

        {canJoinWaitlist ? (
          <WaitlistButton
            courseId={course.id}
            courseSlug={course.slug}
            initialCount={course.waitlistCount}
            goal={course.waitlistGoal ?? 30}
            initiallyJoined={course.isInWaitlist}
          />
        ) : null}

        {!isWaiting && isLocked && total > 0 ? (
          /* Sin barra de progreso: un 0% en algo que no puedes empezar no
             informa, desanima. Lo que sí vende es CUÁNTO hay dentro. */
          <p className="mt-4 text-sm text-cocoa/55">{total} lecciones esperándote</p>
        ) : null}

        {!isWaiting && !isLocked && total > 0 ? (
          <div className="mt-4">
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
          </div>
        ) : null}

        {isWaiting ? (
          <span className="mt-4 flex items-center gap-1 text-sm font-medium text-cocoa/55">
            Mira el temario
            <IconChevron size={16} />
          </span>
        ) : isLocked ? (
          /*
            Lo que se le dice a quien no paga.
            No es "no puedes": es "esto es lo que hay dentro". El precio de la
            frase importa — un candado seco invita a cerrar la app, y la idea
            es justo la contraria.
          */
          <div className="mt-4 flex items-center gap-2 rounded-xl bg-cream px-3.5 py-3">
            <IconLock size={16} className="shrink-0 text-terracota-dark" />
            <span className="text-sm leading-snug text-cocoa/70">
              Incluido en{' '}
              <strong className="font-medium text-forest">El Charcu Pro</strong> — ábrelo
              y mira lo que trae
            </span>
            <IconChevron size={16} className="ml-auto shrink-0 text-cocoa/35" />
          </div>
        ) : (
          <span className="mt-4 flex items-center gap-1 text-sm font-medium text-terracota-dark">
            {isStarted && !isFinished ? 'Continuar' : 'Abrir el curso'}
            <IconChevron size={16} />
          </span>
        )}
      </div>
    </Link>
  );
}
