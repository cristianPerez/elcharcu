/**
 * Hasta cuándo queda pagado. La pasarela puede decirlo (`venceEl`); si no,
 * se cuenta desde el cobro: un año el anual, un mes el resto.
 *
 * ⚠️ OnePay en el aviso real (2026-10-18) no manda la próxima cobranza. Sin
 * esto, la suscripción quedaría `active` pero sin fecha, y
 * `has_active_subscription` no la cuenta.
 */
export function periodEnd(
  venceEl: string | null,
  pagadoEl: string | null,
  planId: string,
): string | null {
  if (venceEl !== null) {
    return venceEl;
  }
  const paid = pagadoEl === null ? Number.NaN : new Date(pagadoEl).getTime();
  if (Number.isNaN(paid)) {
    return null;
  }
  const end = new Date(paid);
  if (planId === 'pro-anual') {
    end.setUTCFullYear(end.getUTCFullYear() + 1);
  } else {
    end.setUTCMonth(end.getUTCMonth() + 1);
  }
  return end.toISOString();
}
