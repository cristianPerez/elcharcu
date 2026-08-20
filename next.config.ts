import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: true,
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
