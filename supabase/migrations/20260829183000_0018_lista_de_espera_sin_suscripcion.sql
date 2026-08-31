-- ============================================================================
-- Apuntarse a la lista de espera ya no exige suscripción (2026-08-29)
--
-- La 0013 la escribió con `has_active_subscription()` por delante, y el
-- razonamiento era bueno: apuntarse siendo suscriptor hace visible la promesa
-- de la suscripción y filtra el ruido de quien nunca va a pagar.
--
-- Solo que ese razonamiento daba por hecho que habría cómo suscribirse. Los
-- pagos se hacen con OnePay y la integración quedó APLAZADA (D21), así que
-- `charcu.subscriptions` está vacía y `has_active_subscription()` devuelve
-- `false` para todo el mundo. Con la regla original, el botón de "apuntarme"
-- del lunes le contestaría `necesita-suscripcion` a cada persona que lo tocara:
-- un botón muerto en la única pantalla que tiene que demostrar que aquí pasan
-- cosas.
--
-- Y el dato que se pierde por relajarla es justo el que hace falta ahora. La
-- lista de espera existe para saber QUÉ GRABAR PRIMERO. Para esa pregunta,
-- treinta interesados dicen más que cero suscriptores.
--
-- ⚠️ Se revierte volviendo a poner las tres líneas del `if` de abajo. Cuando
-- OnePay esté conectado, hay que decidir a conciencia si se vuelve a cerrar.
-- ============================================================================

create or replace function charcu.join_waitlist(p_course_id uuid)
returns integer
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_user_id uuid := (select auth.uid());
  v_status  text;
begin
  -- Cuenta sí se exige, y esa no se toca: sin `user_id` no hay a quién avisar
  -- el día que el curso se abra, y una lista de espera anónima se puede inflar
  -- desde una pestaña de incógnito. El contador tiene que ser verdad.
  if v_user_id is null then
    raise exception 'sin-sesion';
  end if;

  select status into v_status
    from charcu.courses
   where id = p_course_id;

  if v_status is null then
    raise exception 'curso-no-existe';
  end if;

  -- Apuntarse a algo que ya está publicado no significa nada: ábrelo y ya.
  if v_status <> 'lista-de-espera' then
    raise exception 'curso-no-esta-en-lista-de-espera';
  end if;

  -- Tocar dos veces el botón no suma dos personas al contador.
  insert into charcu.course_waitlist (course_id, user_id)
  values (p_course_id, v_user_id)
  on conflict (course_id, user_id) do nothing;

  return (
    select count(*)::integer
      from charcu.course_waitlist
     where course_id = p_course_id
  );
end;
$$;
