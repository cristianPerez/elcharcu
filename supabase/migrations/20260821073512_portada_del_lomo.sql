-- ============================================================================
-- La portada del curso deja de ser la foto de la bondiola (2026-08-21)
--
-- Hasta hoy el curso del lomo se anunciaba con una foto de otra pieza, y
-- guardada en una carpeta que se llama `bondiola`. Funcionaba, pero prometía
-- una cosa y el curso enseñaba otra.
--
-- La nueva es la foto real del lomo curado terminado, ya cortado. Es la que
-- vende el curso: nadie se apunta a curar por leer un título.
--
-- Los `poster_url` de las lecciones se quedan apuntando a las fotos viejas a
-- propósito: hoy no se ven en ninguna parte, porque solo salen cuando una
-- lección NO tiene video, y las siete lo tienen. Cambiarlos sería tocar siete
-- filas para que nadie note la diferencia.
-- ============================================================================

update charcu.courses
   set cover_url = '/curso/lomo/portada.jpg'
 where slug = 'lomo-curado';
