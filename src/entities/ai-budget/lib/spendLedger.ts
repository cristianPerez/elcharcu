import {
  createSupabaseAdminClient,
  isSupabaseAdminConfigured,
} from '@/shared/api/supabase/server';
import { reportError } from '@/shared/lib';

import {
  dailyBudgetUsd,
  estimateCostUsd,
  type Audience,
  type TokenUsage,
} from '../model/pricing';

/** Postgres devuelve `numeric` como texto para no perder precisión. */
function toNumber(value: unknown): number {
  if (typeof value === 'number') {
    return value;
  }
  if (typeof value === 'string') {
    const parsed = Number.parseFloat(value);
    return Number.isFinite(parsed) ? parsed : 0;
  }
  return 0;
}

export interface BudgetStatus {
  readonly spentUsd: number;
  readonly budgetUsd: number;
  readonly isExhausted: boolean;
}

/**
 * ¿Queda presupuesto para hoy?
 *
 * Si no se puede consultar el contador, DEJA PASAR. Es la decisión menos mala:
 * quedarse sin base de datos un momento no debería dejar mudo al asistente, y
 * el gasto de unas pocas llamadas es mucho menor que el daño de una caída total.
 */
export async function checkBudget(audience: Audience): Promise<BudgetStatus> {
  const budgetUsd = dailyBudgetUsd(audience);

  if (budgetUsd === 0 || !isSupabaseAdminConfigured()) {
    return { spentUsd: 0, budgetUsd, isExhausted: budgetUsd === 0 };
  }

  const supabase = createSupabaseAdminClient();
  const { data, error } = await supabase.rpc('today_ai_spend', {
    p_audience: audience,
  });

  if (error) {
    reportError('presupuesto', 'no se pudo leer el gasto de hoy', {
      detail: error.message,
      audience,
    });
    return { spentUsd: 0, budgetUsd, isExhausted: false };
  }

  const spentUsd = toNumber(data);
  return { spentUsd, budgetUsd, isExhausted: spentUsd >= budgetUsd };
}

/** Apunta lo que costó una llamada. Devuelve el total del día. */
export async function recordSpend(
  usage: TokenUsage,
  audience: Audience,
): Promise<number> {
  if (!isSupabaseAdminConfigured()) {
    return 0;
  }

  const supabase = createSupabaseAdminClient();
  const { data, error } = await supabase.rpc('record_ai_spend', {
    p_prompt_tokens: usage.promptTokens,
    p_thought_tokens: usage.thoughtTokens,
    p_answer_tokens: usage.answerTokens,
    p_cost_usd: estimateCostUsd(usage),
    p_audience: audience,
  });

  if (error) {
    reportError('presupuesto', 'no se pudo apuntar el gasto', {
      detail: error.message,
      audience,
    });
    return 0;
  }

  return toNumber(data);
}
