import { type ReactNode } from 'react';

import { appRoutes } from '@/shared/config';
import { IconAccount, IconCharcu, IconCourses, type IconProps } from '@/shared/ui';

export interface AppTab {
  readonly href: string;
  readonly label: string;
  readonly Icon: (props: IconProps) => ReactNode;
}

/**
 * Las tres pestañas, en el orden que pidió Cristian: El Charcu EN EL CENTRO,
 * que es el producto y el sitio donde cae el pulgar; los cursos primero, que
 * es lo que se mira al llegar; la cuenta a la derecha, donde todo el mundo la
 * busca. Las comparten la barra de abajo y el menú de arriba.
 */
export const APP_TABS: readonly AppTab[] = [
  { href: appRoutes.appCourses, label: 'Mis cursos', Icon: IconCourses },
  { href: appRoutes.appAssistant, label: 'El Charcu', Icon: IconCharcu },
  { href: appRoutes.appAccount, label: 'Mi cuenta', Icon: IconAccount },
];

export function isTabActive(pathname: string, href: string): boolean {
  return pathname === href || pathname.startsWith(`${href}/`);
}
