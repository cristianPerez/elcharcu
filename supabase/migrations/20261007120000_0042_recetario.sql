-- ============================================================================
-- El recetario pasa a la base, con RLS por plan (2026-10-07)
--
-- Hasta hoy las recetas eran 48 JSON dentro del repo, y el listado completo
-- viajaba al navegador en `/recetas`. El diseño nuevo pide que el recetario
-- completo sea de Pro y Maestro (y que no se pueda sacar por la API), pero que
-- CADA receta siga siendo pública por su link. Las dos cosas a la vez:
--
--   · listar           → solo con suscripción activa (RLS sobre la tabla);
--   · una por su slug  → `receta_por_link()`, pública, pero de a una: sin el
--                        slug no hay nada que enumerar;
--   · la vitrina       → `recetario_vitrina()`: nombre, foto y categoría para
--                        las tarjetas con candado, SIN slug ni contenido.
--
-- ⚠️ La tabla se llama `recetario` y no `recipes` porque `charcu.recipes` ya
-- existe y es otra cosa: las conversaciones con El Charcu.
--
-- El servidor de la app lee con la clave de servicio y guarda en caché (las
-- páginas de receta siguen siendo estáticas): lo que protege esto es la API
-- pública de Supabase, a la que cualquiera puede llamar con la clave pública.
--
-- Los datos de las 48 recetas van en la 0043, generada desde los JSON.
-- ============================================================================

create table charcu.recetario (
  slug         text primary key check (slug ~ '^[a-z0-9-]+$'),
  name         text not null,
  -- La categoría de los filtros. Mismos ids que `courses.category`.
  category     text not null check (category in (
                 'chorizos', 'jamones-curados', 'jamones-cocidos',
                 'embutidos-frescos', 'quesos')),
  tags         text[] not null default '{}',
  image        text not null,
  -- "Colombia · 1 kg": lo que dice la tarjeta debajo del nombre.
  origin       text,
  -- El curso que enseña esta receta, y la cápsula con la que termina.
  course_slug  text references charcu.courses (slug) on update cascade on delete set null,
  capsule_slug text references charcu.courses (slug) on update cascade on delete set null,
  -- La receta entera, con la misma forma que tenían los JSON (`Recipe`).
  content      jsonb not null check (jsonb_typeof(content) = 'object'),
  position     integer not null default 0,
  published    boolean not null default true,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

create index recetario_position_idx on charcu.recetario (position);

alter table charcu.recetario enable row level security;

-- Listar el recetario: solo Pro y Maestro. Para `anon` no hay política, así
-- que con la clave pública no sale ni una fila.
create policy recetario_select_suscritos on charcu.recetario
  for select to authenticated
  using (published and charcu.has_active_subscription((select auth.uid())));

revoke all on charcu.recetario from anon, authenticated;
grant select on charcu.recetario to authenticated;
grant all on charcu.recetario to service_role;

-- ----------------------------------------------------------------------------
-- Una receta por su link: pública, pero de a una.
-- ----------------------------------------------------------------------------
create or replace function charcu.receta_por_link(p_slug text)
returns setof charcu.recetario
language sql
stable
security definer
set search_path = ''
as $$
  select * from charcu.recetario where slug = p_slug and published;
$$;

-- ----------------------------------------------------------------------------
-- La vitrina con candado: lo que ve quien no tiene Pro. Sin slug ni contenido.
-- ----------------------------------------------------------------------------
create or replace function charcu.recetario_vitrina()
returns table (name text, category text, image text, tiene_curso boolean)
language sql
stable
security definer
set search_path = ''
as $$
  select r.name, r.category, r.image, r.course_slug is not null
    from charcu.recetario r
   where r.published
   order by r.position;
$$;

revoke all on function charcu.receta_por_link(text) from public;
revoke all on function charcu.recetario_vitrina() from public;
grant execute on function charcu.receta_por_link(text) to anon, authenticated, service_role;
grant execute on function charcu.recetario_vitrina() to anon, authenticated, service_role;

-- ============================================================================
-- "Las que te llegaron": las recetas que cada quien abrió por su link
-- ============================================================================
-- Sin cuenta se guardan a nombre del visitante (la misma cookie que ya usa el
-- cupo) y al entrar pasan a la cuenta con `link_received_recipes_to_user`.
create table charcu.recetas_recibidas (
  id              uuid primary key default gen_random_uuid(),
  recipe_slug     text not null references charcu.recetario (slug) on update cascade on delete cascade,
  visitor_id      uuid,
  user_id         uuid references auth.users (id) on delete cascade,
  first_opened_at timestamptz not null default now(),
  check (visitor_id is not null or user_id is not null)
);

create unique index recetas_recibidas_usuario_idx
  on charcu.recetas_recibidas (user_id, recipe_slug) where user_id is not null;
create unique index recetas_recibidas_visitante_idx
  on charcu.recetas_recibidas (visitor_id, recipe_slug) where user_id is null;

alter table charcu.recetas_recibidas enable row level security;

create policy recetas_recibidas_propias on charcu.recetas_recibidas
  for select to authenticated
  using (user_id = (select auth.uid()));

revoke all on charcu.recetas_recibidas from anon, authenticated;
grant select on charcu.recetas_recibidas to authenticated;
grant all on charcu.recetas_recibidas to service_role;

-- La apunta el servidor (que es quien lee la cookie httpOnly del visitante).
-- `on conflict do nothing`: abrirla otra vez no cambia la primera fecha.
create or replace function charcu.registrar_receta_recibida(
  p_slug text,
  p_visitor_id uuid,
  p_user_id uuid
)
returns void
language sql
security definer
set search_path = ''
as $$
  insert into charcu.recetas_recibidas (recipe_slug, visitor_id, user_id)
  select p_slug, p_visitor_id, p_user_id
   where exists (select 1 from charcu.recetario where slug = p_slug and published)
     and (p_visitor_id is not null or p_user_id is not null)
  on conflict do nothing;
$$;

-- Al entrar, lo que abrió de anónimo en este navegador pasa a su cuenta.
create or replace function charcu.link_received_recipes_to_user(
  p_visitor_id uuid,
  p_user_id uuid
)
returns void
language sql
security definer
set search_path = ''
as $$
  insert into charcu.recetas_recibidas (recipe_slug, user_id, first_opened_at)
  select a.recipe_slug, p_user_id, a.first_opened_at
    from charcu.recetas_recibidas a
   where a.visitor_id = p_visitor_id and a.user_id is null
  on conflict do nothing;

  delete from charcu.recetas_recibidas
   where visitor_id = p_visitor_id and user_id is null;
$$;

revoke all on function charcu.registrar_receta_recibida(text, uuid, uuid) from public;
revoke all on function charcu.link_received_recipes_to_user(uuid, uuid) from public;
grant execute on function charcu.registrar_receta_recibida(text, uuid, uuid) to service_role;
grant execute on function charcu.link_received_recipes_to_user(uuid, uuid) to service_role;
