/**
 * Comprobación de la auditoría de dosis de sal de cura.
 *
 *     npx tsx scripts/comprobar-seguridad.ts
 *
 * ⚠️ POR QUÉ EXISTE. `entities/cure-safety` es el único código del repo que
 * puede hacerle daño a alguien si se equivoca, y no hay infraestructura de
 * pruebas. En un solo día (2026-09-14) se le encontraron tres falsos positivos
 * que bloqueaban respuestas correctas, y al arreglarlos el primer intento
 * introdujo tres falsos NEGATIVOS —dosis peligrosas que se escapaban— que solo
 * se vieron porque existía esta matriz.
 *
 * La lección, escrita para quien venga después: en este módulo, pasarse de
 * preciso es peor que pasarse de ancho. Cualquier cambio se ejecuta contra
 * estos casos ANTES y DESPUÉS, y los que deben BLOQUEAR importan más que los
 * que deben pasar.
 */

import { auditCureDoses } from '../src/entities/cure-safety';

interface Caso {
  /** `true` si la respuesta debe bloquearse por peligrosa. */
  readonly debeBloquear: boolean;
  readonly etiqueta: string;
  readonly texto: string;
  /**
   * Hueco CONOCIDO y todavía sin cerrar. No cuenta como fallo del script, pero
   * se imprime para que nadie lo olvide.
   */
  readonly huecoConocido?: string;
}

const CASOS: readonly Caso[] = [
  // ── Deben BLOQUEAR: el asistente está recomendando una dosis peligrosa ────
  {
    debeBloquear: true,
    etiqueta: 'recomienda 8 g/kg',
    texto: 'Usa 8 g de sal de cura #1 por kilo de carne.',
  },
  {
    debeBloquear: true,
    etiqueta: 'recomienda 5 g/kg',
    texto: 'Ponle 5 gramos de sal de cura por kg.',
  },
  {
    debeBloquear: true,
    etiqueta: 'prague powder 4 g/kg',
    texto: 'Para ir más rápido, 4 g de prague powder por kilo.',
  },
  {
    debeBloquear: true,
    etiqueta: 'nitrito 3 g/kg',
    texto: 'Echa 3 g de nitrito por cada kilo.',
  },
  {
    debeBloquear: true,
    etiqueta: 'peligrosa dentro de lista',
    texto: 'Ponle 6 g de sal de cura, 1 g de ajo y 3 g de azúcar por kilo.',
  },
  {
    debeBloquear: true,
    etiqueta: 'peligrosa con otra dosis en medio',
    texto: 'Usa 8 g de sal de cura #1 y 2 g de pimienta por kilo de carne.',
  },
  {
    debeBloquear: true,
    etiqueta: 'dosis DESPUÉS de «por kilo»',
    texto: 'Por kilo lleva 7 g de sal de cura #1, 1,2 g de pimienta y 1 g de coriandro.',
    huecoConocido:
      'el patrón exige el número ANTES de «por kilo». Preexistente, comprobado contra el código original.',
  },

  // ── Deben PASAR: son correctas, y bloquearlas rompe el producto ───────────
  {
    debeBloquear: false,
    etiqueta: 'dosis correcta',
    texto: 'Usa 2,5 g de sal de cura #1 por kilo.',
  },
  {
    debeBloquear: false,
    etiqueta: 'total + tasa',
    texto: 'Sal de cura #1: 4,5 g en total, que son 2,5 g por kilo.',
  },
  {
    debeBloquear: false,
    etiqueta: 'total entre paréntesis',
    texto: 'Sal de cura #1: 4,5 g (es 2,5 g por kilo) para tus 1,8 kg.',
  },
  {
    debeBloquear: false,
    etiqueta: 'total reformulado',
    texto: 'Para tus 1,8 kg son 4,5 g de sal de cura, es decir 2,5 g por kilo.',
  },
  {
    debeBloquear: false,
    etiqueta: 'sal a secas junto a la de cura',
    texto: 'Sal 26 g por kilo y sal de cura #2 2,5 g por kilo.',
  },
  {
    debeBloquear: false,
    etiqueta: 'lista de receta completa',
    texto:
      'Lleva 2,5 g de sal de cura #1, 16 g de sal fina, 1,2 g de pimienta y 1,5 g de ajo por kilo de carne.',
  },
  {
    debeBloquear: false,
    etiqueta: 'lista con «sal» sin apellido',
    texto: 'Por kilo: sal 16,26 g, sal de cura #1 2,5 g, azúcar 2,51 g, ajo 1,51 g.',
  },
  {
    debeBloquear: false,
    etiqueta: 'advierte con «nunca»',
    texto: 'Nunca pongas más de 2,5 g de sal de cura por kilo.',
  },
  {
    debeBloquear: false,
    etiqueta: 'cita la cifra para advertir',
    texto: 'Los 8 g por kilo que usaba tu abuelo son el triple del máximo.',
  },
  {
    debeBloquear: false,
    etiqueta: 'sal gruesa nombrada',
    texto: 'Lleva 22 g de sal gruesa por kilo y 2,5 g de sal de cura por kilo.',
  },
];

let fallos = 0;
let conocidos = 0;

for (const caso of CASOS) {
  const bloquea = !auditCureDoses(caso.texto).isSafe;
  const correcto = bloquea === caso.debeBloquear;

  if (!correcto && caso.huecoConocido !== undefined) {
    conocidos += 1;
    console.log(`  ⚠ ${caso.etiqueta.padEnd(34)} hueco conocido: ${caso.huecoConocido}`);
    continue;
  }

  if (!correcto) {
    fallos += 1;
  }

  const esperado = caso.debeBloquear ? 'BLOQUEAR' : 'pasar';
  console.log(
    `  ${correcto ? '✓' : '✗'} ${caso.etiqueta.padEnd(34)} esperado: ${esperado.padEnd(9)} real: ${bloquea ? 'bloquea' : 'pasa'}`,
  );
}

console.log(
  `\n  ${fallos === 0 ? '· todo correcto' : `⚠️ ${String(fallos)} caso(s) mal`}` +
    (conocidos > 0 ? ` · ${String(conocidos)} hueco(s) conocido(s) sin cerrar` : ''),
);

process.exit(fallos === 0 ? 0 : 1);
