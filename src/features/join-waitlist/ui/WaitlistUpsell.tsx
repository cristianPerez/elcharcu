'use client';

import Link from 'next/link';
import { type ReactNode } from 'react';

import { appRoutes } from '@/shared/config';
import { Dialog } from '@/shared/ui';

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
 */
export function WaitlistUpsell({
  open,
  courseTitle,
  onClose,
}: WaitlistUpsellProps): ReactNode {
  return (
    <Dialog open={open} onClose={onClose} title="Te avisamos con El Charcu Pro">
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
    </Dialog>
  );
}
