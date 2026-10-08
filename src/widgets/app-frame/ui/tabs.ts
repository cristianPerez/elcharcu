import { type ReactNode } from 'react';

import { appRoutes } from '@/shared/config';
import {
  IconAccount,
  IconCharcu,
  IconCourses,
  IconDoc,
  type IconProps,
} from '@/shared/ui';

export interface AppTab {
  readonly href: string;
  readonly label: string;
  readonly Icon: (props: IconProps) => ReactNode;
}

/**
 * Las pestañas de TODOS, con o sin cuenta (diseño final, 2026-10-07):
 * Cursos · El Charcu · Recetas · Cuenta. No hay "Inicio": Cursos es el inicio.
 *
 * Las tres primeras son iguales para todo el mundo; la cuarta depende de si
 * hay sesión (ver `accountTab`). En escritorio la cuarta no va en el menú
 * sino a la derecha ("Entrar" o las iniciales), como en las capturas 01 y 10.
 */
export const MAIN_TABS: readonly AppTab[] = [
  { href: appRoutes.appCourses, label: 'Cursos', Icon: IconCourses },
  { href: appRoutes.appAssistant, label: 'El Charcu', Icon: IconCharcu },
  { href: appRoutes.recipes, label: 'Recetas', Icon: IconDoc },
];

/** "Cuenta" con sesión; sin ella, "Entrar". */
export function accountTab(isSignedIn: boolean): AppTab {
  return isSignedIn
    ? { href: appRoutes.appAccount, label: 'Cuenta', Icon: IconAccount }
    : { href: appRoutes.login, label: 'Entrar', Icon: IconAccount };
}

export function isTabActive(pathname: string, href: string): boolean {
  return pathname === href || pathname.startsWith(`${href}/`);
}
