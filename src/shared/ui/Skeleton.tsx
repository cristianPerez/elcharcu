import { type ReactNode } from 'react';

import { cn } from '@/shared/lib';

interface SkeletonProps {
  /** Clases de tamaño y forma: `h-6 w-2/3`, `h-40 w-full`… */
  readonly className?: string;
}

/**
 * Un bloque gris que respira, para el rato en que el dato todavía no llegó.
 *
 * No es decoración. Sin esto, tocar una pestaña dejaba al usuario mirando la
 * pantalla ANTERIOR sin señal de nada durante un segundo largo — y en un
 * celular eso se lee como "no funcionó", así que se vuelve a tocar.
 *
 * La forma importa: el hueco tiene que parecerse a lo que va a aparecer. Un
 * rectángulo genérico en medio de la pantalla no dice nada; una silueta con la
 * forma de la tarjeta que viene deja el ojo colocado donde estará el texto.
 *
 * `cream` sobre `cream-white`, sin colores nuevos: es la misma diferencia de
 * superficie que ya usa la app, no un gris de fuera de la paleta.
 */
export function Skeleton({ className }: SkeletonProps): ReactNode {
  return (
    <div
      aria-hidden="true"
      className={cn('animate-pulse rounded-lg bg-cocoa/[0.07]', className)}
    />
  );
}

/**
 * La cabecera de una pantalla de la app: el rótulo y el título.
 *
 * Se repite en las tres pestañas, así que vive aquí en vez de estar copiada
 * tres veces con medidas ligeramente distintas.
 */
export function SkeletonHeader(): ReactNode {
  return (
    <div>
      <Skeleton className="h-3 w-24" />
      <Skeleton className="mt-3 h-9 w-52" />
    </div>
  );
}

/** El hueco de una tarjeta con título, texto y una línea de datos. */
export function SkeletonCard({ className }: SkeletonProps): ReactNode {
  return (
    <div
      className={cn(
        'rounded-2xl border border-cocoa/10 bg-cream-white p-5 shadow-surface',
        className,
      )}
    >
      <Skeleton className="h-3 w-20" />
      <Skeleton className="mt-3 h-7 w-2/3" />
      <Skeleton className="mt-3 h-4 w-full" />
      <Skeleton className="mt-2 h-4 w-4/5" />
      <Skeleton className="mt-5 h-1.5 w-full" />
    </div>
  );
}

/**
 * El aviso para quien no ve la pantalla.
 *
 * Un lector de pantalla no se entera de que hay bloques grises moviéndose: sin
 * esto, la app se queda muda entre que se toca la pestaña y llega el
 * contenido.
 */
export function SkeletonLabel({ children }: { readonly children: string }): ReactNode {
  return (
    <p role="status" aria-live="polite" className="sr-only">
      {children}
    </p>
  );
}
