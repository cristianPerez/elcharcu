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
