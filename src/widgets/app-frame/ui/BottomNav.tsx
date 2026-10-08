'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { type ReactNode } from 'react';

import { appRoutes } from '@/shared/config';
import { cn } from '@/shared/lib';
import { NavPending } from '@/shared/ui';

import { type ResolvedViewer } from '../model/viewer';

import { activePath } from './activePath';
import { MAIN_TABS, accountTab, isTabActive } from './tabs';

/**
 * Barra de abajo, como una app del celular. Solo por debajo de 768 px: más
 * ancho, la navegación sube a `TopNav`.
 *
 * Es `fixed` y no `sticky` desde el rediseño (2026-10): el chat necesita que
 * la barra no se mueva al abrir el teclado, y el marco ya reserva su alto con
 * padding. Respeta la franja del iPhone con `env(safe-area-inset-bottom)`.
 *
 * Cada pestaña lleva su `NavPending`: la marca de arriba se pinta en el mismo
 * toque, sin esperar al servidor. Antes, entre el toque y el esqueleto había un
 * hueco mudo y la gente tocaba dos veces.
 */
interface BottomNavProps {
  readonly viewer: ResolvedViewer;
}

export function BottomNav({ viewer }: BottomNavProps): ReactNode {
  const pathname = activePath(usePathname());
  // Mientras se resuelve la sesión en una página estática, la cuarta pestaña
  // dice "Cuenta" y no "Entrar": invitar a entrar a quien ya entró es peor que
  // el caso contrario, que se corrige en un instante.
  const isAnonymous = !viewer.isSignedIn && !viewer.isPending;
  const tabs = [...MAIN_TABS, accountTab(!isAnonymous)];

  return (
    <nav
      aria-label="Navegación de la app"
      className="fixed inset-x-0 bottom-0 z-30 border-t border-cocoa/10 bg-cream-white pb-[env(safe-area-inset-bottom)] md:hidden"
    >
      <div className="mx-auto flex h-16 max-w-md items-stretch justify-around px-2">
        {tabs.map(({ href, label, Icon }) => {
          const isActive = isTabActive(pathname, href);

          return (
            <Link
              key={href}
              href={href}
              // Sin sesión, "Entrar" abre la hoja aquí mismo (SignupInterceptor):
              // no se sale de la app. El enlace a /entrar queda de respaldo.
              data-signup-trigger={
                isAnonymous && href === appRoutes.login ? 'menu_entrar' : undefined
              }
              aria-current={isActive ? 'page' : undefined}
              className={cn(
                'relative flex min-w-16 flex-1 flex-col items-center justify-center gap-1',
                'transition-transform [touch-action:manipulation] active:scale-[0.94]',
                isActive ? 'text-brasa-tinta' : 'text-cocoa-muted',
              )}
            >
              {/* La pestaña activa se marca ARRIBA con el naranja, el único
                  color de resalte de la marca. */}
              {isActive ? (
                <span
                  aria-hidden="true"
                  className="absolute top-0 h-[3px] w-12 rounded-b-full bg-brasa"
                />
              ) : (
                <NavPending className="absolute top-0">
                  <span className="h-[3px] w-12 animate-pulse rounded-b-full bg-brasa" />
                </NavPending>
              )}
              <Icon size={22} strokeWidth={isActive ? 2.1 : 1.8} />
              <span
                className={cn('text-[11px]', isActive ? 'font-semibold' : 'font-medium')}
              >
                {label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
