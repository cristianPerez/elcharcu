import { type ReactNode } from 'react';

import { Container } from '@/shared/ui';

/** Declaración de filosofía de marca. */
export function BrandQuote(): ReactNode {
  return (
    <section className="bg-cream py-20 text-cocoa md:py-24">
      <Container>
        <figure className="mx-auto max-w-3xl text-center">
          <span aria-hidden className="font-serif text-6xl text-terracota/40">
            “
          </span>
          <blockquote className="-mt-4 font-serif text-2xl font-medium italic leading-snug text-forest md:text-3xl">
            El Charcu no es solo una charcutería. Es el maestro que enseña con pasión —
            hoy en Manizales, mañana en toda Latinoamérica.
          </blockquote>
          <figcaption className="mt-6 text-xs uppercase tracking-eyebrow text-cocoa/50">
            Sin aditivos · Sin atajos
          </figcaption>
        </figure>
      </Container>
    </section>
  );
}
