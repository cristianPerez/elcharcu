import Link from 'next/link';
import { type ReactNode } from 'react';

import { appRoutes } from '@/shared/config';
import { cn } from '@/shared/lib';

interface SignupLinkProps {
  readonly children: ReactNode;
  readonly variant?: 'primary' | 'outline' | undefined;
  readonly className?: string | undefined;
}

/**
 * El botón de crear cuenta de la portada. Lleva a `/entrar`; la hoja de crear
 * cuenta (bloque 3) lo intercepta y la abre en el sitio.
 */
export function SignupLink({
  children,
  variant = 'primary',
  className,
}: SignupLinkProps): ReactNode {
  return (
    <Link
      href={appRoutes.login}
      data-signup-trigger="crear_cuenta"
      className={cn(
        'inline-flex min-h-12 items-center justify-center rounded-full px-6 text-[15px] font-semibold transition-colors',
        variant === 'primary'
          ? 'bg-brasa text-cocoa hover:bg-brasa-dark'
          : 'border border-forest text-forest hover:bg-cream-white',
        className,
      )}
    >
      {children}
    </Link>
  );
}
