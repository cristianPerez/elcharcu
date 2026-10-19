/**
 * ¿Con este correo se puede crear una cuenta?
 *
 * ⚠️ En el modo de pruebas OnePay manda `hola@onepay.ai` como correo de TODOS
 * los clientes (2026-10-18). Crear cuentas con él juntaría todos los pagos sin
 * correo en una sola cuenta. Cualquier correo de OnePay queda fuera.
 */
const PROVIDER_DOMAINS = ['onepay.ai', 'onepay.la'] as const;

export function usableEmail(correo: string | null): correo is string {
  if (correo === null || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo)) {
    return false;
  }
  const domain = correo.split('@')[1] ?? '';
  return !PROVIDER_DOMAINS.some(
    (blocked) => domain === blocked || domain.endsWith(`.${blocked}`),
  );
}
