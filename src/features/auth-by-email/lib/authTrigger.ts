import { courseKindBySlug } from '@/entities/course/server';

import { type AuthTrigger, safeOrigin } from '@/shared/lib/analytics/server';

/**
 * Por qué alguien está en `/entrar`, a partir de `?desde=` (2026-10-07).
 *
 *   · sin `desde`                      → `menu_entrar`: llegó por el menú o un botón.
 *   · `/cursos/<slug>` de una cápsula  → `capsula`
 *   · `/cursos/<slug>` libre           → `curso_gratis`
 *   · `/cursos/<slug>` de pago         → `curso`
 *   · cualquier otra ruta de la app    → `app` (`/charcu`, `/cuenta`…)
 *
 * `avisame` y `tercera_pregunta` no pasan por aquí: el primero solo existe con
 * sesión y el segundo abre el modal en la misma página.
 */
export async function authTriggerFrom(
  desde: string | null,
): Promise<{ readonly trigger: AuthTrigger; readonly origin: string | null }> {
  const origin = safeOrigin(desde);
  if (origin === null) {
    return { trigger: 'menu_entrar', origin: null };
  }

  const slug = /^\/cursos\/([a-z0-9-]+)/.exec(origin)?.[1];
  if (slug === undefined || slug === 'buscar' || slug === 'maestros') {
    return { trigger: 'app', origin };
  }

  const course = await courseKindBySlug(slug);
  if (course === null) {
    return { trigger: 'app', origin };
  }
  if (course.kind === 'capsula') {
    return { trigger: 'capsula', origin };
  }
  return { trigger: course.access === 'libre' ? 'curso_gratis' : 'curso', origin };
}
