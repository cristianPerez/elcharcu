'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { type ReactNode } from 'react';

import { appRoutes } from '@/shared/config';
import { cn } from '@/shared/lib';

import { APP_TABS, isTabActive } from './tabs';

interface TopNavProps {
  /** Las iniciales de quien entró, para el círculo de "Mi cuenta". */
  readonly initials: string;
}

/**
 * La misma navegación que la barra de abajo, arriba y pegada, desde 768 px.
 *
 * Con el wordmark a la izquierda: en escritorio la app se ve como una web, y
 * una web sin nombre arriba parece rota.
 */
export function TopNav({ initials }: TopNavProps): ReactNode {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-30 hidden border-b border-cocoa/10 bg-cream/95 backdrop-blur md:block">
      <div className="mx-auto flex h-[72px] max-w-app items-center justify-between px-8">
        <Link
          href={appRoutes.appCourses}
          className="font-serif text-[22px] font-semibold text-forest"
        >
          El Charcu
        </Link>

        <nav aria-label="Navegación de la app">
          <ul className="flex items-center gap-2">
            {APP_TABS.map(({ href, label, Icon }) => {
              const isActive = isTabActive(pathname, href);
              const isAccount = href === appRoutes.appAccount;

              return (
                <li key={href}>
                  <Link
                    href={href}
                    aria-current={isActive ? 'page' : undefined}
                    className={cn(
                      'flex min-h-11 items-center gap-2 rounded-full border px-4 text-sm transition-colors',
                      isActive
                        ? 'border-cocoa/10 bg-cream-white font-semibold text-brasa-tinta'
                        : 'border-transparent text-cocoa-soft hover:text-cocoa',
                    )}
                  >
                    {isAccount ? (
                      <span
                        aria-hidden="true"
                        className="grid size-7 place-items-center rounded-full bg-forest text-[11px] font-semibold text-cream-white"
                      >
                        {initials}
                      </span>
                    ) : (
                      <Icon size={18} />
                    )}
                    {label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </div>
    </header>
  );
}
