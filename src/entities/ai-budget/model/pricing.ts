export interface TokenUsage {
  readonly promptTokens: number;
  /** Lo que el modelo "piensa" antes de responder. Google lo cobra como salida. */
  readonly thoughtTokens: number;
  readonly answerTokens: number;
}

interface Rate {
  /** USD por millón de tokens de entrada. */
  readonly inputPerMillion: number;
  /** USD por millón de tokens de salida (incluye los de pensamiento). */
  readonly outputPerMillion: number;
}

/**
 * Tarifas de `gemini-3.6-flash`, tomadas de ai.google.dev/gemini-api/docs/pricing
 * el 2026-08-05.
 *
 * Google ya anunció que el precio SE DUPLICA el 1 de enero de 2027. Están las dos
 * tarifas aquí para que el cálculo siga siendo correcto sin que nadie se acuerde
 * de venir a cambiarlo: ese día el tope empezaría a quedarse corto a la mitad.
 */
const RATE_UNTIL_2027: Rate = { inputPerMillion: 0.75, outputPerMillion: 3.75 };
const RATE_FROM_2027: Rate = { inputPerMillion: 1.5, outputPerMillion: 7.5 };

const PRICE_CHANGE = Date.UTC(2027, 0, 1);

function rateFor(when: Date): Rate {
  return when.getTime() < PRICE_CHANGE ? RATE_UNTIL_2027 : RATE_FROM_2027;
}

/** Cuánto costó una llamada, en dólares. */
export function estimateCostUsd(usage: TokenUsage, when: Date = new Date()): number {
  const rate = rateFor(when);
  const outputTokens = usage.thoughtTokens + usage.answerTokens;

  return (
    (usage.promptTokens * rate.inputPerMillion) / 1_000_000 +
    (outputTokens * rate.outputPerMillion) / 1_000_000
  );
}

/**
 * Tope diario, de `AI_DAILY_BUDGET_USD`.
 *
 * Si la variable falta o no es un número, se asume 0 = apagado, que corta todas
 * las llamadas. Es a propósito: ante una configuración rota preferimos que el
 * asistente deje de responder a que se gaste el presupuesto sin freno.
 */
export function dailyBudgetUsd(): number {
  const parsed = Number.parseFloat(process.env.AI_DAILY_BUDGET_USD ?? '');
  return Number.isFinite(parsed) && parsed >= 0 ? parsed : 0;
}
