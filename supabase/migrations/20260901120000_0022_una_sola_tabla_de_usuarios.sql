-- ============================================================================
-- Una sola tabla de usuarios: se van `leads` y `onboarding_answers`
-- (2026-09-01, decisión de Cristian)
--
-- Había CUATRO sitios con datos de la misma persona: `auth.users`,
-- `charcu.profiles`, `charcu.leads` y `charcu.onboarding_answers`. El nombre y
-- el WhatsApp aparecían en tres de ellos.
--
-- ⚠️ Y la causa era UNA sola. `leads` y `onboarding_answers` nacieron para el
-- mismo problema —"dónde guardo datos de alguien que todavía no tiene
-- cuenta"— y las dos se indexaban por `visitor_id`, la cookie, porque no había
-- `auth.users` de donde colgarlas. Dos tablas para un problema.
--
-- Las dos dejaron de tener sentido, cada una por su lado:
--
-- `onboarding_answers` — murió con la 0016, cuando el onboarding se mudó
--   DETRÁS del login. Desde entonces no la escribe nadie: `/api/onboarding`
--   existía pero ninguna pantalla lo llamaba. Esquema zombi.
--
-- `leads` — guardaba una copia de un correo que Supabase ya tenía.
--   `signInWithOtp` crea la fila en `auth.users` en cuanto se PIDE el enlace,
--   se confirme o no. Comprobado en producción antes de borrar: hay un correo
--   mal escrito ahí, sin confirmar, sin haber entrado nunca y sin perfil. Ese
--   es exactamente el dato que se suponía que `leads` aportaba —quién dejó el
--   correo y no volvió— y `auth.users` lo tiene solo.
--
--   Además estaba a medias: exigía `name` y `whatsapp` NOT NULL, pero el muro
--   hace tiempo que solo pide el correo, así que la ruta los rellenaba con ''.
--   Dos columnas obligatorias siempre vacías.
--
-- ⚠️ QUÉ SE PIERDE, dicho claro: `leads.questions_used` e `images_used`, que
-- eran cuánto cupo llevaba gastado en el momento de dejar el correo. Es el
-- único dato que no está en otro sitio. Se acepta a cambio de no tener el
-- contacto duplicado en dos tablas que pueden discrepar.
--
-- COMPROBADO ANTES DE BORRAR, en producción y en QA: los 2 leads reales de
-- producción están los dos en `auth.users`, confirmados y con perfil. No se va
-- ni un contacto.
--
-- Lo que había en `charcu.leads` de PRODUCCIÓN el día de borrarla, copiado aquí
-- para que el único dato que se pierde quede en alguna parte:
--
--   cperez354@gmail.com     1 pregunta, 0 fotos   2026-08-31 04:37 UTC
--   bryleon.diaz@gmail.com  1 pregunta, 0 fotos   2026-08-31 22:48 UTC
--
-- Los dos correos siguen en `auth.users`, confirmados y con perfil.
--
-- Queda así: `auth.users` es la cuenta, `charcu.profiles` es todo lo demás de
-- esa persona, y no hay tercera copia de nada.
-- ============================================================================

-- ----------------------------------------------------------------------------
-- Las funciones primero: dependen de las tablas
-- ----------------------------------------------------------------------------

drop function if exists charcu.save_onboarding(
  uuid, uuid, text, text, text, text, text, text[], timestamptz
);

drop function if exists charcu.link_onboarding_to_user(uuid, uuid);

-- ----------------------------------------------------------------------------
-- Y las tablas
-- ----------------------------------------------------------------------------

drop table if exists charcu.onboarding_answers;
drop table if exists charcu.leads;
