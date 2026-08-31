import { type ReactNode } from 'react';

import { Container, Eyebrow } from '@/shared/ui';

import { howSteps } from '../model/steps';

/** Cómo funciona, en tres pasos. Sin capturas de pantalla: se entiende leyendo. */
export function AssistantHow(): ReactNode {
  return (
    <section
      id="como-funciona"
      className="bg-grain bg-forest-dark py-16 text-cream md:py-24"
    >
      <Container>
        <div className="max-w-2xl">
          <Eyebrow className="text-sage">Cómo funciona</Eyebrow>
          <h2 className="mt-6 font-serif text-3xl font-semibold leading-tight md:text-5xl">
            Como tener al maestro al lado,
            <br />
            en el celular.
          </h2>
        </div>

        <ol className="mt-8 grid gap-10 md:grid-cols-3 md:gap-8">
          {howSteps.map((step) => (
            <li key={step.number} className="border-t border-cream/15 pt-6">
              <span className="font-serif text-3xl text-terracota">{step.number}</span>
              <h3 className="mt-3 font-serif text-xl font-semibold">{step.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-cream/75">
                {step.description}
              </p>
            </li>
          ))}
        </ol>
      </Container>
    </section>
  );
}
