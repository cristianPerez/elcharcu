import { type ReactNode } from 'react';

import { SignOutButton } from '@/features/auth-by-email';

import { SupportLinks } from './SupportLinks';

interface AccountNavProps {
  readonly name: string;
  readonly email: string;
  readonly initials: string;
}

const SECTIONS = [
  { href: '#plan', label: 'Plan y uso' },
  { href: '#perfil', label: 'Perfil e intereses' },
  { href: '#notificaciones', label: 'Notificaciones' },
] as const;

/** El menú lateral de "Mi cuenta" en escritorio: quién eres y a dónde ir. */
export function AccountNav({ name, email, initials }: AccountNavProps): ReactNode {
  return (
    <div className="sticky top-[104px] flex flex-col gap-6">
      <div className="flex items-center gap-3">
        <span
          aria-hidden="true"
          className="grid size-12 shrink-0 place-items-center rounded-full bg-forest font-serif text-lg font-semibold text-cream-white"
        >
          {initials}
        </span>
        <div className="min-w-0">
          <p className="truncate text-base font-semibold text-cocoa">
            {name || 'Sin nombre'}
          </p>
          <p className="truncate text-sm text-cocoa-soft">{email}</p>
        </div>
      </div>
      <nav aria-label="Secciones de la cuenta">
        <ul className="flex flex-col gap-0.5">
          {SECTIONS.map((section) => (
            <li key={section.href}>
              <a
                href={section.href}
                className="flex min-h-11 items-center rounded-xl px-3 text-[15px] text-cocoa-soft transition-colors hover:bg-cream-white hover:text-cocoa"
              >
                {section.label}
              </a>
            </li>
          ))}
          <SupportLinks variant="menu" />
        </ul>
      </nav>
      <SignOutButton className="min-h-11 self-start px-3 text-[15px] font-semibold text-brasa-tinta hover:text-brasa-dark disabled:opacity-50" />
    </div>
  );
}
