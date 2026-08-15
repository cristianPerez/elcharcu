const USD_FORMATTER = new Intl.NumberFormat('es-CO', {
  style: 'currency',
  currency: 'USD',
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

/**
 * Formatea un monto en dólares: 9.99 → "US$ 9,99".
 *
 * Se escribe "US$" y no "$" a secas a propósito: en Colombia "$" se lee como
 * pesos, y confundir 9,99 dólares con 9.990 pesos es una discusión con el
 * cliente después de haberle cobrado.
 *
 * El espacio se normaliza porque `Intl` mete un espacio duro (U+00A0) que,
 * sumado al que ponía este código, salía como "US$  9,99" con doble hueco.
 */
export function formatUsd(amount: number): string {
  return USD_FORMATTER.format(amount).replace(/\s+/g, ' ').trim();
}
