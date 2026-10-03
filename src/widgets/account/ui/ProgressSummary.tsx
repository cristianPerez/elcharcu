import { type ReactNode } from 'react';

import { SectionHeader, StatTile } from '@/shared/ui';

export interface AccountProgress {
  readonly coursesInProgress: number;
  /** "Lomo curado 43%" cuando hay exactamente un curso en marcha. */
  readonly courseDetail: string | null;
  readonly capsulesDone: number;
  readonly capsulesTotal: number;
  readonly recipesActive: number;
  readonly recipesFinished: number;
}

/** "Tu avance": números reales, contados de la base. */
export function ProgressSummary({
  progress,
}: {
  readonly progress: AccountProgress;
}): ReactNode {
  const p = progress;
  return (
    <section aria-labelledby="progress-title">
      <SectionHeader id="progress-title" title="Tu avance" />
      <ul className="mt-4 grid grid-cols-3 gap-3 md:grid-cols-4 md:gap-4">
        <li>
          <StatTile
            value={p.coursesInProgress}
            label={
              <>
                {p.coursesInProgress === 1 ? 'Curso en marcha' : 'Cursos en marcha'}
                {p.courseDetail === null ? null : (
                  <span className="hidden md:inline"> · {p.courseDetail}</span>
                )}
              </>
            }
          />
        </li>
        <li>
          <StatTile
            value={p.capsulesDone}
            suffix={`/${String(p.capsulesTotal)}`}
            label="Cápsulas"
          />
        </li>
        <li>
          <StatTile value={p.recipesActive} label="Recetas en proceso" />
        </li>
        <li className="hidden md:block">
          <StatTile value={p.recipesFinished} label="Recetas terminadas" />
        </li>
      </ul>
    </section>
  );
}
