-- ============================================================================
-- Nombre, intereses y WhatsApp (2026-08-29)
--
-- El onboarding de hoy pregunta país, nivel y UN producto. Con eso no se puede
-- ni saludar a alguien por su nombre ni configurar el Charcu AI a su gusto.
--
-- Tres datos nuevos, y cada uno paga su sitio:
--
--   `full_name`  → la app deja de ser anónima. Es el más barato de todos.
--   `interests`  → configura el panel Y el asistente. Es varios, no uno: quien
--                  cura jamones casi siempre hace también chorizos, y obligarlo
--                  a elegir uno solo tira a la basura la mitad del dato.
--   `whatsapp`   → el canal real de venta de El Charcu (D16).
--
-- ⚠️ EL WHATSAPP SE PIDE, NO SE EXIGE. La pantalla lleva un "Ahora no" visible.
-- El momento de máximo interés para pedir el teléfono es DESPUÉS de la primera
-- respuesta buena del asistente (D14, D16), no antes de haber visto nada. Un
-- onboarding que bloquea en la pantalla del teléfono es el muro que D14 quitó.
--
-- ⚠️ ES DATO PERSONAL (Ley 1581 de 2012). Por eso hay `consent_at`: sin la
-- fecha en que lo autorizó, ese número NO se puede usar para vender. Guardar el
-- teléfono sin guardar el permiso es guardarse un problema.
-- ============================================================================

-- ----------------------------------------------------------------------------
-- 1. `profiles` — de aquí lee la app todos los días
-- ----------------------------------------------------------------------------

alter table charcu.profiles
  add column full_name text,
  -- `text[]` y no una tabla de unión: son 8 categorías fijas, siempre se leen
  -- todas juntas y nunca se consultan al revés ("quién eligió quesos" se
  -- responde con un `&&` y sobra). Una tabla aquí sería un `join` en cada
  -- pantalla para no ganar nada.
  add column interests text[] not null default '{}';

comment on column charcu.profiles.interests is
  'quesos | jamones-cocidos | jamones-curados | chacinados | chorizos | '
  'embutidos-frescos | ahumados | sal-de-cura. Configura el panel y el Charcu AI.';

-- ----------------------------------------------------------------------------
-- 2. `onboarding_answers` — lo que contestó ANTES de tener cuenta
--
-- El teléfono y el nombre viven aquí primero porque el onboarding ocurre sin
-- sesión. `link_onboarding_to_user` los pasa al perfil el día que se registra.
-- ----------------------------------------------------------------------------

alter table charcu.onboarding_answers
  add column full_name  text,
  add column whatsapp   text,
  add column interests  text[] not null default '{}',
  -- Cuándo autorizó el tratamiento de sus datos. Null = no autorizó.
  add column consent_at timestamptz;

-- `product` (uno solo) se queda donde está y no se borra: hay filas reales con
-- ese dato y sigue diciendo por dónde entró la gente. `interests` lo sustituye
-- de aquí en adelante; el día que `product` no lo lea nadie, se cae solo.

-- ----------------------------------------------------------------------------
-- 3. `save_onboarding` — la versión de 8 parámetros
--
-- La firma vieja era de 5. En Postgres eso son DOS funciones distintas
-- conviviendo, no un reemplazo: `create or replace` no sirve cuando cambia la
-- lista de argumentos. Hay que crear la nueva y tirar la vieja a mano, o el
-- servidor puede seguir llamando a la de 5 sin que nadie lo note.
-- ----------------------------------------------------------------------------

create or replace function charcu.save_onboarding(
  p_visitor_id uuid,
  p_user_id    uuid,
  p_country    text,
  p_level      text,
  p_product    text,
  p_full_name  text,
  p_whatsapp   text,
  p_interests  text[],
  p_consent_at timestamptz
)
returns void
language sql
security definer
set search_path = ''
as $$
  insert into charcu.onboarding_answers as o
    (visitor_id, user_id, country, level, product,
     full_name, whatsapp, interests, consent_at)
  values
    (p_visitor_id, p_user_id, p_country, p_level, p_product,
     p_full_name, p_whatsapp, coalesce(p_interests, '{}'), p_consent_at)
  on conflict (visitor_id) do update
    -- `coalesce` en todo: se guarda en CADA paso, y cada llamada trae solo lo
    -- que se acaba de contestar. Sin esto, la pantalla 2 borraría la 1.
    set user_id    = coalesce(excluded.user_id, o.user_id),
        country    = coalesce(excluded.country, o.country),
        level      = coalesce(excluded.level, o.level),
        product    = coalesce(excluded.product, o.product),
        full_name  = coalesce(excluded.full_name, o.full_name),
        whatsapp   = coalesce(excluded.whatsapp, o.whatsapp),
        -- El array vacío NO es "no contestó": es la llamada de otro paso, que
        -- manda '{}' porque no sabe nada de intereses. `nullif` lo distingue.
        interests  = coalesce(nullif(excluded.interests, '{}'), o.interests),
        consent_at = coalesce(excluded.consent_at, o.consent_at),
        updated_at = now();
$$;

-- La de 5 parámetros se va. Si se quedara, seguiría siendo una función válida y
-- perfectamente llamable — y el día que alguien la invoque, el nombre y el
-- teléfono se pierden en silencio.
drop function if exists charcu.save_onboarding(uuid, uuid, text, text, text);

revoke all on function
  charcu.save_onboarding(uuid, uuid, text, text, text, text, text, text[], timestamptz)
  from public, anon, authenticated;

grant execute on function
  charcu.save_onboarding(uuid, uuid, text, text, text, text, text, text[], timestamptz)
  to service_role;

-- ----------------------------------------------------------------------------
-- 4. Al registrarse, lo del anónimo pasa a ser suyo — y llega al perfil
--
-- Antes solo ataba el `user_id`. Ahora además COPIA nombre e intereses a
-- `profiles`, que es de donde lee la app. Sin este segundo paso, el dato se
-- quedaría en `onboarding_answers` —una tabla que nadie consulta en caliente— y
-- el usuario haría el onboarding para nada.
-- ----------------------------------------------------------------------------

create or replace function charcu.link_onboarding_to_user(
  p_visitor_id uuid,
  p_user_id    uuid
)
returns void
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_answers charcu.onboarding_answers;
begin
  update charcu.onboarding_answers
     set user_id = p_user_id, updated_at = now()
   where visitor_id = p_visitor_id and user_id is null;

  select * into v_answers
    from charcu.onboarding_answers
   where visitor_id = p_visitor_id;

  if not found then
    return;
  end if;

  update charcu.profiles p
     -- `coalesce` y no asignación directa: si esta persona ya llenó su perfil
     -- desde otro dispositivo, un onboarding viejo a medias no debería
     -- pisárselo con nulos.
     set full_name = coalesce(p.full_name, v_answers.full_name),
         interests = coalesce(nullif(p.interests, '{}'), v_answers.interests),
         country   = coalesce(v_answers.country, p.country),
         updated_at = now()
   where p.id = p_user_id;
end;
$$;

revoke all on function charcu.link_onboarding_to_user(uuid, uuid)
  from public, anon, authenticated;
grant execute on function charcu.link_onboarding_to_user(uuid, uuid) to service_role;

-- ----------------------------------------------------------------------------
-- 5. El usuario edita su propio perfil: NO HACE FALTA NADA
--
-- Aquí iba una política `profiles_update_own` y un `grant update` por columnas.
-- Las dos sobraban, y el `db push` lo cantó: la política **ya existe desde la
-- 0001** (línea 236) y es letra por letra la misma. El permiso también está,
-- por el `grant select, insert, update on all tables in schema charcu to
-- authenticated` de la 0001.
--
-- Se deja escrito en vez de borrarlo porque la pregunta "¿puede el usuario
-- cambiar sus intereses?" se va a volver a hacer. La respuesta es sí, desde el
-- primer día, y no hay que tocar nada.
--
-- ⚠️ Ojo con ese `grant ... on all tables`: solo alcanzó a las tablas que
-- existían ese día. Las nuevas (`course_waitlist`, `knowledge`) nacen SIN
-- permiso para `authenticated`, que es justo lo que se quiere en `knowledge` —
-- ahí el silencio es la política.
-- ----------------------------------------------------------------------------
