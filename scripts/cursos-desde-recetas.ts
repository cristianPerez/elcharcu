/**
 * Convierte recetas del sitio en cursos de El Charcu Pro (2026-10-03).
 *
 *   npx tsx scripts/cursos-desde-recetas.ts > supabase/migrations/<fecha>_<n>_cursos_desde_recetas.sql
 *
 * Cada receta pasa a ser un mini curso con la forma del lomo curado:
 *
 *   1. Bienvenida        → video: la intro de la receta.
 *   2. Antes de empezar  → texto: ingredientes, proporción y notas del charcutero.
 *   3. Paso a paso       → videos: los pasos de la receta, de a dos o tres.
 *   4. Terminar          → texto (cocción, consejos) e imagen (cómo debe quedar).
 *
 * ⚠️ LOS VIDEOS SON DE RELLENO: los del lomo curado, en rueda, hasta que
 * Cristian grabe los de cada curso. El texto de debajo de cada video sí es el
 * definitivo: sale tal cual de la receta, que ya está revisada.
 *
 * Las preguntas para El Charcu (`ask`) son las MISMAS que enseña la página de
 * la receta: salen de `recipeDoubts`, no se escriben otra vez.
 */
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

import { recipeDoubts } from '../src/widgets/recipe-detail/lib/recipeDoubts';

interface Recipe {
  readonly slug: string;
  readonly name: string;
  readonly description: string;
  readonly image: string;
  readonly tags: readonly string[];
  readonly subtitle: string;
  readonly intro: string;
  readonly quote?: string;
  readonly stats: readonly { label: string; value: string }[];
  readonly ingredientsNote?: string;
  readonly ingredients: readonly { name: string; amount: string; pct?: string }[];
  readonly proportionNote?: string;
  readonly charcuteroNote?: string;
  readonly steps: readonly { n: string; text: string }[];
  readonly tips?: readonly { title: string; description: string }[];
  readonly cookMethods?: readonly { title: string; description: string }[];
  readonly recommendations?: readonly string[];
  readonly resultNote?: string;
  readonly doubts?: Parameters<typeof recipeDoubts>[0]['doubts'];
}

type Category =
  'chorizos' | 'jamones-curados' | 'jamones-cocidos' | 'embutidos-frescos' | 'quesos';
type Technique = 'embutir-amarrar' | 'curado' | 'ahumado' | 'coccion';

/** El orden de la lista es el orden del catálogo, después de los cursos de siempre. */
const COURSES: readonly { slug: string; category: Category; techniques: Technique[] }[] =
  [
    {
      slug: 'chorizos-picantes-jalapeno-queso-cheddar',
      category: 'chorizos',
      techniques: ['embutir-amarrar'],
    },
    {
      slug: 'chorizo-santarrosano',
      category: 'chorizos',
      techniques: ['embutir-amarrar'],
    },
    {
      slug: 'salchichon-cervecero-colombiano',
      category: 'chorizos',
      techniques: ['embutir-amarrar', 'ahumado', 'coccion'],
    },
    {
      slug: 'salami-de-res',
      category: 'chorizos',
      techniques: ['embutir-amarrar', 'curado'],
    },
    {
      slug: 'kielbasa-polaca',
      category: 'chorizos',
      techniques: ['embutir-amarrar', 'curado', 'ahumado', 'coccion'],
    },
    {
      slug: 'kielbasa-de-mozzarella-y-jalapeno',
      category: 'chorizos',
      techniques: ['embutir-amarrar', 'ahumado', 'coccion'],
    },
    {
      slug: 'kielbasa-de-pollo',
      category: 'chorizos',
      techniques: ['embutir-amarrar', 'ahumado', 'coccion'],
    },
    {
      slug: 'jamon-de-bondiola-ahumado',
      category: 'jamones-cocidos',
      techniques: ['curado', 'ahumado', 'coccion'],
    },
    { slug: 'charqui-de-res', category: 'jamones-curados', techniques: ['curado'] },
    { slug: 'queso-burrata', category: 'quesos', techniques: [] },
  ];

/** Los videos del lomo curado, de relleno, en rueda. */
const PLACEHOLDER_VIDEOS = [
  'f3a57ec6-49fa-4484-a0c8-15ab361cd4e0',
  '6bca551d-d813-4bf6-990e-1f5cba53389d',
  '8693ac0e-6ddd-4de8-ac2a-3c7878659063',
  '14c9bb65-a936-45d3-8ac4-a7d41e7cf79d',
  '9767cee6-0bf7-451a-a3c5-1e6925b8eb9b',
  '2fa024cc-a711-468c-b42a-e370699524bd',
];

/** Títulos a mano para los grupos de pasos: derivarlos de la frase salía torpe. */
const STEP_TITLES: Record<string, readonly string[]> = JSON.parse(
  readFileSync(join(import.meta.dirname, 'cursos-desde-recetas.titulos.json'), 'utf8'),
) as Record<string, readonly string[]>;

interface Lesson {
  readonly kind: 'video' | 'texto' | 'imagen';
  readonly title: string;
  readonly summary: string;
  readonly body: string | null;
  readonly poster: string | null;
  readonly video: string | null;
  readonly file: string | null;
  readonly ask: string | null;
}

interface Module {
  readonly title: string;
  readonly summary: string;
  readonly lessons: readonly Lesson[];
}

const sql = (value: string | null): string =>
  value === null ? 'null' : `$t$${value}$t$`;

function firstSentence(text: string, max = 110): string {
  const clean = text.replace(/\s+/g, ' ').trim();
  const cut = clean.match(/^.*?[.!?](\s|$)/)?.[0]?.trim() ?? clean;
  return cut.length <= max ? cut : `${cut.slice(0, max - 1).replace(/\s\S*$/, '')}…`;
}

function level(recipe: Recipe): 'para-empezar' | 'intermedio' | 'avanzado' {
  const value = recipe.stats.find((s) => /nivel/i.test(s.label))?.value ?? '';
  if (/avanzad/i.test(value)) return 'avanzado';
  if (/intermed/i.test(value)) return 'intermedio';
  return 'para-empezar';
}

/** Los pasos en grupos de dos o tres: cuatro lecciones como mucho. */
function stepGroups<T>(steps: readonly T[]): T[][] {
  const lessons = Math.min(4, Math.ceil(steps.length / 2));
  const size = Math.ceil(steps.length / lessons);
  const groups: T[][] = [];
  for (let i = 0; i < steps.length; i += size) groups.push(steps.slice(i, i + size));
  return groups;
}

function buildModules(recipe: Recipe, videoOffset: number): Module[] {
  const doubts = recipeDoubts({
    name: recipe.name,
    ingredients: recipe.ingredients.map((i) => ({ ...i, pct: i.pct ?? '' })),
    tags: recipe.tags,
    stats: recipe.stats,
    doubts: recipe.doubts,
  });
  let video = videoOffset;
  const nextVideo = (): string =>
    PLACEHOLDER_VIDEOS[video++ % PLACEHOLDER_VIDEOS.length] ?? '';

  const ingredients = recipe.ingredients
    .map(
      (i) =>
        `• ${i.name}: ${i.amount}${i.pct === undefined || i.pct === '' ? '' : ` (${i.pct})`}`,
    )
    .join('\n');

  const groups = stepGroups(recipe.steps);
  const titles = STEP_TITLES[recipe.slug] ?? [];
  if (titles.length !== groups.length) {
    throw new Error(
      `${recipe.slug}: hay ${String(groups.length)} grupos de pasos y ${String(titles.length)} títulos`,
    );
  }

  const finishing: Lesson[] = [];
  if ((recipe.cookMethods?.length ?? 0) > 0) {
    finishing.push({
      kind: 'texto',
      title: 'Cómo cocinarlo y servirlo',
      summary: firstSentence(recipe.cookMethods?.[0]?.description ?? ''),
      body: (recipe.cookMethods ?? [])
        .map((m) => `${m.title}\n${m.description}`)
        .join('\n\n'),
      poster: null,
      video: null,
      file: null,
      ask: null,
    });
  }
  const advice = [
    ...(recipe.tips ?? []).map((t) => `${t.title}\n${t.description}`),
    ...((recipe.recommendations?.length ?? 0) > 0
      ? [
          `Para no fallar\n${(recipe.recommendations ?? []).map((r) => `• ${r}`).join('\n')}`,
        ]
      : []),
  ];
  if (advice.length > 0) {
    finishing.push({
      kind: 'texto',
      title: 'Lo que dice el charcutero',
      summary: firstSentence(
        recipe.tips?.[0]?.description ?? recipe.recommendations?.[0] ?? '',
      ),
      body: advice.join('\n\n'),
      poster: null,
      video: null,
      file: null,
      ask: null,
    });
  }
  finishing.push({
    kind: 'imagen',
    title: 'Así tiene que quedar',
    summary: firstSentence(recipe.resultNote ?? recipe.subtitle, 160),
    body: null,
    poster: null,
    video: null,
    file: recipe.image,
    ask: doubts.onServing.prompt,
  });

  return [
    {
      title: 'Bienvenida',
      summary: 'Lo que vas a lograr.',
      lessons: [
        {
          kind: 'video',
          title: 'Esto es lo que vas a lograr',
          summary: recipe.subtitle,
          body: [recipe.intro, recipe.quote === undefined ? null : `«${recipe.quote}»`]
            .filter((part): part is string => part !== null)
            .join('\n\n'),
          poster: recipe.image,
          video: nextVideo(),
          file: null,
          ask: doubts.onIntro.prompt,
        },
      ],
    },
    {
      title: 'Antes de empezar',
      summary: 'Qué lleva, en qué proporción y por qué.',
      lessons: [
        {
          kind: 'texto',
          title: 'Ingredientes y proporción',
          summary: firstSentence(recipe.proportionNote ?? recipe.description),
          body: [
            ingredients,
            recipe.proportionNote,
            recipe.charcuteroNote,
            recipe.ingredientsNote,
          ]
            .filter((part): part is string => part !== undefined && part !== '')
            .join('\n\n'),
          poster: null,
          video: null,
          file: null,
          ask: doubts.onIngredients.prompt,
        },
      ],
    },
    {
      title: 'Paso a paso',
      summary: `Los ${String(recipe.steps.length)} pasos de la receta, en orden.`,
      lessons: groups.map((group, index) => ({
        kind: 'video' as const,
        title: titles[index] ?? '',
        summary: firstSentence(group[0]?.text ?? ''),
        body: group.map((step) => `${String(Number(step.n))}. ${step.text}`).join('\n\n'),
        poster: recipe.image,
        video: nextVideo(),
        file: null,
        ask: index === groups.length - 1 ? doubts.onProcess.prompt : null,
      })),
    },
    {
      title: 'Terminar',
      summary: 'Cocinarlo, servirlo y saber que quedó bien.',
      lessons: finishing,
    },
  ];
}

function courseSql(
  recipe: Recipe,
  meta: (typeof COURSES)[number],
  position: number,
  modules: Module[],
): string {
  const lines: string[] = [];
  lines.push(`-- ${'-'.repeat(74)}`);
  lines.push(`-- ${recipe.name}`);
  lines.push(`-- ${'-'.repeat(74)}`);
  lines.push(`insert into charcu.courses
  (slug, title, summary, cover_url, level, access, kind, status, unlock_mode, position, category, techniques)
values
  (${sql(recipe.slug)}, ${sql(recipe.name)}, ${sql(recipe.description)}, ${sql(recipe.image)},
   '${level(recipe)}', 'pago', 'curso', 'publicado', 'libre', ${String(position)},
   '${meta.category}', '{${meta.techniques.join(',')}}')
on conflict (slug) do update set
  title = excluded.title, summary = excluded.summary, cover_url = excluded.cover_url,
  level = excluded.level, access = excluded.access, kind = excluded.kind,
  status = excluded.status, unlock_mode = excluded.unlock_mode, position = excluded.position,
  category = excluded.category, techniques = excluded.techniques, updated_at = now();`);
  lines.push(
    `delete from charcu.modules where course_id = (select id from charcu.courses where slug = ${sql(recipe.slug)});`,
  );

  modules.forEach((module, mIndex) => {
    lines.push(`with m as (
  insert into charcu.modules (course_id, title, summary, position)
  select id, ${sql(module.title)}, ${sql(module.summary)}, ${String(mIndex)}
    from charcu.courses where slug = ${sql(recipe.slug)}
  returning id
)
insert into charcu.lessons
  (module_id, kind, title, summary, position, body, poster_url, bunny_video_id, file_url, ask)
values
${module.lessons
  .map(
    (l, lIndex) =>
      `  ((select id from m), '${l.kind}', ${sql(l.title)}, ${sql(l.summary)}, ${String(lIndex)},
   ${sql(l.body)}, ${sql(l.poster)}, ${sql(l.video)}, ${sql(l.file)}, ${sql(l.ask)})`,
  )
  .join(',\n')};`);
  });
  return lines.join('\n\n');
}

const recipesDir = join(import.meta.dirname, '../src/entities/recipe/recipes');
const out: string[] = [
  readFileSync(
    join(import.meta.dirname, 'cursos-desde-recetas.cabecera.sql'),
    'utf8',
  ).trim(),
];

COURSES.forEach((meta, index) => {
  const recipe = JSON.parse(
    readFileSync(join(recipesDir, `${meta.slug}.json`), 'utf8'),
  ) as Recipe;
  out.push(courseSql(recipe, meta, 60 + index * 10, buildModules(recipe, index)));
});

process.stdout.write(`${out.join('\n\n')}\n`);
