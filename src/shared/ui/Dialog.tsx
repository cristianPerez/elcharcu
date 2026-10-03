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
  readonly placement?: 'center' | 'left' | undefined;
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
        className,
      )}
    >
      <div
        className={cn('relative', placement === 'left' ? 'flex h-full flex-col' : 'p-6')}
      >
        <h2
          id={titleId}
          className={cn(
            'font-serif text-xl font-semibold text-forest',
            showTitle ? (placement === 'left' ? 'px-5 pb-2 pt-6' : 'pr-10') : 'sr-only',
          )}
        >
          {title}
        </h2>
        <button
          type="button"
          aria-label="Cerrar"
          onClick={onClose}
          className="absolute right-2 top-3 grid size-11 place-items-center rounded-full text-cocoa-soft hover:bg-cream"
        >
          <IconClose size={18} />
        </button>
        {children}
      </div>
    </dialog>
  );
}
