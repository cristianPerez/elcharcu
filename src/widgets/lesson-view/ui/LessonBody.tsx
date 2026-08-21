import Image from 'next/image';
import { type ReactNode } from 'react';

import { type Lesson } from '@/entities/course';

import { LessonVideo } from './LessonVideo';

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
      return <LessonVideo lesson={lesson} />;

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
