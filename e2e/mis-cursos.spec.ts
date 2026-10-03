import { expect, test } from '@playwright/test';

import { hasHorizontalScroll } from './fixtures';
import { storageStateFor } from './global-setup';

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

  test('"Sigue donde ibas" lleva a la lección que toca', async ({ page }) => {
    await page.goto('/cursos');

    const card = page.getByRole('region', { name: 'Lomo de cerdo curado' });
    await expect(card).toBeVisible();
    await expect(card.getByText(/Siguiente: lección \d+ de \d+/)).toBeVisible();
    await expect(card.getByRole('link', { name: 'Continuar lección' })).toHaveAttribute(
      'href',
      /\/cursos\/lomo-curado\/.+/,
    );
  });
});
