-- 0046 — La marca dice "Colombia", no "Manizales" (Cristian, 2026-10-07).
--
-- El único texto de la base que nombraba la ciudad es la lección "Lo que
-- puedes preguntarle" de la cápsula "Calcular con El Charcu" (migración 0017):
-- "Manizales no es Buenos Aires". Se cambia por un ejemplo que no nombra
-- ciudades. Idempotente: si ya no está la frase, no cambia nada.

update charcu.lessons
   set body = replace(
         body,
         'Manizales no es Buenos Aires y no se cura igual.',
         'La montaña no es la costa y no se cura igual.'
       )
 where body like '%Manizales no es Buenos Aires y no se cura igual.%';
