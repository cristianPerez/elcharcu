import { type ReactNode } from 'react';

import { SignupLink } from './SignupLink';

/** La cabecera del celular sin cuenta (diseño final 02): la marca y "Crear cuenta". */
export function MobileTopBar(): ReactNode {
  return (
    <div className="flex items-center justify-between px-5 pt-4 md:hidden">
      <p className="flex flex-col leading-none">
        <span className="font-serif text-[22px] font-semibold text-forest">
          El Charcu
        </span>
        <span className="mt-1 text-[10px] uppercase tracking-eyebrow text-cocoa-soft">
          Artesanal
        </span>
      </p>
      <SignupLink className="min-h-11 px-5 text-sm">Crear cuenta</SignupLink>
    </div>
  );
}
