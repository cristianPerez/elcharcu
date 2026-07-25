import { type ReactNode } from 'react';

import { cn } from '@/shared/lib';

import { type Product, type ProductAccent } from '../model/types';

interface ProductCardProps {
  readonly product: Product;
  /** Enlace de pedido (p. ej. WhatsApp). El widget lo inyecta. */
  readonly orderHref: string;
}

const ACCENT_PANEL: Record<ProductAccent, string> = {
  forest: 'bg-forest text-cream',
  terracota: 'bg-terracota text-cream',
  sage: 'bg-sage text-forest',
};

/** Tarjeta de producto reutilizable (capa entities). */
export function ProductCard({ product, orderHref }: ProductCardProps): ReactNode {
  return (
    <article className="group flex flex-col overflow-hidden rounded-2xl border border-cocoa/10 bg-white transition-shadow hover:shadow-lg">
      <div
        className={cn(
          'bg-grain flex h-36 items-center justify-center',
          ACCENT_PANEL[product.accent],
        )}
      >
        <span className="font-serif text-5xl font-semibold opacity-90">
          {product.name.charAt(0)}
        </span>
      </div>

      <div className="flex flex-1 flex-col p-6">
        <h3 className="font-serif text-xl font-semibold text-cocoa">{product.name}</h3>
        <p className="mt-2 flex-1 text-sm leading-relaxed text-cocoa/70">
          {product.description}
        </p>

        <div className="mt-5 flex items-end justify-between">
          <div>
            <span className="font-serif text-2xl font-semibold text-forest">
              {product.price}
            </span>
            <span className="ml-1 text-xs text-cocoa/50">/ {product.unit}</span>
          </div>
          <a
            href={orderHref}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm font-medium text-terracota transition-colors hover:text-terracota-dark"
          >
            Pedir →
          </a>
        </div>
      </div>
    </article>
  );
}
