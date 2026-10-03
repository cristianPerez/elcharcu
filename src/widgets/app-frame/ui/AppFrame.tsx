import { type ReactNode } from 'react';

import { BottomNav } from './BottomNav';
import { FrameMain } from './FrameMain';
import { TopNav } from './TopNav';

interface AppFrameProps {
  readonly children: ReactNode;
  readonly initials: string;
}

/**
 * El marco de la app de quien ya entró.
 *
 * Es deliberadamente otra cosa que `AppShell` (el marco del embudo): aquí no
 * hay salidas al sitio público, porque el que ya entró no viene a que le
 * vendan otra vez. Viene a hacer algo.
 *
 * ⚠️ Cambió el 2026-10 con el rediseño. Antes era `max-w-md` en cualquier
 * pantalla —una app de celular estirada nunca—; ahora en escritorio la barra
 * de abajo pasa a menú arriba y el contenido se abre hasta 1200 px. Las
 * pantallas que todavía no se rediseñaron (el curso, la lección) se encogen
 * ellas solas a una columna, así que este marco no decide su ancho.
 *
 * El hueco de la barra fija de abajo lo reserva `FrameMain`, que también deja
 * al asistente ir a sangre.
 */
export function AppFrame({ children, initials }: AppFrameProps): ReactNode {
  return (
    <div className="flex min-h-dvh flex-col bg-cream">
      <TopNav initials={initials} />
      <FrameMain>{children}</FrameMain>
      <BottomNav />
    </div>
  );
}
