-- ============================================================================
-- 0061 · LOS CURSOS QUE SE ESTRENAN PRONTO YA SE PUEDEN LEER (2026-11-10)
--
-- Decisión de Cristian: los cursos del calendario (0059, 0060) salen en la
-- misma lista que los publicados, con la misma tarjeta, y se puede entrar a
-- ver su contenido. Dentro, la fecha de estreno y el botón "Avísame cuando
-- salga".
--
--   · `can_read_course` abre también `lista-de-espera`, con la MISMA regla de
--     acceso que un curso publicado: lo de pago, solo con suscripción activa.
--     Así un suscriptor lee ya los ingredientes y los pasos, y quien no paga
--     sigue viendo el temario y el muro de El Charcu Pro.
--   · Al abrirlos, se verían los videos de relleno (los del lomo curado, que
--     la 0034 repartió en rueda). Se quitan de los cursos que están en
--     `lista-de-espera`: la lección enseña la foto del curso hasta que tenga
--     su video. El lomo curado está publicado y conserva los suyos.
--   · Un `borrador` sigue cerrado para todos.
-- ============================================================================

create or replace function charcu.can_read_course(p_course_id uuid)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1
    from charcu.courses c
    where c.id = p_course_id
      and c.status in ('publicado', 'lista-de-espera')
      and (
        (c.access = 'libre' and (select auth.uid()) is not null)
        or charcu.has_active_subscription((select auth.uid()))
      )
  );
$$;

update charcu.lessons l
   set bunny_video_id = null,
       poster_url     = coalesce(l.poster_url, c.cover_url)
  from charcu.modules m, charcu.courses c
 where l.module_id = m.id
   and m.course_id = c.id
   and c.status = 'lista-de-espera'
   and l.bunny_video_id in (
     'f3a57ec6-49fa-4484-a0c8-15ab361cd4e0',
     '6bca551d-d813-4bf6-990e-1f5cba53389d',
     '8693ac0e-6ddd-4de8-ac2a-3c7878659063',
     '14c9bb65-a936-45d3-8ac4-a7d41e7cf79d',
     '9767cee6-0bf7-451a-a3c5-1e6925b8eb9b',
     '2fa024cc-a711-468c-b42a-e370699524bd'
   );
