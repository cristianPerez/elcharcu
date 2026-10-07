'use client';

import { type MouseEvent, type ReactNode } from 'react';

import { appRoutes } from '@/shared/config';

import { type SignupRequest, useSignupPrompt } from '../model/signupPrompt';

/** El contexto de los botones genéricos ("Crear cuenta gratis" del menú y del héroe). */
const CREATE_ACCOUNT: SignupRequest = {
  trigger: 'crear_cuenta',
  eyebrow: 'El Charcu',
  title: 'Tu cuenta gratis',
  destination: appRoutes.appCourses,
  returnLabel: 'tus cursos',
};

interface SignupInterceptorProps {
  /** Solo sin sesión: con cuenta, los enlaces llevan a donde dicen. */
  readonly isActive: boolean;
  readonly children: ReactNode;
}

/**
 * Convierte en "crear cuenta" los enlaces que la piden, SIN cambiarlos
 * (diseño final, 2026-10-07).
 *
 * Las tarjetas de cápsula y de curso siguen siendo enlaces de verdad
 * (`/cursos/sal-de-cura`): sirven a los buscadores, a quien abre en otra
 * pestaña y a quien no tiene JavaScript —que cae en `/entrar` y vuelve—.
 * Aquí, sin sesión, el clic se detiene y se abre la hoja con el contexto que
 * registró la pantalla (`SignupTargets`). Ctrl/Cmd-clic no se toca.
 */
export function SignupInterceptor({
  isActive,
  children,
}: SignupInterceptorProps): ReactNode {
  const { targets, openSignup } = useSignupPrompt();

  const onClickCapture = (event: MouseEvent<HTMLDivElement>): void => {
    if (
      !isActive ||
      event.button !== 0 ||
      event.metaKey ||
      event.ctrlKey ||
      event.shiftKey
    ) {
      return;
    }
    const element = event.target instanceof Element ? event.target : null;

    // "Avísame" sin cuenta: un botón que trae su contexto en `data-signup-*`.
    const notify = element?.closest<HTMLElement>('[data-signup-trigger="avisame"]');
    if (notify !== null && notify !== undefined) {
      event.preventDefault();
      event.stopPropagation();
      const title = notify.dataset.signupTitle ?? 'Este curso';
      openSignup({
        trigger: 'avisame',
        eyebrow: 'Próximamente',
        title,
        heading: 'Crea tu cuenta gratis y te avisamos',
        destination: notify.dataset.signupDestination ?? appRoutes.appMasterCourses,
        returnLabel: `el curso ${title}`,
      });
      return;
    }

    const anchor = element?.closest('a') ?? null;
    if (anchor === null) {
      return;
    }

    const url = new URL(anchor.href, window.location.href);
    if (url.origin !== window.location.origin) {
      return;
    }

    const request =
      targets.get(url.pathname) ??
      (anchor.dataset.signupTrigger === 'crear_cuenta' ? CREATE_ACCOUNT : undefined);
    if (request === undefined) {
      return;
    }

    event.preventDefault();
    event.stopPropagation();
    openSignup(request);
  };

  return (
    <div className="contents" onClickCapture={onClickCapture}>
      {children}
    </div>
  );
}
