-- ============================================================================
-- El Charcu — esquema inicial
--
-- Todo vive en el esquema `charcu`, no en `public`. Así, si esta base de datos
-- llega a compartirse con otra app, no hay choque de nombres ni mezcla de datos.
--
-- La regla del negocio (UNA receta gratis por cuenta) se aplica aquí abajo con
-- un trigger, no solo en el navegador: desde el servidor no se puede saltar.
-- ============================================================================

create schema if not exists charcu;

-- ----------------------------------------------------------------------------
-- Utilidades
-- ----------------------------------------------------------------------------

create or replace function charcu.touch_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at := now();
  return new;
end;
$$;

-- ----------------------------------------------------------------------------
-- profiles — 1 a 1 con la cuenta de Supabase Auth
-- ----------------------------------------------------------------------------

create table charcu.profiles (
  id                uuid primary key references auth.users (id) on delete cascade,
  country           text not null default 'co',
  experience_level  text not null default 'curioso'
                      check (experience_level in ('curioso', 'apasionado', 'avanzado')),
  -- Se vuelve true en cuanto abre su primera receta. Lo pone el trigger del candado.
  free_recipe_used  boolean not null default false,
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now()
);

create trigger profiles_touch_updated_at
  before update on charcu.profiles
  for each row execute function charcu.touch_updated_at();

-- Cada cuenta nueva estrena perfil sola.
create or replace function charcu.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into charcu.profiles (id)
  values (new.id)
  on conflict (id) do nothing;
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function charcu.handle_new_user();

-- ----------------------------------------------------------------------------
-- subscriptions — una fila por cuenta. SOLO la escribe el webhook de pagos.
-- ----------------------------------------------------------------------------

create table charcu.subscriptions (
  id                  uuid primary key default gen_random_uuid(),
  user_id             uuid not null unique references auth.users (id) on delete cascade,
  status              text not null default 'free'
                        check (status in ('free', 'active', 'past_due', 'canceled')),
  plan_id             text,
  -- Por qué carril entró el pago: mercadopago | hotmart | stripe | whatsapp
  rail                text,
  country             text,
  current_period_end  timestamptz,
  created_at          timestamptz not null default now(),
  updated_at          timestamptz not null default now()
);

create trigger subscriptions_touch_updated_at
  before update on charcu.subscriptions
  for each row execute function charcu.touch_updated_at();

create or replace function charcu.has_active_subscription(p_user_id uuid)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1
    from charcu.subscriptions
    where user_id = p_user_id
      and status = 'active'
      and (current_period_end is null or current_period_end > now())
  );
$$;

-- ----------------------------------------------------------------------------
-- recipe_sessions — una sesión = una receta que el usuario está haciendo
-- ----------------------------------------------------------------------------

create table charcu.recipe_sessions (
  id            uuid primary key default gen_random_uuid(),
  user_id       uuid not null references auth.users (id) on delete cascade,
  product       text not null,
  is_free       boolean not null default false,
  status        text not null default 'active'
                  check (status in ('active', 'completed', 'discarded')),
  started_at    timestamptz not null default now(),
  completed_at  timestamptz,
  -- Volver a la misma receta nunca cuenta como empezar otra.
  unique (user_id, product)
);

create index recipe_sessions_user_idx on charcu.recipe_sessions (user_id, started_at desc);

-- EL CANDADO. Cada cuenta se lleva UNA receta completa gratis; la segunda
-- receta distinta exige suscripción activa. Vive en la base de datos a
-- propósito: en el navegador se podía saltar borrando datos, aquí no.
create or replace function charcu.enforce_recipe_gate()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_previous int;
begin
  select count(*) into v_previous
  from charcu.recipe_sessions
  where user_id = new.user_id;

  if v_previous = 0 then
    new.is_free := true;
    update charcu.profiles set free_recipe_used = true where id = new.user_id;
    return new;
  end if;

  if not charcu.has_active_subscription(new.user_id) then
    raise exception 'PAYWALL: esta cuenta ya usó su receta gratis'
      using errcode = 'check_violation';
  end if;

  new.is_free := false;
  return new;
end;
$$;

create trigger recipe_sessions_gate
  before insert on charcu.recipe_sessions
  for each row execute function charcu.enforce_recipe_gate();

-- ----------------------------------------------------------------------------
-- chat_messages — la conversación con el asistente, por sesión
-- ----------------------------------------------------------------------------

create table charcu.chat_messages (
  id          uuid primary key default gen_random_uuid(),
  session_id  uuid not null references charcu.recipe_sessions (id) on delete cascade,
  user_id     uuid not null references auth.users (id) on delete cascade,
  role        text not null check (role in ('user', 'assistant')),
  content     text not null,
  -- Ruta en Supabase Storage de la foto (moho, corte, superficie).
  image_path  text,
  created_at  timestamptz not null default now()
);

create index chat_messages_session_idx on charcu.chat_messages (session_id, created_at);

-- ----------------------------------------------------------------------------
-- courses / videos — los mini-cursos
-- ----------------------------------------------------------------------------

create table charcu.courses (
  id            text primary key,
  name          text not null,
  description   text,
  rating        numeric(2, 1),
  position      integer not null default 0,
  is_published  boolean not null default false,
  created_at    timestamptz not null default now()
);

create table charcu.videos (
  id                uuid primary key default gen_random_uuid(),
  course_id         text not null references charcu.courses (id) on delete cascade,
  title             text not null,
  description       text,
  storage_path      text,
  duration_seconds  integer,
  position          integer not null default 0,
  -- Los 1–2 videos de entrada que se ven sin pagar.
  is_free           boolean not null default false,
  created_at        timestamptz not null default now()
);

create index videos_course_idx on charcu.videos (course_id, position);

-- ----------------------------------------------------------------------------
-- saved_recipes — recetas de redes, revisadas por el método de El Charcu
-- ----------------------------------------------------------------------------

create table charcu.saved_recipes (
  id               uuid primary key default gen_random_uuid(),
  user_id          uuid not null references auth.users (id) on delete cascade,
  source_url       text,
  source_kind      text check (source_kind in ('tiktok', 'instagram', 'youtube', 'texto')),
  raw_input        text,
  corrected_title  text,
  corrected_body   text,
  created_at       timestamptz not null default now()
);

create index saved_recipes_user_idx on charcu.saved_recipes (user_id, created_at desc);

-- ============================================================================
-- RLS — por defecto nadie ve nada; cada quien ve lo suyo.
-- ============================================================================

alter table charcu.profiles         enable row level security;
alter table charcu.subscriptions    enable row level security;
alter table charcu.recipe_sessions  enable row level security;
alter table charcu.chat_messages    enable row level security;
alter table charcu.courses          enable row level security;
alter table charcu.videos           enable row level security;
alter table charcu.saved_recipes    enable row level security;

-- profiles: cada quien el suyo
create policy profiles_select_own on charcu.profiles
  for select to authenticated using ((select auth.uid()) = id);
create policy profiles_update_own on charcu.profiles
  for update to authenticated using ((select auth.uid()) = id)
  with check ((select auth.uid()) = id);

-- subscriptions: se leen, no se escriben desde el cliente.
-- Solo la clave de servicio (el webhook de la pasarela) puede cambiarlas.
create policy subscriptions_select_own on charcu.subscriptions
  for select to authenticated using ((select auth.uid()) = user_id);

-- recipe_sessions: suyas. El trigger de arriba decide si la puede crear.
create policy recipe_sessions_select_own on charcu.recipe_sessions
  for select to authenticated using ((select auth.uid()) = user_id);
create policy recipe_sessions_insert_own on charcu.recipe_sessions
  for insert to authenticated with check ((select auth.uid()) = user_id);
create policy recipe_sessions_update_own on charcu.recipe_sessions
  for update to authenticated using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

-- chat_messages: suyos, y solo dentro de una sesión suya
create policy chat_messages_select_own on charcu.chat_messages
  for select to authenticated using ((select auth.uid()) = user_id);
create policy chat_messages_insert_own on charcu.chat_messages
  for insert to authenticated with check (
    (select auth.uid()) = user_id
    and exists (
      select 1 from charcu.recipe_sessions s
      where s.id = session_id and s.user_id = (select auth.uid())
    )
  );

-- courses: los publicados los ve cualquiera que haya entrado
create policy courses_select_published on charcu.courses
  for select to authenticated using (is_published = true);

-- videos: los de entrada son libres; el resto pide suscripción activa.
-- Esta es la puerta de los cursos, y también vive en la base de datos.
create policy videos_select_free_or_subscribed on charcu.videos
  for select to authenticated using (
    exists (
      select 1 from charcu.courses c
      where c.id = course_id and c.is_published = true
    )
    and (
      is_free = true
      or charcu.has_active_subscription((select auth.uid()))
    )
  );

-- saved_recipes: suyas
create policy saved_recipes_all_own on charcu.saved_recipes
  for all to authenticated using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

-- El esquema es visible, pero sin política que aplique no se ve ninguna fila.
grant usage on schema charcu to authenticated, anon;
grant select, insert, update on all tables in schema charcu to authenticated;
