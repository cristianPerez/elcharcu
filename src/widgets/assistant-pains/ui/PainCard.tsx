import { type ReactNode } from 'react';

import { type Pain } from '../model/pains';

interface PainCardProps {
  readonly pain: Pain;
}

/** Una duda real del oficio y su respuesta corta. */
export function PainCard({ pain }: PainCardProps): ReactNode {
  return (
    <article className="rounded-2xl border border-cocoa/10 bg-white/50 p-6">
      <h3 className="font-serif text-xl font-semibold italic leading-snug text-forest">
        «{pain.question}»
      </h3>
      <p className="mt-3 text-sm leading-relaxed text-cocoa/70">{pain.answer}</p>
    </article>
  );
}
