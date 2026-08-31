import Image from 'next/image';
import { type ReactNode } from 'react';

import { type Lesson } from '@/entities/course';

import { bunnyEmbedUrl } from '@/shared/config';

interface LessonVideoProps {
  readonly lesson: Extract<Lesson, { kind: 'video' }>;
}

/**
 * El reproductor, en VERTICAL.
 *
 * Los videos del curso son 9:16 (decisión de Cristian, 2026-08-20: están
 * grabados así). Eso NO es un problema a corregir — es el formato correcto
 * para esto. La app entera es de celular y el público cura carne mirando el
 * teléfono, así que un 9:16 ocupa la pantalla casi entera.
 *
 * Lo que sí estaba mal era la caja: antes el hueco del video era 16:9
 * (`h-48 w-full object-cover`). Un vertical ahí dentro sale con dos barras
 * negras enormes o recortado justo por donde importa — las manos y la carne.
 *
 * ⚠️ NO recortar ni rellenar a 16:9. Es la reacción natural y la peor de
 * todas: se pierde la mitad del encuadre de un video que trata precisamente
 * de lo que hacen unas manos.
 *
 * El `padding` del contenedor viene de `aspect-[9/16]`, y el iframe se estira
 * dentro. `loading="lazy"` para que abrir una lección no descargue video antes
 * de que nadie le dé al play.
 */
export function LessonVideo({ lesson }: LessonVideoProps): ReactNode {
  // `null` cubre los dos casos que se ven igual desde fuera: que esta lección
  // todavía no tenga video, y que falte `BUNNY_LIBRARY_ID` en el despliegue.
  const src = lesson.bunnyVideoId === null ? null : bunnyEmbedUrl(lesson.bunnyVideoId);

  if (src === null) {
    return <VideoPending lesson={lesson} />;
  }

  return (
    <div className="relative aspect-[9/16] w-full overflow-hidden rounded-2xl border border-cocoa/10 bg-cocoa">
      <iframe
        src={src}
        title={lesson.title}
        loading="lazy"
        className="absolute inset-0 h-full w-full"
        /*
          `autoplay` en el permiso NO enciende el video: solo autoriza a que el
          reproductor pueda hacerlo si se lo piden. Y `fullscreen` va AQUÍ y no
          en `allowFullScreen`: poner los dos hace que el navegador avise de que
          uno pisa al otro, y el que manda es este.
        */
        allow="accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture; fullscreen"
      />
    </div>
  );
}

/**
 * El sitio del reproductor cuando esa lección todavía no tiene video.
 *
 * Se conserva porque los cursos se llenan poco a poco: puede haber lecciones
 * grabadas y otras no, y eso es mejor decirlo que enseñar un hueco negro.
 * También en vertical, para que la pantalla no dé un salto de altura el día
 * que llegue el video.
 */
function VideoPending({ lesson }: LessonVideoProps): ReactNode {
  return (
    <div className="relative aspect-[9/16] w-full overflow-hidden rounded-2xl border border-cocoa/10 bg-forest">
      {lesson.posterUrl === null ? null : (
        <Image
          src={lesson.posterUrl}
          alt=""
          fill
          sizes="(max-width: 448px) 100vw, 448px"
          className="object-cover opacity-45"
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
