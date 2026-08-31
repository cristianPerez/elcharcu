'use client';

import Link from 'next/link';
import { type ReactNode, useState } from 'react';

import { useAccountSession } from '@/features/lead-capture';

import { appRoutes, navItems } from '@/shared/config';
import { cn } from '@/shared/lib';
import { ButtonLink, Container, Logo } from '@/shared/ui';

/**
 * Barra de navegación fija con logo, enlaces de ancla y el CTA principal.
 *
 * El CTA cambia según haya sesión o no (2026-08-31):
 *
 *   sin cuenta  →  "Probar ahora"  →  /entrar
 *   con cuenta  →  "Ir a la app"   →  /charcu
 *
 * A quien ya entró, ofrecerle "Probar ahora" y mandarlo a un formulario de
 * login es hacerle repetir algo que ya hizo. Y el ítem "Entrar" del menú
 * desaparece por lo mismo.
 *
 * ⚠️ La sesión se mira en el CLIENTE y no en el servidor a propósito. Este
 * encabezado va en páginas que se generan estáticas —`/recetas/[slug]` son 44—
 * y leer la sesión al renderizar las volvería dinámicas a todas. El precio es
 * un parpadeo: durante un tick se ve el estado sin cuenta. Se asume, porque la
 * inmensa mayoría de quien llega a la web pública no tiene sesión.
 */
export function SiteHeader(): ReactNode {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { isSignedIn, isReady } = useAccountSession();

  // Hasta que Supabase contesta se pinta el estado SIN cuenta: es el de la
  // mayoría, así que el parpadeo le toca a los menos.
  const hasSession = isReady && isSignedIn;
  const ctaHref = hasSession ? appRoutes.appAssistant : appRoutes.start;
  const ctaLabel = hasSession ? 'Ir a la app' : 'Probar ahora';

  // Con sesión, "Entrar" sobra: al lado hay un botón que lleva más lejos.
  const visibleNavItems = hasSession
    ? navItems.filter((item) => item.href !== appRoutes.login)
    : navItems;

  const closeMenu = (): void => {
    setIsMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 border-b border-cream/10 bg-forest/95 text-cream backdrop-blur">
      <Container className="flex items-center justify-between py-4">
        <Link href="/" aria-label="El Charcu — inicio">
          <Logo tone="light" />
        </Link>

        <nav className="hidden items-center gap-8 md:flex" aria-label="Principal">
          {visibleNavItems.map((item) => (
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
          <ButtonLink href={ctaHref} variant="primary">
            {ctaLabel}
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
            {visibleNavItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                onClick={closeMenu}
                className="rounded-lg px-3 py-3 text-sm text-cream/80 transition-colors hover:bg-cream/10 hover:text-cream"
              >
                {item.label}
              </a>
            ))}
            <ButtonLink href={ctaHref} variant="primary" className="mt-2">
              {ctaLabel}
            </ButtonLink>
          </Container>
        </nav>
      ) : null}
    </header>
  );
}
