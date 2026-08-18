import Image from 'next/image';
import { type ReactNode } from 'react';

import { type Product } from '../model/types';

interface ProductCardProps {
  readonly product: Product;
  /** Enlace de pedido (p. ej. WhatsApp). El widget lo inyecta. */
  readonly orderHref: string;
}

/**
 * Tarjeta de producto.
 *
 * Antes enseñaba un cuadro de color con la inicial del producto — un marcador
 * de posición que nunca se sustituyó. Vender comida sin foto de la comida es
 * pedirle al cliente un acto de fe.
 *
 * Se usa `next/image` con `sizes` para que en un celular no se descargue la
 * versión de escritorio, que es la mitad del peso de la página en móvil.
 */
export function ProductCard({ product, orderHref }: ProductCardProps): ReactNode {
  return (
    <article className="group flex flex-col overflow-hidden rounded-2xl border border-cocoa/10 bg-cream-white shadow-surface transition-shadow hover:shadow-raised">
      <div className="relative h-40 overflow-hidden bg-cream">
        <Image
          src={product.image}
          alt={product.name}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
        />
      </div>

      <div className="flex flex-1 flex-col p-5">
        <h3 className="font-serif text-xl font-semibold text-forest">{product.name}</h3>
        <p className="mt-2 flex-1 text-sm leading-relaxed text-cocoa/70">
          {product.description}
        </p>

        <div className="mt-5 flex items-end justify-between gap-3">
          <div>
            <span className="font-serif text-2xl font-semibold text-forest">
              {product.price}
            </span>
            <span className="ml-1 text-xs text-cocoa/65">/ {product.unit}</span>
          </div>
          <a
            href={orderHref}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-full px-3 py-2 text-sm font-medium text-terracota-dark transition-colors hover:bg-cream focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-terracota"
          >
            Pedir
          </a>
        </div>
      </div>
    </article>
  );
}
