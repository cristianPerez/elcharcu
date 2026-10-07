import { randomUUID } from 'node:crypto';

import { expect, test } from '@playwright/test';

/**
 * El Charcu sin cuenta (diseño final, 2026-10-07): contesta dos preguntas; la
 * 3.ª abre la hoja de crear cuenta SIN llamar a la API, y la API también la
 * rechaza si alguien la llama a mano. La IA va simulada.
 */

test('la 3.ª pregunta sin cuenta abre la hoja y no llega a la API', async ({
  page,
  context,
  baseURL,
}) => {
  // Un visitante nuevo: su cupo empieza en cero.
  await context.addCookies([
    {
      name: 'elcharcu_vid',
      value: randomUUID(),
      url: baseURL ?? 'http://localhost:3100',
    },
  ]);
  let apiCalls = 0;
  page.on('request', (request) => {
    if (request.url().includes('/api/asistente') && request.method() === 'POST') {
      apiCalls += 1;
    }
  });

  await page.goto('/charcu');
  await page.waitForLoadState('networkidle');

  const box = page.getByRole('textbox', { name: 'Tu pregunta' });
  const answers = page.getByText('RESPUESTA SIMULADA');
  for (const [index, question] of ['¿Cuánta sal de cura?', '¿Y la humedad?'].entries()) {
    await box.fill(question);
    await page.getByRole('button', { name: 'Enviar' }).click();
    await expect(answers).toHaveCount(index + 1, { timeout: 30_000 });
  }
  expect(apiCalls).toBe(2);

  await box.fill('¿Y la temperatura de la cámara?');
  await page.getByRole('button', { name: 'Enviar' }).click();

  const dialog = page.getByRole('dialog');
  await expect(dialog).toHaveAccessibleName('El Charcu · Tu tercera pregunta');
  await expect(
    dialog.getByText('Crea tu cuenta gratis para seguir preguntando'),
  ).toBeVisible();
  expect(apiCalls).toBe(2);
  // La pregunta no se pierde: sigue escrita para cuando vuelva con cuenta.
  await page.keyboard.press('Escape');
  await expect(box).toHaveValue('¿Y la temperatura de la cámara?');

  // Y a mano, la API dice que hace falta cuenta, antes de gastar nada.
  const response = await page.request.post('/api/asistente', {
    data: { turns: [{ role: 'user', text: 'Pregunta a mano' }] },
  });
  expect(response.status()).toBe(401);
  expect(await response.json()).toEqual({ error: 'necesita-cuenta' });
});
