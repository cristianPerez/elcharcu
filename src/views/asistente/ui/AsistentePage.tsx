import { type ReactNode } from 'react';

import { AssistantCourses } from '@/widgets/assistant-courses';
import { AssistantCta } from '@/widgets/assistant-cta';
import { AssistantFaq } from '@/widgets/assistant-faq';
import { AssistantHero } from '@/widgets/assistant-hero';
import { AssistantHow } from '@/widgets/assistant-how';
import { AssistantPains } from '@/widgets/assistant-pains';
import { AssistantTrust } from '@/widgets/assistant-trust';
import { Pricing } from '@/widgets/pricing';
import { SiteFooter } from '@/widgets/site-footer';
import { SiteHeader } from '@/widgets/site-header';

import { type CheckoutLinks } from '@/entities/plan';

/**
 * Página de ventas del asistente — primer paso de la secuencia de construcción.
 * Orden deliberado: el miedo, la solución, la objeción, la prueba, el precio.
 * Solo composición: la lógica vive en las capas de abajo.
 */
export function AsistentePage({
  checkoutLinks,
}: {
  readonly checkoutLinks: CheckoutLinks;
}): ReactNode {
  return (
    <>
      <SiteHeader />
      <main>
        <AssistantHero />
        <AssistantPains />
        <AssistantHow />
        <AssistantTrust />
        <AssistantCourses />
        <Pricing checkoutLinks={checkoutLinks} />
        <AssistantFaq />
        <AssistantCta />
      </main>
      <SiteFooter />
    </>
  );
}
