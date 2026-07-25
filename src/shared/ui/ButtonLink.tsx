import { type ReactNode } from 'react';

import { cn } from '@/shared/lib';

type ButtonVariant = 'primary' | 'cream' | 'outline';

interface ButtonLinkProps {
  readonly href: string;
  readonly children: ReactNode;
  readonly variant?: ButtonVariant;
  readonly external?: boolean;
  readonly className?: string;
}

const VARIANT_STYLES: Record<ButtonVariant, string> = {
  primary: 'bg-terracota text-cream hover:bg-terracota-dark',
  cream: 'bg-cream text-forest hover:bg-white',
  outline: 'border border-current bg-transparent hover:bg-current/10',
};

/** CTA de la marca. Todos los llamados a la acción son enlaces (WhatsApp / anclas). */
export function ButtonLink({
  href,
  children,
  variant = 'primary',
  external = false,
  className,
}: ButtonLinkProps): ReactNode {
  const externalProps = external ? { target: '_blank', rel: 'noopener noreferrer' } : {};

  return (
    <a
      href={href}
      {...externalProps}
      className={cn(
        'inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-medium tracking-wide transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-terracota focus-visible:ring-offset-2',
        VARIANT_STYLES[variant],
        className,
      )}
    >
      {children}
    </a>
  );
}
