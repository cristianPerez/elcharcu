-- ============================================================================
-- `knowledge` — de dónde saca el Charcu AI lo NUESTRO (2026-08-29)
--
-- Hoy el asistente responde con lo que sabe el modelo y el historial del chat.
-- El contra-argumento nº1 de esta marca es literalmente "no son recetas de IA,
-- es ayuda de una persona real". Mientras la respuesta salga solo de Gemini,
-- esa frase no es verdad.
--
-- Aquí viven las recetas y las técnicas de la casa, y el prompt las inyecta.
--
-- ⚠️ RECUPERACIÓN POR PALABRAS Y TAGS, NO POR EMBEDDINGS.
--
-- Con 20 o 50 documentos, buscar por `tags` y por texto acierta igual que
-- pgvector y se hace en una tarde en vez de una semana. El día que haya 300
-- documentos se cambia SOLO la recuperación: por eso el `body` vive en esta
-- tabla y no incrustado en el prompt. pgvector es la solución correcta para
-- dentro de tres meses y la equivocada para el lunes.
--
-- ⚠️ Y LO MÁS SERIO: aquí van las dosis de sal de cura.
--
-- Una cifra mal escrita en esta tabla es una cifra que el asistente repite con
-- total seguridad a alguien que va a dárselo de comer a su familia. El miedo nº1
-- documentado de este público es enfermar a los suyos. Cada fila con
-- `kind = 'seguridad'` la revisa Cristian a mano antes de publicarla, y por eso
-- `status` arranca en 'borrador': lo que no se ha revisado no puede llegar al
-- prompt ni por accidente.
-- ============================================================================

create table charcu.knowledge (
  id         uuid primary key default gen_random_uuid(),
  slug       text not null unique,
  title      text not null,
  kind       text not null default 'receta'
               check (kind in ('receta', 'tecnica', 'seguridad')),

  -- El texto completo, en markdown. Es lo que se le pasa al modelo.
  body       text not null,

  -- Una línea que resume de qué va. Sirve para escoger sin leer el `body`
  -- entero, que es lo que hace que la selección no cueste tokens.
  summary    text not null default '',

  -- Por dónde se encuentra: 'chorizo', 'santarrosano', 'sal-de-cura', 'moho'.
  tags       text[] not null default '{}',

  -- De qué curso o cápsula sale, cuando sale de uno. Permite que el asistente
  -- diga "esto está en el curso X" y mande allá, que es el círculo que cierra
  -- IA ▸ contenido ▸ suscripción.
  course_id  uuid references charcu.courses (id) on delete set null,

  -- De dónde salió: 'instagram', 'curso', 'receta-web', 'cristian'. El día que
  -- una cifra esté mal, esto dice a qué fuente hay que volver.
  source     text,

  status     text not null default 'borrador'
               check (status in ('borrador', 'publicado')),

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger knowledge_touch_updated_at
  before update on charcu.knowledge
  for each row execute function charcu.touch_updated_at();

-- Buscar por tag es un `&&` contra el array. GIN es el índice que lo resuelve.
create index knowledge_tags_idx on charcu.knowledge using gin (tags);

-- Y buscar por texto, en español: 'curación' y 'curacion' tienen que encontrar
-- lo mismo, porque nadie escribe tildes en el chat del celular.
create index knowledge_fts_idx on charcu.knowledge
  using gin (to_tsvector('spanish', title || ' ' || summary || ' ' || body));

create index knowledge_course_idx on charcu.knowledge (course_id);

-- ----------------------------------------------------------------------------
-- Quién lo lee
--
-- Nadie, desde el navegador. Ni anónimo ni registrado.
--
-- Estas recetas SON el producto: si `knowledge` fuera legible por la API REST,
-- cualquiera se baja el recetario entero con una petición y la suscripción deja
-- de valer nada. Al modelo se lo pasa el SERVIDOR, que usa `service_role` y se
-- salta RLS. RLS activada y sin una sola política de lectura no es un olvido:
-- es la política.
-- ----------------------------------------------------------------------------

alter table charcu.knowledge enable row level security;

-- ----------------------------------------------------------------------------
-- Buscar
--
-- Devuelve lo mejor primero, con dos señales sumadas: cuánto pega el texto y
-- cuántos tags coinciden. Los tags pesan más a propósito — 'sal-de-cura' puesto
-- a mano por Cristian dice más que la palabra "sal" apareciendo en un párrafo.
--
-- `p_limit` es bajo (3) porque cada documento que entra al prompt son tokens
-- que se pagan en CADA pregunta. Ver el tope de gasto más arriba en ESTADO.md.
-- ----------------------------------------------------------------------------

create or replace function charcu.search_knowledge(
  p_query text,
  p_tags  text[] default '{}',
  p_limit integer default 3
)
returns table (
  id      uuid,
  slug    text,
  title   text,
  kind    text,
  body    text,
  summary text,
  tags    text[],
  course_id uuid,
  score   real
)
language sql
stable
security definer
set search_path = ''
as $$
  select k.id, k.slug, k.title, k.kind, k.body, k.summary, k.tags, k.course_id,
         (
           ts_rank(
             to_tsvector('spanish', k.title || ' ' || k.summary || ' ' || k.body),
             websearch_to_tsquery('spanish', coalesce(p_query, ''))
           )
           -- Cada tag que coincide vale medio punto. Con ts_rank rondando
           -- 0,0x, esto hace que un tag acertado gane a una coincidencia
           -- casual de palabra, que es justo lo que se quiere.
           --
           -- El `intersect` y no el operador `&`: en Postgres `&` sobre arrays
           -- es de la extensión `intarray` y solo sirve para enteros. Con
           -- `text[]` no existe, y la migración se caería al aplicarla.
           + (0.5 * (
               select count(*)
                 from (
                   select unnest(coalesce(p_tags, '{}'::text[]))
                   intersect
                   select unnest(k.tags)
                 ) as coincidencias
             ))::real
         ) as score
    from charcu.knowledge k
   where k.status = 'publicado'
     and (
       to_tsvector('spanish', k.title || ' ' || k.summary || ' ' || k.body)
         @@ websearch_to_tsquery('spanish', coalesce(p_query, ''))
       or coalesce(p_tags, '{}') && k.tags
     )
   order by score desc
   limit greatest(coalesce(p_limit, 3), 1);
$$;

-- Solo el servidor busca. Si esto fuera llamable desde el navegador, `body`
-- saldría entero en la respuesta y daría igual haber cerrado la tabla.
revoke all on function charcu.search_knowledge(text, text[], integer)
  from public, anon, authenticated;
grant execute on function charcu.search_knowledge(text, text[], integer) to service_role;
