import Link from 'next/link';
import { type ReactNode } from 'react';

import { type CapsuleStep, type Course } from '@/entities/course';

import { Highlight, IconCheck, IconChevron, IconLock } from '@/shared/ui';

interface CapsuleResultsProps {
  readonly capsules: readonly Course[];
  readonly steps: ReadonlyMap<
    string,
    { readonly position: number; readonly state: CapsuleStep }
  >;
  readonly term: string;
}

const SUBTITLE: Record<CapsuleStep, (position: number) => string> = {
  completada: () => 'Completada',
  actual: () => 'Es la que te toca',
  bloqueada: (position) => `Se abre al terminar la cápsula ${String(position - 1)}`,
};

/** Las cápsulas que encontró la búsqueda, en lista y en el orden de la ruta. */
export function CapsuleResults({
  capsules,
  steps,
  term,
}: CapsuleResultsProps): ReactNode {
  return (
    <ul className="divide-y divide-cocoa/10 overflow-hidden rounded-card border border-cocoa/10 bg-cream-white">
      {capsules.map((capsule) => {
        const step = steps.get(capsule.id) ?? {
          position: 1,
          state: 'bloqueada' as const,
        };
        const isLocked = step.state === 'bloqueada';
        const body = (
          <>
            <span className="shrink-0 text-cocoa-soft">
              {step.state === 'completada' ? (
                <IconCheck size={18} className="text-forest" />
              ) : isLocked ? (
                <IconLock size={18} />
              ) : (
                <span className="grid size-[18px] place-items-center rounded-full bg-brasa text-[11px] font-semibold text-cocoa">
                  {step.position}
                </span>
              )}
            </span>
            <span className="min-w-0 flex-1">
              <span className="block text-[15px] leading-snug text-cocoa">
                <Highlight text={capsule.title} term={term} />
              </span>
              <span className="block text-[13px] text-cocoa-soft">
                {SUBTITLE[step.state](step.position)}
              </span>
            </span>
          </>
        );

        return (
          <li key={capsule.id}>
            {isLocked ? (
              <div className="flex min-h-16 items-center gap-3 px-4 py-3">{body}</div>
            ) : (
              <Link
                href={`/cursos/${capsule.slug}`}
                className="flex min-h-16 items-center gap-3 px-4 py-3 transition-colors hover:bg-cream/60"
              >
                {body}
                <IconChevron size={18} className="shrink-0 text-cocoa-muted" />
              </Link>
            )}
          </li>
        );
      })}
    </ul>
  );
}
