import { type ReactNode } from 'react';

interface OptionTileProps {
  readonly label: string;
  readonly description?: string | undefined;
  readonly onSelect: () => void;
}

/**
 * Botón de respuesta. Área de toque grande: se usa con las manos ocupadas.
 *
 * Va sobre superficie CLARA (crema), como el resto de la app desde el
 * 2026-08-15. Antes asumía fondo verde y era la razón de que el onboarding
 * quedara con texto claro sobre claro al aclarar el marco.
 */
export function OptionTile({ label, description, onSelect }: OptionTileProps): ReactNode {
  return (
    <button
      type="button"
      onClick={onSelect}
      className="border-cocoa/12 group flex w-full items-center justify-between gap-4 rounded-2xl border bg-cream-white px-5 py-4 text-left shadow-surface transition-colors duration-200 hover:border-terracota hover:bg-cream focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-terracota active:scale-[0.99]"
    >
      <span>
        <span className="block font-serif text-lg font-medium text-forest">{label}</span>
        {description === undefined ? null : (
          <span className="mt-1 block text-sm leading-relaxed text-cocoa/65">
            {description}
          </span>
        )}
      </span>
      <span
        aria-hidden
        className="shrink-0 text-lg text-cocoa/30 transition-colors group-hover:text-terracota"
      >
        →
      </span>
    </button>
  );
}
