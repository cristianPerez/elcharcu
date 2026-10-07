'use client';

import { useAccountSession } from '@/features/lead-capture';

/**
 * Quién está mirando, para lo que la navegación enseña (2026-10-07).
 *
 *   · `anon`   → "Entrar" y "Crear cuenta gratis".
 *   · `user`   → "Cuenta", sus iniciales y, si paga, la insignia del plan.
 *   · `client` → todavía no se sabe en el servidor: las páginas ESTÁTICAS
 *                (las recetas) no pueden leer la sesión sin dejar de serlo, y
 *                volverlas dinámicas les sumaría latencia. Se resuelve en el
 *                navegador.
 */
export type FrameViewer =
  | { readonly kind: 'anon' }
  | { readonly kind: 'user'; readonly initials: string; readonly isPro: boolean }
  | { readonly kind: 'client' };

/** Lo que la navegación necesita, ya resuelto. */
export interface ResolvedViewer {
  readonly isSignedIn: boolean;
  /** Mientras se resuelve en el navegador, para no enseñar "Entrar" a quien ya entró. */
  readonly isPending: boolean;
  /** Vacío si no se conocen (páginas estáticas): se pinta el icono de cuenta. */
  readonly initials: string;
  readonly isPro: boolean;
}

export function useFrameViewer(viewer: FrameViewer): ResolvedViewer {
  const session = useAccountSession();

  if (viewer.kind === 'anon') {
    return { isSignedIn: false, isPending: false, initials: '', isPro: false };
  }
  if (viewer.kind === 'user') {
    return {
      isSignedIn: true,
      isPending: false,
      initials: viewer.initials,
      isPro: viewer.isPro,
    };
  }
  return {
    isSignedIn: session.isSignedIn,
    isPending: !session.isReady,
    initials: '',
    isPro: false,
  };
}
