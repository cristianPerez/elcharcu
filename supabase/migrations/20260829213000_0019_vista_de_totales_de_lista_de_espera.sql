-- ============================================================================
-- Los totales de la lista de espera, en UNA consulta (2026-08-29)
--
-- `listCourses` llamaba a `course_waitlist_count()` una vez POR CADA curso en
-- espera. Con cuatro no se nota; el problema es que crece con el catálogo, y
-- justo la pantalla que abre la app es la que lo paga.
--
-- ⚠️ POR QUÉ AQUÍ SÍ UNA VISTA, Y NO UN SELECT ANIDADO COMO EN `findCourse`.
--
-- Porque esto es una AGREGACIÓN, y PostgREST no sabe expresar un `count(*)`
-- agrupado desde el cliente. Un embed devolvería las filas de `course_waitlist`
-- para contarlas en TypeScript — o sea, mandar por la red la lista entera de
-- quién se apuntó para acabar sabiendo solo cuántos son. Es exactamente el dato
-- que no debe salir de la base.
--
-- ⚠️ Y POR QUÉ `security_invoker` SE QUEDA APAGADO, que es lo contrario de lo
--    que habría que hacer en una vista de contenido.
--
-- La vista corre con los permisos de su dueño, así que ve TODAS las filas de
-- `course_waitlist` y no solo las del que pregunta. Eso es justo lo que hace
-- falta: con `security_invoker = on`, RLS dejaría ver únicamente las filas
-- propias y la barra diría siempre 0 o 1 en vez de "18 de 30".
--
-- Es seguro porque lo único que sale de aquí es el AGREGADO. No hay `user_id`
-- en la lista de columnas, así que no se puede reconstruir quién se apuntó a
-- qué. Es la misma regla que ya cumplía `course_waitlist_count()`; lo que
-- cambia es que ahora se resuelve de una vez para todos los cursos.
--
-- ⚠️ Si algún día alguien añade `user_id` a este `select`, convierte un
-- contador público en una lista de nombres. No se añade.
-- ============================================================================

create view charcu.course_waitlist_totals as
select course_id,
       count(*)::integer as total
  from charcu.course_waitlist
 group by course_id;

comment on view charcu.course_waitlist_totals is
  'Cuánta gente espera cada curso. SOLO el agregado: nunca quién. '
  'security_invoker apagado a propósito, para poder contar a todos.';

-- Se puede leer sin cuenta: la barra "18 de 30" es lo que empuja a apuntarse,
-- y también la ve quien todavía no ha entrado.
grant select on charcu.course_waitlist_totals to anon, authenticated, service_role;

-- `course_waitlist_count(uuid)` se queda donde está. Lo usa `join_waitlist()`
-- para devolver el contador nuevo tras apuntarse, que es una sola fila y ahí no
-- hay nada que optimizar.
