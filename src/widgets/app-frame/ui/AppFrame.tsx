'use client';

import { type ReactNode } from 'react';

import { type FrameViewer, useFrameViewer } from '../model/viewer';

import { BottomNav } from './BottomNav';
import { FrameMain, type FrameLayout } from './FrameMain';
import { TopNav } from './TopNav';

interface AppFrameProps {
  readonly children: ReactNode;
  /** Quién mira: decide "Entrar" o "Cuenta" (ver `FrameViewer`). */
  readonly viewer: FrameViewer;
  readonly layout?: FrameLayout | undefined;
}

/**
 * El marco de la app para TODOS, con o sin cuenta (diseño final, 2026-10-07):
 * menú arriba en escritorio, barra abajo en el celular, y en medio la
 * pantalla. Antes solo existía detrás del login; ahora también lo usan la
 * portada sin cuenta y las recetas.
 */
export function AppFrame({
  children,
  viewer,
  layout = 'contained',
}: AppFrameProps): ReactNode {
  const resolved = useFrameViewer(viewer);

  return (
    <div className="flex min-h-dvh flex-col bg-cream">
      <TopNav viewer={resolved} />
      <FrameMain layout={layout}>{children}</FrameMain>
      <BottomNav viewer={resolved} />
    </div>
  );
}
