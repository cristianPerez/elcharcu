'use client';

import { type ReactNode } from 'react';

import { cn } from '@/shared/lib';

interface ToggleProps {
  readonly checked: boolean;
  readonly onChange: (checked: boolean) => void;
  /** El nombre accesible: lo que se lee junto al interruptor. */
  readonly label: string;
  readonly disabled?: boolean | undefined;
}

/** Interruptor con `role="switch"`, 44 px de área táctil. */
export function Toggle({
  checked,
  onChange,
  label,
  disabled = false,
}: ToggleProps): ReactNode {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      disabled={disabled}
      onClick={() => {
        onChange(!checked);
      }}
      className="grid min-h-11 min-w-11 shrink-0 place-items-center disabled:opacity-50"
    >
      <span
        className={cn(
          'relative h-7 w-12 rounded-full transition-colors',
          checked ? 'bg-forest' : 'bg-cocoa/20',
        )}
      >
        <span
          className={cn(
            'absolute top-0.5 size-6 rounded-full bg-cream-white transition-transform',
            checked ? 'translate-x-[22px]' : 'translate-x-0.5',
          )}
        />
      </span>
    </button>
  );
}
