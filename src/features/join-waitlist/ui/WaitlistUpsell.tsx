'use client';

import Link from 'next/link';
import { useEffect, useRef, type ReactNode } from 'react';

import { appRoutes } from '@/shared/config';
import { IconClose } from '@/shared/ui';

interface WaitlistUpsellProps {
  readonly open: boolean;
  readonly courseTitle: string;
  readonly onClose: () => void;
}

/**
 * Lo que ve el usuario gratis al tocar "Avísame".
 *
 * La lista es solo para suscriptores (0021): le compra tiempo a Cristian para
 * grabar y deja limpia la señal de qué grabar primero. En vez de un botón que
 * no hace nada, se explica por qué y se ofrece la salida.
 *
 * Es un `<dialog>` nativo: trae el foco atrapado, Escape y el fondo inerte sin
 * escribir una línea de eso a mano.
 */
export function WaitlistUpsell({
  open,
  courseTitle,
  onClose,
}: WaitlistUpsellProps): ReactNode {
  const ref = useRef<HTMLDialogElement>(null);

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
      aria-labelledby="waitlist-upsell-title"
      className="w-[min(92vw,420px)] rounded-card bg-cream-white p-0 text-cocoa backdrop:bg-cocoa/40"
    >
      <div className="relative p-6">
        <button
          type="button"
          aria-label="Cerrar"
          onClick={onClose}
          className="absolute right-2 top-2 grid size-11 place-items-center rounded-full text-cocoa-soft hover:bg-cream"
        >
          <IconClose size={18} />
        </button>
        <h2
          id="waitlist-upsell-title"
          className="pr-10 font-serif text-xl font-semibold text-forest"
        >
          Te avisamos con El Charcu Pro
        </h2>
        <p className="mt-2 text-[15px] leading-relaxed text-cocoa-soft">
          La lista de espera de <strong className="text-cocoa">{courseTitle}</strong> es
          para suscriptores: con ellos decidimos qué curso se graba primero.
        </p>
        <Link
          href={appRoutes.subscription}
          className="mt-5 flex min-h-12 items-center justify-center rounded-full bg-brasa px-6 text-[15px] font-semibold text-cocoa transition-colors hover:bg-brasa-dark"
        >
          Ver El Charcu Pro
        </Link>
      </div>
    </dialog>
  );
}
