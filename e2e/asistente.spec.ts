import { expect, test, type Page } from '@playwright/test';

import { hasHorizontalScroll } from './fixtures';
import { storageStateFor } from './global-setup';

// La cuenta pro: 200 preguntas al mes. La gratis tiene 8 y estos tests las
// gastarían. La IA va simulada (AI_SIMULAR_IA=1 en playwright.config).
test.use({ storageState: storageStateFor('pro') });

async function startFresh(page: Page): Promise<void> {
  await page.goto('/charcu');
  // Si quedó abierta una conversación de otra corrida, se empieza una nueva.
  const fresh = page.getByRole('button', { name: 'Receta nueva' }).first();
  if (
    !(await page.getByRole('heading', { level: 1, name: 'Receta nueva' }).isVisible())
  ) {
    await fresh.click();
  }
  await expect(
    page.getByRole('heading', { level: 1, name: 'Receta nueva' }),
  ).toBeAttached();
}

async function ask(page: Page, text: string): Promise<void> {
  await page.getByRole('textbox', { name: 'Tu pregunta' }).fill(text);
  await page.getByRole('button', { name: 'Enviar' }).click();
  await expect(page.getByText('RESPUESTA SIMULADA').last()).toBeVisible({
    timeout: 30_000,
  });
}

/** La lista de recetas: el cajón en el celular, la columna fija en escritorio. */
async function recipesNav(page: Page): Promise<ReturnType<Page['getByRole']>> {
  const menuButton = page.getByRole('button', { name: 'Mis recetas' });
  if (await menuButton.isVisible()) {
    await menuButton.click();
    await expect(page.getByRole('dialog', { name: 'Mis recetas' })).toBeVisible();
  }
  return page.getByRole('navigation', { name: 'Mis recetas' });
}

test('receta nueva: los accesos dejan la frase escrita sin enviarla', async ({
  page,
}) => {
  await startFresh(page);
  await expect(page.getByText('¿Qué vas a preparar hoy?')).toBeVisible();

  await page.getByRole('button', { name: /Calcular ingredientes/ }).click();
  const box = page.getByRole('textbox', { name: 'Tu pregunta' });
  await expect(box).toHaveValue(/Calcúlame los ingredientes/);
  await expect(box).toBeFocused();
  // No se mandó nada: sigue el saludo.
  await expect(page.getByText('¿Qué vas a preparar hoy?')).toBeVisible();
  expect(await hasHorizontalScroll(page)).toBe(false);
});

test('la cabecera cambia tras el primer mensaje', async ({ page }) => {
  await startFresh(page);
  await ask(page, 'Quiero hacer longaniza colombiana con 2 kg');

  const title = page.getByRole('heading', { level: 1 });
  await expect(title).not.toHaveText('Receta nueva');
  await expect(title).toBeVisible();
  await expect(page.getByRole('button', { name: 'Receta nueva' }).first()).toBeVisible();
});

test('el menú de recetas cambia de conversación', async ({ page }) => {
  await startFresh(page);
  await ask(page, 'Primera receta: chorizo santarrosano');
  await page.getByRole('button', { name: 'Receta nueva' }).first().click();
  await expect(
    page.getByRole('heading', { level: 1, name: 'Receta nueva' }),
  ).toBeAttached();
  await ask(page, 'Segunda receta: bondiola curada');

  const nav = await recipesNav(page);
  // La más reciente que NO es la abierta. No se cuenta por posición: el orden
  // lo fija `last_message_at`, que el servidor toca en segundo plano después
  // de contestar, y a veces la abierta todavía no subió al primer puesto.
  const other = nav.locator('button:not([aria-current="true"])').first();
  await expect(nav.locator('button[aria-current="true"]')).toHaveCount(1);
  await other.click();

  const transcript = page.locator('[aria-live="polite"]').first();
  await expect(
    transcript.getByText('Primera receta: chorizo santarrosano', { exact: true }),
  ).toBeVisible();
  await expect(
    transcript.getByText('Segunda receta: bondiola curada', { exact: true }),
  ).toHaveCount(0);
  await expect(page.getByRole('heading', { level: 1 })).not.toHaveText('Receta nueva');
});

test('el borrador de la búsqueda llega escrito, no enviado', async ({ page }) => {
  await page.goto('/charcu?borrador=Tengo%20una%20duda%20sobre%20jam%C3%B3n%3A%20');
  await expect(page.getByRole('textbox', { name: 'Tu pregunta' })).toHaveValue(
    'Tengo una duda sobre jamón: ',
  );
  await expect(page).toHaveURL(/\/charcu$/);
});
