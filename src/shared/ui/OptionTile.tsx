import { type ReactNode } from 'react';

interface OptionTileProps {
  readonly label: string;
  readonly description?: string | undefined;
  readonly onSelect: () => void;
}

/** Botón de respuesta. Área de toque grande: se usa con las manos ocupadas. */
export function OptionTile({ label, description, onSelect }: OptionTileProps): ReactNode {
  return (
    <button
      type="button"
      onClick={onSelect}
      className="group flex w-full items-center justify-between gap-4 rounded-2xl border border-cream/20 bg-cream/5 px-5 py-4 text-left transition-colors duration-200 hover:border-terracota hover:bg-cream/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-terracota"
    >
      <span>
        <span className="block font-serif text-lg font-medium text-cream">{label}</span>
        {description === undefined ? null : (
          <span className="mt-1 block text-sm leading-relaxed text-cream/60">
            {description}
          </span>
        )}
      </span>
      <span
        aria-hidden
        className="shrink-0 text-lg text-cream/30 transition-colors group-hover:text-terracota"
      >
        →
      </span>
    </button>
  );
}
