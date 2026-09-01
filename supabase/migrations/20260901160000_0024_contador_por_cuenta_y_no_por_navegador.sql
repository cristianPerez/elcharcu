-- ============================================================================
-- Un navegador compartido dejaba de robarle el contador a la otra cuenta
-- (2026-09-01)
--
-- ⚠️ PRIMERO, UNA CORRECCIÓN. En el PR #7 quedó anotado que "el contador va por
-- navegador, no por cuenta" y que "un Pro tiene 200 preguntas POR DISPOSITIVO".
-- Eso era FALSO, y conviene que quede escrito aquí para que nadie vuelva a
-- creerlo: `quota_status` y `consume_quota` ya SUMAN todas las filas de la
-- cuenta en el mes antes de mirar el tope (desde la 0010). El cobro y el número
-- en pantalla llevan tiempo siendo por cuenta. Lo que vi —varias filas para una
-- misma cuenta— no es el fallo: es cómo está guardado, una fila por navegador,
-- y la suma lo resuelve.
--
-- EL FALLO DE VERDAD es otro, y es peor de lo que parecía: cuando dos cuentas
-- comparten un navegador, la segunda le ROBA el contador a la primera.
--
-- Dos sitios lo hacen, y hacen falta los dos para cerrarlo:
--
--   1. `link_visitor_to_user`, al entrar:
--        where visitor_id = … and (user_id is null or user_id <> p_user_id)
--      Sin filtro de mes. Así que entrar con otra cuenta en el mismo navegador
--      se llevaba las filas de la cuenta anterior de TODOS los meses. La 0820
--      lo dio por aceptable diciendo "el consumo DEL MES pasa a la última que
--      entre" — pero no era del mes, era de toda la historia.
--
--   2. `consume_quota`, en la primera pregunta:
--        on conflict (visitor_id, period_key) do update set user_id = excluded…
--      Aunque el enlace no robara, el primer `insert` sí: la fila era única por
--      (navegador, mes), así que la segunda cuenta no tenía dónde ponerse y se
--      quedaba con la de la primera.
--
-- El daño es doble y en direcciones opuestas: a quien pierde la fila le
-- REGRESAN preguntas que ya gastó, y a quien la recibe le DESAPARECEN preguntas
-- que nunca hizo. Los dos números quedan mal.
--
-- LA CAUSA es la clave de la tabla. `unique (visitor_id, period_key)` dice "un
-- navegador, un mes, un solo contador", y eso obliga a que dos cuentas en el
-- mismo teléfono se peleen por la misma fila. La verdad es que son dos
-- consumos distintos y necesitan dos filas.
--
-- La clave pasa a incluir al dueño. `nulls not distinct` es lo que mantiene el
-- caso anónimo como estaba: sin cuenta, `user_id` es null, y sin esa cláusula
-- Postgres trataría cada null como distinto y un mismo navegador anónimo
-- abriría una fila nueva —y una pregunta gratis nueva— en cada petición.
--
-- ⚠️ LO QUE ESTO NO ARREGLA, dicho claro: el visitante anónimo sigue teniendo
-- su pregunta gratis por navegador, y borrar las cookies sigue dando otra. Eso
-- no es este fallo, es el precio de que la demostración no pida cuenta (D14).
-- Si algún día molesta, se arregla en otro sitio, no aquí.
-- ============================================================================

-- ----------------------------------------------------------------------------
-- 1. La clave incluye al dueño
--
-- No hace falta consolidar nada antes: la clave vieja (navegador, mes) es MÁS
-- estricta que la nueva (navegador, mes, dueño), así que aflojarla no puede
-- chocar con ninguna fila que ya exista.
-- ----------------------------------------------------------------------------

alter table charcu.usage_counters
  drop constraint usage_counters_visitor_id_period_key_key;

alter table charcu.usage_counters
  add constraint usage_counters_owner_period_key
  unique nulls not distinct (visitor_id, period_key, user_id);

-- ----------------------------------------------------------------------------
-- 2. Gastar cupo ya no cambia de dueño a nadie
--
-- Es la misma función de la 20260820205053 con UN cambio: el `on conflict` va
-- por la clave nueva y desaparece el `set user_id = …`. Reasignar al dueño era
-- necesario cuando dos cuentas compartían fila; ahora cada una tiene la suya y
-- tocar el dueño solo podría hacer daño.
--
-- La suma por cuenta se queda tal cual: ya era correcta.
-- ----------------------------------------------------------------------------

create or replace function charcu.consume_quota(
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
  on conflict (visitor_id, period_key, user_id) do update
    set updated_at = now()
  returning c.id into v_row_id;

  -- Con cuenta, el cupo es de la CUENTA: se suman sus filas de todos los
  -- navegadores. Sin cuenta, la identidad es el navegador y basta su fila.
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

  if v_used_q + 1 > v_q then
    v_denied := 'preguntas';
  elsif v_images > 0 and v_used_i + v_images > v_i then
    v_denied := 'fotos';
  elsif v_recipes > 0 and v_r is not null and v_used_r + v_recipes > v_r then
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

-- ----------------------------------------------------------------------------
-- 3. Al entrar: lo anónimo de ESTE mes se SUMA a la cuenta. Nada más se toca.
--
-- Tres reglas, y cada una cierra una puerta:
--
--   · Solo filas SIN dueño. Una fila de otra cuenta no se toca jamás: es
--     consumo de otra persona, y llevárselo estropea los dos números.
--   · Solo el mes en curso. Los meses cerrados son historia; reescribirlos
--     cambia un número que esa persona ya vio.
--   · Se SUMA, no se pisa. Si la cuenta ya tenía fila en este navegador, las
--     preguntas que hizo antes de entrar cuentan igual — que es justo lo que
--     hace que borrar las cookies no regale preguntas.
--
-- ⚠️ Las RECETAS siguen adoptándose solo si no tienen dueño, y eso no cambia:
-- reasignarlas le entregaría las conversaciones de una persona a otra por
-- compartir un teléfono.
-- ----------------------------------------------------------------------------

create or replace function charcu.link_visitor_to_user(p_visitor_id uuid, p_user_id uuid)
returns void
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_period text := charcu.current_period_key();
begin
  -- Si la cuenta YA tenía fila en este navegador, lo anónimo se le suma…
  update charcu.usage_counters c
     set questions_used = c.questions_used + a.questions_used,
         images_used    = c.images_used + a.images_used,
         recipes_used   = c.recipes_used + a.recipes_used,
         updated_at     = now()
    from charcu.usage_counters a
   where c.visitor_id = p_visitor_id
     and c.period_key = v_period
     and c.user_id    = p_user_id
     and a.visitor_id = p_visitor_id
     and a.period_key = v_period
     and a.user_id is null;

  -- …y la anónima se va, para no contarla dos veces.
  delete from charcu.usage_counters a
   where a.visitor_id = p_visitor_id
     and a.period_key = v_period
     and a.user_id is null
     and exists (
       select 1 from charcu.usage_counters c
        where c.visitor_id = p_visitor_id
          and c.period_key = v_period
          and c.user_id    = p_user_id
     );

  -- Si no tenía fila, la anónima pasa a ser suya tal cual.
  update charcu.usage_counters
     set user_id = p_user_id, updated_at = now()
   where visitor_id = p_visitor_id
     and period_key = v_period
     and user_id is null;

  update charcu.recipes
     set user_id = p_user_id
   where visitor_id = p_visitor_id and user_id is null;
end;
$$;

revoke all on function charcu.consume_quota(uuid, uuid, integer, boolean)
  from public, anon, authenticated;
grant execute on function charcu.consume_quota(uuid, uuid, integer, boolean)
  to service_role;

revoke all on function charcu.link_visitor_to_user(uuid, uuid)
  from public, anon, authenticated;
grant execute on function charcu.link_visitor_to_user(uuid, uuid) to service_role;
