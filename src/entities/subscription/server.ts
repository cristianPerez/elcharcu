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
