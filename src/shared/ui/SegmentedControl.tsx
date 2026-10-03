import Link from 'next/link';
import { type ReactNode } from 'react';

import { cn } from '@/shared/lib';

interface Segment {
  readonly id: string;
  readonly label: string;
  readonly href: string;
}

interface SegmentedControlProps {
  readonly segments: readonly Segment[];
  readonly activeId: string;
  readonly label: string;
  readonly className?: string | undefined;
}

/** El selector Todos / Disponibles / Próximos. Cada opción es un enlace. */
export function SegmentedControl({
  segments,
  activeId,
  label,
  className,
}: SegmentedControlProps): ReactNode {
  return (
    <nav aria-label={label} className={cn('rounded-full bg-cream-muted p-1', className)}>
      <ul className="flex">
        {segments.map((segment) => {
          const active = segment.id === activeId;
          return (
            <li key={segment.id} className="flex-1">
              <Link
                href={segment.href}
                scroll={false}
                aria-current={active ? 'true' : undefined}
                className={cn(
                  'flex min-h-11 items-center justify-center whitespace-nowrap rounded-full px-4 text-sm transition-colors',
                  active
                    ? 'bg-cream-white font-semibold text-cocoa'
                    : 'text-cocoa-soft hover:text-cocoa',
                )}
              >
                {segment.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
