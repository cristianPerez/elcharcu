-- ============================================================================
-- Categoría y técnicas de cada curso (2026-10-03)
--
-- El rediseño de "Mis cursos" filtra por CATEGORÍA (los chips: Chorizos,
-- Jamones curados…) y por TÉCNICA ("Explora por técnica": Embutir y amarrar,
-- Curado, Ahumado, Cocción). Ninguna de las dos existía: el catálogo solo
-- sabía si algo era cápsula o curso.
--
--   · `category`   — UNA por curso, o ninguna. Las cápsulas de base (la sal de
--                    cura, calcular con El Charcu) no son de ninguna pieza en
--                    concreto y se quedan en null: así no aparecen al filtrar
--                    "Chorizos" como si fueran de chorizo.
--   · `techniques` — VARIAS por curso. El santarrosano se embute Y se ahuma.
--
-- Los ids son los mismos que `src/shared/config/interests.ts` donde coinciden,
-- y como allí NO se renombran una vez publicados: la URL los lleva
-- (`?categoria=chorizos`) y puede estar compartida por WhatsApp.
--
-- ⚠️ El relleno de abajo es una PROPUESTA para que Cristian la revise, no un
-- dato que alguien haya decidido. Cambiarlo es un `update`, no otra migración
-- de esquema.
-- ============================================================================

alter table charcu.courses
  add column if not exists category text
    check (category in (
      'chorizos', 'jamones-curados', 'jamones-cocidos', 'embutidos-frescos', 'quesos'
    )),
  add column if not exists techniques text[] not null default '{}'
    check (techniques <@ array['embutir-amarrar', 'curado', 'ahumado', 'coccion']::text[]);

comment on column charcu.courses.category is
  'La pieza de la que trata (chips de Mis cursos). Null = de base, de ninguna pieza.';
comment on column charcu.courses.techniques is
  'Las técnicas que enseña ("Explora por técnica"). Puede ser más de una.';

-- Para el filtro por técnica (`techniques @> array[...]`).
create index if not exists courses_techniques_idx
  on charcu.courses using gin (techniques);

-- ----------------------------------------------------------------------------
-- El relleno inicial. Por slug, así aguanta un `db push` sobre una base vacía:
-- si el curso no existe, el `update` no toca nada.
-- ----------------------------------------------------------------------------
update charcu.courses set category = null,              techniques = '{curado}'
 where slug = 'sal-de-cura';
update charcu.courses set category = null,              techniques = '{}'
 where slug = 'calcular-con-el-charcu';
update charcu.courses set category = 'jamones-curados', techniques = '{embutir-amarrar}'
 where slug = 'bridar-un-jamon';
update charcu.courses set category = 'chorizos',        techniques = '{embutir-amarrar}'
 where slug in ('embutir-un-chorizo', 'amarrar-chorizos');
update charcu.courses set category = 'jamones-curados', techniques = '{curado}'
 where slug = 'lomo-curado';
update charcu.courses set category = 'embutidos-frescos', techniques = '{embutir-amarrar}'
 where slug = 'longaniza-colombiana';
update charcu.courses set category = 'chorizos',        techniques = '{embutir-amarrar,ahumado}'
 where slug = 'chorizo-santarrosano';
update charcu.courses set category = 'chorizos',        techniques = '{embutir-amarrar,coccion}'
 where slug = 'chorizo-paisa';
update charcu.courses set category = 'chorizos',        techniques = '{embutir-amarrar}'
 where slug = 'chorizo-de-ajo';
