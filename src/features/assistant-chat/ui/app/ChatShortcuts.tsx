'use client';

import { type ReactNode } from 'react';

import { ANALYTICS_EVENTS, track } from '@/shared/lib';
import {
  IconCalculator,
  IconCamera,
  IconDoc,
  IconQuestion,
  type IconProps,
} from '@/shared/ui';

import { type ComposerPrefill } from '../../model/useComposer';

interface Shortcut {
  readonly id: string;
  readonly label: string;
  readonly hint: string;
  readonly Icon: (props: IconProps) => ReactNode;
  /** Lo que queda escrito en la caja. Termina abierto: falta la pieza o los kilos. */
  readonly text: string;
  readonly pickPhoto?: boolean;
}

/**
 * Los cuatro accesos de "¿Qué vas a preparar hoy?".
 *
 * NO mandan nada: dejan la frase empezada en la caja y el cursor al final.
 * Mandar por la persona le gastaría una pregunta del mes con una frase que no
 * escribió, y la mitad útil —qué pieza, cuántos kilos— solo la sabe ella.
 */
const SHORTCUTS: readonly Shortcut[] = [
  {
    id: 'receta',
    label: 'Empezar una receta',
    hint: 'Te guío paso a paso',
    Icon: IconDoc,
    text: 'Quiero empezar una receta de ',
  },
  {
    id: 'calcular',
    label: 'Calcular ingredientes',
    hint: 'Según tus kilos de carne',
    Icon: IconCalculator,
    text: 'Calcúlame los ingredientes para esta cantidad de carne: ',
  },
  {
    id: 'foto',
    label: 'Revisar con una foto',
    hint: 'Moho, color, textura',
    Icon: IconCamera,
    text: '¿Cómo ves mi pieza? ',
    pickPhoto: true,
  },
  {
    id: 'duda',
    label: 'Resolver una duda',
    hint: 'Humedad, tiempos, sal',
    Icon: IconQuestion,
    text: 'Tengo una duda: ',
  },
];

interface ChatShortcutsProps {
  readonly onPick: (prefill: Omit<ComposerPrefill, 'nonce'>) => void;
  readonly canSendImages: boolean;
}

export function ChatShortcuts({ onPick, canSendImages }: ChatShortcutsProps): ReactNode {
  return (
    <ul className="grid grid-cols-2 gap-3 lg:grid-cols-4">
      {SHORTCUTS.map(({ id, label, hint, Icon, text, pickPhoto }) => (
        <li key={id}>
          <button
            type="button"
            onClick={() => {
              track(ANALYTICS_EVENTS.assistantStarterPicked, { label });
              onPick({ text, pickPhoto: pickPhoto === true && canSendImages });
            }}
            className="flex h-full min-h-28 w-full flex-col justify-between gap-4 rounded-card border border-cocoa/10 bg-cream-white p-4 text-left transition-colors hover:border-cocoa/25"
          >
            <Icon size={20} className="text-forest" />
            <span>
              <span className="block text-[15px] font-semibold leading-snug text-cocoa">
                {label}
              </span>
              <span className="mt-0.5 block text-[13px] leading-snug text-cocoa-soft">
                {hint}
              </span>
            </span>
          </button>
        </li>
      ))}
    </ul>
  );
}
