import { expect, test } from '@playwright/test';

import { isDesktop } from './fixtures';
import { storageStateFor } from './global-setup';

test.use({ storageState: storageStateFor('gratis') });

test('la navegación de la app cambia de abajo a arriba según el ancho', async ({
  page,
}) => {
  await page.goto('/cursos');

  const nav = page.getByRole('navigation', { name: 'Navegación de la app' });
  await expect(nav).toBeVisible();
  await expect(nav.getByRole('link', { name: /Mis cursos/ })).toHaveAttribute(
    'aria-current',
    'page',
  );

  if (isDesktop(page)) {
    await expect(
      page.getByRole('link', { name: 'El Charcu', exact: true }).first(),
    ).toBeVisible();
  }

  await nav.getByRole('link', { name: /Mi cuenta/ }).click();
  await expect(page).toHaveURL(/\/cuenta/);
});
