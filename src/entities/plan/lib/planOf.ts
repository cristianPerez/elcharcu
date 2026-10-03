import { type BillingCycle, type Plan } from '../model/plan.types';
import { freePlan, maestroPlan, proPlan } from '../model/plans';

export interface CurrentPlan {
  readonly plan: Plan;
  /** `null` en el plan gratis: no se renueva nada. */
  readonly cycle: BillingCycle | null;
}

/**
 * El plan que corresponde al id que guarda la base (`pro-mensual`,
 * `maestro-anual`, `aprendiz`). Lo que no se reconoce cae en el gratis, que es
 * lo mismo que hace `effective_plan` en Postgres ante un id desconocido.
 */
export function planOf(planId: string | null): CurrentPlan {
  const id = planId ?? '';
  const cycle: BillingCycle | null = id.endsWith('-anual')
    ? 'anual'
    : id.endsWith('-mensual')
      ? 'mensual'
      : null;

  if (id.startsWith('maestro')) {
    return { plan: maestroPlan, cycle };
  }
  if (id.startsWith('pro')) {
    return { plan: proPlan, cycle };
  }
  return { plan: freePlan, cycle: null };
}
