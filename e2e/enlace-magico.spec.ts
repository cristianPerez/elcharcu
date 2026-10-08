import { expect, test } from '@playwright/test';

import { isDesktop } from './fixtures';
import {
  canReadEmailTokens,
  captureAuthEvents,
  emailLinkFor,
  ensureTestAccount,
  hasSession,
  INSTAGRAM_IOS_UA,
  requestMagicLink,
  SAFARI_IOS_UA,
} from './magicLink';

/**
 * El enlace mágico TAL COMO FUNCIONA HOY (2026-10-07).
 *
 * ⚠️ Estos tests describen el flujo actual, incluidos sus fallos, para que el
 * día que se arregle se vea en qué cambió. Ver docs/auth-magic-link-dropoff.md.
 *
 * Se pide el enlace desde el navegador interno de Instagram (por user agent) y
 * se abre:
 *   1. en el MISMO navegador → entra y vuelve a la cápsula de la que venía
 *      (hipótesis 2, arreglada con el diseño final: el enlace lleva el destino);
 *   2. en OTRO navegador (Safari) → no entra: el `code_verifier` de PKCE vive
 *      en el navegador que lo pidió (hipótesis 1).
 *
 * Necesitan `SUPABASE_ACCESS_TOKEN` para leer el token del correo; sin él se
 * saltan (en CI, a propósito: ver `e2e/magicLink.ts`). Solo en móvil: es donde
 * vive el problema y así se manda la mitad de correos.
 */

const MISMO = 'e2e-enlace-mismo@elcharcu.test';
const OTRO = 'e2e-enlace-otro@elcharcu.test';

test.use({ userAgent: INSTAGRAM_IOS_UA });

test.beforeEach(({ page }) => {
  test.skip(isDesktop(page), 'Solo en móvil');
  test.skip(
    !canReadEmailTokens(),
    'Falta SUPABASE_ACCESS_TOKEN para leer el token del correo',
  );
});

test('desde Instagram y en el mismo navegador entra y vuelve a la cápsula', async ({
  page,
  context,
}) => {
  await ensureTestAccount(MISMO);
  const events = await captureAuthEvents(context);

  // Sin sesión, la cápsula manda a Cursos con la hoja de crear cuenta abierta.
  await page.goto('/cursos/sal-de-cura');
  await expect(page).toHaveURL(/\/cursos\?abrir=%2Fcursos%2Fsal-de-cura/);
  await expect(page.getByRole('dialog')).toBeVisible();

  const redirectTo = await requestMagicLink(page, MISMO);
  // Diseño final (2026-10-07): `next` es la cápsula, no /charcu.
  expect(redirectTo).toContain('next=%2Fcursos%2Fsal-de-cura');
  expect(redirectTo).toContain('disparador=capsula');
  expect(redirectTo).toMatch(/intento=[0-9a-f-]{36}/);

  await page.goto(await emailLinkFor(MISMO, redirectTo));

  await expect(page).toHaveURL(/\/cursos\/sal-de-cura/);
  expect(await hasSession(context)).toBe(true);
  await expect
    .poll(() => events)
    .toEqual(
      expect.arrayContaining([
        'auth_modal_opened',
        'magic_link_requested',
        'returned_to_origin',
      ]),
    );
});

test('hoy: pedido en Instagram y abierto en otro navegador, no entra, no se le explica y el enlace queda gastado', async ({
  page,
  context,
  browser,
}) => {
  await ensureTestAccount(OTRO);
  const events = await captureAuthEvents(context);

  await page.goto('/entrar');
  const redirectTo = await requestMagicLink(page, OTRO);
  const link = await emailLinkFor(OTRO, redirectTo);

  // Otro navegador: el que abre el correo desde Gmail, sin las cookies de Instagram.
  const safari = await browser.newContext({ userAgent: SAFARI_IOS_UA });
  const other = await safari.newPage();
  await other.goto(link);

  // Hipótesis 1: sin el `code_verifier` el intercambio falla.
  await expect(other).toHaveURL(/\/entrar\?error=enlace-vencido/);
  expect(await hasSession(safari)).toBe(false);
  // Y hoy `/entrar` no lee `error`: vuelve a pedir el correo sin decir por qué.
  await expect(other.getByRole('button', { name: /enlace/i })).toBeVisible();
  await expect(other.getByText(/otro navegador|venci|no pudimos/i)).toHaveCount(0);
  await safari.close();

  // Y el enlace ya no sirve ni en el navegador correcto: Supabase lo da por
  // usado y deja el motivo en el fragmento, que solo `/entrar` puede leer.
  await page.goto(link);
  await expect(page).toHaveURL(/error_code=otp_expired/);
  expect(await hasSession(context)).toBe(false);
  await expect.poll(() => events).toContain('auth_link_error');
});
