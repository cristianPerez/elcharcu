import { type ReactNode } from 'react';

import {
  formatUsd,
  planWhatsappHref,
  priceFor,
  type BillingCycle,
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

interface PlanCardProps {
  readonly plan: Plan;
  /** Anual o mensual: lo que eligió en el selector de la sección. */
  readonly cycle: BillingCycle;
}

/** Una tarjeta de plan, con el precio del ciclo elegido. */
export function PlanCard({ plan, cycle }: PlanCardProps): ReactNode {
  const price = priceFor(plan, cycle);
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
      {price === null ? (
        <p className="mt-3 font-serif text-3xl font-semibold text-forest">Gratis</p>
      ) : (
        <>
          <p className="mt-3">
            <span className="font-serif text-3xl font-semibold">
              {money(price.perMonthUsd)}
            </span>{' '}
            <span className={cn('text-sm', isPro ? 'text-cream/80' : 'text-cocoa-soft')}>
              /mes
            </span>
          </p>
          <p className={cn('mt-1 text-xs', isPro ? 'text-cream/75' : 'text-cocoa-soft')}>
            {price.cycle === 'anual'
              ? `Se cobra ${money(price.priceUsd)} una vez al año`
              : 'Se cobra cada mes · cancelas cuando quieras'}
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
      {price === null ? (
        <SignupLink variant="outline" className="mt-6 w-full">
          Crear cuenta gratis
        </SignupLink>
      ) : (
        <a
          href={planWhatsappHref(plan, price)}
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
