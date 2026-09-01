import { type ReactNode } from 'react';

import { type LabelValue, type TitleDescription } from '@/entities/recipe';

import { type RecipeDoubt as Doubt } from '../lib/recipeDoubts';

import { RecipeDoubt } from './RecipeDoubt';
import { RecipeSection } from './RecipeSection';
import { StatChip } from './StatChip';

interface RecipeOverviewProps {
  readonly name: string;
  readonly image: string;
  readonly intro: string;
  readonly stats: readonly LabelValue[];
  readonly details: readonly TitleDescription[];
  readonly doubt: Doubt;
}

/** Introducción: texto, foto, cifras (stats) y detalles de origen/textura/sabor. */
export function RecipeOverview({
  name,
  image,
  intro,
  stats,
  details,
  doubt,
}: RecipeOverviewProps): ReactNode {
  return (
    <RecipeSection>
      <div className="grid items-start gap-6 md:grid-cols-[1.2fr_1fr] md:gap-12">
        <p className="text-[17px] leading-relaxed text-cocoa/80 md:text-lg">{intro}</p>
        <div
          role="img"
          aria-label={image ? name : 'Foto de la longaniza (pendiente)'}
          className="bg-grain h-[180px] w-full rounded-2xl bg-forest bg-cover bg-center md:h-[220px]"
          style={image ? { backgroundImage: `url(${image})` } : undefined}
        />
      </div>

      <div className="mt-6 grid grid-cols-2 gap-3 md:mt-8 md:grid-cols-3">
        {stats.map((stat) => (
          <StatChip key={stat.label} stat={stat} />
        ))}
      </div>

      {/* La primera duda real de cualquiera que va a cocinar: la receta
            dice una cantidad y su carne pesa otra. Va COMPACTA: aquí todavía
            está leyendo de qué va la receta, no metido en harina. */}
      <div className="mt-6 max-w-[52ch]">
        <RecipeDoubt doubt={doubt} variant="compact" />
      </div>

      <div className="mt-7 grid gap-4 md:mt-8 md:grid-cols-3">
        {details.map((detail) => (
          <div key={detail.title}>
            <h3 className="font-serif text-lg font-semibold text-forest">
              {detail.title}
            </h3>
            <p className="mt-2 text-[15px] leading-relaxed text-cocoa/70 md:text-base">
              {detail.description}
            </p>
          </div>
        ))}
      </div>
    </RecipeSection>
  );
}
