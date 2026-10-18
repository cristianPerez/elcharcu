import { existsSync } from 'node:fs';

/**
 * En tu máquina las claves de QA están en `.env.local`; en GitHub Actions
 * llegan como variables de entorno desde los secretos del repo. Se carga el
 * archivo solo si existe, y nunca pisa lo que ya venga del entorno.
 */
export function loadLocalEnv(): void {
  if (existsSync('.env.local')) {
    process.loadEnvFile('.env.local');
  }
}

/**
 * Qué navegador lanzar. En macOS 13 Playwright 1.63 ya no publica Chromium,
 * así que en local se usa el Chrome instalado. En CI (Ubuntu) va el Chromium
 * de Playwright, que se instala en el propio workflow.
 */
export const BROWSER_CHANNEL: { channel?: 'chrome' } =
  process.env.CI === undefined ? { channel: 'chrome' } : {};

/**
 * Las claves del webhook de OnePay EN LOS E2E (2026-10-17). Son de prueba y
 * solo existen aquí: el servidor de los e2e arranca con ellas
 * (playwright.config / e2e.yml) y `webhook-onepay.spec.ts` firma con ellas.
 * Las de verdad viven en Vercel y nunca en el repo.
 */
export const E2E_WEBHOOK_SECRET = 'e2e-webhook-secret-de-prueba';
export const E2E_WEBHOOK_TOKEN = 'e2e-webhook-token-de-prueba';
