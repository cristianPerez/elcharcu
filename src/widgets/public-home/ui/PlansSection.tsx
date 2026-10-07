'use client';

import { useState, type ReactNode } from 'react';

import {
  DEFAULT_BILLING_CYCLE,
  freePlan,
  maestroPlan,
  priceFor,
  proPlan,
  type BillingCycle,
  type Plan,
} from '@/entities/plan';

import { cn } from '@/shared/lib';

import { BillingToggle } from './BillingToggle';
import { PlanCard } from './PlanCard';

const PLANS: readonly Plan[] = [freePlan, proPlan, maestroPlan];

/**
 * "Elige cómo aprender" (diseño final 01/02). En escritorio, las tres
 * tarjetas; en el celular, pestañas y una tarjeta (abre en Pro, como la 02).
 * Encima, anual o mensual: abre en anual y el cambio se ve en los precios.
 */
export function PlansSection(): ReactNode {
  const [activeId, setActiveId] = useState<Plan['id']>('pro');
  const [cycle, setCycle] = useState<BillingCycle>(DEFAULT_BILLING_CYCLE);
  const yearlySaving = priceFor(proPlan, 'anual')?.savingPercent ?? 0;

  return (
    <section
      aria-labelledby="planes-title"
      className="mx-auto w-full max-w-app px-5 md:px-8"
    >
      <h2
        id="planes-title"
        className="font-serif text-2xl font-semibold text-forest md:text-center md:text-[32px]"
      >
        Elige cómo aprender
      </h2>
      <p className="mt-2 hidden text-center text-cocoa-soft md:block">
        Cursos en video, El Charcu a tu lado y el recetario completo.
      </p>

      <div className="mt-5 flex justify-center md:mt-6">
        <BillingToggle
          cycle={cycle}
          onChange={setCycle}
          yearlySavingPercent={yearlySaving}
        />
      </div>

      <div
        role="tablist"
        aria-label="Planes"
        className="mt-4 grid grid-cols-3 rounded-full bg-cream-muted p-1 md:hidden"
      >
        {PLANS.map((plan) => (
          <button
            key={plan.id}
            type="button"
            role="tab"
            aria-selected={activeId === plan.id}
            onClick={() => setActiveId(plan.id)}
            className={cn(
              'min-h-11 rounded-full text-sm',
              activeId === plan.id
                ? 'bg-forest font-semibold text-cream-white'
                : 'text-cocoa-soft',
            )}
          >
            {plan.id === 'aprendiz' ? 'Aprendiz' : plan.id === 'pro' ? 'Pro' : 'Maestro'}
          </button>
        ))}
      </div>

      <ul className="mt-4 md:mt-8 md:grid md:grid-cols-3 md:gap-5">
        {PLANS.map((plan) => (
          <li
            key={plan.id}
            className={cn(activeId === plan.id ? 'block' : 'hidden', 'md:block')}
          >
            <PlanCard plan={plan} cycle={cycle} />
          </li>
        ))}
      </ul>
    </section>
  );
}
