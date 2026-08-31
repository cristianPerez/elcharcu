import { type ReactNode } from 'react';

import { appRoutes } from '@/shared/config';
import { ButtonLink, Eyebrow } from '@/shared/ui';

/** Llegó a la sesión sin haber hecho el onboarding. Lo devolvemos, sin regaño. */
export function SessionEmpty(): ReactNode {
  return (
    <div className="mx-auto max-w-md py-16 text-center md:py-24">
      <Eyebrow className="justify-center text-terracota-dark">
        Todavía no hay receta
      </Eyebrow>
      <h1 className="mt-6 font-serif text-3xl font-semibold leading-tight text-forest">
        Primero elige qué vas a curar.
      </h1>
      <p className="mt-4 text-sm leading-relaxed text-cocoa/65">
        Son tres preguntas cortas y quedas listo para abrir tu receta gratis.
      </p>
      <div className="mt-8 flex justify-center">
        <ButtonLink href={appRoutes.start} variant="primary">
          Empezar
        </ButtonLink>
      </div>
    </div>
  );
}
