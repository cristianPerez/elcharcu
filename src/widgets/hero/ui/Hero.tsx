import { type ReactNode } from 'react';

import { site } from '@/shared/config';
import { ButtonLink, Container, Eyebrow } from '@/shared/ui';

import { CuringSeal } from './CuringSeal';

/** Sección principal: propuesta de valor, eslogan de marca y CTAs. */
export function Hero(): ReactNode {
  return (
    <section
      id="inicio"
      className="bg-grain relative overflow-hidden bg-forest text-cream"
    >
      <Container className="grid items-center gap-12 py-20 md:grid-cols-[1.3fr_1fr] md:py-28">
        <div>
          <Eyebrow className="text-sage">Charcutería artesanal · {site.location}</Eyebrow>

          <h1 className="mt-6 font-serif text-5xl font-semibold leading-[1.05] md:text-6xl">
            Curado con tiempo,
            <br />
            técnica y fuego.
          </h1>

          <p className="mt-4 font-serif text-2xl italic text-terracota">{site.slogan}.</p>

          <p className="mt-6 max-w-xl text-base leading-relaxed text-cream/80">
            Embutidos y curados hechos a mano en Manizales, con la técnica de España e
            Italia y la obsesión por hacer las cosas bien. Nada de aditivos innecesarios,
            nada de atajos industriales — solo oficio.
          </p>

          <div className="mt-9 flex flex-wrap gap-4">
            <ButtonLink href={site.whatsappUrl} external variant="primary">
              Pedir por WhatsApp
            </ButtonLink>
            <ButtonLink href="#proceso" variant="outline">
              Conocer el proceso
            </ButtonLink>
          </div>
        </div>

        <div className="flex justify-center md:justify-end">
          <CuringSeal />
        </div>
      </Container>
    </section>
  );
}
