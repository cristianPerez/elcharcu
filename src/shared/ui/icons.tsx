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

/*
  Los del rediseño de la app (2026-10). Mismo trazo, misma caja: se dibujan
  aquí en vez de instalar lucide porque siguen siendo pocos y fijos.
*/

/** Lupa del buscador. */
export function IconSearch(props: IconProps): ReactNode {
  return (
    <Svg {...props}>
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-3.5-3.5" />
    </Svg>
  );
}

/** Los filtros: dos deslizadores. */
export function IconSliders(props: IconProps): ReactNode {
  return (
    <Svg {...props}>
      <path d="M4 8h10M18 8h2M4 16h2M10 16h10" />
      <circle cx="16" cy="8" r="2" />
      <circle cx="8" cy="16" r="2" />
    </Svg>
  );
}

export function IconClose(props: IconProps): ReactNode {
  return (
    <Svg {...props}>
      <path d="M6 6l12 12M18 6 6 18" />
    </Svg>
  );
}

export function IconArrowLeft(props: IconProps): ReactNode {
  return (
    <Svg {...props}>
      <path d="m15 5-7 7 7 7" />
    </Svg>
  );
}

export function IconArrowRight(props: IconProps): ReactNode {
  return (
    <Svg {...props}>
      <path d="M5 12h14M13 6l6 6-6 6" />
    </Svg>
  );
}

export function IconCheck(props: IconProps): ReactNode {
  return (
    <Svg {...props}>
      <path d="m5 12.5 4.5 4.5L19 7.5" />
    </Svg>
  );
}

export function IconBell(props: IconProps): ReactNode {
  return (
    <Svg {...props}>
      <path d="M6 16V11a6 6 0 1 1 12 0v5l1.5 2h-15Z" />
      <path d="M10 20.5a2.2 2.2 0 0 0 4 0" />
    </Svg>
  );
}

export function IconCamera(props: IconProps): ReactNode {
  return (
    <Svg {...props}>
      <path d="M4 8.5h3l1.6-2.5h6.8L17 8.5h3v11H4Z" />
      <circle cx="12" cy="13.5" r="3.5" />
    </Svg>
  );
}

export function IconMenu(props: IconProps): ReactNode {
  return (
    <Svg {...props}>
      <path d="M4 7h16M4 12h16M4 17h16" />
    </Svg>
  );
}

export function IconPlus(props: IconProps): ReactNode {
  return (
    <Svg {...props}>
      <path d="M12 5v14M5 12h14" />
    </Svg>
  );
}

export function IconMinus(props: IconProps): ReactNode {
  return (
    <Svg {...props}>
      <path d="M5 12h14" />
    </Svg>
  );
}

/** El triángulo de "continuar lección". Relleno: a trazo se lee como flecha. */
export function IconPlay({ size = 14, className }: IconProps): ReactNode {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      className={className}
    >
      <path d="M7 4.5v15l12-7.5Z" />
    </svg>
  );
}

export function IconSend(props: IconProps): ReactNode {
  return (
    <Svg {...props}>
      <path d="M12 19V5M6 11l6-6 6 6" />
    </Svg>
  );
}

export function IconShield(props: IconProps): ReactNode {
  return (
    <Svg {...props}>
      <path d="M12 3.5 5 6v5.5c0 4.2 2.9 7.6 7 9 4.1-1.4 7-4.8 7-9V6Z" />
      <path d="m9 12 2.2 2.2L15.5 10" />
    </Svg>
  );
}

export function IconCard(props: IconProps): ReactNode {
  return (
    <Svg {...props}>
      <rect x="3.5" y="6" width="17" height="12" rx="2" />
      <path d="M3.5 10h17M7 14.5h3" />
    </Svg>
  );
}

export function IconChat(props: IconProps): ReactNode {
  return (
    <Svg {...props}>
      <path d="M5 18.5 4 21l3.2-1.4A8.5 8.5 0 1 0 5 18.5Z" />
    </Svg>
  );
}

export function IconLogout(props: IconProps): ReactNode {
  return (
    <Svg {...props}>
      <path d="M14 4.5H6.5v15H14M10 12h10M17 8.5l3.5 3.5-3.5 3.5" />
    </Svg>
  );
}

/** Embutir y amarrar: la tripa que se cierra con un nudo. */
export function IconTie(props: IconProps): ReactNode {
  return (
    <Svg {...props}>
      <path d="M3 13c2.5 0 3-3 5.5-3S11 14 13.5 14 16 10 18.5 10H21" />
      <path d="M18.5 10v4" />
    </Svg>
  );
}

/** Curado: la pieza colgada. */
export function IconHanging(props: IconProps): ReactNode {
  return (
    <Svg {...props}>
      <path d="M12 2.5v4" />
      <path d="M9.5 6.5h5l-.8 13a1.7 1.7 0 0 1-3.4 0Z" />
    </Svg>
  );
}

/** Ahumado: la llama. */
export function IconFlame(props: IconProps): ReactNode {
  return (
    <Svg {...props}>
      <path d="M12 3c.5 3.5 5 5.5 5 10.5a5 5 0 0 1-10 0c0-2.5 1.5-3.8 2.5-5 .3 1.6 1 2.5 2 3 0-3 .2-5.5.5-8.5Z" />
    </Svg>
  );
}

/** Cocción: la olla. */
export function IconPot(props: IconProps): ReactNode {
  return (
    <Svg {...props}>
      <path d="M4 10.5h16v6a3 3 0 0 1-3 3H7a3 3 0 0 1-3-3Z" />
      <path d="M2.5 10.5h19M9 4v3M12 3v4M15 4v3" />
    </Svg>
  );
}

/** Una hoja con renglones: empezar una receta. */
export function IconDoc(props: IconProps): ReactNode {
  return (
    <Svg {...props}>
      <path d="M6.5 3.5h7.5l4 4v13h-11.5Z" />
      <path d="M14 3.5v4h4M9.5 12h5M9.5 15.5h5" />
    </Svg>
  );
}

export function IconCalculator(props: IconProps): ReactNode {
  return (
    <Svg {...props}>
      <rect x="5" y="3" width="14" height="18" rx="2" />
      <path d="M8.5 7h7M8.5 11h.01M12 11h.01M15.5 11h.01M8.5 14.5h.01M12 14.5h.01M15.5 14.5h.01M8.5 18h.01M12 18h.01M15.5 18h.01" />
    </Svg>
  );
}

export function IconQuestion(props: IconProps): ReactNode {
  return (
    <Svg {...props}>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M9.6 9.5a2.5 2.5 0 0 1 4.8.9c0 1.7-2.4 2.1-2.4 3.6M12 17h.01" />
    </Svg>
  );
}

/** Escribir algo nuevo: "receta nueva" desde una conversación abierta. */
export function IconPencil(props: IconProps): ReactNode {
  return (
    <Svg {...props}>
      <path d="M4 20h4L19 9a2.8 2.8 0 0 0-4-4L4 16Z" />
      <path d="m13.5 6.5 4 4" />
    </Svg>
  );
}

/** Un sobre: "Revisa tu correo" (hoja de crear cuenta, 2026-10-07). */
export function IconMail(props: IconProps): ReactNode {
  return (
    <Svg {...props}>
      <rect x="3.5" y="5.5" width="17" height="13" rx="2.5" />
      <path d="m4.5 7.5 7.5 5.5 7.5-5.5" />
    </Svg>
  );
}

/** Una "i" en un círculo: avisos que explican, no que alarman. */
export function IconInfo(props: IconProps): ReactNode {
  return (
    <Svg {...props}>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M12 11v5M12 8h.01" />
    </Svg>
  );
}
