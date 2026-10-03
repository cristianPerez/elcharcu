import Link from 'next/link';
import { type ReactNode } from 'react';

import { maestroPlan } from '@/entities/plan';

import { appRoutes } from '@/shared/config';
import { IconArrowRight, IconChevron } from '@/shared/ui';

/**
 * "Pásate a El Charcu Maestro". La vista solo la monta si el plan actual NO es
 * Maestro: invitar a lo que ya tienes es ruido.
 */
export function MaestroUpsell(): ReactNode {
  const { questionsPerMonth, imagesPerMonth } = maestroPlan.quota;
  const pitch = `${String(questionsPerMonth)} preguntas, ${String(imagesPerMonth)} fotos y costos por porción para vender`;

  return (
    <Link
      href={appRoutes.subscription}
      className="flex h-full items-center gap-4 rounded-card border border-cocoa/10 bg-cream-white p-4 transition-colors hover:border-cocoa/20 md:flex-col md:items-start md:p-6"
    >
      <span className="grid size-11 shrink-0 place-items-center rounded-full bg-highlight text-brasa-tinta md:hidden">
        <IconArrowRight size={18} className="-rotate-90" />
      </span>
      <span className="min-w-0 flex-1">
        <span className="hidden text-[11px] font-semibold uppercase tracking-[0.2em] text-brasa-tinta md:block">
          Siguiente nivel
        </span>
        <span className="block text-[15px] font-semibold text-cocoa md:mt-1.5 md:font-serif md:text-[22px] md:text-forest">
          <span className="md:hidden">Pásate a </span>
          {maestroPlan.name}
        </span>
        <span className="mt-0.5 block text-[13px] leading-snug text-cocoa-soft md:mt-2 md:text-[15px]">
          {pitch}
        </span>
      </span>
      <IconChevron size={18} className="shrink-0 text-cocoa-muted md:hidden" />
      <span className="hidden min-h-11 items-center rounded-full bg-brasa px-5 text-sm font-semibold text-cocoa md:mt-5 md:inline-flex">
        Ver plan Maestro
      </span>
    </Link>
  );
}
