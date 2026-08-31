const COP_FORMATTER = new Intl.NumberFormat('es-CO', {
  style: 'currency',
  currency: 'COP',
  maximumFractionDigits: 0,
});

/**
 * Formatea un monto en pesos colombianos: 29900 → "$ 29.900".
 *
 * ⚠️ SIN USAR desde el 2026-08-31, y aun así se queda. Su único consumidor era
 * el precio del curso suelto, que se retiró. No se borra porque los precios van
 * a volver a COP en cuanto entre la pasarela: **OnePay solo soporta COP** (D21),
 * y hoy los planes están en dólares (D18). No es código muerto, es código que
 * espera.
 */
export function formatCop(amount: number): string {
  return COP_FORMATTER.format(amount);
}
