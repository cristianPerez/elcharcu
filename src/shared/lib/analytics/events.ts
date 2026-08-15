/**
 * Catálogo de eventos del embudo de la app (ventas → activación → pago).
 * Nombres centralizados para que el dashboard de Mixpanel no se llene de
 * variantes escritas a mano.
 */
export const ANALYTICS_EVENTS = {
  /** El usuario abrió la página de ventas del asistente. */
  salesPageViewed: 'sales_page_viewed',
  /** El usuario eligió un plan en la sección de precios. */
  planSelected: 'plan_selected',
  /** El usuario terminó el onboarding y quedó listo para su receta gratis. */
  onboardingCompleted: 'onboarding_completed',
  /** El usuario abrió su primera sesión gratis con el asistente. */
  freeRecipeStarted: 'free_recipe_started',
  /** El usuario llevó su receta gratis hasta el final. */
  freeRecipeCompleted: 'free_recipe_completed',
  /** El usuario abrió una receta cualquiera (gratis o de pago). */
  recipeStarted: 'recipe_started',
  /** El usuario intentó una SEGUNDA receta y chocó con el muro de suscripción. */
  paywallHit: 'paywall_hit',
  /** Se le acabaron las preguntas gratis del mes y vio el muro de cupo. */
  quotaWallHit: 'quota_wall_hit',
  /** El usuario pagó después de chocar con el muro. */
  subscriptionStarted: 'subscription_started',
  /** El usuario le preguntó algo al asistente (con o sin foto). */
  assistantMessageSent: 'assistant_message_sent',
  /**
   * El código de seguridad bloqueó una respuesta por proponer una dosis de sal
   * de cura por encima del tope. Si este evento sube, hay que revisar el prompt.
   */
  unsafeDoseBlocked: 'unsafe_dose_blocked',
  /**
   * Se agotó el presupuesto diario de IA y el asistente dejó de responder.
   * Si aparece, o hay mucho uso real o alguien está abusando: hay que mirarlo.
   */
  aiBudgetExhausted: 'ai_budget_exhausted',
} as const;

export type AnalyticsEvent = (typeof ANALYTICS_EVENTS)[keyof typeof ANALYTICS_EVENTS];
