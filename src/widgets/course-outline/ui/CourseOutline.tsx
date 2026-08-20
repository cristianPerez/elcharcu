'use client';

import Link from 'next/link';
import { useState, type ReactNode } from 'react';

import { type CourseModule, type Lesson } from '@/entities/course';

import { cn } from '@/shared/lib';

interface CourseOutlineProps {
  readonly courseSlug: string;
  readonly modules: readonly CourseModule[];
  readonly completedIds: readonly string[];
  /**
   * El módulo que se abre solo al entrar: el que tiene la lección siguiente.
   * Abrir siempre el primero obliga a buscar cada vez que vuelve.
   */
  readonly openModuleId: string | null;
}

/**
 * El índice del curso: módulos plegables con sus lecciones dentro.
 *
 * En un celular el acordeón es lo correcto — el curso entero se ve de un
 * vistazo sin scrollear cincuenta filas, y solo se abre lo que interesa. Con
 * la lista abierta del todo, un curso de seis módulos son tres pantallas de
 * scroll antes de saber siquiera qué hay.
 */
export function CourseOutline({
  courseSlug,
  modules,
  completedIds,
  openModuleId,
}: CourseOutlineProps): ReactNode {
  const [openId, setOpenId] = useState<string | null>(
    openModuleId ?? modules[0]?.id ?? null,
  );
  const done = new Set(completedIds);

  return (
    <ul className="space-y-3">
      {modules.map((module, index) => {
        const isOpen = module.id === openId;
        const doneHere = module.lessons.filter((l) => done.has(l.id)).length;

        return (
          <li
            key={module.id}
            className="overflow-hidden rounded-2xl border border-cocoa/10 bg-cream-white shadow-surface"
          >
            <button
              type="button"
              aria-expanded={isOpen}
              onClick={() => {
                setOpenId(isOpen ? null : module.id);
              }}
              className="flex w-full items-center gap-3 px-5 py-4 text-left"
            >
              <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-cream text-xs font-medium text-cocoa/60">
                {index + 1}
              </span>
              <span className="flex-1">
                <span className="block font-medium text-forest">{module.title}</span>
                <span className="mt-0.5 block text-xs text-cocoa/55">
                  {doneHere} de {module.lessons.length} lecciones
                </span>
              </span>
              <span
                aria-hidden="true"
                className={cn(
                  'shrink-0 text-cocoa/40 transition-transform',
                  isOpen && 'rotate-90',
                )}
              >
                ›
              </span>
            </button>

            {isOpen ? (
              <ul className="border-t border-cocoa/10">
                {module.lessons.map((lesson) => (
                  <LessonLink
                    key={lesson.id}
                    courseSlug={courseSlug}
                    lesson={lesson}
                    isDone={done.has(lesson.id)}
                  />
                ))}
              </ul>
            ) : null}
          </li>
        );
      })}
    </ul>
  );
}

/** De qué está hecha la lección, dicho en una palabra. */
const KIND_LABEL: Record<Lesson['kind'], string> = {
  video: 'Video',
  pdf: 'PDF',
  imagen: 'Imagen',
  texto: 'Lectura',
};

interface LessonLinkProps {
  readonly courseSlug: string;
  readonly lesson: Lesson;
  readonly isDone: boolean;
}

function LessonLink({ courseSlug, lesson, isDone }: LessonLinkProps): ReactNode {
  return (
    <li>
      <Link
        href={`/cursos/${courseSlug}/${lesson.id}`}
        className="flex items-center gap-3 px-5 py-3.5 transition-colors active:bg-cream"
      >
        <span
          aria-hidden="true"
          className={cn(
            'flex size-5 shrink-0 items-center justify-center rounded-full border text-[11px]',
            isDone
              ? 'border-sage bg-sage text-cream-white'
              : 'border-cocoa/20 text-transparent',
          )}
        >
          ✓
        </span>
        <span className="flex-1 text-base text-cocoa">{lesson.title}</span>
        <span className="shrink-0 text-xs text-cocoa/45">{KIND_LABEL[lesson.kind]}</span>
      </Link>
    </li>
  );
}
