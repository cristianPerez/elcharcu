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
  /** El usuario intentó una SEGUNDA receta y chocó con el muro de suscripción. */
  paywallHit: 'paywall_hit',
  /** El usuario pagó después de chocar con el muro. */
  subscriptionStarted: 'subscription_started',
} as const;

export type AnalyticsEvent = (typeof ANALYTICS_EVENTS)[keyof typeof ANALYTICS_EVENTS];
