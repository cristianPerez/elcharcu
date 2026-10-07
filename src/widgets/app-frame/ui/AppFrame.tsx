'use client';

import { type ReactNode } from 'react';

import {
  SignupDialog,
  SignupInterceptor,
  SignupPromptProvider,
} from '@/features/auth-by-email';

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
    // La hoja de crear cuenta vive aquí, en lo común a todas las pantallas:
    // la abre una cápsula, la 3.ª pregunta, "Avísame" o el menú.
    <SignupPromptProvider>
      <SignupInterceptor isActive={!resolved.isSignedIn && !resolved.isPending}>
        <div className="flex min-h-dvh flex-col bg-cream">
          <TopNav viewer={resolved} />
          <FrameMain layout={layout}>{children}</FrameMain>
          <BottomNav viewer={resolved} />
        </div>
      </SignupInterceptor>
      <SignupDialog />
    </SignupPromptProvider>
  );
}
