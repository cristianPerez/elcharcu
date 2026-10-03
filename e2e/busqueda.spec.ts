import { expect, test } from '@playwright/test';

import { hasHorizontalScroll, isDesktop } from './fixtures';
import { storageStateFor } from './global-setup';

test.use({ storageState: storageStateFor('gratis') });

test('buscar desde Mis cursos lleva a la búsqueda con el término en la URL', async ({
  page,
}) => {
  await page.goto('/cursos');
  const field = page.getByRole('searchbox', { name: 'Buscar cursos' });
  await field.fill('chorizo');
  await field.press('Enter');

  await expect(page).toHaveURL(/\/cursos\/buscar\?q=chorizo/);
  await expect(
    page.getByRole('status').filter({ hasText: /resultados? para/ }),
  ).toContainText('“chorizo”');
  await expect(page.getByRole('heading', { name: 'Cursos', exact: true })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Cápsulas gratis' })).toBeVisible();
  // El término sale resaltado en los resultados.
  await expect(page.locator('mark').first()).toHaveText(/chorizo/i);
  expect(await hasHorizontalScroll(page)).toBe(false);
});

test('filtrar por categoría y estado cambia la URL y los resultados', async ({
  page,
}) => {
  await page.goto('/cursos/buscar?q=chorizo');

  if (isDesktop(page)) {
    const filters = page.getByRole('complementary', { name: 'Filtros' });
    await filters.getByRole('checkbox', { name: 'Chorizos' }).check();
    await expect(page).toHaveURL(/categoria=chorizos/);
    await filters.getByRole('checkbox', { name: 'Próximos' }).check();
    await expect(page).toHaveURL(/estado=proximos/);
    await filters.getByRole('link', { name: 'Limpiar filtros' }).click();
    await expect(page).toHaveURL(/\/cursos\/buscar\?q=chorizo$/);
  } else {
    const filters = page.getByRole('navigation', { name: 'Filtros' });
    await filters.getByRole('link', { name: 'Chorizos', exact: true }).click();
    await expect(page).toHaveURL(/categoria=chorizos/);
    // El activo pasa al principio y se quita con el mismo chip.
    await filters.getByRole('link', { name: /Chorizos \(quitar filtro\)/ }).click();
    await expect(page).not.toHaveURL(/categoria=/);
  }
});

test('una técnica de Mis cursos abre la búsqueda filtrada', async ({ page }) => {
  await page.goto('/cursos');
  await page.getByRole('link', { name: /^Ahumado/ }).click();
  await expect(page).toHaveURL(/\/cursos\/buscar\?tecnica=ahumado/);
  await expect(page.getByRole('status').filter({ hasText: /en Ahumado/ })).toBeVisible();
});

test('sin resultados sugiere preguntarle al asistente con la consulta escrita', async ({
  page,
}) => {
  await page.goto('/cursos/buscar?q=queso%20azul');
  await expect(page.getByText(/0 resultados/)).toBeVisible();

  const ask = page.getByRole('link', { name: /Pregúntale a El Charcu/ });
  await expect(ask).toHaveAttribute('href', /\/charcu\?borrador=.*queso/);
});
