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

/**
 * El Charcu: la chispa, que es la marca universal de "esto lo contesta una IA".
 *
 * Antes era un cuchillo. Se cambió (2026-08-20) porque el cuchillo dice
 * "charcutería" —cosa que ya dicen el nombre y el resto de la app— y no decía
 * lo único que esta pestaña necesita distinguir: que aquí hay un asistente.
 *
 * Va RELLENA y no de trazo, al revés que las otras dos: una chispa dibujada a
 * línea se lee como un asterisco. Por eso no usa el envoltorio común.
 */
export function IconCharcu({ size = 22, className }: IconProps): ReactNode {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      className={className}
    >
      <path d="M12 2.6l1.85 5.15a3 3 0 0 0 1.8 1.8L20.8 11.4l-5.15 1.85a3 3 0 0 0-1.8 1.8L12 20.2l-1.85-5.15a3 3 0 0 0-1.8-1.8L3.2 11.4l5.15-1.85a3 3 0 0 0 1.8-1.8L12 2.6z" />
      <path
        d="M18.9 3.1l.62 1.73 1.73.62-1.73.62-.62 1.73-.62-1.73-1.73-.62 1.73-.62.62-1.73z"
        opacity="0.65"
      />
    </svg>
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

/** Candado: lo que separa un curso de pago de quien todavía no paga. */
export function IconLock(props: IconProps): ReactNode {
  return (
    <Svg {...props}>
      <rect x="4.5" y="10.5" width="15" height="10" rx="2.5" />
      <path d="M8 10.5V7.5a4 4 0 0 1 8 0v3" />
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
