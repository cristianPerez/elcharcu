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
      <p className="pt-1.5 text-[15px] leading-relaxed text-cocoa">{step.text}</p>
    </li>
  );
}
