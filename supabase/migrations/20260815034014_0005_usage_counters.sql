-- ============================================================================
-- El cupo de PREGUNTAS e IMÁGENES (D15), contado en la base y no en el navegador
--
-- Hasta ahora el cupo vivía en `localStorage`: bastaba abrir una ventana de
-- incógnito para volver a cero. Aquí el contador pasa a Postgres y se consume
-- desde el servidor, ANTES de llamar a Gemini, que es lo que cuesta dinero.
--
-- Un visitante sin cuenta se identifica con `visitor_id`, un UUID que el
-- servidor guarda en una cookie httpOnly. No es infalible —borrar cookies da
-- un cupo nuevo— pero ya no basta con abrir las herramientas del navegador.
-- Cuando el visitante entra con su correo, sus contadores se atan a la cuenta
-- y a partir de ahí se suman por cuenta, no por navegador.
-- ============================================================================

-- ----------------------------------------------------------------------------
-- Se retira el candado de RECETAS: la unidad ya no es la receta (D15)
-- ----------------------------------------------------------------------------

drop trigger if exists recipe_sessions_gate on charcu.recipe_sessions;
drop function if exists charcu.enforce_recipe_gate();

-- `recipe_sessions` se queda como historial de lo que el usuario ha curado,
-- pero ya no decide quién pasa y quién no.

-- ----------------------------------------------------------------------------
-- plan_quotas — cuánto da cada plan. Fuente única de verdad.
-- ----------------------------------------------------------------------------

create table charcu.plan_quotas (
  plan_id              text primary key,
  questions_per_month  integer not null check (questions_per_month >= 0),
  images_per_month     integer not null check (images_per_month >= 0)
);

-- Estos números tienen que coincidir con `src/entities/plan/model/plans.ts`.
-- Si cambias uno, cambia el otro: la pantalla promete y la base cumple.
insert into charcu.plan_quotas (plan_id, questions_per_month, images_per_month) values
  ('aprendiz', 8, 2),
  ('mensual', 200, 30),
  ('anual', 300, 50);

alter table charcu.plan_quotas enable row level security;

create policy plan_quotas_select_all on charcu.plan_quotas
  for select to anon, authenticated using (true);

-- ----------------------------------------------------------------------------
-- usage_counters — un renglón por navegador y por mes
-- ----------------------------------------------------------------------------

create table charcu.usage_counters (
  id              uuid primary key default gen_random_uuid(),
  visitor_id      uuid not null,
  -- Se rellena cuando el visitante entra con su correo.
  user_id         uuid references auth.users (id) on delete cascade,
  -- Mes natural en hora de Colombia: `2026-08`.
  period_key      text not null,
  questions_used  integer not null default 0,
  images_used     integer not null default 0,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now(),
  unique (visitor_id, period_key)
);

create index usage_counters_user_idx on charcu.usage_counters (user_id, period_key);

alter table charcu.usage_counters enable row level security;
-- Sin políticas = nadie desde el navegador. El cupo solo lo toca el servidor.

-- ----------------------------------------------------------------------------
-- El mes de corte va en hora de Colombia, no en UTC
--
-- Con UTC, el cupo de un usuario en Manizales se renovaría a las 7 de la tarde
-- del último día del mes. Poco importante, pero es de esas cosas que después
-- nadie entiende.
-- ----------------------------------------------------------------------------

create or replace function charcu.current_period_key()
returns text
language sql
stable
set search_path = ''
as $$
  select to_char(now() at time zone 'America/Bogota', 'YYYY-MM');
$$;

-- ----------------------------------------------------------------------------
-- Qué plan le aplica a alguien ahora mismo
-- ----------------------------------------------------------------------------

create or replace function charcu.effective_plan(p_user_id uuid)
returns text
language plpgsql
stable
security definer
set search_path = ''
as $$
declare
  v_plan text;
begin
  if p_user_id is null then
    return 'aprendiz';
  end if;

  select s.plan_id into v_plan
  from charcu.subscriptions s
  where s.user_id = p_user_id
    and s.status = 'active'
    and (s.current_period_end is null or s.current_period_end > now());

  if v_plan is null then
    return 'aprendiz';
  end if;

  -- Suscripción activa con un plan que no reconocemos (por ejemplo, un
  -- `plan_id` nuevo que el webhook empezó a mandar). Se le da el cupo del
  -- mensual, no el del gratis: ya pagó, y dejarlo sin servicio es peor que
  -- regalarle cupo de más hasta que alguien lo note.
  if not exists (select 1 from charcu.plan_quotas q where q.plan_id = v_plan) then
    return 'mensual';
  end if;

  return v_plan;
end;
$$;

-- ----------------------------------------------------------------------------
-- Consultar el cupo sin gastarlo
-- ----------------------------------------------------------------------------

create or replace function charcu.quota_status(p_visitor_id uuid, p_user_id uuid)
returns table (
  plan            text,
  questions_used  integer,
  images_used     integer,
  questions_limit integer,
  images_limit    integer
)
language plpgsql
stable
security definer
set search_path = ''
as $$
declare
  v_plan   text := charcu.effective_plan(p_user_id);
  v_period text := charcu.current_period_key();
  v_q      integer;
  v_i      integer;
  v_used_q integer := 0;
  v_used_i integer := 0;
begin
  select q.questions_per_month, q.images_per_month into v_q, v_i
  from charcu.plan_quotas q where q.plan_id = v_plan;

  -- Con cuenta se suma TODO lo del mes, venga del navegador que venga: así
  -- borrar cookies deja de regalar cupo. Sin cuenta solo se ve este navegador.
  if p_user_id is not null then
    select coalesce(sum(c.questions_used), 0), coalesce(sum(c.images_used), 0)
      into v_used_q, v_used_i
    from charcu.usage_counters c
    where c.user_id = p_user_id and c.period_key = v_period;
  else
    select coalesce(c.questions_used, 0), coalesce(c.images_used, 0)
      into v_used_q, v_used_i
    from charcu.usage_counters c
    where c.visitor_id = p_visitor_id and c.period_key = v_period;
  end if;

  return query select v_plan, coalesce(v_used_q, 0), coalesce(v_used_i, 0), v_q, v_i;
end;
$$;

-- ----------------------------------------------------------------------------
-- Gastar cupo. Se llama ANTES de hablar con Gemini.
--
-- Devuelve `allowed = false` sin consumir nada si la pregunta no cabe. Es una
-- sola transacción para que dos pestañas a la vez no puedan colarse.
-- ----------------------------------------------------------------------------

create or replace function charcu.consume_quota(
  p_visitor_id uuid,
  p_user_id    uuid,
  p_images     integer default 0
)
returns table (
  allowed         boolean,
  plan            text,
  questions_used  integer,
  images_used     integer,
  questions_limit integer,
  images_limit    integer
)
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_plan   text := charcu.effective_plan(p_user_id);
  v_period text := charcu.current_period_key();
  v_images integer := greatest(coalesce(p_images, 0), 0);
  v_q      integer;
  v_i      integer;
  v_used_q integer := 0;
  v_used_i integer := 0;
  v_row_id uuid;
begin
  select q.questions_per_month, q.images_per_month into v_q, v_i
  from charcu.plan_quotas q where q.plan_id = v_plan;

  -- Se asegura el renglón de este navegador y este mes, y queda bloqueado
  -- dentro de la transacción hasta que terminemos de contar.
  insert into charcu.usage_counters as c (visitor_id, user_id, period_key)
  values (p_visitor_id, p_user_id, v_period)
  on conflict (visitor_id, period_key) do update
    set user_id    = coalesce(c.user_id, excluded.user_id),
        updated_at = now()
  returning c.id into v_row_id;

  if p_user_id is not null then
    select coalesce(sum(c.questions_used), 0), coalesce(sum(c.images_used), 0)
      into v_used_q, v_used_i
    from charcu.usage_counters c
    where c.user_id = p_user_id and c.period_key = v_period;
  else
    select c.questions_used, c.images_used into v_used_q, v_used_i
    from charcu.usage_counters c where c.id = v_row_id;
  end if;

  if v_used_q + 1 > v_q or v_used_i + v_images > v_i then
    return query select false, v_plan, v_used_q, v_used_i, v_q, v_i;
    return;
  end if;

  update charcu.usage_counters c
     set questions_used = c.questions_used + 1,
         images_used    = c.images_used + v_images,
         updated_at     = now()
   where c.id = v_row_id;

  return query select true, v_plan, v_used_q + 1, v_used_i + v_images, v_q, v_i;
end;
$$;

-- ----------------------------------------------------------------------------
-- Atar el navegador a la cuenta cuando el visitante entra por primera vez
-- ----------------------------------------------------------------------------

create or replace function charcu.link_visitor_to_user(p_visitor_id uuid, p_user_id uuid)
returns void
language sql
security definer
set search_path = ''
as $$
  update charcu.usage_counters
     set user_id = p_user_id, updated_at = now()
   where visitor_id = p_visitor_id and user_id is null;
$$;

-- ----------------------------------------------------------------------------
-- El cupo lo administra el servidor. Desde el navegador no se llama nada.
-- ----------------------------------------------------------------------------

revoke all on function charcu.consume_quota(uuid, uuid, integer) from public, anon, authenticated;
revoke all on function charcu.quota_status(uuid, uuid) from public, anon, authenticated;
revoke all on function charcu.link_visitor_to_user(uuid, uuid) from public, anon, authenticated;
revoke all on function charcu.effective_plan(uuid) from public, anon, authenticated;

grant execute on function charcu.consume_quota(uuid, uuid, integer) to service_role;
grant execute on function charcu.quota_status(uuid, uuid) to service_role;
grant execute on function charcu.link_visitor_to_user(uuid, uuid) to service_role;
grant execute on function charcu.effective_plan(uuid) to service_role;
grant execute on function charcu.current_period_key() to service_role, authenticated, anon;

-- ----------------------------------------------------------------------------
-- El lead también se ata al navegador, para saber quién dejó sus datos
-- ----------------------------------------------------------------------------

alter table charcu.leads add column visitor_id uuid;
create index idx_leads_visitor_id on charcu.leads (visitor_id);
