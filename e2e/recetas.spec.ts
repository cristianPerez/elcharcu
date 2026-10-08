import { randomUUID } from 'node:crypto';

import { expect, test, type BrowserContext } from '@playwright/test';

import { admin } from './admin';
import { hasHorizontalScroll, seriousA11yViolations } from './fixtures';
import { storageStateFor } from './global-setup';

/**
 * Recetas (diseño final 07–10, 2026-10-07).
 *
 *   · Por su link, cada receta es pública y termina en el curso (Ver el curso
 *     o Avísame) y la cápsula; sin Pro, sin "recetas parecidas".
 *   · La pestaña Recetas: sin Pro, "Las que te llegaron" abiertas y el resto
 *     con candado ("Pasar a Pro"); con Pro, el recetario con buscador.
 */

const WITH_COURSE = 'jamon-de-bondiola-ahumado';
const WITHOUT_COURSE = 'longaniza-colombiana';

async function newVisitor(
  context: BrowserContext,
  baseURL: string | undefined,
): Promise<string> {
  const visitorId = randomUUID();
  await context.addCookies([
    { name: 'elcharcu_vid', value: visitorId, url: baseURL ?? 'http://localhost:3100' },
  ]);
  return visitorId;
}

async function allSlugs(): Promise<string[]> {
  const { data } = await admin().from('recetario').select('slug').eq('published', true);
  return (data ?? []).map((row) => row.slug);
}

test.describe('Receta por link', () => {
  test('con curso termina en "Ver el curso", sin recetas parecidas', async ({ page }) => {
    await page.goto(`/recetas/${WITH_COURSE}`);

    const widget = page.locator('section', {
      hasText: 'Esta receta te dice qué hacer',
    });
    await widget.last().scrollIntoViewIfNeeded();
    await expect(widget.last().getByRole('link', { name: 'Ver el curso' })).toBeVisible();

    // Ninguna otra receta enlazada en la página.
    const others = page.locator(
      `main a[href^="/recetas/"]:not([href="/recetas/${WITH_COURSE}"])`,
    );
    await expect(others).toHaveCount(0);

    expect(await hasHorizontalScroll(page)).toBe(false);
    expect(await seriousA11yViolations(page)).toEqual([]);
  });

  test('sin curso ofrece "Avísame cuando salga", que sin cuenta pide crearla', async ({
    page,
  }) => {
    await page.goto(`/recetas/${WITHOUT_COURSE}`);

    const widget = page
      .locator('section', { hasText: 'Esta receta te dice qué hacer' })
      .last();
    await widget.scrollIntoViewIfNeeded();
    await widget.getByRole('button', { name: 'Avísame cuando salga' }).click();
    await expect(page.getByRole('dialog', { name: /^Próximamente · / })).toBeVisible();
  });

  test('abrirla queda en "Las que te llegaron" de ese visitante', async ({
    page,
    context,
    baseURL,
  }) => {
    const visitorId = await newVisitor(context, baseURL);
    const recorded = page.waitForResponse((r) =>
      r.url().includes('/api/recetas/recibida'),
    );
    await page.goto(`/recetas/${WITHOUT_COURSE}`);
    expect((await recorded).status()).toBe(204);

    const { data } = await admin()
      .from('recetas_recibidas')
      .select('recipe_slug')
      .eq('visitor_id', visitorId);
    expect((data ?? []).map((row) => row.recipe_slug)).toEqual([WITHOUT_COURSE]);
  });
});

test.describe('Pestaña Recetas sin Pro', () => {
  test('la que le llegó está abierta y el resto con candado, sin sus slugs', async ({
    page,
    context,
    baseURL,
  }) => {
    await newVisitor(context, baseURL);
    const recorded = page.waitForResponse((r) =>
      r.url().includes('/api/recetas/recibida'),
    );
    await page.goto(`/recetas/${WITHOUT_COURSE}`);
    await recorded;

    await page.goto('/recetas');
    await expect(
      page.getByRole('heading', { name: 'Las que te llegaron' }),
    ).toBeVisible();
    await expect(page.locator(`a[href="/recetas/${WITHOUT_COURSE}"]`)).toHaveCount(1);

    // El HTML no trae el enlace de ninguna otra receta.
    const html = await page.content();
    const leaked = (await allSlugs()).filter(
      (slug) => slug !== WITHOUT_COURSE && html.includes(`/recetas/${slug}"`),
    );
    expect(leaked).toEqual([]);

    expect(await hasHorizontalScroll(page)).toBe(false);
    expect(await seriousA11yViolations(page)).toEqual([]);

    // Tocar una con candado abre "Pasar a Pro".
    const locked = page
      .getByRole('heading', { name: 'Todo el recetario' })
      .locator('xpath=following::ul[1]')
      .getByRole('button')
      .first();
    const name = (await locked.innerText()).replace(/\s*Pro\s*/, ' ').trim();
    await locked.click();
    const sheet = page.getByRole('dialog');
    await expect(sheet).toBeVisible();
    await expect(sheet).toHaveAccessibleName(/^Receta Pro · /);
    expect(name.length).toBeGreaterThan(0);
    await expect(
      sheet.getByText('El recetario completo es parte de El Charcu Pro'),
    ).toBeVisible();
    await expect(sheet.getByRole('link', { name: 'Pasar a Pro' })).toBeVisible();
    expect(await seriousA11yViolations(page)).toEqual([]);
  });
});

test.describe('Pestaña Recetas con cuenta Aprendiz', () => {
  test.use({ storageState: storageStateFor('gratis') });

  test('ve los candados y el "Pasar a Pro"', async ({ page }) => {
    await page.goto('/recetas');
    await expect(page.getByRole('heading', { name: 'Todo el recetario' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Pasar a Pro' })).toBeVisible();
    await expect(
      page.getByRole('heading', { name: 'Recetario', exact: true }),
    ).toHaveCount(0);
  });
});

test.describe('Pestaña Recetas con Pro', () => {
  test.use({ storageState: storageStateFor('pro') });

  test('el recetario completo, con buscador, categorías y "Cargar más"', async ({
    page,
  }) => {
    const total = (await allSlugs()).length;
    await page.goto('/recetas');

    await expect(
      page.getByRole('heading', { level: 1, name: 'Recetario' }),
    ).toBeVisible();
    await expect(
      page.getByText(`${String(total)} recetas · incluido en tu plan`),
    ).toBeVisible();

    const tiles = page.locator('main ul a[href^="/recetas/"]');
    await expect(tiles).toHaveCount(12);
    await page.getByRole('button', { name: 'Cargar más recetas' }).click();
    await expect(tiles).toHaveCount(Math.min(24, total));

    await page.getByLabel('Buscar en el recetario').fill('longaniza');
    await expect(page.locator(`a[href="/recetas/${WITHOUT_COURSE}"]`)).toBeVisible();
    for (const text of await tiles.allInnerTexts()) {
      expect(text.toLowerCase()).toContain('longaniza');
    }

    await page.getByLabel('Buscar en el recetario').fill('');
    await page.getByRole('button', { name: 'Quesos' }).click();
    await expect(page.getByRole('button', { name: 'Quesos' })).toHaveAttribute(
      'aria-pressed',
      'true',
    );
    for (const text of await tiles.allInnerTexts()) {
      expect(text).toMatch(/quesos/i);
    }

    expect(await hasHorizontalScroll(page)).toBe(false);
    expect(await seriousA11yViolations(page)).toEqual([]);
  });
});
