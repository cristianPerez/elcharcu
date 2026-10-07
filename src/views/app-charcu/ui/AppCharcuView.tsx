import { Suspense, type ReactNode } from 'react';

import { AppAssistant } from '@/widgets/app-assistant';

/**
 * Pestaña del centro: el asistente, que es el producto.
 *
 * El `Suspense` no es adorno: `AppAssistant` lee `?pregunta=` para recibir la
 * duda que llega de una lección, y Next exige una frontera alrededor de quien
 * lee los parámetros de la URL o el build falla.
 */
interface AppCharcuViewProps {
  readonly isSignedIn: boolean;
}

export function AppCharcuView({ isSignedIn }: AppCharcuViewProps): ReactNode {
  return (
    <Suspense fallback={null}>
      <AppAssistant isSignedIn={isSignedIn} />
    </Suspense>
  );
}
