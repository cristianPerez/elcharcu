import { type ReactNode } from 'react';

import { Eyebrow } from '@/shared/ui';

import { TOTAL_STEPS } from '../model/useOnboarding';

interface StepShellProps {
  readonly stepIndex: number;
  readonly title: string;
  /** Por qué preguntamos esto. Baja la desconfianza y sube la tasa de respuesta. */
  readonly why: string;
  readonly onBack: (() => void) | null;
  readonly children: ReactNode;
}

/** Marco común de cada pregunta: progreso, título, motivo y opciones. */
export function StepShell({
  stepIndex,
  title,
  why,
  onBack,
  children,
}: StepShellProps): ReactNode {
  return (
    <div>
      <div className="flex items-center justify-between gap-4">
        <Eyebrow className="text-terracota-dark">
          Paso {stepIndex} de {TOTAL_STEPS}
        </Eyebrow>
        {onBack === null ? null : (
          <button
            type="button"
            onClick={onBack}
            className="rounded-full px-3 py-1 text-sm text-cocoa/65 transition-colors hover:text-forest focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-terracota"
          >
            ← Atrás
          </button>
        )}
      </div>

      <div
        className="mt-5 flex gap-1.5"
        role="progressbar"
        aria-valuemin={1}
        aria-valuemax={TOTAL_STEPS}
        aria-valuenow={stepIndex}
        aria-label="Progreso del onboarding"
      >
        {Array.from({ length: TOTAL_STEPS }, (_, index) => (
          <span
            key={index}
            className={
              index < stepIndex
                ? 'h-1 flex-1 rounded-full bg-terracota'
                : 'h-1 flex-1 rounded-full bg-cream/15'
            }
          />
        ))}
      </div>

      <h1 className="mt-8 font-serif text-3xl font-semibold leading-tight text-forest md:text-4xl">
        {title}
      </h1>
      <p className="mt-3 text-sm leading-relaxed text-cocoa/65">{why}</p>

      <div className="mt-8 flex flex-col gap-3">{children}</div>
    </div>
  );
}
