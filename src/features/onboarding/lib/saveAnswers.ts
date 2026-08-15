interface OnboardingAnswers {
  readonly country?: string;
  readonly level?: string;
  readonly product?: string;
}

/**
 * Manda al servidor lo que se lleve contestado.
 *
 * Se llama en CADA paso, no solo al final, por dos razones: la mitad de la
 * gente abandona a medias y ese dato incompleto igual sirve, y si el visitante
 * se registra semanas después, ya sabemos de dónde es y qué quería hacer.
 *
 * Nunca lanza ni bloquea: si el guardado falla, el onboarding sigue. Perder un
 * dato es molesto; dejar a alguien atascado en la pantalla 2 de 3 es peor.
 */
export function saveAnswers(answers: OnboardingAnswers): void {
  void fetch('/api/onboarding', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(answers),
    keepalive: true,
  }).catch(() => {
    // Silencio a propósito: esto no puede estorbarle al usuario.
  });
}
