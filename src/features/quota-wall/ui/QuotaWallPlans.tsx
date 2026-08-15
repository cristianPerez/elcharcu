'use client';

import { useState, type ReactNode } from 'react';

import {
  BillingToggle,
  DEFAULT_BILLING_CYCLE,
  formatUsd,
  priceFor,
  proPlan,
  type BillingCycle,
  type PlanPrice,
} from '@/entities/plan';

import { site } from '@/shared/config';
import { ANALYTICS_EVENTS, track } from '@/shared/lib';

/**
 * El plan de pago dentro del muro, con el mismo toggle que la página de precios.
 *
 * ⚠️ Todavía no hay pasarela: el botón abre WhatsApp con el plan escrito, que
 * es por donde El Charcu ya vende hoy. Cuando entre Hotmart (D17) se cambia el
 * `href` por el checkout y el evento pasa a llevar `rail: 'hotmart'`.
 */
function whatsappHref(price: PlanPrice): string {
  const cycle = price.cycle === 'anual' ? 'anual' : 'mensual';
  const message = `Hola El Charcu, quiero el plan ${proPlan.name} ${cycle} (${formatUsd(price.priceUsd)}) del asistente 🥩`;
  return `${site.whatsappUrl.split('?')[0] ?? site.whatsappUrl}?text=${encodeURIComponent(message)}`;
}

export function QuotaWallPlans(): ReactNode {
  const [cycle, setCycle] = useState<BillingCycle>(DEFAULT_BILLING_CYCLE);
  const price = priceFor(proPlan, cycle);
  const yearly = priceFor(proPlan, 'anual');

  if (price === null) {
    return null;
  }

  return (
    <div className="mt-6">
      <BillingToggle
        cycle={cycle}
        onChange={setCycle}
        savingPercent={yearly?.savingPercent ?? 0}
      />

      <article className="mt-6 rounded-2xl border border-cocoa/10 bg-cream p-6 text-cocoa">
        <h3 className="font-serif text-xl font-semibold">{proPlan.name}</h3>

        <p className="mt-2 flex items-baseline gap-1">
          <span className="font-serif text-4xl font-semibold">
            {formatUsd(price.perMonthUsd)}
          </span>
          <span className="text-sm text-cocoa/65">/mes</span>
        </p>

        {price.cycle === 'anual' ? (
          <p className="mt-1 text-xs text-cocoa/65">
            Se cobra {formatUsd(price.priceUsd)} una vez al año
          </p>
        ) : null}

        <p className="mt-4 text-sm leading-relaxed text-cocoa/70">
          {proPlan.quota.questionsPerMonth} preguntas y {proPlan.quota.imagesPerMonth}{' '}
          fotos cada mes.
        </p>

        <a
          href={whatsappHref(price)}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => {
            track(ANALYTICS_EVENTS.subscriptionStarted, {
              plan_id: proPlan.id,
              billing: price.cycle,
              price_usd: price.priceUsd,
              rail: 'whatsapp',
              from: 'quota_wall',
            });
          }}
          className="mt-6 inline-flex w-full items-center justify-center rounded-full bg-terracota-dark px-6 py-3 text-sm font-medium tracking-wide text-cream-white shadow-surface transition-shadow duration-200 hover:shadow-raised focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-terracota focus-visible:ring-offset-2 active:scale-[0.97]"
        >
          {proPlan.ctaLabel}
        </a>

        <p className="mt-3 text-center text-xs text-cocoa/65">{price.note}</p>
      </article>
    </div>
  );
}
