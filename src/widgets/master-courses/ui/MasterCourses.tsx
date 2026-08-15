import { type ReactNode } from 'react';

import { site } from '@/shared/config';
import { ButtonLink, Container, Eyebrow } from '@/shared/ui';

import { courses } from '../model/courses';

import { CourseCard } from './CourseCard';

/** La escuela: Cursos Maestros con calificación 4.6–5.0. */
export function MasterCourses(): ReactNode {
  return (
    <section id="cursos" className="bg-grain bg-forest-dark py-20 text-cream md:py-28">
      <Container className="grid gap-14 md:grid-cols-[0.9fr_1.1fr] md:gap-20">
        <div>
          <Eyebrow className="text-sage">Cursos Maestros</Eyebrow>
          <h2 className="mt-6 font-serif text-4xl font-semibold leading-tight md:text-5xl">
            Aprende el oficio, no solo la receta.
          </h2>
          <p className="mt-5 text-base leading-relaxed text-cream/75">
            El Charcu no es solo producto: es también la escuela donde se enseña el
            oficio. Una Academia con calificación 4.6–5.0, para quitar el miedo a
            dosificar y empezar a curar con seguridad.
          </p>
          <div className="mt-8">
            <ButtonLink href={site.whatsappUrl} external variant="cream">
              Quiero tomar un curso
            </ButtonLink>
          </div>
        </div>

        <div>
          {courses.map((course) => (
            <CourseCard key={course.id} course={course} />
          ))}
        </div>
      </Container>
    </section>
  );
}
