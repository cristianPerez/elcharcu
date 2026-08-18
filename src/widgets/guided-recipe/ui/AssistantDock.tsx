'use client';

import { useEffect, useRef, type ReactNode } from 'react';

import { AssistantChat } from '@/features/assistant-chat';

import { useUsageQuota } from '@/entities/usage-quota';

import { cn } from '@/shared/lib';

interface AssistantDockProps {
  /** Qué se está curando, para que el maestro sepa de qué hablamos. */
  readonly product: string;
  readonly isOpen: boolean;
  readonly onToggle: () => void;
  /** Pregunta que llega de un paso. Se manda sola al abrir. */
  readonly pendingPrompt: string | null;
}

/** La marca de IA: una chispa. Sin librería de iconos — es un solo trazo. */
function SparkIcon(): ReactNode {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      className="h-5 w-5 shrink-0"
      fill="currentColor"
    >
      <path d="M12 2.5l1.9 5.3a3 3 0 0 0 1.8 1.8l5.3 1.9-5.3 1.9a3 3 0 0 0-1.8 1.8L12 20.5l-1.9-5.3a3 3 0 0 0-1.8-1.8L3 11.5l5.3-1.9a3 3 0 0 0 1.8-1.8L12 2.5z" />
      <path d="M19 2.5l.7 2 2 .7-2 .7-.7 2-.7-2-2-.7 2-.7.7-2z" opacity="0.7" />
    </svg>
  );
}

/**
 * El maestro, en dos formas según el ancho.
 *
 * En escritorio sobra sitio: el chat va abierto en su columna y se queda fijo
 * mientras se bajan los pasos, así que preguntar no cuesta ni un clic.
 *
 * En un celular no cabe al lado, y ponerlo debajo significaba bajar las cuatro
 * tarjetas para preguntar y perder la respuesta al volver al paso. Ahí es una
 * hoja que sube desde abajo — la postura de alguien con las manos en la carne.
 *
 * Es el MISMO chat en los dos casos: solo cambia el contenedor. Montar dos
 * serían dos conversaciones distintas, cada una pidiendo su historial.
 */
export function AssistantDock({
  product,
  isOpen,
  onToggle,
  pendingPrompt,
}: AssistantDockProps): ReactNode {
  const { status } = useUsageQuota();
  const panelRef = useRef<HTMLDivElement>(null);

  // Escape cierra. Es lo que la gente intenta antes de buscar la X.
  useEffect(() => {
    if (!isOpen) {
      return undefined;
    }

    const onKey = (event: KeyboardEvent): void => {
      if (event.key === 'Escape') {
        onToggle();
      }
    };

    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('keydown', onKey);
    };
  }, [isOpen, onToggle]);

  return (
    <>
      {/* Velo solo en móvil: en escritorio el chat convive con la receta. */}
      {isOpen ? (
        <button
          type="button"
          aria-label="Cerrar el chat"
          onClick={onToggle}
          className="fixed inset-0 z-40 bg-cocoa/40 backdrop-blur-[2px] lg:hidden"
        />
      ) : null}

      <div
        ref={panelRef}
        className={cn(
          'flex flex-col overflow-hidden border border-cocoa/10 bg-cream-white shadow-raised',
          // Móvil: hoja que sube desde abajo y deja ver la receta arriba.
          'fixed inset-x-0 bottom-0 z-50 max-h-[82dvh] rounded-t-2xl transition-all duration-300',
          isOpen
            ? 'pointer-events-auto translate-y-0 opacity-100'
            : 'pointer-events-none translate-y-6 opacity-0',
          // Escritorio: columna fija y SIEMPRE abierta. Se anulan una a una las
          // clases del móvil, porque es el mismo elemento.
          'lg:pointer-events-auto lg:sticky lg:inset-x-auto lg:bottom-auto lg:top-8 lg:z-auto lg:max-h-[calc(100dvh-6rem)] lg:translate-y-0 lg:rounded-2xl lg:opacity-100',
        )}
      >
        <header className="flex shrink-0 items-center justify-between gap-3 border-b border-cocoa/10 bg-cream px-4 py-3">
          <div className="flex items-center gap-2">
            <span className="text-terracota-dark">
              <SparkIcon />
            </span>
            <div>
              <p className="text-sm font-medium text-forest">El Charcu</p>
              <p className="text-xs text-cocoa/65">Curando {product.toLowerCase()}</p>
            </div>
          </div>

          {/* En escritorio no hay nada que cerrar: el chat es parte de la página. */}
          <button
            type="button"
            onClick={onToggle}
            aria-label="Cerrar el chat"
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-xl text-cocoa/65 transition-colors hover:bg-cocoa/5 hover:text-cocoa focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-terracota lg:hidden"
          >
            <span aria-hidden>×</span>
          </button>
        </header>

        <div className="flex-1 overflow-y-auto overscroll-contain p-4 lg:max-h-[32rem]">
          <AssistantChat
            product={product}
            level="apasionado"
            country="Colombia"
            canSendImages={!status.areImagesExhausted}
            pendingPrompt={pendingPrompt}
          />
        </div>
      </div>

      {/* La burbuja es solo de móvil: en escritorio el chat ya está abierto. */}
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={isOpen}
        className={cn(
          'fixed bottom-5 right-5 z-40 flex h-14 items-center gap-2 rounded-full bg-forest pl-4 pr-5 text-cream-white shadow-raised transition-all duration-300 hover:bg-forest-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-terracota focus-visible:ring-offset-2 active:scale-[0.97] lg:hidden',
          isOpen && 'pointer-events-none translate-y-4 opacity-0',
        )}
      >
        <SparkIcon />
        <span className="text-sm font-medium">Pregúntale al Charcu</span>
      </button>
    </>
  );
}
