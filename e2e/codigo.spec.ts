import { expect, test, type Page } from '@playwright/test';

import { emailCodeFor } from './admin';
import { captureMixpanel, mockOtp, seriousA11yViolations } from './fixtures';
import { hasSession } from './magicLink';

/**
 * Entrar con el código de 6 dígitos del correo (2026-10-30).
 *
 * Es la puerta que abre sesión DONDE SE PIDIÓ —también dentro de Instagram— y
 * que no gastan los filtros de Outlook/Hotmail. Por qué hacía falta:
 * `docs/auth-magic-link-dropoff.md`.
 *
 * El envío del correo se simula (`mockOtp`) y el código sale de `generateLink`
 * de administración: ningún test manda correos.
 */

const EMAIL = 'e2e-gratis@elcharcu.test';
const CAPSULA = '/cursos/sal-de-cura';

function dialog(page: Page): ReturnType<Page['getByRole']> {
  return page.getByRole('dialog');
}

async function openCodeStep(page: Page): Promise<void> {
  await mockOtp(page);
  await page.goto(`/cursos?abrir=${encodeURIComponent(CAPSULA)}`);
  await expect(dialog(page)).toBeVisible();
  await dialog(page).getByLabel('Tu correo').fill(EMAIL);
  await dialog(page).getByRole('button', { name: 'Enviarme el código' }).click();
  await expect(dialog(page).getByText('Revisa tu correo')).toBeVisible();
}

test('con el código del correo entra en la misma pestaña y vuelve a la cápsula', async ({
  page,
  context,
}) => {
  await openCodeStep(page);
  expect(await seriousA11yViolations(page)).toEqual([]);

  const code = await emailCodeFor(EMAIL);
  // Al llegar a 6 números se envía sola, sin tocar "Entrar".
  await dialog(page).getByLabel('Escribe el código del correo').fill(code);

  await expect(page).toHaveURL((url) => url.pathname === CAPSULA);
  expect(await hasSession(context)).toBe(true);
  // `?entrada=` lo consume `AppProviders` y lo borra de la barra.
  await expect(page).not.toHaveURL(/entrada=/);
});

test('un código equivocado se explica, no abre sesión y se mide', async ({
  page,
  context,
}) => {
  const events = await captureMixpanel(page);
  await openCodeStep(page);

  await dialog(page).getByLabel('Escribe el código del correo').fill('000000');

  await expect(dialog(page).getByRole('alert')).toHaveText(/Ese código no sirve/);
  expect(await hasSession(context)).toBe(false);
  await expect
    .poll(() =>
      events.some((e) => e.event === 'auth_failed' && e.properties.flow === 'codigo'),
    )
    .toBe(true);
});
