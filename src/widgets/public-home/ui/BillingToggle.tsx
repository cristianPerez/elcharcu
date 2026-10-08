import { type ReactNode } from 'react';

import { type BillingCycle } from '@/entities/plan';

import { cn } from '@/shared/lib';

interface BillingToggleProps {
  readonly cycle: BillingCycle;
  readonly onChange: (cycle: BillingCycle) => void;
  /** Cuánto se ahorra pagando el año (de `plans.ts`): "Ahorra 25 %". */
  readonly yearlySavingPercent: number;
}

const OPTIONS: readonly { readonly id: BillingCycle; readonly label: string }[] = [
  { id: 'anual', label: 'Anual' },
  { id: 'mensual', label: 'Mensual' },
];

/**
 * Anual o mensual, encima de los planes (2026-10-07). Abre en anual
 * (`DEFAULT_BILLING_CYCLE`): el precio por mes más bajo es lo primero que se
 * ve; el mensual queda a un toque y cambia el precio de las tarjetas.
 */
export function BillingToggle({
  cycle,
  onChange,
  yearlySavingPercent,
}: BillingToggleProps): ReactNode {
  return (
    <div
      role="group"
      aria-label="Forma de pago"
      className="inline-flex rounded-full bg-cream-muted p-1"
    >
      {OPTIONS.map(({ id, label }) => {
        const isActive = cycle === id;
        return (
          <button
            key={id}
            type="button"
            aria-pressed={isActive}
            onClick={() => onChange(id)}
            className={cn(
              'flex min-h-11 items-center gap-2 rounded-full px-5 text-sm',
              isActive ? 'bg-forest font-semibold text-cream-white' : 'text-cocoa-soft',
            )}
          >
            {label}
            {id === 'anual' && yearlySavingPercent > 0 ? (
              <span
                className={cn(
                  'rounded-full px-2 py-0.5 text-[11px] font-semibold',
                  isActive
                    ? 'bg-brasa text-cocoa'
                    : 'bg-capsule-current text-brasa-tinta',
                )}
              >
                Ahorra {yearlySavingPercent} %
              </span>
            ) : null}
          </button>
        );
      })}
    </div>
  );
}
