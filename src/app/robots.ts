import { type MetadataRoute } from 'next';

/**
 * Qué puede rastrear Google (copiado de Manos Creadoras, 2026-10-17).
 *
 * ⚠️ NACE PORQUE QA SE ABRE AL PÚBLICO: para que el webhook de OnePay llegue,
 * qa.elcharcu.co deja de estar detrás del login de Vercel, y queda tan visible
 * para un buscador como el sitio real. Sin esto:
 *
 *   · le compite a elcharcu.co: Google ve dos sitios casi iguales y a veces
 *     enseña el equivocado;
 *   · alguien podría pagar desde QA, que cobra con el modo de PRUEBAS de
 *     OnePay y escribe en otra base de datos;
 *   · los textos y precios de QA son los que se están probando, no los buenos.
 *
 * ⚠️ La condición va al revés de lo intuitivo: se abre SOLO si
 * `VERCEL_ENV === 'production'`. Cualquier otro entorno queda cerrado. Y no
 * basta solo: el `noindex` de `next.config.ts` es el que saca de Google una
 * página de QA que alguien haya enlazado.
 */
export default function robots(): MetadataRoute.Robots {
  if (process.env.VERCEL_ENV !== 'production') {
    return { rules: [{ userAgent: '*', disallow: '/' }] };
  }
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        // Nada que buscar: avisos de pagos, el regreso del enlace del correo y
        // la cuenta de cada persona.
        disallow: ['/api/', '/auth/', '/cuenta'],
      },
    ],
  };
}
