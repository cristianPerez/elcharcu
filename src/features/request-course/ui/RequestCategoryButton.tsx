'use client';

import { useState, type ReactNode } from 'react';

import { type CourseCategory } from '@/entities/course';

import { cn } from '@/shared/lib';
import { IconCheck } from '@/shared/ui';

import { sendCourseRequest } from '../api/requestApi';

interface RequestCategoryButtonProps {
  readonly category: CourseCategory;
  /** En minúscula, para la frase: "Quiero un curso de quesos". */
  readonly label: string;
  readonly initiallyRequested: boolean;
}

/**
 * "Quiero un curso de X": un voto por una categoría vacía.
 *
 * Se marca al instante y se deshace si no se pudo guardar. Una vez pedido no
 * se "despide": no hay nada que deshacer, y un voto que se quita y se pone
 * solo ensucia la señal.
 */
export function RequestCategoryButton({
  category,
  label,
  initiallyRequested,
}: RequestCategoryButtonProps): ReactNode {
  const [requested, setRequested] = useState(initiallyRequested);
  const [failed, setFailed] = useState(false);

  async function request(): Promise<void> {
    setRequested(true);
    setFailed(false);
    const ok = await sendCourseRequest({ category });
    if (!ok) {
      setRequested(false);
      setFailed(true);
    }
  }

  return (
    <div>
      <button
        type="button"
        disabled={requested}
        onClick={() => {
          void request();
        }}
        className={cn(
          'inline-flex min-h-11 items-center gap-1.5 rounded-full border px-5 text-sm font-semibold transition-colors',
          requested
            ? 'border-sage-light bg-sage-light text-cocoa'
            : 'border-forest text-forest hover:bg-forest hover:text-cream-white',
        )}
      >
        {requested ? (
          <>
            <IconCheck size={15} strokeWidth={2.2} />
            Lo pediste: te avisamos
          </>
        ) : (
          `Quiero un curso de ${label}`
        )}
      </button>
      {failed ? (
        <p role="alert" className="mt-2 text-xs text-brasa-tinta">
          No se pudo guardar. Inténtalo otra vez.
        </p>
      ) : null}
    </div>
  );
}
