-- ============================================================================
-- Las recetas: cada conversación gira en torno a UNA pieza
--
-- Un chat = una receta. Eso es lo que convierte el historial en algo con
-- valor (comparar la foto del día 5 con la del día 20) y lo que después
-- permite sacar insights: si un chat mezcla un chorizo y un salame, el dato
-- no sirve para nada.
--
-- Se crea tabla NUEVA en vez de reusar `recipe_sessions`, que no servía:
--   · `user_id` era obligatorio → un visitante anónimo no podía tener receta,
--     y el asistente es anónimo por diseño (D14).
--   · `unique (user_id, product)` → una sola "chorizo" por persona, para
--     siempre. Si receta = chat, el segundo chorizo chocaba contra la base.
--   · `product` era una lista cerrada de 8 opciones; una receta necesita
--     título libre.
--   · arrastraba `is_free`, del candado que D15 jubiló.
-- `recipe_sessions` se retira aquí mismo.
--
-- COBRO (2026-08-15): las recetas son ILIMITADAS en los planes de pago. Una
-- receta cuesta 0 —es una fila de 300 bytes— y el gasto real ya lo frenan las
-- preguntas y las fotos. Cobrarlas además empujaría al usuario a meter dos
-- curados en un mismo chat para ahorrarse una, que es exactamente el dato que
-- no queremos. El plan gratis sí lleva 1, porque ahí la receta ES el producto.
-- ============================================================================

create table charcu.recipes (
  id              uuid primary key default gen_random_uuid(),
  visitor_id      uuid not null,
  user_id         uuid references auth.users (id) on delete cascade,
  -- Lo titula el asistente con lo que entendió, y el usuario puede cambiarlo.
  title           text not null default 'Receta sin nombre',
  -- Qué se está curando, si se pudo deducir. Es para los insights, no manda.
  product         text,
  status          text not null default 'activa'
                    check (status in ('activa', 'terminada', 'descartada')),
  -- El resumen estructurado que alimentará recetas nuevas y contenido.
  -- ⚠️ Usarlo para contenido PÚBLICO exige consentimiento aparte (Ley 1581).
  summary         text,
  started_at      timestamptz not null default now(),
  last_message_at timestamptz not null default now(),
  closed_at       timestamptz
);

create index recipes_visitor_idx on charcu.recipes (visitor_id, last_message_at desc);
create index recipes_user_idx    on charcu.recipes (user_id, last_message_at desc);

alter table charcu.recipes enable row level security;

create policy recipes_select_own on charcu.recipes
  for select to authenticated using ((select auth.uid()) = user_id);
create policy recipes_update_own on charcu.recipes
  for update to authenticated using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

-- ----------------------------------------------------------------------------
-- Los mensajes cuelgan de la receta, no de la vieja sesión
-- ----------------------------------------------------------------------------

-- La política vieja menciona `session_id`, así que hay que retirarla ANTES de
-- borrar la columna: si no, Postgres se niega.
drop policy if exists chat_messages_insert_own on charcu.chat_messages;

alter table charcu.chat_messages drop column session_id;
alter table charcu.chat_messages add column recipe_id uuid not null
  references charcu.recipes (id) on delete cascade;
alter table charcu.chat_messages alter column user_id drop not null;
alter table charcu.chat_messages add column visitor_id uuid;

create index chat_messages_recipe_idx on charcu.chat_messages (recipe_id, created_at);

create policy chat_messages_insert_own on charcu.chat_messages
  for insert to authenticated with check (
    (select auth.uid()) = user_id
    and exists (
      select 1 from charcu.recipes r
      where r.id = recipe_id and r.user_id = (select auth.uid())
    )
  );

drop table charcu.recipe_sessions;

-- ----------------------------------------------------------------------------
-- Cupo de recetas: NULL = ilimitadas
-- ----------------------------------------------------------------------------

alter table charcu.plan_quotas add column recipes_per_month integer;
alter table charcu.usage_counters add column recipes_used integer not null default 0;

update charcu.plan_quotas set recipes_per_month = 1    where plan_id = 'aprendiz';
update charcu.plan_quotas set recipes_per_month = null where plan_id <> 'aprendiz';

-- ----------------------------------------------------------------------------
-- Consultar el cupo, ahora con recetas
-- ----------------------------------------------------------------------------

-- Cambia lo que DEVUELVE (ahora también recetas), y Postgres no deja alterar
-- el tipo de retorno sobre la marcha: hay que tirarla y volver a crearla.
drop function if exists charcu.quota_status(uuid, uuid);

create function charcu.quota_status(p_visitor_id uuid, p_user_id uuid)
returns table (
  plan            text,
  questions_used  integer,
  images_used     integer,
  recipes_used    integer,
  questions_limit integer,
  images_limit    integer,
  recipes_limit   integer
)
language plpgsql
stable
security definer
set search_path = ''
as $$
declare
  v_plan   text := charcu.effective_plan(p_user_id);
  v_period text := charcu.current_period_key();
  v_q integer; v_i integer; v_r integer;
  v_used_q integer := 0; v_used_i integer := 0; v_used_r integer := 0;
begin
  select q.questions_per_month, q.images_per_month, q.recipes_per_month
    into v_q, v_i, v_r
  from charcu.plan_quotas q where q.plan_id = v_plan;

  if p_user_id is not null then
    select coalesce(sum(c.questions_used), 0), coalesce(sum(c.images_used), 0),
           coalesce(sum(c.recipes_used), 0)
      into v_used_q, v_used_i, v_used_r
    from charcu.usage_counters c
    where c.user_id = p_user_id and c.period_key = v_period;
  else
    select coalesce(c.questions_used, 0), coalesce(c.images_used, 0),
           coalesce(c.recipes_used, 0)
      into v_used_q, v_used_i, v_used_r
    from charcu.usage_counters c
    where c.visitor_id = p_visitor_id and c.period_key = v_period;
  end if;

  return query select v_plan, coalesce(v_used_q, 0), coalesce(v_used_i, 0),
                      coalesce(v_used_r, 0), v_q, v_i, v_r;
end;
$$;

-- ----------------------------------------------------------------------------
-- Gastar cupo. `p_new_recipe` dice si esta pregunta ABRE una receta.
--
-- Reabrir una receta vieja y seguir preguntando gasta pregunta pero NO receta:
-- es la regla que pidió Cristian y la que hace que el historial se use.
-- ----------------------------------------------------------------------------

drop function if exists charcu.consume_quota(uuid, uuid, integer);

create function charcu.consume_quota(
  p_visitor_id uuid,
  p_user_id    uuid,
  p_images     integer default 0,
  p_new_recipe boolean default false
)
returns table (
  allowed         boolean,
  denied_by       text,
  plan            text,
  questions_used  integer,
  images_used     integer,
  recipes_used    integer,
  questions_limit integer,
  images_limit    integer,
  recipes_limit   integer
)
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_plan    text := charcu.effective_plan(p_user_id);
  v_period  text := charcu.current_period_key();
  v_images  integer := greatest(coalesce(p_images, 0), 0);
  v_recipes integer := case when coalesce(p_new_recipe, false) then 1 else 0 end;
  v_q integer; v_i integer; v_r integer;
  v_used_q integer := 0; v_used_i integer := 0; v_used_r integer := 0;
  v_row_id uuid;
  v_denied text := null;
begin
  select q.questions_per_month, q.images_per_month, q.recipes_per_month
    into v_q, v_i, v_r
  from charcu.plan_quotas q where q.plan_id = v_plan;

  insert into charcu.usage_counters as c (visitor_id, user_id, period_key)
  values (p_visitor_id, p_user_id, v_period)
  on conflict (visitor_id, period_key) do update
    set user_id    = coalesce(c.user_id, excluded.user_id),
        updated_at = now()
  returning c.id into v_row_id;

  if p_user_id is not null then
    select coalesce(sum(c.questions_used), 0), coalesce(sum(c.images_used), 0),
           coalesce(sum(c.recipes_used), 0)
      into v_used_q, v_used_i, v_used_r
    from charcu.usage_counters c
    where c.user_id = p_user_id and c.period_key = v_period;
  else
    select c.questions_used, c.images_used, c.recipes_used
      into v_used_q, v_used_i, v_used_r
    from charcu.usage_counters c where c.id = v_row_id;
  end if;

  -- Se dice CUÁL de los tres topes cerró la puerta: la pantalla necesita
  -- saberlo para no enseñar el muro equivocado.
  if v_used_q + 1 > v_q then
    v_denied := 'preguntas';
  elsif v_used_i + v_images > v_i then
    v_denied := 'fotos';
  elsif v_r is not null and v_used_r + v_recipes > v_r then
    v_denied := 'recetas';
  end if;

  if v_denied is not null then
    return query select false, v_denied, v_plan, v_used_q, v_used_i, v_used_r, v_q, v_i, v_r;
    return;
  end if;

  update charcu.usage_counters c
     set questions_used = c.questions_used + 1,
         images_used    = c.images_used + v_images,
         recipes_used   = c.recipes_used + v_recipes,
         updated_at     = now()
   where c.id = v_row_id;

  return query select true, null::text, v_plan,
                      v_used_q + 1, v_used_i + v_images, v_used_r + v_recipes,
                      v_q, v_i, v_r;
end;
$$;

-- Devolver lo cobrado si la respuesta nunca llegó, recetas incluidas.
drop function if exists charcu.refund_quota(uuid, uuid, integer);

create function charcu.refund_quota(
  p_visitor_id uuid,
  p_user_id    uuid,
  p_images     integer default 0,
  p_new_recipe boolean default false
)
returns void
language sql
security definer
set search_path = ''
as $$
  update charcu.usage_counters
     set questions_used = greatest(questions_used - 1, 0),
         images_used    = greatest(images_used - greatest(coalesce(p_images, 0), 0), 0),
         recipes_used   = greatest(
           recipes_used - case when coalesce(p_new_recipe, false) then 1 else 0 end, 0),
         updated_at     = now()
   where visitor_id = p_visitor_id
     and period_key = charcu.current_period_key();
$$;

-- Al entrar, las recetas del anónimo pasan a ser suyas.
create or replace function charcu.link_visitor_to_user(p_visitor_id uuid, p_user_id uuid)
returns void
language sql
security definer
set search_path = ''
as $$
  update charcu.usage_counters
     set user_id = p_user_id, updated_at = now()
   where visitor_id = p_visitor_id and user_id is null;

  update charcu.recipes
     set user_id = p_user_id
   where visitor_id = p_visitor_id and user_id is null;
$$;

revoke all on function charcu.consume_quota(uuid, uuid, integer, boolean) from public, anon, authenticated;
revoke all on function charcu.refund_quota(uuid, uuid, integer, boolean) from public, anon, authenticated;
grant execute on function charcu.consume_quota(uuid, uuid, integer, boolean) to service_role;
grant execute on function charcu.refund_quota(uuid, uuid, integer, boolean) to service_role;
grant execute on function charcu.quota_status(uuid, uuid) to service_role;
grant execute on function charcu.link_visitor_to_user(uuid, uuid) to service_role;

-- Las firmas viejas de 3 argumentos ya no valen: fuera, para que nadie las llame.