import { type Page } from '@playwright/test';

/** `true` en el proyecto de escritorio (1440×900). */
export function isDesktop(page: Page): boolean {
  return (page.viewportSize()?.width ?? 0) >= 768;
}

/** La página no debe desbordar de lado en ningún ancho. */
export async function hasHorizontalScroll(page: Page): Promise<boolean> {
  return page.evaluate(
    () => document.documentElement.scrollWidth > document.documentElement.clientWidth,
  );
}

/**
 * Accesibilidad básica con axe (diseño final, 2026-10-07): sin violaciones
 * serias ni críticas, contraste AA incluido.
 */
export async function seriousA11yViolations(
  page: Page,
  /** Solo esta parte de la pantalla (la nueva), si no es toda. */
  include?: string,
): Promise<string[]> {
  const { AxeBuilder } = await import('@axe-core/playwright');
  const builder = new AxeBuilder({ page })
    .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
    // El reproductor de Bunny es un iframe de terceros.
    .exclude('iframe');
  const { violations } = await (
    include === undefined ? builder : builder.include(include)
  ).analyze();
  return violations
    .filter((v) => v.impact === 'serious' || v.impact === 'critical')
    .map((v) => `${v.id}: ${v.nodes.map((n) => n.target.join(' ')).join(', ')}`);
}

/**
 * Simula el `signInWithOtp` de Supabase: responde 200 sin mandar ningún correo
 * y devuelve, al leerlo, el `redirect_to` que iría en el enlace.
 */
export async function mockOtp(page: Page): Promise<() => string | null> {
  let redirectTo: string | null = null;
  await page.route('**/auth/v1/otp**', async (route) => {
    redirectTo = new URL(route.request().url()).searchParams.get('redirect_to');
    await route.fulfill({ status: 200, contentType: 'application/json', body: '{}' });
  });
  return () => redirectTo;
}

export interface TrackedEvent {
  readonly event: string;
  readonly properties: Readonly<Record<string, unknown>>;
}

/**
 * Lo que el navegador le manda a Mixpanel, con propiedades. No sale de verdad:
 * se contesta aquí mismo.
 */
export async function captureMixpanel(page: Page): Promise<TrackedEvent[]> {
  const events: TrackedEvent[] = [];
  await page.context().route(/mixpanel\.com\/track/, async (route) => {
    const raw = new URLSearchParams(route.request().postData() ?? '').get('data') ?? '';
    let parsed: unknown = [];
    try {
      parsed = JSON.parse(raw);
    } catch {
      try {
        parsed = JSON.parse(Buffer.from(raw, 'base64').toString());
      } catch {
        parsed = [];
      }
    }
    for (const item of ([] as unknown[]).concat(parsed)) {
      if (typeof item === 'object' && item !== null) {
        const { event, properties } = item as { event?: unknown; properties?: unknown };
        if (typeof event === 'string') {
          events.push({
            event,
            properties:
              typeof properties === 'object' && properties !== null
                ? (properties as Record<string, unknown>)
                : {},
          });
        }
      }
    }
    await route.fulfill({ body: '1' });
  });
  return events;
}
