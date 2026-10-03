import { expect, test } from '@playwright/test';

import { nextLessonOf, userIdOf } from './admin';
import { hasHorizontalScroll } from './fixtures';
import { E2E_USERS, storageStateFor } from './global-setup';

test.describe('Mis cursos — cuenta gratis', () => {
  test.use({ storageState: storageStateFor('gratis') });

  test('enseña la ruta de cápsulas, las técnicas y los próximos', async ({ page }) => {
    await page.goto('/cursos');

    await expect(
      page.getByRole('heading', { level: 1, name: 'Mis cursos' }),
    ).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Empieza por aquí' })).toBeVisible();
    await expect(
      page.getByRole('heading', { name: 'Explora por técnica' }),
    ).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Próximamente' })).toBeVisible();
    expect(await hasHorizontalScroll(page)).toBe(false);
  });

  test('sin un curso a medias no hay "Sigue donde ibas"', async ({ page }) => {
    await page.goto('/cursos');
    await expect(page.getByRole('heading', { name: 'Empieza por aquí' })).toBeVisible();
    await expect(page.getByText('Sigue donde ibas')).toHaveCount(0);
  });
});

test.describe('Mis cursos — con un curso a medias', () => {
  test.use({ storageState: storageStateFor('pro') });

  test('"Continuar lección" lleva a la siguiente lección pendiente', async ({ page }) => {
    const userId = await userIdOf(E2E_USERS.pro.email);
    const next = await nextLessonOf(userId, 'lomo-curado');
    expect(next).not.toBeNull();

    await page.goto('/cursos');
    const card = page.getByRole('region', { name: 'Lomo de cerdo curado' });
    await expect(card).toBeVisible();
    await expect(card.getByText(/Siguiente: lección \d+ de \d+/)).toBeVisible();

    // La barra dice su avance a un lector de pantalla.
    const bar = card.getByRole('progressbar');
    await expect(bar).toHaveAttribute('aria-valuemin', '0');
    await expect(bar).toHaveAttribute('aria-valuemax', '100');
    await expect(bar).toHaveAttribute('aria-valuenow', /^\d+$/);

    // Directo a la lección, no a la portada del curso.
    await card.getByRole('link', { name: 'Continuar lección' }).click();
    await expect(page).toHaveURL(new RegExp(`/cursos/lomo-curado/${next ?? ''}$`));
  });
});
