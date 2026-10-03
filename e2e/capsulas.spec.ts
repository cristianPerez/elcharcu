import { expect, test, type Page } from '@playwright/test';

import { lessonIdsOf, resetProgress, userIdOf } from './admin';
import { hasHorizontalScroll } from './fixtures';
import { E2E_USERS, storageStateFor } from './global-setup';

test.use({ storageState: storageStateFor('capsulas') });

const CAPSULES = [
  'Qué saber de la sal de cura',
  'Calcula tus ingredientes con El Charcu',
  'Cómo bridar un jamón',
  'Formas de embutir un chorizo',
  'Cómo amarrar los chorizos',
];

let userId = '';

test.beforeEach(async () => {
  userId = await userIdOf(E2E_USERS.capsulas.email);
  await resetProgress(userId);
});

function rail(page: Page): ReturnType<Page['getByRole']> {
  return page.getByRole('region', { name: 'Empieza por aquí' });
}

test('solo la cápsula siguiente es clickeable', async ({ page }) => {
  await page.goto('/cursos');
  const section = rail(page);
  await expect(section.getByText('0 de 5 · gratis')).toBeVisible();

  // Una sola entrada: la primera, que es la actual.
  await expect(section.getByRole('link')).toHaveCount(1);
  await expect(section.getByRole('link')).toContainText(CAPSULES[0] ?? '');
  await expect(section.getByRole('link')).toContainText('Empezar');

  // Las otras cuatro no son enlaces, llevan aria-disabled y dicen cuándo se abren.
  const locked = section.locator('[aria-disabled="true"]');
  await expect(locked).toHaveCount(4);
  await expect(locked.first()).toContainText('Se abre al terminar la 1');
  expect(await hasHorizontalScroll(page)).toBe(false);
});

test('al completar una cápsula se desbloquea la siguiente', async ({ page }) => {
  // Se completa por el camino real: la misma ruta que usa el botón de la lección.
  for (const lessonId of await lessonIdsOf('sal-de-cura')) {
    const response = await page.request.post('/api/progreso', {
      data: { lessonId, second: 0, completed: true },
    });
    expect(response.ok()).toBe(true);
  }

  await page.goto('/cursos');
  const section = rail(page);
  await expect(section.getByText('1 de 5 · gratis')).toBeVisible();

  // La hecha se puede repasar y la segunda pasa a ser la actual.
  await expect(section.getByRole('link')).toHaveCount(2);
  await expect(
    section.getByRole('link', { name: new RegExp(`Hecha.*${CAPSULES[0] ?? ''}`) }),
  ).toBeVisible();
  await expect(
    section.getByRole('link', { name: new RegExp(CAPSULES[1] ?? '') }),
  ).toContainText('Empezar');
  await expect(section.locator('[aria-disabled="true"]')).toHaveCount(3);
});

test('sin progreso no aparece "Sigue donde ibas"', async ({ page }) => {
  await page.goto('/cursos');
  await expect(rail(page)).toBeVisible();
  await expect(page.getByText('Sigue donde ibas')).toHaveCount(0);
});

test.afterAll(async () => {
  if (userId !== '') {
    await resetProgress(userId);
  }
});
