const COP_FORMATTER = new Intl.NumberFormat('es-CO', {
  style: 'currency',
  currency: 'COP',
  maximumFractionDigits: 0,
});

/** Formatea un monto en pesos colombianos: 29900 → "$ 29.900". */
export function formatCop(amount: number): string {
  return COP_FORMATTER.format(amount);
}
