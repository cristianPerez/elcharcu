import { type ReactNode } from 'react';

import { contactChannels, navItems, site } from '@/shared/config';
import { Container, Logo } from '@/shared/ui';

/** Pie de página con logo, navegación y datos de contacto. */
export function SiteFooter(): ReactNode {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-forest-dark text-cream">
      <Container className="py-16">
        <div className="grid gap-10 md:grid-cols-[1.5fr_1fr_1fr]">
          <div>
            <Logo tone="light" stacked />
            <p className="mt-5 max-w-xs text-sm leading-relaxed text-cream/75">
              Charcutería artesanal curada con técnica europea. {site.slogan}.
            </p>
            <p className="mt-4 text-xs text-cream/75">
              {site.location} · Desde {site.since}
            </p>
          </div>

          <nav aria-label="Explorar">
            <h2 className="text-xs uppercase tracking-eyebrow text-cream/75">Explorar</h2>
            <ul className="mt-4 space-y-3">
              {navItems.map((item) => (
                <li key={item.href}>
                  <a
                    href={item.href}
                    className="text-sm text-cream/75 transition-colors hover:text-cream"
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-label="Pedidos">
            <h2 className="text-xs uppercase tracking-eyebrow text-cream/75">Pedidos</h2>
            <ul className="mt-4 space-y-3">
              {contactChannels.map((channel) => (
                <li key={channel.label}>
                  <a
                    href={channel.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-cream/75 transition-colors hover:text-cream"
                  >
                    {channel.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <div className="mt-8 border-t border-cream/10 pt-6 text-center text-xs text-cream/75">
          © {year} {site.name}. Todos los derechos reservados.
        </div>
      </Container>
    </footer>
  );
}
