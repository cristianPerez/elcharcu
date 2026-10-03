import { defineConfig, devices } from '@playwright/test';

/**
 * Los e2e del rediseño de la app (2026-10).
 *
 * ⚠️ `channel: 'chrome'`: Playwright 1.63 ya no publica Chromium para macOS 13,
 * así que se usa el Chrome instalado en la máquina.
 *
 * Levantan SU PROPIO servidor en el 3100, con la IA simulada (`AI_SIMULAR_IA`)
 * y otra carpeta de compilación (`NEXT_DIST_DIR`): así no pisan el `.next` del
 * servidor de desarrollo que pueda estar abierto, ni gastan Gemini.
 *
 * Corren contra la base de QA — `global-setup` se niega a seguir si
 * `.env.local` apunta a otra.
 */
const PORT = 3100;

export default defineConfig({
  testDir: './e2e',
  timeout: 60_000,
  expect: { timeout: 15_000 },
  fullyParallel: false,
  workers: 1,
  reporter: [['list']],
  globalSetup: './e2e/global-setup.ts',
  use: {
    baseURL: `http://localhost:${PORT}`,
    channel: 'chrome',
    trace: 'retain-on-failure',
  },
  projects: [
    {
      name: 'mobile',
      use: {
        ...devices['iPhone 13'],
        browserName: 'chromium',
        channel: 'chrome',
        viewport: { width: 390, height: 844 },
      },
    },
    {
      name: 'desktop',
      use: {
        ...devices['Desktop Chrome'],
        channel: 'chrome',
        viewport: { width: 1440, height: 900 },
      },
    },
  ],
  webServer: {
    command: `pnpm exec next dev --port ${PORT}`,
    url: `http://localhost:${PORT}/api/salud`,
    reuseExistingServer: true,
    timeout: 180_000,
    env: { AI_SIMULAR_IA: '1', NEXT_DIST_DIR: '.next-e2e' },
  },
});
