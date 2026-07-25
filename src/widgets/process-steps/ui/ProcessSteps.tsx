import { type ReactNode } from 'react';

import { Container, Eyebrow } from '@/shared/ui';

import { steps } from '../model/steps';

/** Cómo se cura: pasos del oficio, de la selección a la maduración. */
export function ProcessSteps(): ReactNode {
  return (
    <section id="proceso" className="bg-cream py-20 text-cocoa md:py-28">
      <Container>
        <div className="max-w-xl">
          <Eyebrow className="text-terracota">El proceso</Eyebrow>
          <h2 className="mt-6 font-serif text-4xl font-semibold leading-tight md:text-5xl">
            Fuego, sal y paciencia.
          </h2>
          <p className="mt-4 text-base leading-relaxed text-cocoa/70">
            Cada pieza pasa por cuatro etapas sin atajos. El tiempo hace la mayor parte
            del trabajo.
          </p>
        </div>

        <ol className="mt-16 grid grid-cols-1 gap-px overflow-hidden rounded-2xl border border-cocoa/10 bg-cocoa/10 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((step) => (
            <li key={step.number} className="bg-cream p-8">
              <span className="font-serif text-5xl font-semibold text-terracota/40">
                {step.number}
              </span>
              <h3 className="mt-6 font-serif text-xl font-semibold text-forest">
                {step.title}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-cocoa/70">
                {step.description}
              </p>
            </li>
          ))}
        </ol>
      </Container>
    </section>
  );
}
