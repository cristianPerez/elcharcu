import Link from 'next/link';
import { type ReactNode } from 'react';

import { appRoutes, site } from '@/shared/config';

const LINKS = [
  { label: 'Cursos', href: appRoutes.appCourses, external: false },
  { label: 'Recetas', href: appRoutes.recipes, external: false },
  { label: 'Planes', href: `${appRoutes.appCourses}#planes-title`, external: false },
  { label: 'WhatsApp', href: site.whatsappUrl, external: true },
  { label: 'Instagram', href: site.instagramUrl, external: true },
] as const;

/**
 * El pie de las pantallas de la app abiertas a todos —la portada, las recetas,
 * el recetario— (diseño final 01 y 07). Más corto que el del sitio: aquí se
 * viene a aprender, no a buscar la tienda.
 */
export function AppFooter(): ReactNode {
  return (
    <footer className="mt-16 bg-forest-dark text-cream">
      <div className="mx-auto flex max-w-app flex-col gap-6 px-5 py-10 md:flex-row md:items-center md:justify-between md:px-8">
        <div>
          <p className="font-serif text-lg font-semibold text-cream-white">El Charcu</p>
          <p className="mt-1 text-sm text-cream/75">{site.location}</p>
        </div>
        <nav aria-label="Pie de página">
          <ul className="flex flex-wrap gap-x-6 gap-y-3 text-sm">
            {LINKS.map(({ label, href, external }) => (
              <li key={label}>
                {external ? (
                  <a
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-cream/80 hover:text-cream-white"
                  >
                    {label}
                  </a>
                ) : (
                  <Link href={href} className="text-cream/80 hover:text-cream-white">
                    {label}
                  </Link>
                )}
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </footer>
  );
}
