'use client';

import { type ReactNode } from 'react';

import { formatCop, plans, type Plan } from '@/entities/plan';

import { site } from '@/shared/config';
import { ANALYTICS_EVENTS, cn, track } from '@/shared/lib';

/**
 * Los planes de pago dentro del muro.
 *
 * ⚠️ Todavía no hay pasarela: cada botón abre WhatsApp con el plan escrito, que
 * es por donde El Charcu ya vende hoy. Cuando entre Mercado Pago se cambia el
 * `href` por el checkout y el evento pasa a llevar `rail: 'mercadopago'`.
 */
function whatsappHref(plan: Plan): string {
  const price = plan.priceCop === 0 ? '' : ` (${formatCop(plan.priceCop)})`;
  const message = `Hola El Charcu, quiero el plan ${plan.name}${price} del asistente 🥩`;
  return `${site.whatsappUrl.split('?')[0] ?? site.whatsappUrl}?text=${encodeURIComponent(message)}`;
}

/** Solo los planes de pago: dentro del muro el gratuito ya no aplica. */
const paidPlans = plans.filter((plan) => plan.priceCop > 0);

export function PaywallPlans(): ReactNode {
  return (
    <div className="mt-12 grid items-start gap-6 md:grid-cols-2">
      {paidPlans.map((plan) => (
        <article
          key={plan.id}
          className={cn(
            'flex flex-col rounded-2xl border p-7',
            plan.isHighlighted
              ? 'border-terracota bg-cream text-cocoa shadow-lg'
              : 'border-cream/20 text-cream',
          )}
        >
          <h3 className="font-serif text-2xl font-semibold">{plan.name}</h3>

          <p className="mt-4 flex items-baseline gap-1">
            <span className="font-serif text-4xl font-semibold">
              {formatCop(plan.priceCop)}
            </span>
            <span
              className={cn(
                'text-sm',
                plan.isHighlighted ? 'text-cocoa/50' : 'text-cream/50',
              )}
            >
              {plan.billing === 'anual' ? '/año' : '/mes'}
            </span>
          </p>

          <ul className="mt-6 flex flex-1 flex-col gap-2.5">
            {plan.features.map((feature) => (
              <li key={feature} className="flex gap-3 text-sm leading-relaxed">
                <span aria-hidden className="mt-0.5 shrink-0 text-terracota">
                  ✓
                </span>
                <span className={plan.isHighlighted ? 'text-cocoa/75' : 'text-cream/80'}>
                  {feature}
                </span>
              </li>
            ))}
          </ul>

          <a
            href={whatsappHref(plan)}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => {
              track(ANALYTICS_EVENTS.subscriptionStarted, {
                plan_id: plan.id,
                price_cop: plan.priceCop,
                rail: 'whatsapp',
              });
            }}
            className={cn(
              'mt-8 inline-flex items-center justify-center rounded-full px-6 py-3 text-sm font-medium tracking-wide transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-terracota focus-visible:ring-offset-2',
              plan.isHighlighted
                ? 'bg-forest text-cream hover:bg-forest-dark'
                : 'bg-terracota text-cream hover:bg-terracota-dark',
            )}
          >
            {plan.ctaLabel}
          </a>

          <p
            className={cn(
              'mt-3 text-center text-xs',
              plan.isHighlighted ? 'text-cocoa/50' : 'text-cream/45',
            )}
          >
            {plan.note}
          </p>
        </article>
      ))}
    </div>
  );
}
