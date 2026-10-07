import Link from 'next/link';
import { type ReactNode } from 'react';

import { IconArrowRight } from '@/shared/ui';

interface RecipeCapsuleCardProps {
  readonly slug: string;
  readonly title: string;
  /** Su número en "Empieza por aquí". */
  readonly number: number;
}

/**
 * La cápsula con la que termina la receta (diseño final 07): sin Pro, la
 * receta no sigue con "recetas parecidas" sino con lo que enseña a hacerla.
 */
export function RecipeCapsuleCard({
  slug,
  title,
  number,
}: RecipeCapsuleCardProps): ReactNode {
  return (
    <Link
      href={`/cursos/${slug}`}
      className="mx-auto flex max-w-xl items-center gap-4 rounded-[20px] border border-brasa-light bg-capsule-current p-4"
    >
      <span
        aria-hidden="true"
        className="grid size-12 shrink-0 place-items-center rounded-xl bg-cream-white font-serif text-xl font-semibold text-brasa-tinta"
      >
        {number}
      </span>
      <span className="flex-1">
        <span className="block text-[11px] font-semibold uppercase tracking-eyebrow text-brasa-tinta">
          Cápsula gratis
        </span>
        <span className="block font-serif text-lg font-semibold text-cocoa">{title}</span>
      </span>
      <IconArrowRight size={18} className="text-brasa-tinta" />
    </Link>
  );
}
