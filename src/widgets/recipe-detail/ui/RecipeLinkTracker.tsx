'use client';

import { useEffect, type ReactNode } from 'react';

import { ANALYTICS_EVENTS, track } from '@/shared/lib';

/**
 * ¿Llegó a esta receta por su link? Sí, si es la PRIMERA página que cargó el
 * navegador (un enlace de WhatsApp, Instagram, un buscador). Si llegó
 * navegando dentro de la app —el recetario, una búsqueda— la carga inicial
 * fue otra página.
 */
function landedHere(): boolean {
  const [entry] = performance.getEntriesByType('navigation');
  if (entry === undefined) {
    return true;
  }
  return new URL(entry.name).pathname === window.location.pathname;
}

/**
 * Apunta la receta en "Las que te llegaron" y mide `recipe_opened_by_link`
 * (diseño final, 2026-10-07). Después de pintar y sin esperar: la receta no
 * depende de esto. No pinta nada.
 */
export function RecipeLinkTracker({ slug }: { readonly slug: string }): ReactNode {
  useEffect(() => {
    if (!landedHere()) {
      return;
    }
    track(ANALYTICS_EVENTS.recipeOpenedByLink, { recipe_slug: slug });
    void fetch('/api/recetas/recibida', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ slug }),
      keepalive: true,
    }).catch(() => {});
  }, [slug]);

  return null;
}
