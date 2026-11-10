/**
 * Recetas del recetario → cursos "Próximamente" con fecha (2026-11-10).
 *
 *   set -a; source .env.local; set +a
 *   npx tsx scripts/cursos-desde-recetario.ts > supabase/migrations/<fecha>_0060_diez_cursos_del_recetario.sql
 *
 * Sale de `scripts/cursos-desde-recetas.ts` (0034), con tres cambios:
 *   · Lee las recetas de `charcu.recetario` (QA), no de los JSON que ya no existen.
 *   · Sin videos de relleno: las lecciones de video llevan solo la foto de la
 *     receta (`poster_url`) hasta que se grabe el video de verdad.
 *   · Los pasos van como viñetas (`- `), y el curso entra en `lista-de-espera`
 *     con su `releases_on`: un miércoles por curso.
 */
import { recipeDoubts } from '../src/widgets/recipe-detail/lib/recipeDoubts';

const FIRST_RELEASE = '2027-01-27';

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

/** El orden de la lista es el orden del calendario: un miércoles cada uno. */
const COURSES: readonly {
  readonly slug: string;
  readonly category: Category;
  readonly techniques: readonly Technique[];
  readonly titles: readonly string[];
}[] = [
  {
    slug: 'chorizo-parrillero',
    category: 'chorizos',
    techniques: ['embutir-amarrar'],
    titles: [
      'El nutri y la carne fría',
      'Moler y amasar',
      'Agua helada y embutido',
      'Reposo antes de asar',
    ],
  },
  {
    slug: 'panceta-ahumada',
    category: 'jamones-curados',
    techniques: ['curado', 'ahumado'],
    titles: [
      'Frotar y curar en frío',
      'Enjuagar y formar la película',
      'Ahumar y enfriar',
      'Cocinarla antes de comer',
    ],
  },
  {
    slug: 'chorizo-criollo-argentino',
    category: 'chorizos',
    techniques: ['embutir-amarrar'],
    titles: [
      'Los secos y la carne fría',
      'Moler grueso y amasar con vino',
      'Embutir y atar',
      'Reposo antes de la parrilla',
    ],
  },
  {
    slug: 'pastrami',
    category: 'jamones-cocidos',
    techniques: ['curado', 'ahumado', 'coccion'],
    titles: [
      'La salmuera y la pieza',
      'Curar y enjuagar',
      'La costra y el ahumado',
      'Al vapor y a la mesa',
    ],
  },
  {
    slug: 'chorizo-verde-mexicano',
    category: 'chorizos',
    techniques: ['embutir-amarrar'],
    titles: [
      'La pasta verde y los secos',
      'Cortar y moler',
      'Teñir la masa y embutir',
      'Reposo y consumo',
    ],
  },
  {
    slug: 'biltong',
    category: 'jamones-curados',
    techniques: ['curado'],
    titles: [
      'El cilantro y las tiras',
      'Vinagre y especias',
      'Curar y colgar',
      'El secado',
    ],
  },
  {
    slug: 'chistorra',
    category: 'chorizos',
    techniques: ['embutir-amarrar', 'curado'],
    titles: [
      'Los secos y la carne fría',
      'Moler fino y ligar',
      'Embutir en tripa fina',
      'El oreo',
    ],
  },
  {
    slug: 'jamon-pierna-horneado',
    category: 'jamones-cocidos',
    techniques: ['curado', 'coccion'],
    titles: [
      'Deshuesar y la salmuera',
      'Curar, lavar y atar',
      'Envolver, hornear y prensar',
      'El jamón listo',
    ],
  },
  {
    slug: 'merguez',
    category: 'embutidos-frescos',
    techniques: ['embutir-amarrar'],
    titles: [
      'Los secos y la carne fría',
      'Moler y la harissa',
      'Reposo y embutido',
      'A la brasa',
    ],
  },
  {
    slug: 'fuet',
    category: 'chorizos',
    techniques: ['embutir-amarrar', 'curado'],
    titles: [
      'Los secos y la carne fría',
      'Moler y ligar con vino',
      'Embutir y el moho noble',
      'La curación',
    ],
  },
];

function releaseDate(index: number): string {
  const date = new Date(`${FIRST_RELEASE}T12:00:00Z`);
  date.setUTCDate(date.getUTCDate() + index * 7);
  return date.toISOString().slice(0, 10);
}

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

function buildModules(recipe: Recipe, titles: readonly string[]): Module[] {
  const doubts = recipeDoubts({
    name: recipe.name,
    ingredients: recipe.ingredients.map((i) => ({ ...i, pct: i.pct ?? '' })),
    tags: recipe.tags,
    stats: recipe.stats,
    doubts: recipe.doubts,
  });

  const ingredients = recipe.ingredients
    .map(
      (i) =>
        `• ${i.name}: ${i.amount}${i.pct === undefined || i.pct === '' ? '' : ` (${i.pct})`}`,
    )
    .join('\n');

  const groups = stepGroups(recipe.steps);
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
          video: null,
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
        body: group.map((step) => `- ${step.text}`).join('\n'),
        poster: recipe.image,
        video: null,
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
  release: string,
  modules: Module[],
): string {
  const lines: string[] = [];
  lines.push(`-- ${'-'.repeat(74)}`);
  lines.push(`-- ${recipe.name} · sale el ${release}`);
  lines.push(`-- ${'-'.repeat(74)}`);
  lines.push(`insert into charcu.courses
  (slug, title, summary, cover_url, level, access, kind, status, unlock_mode, position, category, techniques, releases_on)
values
  (${sql(recipe.slug)}, ${sql(recipe.name)}, ${sql(recipe.description)}, ${sql(recipe.image)},
   '${level(recipe)}', 'pago', 'curso', 'lista-de-espera', 'libre', ${String(position)},
   '${meta.category}', '{${meta.techniques.join(',')}}', date '${release}')
on conflict (slug) do update set
  title = excluded.title, summary = excluded.summary, cover_url = excluded.cover_url,
  level = excluded.level, access = excluded.access, kind = excluded.kind,
  status = excluded.status, unlock_mode = excluded.unlock_mode, position = excluded.position,
  category = excluded.category, techniques = excluded.techniques,
  releases_on = excluded.releases_on, waitlist_goal = null, updated_at = now();`);
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

async function loadRecipes(): Promise<Map<string, Recipe>> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL ?? '';
  const key = process.env.SUPABASE_SECRET_KEY ?? '';
  const slugs = COURSES.map((c) => c.slug).join(',');
  const response = await fetch(
    `${url}/rest/v1/recetario?select=content&slug=in.(${slugs})`,
    {
      headers: { apikey: key, 'Accept-Profile': 'charcu' },
    },
  );
  const rows = (await response.json()) as { content: Recipe }[];
  return new Map(rows.map((row) => [row.content.slug, row.content]));
}

const HEADER = `-- ============================================================================
-- 0060 · DIEZ CURSOS NUEVOS DEL RECETARIO, UNO POR MIÉRCOLES (2026-11-10)
--
-- ⚠️ GENERADA por scripts/cursos-desde-recetario.ts. Se cambia el script y se
-- vuelve a generar, no se edita a mano.
--
-- Siguen el calendario de la 0059: el primero sale el 27 de enero de 2027 y
-- después uno cada miércoles. Entran como lista-de-espera con su releases_on:
-- se ve el temario, el contenido está cerrado para todos y se puede pedir el
-- aviso. Las lecciones de video no tienen video todavía, solo la foto de la
-- receta. El texto sale tal cual de la receta, que ya está revisada.
--
-- Por slug y con on conflict: volver a aplicarla no duplica nada. Son cursos
-- nuevos, sin progreso de nadie, así que se rehacen sus módulos.
-- ============================================================================`;

const recipes = await loadRecipes();
const out: string[] = [HEADER];
COURSES.forEach((meta, index) => {
  const recipe = recipes.get(meta.slug);
  if (recipe === undefined) {
    throw new Error(`${meta.slug}: no está en el recetario`);
  }
  out.push(
    courseSql(
      recipe,
      meta,
      200 + index * 10,
      releaseDate(index),
      buildModules(recipe, meta.titles),
    ),
  );
});

process.stdout.write(`${out.join('\n\n')}\n`);
