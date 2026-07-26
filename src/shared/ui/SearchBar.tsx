import { type ReactNode } from 'react';

import { cn } from '@/shared/lib';

interface SearchBarProps {
  readonly value: string;
  readonly onChange: (value: string) => void;
  readonly placeholder?: string;
  readonly className?: string;
}

/** Input tipo pill con lupa dibujada a mano — filtra una lista en el cliente. */
export function SearchBar({
  value,
  onChange,
  placeholder = 'Buscar recetas…',
  className,
}: SearchBarProps): ReactNode {
  return (
    <div
      className={cn(
        'flex items-center gap-2.5 rounded-full border border-cocoa/10 bg-white px-5 py-3',
        className,
      )}
    >
      <svg
        width="16"
        height="16"
        viewBox="0 0 16 16"
        fill="none"
        aria-hidden
        className="shrink-0 text-cocoa/50"
      >
        <circle cx="7" cy="7" r="5.5" stroke="currentColor" strokeWidth="1.5" />
        <line
          x1="11.2"
          y1="11.2"
          x2="15"
          y2="15"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
      </svg>
      <input
        type="text"
        value={value}
        onChange={(event) => {
          onChange(event.target.value);
        }}
        placeholder={placeholder}
        className="min-w-0 flex-1 border-none bg-transparent font-sans text-sm text-cocoa outline-none placeholder:text-cocoa/40"
      />
    </div>
  );
}
