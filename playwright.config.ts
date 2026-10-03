import { defineConfig, devices } from '@playwright/test';

import { BROWSER_CHANNEL } from './e2e/env';

/**
 * Los e2e del rediseño de la app (2026-10).
 *
 * Corren en dos sitios con la misma configuración:
 *
 *   · En tu Mac (`pnpm test:e2e`): con el Chrome instalado —Playwright 1.63 ya
 *     no publica Chromium para macOS 13— y `next dev`, que reutiliza el servidor
 *     si ya está levantado.
 *   · En GitHub Actions (`.github/workflows/e2e.yml`), antes de mezclar a
 *     `main`: Chromium de Playwright en Ubuntu, también con `next dev`.
 *
 * ⚠️ En CI se probó `next build` + `next start` (2026-10-03) y NO sirve: en
 * los runners de GitHub, con varias precargas de enlaces a la vez, algunas
 * respuestas de servidor llegaban con 200 y nunca terminaban de enviarse, y la
 * navegación se quedaba colgada. No pasaba en local con el mismo build. Que el
 * build compila lo comprueba aparte el job de calidad.
 *
 * Siempre con SU PROPIO servidor en el 3100, la IA simulada (`AI_SIMULAR_IA`)
 * y otra carpeta de compilación (`NEXT_DIST_DIR`), para no pisar el `.next` del
 * servidor de desarrollo ni gastar Gemini.
 *
 * Corren contra la base de QA — `global-setup` se niega a seguir si las claves
 * apuntan a otra.
 */
const PORT = 3100;
const IS_CI = process.env.CI !== undefined;

export default defineConfig({
  testDir: './e2e',
  timeout: 60_000,
  expect: { timeout: 15_000 },
  fullyParallel: false,
  // Un solo worker: los tests comparten cuentas de prueba en QA.
  workers: 1,
  // En CI, un reintento: un fallo que se repite es un fallo; uno que no, se
  // marca "flaky" en el informe en vez de bloquear el merge.
  retries: IS_CI ? 1 : 0,
  reporter: IS_CI ? [['github'], ['list'], ['html', { open: 'never' }]] : [['list']],
  globalSetup: './e2e/global-setup.ts',
  use: {
    baseURL: `http://localhost:${PORT}`,
    ...BROWSER_CHANNEL,
    trace: 'retain-on-failure',
  },
  projects: [
    {
      name: 'mobile',
      use: {
        ...devices['iPhone 13'],
        browserName: 'chromium',
        ...BROWSER_CHANNEL,
        viewport: { width: 390, height: 844 },
      },
    },
    {
      name: 'desktop',
      use: {
        ...devices['Desktop Chrome'],
        ...BROWSER_CHANNEL,
        viewport: { width: 1440, height: 900 },
      },
    },
  ],
  webServer: {
    command: `pnpm exec next dev --port ${String(PORT)}`,
    url: `http://localhost:${String(PORT)}/api/salud`,
    reuseExistingServer: !IS_CI,
    timeout: 300_000,
    env: { AI_SIMULAR_IA: '1', NEXT_DIST_DIR: '.next-e2e' },
    // En CI se ve lo que dice el servidor: sin esto, un fallo del servidor
    // solo se nota como una página que no termina de cargar.
    stdout: IS_CI ? 'pipe' : 'ignore',
  },
});
