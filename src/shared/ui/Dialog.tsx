'use client';

import { useEffect, useRef, type ReactNode } from 'react';

import { cn } from '@/shared/lib';

import { IconClose } from './icons';

interface DialogProps {
  readonly open: boolean;
  readonly onClose: () => void;
  readonly title: string;
  readonly children: ReactNode;
  /**
   * `center` es un aviso; `left` es un cajón que sale por la izquierda a toda
   * altura (el menú de recetas en el celular).
   */
  readonly placement?: 'center' | 'left' | 'sheet' | undefined;
  /**
   * Sin relleno ni título dibujado: el contenido pone su propia cabecera (la
   * hoja de crear cuenta lleva foto arriba). El título sigue nombrando al
   * diálogo para los lectores de pantalla.
   */
  readonly bare?: boolean | undefined;
  /** Para la cruz sobre una foto: el círculo claro del diseño. */
  readonly closeTone?: 'plain' | 'onImage' | undefined;
  /** El título se dibuja dentro; con `false` solo da nombre al diálogo. */
  readonly showTitle?: boolean | undefined;
  readonly className?: string | undefined;
}

/**
 * Un `<dialog>` nativo con `showModal()`.
 *
 * Nativo a propósito: trae gratis el foco atrapado, Escape para cerrar y el
 * fondo inerte, que son justo las tres cosas que un modal hecho a mano suele
 * olvidar. Tocar el fondo también cierra.
 */
export function Dialog({
  open,
  onClose,
  title,
  children,
  placement = 'center',
  showTitle = true,
  bare = false,
  closeTone = 'plain',
  className,
}: DialogProps): ReactNode {
  const ref = useRef<HTMLDialogElement>(null);
  const titleId = `dialog-${title.replace(/\W+/g, '-').toLowerCase()}`;

  useEffect(() => {
    const dialog = ref.current;
    if (dialog === null) {
      return;
    }
    if (open && !dialog.open) {
      dialog.showModal();
    }
    if (!open && dialog.open) {
      dialog.close();
    }
  }, [open]);

  return (
    <dialog
      ref={ref}
      onClose={onClose}
      onClick={(event) => {
        // El clic que cae en el propio <dialog> (y no en su contenido) es el fondo.
        if (event.target === event.currentTarget) {
          onClose();
        }
      }}
      aria-labelledby={titleId}
      className={cn(
        'bg-cream-white p-0 text-cocoa backdrop:bg-cocoa/40',
        placement === 'center' && 'w-[min(92vw,460px)] rounded-card',
        placement === 'left' &&
          'm-0 h-dvh max-h-dvh w-[min(85vw,340px)] max-w-none rounded-r-card',
        // Hoja desde abajo en el celular; modal centrado desde 768 px.
        placement === 'sheet' &&
          'mx-0 mb-0 mt-auto max-h-[92dvh] w-full max-w-none overflow-y-auto rounded-t-[24px] md:m-auto md:w-[min(92vw,500px)] md:rounded-[24px]',
        className,
      )}
    >
      <div
        className={cn(
          'relative',
          placement === 'left' ? 'flex h-full flex-col' : bare ? '' : 'p-6',
        )}
      >
        <h2
          id={titleId}
          className={cn(
            'font-serif text-xl font-semibold text-forest',
            showTitle && !bare
              ? placement === 'left'
                ? 'px-5 pb-2 pt-6'
                : 'pr-10'
              : 'sr-only',
          )}
        >
          {title}
        </h2>
        <button
          type="button"
          aria-label="Cerrar"
          onClick={onClose}
          className={cn(
            'absolute right-2 top-3 z-10 grid size-11 place-items-center rounded-full',
            closeTone === 'onImage'
              ? 'text-cocoa [&>svg]:box-content [&>svg]:rounded-full [&>svg]:bg-cream-white/90 [&>svg]:p-2'
              : 'text-cocoa-soft hover:bg-cream',
          )}
        >
          <IconClose size={18} />
        </button>
        {children}
      </div>
    </dialog>
  );
}
