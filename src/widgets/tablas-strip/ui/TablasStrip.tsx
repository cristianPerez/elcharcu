import Link from 'next/link';
import { type ReactNode } from 'react';

import { getTablaSummaries, TablaCard } from '@/entities/tabla';

import { Container, Eyebrow } from '@/shared/ui';

/**
 * Las tablas, dentro de la página de recetas.
 *
 * Tenían su propio ítem en el menú para UNA sola tabla, y un ítem de menú para
 * un elemento promete una sección que no existe. Cristian lo quitó el
 * 2026-08-31 y las tablas se mudan aquí, que además es donde alguien las busca:
 * quien entra a recetas está pensando qué preparar, y una tabla de quesos es
 * justo eso.
 *
 * ⚠️ Las rutas `/tablas` y `/tablas/[slug]` NO se tocan. Dejan de anunciarse en
 * el menú, pero siguen respondiendo: esos enlaces pueden estar compartidos por
 * WhatsApp o guardados por alguien.
 *
 * No se pinta nada si no hay tablas, en vez de dejar un titular sobre un hueco.
 */
export function TablasStrip(): ReactNode {
  const tablas = getTablaSummaries();

  if (tablas.length === 0) {
    return null;
  }

  return (
    <section className="border-t border-cocoa/10 bg-cream py-14 md:py-20">
      <Container>
        <Eyebrow className="text-terracota-dark">Para montar</Eyebrow>
        <h2 className="mt-3 font-serif text-3xl font-semibold leading-tight text-forest md:text-4xl">
          Tablas
        </h2>
        <p className="mt-3 max-w-2xl text-base leading-relaxed text-cocoa/65">
          No todo se cura: a veces lo que hay que resolver es qué poner en la mesa.
        </p>

        <ul className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {tablas.map((tabla) => (
            <li key={tabla.slug}>
              <Link
                href={`/tablas/${tabla.slug}`}
                className="block h-full transition-transform active:scale-[0.99]"
              >
                <TablaCard tabla={tabla} className="h-full" />
              </Link>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
