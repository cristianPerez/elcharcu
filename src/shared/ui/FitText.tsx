'use client';

import { useLayoutEffect, useRef, useState, type ReactNode } from 'react';

import { cn } from '@/shared/lib';

interface FitTextProps {
  readonly children: string;
  /** Tamaño en píxeles cuando el texto cabe de sobra. */
  readonly max?: number;
  /** Hasta dónde se deja encoger antes de rendirse y recortar. */
  readonly min?: number;
  readonly className?: string;
}

/**
 * Un texto de una sola línea que se encoge hasta caber.
 *
 * Nace de los nombres de las recetas, que van de "Merguez" (7 caracteres) a
 * "Chorizos Picantes de Jalapeño y Queso Cheddar" (45). Con un tamaño fijo, o
 * el corto se ve ridículamente pequeño o el largo se corta a la mitad — y un
 * nombre cortado en la cabecera del chat es justo el dato que estaba ahí para
 * decir "sé qué receta estás leyendo".
 *
 * Se mide UNA vez por cambio de ancho, no en bucle: se pinta al tamaño máximo,
 * se compara lo que ocupa contra lo que hay, y se baja en proporción. El
 * `ResizeObserver` mira la CAJA, no el texto — el texto cambia de tamaño y la
 * caja no, así que no se muerde la cola.
 *
 * Si ni al mínimo cabe, entonces sí se recorta con puntos suspensivos. Es el
 * último recurso, no el primero.
 */
export function FitText({
  children,
  max = 14,
  min = 10,
  className,
}: FitTextProps): ReactNode {
  const boxRef = useRef<HTMLSpanElement>(null);
  const textRef = useRef<HTMLSpanElement>(null);
  const [size, setSize] = useState(max);

  useLayoutEffect(() => {
    const box = boxRef.current;
    const text = textRef.current;
    if (box === null || text === null) {
      return undefined;
    }

    const fit = (): void => {
      // Se mide siempre desde el máximo: si se midiera desde el tamaño actual,
      // el texto solo sabría encoger y nunca volvería a crecer al ensancharse.
      text.style.fontSize = `${String(max)}px`;
      const needed = text.scrollWidth;
      const available = box.clientWidth;

      if (needed === 0 || available === 0) {
        return;
      }

      const next = needed <= available ? max : Math.max(min, (available / needed) * max);

      text.style.fontSize = `${String(next)}px`;
      setSize(next);
    };

    fit();

    const observer = new ResizeObserver(fit);
    observer.observe(box);
    return () => {
      observer.disconnect();
    };
  }, [children, max, min]);

  return (
    <span ref={boxRef} className={cn('block min-w-0 overflow-hidden', className)}>
      <span
        ref={textRef}
        style={{ fontSize: `${String(size)}px` }}
        className="block truncate whitespace-nowrap leading-tight"
      >
        {children}
      </span>
    </span>
  );
}
