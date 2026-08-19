import { type ReactNode } from 'react';

import { BottomNav } from './BottomNav';

interface AppFrameProps {
  readonly children: ReactNode;
}

/**
 * El marco de la app de quien ya entró.
 *
 * Es deliberadamente otra cosa que `AppShell` (el marco del embudo): aquí no
 * hay encabezado de marca ni salidas al sitio público, porque el que ya pagó
 * —o ya entró— no viene a que le vendan otra vez. Viene a hacer algo.
 *
 * `max-w-md` en cualquier pantalla: esto se diseña como una app de celular,
 * igual que Manos Creadoras. Estirarla en un portátil la volvería una web, y
 * el público de El Charcu cura carne mirando el teléfono.
 */
export function AppFrame({ children }: AppFrameProps): ReactNode {
  return (
    <div className="flex min-h-dvh flex-col bg-cream">
      <main className="mx-auto w-full max-w-md flex-1 px-4 pb-10 pt-6">{children}</main>
      <BottomNav />
    </div>
  );
}
