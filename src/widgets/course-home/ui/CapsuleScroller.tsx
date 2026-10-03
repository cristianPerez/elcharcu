'use client';

import { useEffect, useRef, type ReactNode } from 'react';

interface CapsuleScrollerProps {
  readonly children: ReactNode;
  /** El índice de la cápsula que toca: el carrusel arranca con ella a la vista. */
  readonly currentIndex: number;
}

/**
 * El carril de cápsulas. En el celular desliza de lado con scroll-snap; en
 * escritorio es una grilla y no hay nada que desplazar.
 *
 * Al montar, mueve el carril (no la página) hasta la cápsula actual. Con dos
 * hechas, la tercera quedaba a medio asomar en el borde y no se veía que era
 * la que tocaba.
 */
export function CapsuleScroller({
  children,
  currentIndex,
}: CapsuleScrollerProps): ReactNode {
  const rail = useRef<HTMLOListElement>(null);

  useEffect(() => {
    const node = rail.current;
    const card = node?.children.item(currentIndex);
    if (
      node === null ||
      !(card instanceof HTMLElement) ||
      node.scrollWidth <= node.clientWidth
    ) {
      return;
    }
    // Deja asomar la anterior: así se ve que hay camino hecho a la izquierda.
    node.scrollLeft = Math.max(0, card.offsetLeft - node.offsetLeft - 48);
  }, [currentIndex]);

  return (
    <ol
      ref={rail}
      className="-mx-5 mt-4 flex snap-x scroll-px-5 gap-3 overflow-x-auto px-5 pb-1 [scrollbar-width:none] md:mx-0 md:grid md:grid-cols-[repeat(auto-fit,minmax(180px,1fr))] md:overflow-visible md:px-0 [&::-webkit-scrollbar]:hidden"
    >
      {children}
    </ol>
  );
}
