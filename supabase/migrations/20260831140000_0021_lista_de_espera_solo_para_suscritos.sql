-- ============================================================================
-- La lista de espera vuelve a ser solo para suscritos (2026-08-31)
--
-- Deshace la 0018, que quitó esta misma comprobación. Y no es un vaivén: la
-- 0018 la quitó por una razón concreta y temporal que ya no aplica.
--
-- Aquel día no había forma de suscribirse —OnePay aplazado, `subscriptions`
-- vacía— así que exigir suscripción habría hecho que el botón le contestara
-- `necesita-suscripcion` a TODO el mundo: un botón muerto en la única pantalla
-- que tenía que demostrar que aquí pasan cosas. La propia 0018 lo dejó escrito:
-- "cuando OnePay esté conectado, hay que decidir a conciencia si se vuelve a
-- cerrar".
--
-- Hoy sí hay carril de cobro (WhatsApp + activación manual), y Cristian decide
-- cerrarla. Dos motivos:
--
--   · Le compra tiempo para grabar. Un usuario gratis que se apunta crea una
--     expectativa que hoy no se puede cumplir.
--   · Y limpia el dato. La lista existe para saber QUÉ GRABAR PRIMERO, y para
--     esa pregunta la señal de quien ya paga vale más que la de quien pasaba
--     por ahí.
--
-- ⚠️ La pantalla también esconde la barra al usuario gratis, pero eso NO es lo
-- que la cierra. Esconder un botón no es cerrarlo: sin esta comprobación,
-- cualquiera con cuenta se apunta llamando a `/api/lista-de-espera` a mano. La
-- puerta vive en la base (D12); la pantalla solo cuenta lo que aquí se decidió.
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

  if not charcu.has_active_subscription(v_user_id) then
    raise exception 'necesita-suscripcion';
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

-- ----------------------------------------------------------------------------
-- Las filas que ya existen se quedan
--
-- Si alguien se apuntó mientras la regla estuvo abierta, su fila sigue ahí y
-- sigue contando. Borrarlas sería castigar a quien usó la app tal como estaba,
-- y además haría bajar un contador que la gente ya vio — que es justo lo que
-- este mecanismo no puede permitirse hacer nunca.
-- ----------------------------------------------------------------------------
