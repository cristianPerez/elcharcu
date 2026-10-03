import { expect, test } from '@playwright/test';

import { hasHorizontalScroll, isDesktop } from './fixtures';
import { storageStateFor } from './global-setup';

test.describe('Cursos maestros — cuenta gratis', () => {
  test.use({ storageState: storageStateFor('gratis') });

  test('"Ver todos" abre el catálogo agrupado por categoría', async ({ page }) => {
    await page.goto('/cursos');
    await page.getByRole('link', { name: 'Ver todos' }).click();

    await expect(page).toHaveURL(/\/cursos\/maestros/);
    await expect(
      page.getByRole('heading', { level: 1, name: 'Cursos maestros' }),
    ).toBeVisible();
    await expect(page.getByRole('heading', { name: /Chorizos/ })).toBeVisible();

    if (isDesktop(page)) {
      const crumbs = page.getByRole('navigation', { name: 'Migas de pan' });
      await expect(crumbs.getByRole('link', { name: 'Mis cursos' })).toBeVisible();
    } else {
      await expect(page.getByRole('link', { name: 'Volver a Mis cursos' })).toBeVisible();
    }
    expect(await hasHorizontalScroll(page)).toBe(false);
  });

  test('"Próximos" deja solo los cursos en preparación', async ({ page }) => {
    await page.goto('/cursos/maestros');
    await page.getByRole('link', { name: 'Próximos' }).click();
    await expect(page).toHaveURL(/estado=proximos/);
    await expect(page.getByRole('link', { name: 'Lomo de cerdo curado' })).toHaveCount(0);
    await expect(page.getByRole('link', { name: 'Chorizo Paisa' })).toBeVisible();
  });

  test('Avísame sin suscripción explica el plan en vez de apuntar', async ({ page }) => {
    await page.goto('/cursos/maestros');
    await page.getByRole('button', { name: 'Avísame cuando abra Chorizo Paisa' }).click();

    const dialog = page.getByRole('dialog', { name: 'Te avisamos con El Charcu Pro' });
    await expect(dialog).toBeVisible();
    await expect(dialog.getByRole('link', { name: 'Ver El Charcu Pro' })).toBeVisible();
    await dialog.getByRole('button', { name: 'Cerrar' }).click();
    await expect(dialog).toBeHidden();
  });

  test('"Quiero un curso de quesos" registra la demanda y se recuerda', async ({
    page,
  }) => {
    await page.goto('/cursos/maestros');
    const ask = page.getByRole('button', { name: 'Quiero un curso de quesos' });
    if (await ask.isVisible()) {
      await ask.click();
    }
    await expect(page.getByRole('button', { name: /Lo pediste/ }).last()).toBeVisible();

    await page.reload();
    await expect(page.getByRole('button', { name: /Lo pediste/ }).last()).toBeDisabled();
  });
});

test.describe('Cursos maestros — cuenta pro', () => {
  test.use({ storageState: storageStateFor('pro') });

  test('Avísame apunta, se guarda y se puede deshacer', async ({ page }) => {
    await page.goto('/cursos/maestros');

    const join = page.getByRole('button', {
      name: 'Avísame cuando abra Chorizo Santarrosano',
    });
    const leave = page.getByRole('button', {
      name: 'Dejar de esperar Chorizo Santarrosano',
    });

    // Deja el estado de partida limpio aunque una corrida anterior fallara.
    if (await leave.isVisible()) {
      await leave.click();
      await expect(join).toBeVisible();
    }

    await join.click();
    await expect(leave).toContainText('Estás en la lista');

    await page.reload();
    await expect(leave).toBeVisible();

    // En Mis cursos el mismo curso sale como "✓ Te aviso".
    await page.goto('/cursos');
    await expect(
      page.getByRole('button', { name: 'Dejar de esperar Chorizo Santarrosano' }),
    ).toContainText('Te aviso');

    await page
      .getByRole('button', { name: 'Dejar de esperar Chorizo Santarrosano' })
      .click();
    await expect(
      page.getByRole('button', { name: 'Avísame cuando abra Chorizo Santarrosano' }),
    ).toBeVisible();
  });
});
