import {
  createSupabaseAdminClient,
  isSupabaseAdminConfigured,
} from '@/shared/api/supabase/server';
import { reportWarning } from '@/shared/lib';

import { type CheckoutLinks } from '../lib/checkoutHref';

/** Cuánto se recuerdan los enlaces: cambian a mano, muy de vez en cuando. */
const TTL_MS = 5 * 60 * 1000;

let memo: { readonly at: number; readonly value: CheckoutLinks } | null = null;

/**
 * El modo de OnePay de ESTE entorno. Producción (elcharcu.co) cobra de verdad;
 * QA, las previews y local usan el modo de pruebas. Lo decide Vercel, no una
 * variable a mano: una variable copiada de un entorno a otro mandaría a QA a
 * cobrar de verdad, o a producción a cobrar de mentira.
 */
function checkoutMode(): 'produccion' | 'pruebas' {
  return process.env.VERCEL_ENV === 'production' ? 'produccion' : 'pruebas';
}

/**
 * Los enlaces de pago de OnePay, por `billingId` (migración 0050). NUNCA
 * lanza: si la base falla, se devuelven los últimos buenos o ninguno, y los
 * botones vuelven a WhatsApp en vez de romper la página.
 */
export async function checkoutLinks(): Promise<CheckoutLinks> {
  const now = Date.now();
  if (memo !== null && now - memo.at < TTL_MS) {
    return memo.value;
  }
  if (!isSupabaseAdminConfigured()) {
    return memo?.value ?? {};
  }
  const { data, error } = await createSupabaseAdminClient()
    .from('plan_checkout')
    .select('plan_id, url')
    .eq('modo', checkoutMode());
  if (error !== null || data === null) {
    reportWarning('pagos', 'no se pudieron leer los enlaces de pago', {
      error: error?.message ?? 'sin datos',
    });
    return memo?.value ?? {};
  }
  const value: CheckoutLinks = Object.fromEntries(
    data.map((row) => [row.plan_id, row.url]),
  );
  memo = { at: now, value };
  return value;
}
