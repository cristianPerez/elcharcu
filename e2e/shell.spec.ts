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
  await expect(nav.getByRole('link', { name: /Cursos/ })).toHaveAttribute(
    'aria-current',
    'page',
  );

  if (isDesktop(page)) {
    await expect(
      page.getByRole('link', { name: 'El Charcu', exact: true }).first(),
    ).toBeVisible();
  }

  // Las cuatro pestañas para todos (diseño final): en el celular "Cuenta" va
  // en la barra; en escritorio son las iniciales, a la derecha del menú.
  await expect(nav.getByRole('link', { name: /Recetas/ })).toBeVisible();
  await page
    .getByRole('link', { name: 'Cuenta', exact: true })
    .locator('visible=true')
    .first()
    .click();
  await expect(page).toHaveURL(/\/cuenta/);
});
