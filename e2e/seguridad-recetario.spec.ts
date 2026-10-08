import { expect, test } from '@playwright/test';

import { accessTokenFor, admin, publicClient } from './admin';
import { E2E_USERS } from './global-setup';

/**
 * El recetario no se puede sacar por la API de Supabase sin Pro (diseño final,
 * 2026-10-07). Se prueba con la clave PÚBLICA, la que cualquiera ve en el
 * navegador, como lo haría alguien desde la consola.
 *
 * No depende del ancho: corre solo en un proyecto.
 */

test.beforeEach(({}, testInfo) => {
  test.skip(testInfo.project.name !== 'mobile', 'No depende del ancho');
});

async function publishedCount(): Promise<number> {
  const { count } = await admin()
    .from('recetario')
    .select('slug', { count: 'exact', head: true })
    .eq('published', true);
  return count ?? 0;
}

test('sin cuenta: ni el recetario ni las lecciones', async () => {
  const anon = publicClient();

  const { data: recipes } = await anon.from('recetario').select('slug, content');
  expect(recipes ?? []).toHaveLength(0);

  const { data: lessons } = await anon.from('lessons').select('id');
  expect(lessons ?? []).toHaveLength(0);

  const { data: received } = await anon.from('recetas_recibidas').select('recipe_slug');
  expect(received ?? []).toHaveLength(0);
});

test('sin cuenta: la vitrina no trae slugs y una receta solo sale por su link', async () => {
  const anon = publicClient();

  const { data: vitrina } = await anon.rpc('recetario_vitrina');
  expect((vitrina ?? []).length).toBe(await publishedCount());
  for (const row of vitrina ?? []) {
    expect(Object.keys(row)).not.toContain('slug');
    expect(Object.keys(row)).not.toContain('content');
  }

  const { data: one } = await anon.rpc('receta_por_link', {
    p_slug: 'longaniza-colombiana',
  });
  expect(one).not.toBeNull();
});

test('cuenta Aprendiz: no lista el recetario', async () => {
  const gratis = publicClient(await accessTokenFor(E2E_USERS.gratis.email));
  const { data } = await gratis.from('recetario').select('slug');
  expect(data ?? []).toHaveLength(0);
});

test('cuenta Pro: lista el recetario completo', async () => {
  const pro = publicClient(await accessTokenFor(E2E_USERS.pro.email));
  const { data } = await pro.from('recetario').select('slug');
  expect((data ?? []).length).toBe(await publishedCount());
});
