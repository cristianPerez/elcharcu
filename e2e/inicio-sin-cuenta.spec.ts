import { expect, test, type Page } from '@playwright/test';

import { admin } from './admin';
import {
  captureMixpanel,
  hasHorizontalScroll,
  isDesktop,
  mockOtp,
  seriousA11yViolations,
} from './fixtures';
import { storageStateFor } from './global-setup';

/**
 * Inicio sin cuenta y crear cuenta (diseño final 01–06, 2026-10-07).
 *
 *   · Sin sesión, Cursos es la portada pública, con números reales de la base.
 *   · Con sesión, Mis cursos sin cambios.
 *   · Cada disparador abre la hoja (móvil) o el modal (escritorio) con su
 *     título; el paso 2 conserva el destino en el enlace.
 *
 * El envío del correo se simula (`mockOtp`): ningún test manda correos.
 */

interface PublicCounts {
  readonly firstCapsule: { readonly slug: string; readonly title: string };
  readonly freeCourse: { readonly slug: string; readonly title: string };
  readonly masters: number;
  readonly capsules: number;
}

async function publicCounts(): Promise<PublicCounts> {
  const { data } = await admin()
    .from('courses')
    .select('slug, title, kind, access')
    .eq('status', 'publicado')
    .order('position');
  const rows = data ?? [];
  const capsules = rows.filter((c) => c.kind === 'capsula');
  const masters = rows.filter((c) => c.kind === 'curso');
  const first = capsules[0];
  const free = masters.find((c) => c.access === 'libre');
  if (first === undefined || free === undefined) {
    throw new Error('Faltan cápsulas o el curso gratis en QA');
  }
  return {
    firstCapsule: { slug: first.slug, title: first.title },
    freeCourse: { slug: free.slug, title: free.title },
    masters: masters.length,
    capsules: capsules.length,
  };
}

function dialog(page: Page): ReturnType<Page['getByRole']> {
  return page.getByRole('dialog');
}

test.describe('Cursos sin sesión', () => {
  test('es la portada pública, con los números de la base y sin desbordar', async ({
    page,
  }) => {
    const counts = await publicCounts();
    await page.goto('/cursos');

    await expect(
      page.getByRole('heading', { level: 1, name: /Aprende el oficio en video/ }),
    ).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Mis cursos' })).toHaveCount(0);

    const stats = page.locator('dl').first();
    await expect(stats.locator('dd').nth(0)).toHaveText(String(counts.masters));
    await expect(stats.locator('dd').nth(1)).toHaveText(String(counts.capsules));

    expect(await hasHorizontalScroll(page)).toBe(false);
    expect(await seriousA11yViolations(page)).toEqual([]);
  });

  test('en el celular, las cápsulas y los cursos maestros se deslizan de lado', async ({
    page,
  }) => {
    test.skip(isDesktop(page), 'En escritorio son cuadrículas');
    await page.goto('/cursos');
    const viewport = page.viewportSize()?.width ?? 0;
    for (const id of ['empieza-title', 'maestros-title']) {
      const rail = page.locator(`section[aria-labelledby="${id}"] ul`).first();
      // Del ancho de la pantalla y con más contenido del que cabe: se desliza.
      // (Si el carril crece al ancho de su contenido, el marco lo recorta y
      // no hay scroll horizontal que detectar, pero tampoco se puede deslizar.)
      const { width, scrollWidth } = await rail.evaluate((el) => ({
        width: el.clientWidth,
        scrollWidth: el.scrollWidth,
      }));
      expect(width).toBeLessThanOrEqual(viewport);
      expect(scrollWidth).toBeGreaterThan(width);
    }
  });

  test('los planes abren en anual y cambian a mensual', async ({ page }) => {
    await page.goto('/cursos');
    const plans = page.locator('section[aria-labelledby="planes-title"]');
    await plans.scrollIntoViewIfNeeded();
    const yearly = plans.getByRole('button', { name: /Anual/ });
    const monthly = plans.getByRole('button', { name: 'Mensual' });
    const proCard = plans.locator('article').filter({ hasText: 'El Charcu Pro' });

    await expect(yearly).toHaveAttribute('aria-pressed', 'true');
    await expect(proCard).toContainText('US$7,49');
    await expect(proCard).toContainText('una vez al año');

    await monthly.click();
    await expect(monthly).toHaveAttribute('aria-pressed', 'true');
    await expect(proCard).toContainText('US$9,99');
    await expect(proCard).toContainText('cada mes');
    await expect(proCard.getByRole('link', { name: 'Suscribirme' })).toHaveAttribute(
      'href',
      /mensual/,
    );
  });

  test('/ muestra lo mismo que /cursos', async ({ page }) => {
    await page.goto('/');
    await expect(
      page.getByRole('heading', { level: 1, name: /Aprende el oficio en video/ }),
    ).toBeVisible();
  });

  test('la navegación tiene Cursos, El Charcu, Recetas y Entrar', async ({ page }) => {
    await page.goto('/cursos');
    // En el celular, la barra de abajo; en escritorio, la cabecera.
    for (const name of ['Cursos', 'El Charcu', 'Recetas', 'Entrar']) {
      await expect(
        page.getByRole('link', { name, exact: true }).filter({ visible: true }).first(),
      ).toBeVisible();
    }
  });
});

test.describe('Cursos con sesión', () => {
  test.use({ storageState: storageStateFor('gratis') });

  test('sigue siendo Mis cursos', async ({ page }) => {
    await page.goto('/cursos');
    await expect(
      page.getByRole('heading', { level: 1, name: 'Mis cursos' }),
    ).toBeVisible();
    await expect(page.getByText(/Aprende el oficio en video/)).toHaveCount(0);
  });
});

test.describe('Crear cuenta', () => {
  test('la cápsula abre la hoja con su título y el enlace vuelve a ella', async ({
    page,
  }) => {
    const { firstCapsule } = await publicCounts();
    const sentTo = await mockOtp(page);
    await page.goto('/cursos');

    const card = page.locator(`a[href="/cursos/${firstCapsule.slug}"]`).first();
    await card.scrollIntoViewIfNeeded();
    await card.click();

    await expect(dialog(page)).toBeVisible();
    await expect(dialog(page)).toHaveAccessibleName(
      `Cápsula gratis · ${firstCapsule.title}`,
    );
    await expect(dialog(page)).toHaveAttribute('aria-modal', 'true');
    expect(await seriousA11yViolations(page)).toEqual([]);

    await dialog(page).getByLabel('Tu correo').fill('e2e-hoja@elcharcu.test');
    await dialog(page).getByRole('button', { name: 'Enviarme el enlace' }).click();

    // Paso 2: revisa tu correo, con cambiar y el reenvío en cuenta atrás.
    await expect(dialog(page).getByText('Revisa tu correo')).toBeVisible();
    await expect(dialog(page).getByText('e2e-hoja@elcharcu.test')).toBeVisible();
    await expect(dialog(page).getByText(/Reenviar en \d:\d\d/)).toBeVisible();
    // El texto cambia entre celular y escritorio; los dos nombran el destino.
    await expect(
      dialog(page).getByText('la cápsula 1').filter({ visible: true }),
    ).toBeVisible();

    const redirectTo = sentTo() ?? '';
    expect(redirectTo).toContain('/auth/callback');
    expect(new URL(redirectTo).searchParams.get('next')).toBe(
      `/cursos/${firstCapsule.slug}`,
    );
    expect(new URL(redirectTo).searchParams.get('disparador')).toBe('capsula');

    // "cambiar" vuelve al paso 1 con el correo escrito.
    await dialog(page).getByRole('button', { name: 'cambiar' }).click();
    await expect(dialog(page).getByLabel('Tu correo')).toHaveValue(
      'e2e-hoja@elcharcu.test',
    );
  });

  test('el curso gratis abre la hoja con su título', async ({ page }) => {
    const { freeCourse } = await publicCounts();
    await page.goto('/cursos');

    const card = page.locator(`a[href="/cursos/${freeCourse.slug}"]`).first();
    await card.scrollIntoViewIfNeeded();
    await card.click();

    await expect(dialog(page)).toHaveAccessibleName(`Curso gratis · ${freeCourse.title}`);
  });

  test('"Crear cuenta gratis y empezar" abre la hoja general', async ({ page }) => {
    const sentTo = await mockOtp(page);
    await page.goto('/cursos');
    await page.getByRole('link', { name: 'Crear cuenta gratis y empezar' }).click();

    await expect(dialog(page)).toHaveAccessibleName('El Charcu · Tu cuenta gratis');
    await dialog(page).getByLabel('Tu correo').fill('e2e-hoja@elcharcu.test');
    await dialog(page).getByRole('button', { name: 'Enviarme el enlace' }).click();
    await expect(dialog(page).getByText('Revisa tu correo')).toBeVisible();
    expect(new URL(sentTo() ?? 'http://x').searchParams.get('disparador')).toBe(
      'crear_cuenta',
    );
  });

  test('cerrar la hoja sin entrar mide el abandono, sin mandar el correo', async ({
    page,
  }) => {
    const { firstCapsule } = await publicCounts();
    const events = await captureMixpanel(page);
    await page.goto('/cursos');

    const card = page.locator(`a[href="/cursos/${firstCapsule.slug}"]`).first();
    await card.scrollIntoViewIfNeeded();
    await card.click();
    await dialog(page).getByLabel('Tu correo').fill('abandono@elcharcu.test');
    await page.keyboard.press('Escape');
    await expect(dialog(page)).toBeHidden();

    await expect
      .poll(() => events.find((e) => e.event === 'auth_modal_closed'), {
        timeout: 20_000,
      })
      .toBeDefined();
    const closed = events.find((e) => e.event === 'auth_modal_closed');
    const opened = events.find((e) => e.event === 'auth_modal_opened');
    expect(closed?.properties).toMatchObject({
      paso: 'correo',
      escribio_correo: true,
      hubo_error: false,
      trigger: 'capsula',
      origen: `/cursos/${firstCapsule.slug}`,
    });
    // El mismo intento que la apertura, y nunca el correo escrito.
    expect(closed?.properties.intento).toBe(opened?.properties.intento);
    expect(JSON.stringify(closed?.properties)).not.toContain('abandono@');
  });

  test('Esc cierra y el foco vuelve a lo que la abrió', async ({ page }) => {
    await page.goto('/cursos');
    const trigger = page.getByRole('link', { name: 'Crear cuenta gratis y empezar' });
    await trigger.focus();
    await page.keyboard.press('Enter');
    await expect(dialog(page)).toBeVisible();

    // El foco queda dentro de la hoja.
    await page.keyboard.press('Tab');
    expect(await dialog(page).evaluate((el) => el.contains(document.activeElement))).toBe(
      true,
    );

    await page.keyboard.press('Escape');
    await expect(dialog(page)).toBeHidden();
    await expect(trigger).toBeFocused();
  });

  test('un enlace directo a una cápsula sin sesión abre la hoja en Cursos', async ({
    page,
  }) => {
    const { firstCapsule } = await publicCounts();
    await page.goto(`/cursos/${firstCapsule.slug}`);

    await expect(page).toHaveURL(/\/cursos\?abrir=/);
    await expect(dialog(page)).toHaveAccessibleName(
      `Cápsula gratis · ${firstCapsule.title}`,
    );
  });

  test('un destino externo en ?abrir= se ignora', async ({ page }) => {
    await page.goto('/cursos?abrir=%2F%2Fevil.example.com');
    await expect(
      page.getByRole('heading', { level: 1, name: /Aprende el oficio en video/ }),
    ).toBeVisible();
    await expect(dialog(page)).toHaveCount(0);
  });
});
