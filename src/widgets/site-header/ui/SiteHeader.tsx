'use client';

import { type ReactNode, useState } from 'react';

import { navItems, site } from '@/shared/config';
import { cn } from '@/shared/lib';
import { ButtonLink, Container, Logo } from '@/shared/ui';

/** Barra de navegación fija con logo, enlaces de ancla y CTA de WhatsApp. */
export function SiteHeader(): ReactNode {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const closeMenu = (): void => {
    setIsMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 border-b border-cream/10 bg-forest/95 text-cream backdrop-blur">
      <Container className="flex items-center justify-between py-4">
        <a href={site.homeUrl} aria-label="El Charcu — inicio">
          <Logo tone="light" />
        </a>

        <nav className="hidden items-center gap-8 md:flex" aria-label="Principal">
          {navItems.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="text-sm text-cream/80 transition-colors hover:text-cream"
            >
              {item.label}
            </a>
          ))}
        </nav>

        <div className="hidden md:block">
          <ButtonLink href={site.whatsappUrl} external variant="primary">
            Pedir ahora
          </ButtonLink>
        </div>

        <button
          type="button"
          className="flex h-10 w-10 items-center justify-center rounded-full border border-cream/20 md:hidden"
          aria-expanded={isMenuOpen}
          aria-controls="mobile-menu"
          aria-label={isMenuOpen ? 'Cerrar menú' : 'Abrir menú'}
          onClick={() => {
            setIsMenuOpen((open) => !open);
          }}
        >
          <span className="relative block h-3 w-5">
            <span
              className={cn(
                'absolute left-0 top-0 h-0.5 w-5 bg-cream transition-transform',
                isMenuOpen && 'translate-y-[5px] rotate-45',
              )}
            />
            <span
              className={cn(
                'absolute bottom-0 left-0 h-0.5 w-5 bg-cream transition-transform',
                isMenuOpen && '-translate-y-[5px] -rotate-45',
              )}
            />
          </span>
        </button>
      </Container>

      {isMenuOpen ? (
        <nav
          id="mobile-menu"
          className="border-t border-cream/10 md:hidden"
          aria-label="Móvil"
        >
          <Container className="flex flex-col gap-1 py-4">
            {navItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                onClick={closeMenu}
                className="rounded-lg px-3 py-3 text-sm text-cream/80 transition-colors hover:bg-cream/10 hover:text-cream"
              >
                {item.label}
              </a>
            ))}
            <ButtonLink
              href={site.whatsappUrl}
              external
              variant="primary"
              className="mt-2"
            >
              Pedir ahora
            </ButtonLink>
          </Container>
        </nav>
      ) : null}
    </header>
  );
}
