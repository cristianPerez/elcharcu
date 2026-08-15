'use client';

import { type ReactNode, useEffect, useRef, useState } from 'react';

import { cn } from '@/shared/lib';

interface TagFacetOption {
  readonly tag: string;
  readonly count: number;
  readonly active: boolean;
}

interface TagFacetDropdownProps {
  readonly label: string;
  readonly options: readonly TagFacetOption[];
  readonly onToggle: (tag: string) => void;
}

/** Pill con contador de activos que abre un popover de checkboxes por faceta. */
export function TagFacetDropdown({
  label,
  options,
  onToggle,
}: TagFacetDropdownProps): ReactNode {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const activeCount = options.filter((option) => option.active).length;

  useEffect(() => {
    if (!open) {
      return undefined;
    }
    const handleClickOutside = (event: MouseEvent): void => {
      if (rootRef.current && !rootRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [open]);

  if (options.length === 0) {
    return null;
  }

  return (
    <div ref={rootRef} className="relative">
      <button
        type="button"
        aria-expanded={open}
        onClick={() => setOpen((current) => !current)}
        className={cn(
          'flex items-center gap-1.5 rounded-full border px-3 py-1 text-[13px] transition-colors',
          activeCount > 0
            ? 'border-transparent bg-terracota text-cream'
            : 'border-cocoa/15 text-cocoa/70 hover:border-cocoa/30',
        )}
      >
        {label}
        {activeCount > 0 ? (
          <span className="rounded-full bg-cream/25 px-1.5 text-[11px]">
            {activeCount}
          </span>
        ) : null}
        <span aria-hidden className="text-[10px]">
          ▾
        </span>
      </button>

      {open ? (
        <div className="absolute left-0 top-full z-10 mt-2 min-w-[200px] rounded-xl border border-cocoa/10 bg-white p-2 shadow-lg">
          {options.map((option) => (
            <label
              key={option.tag}
              className="flex cursor-pointer items-center gap-2 rounded-lg px-2 py-1.5 text-[13px] text-cocoa/80 hover:bg-cream"
            >
              <input
                type="checkbox"
                checked={option.active}
                onChange={() => onToggle(option.tag)}
                className="accent-terracota"
              />
              <span className="flex-1">{option.tag}</span>
              <span className="text-cocoa/40">{option.count}</span>
            </label>
          ))}
        </div>
      ) : null}
    </div>
  );
}
