import { type ReactNode } from 'react';

import { Container, Eyebrow } from '@/shared/ui';

import { pains } from '../model/pains';

import { PainCard } from './PainCard';

/** Lo que el asistente resuelve, dicho con las palabras del que cura. */
export function AssistantPains(): ReactNode {
  return (
    <section id="dudas" className="bg-cream py-16 md:py-24">
      <Container>
        <div className="max-w-2xl">
          <Eyebrow className="text-terracota">Las dudas de siempre</Eyebrow>
          <h2 className="mt-6 font-serif text-3xl font-semibold leading-tight text-forest md:text-5xl">
            Curar no falla por falta de receta.
            <br />
            Falla por falta de alguien que responda.
          </h2>
        </div>

        <div className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {pains.map((pain) => (
            <PainCard key={pain.id} pain={pain} />
          ))}
        </div>

        <p className="mt-8 max-w-3xl text-sm leading-relaxed text-cocoa/65">
          También: ajustes por humedad y temporada de tu región, qué hacer si no tienes
          embutidora ni tripa, curar fuera de temporada, atados y tripas que se revientan,
          superficie pegajosa.
        </p>
      </Container>
    </section>
  );
}
