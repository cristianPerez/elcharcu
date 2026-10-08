'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { type ReactNode } from 'react';

import { appRoutes } from '@/shared/config';
import { cn } from '@/shared/lib';
import { IconAccount } from '@/shared/ui';

import { type ResolvedViewer } from '../model/viewer';

import { activePath } from './activePath';
import { CreateAccountButton } from './CreateAccountButton';
import { MAIN_TABS, isTabActive } from './tabs';

interface TopNavProps {
  readonly viewer: ResolvedViewer;
}

/**
 * El menú de ESCRITORIO (diseño final 01 y 10): la marca, las tres pestañas
 * y, a la derecha, la cuenta. Sin sesión, "Entrar" y "Crear cuenta gratis";
 * con sesión, la insignia del plan si paga y sus iniciales.
 */
export function TopNav({ viewer }: TopNavProps): ReactNode {
  const pathname = activePath(usePathname());

  return (
    <header className="sticky top-0 z-30 hidden border-b border-cocoa/10 bg-cream/95 backdrop-blur md:block">
      <div className="mx-auto flex h-[72px] max-w-app items-center justify-between gap-6 px-8">
        <div className="flex items-center gap-8">
          <Link href={appRoutes.appCourses} className="flex flex-col leading-none">
            <span className="font-serif text-[22px] font-semibold text-forest">
              El Charcu
            </span>
            <span className="mt-1 text-[10px] uppercase tracking-eyebrow text-cocoa-soft">
              Artesanal
            </span>
          </Link>

          <nav aria-label="Navegación de la app">
            <ul className="flex items-center gap-1">
              {MAIN_TABS.map(({ href, label, Icon }) => {
                const isActive = isTabActive(pathname, href);
                return (
                  <li key={href}>
                    <Link
                      href={href}
                      aria-current={isActive ? 'page' : undefined}
                      className={cn(
                        'flex min-h-11 items-center gap-2 rounded-full border px-4 text-sm transition-colors',
                        isActive
                          ? 'border-cocoa/10 bg-cream-white font-semibold text-brasa-tinta shadow-sm'
                          : 'border-transparent text-cocoa-soft hover:text-cocoa',
                      )}
                    >
                      <Icon size={18} />
                      {label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>
        </div>

        <AccountArea viewer={viewer} />
      </div>
    </header>
  );
}

function AccountArea({ viewer }: { readonly viewer: ResolvedViewer }): ReactNode {
  if (viewer.isPending) {
    return <span aria-hidden="true" className="h-11 w-40" />;
  }

  if (!viewer.isSignedIn) {
    return (
      <div className="flex items-center gap-2">
        <Link
          href={appRoutes.login}
          data-signup-trigger="menu_entrar"
          className="flex min-h-11 items-center rounded-full px-4 text-sm font-semibold text-brasa-tinta hover:bg-cream-white"
        >
          Entrar
        </Link>
        <CreateAccountButton label="Crear cuenta gratis" />
      </div>
    );
  }

  return (
    <div className="flex items-center gap-3">
      {viewer.isPro ? (
        <span className="rounded-full bg-capsule-done px-3 py-1 text-xs font-semibold text-forest">
          Pro
        </span>
      ) : null}
      <Link
        href={appRoutes.appAccount}
        aria-label="Cuenta"
        className="grid size-11 place-items-center rounded-full bg-forest text-sm font-semibold text-cream-white"
      >
        {viewer.initials === '' ? <IconAccount size={20} /> : viewer.initials}
      </Link>
    </div>
  );
}
