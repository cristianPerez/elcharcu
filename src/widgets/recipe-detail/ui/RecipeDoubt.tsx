'use client';

import { type ReactNode } from 'react';

import { cn } from '@/shared/lib';

import { type RecipeDoubt as Doubt } from '../lib/recipeDoubts';
import { useRecipeAssistant } from '../model/RecipeAssistantProvider';

interface RecipeDoubtProps {
  readonly doubt: Doubt;
  /** El fondo sobre el que se pinta. */
  readonly tone?: 'light' | 'dark';
  /**
   * `card` lleva además la línea que explica qué pasa al tocar; `compact` es la
   * misma caja sin ella.
   *
   * ⚠️ Las DOS son la misma caja a propósito. Antes `compact` era un enlace
   * subrayado y no se entendía que abriera nada: se leía como una pregunta
   * retórica de la receta, no como un botón (Cristian, 2026-09-01). Lo que
   * cambia entre variantes es la densidad, nunca el lenguaje visual — si algo
   * abre El Charcu, se tiene que ver igual en los cuatro sitios.
   */
  readonly variant?: 'card' | 'compact';
  /** Cuál de las cuatro es. Viaja al evento para poder comparar entre ellas. */
  readonly slot: string;
}

/**
 * La duda de una receta: una caja que abre El Charcu con la pregunta escrita.
 *
 * Las 45 recetas eran la única página del sitio sin una sola llamada a la
 * acción: alguien llegaba de Google, leía la receta entera y se iba.
 *
 * ⚠️ ES LA MISMA CAJA QUE EN LAS LECCIONES (`views/app-leccion`): borde y fondo
 * de terracota, el rótulo "Pregúntale a El Charcu" arriba y la pregunta debajo.
 * No es una coincidencia de estilo — es que dentro del producto ya existe una
 * forma que significa "esto abre el asistente", y quien la aprendió en un curso
 * la reconoce en una receta sin que nadie se lo explique. Inventar aquí otra
 * cosa era hacer que la aprendiera dos veces.
 *
 * ⚠️ La receta NO se tapa. Esconder los ingredientes o el proceso detrás de un
 * clic se descartó a propósito (2026-08-31): las recetas atraen porque Google
 * las indexa COMPLETAS, y en curados una receta a medias es además un problema
 * de seguridad — nadie puede quedarse con el proceso y sin las cantidades de
 * nitrito.
 *
 * No monta un chat propio: le pide al proveedor que abra EL chat de la receta
 * con esta pregunta dentro, para que las cuatro dudas sean una conversación y
 * no cuatro.
 */
export function RecipeDoubt({
  doubt,
  tone = 'light',
  variant = 'card',
  slot,
}: RecipeDoubtProps): ReactNode {
  const assistant = useRecipeAssistant();
  const isDark = tone === 'dark';

  /*
    ⚠️ TERRACOTA TAMBIÉN SOBRE VERDE, y no es una elección estética.

    La Guía de Marca dice que terracota es el ÚNICO color de resalte y que solo
    aparece en lo que se toca. Esta caja empezó usando sage sobre el fondo
    oscuro —el color de los rótulos— y el resultado era que se confundía con la
    "Nota del charcutero" de al lado, que es texto y no se toca. Dos cajas casi
    iguales, una interactiva y otra no: quien las mira no tiene forma de saber
    cuál abre algo.
  */

  // Fuera de una receta no hay a quién preguntarle: mejor no pintar un botón
  // que no hace nada.
  if (assistant === null) {
    return null;
  }

  return (
    <button
      type="button"
      onClick={() => {
        assistant.ask(doubt.prompt, slot);
      }}
      className={cn(
        'block w-full rounded-2xl border text-left transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-terracota active:scale-[0.99]',
        variant === 'card' ? 'p-4 md:p-5' : 'px-4 py-3.5',
        isDark
          ? 'border-terracota/45 bg-terracota/10 hover:border-terracota hover:bg-terracota/20'
          : 'border-terracota/30 bg-terracota/5 hover:border-terracota hover:bg-terracota/10',
      )}
    >
      <span
        className={cn(
          'flex items-center gap-1.5 text-[11px] font-medium uppercase tracking-eyebrow',
          isDark ? 'text-terracota' : 'text-terracota-dark',
        )}
      >
        <span aria-hidden="true">💬</span>
        Pregúntale a El Charcu
      </span>

      <span
        className={cn(
          'mt-2 flex items-start gap-2 text-[17px] leading-snug md:text-base',
          isDark ? 'text-cream' : 'text-cocoa',
        )}
      >
        <span className="min-w-0 flex-1">{doubt.label}</span>
        <span aria-hidden="true" className={cn('shrink-0 text-terracota')}>
          →
        </span>
      </span>

      {variant === 'card' ? (
        <span
          className={cn(
            'mt-1.5 block text-[15px] leading-relaxed',
            isDark ? 'text-cream/65' : 'text-cocoa/65',
          )}
        >
          {assistant.canAsk
            ? 'Te contesta al instante, y puedes mandarle una foto de cómo va.'
            : 'Sin preguntas este mes. Vuelven el día 1.'}
        </span>
      ) : null}
    </button>
  );
}
