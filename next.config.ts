import type { NextConfig } from 'next';

/**
 * ¿Es elcharcu.co? Solo producción se deja indexar (2026-10-17). Va al revés de
 * lo intuitivo a propósito: QA, las previews, local o un entorno nuevo sin
 * configurar quedan FUERA de Google. Si esto se equivoca, se equivoca
 * escondiendo algo que debía verse —se nota y se arregla en minutos—, no
 * publicando el sitio de pruebas, que tarda semanas en limpiarse de Google.
 */
const isProduction = process.env.VERCEL_ENV === 'production';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  /**
   * Fuera de producción, `noindex` en TODA respuesta (páginas, API, imágenes).
   * `robots.txt` (src/app/robots.ts) solo impide RASTREAR: si alguien enlaza
   * una página de QA, Google puede listar la URL igual. Este encabezado es el
   * que la saca del índice. Hace falta desde que QA se abre al público para
   * que el webhook de OnePay pueda llegar (docs/pagos-onepay.md).
   */
  headers: () =>
    Promise.resolve(
      isProduction
        ? []
        : [
            {
              source: '/:path*',
              headers: [{ key: 'X-Robots-Tag', value: 'noindex, nofollow' }],
            },
          ],
    ),
  // Los e2e compilan en otra carpeta para no pisar el servidor de desarrollo.
  distDir: process.env.NEXT_DIST_DIR ?? '.next',
  typescript: {
    // Nunca ignorar errores de tipos en build (enterprise gate).
    ignoreBuildErrors: false,
  },
  eslint: {
    ignoreDuringBuilds: false,
  },
  experimental: {
    /**
     * Cuánto vale lo ya cargado antes de volver a pedirlo al servidor.
     *
     * Las tres pestañas de la app son rutas dinámicas, y para esas Next trae
     * `dynamic: 0` de fábrica: cada toque en la barra de abajo era una
     * petición nueva al servidor —medido, 3,2 s en desarrollo— aunque el
     * usuario acabara de estar ahí hace cinco segundos. Una app de celular no
     * se comporta así.
     *
     * Con 30 segundos, ir y volver entre pestañas es instantáneo y no gasta ni
     * una petición. Y no se queda rancio: cualquier cosa que CAMBIE algo
     * (terminar una lección) llama a `router.refresh()`, que invalida esto y
     * vuelve a traer los datos de verdad.
     *
     * 30 y no 300 a propósito: es el tiempo de mirar las tres pestañas, no el
     * de dejarse la app abierta media hora con datos viejos.
     */
    staleTimes: {
      dynamic: 30,
      static: 180,
    },
  },
};

export default nextConfig;
