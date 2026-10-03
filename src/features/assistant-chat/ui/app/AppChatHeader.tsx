import { type ReactNode } from 'react';

import { cn } from '@/shared/lib';
import { FitText, IconMenu, IconPencil } from '@/shared/ui';

interface AppChatHeaderProps {
  readonly title: string;
  readonly hasStarted: boolean;
  readonly onOpenMenu: () => void;
  readonly onNew: () => void;
}

/**
 * La cabecera del chat: el menú de recetas, el nombre de la receta y "nueva".
 *
 * ⚠️ PENDIENTE: debajo del nombre irían "2 kg · Paso 2 de 6 · Adobar" y la
 * barra de segmentos, y tocarla abriría el detalle. Necesita que el asistente
 * devuelva la receta estructurada (contrato aplazado, ver ESTADO.md).
 *
 * En escritorio la lista vive en la columna fija, así que el menú se esconde;
 * y con el chat en blanco la cabecera sobra (el saludo ya dice dónde estás).
 */
export function AppChatHeader({
  title,
  hasStarted,
  onOpenMenu,
  onNew,
}: AppChatHeaderProps): ReactNode {
  return (
    <header
      className={cn(
        'sticky top-0 z-20 flex h-14 items-center gap-1 border-b border-cocoa/10 bg-cream/95 px-2 backdrop-blur md:top-[72px]',
        // En escritorio y en blanco se oculta a la vista, no al lector de
        // pantalla: sigue siendo el h1 de la página.
        !hasStarted && 'border-transparent lg:sr-only',
      )}
    >
      <button
        type="button"
        onClick={onOpenMenu}
        aria-label="Mis recetas"
        className="grid size-11 shrink-0 place-items-center rounded-full text-forest hover:bg-cream-white lg:invisible"
      >
        <IconMenu size={22} />
      </button>
      <h1 className="min-w-0 flex-1 text-center font-serif text-lg font-semibold text-forest">
        <FitText>{title}</FitText>
      </h1>
      <button
        type="button"
        onClick={onNew}
        aria-label="Receta nueva"
        className={cn(
          'grid size-11 shrink-0 place-items-center rounded-full text-forest hover:bg-cream-white',
          !hasStarted && 'invisible',
        )}
      >
        <IconPencil size={20} />
      </button>
    </header>
  );
}
