import { type ReactNode } from 'react';

import { AssistantHero } from '@/widgets/assistant-hero';
import { BrandQuote } from '@/widgets/brand-quote';
import { BrandStory } from '@/widgets/brand-story';
import { MasterCourses } from '@/widgets/master-courses';
import { Pricing } from '@/widgets/pricing';
import { SiteFooter } from '@/widgets/site-footer';
import { SiteHeader } from '@/widgets/site-header';

/**
 * El home es la APP, no la tienda (2026-08-14).
 *
 * Va ordenado como el embudo, no como un catálogo:
 *   probar → confiar → ver qué gana → cuánto cuesta.
 *
 * El asistente abre porque el producto ES el argumento de venta (D14), y ya no
 * compite con una segunda portada: el Hero de la charcutería se mudó a
 * `/tienda` junto con productos, proceso y contacto.
 *
 * Solo composición: la lógica vive en las capas de abajo.
 */
export function HomePage(): ReactNode {
  return (
    <>
      <SiteHeader />
      <main>
        <AssistantHero />
        <BrandQuote />
        <MasterCourses />
        <Pricing />
        <BrandStory />
      </main>
      <SiteFooter />
    </>
  );
}
