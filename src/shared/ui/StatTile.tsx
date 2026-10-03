import { type ReactNode } from 'react';

interface StatTileProps {
  readonly value: number;
  /** El "/5" que va pegado al número. */
  readonly suffix?: string;
  readonly label: string;
}

/** Un número destacado en Fraunces con su etiqueta debajo. */
export function StatTile({ value, suffix, label }: StatTileProps): ReactNode {
  return (
    <div className="rounded-card border border-cocoa/10 bg-cream-white p-4">
      <p className="font-serif text-[28px] font-semibold leading-none text-forest">
        {value}
        {suffix === undefined ? null : (
          <span className="text-base text-cocoa-soft">{suffix}</span>
        )}
      </p>
      <p className="mt-2 text-sm leading-snug text-cocoa-soft">{label}</p>
    </div>
  );
}
