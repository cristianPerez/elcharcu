/**
 * Quién mira, para las reglas: sin cuenta, o con su plan. Pro y Maestro son
 * quienes tienen la suscripción activa (`charcu.has_active_subscription`).
 */
export type ViewerPlan = 'anonimo' | 'aprendiz' | 'pro' | 'maestro';

/**
 * Cuántas preguntas a El Charcu se contestan SIN cuenta (D16): la 3.ª pide
 * crearla. Antes vivía solo en la pantalla (`QUESTIONS_BEFORE_LEAD`) y la API
 * no lo comprobaba; desde el 2026-10-07 lo usan las dos.
 */
export const ANONYMOUS_QUESTIONS = 2;

export function isSubscriber(plan: ViewerPlan): boolean {
  return plan === 'pro' || plan === 'maestro';
}

/**
 * ¿Puede abrir el contenido de este curso o cápsula? Sin cuenta, ninguno (se
 * le pide la cuenta); con cuenta, los libres; con suscripción, todos. Es la
 * misma regla que `charcu.can_read_course` en la base.
 */
export function canOpenCourse(plan: ViewerPlan, access: 'libre' | 'pago'): boolean {
  if (plan === 'anonimo') {
    return false;
  }
  return access === 'libre' || isSubscriber(plan);
}

/** ¿Se le contesta otra pregunta? Sin cuenta, solo las dos primeras. */
export function canAskWithoutAccount(plan: ViewerPlan, questionsUsed: number): boolean {
  return plan !== 'anonimo' || questionsUsed < ANONYMOUS_QUESTIONS;
}

/** ¿Ve el recetario completo, con buscador? Solo Pro y Maestro. */
export function canSeeFullCookbook(plan: ViewerPlan): boolean {
  return isSubscriber(plan);
}

/**
 * ¿Se le abre esta receta desde la pestaña Recetas? Con Pro, todas; sin Pro,
 * solo "las que te llegaron". (Por su link, cada receta es pública para todos.)
 */
export function canOpenRecipeFromCookbook(
  plan: ViewerPlan,
  wasReceived: boolean,
): boolean {
  return isSubscriber(plan) || wasReceived;
}

/** ¿Ve "recetas parecidas" al final de una receta? Solo con Pro. */
export function canSeeRelatedRecipes(plan: ViewerPlan): boolean {
  return isSubscriber(plan);
}

/** El plan para las reglas, a partir de la sesión y el id que guarda la base. */
export function viewerPlanOf(isSignedIn: boolean, planId: string | null): ViewerPlan {
  if (!isSignedIn) {
    return 'anonimo';
  }
  const id = planId ?? '';
  if (id.startsWith('maestro')) {
    return 'maestro';
  }
  if (id.startsWith('pro')) {
    return 'pro';
  }
  return 'aprendiz';
}
