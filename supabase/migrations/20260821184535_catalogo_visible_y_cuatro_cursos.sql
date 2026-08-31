-- ============================================================================
-- Cuatro cursos nuevos, y el catálogo deja de esconderse (2026-08-21)
--
-- Dos cosas que van juntas:
--
-- 1. LA POLÍTICA DE LECTURA CAMBIA. Hasta hoy `courses_select_visible` usaba
--    `can_read_course()`, que exige suscripción para los cursos de pago. Eso
--    no los "bloqueaba": los hacía INVISIBLES. Un curso que nadie ve no se
--    vende.
--    Ahora el CATÁLOGO es público —título, resumen y portada de todo lo
--    publicado— y lo que sigue cerrado es el CONTENIDO: `modules` y `lessons`
--    mantienen `can_read_course()` intacto. Se ve el escaparate, no se saca la
--    mercancía. D12 sigue en pie: la puerta la vigila la base, no la pantalla.
--
-- 2. SE SIEMBRAN 4 CURSOS de pago con su estructura completa, siguiendo el
--    proceso real: cortar → adobar → reposo noche 1 → embutir → amarrar →
--    cocción → reposo noche 2 → empacar.
--
-- ⚠️ TODOS LOS VIDEOS SON EL MISMO PLACEHOLDER (el corte del lomo). Es a
--    propósito, para ver la estructura antes de grabar. Cuando existan los
--    reales se cambian por lección.
--
-- ⚠️ El "Ahumado al barril (opcional)" es el MISMO video en los cuatro cursos.
--    Se deja identificable por el título, así que el día que exista el real se
--    actualizan todos de una vez:
--      update charcu.lessons set bunny_video_id = '<real>'
--       where title = 'Ahumado al barril (opcional)';
--
-- Los resúmenes salen de las recetas públicas de elcharcu.co/recetas, que es
-- la voz de la casa y no una inventada aquí.
-- ============================================================================

-- ----------------------------------------------------------------------------
-- 1. El catálogo se ve; el contenido no
-- ----------------------------------------------------------------------------

drop policy if exists courses_select_visible on charcu.courses;

create policy courses_select_visible on charcu.courses
  for select to anon, authenticated
  using (status = 'publicado');

-- `modules` y `lessons` NO se tocan: siguen con can_read_course(), que es
-- quien de verdad protege el contenido de pago.

-- ----------------------------------------------------------------------------
-- 2. Numeración de 10 en 10, también en el lomo
--
-- Para poder intercalar un módulo o una lección después sin renumerar todo.
-- El lomo se normaliza aquí para no dejar dos convenciones conviviendo.
-- ----------------------------------------------------------------------------

update charcu.modules set position = (position + 1) * 10
 where course_id = (select id from charcu.courses where slug = 'lomo-curado');

update charcu.lessons set position = (position + 1) * 10
 where module_id in (
   select m.id from charcu.modules m
    join charcu.courses c on c.id = m.course_id
   where c.slug = 'lomo-curado'
 );

update charcu.courses set position = 10 where slug = 'lomo-curado';

-- ----------------------------------------------------------------------------
-- 3. Los cuatro cursos
-- ----------------------------------------------------------------------------

insert into charcu.courses (slug, title, summary, cover_url, level, access, status, position)
values
  ('longaniza-colombiana', 'Longaniza Colombiana Artesanal', 'Embutido fresco tradicional: carne y grasa en equilibrio, con comino, paprika y orégano medidos. Jugosa, con textura de verdad y sin un solo aditivo.', '/recipes/longaniza-colombiana.jpg', 'para-empezar', 'pago', 'publicado', 20),
  ('chorizo-santarrosano', 'Chorizo Santarrosano', 'Uno de los chorizos más tradicionales de Colombia: carne magra y tocino en equilibrio, jugoso y hecho para la parrilla. Aquí va colgado y ahumado, como manda la tradición.', '/recipes/chorizo-santarrosano.jpg', 'intermedio', 'pago', 'publicado', 30),
  ('chorizo-paisa', 'Chorizo Paisa', 'El chorizo de la bandeja: grueso, jugoso y con el punto de grasa justo. El de toda la vida en Antioquia, hecho en tu cocina y sin atajos.', null, 'para-empezar', 'pago', 'publicado', 40),
  ('chorizo-de-ajo', 'Chorizo de Ajo Parrillero', 'El parrillero por excelencia: ajo de protagonista, vino tinto y un nutri que integra todos los secos. El que se huele antes de verlo.', '/recipes/chorizo-de-ajo.jpg', 'intermedio', 'pago', 'publicado', 50);

-- ----------------------------------------------------------------------------
-- 4. Los módulos, iguales en los cuatro
-- ----------------------------------------------------------------------------

insert into charcu.modules (course_id, title, summary, position)
select c.id, m.title, m.summary, m.position
  from charcu.courses c
  join (values
    ('longaniza-colombiana', 'Bienvenida', 'Lo que vas a lograr.', 10),
    ('longaniza-colombiana', 'Preparar la mezcla', 'La proporción, el condimento y el reposo de una noche.', 20),
    ('longaniza-colombiana', 'Embutir', 'Moler, llenar sin cuevas de aire y amarrar.', 30),
    ('longaniza-colombiana', 'Cocción', 'El calor y el humo.', 40),
    ('longaniza-colombiana', 'Terminar y conservar', 'El segundo reposo, el empaque y el punto final.', 50),
    ('chorizo-santarrosano', 'Bienvenida', 'Lo que vas a lograr.', 10),
    ('chorizo-santarrosano', 'Preparar la mezcla', 'La proporción, el condimento y el reposo de una noche.', 20),
    ('chorizo-santarrosano', 'Embutir', 'Moler, llenar sin cuevas de aire y amarrar.', 30),
    ('chorizo-santarrosano', 'Cocción', 'El calor y el humo.', 40),
    ('chorizo-santarrosano', 'Terminar y conservar', 'El segundo reposo, el empaque y el punto final.', 50),
    ('chorizo-paisa', 'Bienvenida', 'Lo que vas a lograr.', 10),
    ('chorizo-paisa', 'Preparar la mezcla', 'La proporción, el condimento y el reposo de una noche.', 20),
    ('chorizo-paisa', 'Embutir', 'Moler, llenar sin cuevas de aire y amarrar.', 30),
    ('chorizo-paisa', 'Cocción', 'El calor y el humo.', 40),
    ('chorizo-paisa', 'Terminar y conservar', 'El segundo reposo, el empaque y el punto final.', 50),
    ('chorizo-de-ajo', 'Bienvenida', 'Lo que vas a lograr.', 10),
    ('chorizo-de-ajo', 'Preparar la mezcla', 'La proporción, el condimento y el reposo de una noche.', 20),
    ('chorizo-de-ajo', 'Embutir', 'Moler, llenar sin cuevas de aire y amarrar.', 30),
    ('chorizo-de-ajo', 'Cocción', 'El calor y el humo.', 40),
    ('chorizo-de-ajo', 'Terminar y conservar', 'El segundo reposo, el empaque y el punto final.', 50)
       ) as m(slug, title, summary, position)
    on m.slug = c.slug;

-- ----------------------------------------------------------------------------
-- 5. Las lecciones
--
-- Se enganchan por (slug del curso, posición del módulo) en vez de por id:
-- los uuid los genera la base y aquí no se conocen.
-- ----------------------------------------------------------------------------

insert into charcu.lessons
  (module_id, kind, title, summary, position, bunny_video_id, ask)
select mo.id, 'video', l.title, l.summary, l.position, '2fa024cc-a711-468c-b42a-e370699524bd', l.ask
  from (values
    ('longaniza-colombiana', 10, 'Esto es lo que vas a lograr', 'Lo que sale al final, y por qué la longaniza de verdad no se parece al del supermercado.', 10, '¿Qué necesito tener en casa antes de empezar la longaniza?'),
    ('longaniza-colombiana', 20, 'Ingredientes y proporción carne–grasa', 'La proporción manda más que la receta. Sin grasa suficiente queda seco; con demasiada, se desarma.', 10, '¿Qué proporción de carne y grasa lleva la longaniza?'),
    ('longaniza-colombiana', 20, 'El condimento de la longaniza', 'Las cantidades por kilo, pesadas. Es lo único que distingue una receta de otra.', 20, '¿Qué especias lleva la longaniza y en qué cantidad por kilo?'),
    ('longaniza-colombiana', 20, 'Adobo y primer reposo en nevera (una noche)', 'Se mezcla, se tapa y se deja quieto una noche. Ese reposo no es opcional: es donde el sabor entra en la carne.', 30, '¿Cuántas horas debe reposar el adobo antes de embutir?'),
    ('longaniza-colombiana', 30, 'Molido', 'Grosor del disco, carne fría y sin forzar la máquina. Si la grasa se calienta, se unta y arruina la textura.', 10, '¿Qué disco uso para moler y qué tan fría debe estar la carne?'),
    ('longaniza-colombiana', 30, 'Embutido y sacar el aire (sin cuevas)', 'Las cuevas de aire son el enemigo: ahí se pudre. Cómo llenar parejo y cómo sacarlas cuando aparecen.', 20, 'Me quedaron burbujas de aire en el embutido. ¿Cómo las saco?'),
    ('longaniza-colombiana', 30, 'El amarre de la longaniza', 'Cada embutido tiene su amarre. Este es el suyo, paso a paso y sin nudos imposibles.', 30, '¿Cómo se amarra la longaniza y de qué largo va cada unidad?'),
    ('longaniza-colombiana', 40, 'Cocción al horno', 'Temperatura, tiempo y cómo saber que ya está por dentro sin abrirlo.', 10, '¿A qué temperatura y cuánto tiempo va la longaniza al horno?'),
    ('longaniza-colombiana', 40, 'Ahumado al barril (opcional)', 'El paso que no necesitas pero que cambia el producto. Sirve igual para cualquiera de los cursos.', 20, '¿Qué madera uso para ahumar al barril y cuánto tiempo?'),
    ('longaniza-colombiana', 50, 'Segundo reposo en nevera (una noche)', 'Después de la cocción, otra noche quieto. Se asienta el jugo y la textura cambia de verdad.', 10, '¿Por qué hay que dejarlo reposar otra vez después de cocinarlo?'),
    ('longaniza-colombiana', 50, 'Empaque al vacío', 'Cuánto dura, cómo se congela y cómo se descongela sin arruinarlo.', 20, '¿Cuánto dura al vacío en nevera y cuánto en congelador?'),
    ('longaniza-colombiana', 50, 'Empaque sin máquina: icopor y vinipel', 'Sin empacadora también se guarda bien. El método de la casa, con lo que hay.', 30, 'No tengo empacadora al vacío. ¿Cómo lo guardo?'),
    ('longaniza-colombiana', 50, 'Resultado final y punto', 'Cómo se ve, cómo se corta y cómo saber que quedó en su punto.', 40, '¿Cómo sé que mi chorizo quedó en el punto correcto?'),
    ('chorizo-santarrosano', 10, 'Esto es lo que vas a lograr', 'Lo que sale al final, y por qué el santarrosano de verdad no se parece al del supermercado.', 10, '¿Qué necesito tener en casa antes de empezar el santarrosano?'),
    ('chorizo-santarrosano', 20, 'Ingredientes y proporción carne–grasa', 'La proporción manda más que la receta. Sin grasa suficiente queda seco; con demasiada, se desarma.', 10, '¿Qué proporción de carne y grasa lleva el santarrosano?'),
    ('chorizo-santarrosano', 20, 'El condimento de el santarrosano', 'Las cantidades por kilo, pesadas. Es lo único que distingue una receta de otra.', 20, '¿Qué especias lleva el santarrosano y en qué cantidad por kilo?'),
    ('chorizo-santarrosano', 20, 'Adobo y primer reposo en nevera (una noche)', 'Se mezcla, se tapa y se deja quieto una noche. Ese reposo no es opcional: es donde el sabor entra en la carne.', 30, '¿Cuántas horas debe reposar el adobo antes de embutir?'),
    ('chorizo-santarrosano', 30, 'Molido', 'Grosor del disco, carne fría y sin forzar la máquina. Si la grasa se calienta, se unta y arruina la textura.', 10, '¿Qué disco uso para moler y qué tan fría debe estar la carne?'),
    ('chorizo-santarrosano', 30, 'Embutido y sacar el aire (sin cuevas)', 'Las cuevas de aire son el enemigo: ahí se pudre. Cómo llenar parejo y cómo sacarlas cuando aparecen.', 20, 'Me quedaron burbujas de aire en el embutido. ¿Cómo las saco?'),
    ('chorizo-santarrosano', 30, 'El amarre de el santarrosano', 'Cada embutido tiene su amarre. Este es el suyo, paso a paso y sin nudos imposibles.', 30, '¿Cómo se amarra el santarrosano y de qué largo va cada unidad?'),
    ('chorizo-santarrosano', 40, 'Colgar con mosquetero', 'Antes del humo hay que colgar. Cómo, cuánto y qué mirar mientras tanto.', 10, '¿Cuánto tiempo cuelgo el chorizo antes de ahumarlo?'),
    ('chorizo-santarrosano', 40, 'Ahumado con madera fresca', 'Madera fresca, humo frío y paciencia. Es lo que le da el carácter al santarrosano.', 20, '¿Qué madera se usa para ahumar el santarrosano?'),
    ('chorizo-santarrosano', 40, 'Ahumado al barril (opcional)', 'El paso que no necesitas pero que cambia el producto. Sirve igual para cualquiera de los cursos.', 30, '¿Qué madera uso para ahumar al barril y cuánto tiempo?'),
    ('chorizo-santarrosano', 50, 'Segundo reposo en nevera (una noche)', 'Después de la cocción, otra noche quieto. Se asienta el jugo y la textura cambia de verdad.', 10, '¿Por qué hay que dejarlo reposar otra vez después de cocinarlo?'),
    ('chorizo-santarrosano', 50, 'Empaque al vacío', 'Cuánto dura, cómo se congela y cómo se descongela sin arruinarlo.', 20, '¿Cuánto dura al vacío en nevera y cuánto en congelador?'),
    ('chorizo-santarrosano', 50, 'Empaque sin máquina: icopor y vinipel', 'Sin empacadora también se guarda bien. El método de la casa, con lo que hay.', 30, 'No tengo empacadora al vacío. ¿Cómo lo guardo?'),
    ('chorizo-santarrosano', 50, 'Resultado final y punto', 'Cómo se ve, cómo se corta y cómo saber que quedó en su punto.', 40, '¿Cómo sé que mi chorizo quedó en el punto correcto?'),
    ('chorizo-paisa', 10, 'Esto es lo que vas a lograr', 'Lo que sale al final, y por qué el paisa de verdad no se parece al del supermercado.', 10, '¿Qué necesito tener en casa antes de empezar el paisa?'),
    ('chorizo-paisa', 20, 'Ingredientes y proporción carne–grasa', 'La proporción manda más que la receta. Sin grasa suficiente queda seco; con demasiada, se desarma.', 10, '¿Qué proporción de carne y grasa lleva el paisa?'),
    ('chorizo-paisa', 20, 'El condimento de el paisa', 'Las cantidades por kilo, pesadas. Es lo único que distingue una receta de otra.', 20, '¿Qué especias lleva el paisa y en qué cantidad por kilo?'),
    ('chorizo-paisa', 20, 'Adobo y primer reposo en nevera (una noche)', 'Se mezcla, se tapa y se deja quieto una noche. Ese reposo no es opcional: es donde el sabor entra en la carne.', 30, '¿Cuántas horas debe reposar el adobo antes de embutir?'),
    ('chorizo-paisa', 30, 'Molido', 'Grosor del disco, carne fría y sin forzar la máquina. Si la grasa se calienta, se unta y arruina la textura.', 10, '¿Qué disco uso para moler y qué tan fría debe estar la carne?'),
    ('chorizo-paisa', 30, 'Embutido y sacar el aire (sin cuevas)', 'Las cuevas de aire son el enemigo: ahí se pudre. Cómo llenar parejo y cómo sacarlas cuando aparecen.', 20, 'Me quedaron burbujas de aire en el embutido. ¿Cómo las saco?'),
    ('chorizo-paisa', 30, 'El amarre de el paisa', 'Cada embutido tiene su amarre. Este es el suyo, paso a paso y sin nudos imposibles.', 30, '¿Cómo se amarra el paisa y de qué largo va cada unidad?'),
    ('chorizo-paisa', 40, 'Cocción al horno', 'Temperatura, tiempo y cómo saber que ya está por dentro sin abrirlo.', 10, '¿A qué temperatura y cuánto tiempo va el paisa al horno?'),
    ('chorizo-paisa', 40, 'Ahumado al barril (opcional)', 'El paso que no necesitas pero que cambia el producto. Sirve igual para cualquiera de los cursos.', 20, '¿Qué madera uso para ahumar al barril y cuánto tiempo?'),
    ('chorizo-paisa', 50, 'Segundo reposo en nevera (una noche)', 'Después de la cocción, otra noche quieto. Se asienta el jugo y la textura cambia de verdad.', 10, '¿Por qué hay que dejarlo reposar otra vez después de cocinarlo?'),
    ('chorizo-paisa', 50, 'Empaque al vacío', 'Cuánto dura, cómo se congela y cómo se descongela sin arruinarlo.', 20, '¿Cuánto dura al vacío en nevera y cuánto en congelador?'),
    ('chorizo-paisa', 50, 'Empaque sin máquina: icopor y vinipel', 'Sin empacadora también se guarda bien. El método de la casa, con lo que hay.', 30, 'No tengo empacadora al vacío. ¿Cómo lo guardo?'),
    ('chorizo-paisa', 50, 'Resultado final y punto', 'Cómo se ve, cómo se corta y cómo saber que quedó en su punto.', 40, '¿Cómo sé que mi chorizo quedó en el punto correcto?'),
    ('chorizo-de-ajo', 10, 'Esto es lo que vas a lograr', 'Lo que sale al final, y por qué el chorizo de ajo de verdad no se parece al del supermercado.', 10, '¿Qué necesito tener en casa antes de empezar el chorizo de ajo?'),
    ('chorizo-de-ajo', 20, 'Ingredientes y proporción carne–grasa', 'La proporción manda más que la receta. Sin grasa suficiente queda seco; con demasiada, se desarma.', 10, '¿Qué proporción de carne y grasa lleva el chorizo de ajo?'),
    ('chorizo-de-ajo', 20, 'El condimento de el chorizo de ajo', 'Las cantidades por kilo, pesadas. Es lo único que distingue una receta de otra.', 20, '¿Qué especias lleva el chorizo de ajo y en qué cantidad por kilo?'),
    ('chorizo-de-ajo', 20, 'Adobo y primer reposo en nevera (una noche)', 'Se mezcla, se tapa y se deja quieto una noche. Ese reposo no es opcional: es donde el sabor entra en la carne.', 30, '¿Cuántas horas debe reposar el adobo antes de embutir?'),
    ('chorizo-de-ajo', 30, 'Molido', 'Grosor del disco, carne fría y sin forzar la máquina. Si la grasa se calienta, se unta y arruina la textura.', 10, '¿Qué disco uso para moler y qué tan fría debe estar la carne?'),
    ('chorizo-de-ajo', 30, 'Embutido y sacar el aire (sin cuevas)', 'Las cuevas de aire son el enemigo: ahí se pudre. Cómo llenar parejo y cómo sacarlas cuando aparecen.', 20, 'Me quedaron burbujas de aire en el embutido. ¿Cómo las saco?'),
    ('chorizo-de-ajo', 30, 'El amarre de el chorizo de ajo', 'Cada embutido tiene su amarre. Este es el suyo, paso a paso y sin nudos imposibles.', 30, '¿Cómo se amarra el chorizo de ajo y de qué largo va cada unidad?'),
    ('chorizo-de-ajo', 40, 'Cocción al horno', 'Temperatura, tiempo y cómo saber que ya está por dentro sin abrirlo.', 10, '¿A qué temperatura y cuánto tiempo va el chorizo de ajo al horno?'),
    ('chorizo-de-ajo', 40, 'Ahumado al barril (opcional)', 'El paso que no necesitas pero que cambia el producto. Sirve igual para cualquiera de los cursos.', 20, '¿Qué madera uso para ahumar al barril y cuánto tiempo?'),
    ('chorizo-de-ajo', 50, 'Segundo reposo en nevera (una noche)', 'Después de la cocción, otra noche quieto. Se asienta el jugo y la textura cambia de verdad.', 10, '¿Por qué hay que dejarlo reposar otra vez después de cocinarlo?'),
    ('chorizo-de-ajo', 50, 'Empaque al vacío', 'Cuánto dura, cómo se congela y cómo se descongela sin arruinarlo.', 20, '¿Cuánto dura al vacío en nevera y cuánto en congelador?'),
    ('chorizo-de-ajo', 50, 'Empaque sin máquina: icopor y vinipel', 'Sin empacadora también se guarda bien. El método de la casa, con lo que hay.', 30, 'No tengo empacadora al vacío. ¿Cómo lo guardo?'),
    ('chorizo-de-ajo', 50, 'Resultado final y punto', 'Cómo se ve, cómo se corta y cómo saber que quedó en su punto.', 40, '¿Cómo sé que mi chorizo quedó en el punto correcto?')
       ) as l(slug, module_position, title, summary, position, ask)
  join charcu.courses c  on c.slug = l.slug
  join charcu.modules mo on mo.course_id = c.id and mo.position = l.module_position;
