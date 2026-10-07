import Link from 'next/link';
import { type ReactNode } from 'react';

import { appRoutes } from '@/shared/config';
import { cn } from '@/shared/lib';

interface CreateAccountButtonProps {
  readonly label: string;
  readonly className?: string | undefined;
}

/**
 * "Crear cuenta gratis" del menú. Es un enlace a `/entrar`, pero sin sesión
 * `SignupInterceptor` lo detiene y abre la hoja de crear cuenta en el sitio.
 */
export function CreateAccountButton({
  label,
  className,
}: CreateAccountButtonProps): ReactNode {
  return (
    <Link
      href={appRoutes.login}
      data-signup-trigger="crear_cuenta"
      className={cn(
        'inline-flex min-h-11 items-center rounded-full bg-brasa px-5 text-sm font-semibold text-cocoa transition-colors hover:bg-brasa-dark',
        className,
      )}
    >
      {label}
    </Link>
  );
}
