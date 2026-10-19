import { randomBytes } from 'node:crypto';

/**
 * El diario de UN webhook, de principio a fin (copiado de Manos Creadoras,
 * `lib/webhooks/rastro.ts`).
 *
 * El registro de verdad es `charcu.webhook_eventos`, que guarda el cuerpo
 * entero. Lo que esto añade es poder seguir UN evento en los logs de Vercel:
 * con dos pagos a la vez las líneas se entrelazan, y la `traza` —el mismo
 * código en la fila y en cada línea— las separa.
 *
 * No es Mixpanel: Mixpanel responde "¿cuánto vendimos?"; esto, "¿por qué
 * falló ESTE pago?".
 */

type TraceData = Readonly<Record<string, string | number | boolean | null>>;

export interface Trace {
  /** El código corto que aparece en la fila y en cada línea de log. */
  readonly traza: string;
  /** Apunta un paso. `datos` nunca lleva secretos ni tarjetas. */
  step(que: string, datos?: TraceData): void;
  /** Cierra el diario y devuelve lo que tardó, en milisegundos. */
  close(resultado: string, datos?: TraceData): number;
}

/** OnePay corta a los 10 s y, si se repite, desactiva el endpoint: 8 s es el aviso. */
const SLOW_MS = 8000;

export function openTrace(proveedor: string): Trace {
  // 8 caracteres: no chocan en un día y se pueden leer en voz alta.
  const traza = randomBytes(4).toString('hex');
  const start = Date.now();

  const write = (nivel: 'paso' | 'fin', que: string, datos?: TraceData): void => {
    // Una línea, JSON y siempre con `traza`: así se puede buscar en Vercel.
    console.log(
      JSON.stringify({
        nivel,
        area: 'pagos',
        traza,
        proveedor,
        que,
        ms: Date.now() - start,
        ...datos,
      }),
    );
  };

  return {
    traza,
    step: (que, datos) => write('paso', que, datos),
    close: (resultado, datos) => {
      const ms = Date.now() - start;
      write('fin', resultado, { ...datos, lento: ms > SLOW_MS });
      return ms;
    },
  };
}
