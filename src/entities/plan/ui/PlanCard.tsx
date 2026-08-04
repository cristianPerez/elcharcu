'use client';

import { type ReactNode } from 'react';

import { ANALYTICS_EVENTS, cn, track } from '@/shared/lib';

import { formatCop } from '../lib/formatCop';
import { type Plan, type PlanBilling } from '../model/plan.types';

interface PlanCardProps {
  readonly plan: Plan;
  readonly href: string;
}

const BILLING_SUFFIX: Record<PlanBilling, string> = {
  gratis: '',
  mensual: '/mes',
  anual: '/año',
};

/** Tarjeta de plan. Registra `plan_selected` para medir el embudo de pago. */
export function PlanCard({ plan, href }: PlanCardProps): ReactNode {
  const { isHighlighted } = plan;

  const handleClick = (): void => {
    track(ANALYTICS_EVENTS.planSelected, {
      plan_id: plan.id,
      billing: plan.billing,
      price_cop: plan.priceCop,
    });
  };

  return (
    <article
      className={cn(
        'flex flex-col rounded-2xl border p-7',
        isHighlighted
          ? 'bg-grain border-forest bg-forest text-cream shadow-xl shadow-forest/20'
          : 'border-cocoa/10 bg-cream text-cocoa shadow-sm',
      )}
    >
      {isHighlighted ? (
        <span className="mb-4 self-start rounded-full bg-terracota px-3 py-1 text-[11px] font-medium uppercase tracking-eyebrow text-cream">
          El más elegido
        </span>
      ) : null}

      <h3 className="font-serif text-2xl font-semibold">{plan.name}</h3>
      <p
        className={cn('mt-2 text-sm', isHighlighted ? 'text-cream/70' : 'text-cocoa/60')}
      >
        {plan.pitch}
      </p>

      <p className="mt-6 flex items-baseline gap-1">
        <span className="font-serif text-4xl font-semibold">
          {plan.priceCop === 0 ? 'Gratis' : formatCop(plan.priceCop)}
        </span>
        <span
          className={cn('text-sm', isHighlighted ? 'text-cream/60' : 'text-cocoa/50')}
        >
          {BILLING_SUFFIX[plan.billing]}
        </span>
      </p>

      <ul className="mt-6 flex flex-1 flex-col gap-3">
        {plan.features.map((feature) => (
          <li key={feature} className="flex gap-3 text-sm leading-relaxed">
            <span aria-hidden className="mt-0.5 shrink-0 text-terracota">
              ✓
            </span>
            <span className={isHighlighted ? 'text-cream/85' : 'text-cocoa/75'}>
              {feature}
            </span>
          </li>
        ))}
      </ul>

      <a
        href={href}
        onClick={handleClick}
        className={cn(
          'mt-8 inline-flex items-center justify-center rounded-full px-6 py-3 text-sm font-medium tracking-wide transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-terracota focus-visible:ring-offset-2',
          isHighlighted
            ? 'bg-terracota text-cream hover:bg-terracota-dark'
            : 'bg-forest text-cream hover:bg-forest-dark',
        )}
      >
        {plan.ctaLabel}
      </a>

      <p
        className={cn(
          'mt-3 text-center text-xs',
          isHighlighted ? 'text-cream/55' : 'text-cocoa/50',
        )}
      >
        {plan.note}
      </p>
    </article>
  );
}
