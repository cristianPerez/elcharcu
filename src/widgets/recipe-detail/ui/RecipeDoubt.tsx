'use client';

import { type ReactNode } from 'react';

import { cn } from '@/shared/lib';

import { type RecipeDoubt as Doubt } from '../lib/recipeDoubts';
import { useRecipeAssistant } from '../model/RecipeAssistantProvider';

interface RecipeDoubtProps {
  readonly doubt: Doubt;
  /** El fondo sobre el que se pinta. */
  readonly tone?: 'light' | 'dark';
}

/**
 * La duda de una receta: un botón que abre El Charcu con la pregunta escrita.
 *
 * Las 45 recetas eran la única página del sitio sin una sola llamada a la
 * acción: alguien llegaba de Google, leía la receta entera y se iba.
 *
 * ⚠️ La receta NO se tapa. La idea de esconder los ingredientes o el proceso
 * detrás de un clic se descartó a propósito (2026-08-31): las recetas atraen
 * porque Google las indexa COMPLETAS, así que taparlas sería matar el canal
 * para proteger el canal. Y en curados pesa más otra cosa — una receta a medias
 * es un problema de seguridad: nadie puede quedarse con el proceso y sin las
 * cantidades de nitrito.
 *
 * ⚠️ Esto ya NO monta un chat propio (2026-09-01). Montaba uno cada duda, y
 * eran dos conversaciones distintas en la misma página. Ahora solo le pide al
 * proveedor que abra EL chat de la receta con esta pregunta dentro.
 */
export function RecipeDoubt({ doubt, tone = 'light' }: RecipeDoubtProps): ReactNode {
  const assistant = useRecipeAssistant();
  const isDark = tone === 'dark';

  // Fuera de una receta no hay a quién preguntarle: mejor no pintar un botón
  // que no hace nada.
  if (assistant === null) {
    return null;
  }

  return (
    <button
      type="button"
      onClick={() => {
        assistant.ask(doubt.prompt);
      }}
      className={cn(
        'w-full rounded-2xl border px-5 py-4 text-left transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-terracota active:scale-[0.99]',
        isDark
          ? 'border-cream/15 bg-cream/5 hover:border-sage hover:bg-cream/10'
          : 'border-cocoa/10 bg-white hover:border-terracota',
      )}
    >
      <span
        className={cn(
          'block text-[11px] uppercase tracking-eyebrow',
          isDark ? 'text-sage' : 'text-terracota',
        )}
      >
        Pregúntale a El Charcu
      </span>
      <span
        className={cn('mt-1.5 block font-medium', isDark ? 'text-cream' : 'text-cocoa')}
      >
        {doubt.label}
      </span>
      <span
        className={cn('mt-1 block text-sm', isDark ? 'text-cream/65' : 'text-cocoa/65')}
      >
        {assistant.canAsk
          ? 'Te contesta al instante, y puedes mandarle una foto de cómo va.'
          : 'Sin preguntas este mes. Vuelven el día 1.'}
      </span>
    </button>
  );
}
