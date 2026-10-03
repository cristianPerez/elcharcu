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
