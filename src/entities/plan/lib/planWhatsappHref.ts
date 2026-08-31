import { site } from '@/shared/config';

import { type Plan, type PlanPrice } from '../model/plan.types';

import { formatUsd } from './formatUsd';

/**
 * El enlace de WhatsApp para pedir un plan, con el plan escrito en el mensaje.
 *
 * ⚠️ Vive aquí y no en cada pantalla porque LOS DOS sitios que venden —el muro
 * del cupo y la página de precios— tienen que mandar exactamente el mismo
 * mensaje. Estaba duplicado, y una copia se quedó atrás: los precios seguían
 * llevando al onboarding anónimo.
 *
 * Es el carril de cobro del lanzamiento (2026-08-31): no hay pasarela, así que
 * Cristian recibe el mensaje, manda el link de pago y activa la cuenta a mano.
 * Cuando entre OnePay (D21), esto se sustituye por el checkout.
 */
export function planWhatsappHref(plan: Plan, price: PlanPrice | null): string {
  const base = site.whatsappUrl.split('?')[0] ?? site.whatsappUrl;

  const message =
    price === null
      ? `Hola El Charcu, quiero saber más del plan ${plan.name} del asistente 🥩`
      : `Hola El Charcu, quiero el plan ${plan.name} ${price.cycle} (${formatUsd(price.priceUsd)}) del asistente 🥩`;

  return `${base}?text=${encodeURIComponent(message)}`;
}
