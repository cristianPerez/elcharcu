import { type ReactNode } from 'react';

import { type Step } from '@/entities/recipe';

interface StepRowProps {
  readonly step: Step;
}

/** Paso numerado de la preparación. */
export function StepRow({ step }: StepRowProps): ReactNode {
  return (
    <li className="flex gap-5 border-b border-cocoa/10 py-5 last:border-b-0">
      <span className="w-12 shrink-0 font-serif text-3xl font-semibold text-terracota/40">
        {step.n}
      </span>
      {/*
        ⚠️ 52ch, no 65 ni `max-w-prose`.
        La unidad `ch` mide el ancho del carácter "0", que en Inter son 10,1 px,
        pero la letra real de un texto en español promedia 7,3 px. Así que
        `65ch` no da 65 caracteres por línea: da 90 — muy por encima de los
        60-75 que se leen sin perder el renglón. Medido en el navegador el
        2026-09-01, sobre el texto real de una receta. */}
      <p className="max-w-[52ch] pt-1 text-[17px] leading-relaxed text-cocoa md:text-base">
        {step.text}
      </p>
    </li>
  );
}
