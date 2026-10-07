'use client';

import { usePathname } from 'next/navigation';
import { type ReactNode } from 'react';

import { appRoutes } from '@/shared/config';
import { cn } from '@/shared/lib';

import { isTabActive } from './tabs';

/**
 * `contained`: centrado en 1200 px con su margen (Mis cursos, Cuenta…).
 * `bleed`: a todo lo ancho, para pantallas con bloques de borde a borde (la
 * portada sin cuenta, la receta). Cada sección pone su propio contenedor.
 */
export type FrameLayout = 'contained' | 'bleed';

interface FrameMainProps {
  readonly children: ReactNode;
  readonly layout: FrameLayout;
}

/**
 * El `<main>` del marco. El asistente va A SANGRE —sin márgenes ni ancho
 * máximo— porque lleva su propia columna de recetas pegada al borde y su caja
 * de escribir pegada abajo. Las pantallas `bleed`, también a sangre, pero con
 * el hueco de la barra de abajo en el celular.
 */
export function FrameMain({ children, layout }: FrameMainProps): ReactNode {
  const pathname = usePathname();
  const isChat = isTabActive(pathname, appRoutes.appAssistant);
  const isBleed = isChat || layout === 'bleed';

  return (
    <main
      className={cn(
        'w-full flex-1',
        isBleed
          ? 'overflow-x-clip pb-[calc(4rem+env(safe-area-inset-bottom))] md:pb-0'
          : 'mx-auto max-w-app overflow-x-clip px-5 pb-24 pt-6 md:px-8 md:pb-16 md:pt-8',
      )}
    >
      {children}
    </main>
  );
}
