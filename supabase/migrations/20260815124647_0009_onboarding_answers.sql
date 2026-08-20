-- ============================================================================
-- Las respuestas del onboarding, guardadas antes de que exista la cuenta
--
-- El onboarding pregunta país, nivel y qué quiere curar ANTES de que el
-- visitante se registre. Hasta ahora eso vivía solo en `localStorage`: si
-- cambiaba de celular o borraba datos, se perdía — y cuando por fin creaba la
-- cuenta, no sabíamos nada de él.
--
-- Se guarda contra el mismo `visitor_id` (cookie httpOnly) que usa el cupo, y
-- se ata a la cuenta en cuanto entra con su correo. Así, el día que se
-- registra, ya sabemos de dónde es, qué nivel tiene y qué quería hacer.
--
-- ⚠️ Es dato personal en cuanto se ata a una cuenta: Ley 1581 de 2012.
-- ============================================================================

create table charcu.onboarding_answers (
  id           uuid primary key default gen_random_uuid(),
  visitor_id   uuid not null unique,
  user_id      uuid references auth.users (id) on delete cascade,
  country      text,
  level        text,
  /** Qué eligió curar: sirve para saber por dónde entra la gente. */
  product      text,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

create index onboarding_answers_user_idx on charcu.onboarding_answers (user_id);

create trigger onboarding_answers_touch_updated_at
  before update on charcu.onboarding_answers
  for each row execute function charcu.touch_updated_at();

alter table charcu.onboarding_answers enable row level security;

-- El visitante anónimo no tiene sesión, así que no puede haber política que le
-- sirva: escribe el servidor con la clave de servicio. El usuario registrado sí
-- puede leer lo suyo, para que la app le muestre su propio perfil.
create policy onboarding_answers_select_own on charcu.onboarding_answers
  for select to authenticated using ((select auth.uid()) = user_id);

-- Guarda o actualiza las respuestas de este navegador.
create or replace function charcu.save_onboarding(
  p_visitor_id uuid,
  p_user_id    uuid,
  p_country    text,
  p_level      text,
  p_product    text
)
returns void
language sql
security definer
set search_path = ''
as $$
  insert into charcu.onboarding_answers as o
    (visitor_id, user_id, country, level, product)
  values
    (p_visitor_id, p_user_id, p_country, p_level, p_product)
  on conflict (visitor_id) do update
    set user_id    = coalesce(excluded.user_id, o.user_id),
        country    = coalesce(excluded.country, o.country),
        level      = coalesce(excluded.level, o.level),
        product    = coalesce(excluded.product, o.product),
        updated_at = now();
$$;

-- Al entrar por primera vez, lo que contestó de anónimo pasa a ser suyo.
create or replace function charcu.link_onboarding_to_user(
  p_visitor_id uuid,
  p_user_id    uuid
)
returns void
language sql
security definer
set search_path = ''
as $$
  update charcu.onboarding_answers
     set user_id = p_user_id, updated_at = now()
   where visitor_id = p_visitor_id and user_id is null;
$$;

revoke all on function charcu.save_onboarding(uuid, uuid, text, text, text)
  from public, anon, authenticated;
revoke all on function charcu.link_onboarding_to_user(uuid, uuid)
  from public, anon, authenticated;

grant execute on function charcu.save_onboarding(uuid, uuid, text, text, text) to service_role;
grant execute on function charcu.link_onboarding_to_user(uuid, uuid) to service_role;
