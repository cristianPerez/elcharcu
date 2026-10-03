import Link from 'next/link';
import { type ReactNode } from 'react';

import { cn } from '@/shared/lib';

import { IconChevron } from './icons';

interface ListRowProps {
  readonly title: ReactNode;
  readonly subtitle?: ReactNode | undefined;
  readonly leading?: ReactNode | undefined;
  /** Lo de la derecha. Si no hay, y la fila navega, va un chevron. */
  readonly trailing?: ReactNode | undefined;
  readonly href?: string | undefined;
  /** Enlace que sale del sitio (WhatsApp): abre en otra pestaña. */
  readonly external?: boolean | undefined;
  readonly onClick?: () => void | undefined;
  readonly className?: string | undefined;
}

/**
 * Una fila de lista. Es un enlace, un botón o un bloque, según lo que haga:
 * nunca un `div` con `onClick`.
 */
export function ListRow({
  title,
  subtitle,
  leading,
  trailing,
  href,
  external = false,
  onClick,
  className,
}: ListRowProps): ReactNode {
  const isAction = href !== undefined || onClick !== undefined;
  const classes = cn(
    'flex min-h-14 w-full items-center gap-3 px-4 py-3 text-left',
    isAction && 'transition-colors hover:bg-cream/60',
    className,
  );

  const body = (
    <>
      {leading}
      <span className="min-w-0 flex-1">
        <span className="block text-[15px] font-medium leading-snug text-cocoa">
          {title}
        </span>
        {subtitle === undefined ? null : (
          <span className="mt-0.5 block text-[13px] leading-snug text-cocoa-soft">
            {subtitle}
          </span>
        )}
      </span>
      {trailing ??
        (isAction ? (
          <IconChevron size={18} className="shrink-0 text-cocoa-muted" />
        ) : null)}
    </>
  );

  if (href !== undefined) {
    return external ? (
      <a href={href} target="_blank" rel="noopener noreferrer" className={classes}>
        {body}
      </a>
    ) : (
      <Link href={href} className={classes}>
        {body}
      </Link>
    );
  }

  if (onClick !== undefined) {
    return (
      <button type="button" onClick={onClick} className={classes}>
        {body}
      </button>
    );
  }

  return <div className={classes}>{body}</div>;
}
