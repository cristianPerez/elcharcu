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
  /** El usuario abrió el onboarding (vio la primera pregunta). */
  onboardingStarted: 'onboarding_started',
  /** Cada paso que se pinta, para ver EXACTAMENTE dónde se cae la gente. */
  onboardingStepViewed: 'onboarding_step_viewed',
  /** Contestó una de las tres preguntas. Lleva cuál y qué respondió. */
  onboardingAnswered: 'onboarding_answered',
  /** Se devolvió un paso: si sube, la pregunta anterior no se entiende. */
  onboardingWentBack: 'onboarding_went_back',
  /** El usuario terminó el onboarding y quedó listo para su receta gratis. */
  onboardingCompleted: 'onboarding_completed',
  /** Cambió sus intereses o su nombre desde la pantalla de cuenta. */
  profileUpdated: 'profile_updated',
  /** Se apuntó a la lista de espera de un curso que todavía no está grabado. */
  waitlistJoined: 'waitlist_joined',
  /** El usuario abrió su primera sesión gratis con el asistente. */
  freeRecipeStarted: 'free_recipe_started',
  /** El usuario llevó su receta gratis hasta el final. */
  freeRecipeCompleted: 'free_recipe_completed',
  /** El usuario abrió una receta cualquiera (gratis o de pago). */
  recipeStarted: 'recipe_started',
  /**
   * Abrió la página de una receta del sitio público.
   *
   * ⚠️ Es EL DENOMINADOR de todo el embudo de las recetas: cuántas veces se vio
   * una receta contra cuántas veces alguien tocó una duda. Por eso no hacen
   * falta eventos de impresión por cada CTA — serían cuatro por visita, y la
   * pregunta que responderían ya la responde este.
   *
   * El nombre estaba escrito a mano en `RecipeViewTracker`, que es justo lo que
   * este catálogo existe para evitar (2026-09-01).
   */
  recipeDetailViewed: 'recipe_detail_view',
  /**
   * Tocó una de las cuatro dudas de una receta. Lleva CUÁL: sin el hueco
   * (`onIntro`, `onIngredients`…) no se puede saber si convierte la sal de cura
   * o el secado, que es lo que decide dónde poner la quinta.
   */
  recipeDoubtTapped: 'recipe_doubt_tapped',
  /** Abrió El Charcu desde una receta. `via` dice si por el botón o por una duda. */
  recipeAssistantOpened: 'recipe_assistant_opened',
  /**
   * Se le pintó el muro del correo. Es el denominador de `leadCaptured`: sin
   * esto solo se sabe cuántos lo dejaron, nunca a cuántos se les pidió.
   */
  leadWallShown: 'lead_wall_shown',
  /** El usuario intentó una SEGUNDA receta y chocó con el muro de suscripción. */
  paywallHit: 'paywall_hit',
  /** Se le acabaron las preguntas gratis del mes y vio el muro de cupo. */
  quotaWallHit: 'quota_wall_hit',
  /** El usuario pagó después de chocar con el muro. */
  subscriptionStarted: 'subscription_started',
  /** El usuario le preguntó algo al asistente (con o sin foto). */
  assistantMessageSent: 'assistant_message_sent',
  /** Tocó una de las preguntas de ejemplo en vez de escribir. */
  assistantStarterPicked: 'assistant_starter_picked',
  /** Adjuntó una foto en la caja de escribir. */
  assistantPhotoAttached: 'assistant_photo_attached',
  /** Llegó respuesta del asistente. Lleva cuánto tardó y si traía foto. */
  assistantAnswerReceived: 'assistant_answer_received',
  /** El asistente no pudo responder. Lleva el motivo. */
  assistantFailed: 'assistant_failed',
  /** Desplegó el aviso de cómo funciona la seguridad. */
  assistantSafetyOpened: 'assistant_safety_opened',
  /**
   * Mandó su correo desde el muro.
   *
   * ⚠️ NO significa "contacto nuevo", y confundirlo infla la cifra. El muro le
   * sale a cualquiera sin sesión, así que un usuario de siempre que vuelve
   * después de cerrar sesión pasa por aquí igual y queda contado (lo vio
   * Cristian probando el 2026-09-01). Quién es nuevo de verdad lo dicen
   * `account_created` / `account_signed_in`, que se disparan al abrir el
   * enlace, que es el único momento en que se sabe.
   *
   * Sigue valiendo, y mucho: es el paso del embudo "se le pidió el correo → lo
   * dio", contra `lead_wall_shown`.
   */
  leadCaptured: 'lead_captured',
  /**
   * Entró por el enlace del correo y la cuenta ACABA de nacer.
   *
   * ⚠️ No se puede saber al pedir el correo: preguntarle al servidor si un
   * correo existe es exactamente lo que permite enumerar usuarios, y Supabase
   * no lo contesta a propósito. Al abrir el enlace ya demostró que la cuenta es
   * suya, así que ahí sí se puede decir sin abrirle la puerta a nadie.
   */
  accountCreated: 'account_created',
  /** Entró por el enlace del correo, pero la cuenta ya existía. */
  accountSignedIn: 'account_signed_in',
  /** Se le mandó el enlace de entrada tras dejar el correo. */
  accountLinkSent: 'account_link_sent',
  /** Vio la página de upsell (se llega por el muro o por enlace directo). */
  upsellViewed: 'upsell_viewed',
  /** Aterrizó en la página de bienvenida tras comprar en Hotmart. */
  purchaseLanded: 'purchase_landed',
  /** Abrió una receta guiada (curso + asistente). */
  guidedRecipeViewed: 'guided_recipe_viewed',
  /** Tocó la duda de un paso y se la mandó al asistente. */
  guidedStepAsked: 'guided_step_asked',
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
