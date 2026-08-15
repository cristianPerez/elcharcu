'use client';

import { type ReactNode } from 'react';

import { STARTER_PROMPTS } from '@/entities/charcu-assistant';

import { ANALYTICS_EVENTS, track } from '@/shared/lib';

interface StarterPromptsProps {
  readonly onPick: (prompt: string) => void;
  readonly isDisabled: boolean;
}

/**
 * Con qué abre el asistente cuando todavía no hay conversación.
 *
 * Una caja vacía es una hoja en blanco, y ante una hoja en blanco la mayoría
 * se va sin escribir nada. Estas cuatro pastillas hacen dos cosas de un golpe:
 * enseñan de qué se puede hablar y arrancan la conversación con un toque.
 *
 * Desaparecen en cuanto hay primer mensaje: ya cumplieron.
 */
export function StarterPrompts({ onPick, isDisabled }: StarterPromptsProps): ReactNode {
  return (
    <div>
      <p className="text-sm text-cocoa/55">¿Con qué te ayudo?</p>

      <div className="mt-3 flex flex-wrap gap-2">
        {STARTER_PROMPTS.map((starter) => (
          <button
            key={starter.label}
            type="button"
            disabled={isDisabled}
            onClick={() => {
              track(ANALYTICS_EVENTS.assistantStarterPicked, { label: starter.label });
              onPick(starter.prompt);
            }}
            className="rounded-full border border-cocoa/15 bg-cream px-4 py-3 text-left text-sm text-cocoa/80 transition-colors hover:border-terracota hover:bg-cream-white hover:text-terracota focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-terracota active:scale-[0.97] disabled:opacity-50"
          >
            {starter.label}
          </button>
        ))}
      </div>
    </div>
  );
}
