import { type ReactNode } from 'react';

import { appRoutes, site } from '@/shared/config';
import { ButtonLink, Container, Eyebrow } from '@/shared/ui';

/** Apertura de la página de ventas: el momento de la duda, no la lista de features. */
export function AssistantHero(): ReactNode {
  return (
    <section className="bg-grain relative overflow-hidden bg-forest text-cream">
      <Container className="py-20 md:py-28">
        <div className="max-w-3xl">
          <Eyebrow className="text-sage">El maestro charcutero de bolsillo</Eyebrow>

          <h1 className="mt-6 font-serif text-4xl font-semibold leading-[1.08] md:text-6xl">
            Son las once de la noche
            <br />y le salió una mancha verde.
          </h1>

          <p className="mt-6 font-serif text-2xl italic text-terracota">
            Ahora sí hay a quién preguntarle.
          </p>

          <p className="mt-6 max-w-xl text-base leading-relaxed text-cream/80">
            El asistente de {site.name} responde en el momento exacto de la duda: cuánta
            sal de cura va por kilo, si ese moho se limpia o se bota, por qué te quedó
            café por dentro. Entrenado con el método de Cristian —{' '}
            <span className="text-cream">{site.slogan.toLowerCase()}</span> — no con
            recetas sueltas de internet.
          </p>

          <div className="mt-9 flex flex-wrap gap-4">
            <ButtonLink href={appRoutes.start} variant="primary">
              Curar mi primera receta gratis
            </ButtonLink>
            <ButtonLink href="#como-funciona" variant="outline">
              Ver cómo funciona
            </ButtonLink>
          </div>

          <p className="mt-5 text-sm text-cream/55">
            Una receta completa, de principio a fin, sin tarjeta.
          </p>
        </div>
      </Container>
    </section>
  );
}
