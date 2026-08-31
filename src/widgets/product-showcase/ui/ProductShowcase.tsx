import { type ReactNode } from 'react';

import { ProductCard, products } from '@/entities/product';

import { site } from '@/shared/config';
import { ButtonLink, Container, Eyebrow } from '@/shared/ui';

/** Vitrina de producto artesanal — compone la entidad Product. */
export function ProductShowcase(): ReactNode {
  return (
    <section id="productos" className="bg-grain bg-forest py-16 text-cream md:py-24">
      <Container>
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <Eyebrow className="text-sage">Producto artesanal</Eyebrow>
            <h2 className="mt-6 max-w-lg font-serif text-4xl font-semibold leading-tight md:text-5xl">
              Curados y ahumados, hechos a mano.
            </h2>
          </div>
          <p className="max-w-sm text-sm leading-relaxed text-cream/75">
            Venta directa por WhatsApp e Instagram en {site.location}. Lotes pequeños,
            siempre frescos.
          </p>
        </div>

        <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              orderHref={site.whatsappUrl}
            />
          ))}
        </div>

        <div className="mt-8 flex justify-center">
          <ButtonLink href={site.whatsappUrl} external variant="primary">
            Hacer un pedido
          </ButtonLink>
        </div>
      </Container>
    </section>
  );
}
