'use client';

import { useEffect, useState, type ReactNode } from 'react';

import { CURING_PRODUCTS } from '@/entities/curing-profile';
import { loadSessions } from '@/entities/recipe-session';

import { Eyebrow, OptionTile } from '@/shared/ui';

import { useStartRecipe } from '../model/useStartRecipe';

/**
 * Elegir otra receta. No escondemos las que ya están abiertas ni marcamos
 * cuáles cobran: el usuario descubre el muro al elegir, no antes, porque el
 * catálogo completo es parte del argumento de venta.
 */
export function NewRecipePicker(): ReactNode {
  const { start } = useStartRecipe();
  const [openProducts, setOpenProducts] = useState<readonly string[]>([]);

  useEffect(() => {
    setOpenProducts(loadSessions().map((session) => session.product));
  }, []);

  return (
    <div>
      <Eyebrow className="text-sage">Otra receta</Eyebrow>

      <h1 className="mt-6 font-serif text-3xl font-semibold leading-tight text-cream md:text-4xl">
        ¿Qué vas a curar ahora?
      </h1>
      <p className="mt-3 text-sm leading-relaxed text-cream/60">
        Si eliges una que ya tenías abierta, vuelves justo donde la dejaste.
      </p>

      <div className="mt-8 flex flex-col gap-3">
        {CURING_PRODUCTS.map((product) => (
          <OptionTile
            key={product.id}
            label={product.name}
            description={
              openProducts.includes(product.id) ? 'Ya la tienes abierta' : undefined
            }
            onSelect={() => {
              start(product.id);
            }}
          />
        ))}
      </div>
    </div>
  );
}
