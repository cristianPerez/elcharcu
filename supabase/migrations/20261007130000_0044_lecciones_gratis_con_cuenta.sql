-- ============================================================================
-- Las lecciones de los cursos GRATIS piden cuenta (2026-10-07)
--
-- El diseño final pide la cuenta al abrir una cápsula o el curso gratis (el
-- lomo). Pero `can_read_course` dejaba leer el contenido de `access = 'libre'`
-- a cualquiera, también sin sesión: con la clave pública se podían sacar los
-- módulos y las lecciones —y los ids de Bunny— por la API. El gating habría
-- sido solo de pantalla.
--
-- Ahora lo libre es "libre con cuenta": hace falta `auth.uid()`. Lo de pago
-- sigue pidiendo suscripción activa. El catálogo (`courses`) y el índice de
-- los cursos de pago (`course_outline`) no cambian: se siguen viendo sin
-- cuenta. La portada cuenta las lecciones con la clave de servicio.
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
      and c.status = 'publicado'
      and (
        (c.access = 'libre' and (select auth.uid()) is not null)
        or charcu.has_active_subscription((select auth.uid()))
      )
  );
$$;
