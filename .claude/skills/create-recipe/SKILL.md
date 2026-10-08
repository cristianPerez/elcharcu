---
name: create-recipe
description: Crea una receta nueva de El Charcu a partir de un post, un vídeo o unas notas — la escribe como migración de `charcu.recetario`, la aplica en QA, genera la foto con fal.ai, la comprime al estándar del sitio y la verifica en el navegador. Úsala siempre que pidan "crea una receta", "nueva receta", "añade esta receta" o peguen el texto de un post de Instagram con ingredientes.
---

Eres el charcutero que pasa un post a receta publicable. El sitio ya tiene 45+
recetas con una forma muy concreta: tu trabajo es **imitarla**, no inventar una
nueva.

## Regla de oro

**No te inventes nada que no esté en el post.** Ni la pieza, ni el peso, ni el
método, ni el calibre de tripa. Si falta un dato y lo necesitas para que la
receta tenga sentido (calibre de tripa, disco de molienda, temperatura), pon un
valor razonable del oficio y **dilo explícitamente al final**, en la lista de
cosas a revisar. Nunca lo deslices como si viniera del post.

## 1. Lee una receta parecida antes de escribir

Desde el 2026-10-07 las recetas viven en la base (`charcu.recetario`, columna
`content`), no en JSON del repo. Elige la más cercana en técnica, no en país, y
léela de QA:

- Cocido / ahumado cocido → `kielbasa-de-pollo`
- Fresco u oreado corto → `chistorra`
- Curado largo → `salchichon-iberico`
- Sin tripa ni ahumador → `mortadela-de-pollo-casera`

```bash
set -a; source .env.local; set +a; curl -s "$SUPABASE_URL/rest/v1/recetario?slug=eq.chistorra&select=content,category,capsule_slug" -H "apikey: $SUPABASE_SECRET_KEY" -H "Authorization: Bearer $SUPABASE_SECRET_KEY" -H "Accept-Profile: charcu" | python3 -m json.tool
```

El contrato de `content` está en `src/entities/recipe/model/types.ts`. Todos
los campos de `Recipe` son obligatorios salvo `doubts`; si falta uno, la
receta no aparece (`isRecipe` la descarta).

## 2. Escribe la receta como migración

Un archivo nuevo `supabase/migrations/<AAAAMMDDhhmmss>_<NNNN>_receta_<slug>.sql`
(el siguiente número de la lista) con un `insert` en `charcu.recetario`:

```sql
insert into charcu.recetario
  (slug, name, category, tags, image, origin, capsule_slug, content, position)
values
  ('tu-slug', 'Nombre', 'chorizos', '{"Colombia","Fresco"}', '/recipes/tu-slug.jpg',
   'Colombia · 1 kg', 'embutir-un-chorizo',
   $receta${ …el JSON completo de la receta… }$receta$::jsonb,
   (select coalesce(max(position), 0) + 10 from charcu.recetario));

-- Si ya hay un curso con el mismo slug, se enlaza solo:
update charcu.recetario r set course_slug = c.slug
  from charcu.courses c where c.slug = r.slug and c.kind = 'curso' and r.slug = 'tu-slug';
```

- `slug`: kebab-case, es la URL `/recetas/<slug>`.
- `category`: una de `chorizos`, `jamones-curados`, `jamones-cocidos`,
  `embutidos-frescos`, `quesos` (los filtros del recetario).
- `capsule_slug`: la cápsula con la que termina. Embutidos →
  `embutir-un-chorizo`; piezas que se bridan → `bridar-un-jamon`; otros
  curados → `sal-de-cura`; si no aplica, `null`.
- `origin`: país y rendimiento, como en la tarjeta (`Colombia · 1 kg`).
- `image`: `/recipes/<slug>.jpg` (aunque aún no exista; la generas en el paso 4).
- `tags`: reutiliza los que ya existen. Míralos con
  `select distinct unnest(tags) from charcu.recetario order by 1;`.
  País primero, luego técnica (`Fresco`, `Curado`, `Semicurado`, `Ahumado`,
  `Cocido`, `Parrillero`, `Picante`, `Pollo`, `Bajo sodio`…).
- `eyebrow`: `"Receta · Chorizos del mundo"`.
- `ingredients`: cada uno con `pct` = peso sobre el **total de carne** (no sobre
  el total de la masa). Calcula los porcentajes, no los copies a ojo.
- `charcuteroNote`: explica qué significa el porcentaje y da los valores por
  kilo. Es la nota técnica, la que da autoridad.
- `steps`: `n` como `"01"`, `"02"`… en string.
- Voz: directa, de taller, tuteando. Frases cortas. Nada de marketing.

### Sal de cura — donde más se equivoca la gente

- **#1 (nitrito)** para todo lo que se **cocina** o se orea pocos días. Actúa
  desde el primer momento.
- **#2 (nitrito + nitrato)** solo para curados **secos de semanas o meses**.
- 2,5 g por kilo con Prague Powder #1 estándar (6,25% de nitrito) es el
  estándar **y el techo**. Si la añades, baja la sal común para compensar.
- Si el post avisa de que la dosis depende de la concentración del producto,
  **conserva ese aviso**.
- Nada de humo frío en embutidos que se comen cocidos: 80–150 °C hasta la
  temperatura interna que diga el post (normalmente 72–75 °C).

## 3. Aplícala en QA (producción, solo con aprobación de Cristian)

```bash
set -a; source .env.local; set +a; npx supabase db push
```

El sitio lee el recetario de una caché de una hora: la receta aparece sola en
como mucho una hora, o en el siguiente despliegue. La página
`/recetas/<slug>` se genera en su primera visita aunque no existiera al
compilar.

## 4. Genera la foto con fal.ai

Añade la entrada al final del array en `scripts/recipe-images/recipes.js`:

```js
{
  slug: 'tu-slug',
  subject:
    'Descripción visual en inglés: corte, color, textura, emplatado. Nada de historia ni de adjetivos que no se vean ("aromático" no se fotografía).',
}
```

Un buen `subject` menciona el corte transversal (es lo que vende un embutido),
el tipo de tripa, la superficie y uno o dos props de contexto. `generate.js` le
añade el `STYLE` compartido, que es lo que mantiene todas las fotos como una
sola marca.

La clave vive en `.env.local` como `FAL_KEY`, pero el script espera
`NEXT_PUBLIC_FAL_KEY`:

```bash
cd scripts/recipe-images && export NEXT_PUBLIC_FAL_KEY="$(grep -E '^FAL_KEY=' ../../.env.local | cut -d= -f2- | tr -d '"')" && node generate.js tu-slug
```

Sale en `scripts/recipe-images/output/<slug>.jpg` a 1024×768 y ~350 KB. **Esa
no se publica nunca tal cual.**

## 5. Comprime antes de publicar — esto es obligatorio

Las fotos se pintan como `background-image` de CSS, **sin `next/image` delante**:
lo que copies a `public/` es exactamente lo que se descarga el usuario, y varias
tarjetas cargan a la vez en la parrilla de recetas. Una imagen de 350 KB sin
comprimir es la causa número uno de que la app se sienta lenta.

**Estándar del sitio: 600 px de ancho, calidad 65 → ~60–70 KB.**

```bash
sips -Z 600 -s formatOptions 65 scripts/recipe-images/output/<slug>.jpg --out public/recipes/<slug>.jpg
```

Nunca uses `--copy` en `generate.js` ni `cp output/*.jpg public/recipes/`: eso
publica el original de 350 KB.

Comprueba siempre el resultado y no lo des por bueno sin mirar el número:

```bash
ls -l public/recipes/<slug>.jpg
```

- **Por encima de 120 KB** → baja la calidad a 55 y vuelve a comprimir **desde
  el original de `output/`**, nunca sobre el JPEG ya comprimido (recomprimir un
  JPEG dos veces acumula artefactos).
- Se renderiza a 150–180 px de alto en tarjeta y algo más en la ficha, así que
  600 px cubre pantallas retina de sobra. No subas de ahí "por calidad".
- El `README.md` de `scripts/recipe-images` menciona 900 px / calidad 70: está
  desactualizado y pesa el doble. Usa 600/65.
- Verás en `public/recipes/` algunas imágenes de 300–400 KB. Son fallos
  antiguos que se publicaron sin comprimir, no el estándar. No los imites.

## 6. Verifica antes de decir que está lista

```bash
pnpm type-check && pnpm lint
```

Y levanta la app (`preview_start` con `elcharcu-dev`, nunca `pnpm dev` por
Bash), abre `/recetas/<slug>` y haz una captura. Mira que la foto cargue, que
los `stats` no se desborden y que el texto se lea.

## 7. Entrega, sin commit

**No hagas commit ni push.** Cristian revisa cada receta antes de que entre a
`develop`. Termina con un resumen corto:

- Qué archivos tocaste.
- **Las decisiones que tuviste que tomar tú** porque el post no las traía
  (calibre, disco, sal de cura opcional u obligatoria, tags), cada una en una
  línea, para que él las confirme o las cambie.
- El peso final de la imagen.
