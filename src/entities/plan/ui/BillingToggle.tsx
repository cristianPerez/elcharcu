'use client';

import { type ReactNode } from 'react';

import { cn } from '@/shared/lib';

import { type BillingCycle } from '../model/plan.types';

interface BillingToggleProps {
  readonly cycle: BillingCycle;
  readonly onChange: (cycle: BillingCycle) => void;
  /** Cuánto se ahorra al año, para pintarlo en la pastilla. */
  readonly savingPercent: number;
  /** `true` sobre fondo oscuro (el muro), `false` sobre crema. */
  readonly onDark?: boolean;
}

const CYCLES: readonly { readonly value: BillingCycle; readonly label: string }[] = [
  { value: 'mensual', label: 'Mensual' },
  { value: 'anual', label: 'Anual' },
];

/**
 * Mes o año, para el mismo plan.
 *
 * Son dos botones de verdad con `aria-pressed`, no un interruptor decorativo:
 * quien navegue con teclado o lector de pantalla tiene que poder cambiar de
 * ciclo y saber cuál está puesto.
 */
export function BillingToggle({
  cycle,
  onChange,
  savingPercent,
  onDark = false,
}: BillingToggleProps): ReactNode {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <div
        className={cn(
          'inline-flex rounded-full border p-1',
          onDark ? 'border-cream/20' : 'border-cocoa/15',
        )}
      >
        {CYCLES.map((option) => {
          const isActive = option.value === cycle;

          return (
            <button
              key={option.value}
              type="button"
              aria-pressed={isActive}
              onClick={() => {
                onChange(option.value);
              }}
              className={cn(
                'rounded-full px-5 py-2 text-sm font-medium transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-terracota',
                isActive && 'bg-terracota text-cream',
                !isActive && onDark && 'text-cream/60 hover:text-cream',
                !isActive && !onDark && 'text-cocoa/55 hover:text-cocoa',
              )}
            >
              {option.label}
            </button>
          );
        })}
      </div>

      {savingPercent > 0 ? (
        <span
          className={cn(
            'rounded-full px-3 py-1 text-xs font-medium',
            onDark ? 'bg-sage/20 text-sage' : 'bg-forest/10 text-forest',
          )}
        >
          Ahorras {savingPercent}% al año
        </span>
      ) : null}
    </div>
  );
}
