-- ============================================================================
-- La portada del Chorizo Paisa (2026-10-03)
--
-- Era el único curso sin `cover_url`. Con el rediseño las tarjetas vuelven a
-- enseñar foto, y un curso sin ella saldría con la inicial en medio de cuatro
-- fotos: se leería como "este está a medio hacer".
--
-- No hay foto propia del paisa —el curso no está grabado— así que se toma la
-- de una receta, como ya hacen la longaniza, el santarrosano y el chorizo de
-- ajo. La del chorizo parrillero es la que mejor lo cuenta: grueso, a la
-- brasa, el de la bandeja. Ningún otro curso la usa.
--
-- Por slug: si el curso no existe (una base vacía), no toca nada.
-- ============================================================================

update charcu.courses
   set cover_url = '/recipes/chorizo-parrillero.jpg'
 where slug = 'chorizo-paisa'
   and cover_url is null;
