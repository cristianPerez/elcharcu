import { type ReactNode } from 'react';

import { AssistantHero } from '@/widgets/assistant-hero';
import { BrandQuote } from '@/widgets/brand-quote';
import { BrandStory } from '@/widgets/brand-story';
import { ContactCta } from '@/widgets/contact-cta';
import { Hero } from '@/widgets/hero';
import { MasterCourses } from '@/widgets/master-courses';
import { ProcessSteps } from '@/widgets/process-steps';
import { ProductShowcase } from '@/widgets/product-showcase';
import { SiteFooter } from '@/widgets/site-footer';
import { SiteHeader } from '@/widgets/site-header';

/**
 * FSD `views` layer: composes the full landing page from widgets.
 * Orchestration only — no business logic here.
 */
export function HomePage(): ReactNode {
  return (
    <>
      <SiteHeader />
      <main>
        <AssistantHero />
        <Hero />
        <BrandStory />
        <ProductShowcase />
        <ProcessSteps />
        <MasterCourses />
        <BrandQuote />
        <ContactCta />
      </main>
      <SiteFooter />
    </>
  );
}
