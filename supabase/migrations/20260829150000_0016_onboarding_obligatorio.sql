-- ============================================================================
-- El onboarding se muda DETRÁS del login, y se vuelve obligatorio (2026-08-29)
--
-- Hasta hoy el onboarding era anónimo: se preguntaba en `/bienvenido`, se
-- guardaba contra la cookie del visitante en `onboarding_answers` y se ataba a
-- la cuenta el día que se registrara. Tenía sentido cuando la primera pantalla
-- era el asistente suelto.
--
-- Cristian lo cambia (2026-08-29): el onboarding se lanza **cuando vuelve del
-- enlace del correo y entra por primera vez a la app**. Dos razones que se
-- sostienen solas:
--
--   - Ahí ya hay CUENTA, así que las respuestas tienen dónde vivir de verdad
--     (`profiles`) en vez de colgar de una cookie que se borra sola.
--   - Y ahí se puede EXIGIR. Antes de tener cuenta, un formulario obligatorio
--     es un muro (lo que quitó D14). Después de que alguien puso su correo y
--     abrió un enlace, dos pantallas no espantan a nadie.
--
-- Por eso hace falta un flag: sin él no hay forma de saber si a esta persona ya
-- se le preguntó. La alternativa —mirar si `interests` está vacío— confunde
-- "no ha contestado" con "contestó y luego se los quitó todos".
-- ============================================================================

alter table charcu.profiles
  add column onboarding_status text not null default 'pendiente'
    check (onboarding_status in ('pendiente', 'listo')),
  -- El WhatsApp vivía solo en `onboarding_answers`, que es la tabla del
  -- anónimo. Ahora se pregunta con sesión abierta, así que su sitio es el
  -- perfil.
  add column whatsapp text,
  -- ⚠️ Sin esta fecha el número NO se puede usar (Ley 1581 de 2012). Guardar
  -- el teléfono sin guardar el permiso es quedarse el riesgo sin el beneficio.
  add column whatsapp_consent_at timestamptz;

comment on column charcu.profiles.onboarding_status is
  'pendiente = todavía no contestó, la app le tapa todo con el formulario. '
  'listo = ya pasó, no se le vuelve a preguntar.';

-- ----------------------------------------------------------------------------
-- Cerrar el onboarding
--
-- Una sola función y no cuatro `update` desde el navegador, porque las cinco
-- escrituras tienen que pasar JUNTAS. Si el flag se pusiera en 'listo' por su
-- cuenta y el resto fallara, esa persona entraría a una app configurada con
-- nada y sin forma de que se le vuelva a preguntar.
--
-- `security definer` con `auth.uid()` dentro: el usuario no elige a qué fila
-- escribe, así que no hay manera de completarle el onboarding a otro.
-- ----------------------------------------------------------------------------

create or replace function charcu.complete_onboarding(
  p_full_name  text,
  p_interests  text[],
  p_whatsapp   text,
  p_consent    boolean
)
returns void
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_user_id uuid := (select auth.uid());
begin
  if v_user_id is null then
    raise exception 'sin-sesion';
  end if;

  -- Sin intereses el onboarding no sirve para nada: son lo que configura el
  -- panel y el Charcu AI. Es la única respuesta que de verdad se exige.
  if p_interests is null or cardinality(p_interests) = 0 then
    raise exception 'faltan-intereses';
  end if;

  update charcu.profiles
     set full_name  = coalesce(nullif(trim(p_full_name), ''), full_name),
         interests  = p_interests,
         -- El número solo entra con la casilla marcada. Si no la marcó, se
         -- queda lo que hubiera (que normalmente es nada).
         whatsapp   = case
                        when p_consent and nullif(trim(p_whatsapp), '') is not null
                          then trim(p_whatsapp)
                        else whatsapp
                      end,
         whatsapp_consent_at = case
                        when p_consent and nullif(trim(p_whatsapp), '') is not null
                          then now()
                        else whatsapp_consent_at
                      end,
         onboarding_status = 'listo',
         updated_at = now()
   where id = v_user_id;
end;
$$;

revoke all on function charcu.complete_onboarding(text, text[], text, boolean)
  from public, anon;
grant execute on function charcu.complete_onboarding(text, text[], text, boolean)
  to authenticated, service_role;

-- ----------------------------------------------------------------------------
-- Quién ya está dentro
--
-- Las cuentas que existían antes de esta migración nunca vieron el formulario,
-- así que técnicamente están 'pendiente' y es correcto: la próxima vez que
-- entren se les pregunta. Es una vez, y a cambio dejan de ser cuentas de las
-- que no sabemos nada.
--
-- Si alguna ya tenía intereses (llegaron por `link_onboarding_to_user` desde el
-- onboarding anónimo viejo), esa sí se da por hecha: volver a preguntarle lo
-- que ya contestó es la forma más rápida de parecer una app rota.
-- ----------------------------------------------------------------------------

update charcu.profiles
   set onboarding_status = 'listo'
 where cardinality(interests) > 0;
