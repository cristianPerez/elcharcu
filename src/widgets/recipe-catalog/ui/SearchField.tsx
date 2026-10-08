'use client';

import { useId, type ReactNode } from 'react';

import { IconSearch } from '@/shared/ui';

interface SearchFieldProps {
  readonly value: string;
  readonly onChange: (value: string) => void;
  readonly placeholder: string;
  readonly className?: string | undefined;
}

export function SearchField({
  value,
  onChange,
  placeholder,
  className,
}: SearchFieldProps): ReactNode {
  const id = useId();
  return (
    <div className={className}>
      <label htmlFor={id} className="sr-only">
        Buscar en el recetario
      </label>
      <div className="flex min-h-12 items-center gap-3 rounded-full border border-cocoa/15 bg-cream-white px-5 focus-within:border-forest">
        <IconSearch size={18} className="shrink-0 text-cocoa-soft" />
        <input
          id={id}
          type="search"
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder={placeholder}
          className="min-h-11 w-full bg-transparent text-[15px] text-cocoa outline-none placeholder:text-cocoa-muted"
        />
      </div>
    </div>
  );
}
