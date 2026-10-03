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
    await expect(
      page.getByRole('heading', { level: 2, name: /^Chorizos/ }),
    ).toBeVisible();

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

  test('"¿Qué pieza quieres aprender?" registra la demanda', async ({ page }) => {
    // Desde la 0034 todas las categorías tienen cursos: no queda ningún
    // "Quiero un curso de…" que tocar, así que la demanda se prueba por aquí.
    await page.goto('/cursos/maestros');
    await page.getByRole('button', { name: /Qué pieza quieres aprender/ }).click();

    const dialog = page.getByRole('dialog', { name: '¿Qué pieza quieres aprender?' });
    await dialog.getByRole('textbox').fill('Pastrami de res ahumado');
    const saved = page.waitForResponse((r) => r.url().includes('/api/pedidos-de-cursos'));
    await dialog.getByRole('button', { name: 'Proponer curso' }).click();
    expect((await saved).ok()).toBe(true);
    await expect(dialog.getByRole('status')).toContainText('Anotado');
  });
});

test.describe('Cursos maestros — cuenta pro', () => {
  test.use({ storageState: storageStateFor('pro') });

  test('Avísame apunta, se guarda y se puede deshacer', async ({ page }) => {
    await page.goto('/cursos/maestros');

    const join = page.getByRole('button', {
      name: 'Avísame cuando abra Chorizo de Ajo Parrillero',
    });
    const leave = page.getByRole('button', {
      name: 'Dejar de esperar Chorizo de Ajo Parrillero',
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
      page.getByRole('button', { name: 'Dejar de esperar Chorizo de Ajo Parrillero' }),
    ).toContainText('Te aviso');

    await page
      .getByRole('button', { name: 'Dejar de esperar Chorizo de Ajo Parrillero' })
      .click();
    await expect(
      page.getByRole('button', { name: 'Avísame cuando abra Chorizo de Ajo Parrillero' }),
    ).toBeVisible();
  });
});
