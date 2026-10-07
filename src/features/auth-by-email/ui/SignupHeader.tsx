import { type ReactNode } from 'react';

import { PLACEHOLDER_IMAGES } from '@/shared/config';

import { type SignupRequest } from '../model/signupPrompt';

/**
 * Lo que tocó la persona, arriba de la hoja (diseño final 03 y 05).
 * Celular: el número de la cápsula en su cuadrito y el título al lado.
 * Escritorio: la foto de lo que eligió, con el título encima.
 */
export function SignupHeader({
  request,
}: {
  readonly request: SignupRequest;
}): ReactNode {
  const eyebrow = [request.eyebrow, request.counter].filter(Boolean).join(' · ');

  return (
    <>
      <div className="flex items-center gap-3 px-5 pt-3 md:hidden">
        {request.badge ? (
          <span
            aria-hidden="true"
            className="grid size-11 shrink-0 place-items-center rounded-xl bg-capsule-current font-serif text-xl font-semibold text-brasa-tinta"
          >
            {request.badge}
          </span>
        ) : null}
        <span>
          <span className="block text-[11px] font-semibold uppercase tracking-eyebrow text-brasa-tinta">
            {request.eyebrow}
          </span>
          <span className="block font-semibold text-cocoa">{request.title}</span>
        </span>
      </div>

      <div className="relative hidden h-[120px] overflow-hidden md:block">
        <span
          aria-hidden="true"
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url(${request.image ?? PLACEHOLDER_IMAGES.signupHeader})`,
          }}
        />
        <span
          aria-hidden="true"
          className="absolute inset-0 bg-gradient-to-t from-cocoa/75 to-cocoa/10"
        />
        <span className="absolute inset-x-6 bottom-4">
          <span className="block text-[10px] font-semibold uppercase tracking-eyebrow text-cream/80">
            {eyebrow}
          </span>
          <span className="block font-serif text-lg font-semibold text-cream-white">
            {request.title}
          </span>
        </span>
      </div>
    </>
  );
}
