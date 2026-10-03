import { cache } from 'react';

import { createSupabaseServerClient } from '@/shared/api/supabase/server';

/**
 * ¿Esta persona tiene suscripción viva?
 *
 * Le pregunta a `charcu.has_active_subscription()`, que es la MISMA función que
 * usan `can_read_course()` y `join_waitlist()`. Se hace así y no leyendo
 * `subscriptions` a mano para que la app y la base nunca discrepen sobre quién
 * paga: si mañana cambia qué cuenta como suscripción activa, cambia en un sitio.
 *
 * Va con `cache()` de React, como `currentUser()`: deduplica dentro de la misma
 * petición, así que preguntarlo desde el layout y desde una página no cuesta
 * dos viajes.
 *
 * ⚠️ Esto sirve para DECIDIR QUÉ PINTAR, no para abrir puertas. Quien cierra es
 * RLS y las funciones de Postgres (D12). Si esto devolviera `true` por error,
 * la base seguiría diciendo que no.
 */
export const hasActiveSubscription = cache(async (userId: string): Promise<boolean> => {
  try {
    const supabase = await createSupabaseServerClient();
    const { data, error } = await supabase.rpc('has_active_subscription', {
      p_user_id: userId,
    });

    // Ante un fallo de lectura se asume que NO paga. Es el lado seguro: como
    // mucho se le esconde una barra a quien sí paga, y eso se arregla
    // recargando. Al revés, se le enseñaría un botón que la base va a rechazar.
    return error === null && data === true;
  } catch {
    return false;
  }
});

export interface SubscriptionInfo {
  /** `pro-mensual`, `maestro-anual`… Tal cual lo guarda la base. */
  readonly planId: string | null;
  readonly status: string;
  /** ISO 8601: cuándo se renueva (o se acaba, si está cancelada). */
  readonly currentPeriodEnd: string | null;
}

/**
 * La suscripción de esta persona, para enseñar la fecha REAL de renovación.
 *
 * Con el cliente de sesión: `subscriptions_select_own` (0001) solo entrega la
 * propia. `null` si no tiene ninguna — que hoy es casi todo el mundo, porque
 * OnePay todavía no está conectado (ver ESTADO.md).
 */
export const readSubscription = cache(
  async (userId: string): Promise<SubscriptionInfo | null> => {
    try {
      const supabase = await createSupabaseServerClient();
      const { data, error } = await supabase
        .from('subscriptions')
        .select('plan_id, status, current_period_end')
        .eq('user_id', userId)
        .maybeSingle();

      if (error !== null || data === null) {
        return null;
      }
      return {
        planId: data.plan_id,
        status: data.status,
        currentPeriodEnd: data.current_period_end,
      };
    } catch {
      return null;
    }
  },
);
