import { type ReactNode } from 'react';

import { appRoutes } from '@/shared/config';
import { ButtonLink, Container } from '@/shared/ui';

/** Cierre de la página de ventas. Un solo camino: empezar la receta gratis. */
export function AssistantCta(): ReactNode {
  return (
    <section className="bg-grain bg-forest py-16 text-cream md:py-24">
      <Container className="text-center">
        <h2 className="mx-auto max-w-3xl font-serif text-3xl font-semibold leading-tight md:text-5xl">
          Tu próximo kilo de carne
          <br />
          no tiene por qué salir mal.
        </h2>
        <p className="mx-auto mt-6 max-w-xl text-base leading-relaxed text-cream/75">
          Empieza una receta hoy y llévala hasta el final con el asistente al lado. La dos
          primeras van por cuenta de la casa.
        </p>
        <div className="mt-9 flex justify-center">
          <ButtonLink href={appRoutes.start} variant="primary">
            Curar mi primera receta gratis
          </ButtonLink>
        </div>
      </Container>
    </section>
  );
}
