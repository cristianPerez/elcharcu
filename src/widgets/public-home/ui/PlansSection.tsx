'use client';

import { useState, type ReactNode } from 'react';

import {
  formatUsd,
  freePlan,
  maestroPlan,
  planWhatsappHref,
  priceFor,
  proPlan,
  type Plan,
} from '@/entities/plan';

import { cn } from '@/shared/lib';
import { IconCheck } from '@/shared/ui';

import { SignupLink } from './SignupLink';

/** "US$ 7,49" → "US$7,49", como en el diseño. */
function money(amount: number): string {
  return formatUsd(amount).replace('US$ ', 'US$');
}

/** Lo que trae cada plan, con los cupos de `plans.ts` (los mismos que cumple la base). */
function featuresOf(plan: Plan): readonly string[] {
  const quota = `${String(plan.quota.questionsPerMonth)} preguntas y ${String(plan.quota.imagesPerMonth)} fotos al mes`;
  if (plan.id === 'aprendiz') {
    return ['Las 5 cápsulas', 'El curso de lomo de cerdo curado', quota];
  }
  if (plan.id === 'pro') {
    return ['Todos los cursos maestros en video', 'El recetario completo', quota];
  }
  return ['Todo lo de Pro', quota, 'Costo por porción y precio sugerido para vender'];
}

function PlanCard({ plan }: { readonly plan: Plan }): ReactNode {
  const yearly = priceFor(plan, 'anual');
  const isPro = plan.id === 'pro';

  return (
    <article
      className={cn(
        'flex h-full flex-col rounded-[20px] p-6',
        isPro
          ? 'bg-grain bg-forest text-cream-white'
          : 'border border-cocoa/10 bg-cream-white',
      )}
    >
      {isPro ? (
        <span className="mb-3 self-start rounded-full bg-brasa px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-cocoa">
          El más elegido
        </span>
      ) : null}
      <h3
        className={cn(
          'font-serif text-lg font-semibold',
          isPro ? 'text-cream-white' : 'text-forest',
        )}
      >
        {plan.name}
      </h3>
      {yearly === null ? (
        <p className="mt-3 font-serif text-3xl font-semibold text-forest">Gratis</p>
      ) : (
        <>
          <p className="mt-3">
            <span className="font-serif text-3xl font-semibold">
              {money(yearly.perMonthUsd)}
            </span>{' '}
            <span className={cn('text-sm', isPro ? 'text-cream/80' : 'text-cocoa-soft')}>
              /mes
            </span>
          </p>
          <p className={cn('mt-1 text-xs', isPro ? 'text-cream/75' : 'text-cocoa-soft')}>
            Se cobra {money(yearly.priceUsd)} una vez al año
          </p>
        </>
      )}
      <ul className="mt-4 flex flex-1 flex-col gap-2 text-sm">
        {featuresOf(plan).map((feature) => (
          <li key={feature} className="flex gap-2">
            <IconCheck size={15} className="mt-0.5 shrink-0" />
            {feature}
          </li>
        ))}
      </ul>
      {yearly === null ? (
        <SignupLink variant="outline" className="mt-6 w-full">
          Crear cuenta gratis
        </SignupLink>
      ) : (
        <a
          href={planWhatsappHref(plan, yearly)}
          target="_blank"
          rel="noopener noreferrer"
          className={cn(
            'mt-6 inline-flex min-h-12 w-full items-center justify-center rounded-full text-[15px] font-semibold transition-colors',
            isPro
              ? 'bg-brasa text-cocoa hover:bg-brasa-dark'
              : 'border border-forest text-forest hover:bg-cream',
          )}
        >
          Suscribirme
        </a>
      )}
    </article>
  );
}

const PLANS: readonly Plan[] = [freePlan, proPlan, maestroPlan];

/**
 * "Elige cómo aprender" (diseño final 01/02). En escritorio, las tres
 * tarjetas; en el celular, pestañas y una tarjeta (abre en Pro, como la 02).
 */
export function PlansSection(): ReactNode {
  const [activeId, setActiveId] = useState<Plan['id']>('pro');

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
            <PlanCard plan={plan} />
          </li>
        ))}
      </ul>
    </section>
  );
}
