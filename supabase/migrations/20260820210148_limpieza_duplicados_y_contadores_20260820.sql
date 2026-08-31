-- ============================================================================
-- Limpieza de los destrozos de los dos fallos de hoy (2026-08-20)
--
-- Los fallos ya están arreglados en las migraciones anteriores; esto solo
-- ordena lo que dejaron por el camino:
--
--   1. DOS recetas duplicadas: la pregunta de una lección se reenviaba cada
--      vez que se montaba la pantalla, así que quedaron tres "Especias para
--      bondiola" idénticas. Se conserva la primera (20:16:57) y se borran las
--      dos copias de las 20:27.
--
--   2. Los contadores no cuadraban con la base. Dos razones distintas:
--      · El cupo se cobra ANTES de crear la receta, y durante las horas en que
--        QA estaba sin credenciales la creación fallaba mientras el cobro
--        entraba. Quedaron preguntas cobradas sin receta detrás.
--      · El contador de un navegador se quedaba con la primera cuenta que lo
--        usó, así que las preguntas de hoy se le cargaron a la cuenta de
--        trabajo en vez de a la personal.
--
-- En vez de parchear fila por fila, los contadores se RECALCULAN desde lo que
-- de verdad hay en la base: preguntas = mensajes de usuario, recetas = recetas.
-- Así el número deja de ser una opinión y pasa a ser un hecho comprobable.
--
-- ⚠️ Esto NO es una migración del producto: es una limpieza puntual. No debe
-- reproducirse sobre una base nueva, y por eso todo va acotado al periodo
-- 2026-08 y a filas que ya existen.
--
-- ⚠️ `images_used` no se toca: las fotos no se guardan (decisión pendiente),
-- así que no hay nada contra lo que recalcularlas.
-- ============================================================================

-- 1. Fuera las dos copias. Se conserva d97f2f69, la original.
delete from charcu.recipes
 where id in (
   'e3086e72-4651-4eb3-a000-7b809e4e49db',
   '4b9cacc8-0459-431e-86a7-139d92c2d98b'
 );

-- 2. Cada contador pasa a decir lo que de verdad hay para ese navegador.
--    El dueño también se toma de las recetas: son ellas las que saben de quién
--    es cada conversación.
update charcu.usage_counters c
   set questions_used = coalesce(real.preguntas, 0),
       recipes_used   = coalesce(real.recetas, 0),
       user_id        = coalesce(real.user_id, c.user_id),
       updated_at     = now()
  from (
    select r.visitor_id,
           count(distinct r.id)                                as recetas,
           count(m.id) filter (where m.role = 'user')           as preguntas,
           -- Todas las recetas de un navegador tienen el mismo dueño, así que
           -- `min` solo sirve para sacar uno.
           min(r.user_id::text)::uuid                           as user_id
      from charcu.recipes r
      left join charcu.chat_messages m on m.recipe_id = r.id
     group by r.visitor_id
  ) real
 where c.visitor_id = real.visitor_id
   and c.period_key = '2026-08';

-- 3. Los navegadores que no tienen NINGUNA receta vuelven a cero. Son restos
--    de pruebas en los que se cobró algo que después no llegó a existir.
update charcu.usage_counters c
   set questions_used = 0,
       recipes_used   = 0,
       updated_at     = now()
 where c.period_key = '2026-08'
   and not exists (
     select 1 from charcu.recipes r where r.visitor_id = c.visitor_id
   );
