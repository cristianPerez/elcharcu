import {
  CURE_TERMS,
  MAX_CURE_1_G_PER_KG,
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

/** Captura "2,5 g por kilo", "3 gramos / kg", "4 gr por cada kilogramo"… */
const DOSE_PATTERN =
  /(\d+(?:[.,]\d+)?)\s*(?:g|gr|gramos)\b[^.;\n]{0,40}?(?:por|\/|cada)\s*(?:kilo|kilogramo|kg)\b/gi;

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

  return cureDistance < nearestDistance(window, NON_CURE_TERMS, position);
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
    if (raw === undefined || match.index === undefined) {
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
