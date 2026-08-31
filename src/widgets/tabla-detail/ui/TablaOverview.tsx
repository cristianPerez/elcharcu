import { type ReactNode } from 'react';

import { type LabelValue, type TitleDescription } from '@/entities/tabla';

import { Container } from '@/shared/ui';

import { StatChip } from './StatChip';

interface TablaOverviewProps {
  readonly name: string;
  readonly image: string;
  readonly intro: string;
  readonly stats: readonly LabelValue[];
  readonly details: readonly TitleDescription[];
}

/** Introducción: texto, foto, cifras (stats) y detalles de presupuesto/ocasión/estilo. */
export function TablaOverview({
  name,
  image,
  intro,
  stats,
  details,
}: TablaOverviewProps): ReactNode {
  return (
    <section className="bg-cream py-16 text-cocoa md:py-24">
      <Container>
        <div className="grid items-start gap-6 md:grid-cols-[1.2fr_1fr] md:gap-12">
          <p className="text-[15px] leading-relaxed text-cocoa/70 md:text-base">
            {intro}
          </p>
          <div
            role="img"
            aria-label={image ? name : 'Foto de la tabla (pendiente)'}
            className="bg-grain h-[180px] w-full rounded-2xl bg-forest bg-cover bg-center md:h-[220px]"
            style={image ? { backgroundImage: `url(${image})` } : undefined}
          />
        </div>

        <div className="mt-6 grid grid-cols-2 gap-3 md:mt-8 md:grid-cols-3">
          {stats.map((stat) => (
            <StatChip key={stat.label} stat={stat} />
          ))}
        </div>

        <div className="mt-4 grid gap-4 md:mt-6 md:grid-cols-3">
          {details.map((detail) => (
            <div key={detail.title}>
              <h3 className="font-serif text-[17px] font-semibold text-forest">
                {detail.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-cocoa/70">
                {detail.description}
              </p>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
