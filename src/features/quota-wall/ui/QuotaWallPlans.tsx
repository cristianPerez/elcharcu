'use client';

import { type ReactNode } from 'react';

import { formatCop, plans, type Plan } from '@/entities/plan';

import { site } from '@/shared/config';
import { ANALYTICS_EVENTS, cn, track } from '@/shared/lib';

/**
 * Los planes dentro del muro de cupo, compactos: precio y cupo, nada más.
 *
 * ⚠️ Todavía no hay pasarela: cada botón abre WhatsApp con el plan escrito, que
 * es por donde El Charcu ya vende hoy. Cuando entre Mercado Pago se cambia el
 * `href` por el checkout y el evento pasa a llevar `rail: 'mercadopago'`.
 */
function whatsappHref(plan: Plan): string {
  const message = `Hola El Charcu, quiero el plan ${plan.name} (${formatCop(plan.priceCop)}) del asistente 🥩`;
  return `${site.whatsappUrl.split('?')[0] ?? site.whatsappUrl}?text=${encodeURIComponent(message)}`;
}

const paidPlans = plans.filter((plan) => plan.priceCop > 0);

export function QuotaWallPlans(): ReactNode {
  return (
    <div className="mt-6 grid items-start gap-4 md:grid-cols-2">
      {paidPlans.map((plan) => (
        <article
          key={plan.id}
          className={cn(
            'flex flex-col rounded-xl border p-5',
            plan.isHighlighted
              ? 'border-terracota bg-cream text-cocoa'
              : 'border-cream/20 text-cream',
          )}
        >
          <h3 className="font-serif text-lg font-semibold">{plan.name}</h3>

          <p className="mt-2 flex items-baseline gap-1">
            <span className="font-serif text-3xl font-semibold">
              {formatCop(plan.priceCop)}
            </span>
            <span
              className={cn(
                'text-xs',
                plan.isHighlighted ? 'text-cocoa/50' : 'text-cream/50',
              )}
            >
              {plan.billing === 'anual' ? '/año' : '/mes'}
            </span>
          </p>

          <p
            className={cn(
              'mt-3 flex-1 text-sm leading-relaxed',
              plan.isHighlighted ? 'text-cocoa/70' : 'text-cream/70',
            )}
          >
            {plan.quota.questionsPerMonth} preguntas y {plan.quota.imagesPerMonth} fotos
            cada mes.
          </p>

          <a
            href={whatsappHref(plan)}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => {
              track(ANALYTICS_EVENTS.subscriptionStarted, {
                plan_id: plan.id,
                price_cop: plan.priceCop,
                rail: 'whatsapp',
                from: 'quota_wall',
              });
            }}
            className={cn(
              'mt-5 inline-flex items-center justify-center rounded-full px-5 py-2.5 text-sm font-medium tracking-wide transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-terracota focus-visible:ring-offset-2',
              plan.isHighlighted
                ? 'bg-forest text-cream hover:bg-forest-dark'
                : 'bg-terracota text-cream hover:bg-terracota-dark',
            )}
          >
            {plan.ctaLabel}
          </a>
        </article>
      ))}
    </div>
  );
}
