'use client';

import { usePathname } from 'next/navigation';
import { type ReactNode } from 'react';

import { appRoutes } from '@/shared/config';
import { cn } from '@/shared/lib';

import { isTabActive } from './tabs';

interface FrameMainProps {
  readonly children: ReactNode;
}

/**
 * El `<main>` del marco. El asistente va A SANGRE —sin márgenes ni ancho
 * máximo— porque lleva su propia columna de recetas pegada al borde y su caja
 * de escribir pegada abajo; el resto de pantallas va centrado en 1200 px.
 */
export function FrameMain({ children }: FrameMainProps): ReactNode {
  const pathname = usePathname();
  const isChat = isTabActive(pathname, appRoutes.appAssistant);

  return (
    <main
      className={cn(
        'w-full flex-1',
        isChat
          ? 'pb-[calc(4rem+env(safe-area-inset-bottom))] md:pb-0'
          : 'mx-auto max-w-app overflow-x-clip px-5 pb-24 pt-6 md:px-8 md:pb-16 md:pt-8',
      )}
    >
      {children}
    </main>
  );
}
