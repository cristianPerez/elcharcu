import { type ReactNode } from 'react';

import {
  checkoutHref,
  formatUsd,
  maestroPlan,
  priceFor,
  type BillingCycle,
  type CheckoutLinks,
} from '@/entities/plan';

import { cn } from '@/shared/lib';

interface MaestroUpsellProps {
  /** Los enlaces de OnePay de este entorno (`charcu.plan_checkout`). */
  readonly checkoutLinks: CheckoutLinks;
}

/** El anual primero: es el que se ofrece por defecto en toda la web. */
const CYCLES: readonly { readonly cycle: BillingCycle; readonly label: string }[] = [
  { cycle: 'anual', label: 'Anual' },
  { cycle: 'mensual', label: 'Mensual' },
];

/**
 * "Pásate a El Charcu Maestro". La vista solo la monta si el plan actual NO es
 * Maestro: invitar a lo que ya tienes es ruido.
 *
 * ⚠️ Los botones van DIRECTO al checkout de OnePay del Maestro (2026-10-30).
 * Antes la tarjeta entera llevaba a `/asistente/suscripcion`, que solo ofrece
 * el Pro: quien tocaba "Ver plan Maestro" no encontraba el Maestro por ningún
 * lado. Si a un ciclo le falta enlace, `checkoutHref` cae a WhatsApp, como en
 * el resto de la web.
 */
export function MaestroUpsell({ checkoutLinks }: MaestroUpsellProps): ReactNode {
  const { questionsPerMonth, imagesPerMonth } = maestroPlan.quota;
  const pitch = `${String(questionsPerMonth)} preguntas, ${String(imagesPerMonth)} fotos y costos por porción para vender`;

  return (
    <div className="flex h-full flex-col rounded-card border border-cocoa/10 bg-cream-white p-4 md:p-6">
      <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-brasa-tinta">
        Siguiente nivel
      </span>
      <span className="mt-1.5 block font-serif text-[20px] font-semibold text-forest md:text-[22px]">
        Pásate a {maestroPlan.name}
      </span>
      <span className="mt-1 block text-[13px] leading-snug text-cocoa-soft md:mt-2 md:text-[15px]">
        {pitch}
      </span>
      <div className="mt-4 grid grid-cols-2 gap-2 md:mt-auto md:pt-5">
        {CYCLES.map(({ cycle, label }) => {
          const price = priceFor(maestroPlan, cycle);
          return (
            <a
              key={cycle}
              href={checkoutHref(maestroPlan, price, checkoutLinks)}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={
                price === null
                  ? `${label}, ${maestroPlan.name}`
                  : `${label}, ${formatUsd(price.priceUsd)}, ${maestroPlan.name}`
              }
              className={cn(
                'inline-flex min-h-11 flex-col items-center justify-center rounded-full px-3 text-sm font-semibold leading-tight',
                cycle === 'anual'
                  ? 'bg-brasa text-cocoa hover:bg-brasa-dark'
                  : 'border border-forest text-forest hover:bg-cream',
              )}
            >
              {label}
              {price === null ? null : (
                <span className="text-[12px] font-normal">
                  {formatUsd(price.priceUsd)}
                </span>
              )}
            </a>
          );
        })}
      </div>
    </div>
  );
}
