'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState, type ReactNode } from 'react';

import { appRoutes } from '@/shared/config';
import { cn } from '@/shared/lib';
import { IconClose, IconSearch } from '@/shared/ui';

import { courseSearchHref, EMPTY_QUERY, type CourseQuery } from '../model/searchParams';

interface CourseSearchFieldProps {
  readonly placeholder?: string | undefined;
  /**
   * La búsqueda actual, con sus filtros: al escribir solo cambia `q`. En la
   * portada de cursos se envía al pulsar Enter; en la propia búsqueda (`live`)
   * se va actualizando mientras se escribe.
   */
  readonly query?: CourseQuery | undefined;
  readonly live?: boolean | undefined;
  /** El nombre accesible del campo. */
  readonly label?: string | undefined;
  /** Dónde se busca. Por defecto, la búsqueda general de cursos. */
  readonly basePath?: string | undefined;
  readonly autoFocus?: boolean | undefined;
  readonly className?: string | undefined;
}

const LIVE_DELAY_MS = 250;

/**
 * El buscador de cursos.
 *
 * Es un `<form role="search">` de verdad: Enter busca aunque el JavaScript no
 * haya llegado. Con `live`, la URL se reemplaza (no se apila) mientras se
 * escribe, para que "atrás" no tenga que deshacer letra por letra.
 *
 * En escritorio, "/" lleva al buscador, como en cualquier web que tenga uno.
 */
export function CourseSearchField({
  placeholder = 'Busca un curso, técnica o pieza',
  query = EMPTY_QUERY,
  live = false,
  basePath = appRoutes.appCoursesSearch,
  label = 'Buscar cursos',
  autoFocus = false,
  className,
}: CourseSearchFieldProps): ReactNode {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [value, setValue] = useState(query.q);
  const firstRender = useRef(true);
  // Los filtros vigentes, leídos al disparar y no como dependencia: cambian
  // con cada navegación que el propio efecto provoca.
  const queryRef = useRef(query);
  queryRef.current = query;

  useEffect(() => {
    function onKey(event: KeyboardEvent): void {
      const target = event.target;
      const typing =
        target instanceof HTMLInputElement ||
        target instanceof HTMLTextAreaElement ||
        (target instanceof HTMLElement && target.isContentEditable);
      if (event.key === '/' && !typing) {
        event.preventDefault();
        inputRef.current?.focus();
      }
    }
    window.addEventListener('keydown', onKey);
    return () => {
      window.removeEventListener('keydown', onKey);
    };
  }, []);

  useEffect(() => {
    if (!live) {
      return;
    }
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    const timer = window.setTimeout(() => {
      router.replace(courseSearchHref({ ...queryRef.current, q: value }, basePath), {
        scroll: false,
      });
    }, LIVE_DELAY_MS);
    return () => {
      window.clearTimeout(timer);
    };
  }, [value, live, router, basePath]);

  return (
    <form
      role="search"
      action={basePath}
      onSubmit={(event) => {
        event.preventDefault();
        router.push(courseSearchHref({ ...query, q: value }, basePath));
      }}
      className={cn(
        'flex h-[52px] items-center gap-3 rounded-full border bg-cream-white pl-4 pr-1.5 transition-colors focus-within:border-forest',
        live ? 'border-forest' : 'border-cocoa/15',
        className,
      )}
    >
      <IconSearch size={20} className="shrink-0 text-forest" />
      <label className="min-w-0 flex-1">
        <span className="sr-only">{label}</span>
        <input
          ref={inputRef}
          type="search"
          name="q"
          value={value}
          autoFocus={autoFocus}
          onChange={(event) => {
            setValue(event.target.value);
          }}
          placeholder={placeholder}
          enterKeyHint="search"
          className="w-full border-none bg-transparent text-[15px] text-cocoa outline-none placeholder:text-cocoa-muted [&::-webkit-search-cancel-button]:hidden"
        />
      </label>
      {value === '' ? (
        <kbd className="mr-2.5 hidden rounded border border-cocoa/20 px-1.5 text-xs text-cocoa-muted md:inline">
          /
        </kbd>
      ) : (
        <button
          type="button"
          aria-label="Borrar la búsqueda"
          onClick={() => {
            setValue('');
            inputRef.current?.focus();
          }}
          className="grid size-11 shrink-0 place-items-center rounded-full text-cocoa hover:bg-cream"
        >
          <span className="grid size-8 place-items-center rounded-full bg-cream-muted">
            <IconClose size={14} strokeWidth={2} />
          </span>
        </button>
      )}
    </form>
  );
}
