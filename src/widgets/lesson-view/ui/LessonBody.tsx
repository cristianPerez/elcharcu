import Image from 'next/image';
import { type ReactNode } from 'react';

import { type Lesson } from '@/entities/course';

interface LessonBodyProps {
  readonly lesson: Lesson;
}

/**
 * El contenido de la lección, según de qué esté hecha.
 *
 * El `switch` sobre `kind` es exhaustivo y TypeScript lo comprueba: el día que
 * se añada un tipo nuevo a la unión, esto deja de compilar hasta que alguien
 * decida cómo se ve. Es justo lo que se quiere — el fallo aparece al escribir
 * el código y no en el celular de un cliente.
 */
export function LessonBody({ lesson }: LessonBodyProps): ReactNode {
  switch (lesson.kind) {
    case 'video':
      return <VideoPending lesson={lesson} />;

    case 'imagen':
      return (
        <Image
          src={lesson.fileUrl}
          alt={lesson.title}
          width={800}
          height={600}
          className="w-full rounded-2xl border border-cocoa/10 object-cover"
        />
      );

    case 'pdf':
      return (
        <a
          href={lesson.fileUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-between rounded-2xl border border-cocoa/10 bg-cream-white px-5 py-4 shadow-surface"
        >
          <span>
            <span className="block font-medium text-forest">Abrir el PDF</span>
            <span className="mt-0.5 block text-sm text-cocoa/55">
              Se abre en otra pestaña
            </span>
          </span>
          <span aria-hidden="true" className="text-cocoa/40">
            ›
          </span>
        </a>
      );

    case 'texto':
      return (
        <div className="rounded-2xl border border-cocoa/10 bg-cream-white p-5 shadow-surface">
          <p className="whitespace-pre-line text-base leading-relaxed text-cocoa/80">
            {lesson.body}
          </p>
        </div>
      );
  }
}

/**
 * El sitio del reproductor, mientras no haya videos.
 *
 * No hay cuenta de Bunny todavía (paso 6), así que se enseña la portada y se
 * dice la verdad. Cuando exista, aquí entra el reproductor con URL firmada y
 * el resto de la pantalla no se toca.
 */
function VideoPending({
  lesson,
}: {
  readonly lesson: Extract<Lesson, { kind: 'video' }>;
}): ReactNode {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-cocoa/10 bg-forest">
      {lesson.posterUrl === null ? null : (
        <Image
          src={lesson.posterUrl}
          alt=""
          width={800}
          height={450}
          className="h-48 w-full object-cover opacity-45"
        />
      )}
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="rounded-full bg-cocoa/70 px-4 py-2 text-sm font-medium text-cream">
          Video en camino
        </span>
      </div>
    </div>
  );
}
