import { expect, test, type Page } from '@playwright/test';

import { hasHorizontalScroll } from './fixtures';
import { storageStateFor } from './global-setup';

test.use({ storageState: storageStateFor('gratis') });

function interest(page: Page, label: string): ReturnType<Page['getByRole']> {
  return page
    .getByRole('list', { name: 'Qué quieres aprender' })
    .getByRole('button', { name: label, exact: true });
}

test('los intereses se activan, se apagan y se guardan', async ({ page }) => {
  await page.goto('/cuenta');
  await expect(page.getByRole('heading', { level: 1, name: 'Mi cuenta' })).toBeVisible();

  const quesos = interest(page, 'Quesos');
  const chorizos = interest(page, 'Chorizos');

  // Punto de partida conocido: Chorizos elegido (al menos uno tiene que quedar).
  if ((await chorizos.getAttribute('aria-pressed')) !== 'true') {
    const first = page.waitForResponse((r) => r.url().includes('/api/perfil'));
    await chorizos.click();
    await first;
  }

  const before = await quesos.getAttribute('aria-pressed');
  const after = before === 'true' ? 'false' : 'true';

  const saved = page.waitForResponse(
    (r) => r.url().includes('/api/perfil') && r.request().method() === 'PATCH',
  );
  await quesos.click();
  expect((await saved).ok()).toBe(true);
  await expect(quesos).toHaveAttribute('aria-pressed', after);

  await page.reload();
  await expect(interest(page, 'Quesos')).toHaveAttribute('aria-pressed', after);
  expect(await hasHorizontalScroll(page)).toBe(false);
});

test('el último interés no se puede quitar', async ({ page }) => {
  await page.goto('/cuenta');
  // `count()` no espera: se cuenta con la página ya hidratada y en reposo. En
  // el build de producción contaba antes de que la lista terminara de pintarse
  // y se saltaba el bucle entero.
  await page.waitForLoadState('networkidle');
  const chosen = page
    .getByRole('list', { name: 'Qué quieres aprender' })
    .getByRole('button', { pressed: true });
  await expect(chosen.first()).toBeVisible();

  // Deja uno solo elegido.
  while ((await chosen.count()) > 1) {
    const saved = page.waitForResponse((r) => r.url().includes('/api/perfil'));
    await chosen.first().click();
    await saved;
  }
  await expect(chosen.first()).toHaveAttribute('aria-disabled', 'true');
});

test('los avisos son interruptores que se guardan', async ({ page }) => {
  await page.goto('/cuenta');
  const news = page.getByRole('switch', { name: 'Correo con novedades' });
  const before = await news.getAttribute('aria-checked');
  const after = before === 'true' ? 'false' : 'true';

  const saved = page.waitForResponse((r) => r.url().includes('/api/perfil'));
  await news.click();
  expect((await saved).ok()).toBe(true);

  await page.reload();
  await expect(
    page.getByRole('switch', { name: 'Correo con novedades' }),
  ).toHaveAttribute('aria-checked', after);
});

test('una cuenta gratis no tiene fecha de renovación y ve el plan Maestro', async ({
  page,
}) => {
  await page.goto('/cuenta');
  const plan = page.getByRole('region', { name: 'Aprendiz' });
  await expect(plan).toContainText('Gratis');
  await expect(plan).not.toContainText(/se renueva el \d+ de/);
  await expect(page.getByRole('link', { name: /El Charcu Maestro/ })).toBeVisible();
});
