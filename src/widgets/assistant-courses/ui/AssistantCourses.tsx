import { type ReactNode } from 'react';

import { appRoutes } from '@/shared/config';
import { ButtonLink, Container, Eyebrow } from '@/shared/ui';

import { appCourses } from '../model/courses';

/** Los mini-cursos en video, conectados con el asistente. */
export function AssistantCourses(): ReactNode {
  return (
    <section id="cursos" className="bg-cream py-20 md:py-28">
      <Container className="grid gap-14 md:grid-cols-[0.85fr_1.15fr] md:gap-20">
        <div>
          <Eyebrow className="text-terracota">Mini-cursos en video</Eyebrow>
          <h2 className="mt-6 font-serif text-3xl font-semibold leading-tight text-forest md:text-5xl">
            Videos cortos, hechos para verse con las manos sucias.
          </h2>
          <p className="mt-6 text-base leading-relaxed text-cocoa/70">
            Cada curso está partido en pasos de pocos minutos: los ves en el celular,
            junto a la mesa de trabajo. Y al final de cada receta hay un botón que abre
            esa misma receta con el asistente, para cuando algo no salga como en el video.
          </p>
          <div className="mt-8">
            <ButtonLink href={appRoutes.start} variant="primary">
              Empezar mi primera receta
            </ButtonLink>
          </div>
        </div>

        <div>
          {appCourses.map((course) => (
            <article
              key={course.id}
              className="border-cocoa/12 border-b py-6 last:border-b-0"
            >
              <div className="flex items-start justify-between gap-6">
                <h3 className="font-serif text-xl font-semibold text-forest">
                  {course.name}
                </h3>
                <div className="bg-forest/8 flex shrink-0 items-center gap-1 rounded-full px-3 py-1.5">
                  <span aria-hidden className="text-terracota">
                    ★
                  </span>
                  <span className="text-sm font-medium text-forest">{course.rating}</span>
                </div>
              </div>
              <p className="mt-2 max-w-md text-sm leading-relaxed text-cocoa/65">
                {course.description}
              </p>
              <p className="mt-3 text-xs uppercase tracking-eyebrow text-cocoa/45">
                {course.videoCount} videos · {course.freeVideoCount} gratis
              </p>
            </article>
          ))}
        </div>
      </Container>
    </section>
  );
}
