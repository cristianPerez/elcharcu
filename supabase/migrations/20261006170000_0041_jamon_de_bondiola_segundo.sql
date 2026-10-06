-- ============================================================================
-- El Jamón de Bondiola Ahumado pasa al segundo puesto (2026-10-06)
--
-- Es el primer curso de pago grabado entero (0036–0040), y Cristian lo quiere
-- justo después del curso gratis en el carrusel de "Cursos maestros", en el
-- celular y en la web. El carrusel pinta los cursos publicados por `position`.
--
-- Se le da el 15: queda entre el Lomo curado (10, el gratis) y el 20, sin
-- correr a nadie. `courses_kind_position_idx` es único por carril (kind +
-- position), y en el carril de cursos el 15 está libre.
-- ============================================================================

update charcu.courses
   set position   = 15,
       updated_at = now()
 where slug = 'jamon-de-bondiola-ahumado';
