'use client';

import { type ReactNode, useEffect } from 'react';

import { ANALYTICS_EVENTS, track } from '@/shared/lib';

interface RecipeViewTrackerProps {
  readonly slug: string;
  readonly name: string;
  readonly tags: readonly string[];
}

/**
 * Envía el evento de vista de receta sin convertir el resto del árbol en cliente.
 *
 * ⚠️ Es EL DENOMINADOR del embudo de las recetas: cuántas veces se vio una
 * contra cuántas veces tocaron una duda. Por eso no hay eventos de impresión
 * por CTA — serían cuatro por visita y responderían la misma pregunta.
 *
 * El nombre estaba escrito a mano ('recipe_detail_view') en vez de salir del
 * catálogo, que existe justo para que el panel de Mixpanel no se llene de
 * variantes. Corregido el 2026-09-01 sin cambiar la cadena, para no partir en
 * dos el histórico que ya hay.
 */
export function RecipeViewTracker({
  slug,
  name,
  tags,
}: RecipeViewTrackerProps): ReactNode {
  useEffect(() => {
    track(ANALYTICS_EVENTS.recipeDetailViewed, {
      recipe_slug: slug,
      recipe_name: name,
      tags: tags.join(','),
    });
  }, [slug, name, tags]);

  return null;
}
