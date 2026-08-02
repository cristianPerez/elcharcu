import { type ReactNode } from 'react';

import { type TablaStep } from '@/entities/tabla';

interface StepRowProps {
  readonly step: TablaStep;
}

/** Paso numerado de la preparación — con foto opcional que ilustra la técnica. */
export function StepRow({ step }: StepRowProps): ReactNode {
  return (
    <li className="border-b border-cocoa/10 py-5 last:border-b-0">
      <div className="flex gap-5">
        <span className="w-12 shrink-0 font-serif text-3xl font-semibold text-terracota/40">
          {step.n}
        </span>
        <p className="pt-1.5 text-[15px] leading-relaxed text-cocoa">{step.text}</p>
      </div>
      {step.image ? (
        <div
          role="img"
          aria-label={`Técnica del paso ${step.n}`}
          className="ml-[68px] mt-4 aspect-[4/3] max-w-md rounded-2xl bg-cover bg-center md:max-w-xl"
          style={{ backgroundImage: `url(${step.image})` }}
        />
      ) : null}
    </li>
  );
}
