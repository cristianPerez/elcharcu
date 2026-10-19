import { type Plan, type PlanPrice } from '../model/plan.types';

import { planWhatsappHref } from './planWhatsappHref';

/** El enlace de OnePay de cada `billingId` ('pro-mensual', 'pro-anual'…). */
export type CheckoutLinks = Readonly<Record<string, string>>;

/**
 * A dónde lleva el botón de pagar: al checkout de OnePay si ese plan y ciclo ya
 * tienen enlace (`charcu.plan_checkout`: el Pro desde 0050, el Maestro desde
 * 0054); si no, a WhatsApp como antes, para no mandar a nadie a un pago que no
 * existe.
 */
export function checkoutHref(
  plan: Plan,
  price: PlanPrice | null,
  links: CheckoutLinks,
): string {
  const url = price === null ? undefined : links[price.billingId];
  return url ?? planWhatsappHref(plan, price);
}
