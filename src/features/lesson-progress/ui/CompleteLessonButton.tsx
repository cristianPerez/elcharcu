'use client';

import { useRouter } from 'next/navigation';
import { useState, type ReactNode } from 'react';

import { saveLessonProgress } from '../lib/saveLessonProgress';

interface CompleteLessonButtonProps {
  readonly lessonId: string;
  readonly isDone: boolean;
  /** A dónde ir después: la siguiente lección, o el curso si era la última. */
  readonly nextHref: string;
}

/**
 * Dar la lección por vista y saltar a la siguiente.
 *
 * Las dos cosas en un solo botón a propósito: separarlas obliga a volver al
 * índice entre lección y lección, y ahí es donde la gente se sale. Mientras no
 * haya video (Bunny, paso 6) esto se marca a mano; cuando lo haya, el mismo
 * guardado lo dispara el reproductor al llegar al 90%.
 */
export function CompleteLessonButton({
  lessonId,
  isDone,
  nextHref,
}: CompleteLessonButtonProps): ReactNode {
  const router = useRouter();
  const [isSaving, setIsSaving] = useState(false);

  const handleClick = async (): Promise<void> => {
    if (isSaving) {
      return;
    }

    setIsSaving(true);
    // Si ya estaba vista, no se vuelve a escribir: solo se sigue.
    if (!isDone) {
      await saveLessonProgress({ lessonId, second: 0, completed: true });
    }
    router.push(nextHref);
    router.refresh();
  };

  return (
    <button
      type="button"
      disabled={isSaving}
      onClick={() => {
        void handleClick();
      }}
      className="w-full rounded-full bg-terracota-dark px-6 py-3.5 font-medium text-cream-white shadow-surface transition-shadow hover:shadow-raised focus:outline-none focus:ring-2 focus:ring-terracota focus:ring-offset-2 active:scale-[0.98] disabled:opacity-50"
    >
      {isSaving ? 'Guardando…' : isDone ? 'Siguiente lección' : 'Listo, siguiente'}
    </button>
  );
}
