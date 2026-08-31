-- ============================================================================
-- Los totales de la lista de espera: función en vez de vista (2026-08-29)
--
-- La 0019 los resolvió con una vista y `security_invoker` apagado. Funcionaba y
-- era segura —solo salía el agregado, `user_id` ni figuraba entre sus columnas—
-- pero el linter de Supabase la marca como **ERROR** (`security_definer_view`),
-- y con razón desde su punto de vista: no puede distinguir una vista que
-- expone agregados de una que se salta RLS sobre datos.
--
-- Un ERROR que hay que ignorar para siempre es peor que el problema que
-- resuelve: enseña a saltarse los ERROR, y el día que aparezca uno de verdad
-- ya nadie lo mira.
--
-- Una función `security definer` que devuelve un conjunto da EXACTAMENTE lo
-- mismo —una sola ida y vuelta con los totales de todos los cursos— y el linter
-- la clasifica como WARN, que es como ya están `course_outline`,
-- `course_progress` y `course_waitlist_count`. Es además el patrón que este
-- esquema ya usa en todas partes, así que no introduce una forma nueva de hacer
-- lo mismo.
--
-- Y de paso mejora: recibe los ids que interesan y filtra en Postgres, en vez
-- de devolver la tabla entera de totales para que el cliente descarte.
--
-- ⚠️ Sigue sin salir de aquí QUIÉN se apuntó. Solo `course_id` y el conteo. Si
-- alguien añade `user_id` a este `returns table`, convierte un contador público
-- en una lista de nombres.
-- ============================================================================

drop view if exists charcu.course_waitlist_totals;

create or replace function charcu.course_waitlist_totals(p_course_ids uuid[])
returns table (course_id uuid, total integer)
language sql
stable
security definer
set search_path = ''
as $$
  select w.course_id, count(*)::integer
    from charcu.course_waitlist w
   where w.course_id = any(p_course_ids)
   group by w.course_id;
$$;

comment on function charcu.course_waitlist_totals(uuid[]) is
  'Cuánta gente espera cada curso, en una sola llamada. SOLO el agregado: '
  'nunca quién. Sustituye a la vista de la 0019, que el linter marcaba ERROR.';

revoke all on function charcu.course_waitlist_totals(uuid[]) from public;

-- Se puede llamar sin cuenta: la barra "18 de 30" es lo que empuja a apuntarse,
-- y también la ve quien todavía no ha entrado.
grant execute on function charcu.course_waitlist_totals(uuid[])
  to anon, authenticated, service_role;
