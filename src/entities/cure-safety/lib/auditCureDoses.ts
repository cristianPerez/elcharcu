import {
  CURE_TERMS,
  MAX_CURE_1_G_PER_KG,
  NON_CURE_PATTERNS,
  NON_CURE_TERMS,
  WARNING_TERMS,
} from '../model/limits';

export interface DoseFinding {
  /** Gramos por kilo que encontró en el texto. */
  readonly grams: number;
  /** El trozo de texto donde apareció, para poder revisarlo. */
  readonly excerpt: string;
  /**
   * `true` cuando la frase cita la dosis para ADVERTIR de ella, no para
   * recomendarla ("los 8 g que usaba tu abuelo son el triple del máximo").
   */
  readonly isWarning: boolean;
}

export interface SafetyVerdict {
  readonly isSafe: boolean;
  /** Todo lo encontrado por encima del tope, citado o recomendado. */
  readonly findings: readonly DoseFinding[];
  /** Solo lo que el asistente estaba RECOMENDANDO. Esto es lo que bloquea. */
  readonly dangerous: readonly DoseFinding[];
}

/**
 * Captura "2,5 g por kilo", "3 gramos / kg", "4 gr por cada kilogramo"…
 *
 * A propósito es PERMISIVO: el hueco admite cualquier cosa, de modo que en
 * "8 g de sal de cura y 2 g de pimienta por kilo" los 8 g también quedan
 * atrapados. El "por kilo" del final se aplica a toda la lista, y perder eso
 * sería dejar escapar una dosis peligrosa.
 *
 * ⚠️ Se intentó apretarlo —prohibir que el hueco contuviera otra dosis— y fue
 * un error que costó tres falsos negativos comprobados (2026-09-14): las tres
 * frases de arriba dejaban de bloquearse. En un módulo de seguridad, pasarse de
 * preciso es peor que pasarse de ancho. El hueco se captura en el grupo 2 para
 * poder mirarlo después, que es donde está el arreglo de verdad.
 */
const DOSE_PATTERN =
  /(\d+(?:[.,]\d+)?)\s*(?:g|gr|gramos)\b([^.;\n]{0,80}?)(?:por|\/|cada)\s*(?:kilo|kilogramo|kg)\b/gi;

/**
 * Señales de que el número que las precede es un TOTAL y no una dosis por kilo.
 *
 * El paréntesis está porque la forma más común de restarlo es entre ellos:
 * "4,5 g (son 2,5 g por kilo)".
 */
const TOTAL_MARKERS: readonly string[] = [
  'en total',
  'total',
  '(',
  'es decir',
  'o sea',
  'equivale',
  'para tus',
  'para la pieza',
];

const CONTEXT_BEFORE = 160;
const CONTEXT_AFTER = 80;

/** Distancia en caracteres al término más cercano de la lista, o Infinity. */
function nearestDistance(
  window: string,
  terms: readonly string[],
  position: number,
): number {
  let best = Number.POSITIVE_INFINITY;

  for (const term of terms) {
    let index = window.indexOf(term);
    while (index !== -1) {
      best = Math.min(best, Math.abs(index - position));
      index = window.indexOf(term, index + 1);
    }
  }

  return best;
}

/** Igual que `nearestDistance`, pero para términos que necesitan contexto. */
function nearestPatternDistance(
  window: string,
  patterns: readonly RegExp[],
  position: number,
): number {
  let best = Number.POSITIVE_INFINITY;

  for (const pattern of patterns) {
    // La bandera `g` guarda estado entre llamadas: se copia para que dos
    // comprobaciones seguidas no se pisen el `lastIndex`.
    const scan = new RegExp(
      pattern.source,
      pattern.flags.includes('g') ? pattern.flags : `${pattern.flags}g`,
    );
    for (const match of window.matchAll(scan)) {
      if (match.index !== undefined) {
        best = Math.min(best, Math.abs(match.index - position));
      }
    }
  }

  return best;
}

/**
 * ¿Este número habla de sal de cura?
 *
 * Se queda con el término MÁS CERCANO, mirando hacia los dos lados. Hace falta
 * mirar hacia adelante porque en español lo normal es "5 g DE SAL DE CURA por
 * kilo": el término va después del número. Y hace falta la distancia para que en
 * "sal de cura 2,5 g por kilo, sal marina 25 g por kilo" los 25 g se atribuyan a
 * la sal marina, que es la que tienen al lado.
 */
function isAboutCureSalt(text: string, matchIndex: number, matchLength: number): boolean {
  const start = Math.max(0, matchIndex - CONTEXT_BEFORE);
  const end = Math.min(text.length, matchIndex + matchLength + CONTEXT_AFTER);
  const window = text.slice(start, end).toLowerCase();
  const position = matchIndex - start;

  const cureDistance = nearestDistance(window, CURE_TERMS, position);
  if (cureDistance === Number.POSITIVE_INFINITY) {
    return false;
  }

  const nonCureDistance = Math.min(
    nearestDistance(window, NON_CURE_TERMS, position),
    nearestPatternDistance(window, NON_CURE_PATTERNS, position),
  );

  return cureDistance < nonCureDistance;
}

/** La frase completa donde cae el número, para leer su intención. */
function sentenceAround(text: string, index: number): string {
  const isBoundary = (char: string | undefined): boolean =>
    char === undefined || '.!?\n'.includes(char);

  let start = index;
  while (start > 0 && !isBoundary(text[start - 1])) {
    start -= 1;
  }

  let end = index;
  while (end < text.length && !isBoundary(text[end])) {
    end += 1;
  }

  return text.slice(start, end + 1).toLowerCase();
}

/**
 * Revisa una respuesta del asistente ANTES de mostrarla y busca dosis de sal de
 * cura por encima del tope legal.
 *
 * Es a propósito una segunda barrera: el prompt ya se lo prohíbe al modelo, pero
 * un modelo se puede equivocar y aquí hay comida y gente de por medio. Esta
 * comprobación no depende de que el modelo se porte bien.
 *
 * Distingue recomendar de advertir. Ante la duda —una frase sin señales de
 * advertencia— se considera peligrosa y se bloquea.
 */
export function auditCureDoses(text: string): SafetyVerdict {
  const findings: DoseFinding[] = [];

  for (const match of text.matchAll(DOSE_PATTERN)) {
    const raw = match[1];
    const gap = match[2] ?? '';
    if (raw === undefined || match.index === undefined) {
      continue;
    }

    /*
      ⚠️ ESTE NÚMERO ES UN TOTAL, NO UNA TASA.

      El prompt del sistema le pide al asistente los DOS números: la dosis por
      kilo y el total para los kilos de esa persona. Al escribirlos juntos, el
      patrón enganchaba el total con el "por kilo" de la tasa:

          "4,5 g en total, que son 2,5 g por kilo"
           ↑ leído como 4,5 g POR KILO → bloqueaba una respuesta correcta

      4,5 g es el total correcto de 1,8 kg a 2,5 g/kg. Que saltara o no dependía
      de si el modelo metía por casualidad una palabra de `WARNING_TERMS`, así
      que era intermitente (2026-09-14).

      Se descarta solo en las DOS formas en que aparece un total, y mirando
      únicamente el HUECO —no la frase entera—: si la marca estuviera después
      del "por kilo", "8 g de sal de cura por kilo en total" se colaría.
    */
    if (TOTAL_MARKERS.some((marker) => gap.toLowerCase().includes(marker))) {
      continue;
    }

    const grams = Number.parseFloat(raw.replace(',', '.'));
    if (Number.isNaN(grams) || grams <= MAX_CURE_1_G_PER_KG) {
      continue;
    }

    if (!isAboutCureSalt(text, match.index, match[0].length)) {
      continue;
    }

    const sentence = sentenceAround(text, match.index);

    findings.push({
      grams,
      excerpt: text.slice(match.index, match.index + match[0].length).trim(),
      isWarning: WARNING_TERMS.some((term) => sentence.includes(term)),
    });
  }

  const dangerous = findings.filter((finding) => !finding.isWarning);
  return { isSafe: dangerous.length === 0, findings, dangerous };
}
