import { type ReactNode } from 'react';

import { type Tabla } from '@/entities/tabla';

import { Container } from '@/shared/ui';

import { Quote } from './Quote';
import { TablaHero } from './TablaHero';
import { TablaIngredients } from './TablaIngredients';
import { TablaOverview } from './TablaOverview';
import { TablaPairings } from './TablaPairings';
import { TablaPreparation } from './TablaPreparation';
import { TablaViewTracker } from './TablaViewTracker';

interface TablaDetailProps {
  readonly tabla: Tabla;
}

/** Cuerpo completo de la página de tabla, compuesto por secciones. */
export function TablaDetail({ tabla }: TablaDetailProps): ReactNode {
  return (
    <article>
      <TablaViewTracker slug={tabla.slug} name={tabla.name} tags={tabla.tags} />
      <TablaHero eyebrow={tabla.eyebrow} name={tabla.name} subtitle={tabla.subtitle} />
      <TablaOverview
        name={tabla.name}
        image={tabla.image}
        intro={tabla.intro}
        stats={tabla.stats}
        details={tabla.details}
      />

      <section className="bg-cream pb-16 text-cocoa md:pb-24">
        <Container>
          <Quote quote={tabla.quote} size="lg" />
        </Container>
      </section>

      <TablaIngredients
        note={tabla.ingredientsNote}
        ingredients={tabla.ingredients}
        proportionNote={tabla.proportionNote}
        expertNote={tabla.expertNote}
      />
      <TablaPreparation steps={tabla.steps} tips={tabla.tips} />
      <TablaPairings
        pairings={tabla.pairings}
        recommendations={tabla.recommendations}
        resultNote={tabla.resultNote}
      />

      <section className="bg-cream py-16 text-cocoa md:py-24">
        <Container>
          <Quote quote={tabla.finalQuote} caption={tabla.finalQuoteCaption} size="md" />
        </Container>
      </section>
    </article>
  );
}
