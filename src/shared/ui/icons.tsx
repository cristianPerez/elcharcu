import { type ReactNode } from 'react';

export interface IconProps {
  readonly size?: number;
  readonly className?: string;
  /** Más grueso cuando el icono está activo: se ve sin mirar de frente. */
  readonly strokeWidth?: number;
}

/**
 * Los iconos de la app, dibujados a mano.
 *
 * No se instala una librería de iconos (lucide pesa y es una dependencia más)
 * para tres trazos que no van a cambiar. Si algún día hacen falta veinte, se
 * instala; con tres, esto es menos código que el import.
 *
 * Todos comparten caja de 24, trazo redondeado y `currentColor`, así que el
 * color y el grosor los decide quien los usa.
 */
function Svg({
  size = 22,
  className,
  strokeWidth = 1.8,
  children,
}: IconProps & { readonly children: ReactNode }): ReactNode {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={className}
    >
      {children}
    </svg>
  );
}

/** Cursos: un libro abierto. */
export function IconCourses(props: IconProps): ReactNode {
  return (
    <Svg {...props}>
      <path d="M12 6.5C10.5 5.2 8.6 4.5 6.5 4.5H3.5v13H6.5c2.1 0 4 .7 5.5 2 1.5-1.3 3.4-2 5.5-2h3v-13h-3c-2.1 0-4 .7-5.5 2Z" />
      <path d="M12 6.5v13" />
    </Svg>
  );
}

/** El Charcu: el cuchillo del oficio. Es el producto, no un chat genérico. */
export function IconCharcu(props: IconProps): ReactNode {
  return (
    <Svg {...props}>
      <path d="M3 14.5 14.5 3c1.9 1.9 2.6 4.2 2.2 6.3-.3 1.5-1.1 2.8-2.2 3.9L11 16.7 3 14.5Z" />
      <path d="m10.2 15.9 5 5" />
      <path d="m18.4 18.3 2.4 2.4" />
    </Svg>
  );
}

/** Cuenta: la silueta de una persona. */
export function IconAccount(props: IconProps): ReactNode {
  return (
    <Svg {...props}>
      <circle cx="12" cy="8" r="3.6" />
      <path d="M4.8 20c.6-3.4 3.6-5.6 7.2-5.6s6.6 2.2 7.2 5.6" />
    </Svg>
  );
}

/** Flecha de "aquí se entra", en las filas que llevan a otra pantalla. */
export function IconChevron(props: IconProps): ReactNode {
  return (
    <Svg {...props}>
      <path d="m9 5 7 7-7 7" />
    </Svg>
  );
}
