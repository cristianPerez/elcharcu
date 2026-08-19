'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { type ReactNode } from 'react';

import { appRoutes } from '@/shared/config';
import { cn } from '@/shared/lib';
import { IconAccount, IconCharcu, IconCourses, type IconProps } from '@/shared/ui';

interface Tab {
  readonly href: string;
  readonly label: string;
  readonly Icon: (props: IconProps) => ReactNode;
}

/**
 * El orden lo pidió Cristian: El Charcu EN EL CENTRO, que es el producto y el
 * sitio donde cae el pulgar, y los cursos primero, que es lo que se mira al
 * llegar. La cuenta a la derecha, donde todo el mundo la busca.
 */
const TABS: readonly Tab[] = [
  { href: appRoutes.appCourses, label: 'Mis cursos', Icon: IconCourses },
  { href: appRoutes.appAssistant, label: 'El Charcu', Icon: IconCharcu },
  { href: appRoutes.appAccount, label: 'Mi cuenta', Icon: IconAccount },
];

/**
 * Barra de abajo, como una app del celular.
 *
 * Va pegada al borde inferior (`sticky`) y respeta la franja del iPhone con
 * `env(safe-area-inset-bottom)`: sin eso, en un iPhone con barra de gestos el
 * último botón queda debajo de la raya y no se puede tocar.
 */
export function BottomNav(): ReactNode {
  const pathname = usePathname();

  return (
    <nav
      aria-label="Navegación de la app"
      className="sticky bottom-0 z-30 border-t border-cocoa/10 bg-cream-white pb-[env(safe-area-inset-bottom)]"
    >
      <div className="mx-auto flex h-16 max-w-md items-stretch justify-around px-2">
        {TABS.map(({ href, label, Icon }) => {
          const isActive = pathname === href || pathname.startsWith(`${href}/`);

          return (
            <Link
              key={href}
              href={href}
              aria-current={isActive ? 'page' : undefined}
              className={cn(
                'relative flex min-w-16 flex-1 flex-col items-center justify-center gap-1',
                'transition-transform [touch-action:manipulation] active:scale-[0.94]',
                isActive ? 'text-terracota-dark' : 'text-cocoa/50',
              )}
            >
              {/* La pestaña activa se marca ARRIBA con terracota, el único
                  color de resalte de la marca. */}
              {isActive ? (
                <span
                  aria-hidden="true"
                  className="absolute top-0 h-0.5 w-8 rounded-full bg-terracota"
                />
              ) : null}
              <Icon size={22} strokeWidth={isActive ? 2.1 : 1.8} />
              <span className="text-[11px] font-medium">{label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
