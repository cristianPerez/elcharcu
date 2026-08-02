import { type ReactNode } from 'react';

import { type TitleDescription } from '@/entities/tabla';

interface PairingCardProps {
  readonly pairing: TitleDescription;
}

/** Tarjeta de maridaje (vino, cerveza…), sobre fondo verde. */
export function PairingCard({ pairing }: PairingCardProps): ReactNode {
  return (
    <div className="min-w-0 flex-1 rounded-2xl border border-cream/15 bg-cream/5 p-6">
      <h3 className="font-serif text-xl font-semibold text-cream">{pairing.title}</h3>
      <p className="mt-2.5 text-sm leading-relaxed text-cream/75">
        {pairing.description}
      </p>
    </div>
  );
}
