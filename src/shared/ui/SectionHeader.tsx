import Link from 'next/link';
import { type ReactNode } from 'react';

import { cn } from '@/shared/lib';

import { IconArrowRight } from './icons';

interface SectionHeaderProps {
  readonly title: string;
  /** El "Ver todos →" de la derecha. */
  readonly action?: { readonly href: string; readonly label: string } | undefined;
  /** Un dato corto a la derecha ("2 de 5 · gratis") cuando no hay enlace. */
  readonly aside?: ReactNode | undefined;
  readonly id?: string | undefined;
  readonly className?: string | undefined;
}

/** Título de sección: Fraunces en verde, sin antetítulo ni subtítulo. */
export function SectionHeader({
  title,
  action,
  aside,
  id,
  className,
}: SectionHeaderProps): ReactNode {
  return (
    <div className={cn('flex items-baseline justify-between gap-4', className)}>
      <h2 id={id} className="font-serif text-[19px] font-semibold text-forest md:text-xl">
        {title}
      </h2>
      {action === undefined ? (
        aside === undefined ? null : (
          <span className="shrink-0 text-sm text-cocoa-soft">{aside}</span>
        )
      ) : (
        <Link
          href={action.href}
          className="-my-3 inline-flex min-h-11 shrink-0 items-center gap-1 text-sm font-semibold text-brasa-tinta hover:text-brasa-dark"
        >
          {action.label}
          <IconArrowRight size={15} strokeWidth={2} />
        </Link>
      )}
    </div>
  );
}
