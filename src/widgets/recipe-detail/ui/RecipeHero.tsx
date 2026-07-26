import Link from 'next/link';
import { type ReactNode } from 'react';

import { Container, Eyebrow } from '@/shared/ui';

interface RecipeHeroProps {
  readonly eyebrow: string;
  readonly name: string;
  readonly subtitle: string;
}

/** Cabecera de la receta: volver a Recetas, eyebrow, título y subtítulo. */
export function RecipeHero({ eyebrow, name, subtitle }: RecipeHeroProps): ReactNode {
  return (
    <section className="bg-grain bg-forest py-12 text-cream md:py-20">
      <Container>
        <Link
          href="/recetas"
          className="text-[13px] text-cream/75 transition-colors hover:text-cream"
        >
          ← Recetas
        </Link>
        <Eyebrow className="mt-4 text-sage">{eyebrow}</Eyebrow>
        <h1 className="mt-4 font-serif text-3xl font-semibold leading-tight md:text-[46px]">
          {name}
        </h1>
        <p className="mt-3 font-serif text-base italic text-terracota md:text-lg">
          {subtitle}
        </p>
      </Container>
    </section>
  );
}
