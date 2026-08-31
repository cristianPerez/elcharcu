import { type ReactNode } from 'react';

import { BrandStory } from '@/widgets/brand-story';
import { ContactCta } from '@/widgets/contact-cta';
import { Hero } from '@/widgets/hero';
import { ProcessSteps } from '@/widgets/process-steps';
import { ProductShowcase } from '@/widgets/product-showcase';
import { SiteFooter } from '@/widgets/site-footer';
import { SiteHeader } from '@/widgets/site-header';

/**
 * La charcutería de verdad: lo que se hace a mano en Manizales y se vende por
 * WhatsApp.
 *
 * Vive aparte del home desde el 2026-08-14. Son dos negocios con dos públicos
 * distintos: el que compra un salami en Manizales y el que cura en su casa en
 * cualquier parte de LATAM. Mezclados en una sola página, cada uno estorbaba
 * al otro.
 */
export function TiendaPage(): ReactNode {
  return (
    <>
      <SiteHeader />
      <main>
        <Hero />
        <BrandStory />
        <ProductShowcase />
        <ProcessSteps />
        <ContactCta />
      </main>
      <SiteFooter />
    </>
  );
}
