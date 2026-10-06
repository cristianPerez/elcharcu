-- ============================================================================
-- Jamón de Bondiola Ahumado: la pieza, el corte y la mezcla, con videos
-- reales (2026-10-06)
--
-- Cristian grabó el arranque del curso con 4,2 kg de bondiola. Quedan así:
--
--   0  Bienvenida        Esto es lo que vas a lograr      video (0036)
--   1  La pieza          Qué vamos a hacer y con qué corte video NUEVO
--   2  Porcionar         Partir la bondiola en dos        video NUEVO
--   3  Antes de empezar  Ingredientes y proporción        texto, AHORA CON TABLA
--                        Pesar la mezcla para 4,2 kg      video NUEVO
--   4  Paso a paso       (igual; sus tres videos siguen siendo de relleno)
--   5  Terminar          (igual)
--
-- ⚠️ LAS CANTIDADES SON LAS DEL VIDEO, no las de la receta. Cristian pesó para
-- 4,2 kg: 68,04 g de sal, 10,50 de sal de cura, 6,30 de ajo, 10,50 de azúcar…
-- Por kilo eso da 16,20 / 2,50 / 1,50 / 2,50 y 27,35 g en total, frente a los
-- 16,26 / 2,50 / 1,51 / 2,51 y 27,43 de `jamon-de-bondiola-ahumado.json`. La
-- diferencia no cambia nada en el plato, pero el curso enseña lo que se ve
-- pesar en pantalla. La sal de cura es la misma en las dos: 2,5 g por kilo,
-- el tope de `MAX_CURE_1_G_PER_KG`.
--
-- La tabla la entiende `LessonText` (widgets/lesson-view) desde este mismo
-- cambio: líneas que empiezan por `|` con su fila de `---`.
--
-- ⚠️ LOS MÓDULOS SE CORREN DE UNO EN UNO Y DE ATRÁS HACIA DELANTE:
-- `modules_course_position_idx` es único y no diferible. Las lecciones
-- existentes no se tocan de sitio —cuelgan de su módulo, no de su posición—,
-- así que nadie pierde avance.
-- ============================================================================

-- 1. Hueco para los dos módulos nuevos: 3→5, 2→4, 1→3.
update charcu.modules mo
   set position = mo.position + 2
  from charcu.courses c
 where c.id = mo.course_id
   and c.slug = 'jamon-de-bondiola-ahumado'
   and mo.position = 3;

update charcu.modules mo
   set position = mo.position + 2
  from charcu.courses c
 where c.id = mo.course_id
   and c.slug = 'jamon-de-bondiola-ahumado'
   and mo.position = 2;

update charcu.modules mo
   set position = mo.position + 2
  from charcu.courses c
 where c.id = mo.course_id
   and c.slug = 'jamon-de-bondiola-ahumado'
   and mo.position = 1;

-- 2. Los dos módulos nuevos.
insert into charcu.modules (course_id, title, summary, position)
select c.id, m.title, m.summary, m.position
  from (values
    ('La pieza',  'Qué vamos a hacer y con qué corte.',            1),
    ('Porcionar', 'Partir la bondiola en dos para que cure pareja.', 2)
  ) as m(title, summary, position)
  join charcu.courses c on c.slug = 'jamon-de-bondiola-ahumado';

-- 3. Sus lecciones.
insert into charcu.lessons
  (module_id, kind, title, summary, position, duration_s, poster_url, bunny_video_id, body, ask)
select mo.id, 'video', l.title, l.summary, 0, l.duration_s,
       '/recipes/jamon-de-bondiola-ahumado.jpg', l.bunny_video_id, l.body, l.ask
  from (values
    (1, $t$Qué vamos a hacer y con qué corte$t$,
     $t$La bondiola, recién salida del empaque al vacío.$t$,
     20, '503adfef-0a53-4152-88aa-243e0ad678c4',
     $t$Vamos a convertir una bondiola de cerdo en jamón: se cura al vacío con sal, sal de cura y especias, se brida, se ahúma con guayabo y se cocina hasta que el centro marque 75 °C.

La bondiola es el cabecero de lomo, la pieza con más grasa entreverada del cerdo. Esa grasa es la que se funde en el ahumado y deja la loncha jugosa donde un jamón de pierna quedaría seco.

En los videos trabajamos con **4,2 kg** de bondiola. Las cantidades del curso van por kilo, así que sirven para el peso que tú tengas.$t$,
     $t$Voy a hacer el Jamón de Bondiola Ahumado: ¿cómo escojo una buena bondiola y cuánto conviene que pese para empezar?$t$),

    (2, $t$Partir la bondiola en dos$t$,
     $t$Dos mitades curan más rápido y más parejo que una pieza entera.$t$,
     18, 'cebec080-d28c-4b5a-acaa-45b42783735a',
     $t$Partimos la pieza en dos antes de curarla.

**Por qué:** el curado va por el peso de CADA pieza, un día por kilo. Una bondiola de 2 kg partida en dos cura en la mitad de tiempo y con mucha menos incertidumbre: la sal llega al centro de las dos mitades a la vez.

Busca dos mitades de grosor parecido. Y pesa la carne antes de seguir: todo lo que viene después —la mezcla y los días al vacío— se calcula sobre su peso real.$t$,
     $t$Tengo una bondiola de 2 kg: ¿la parto en dos o la curo entera, y cuántos días al vacío le tocan a cada mitad?$t$)
  ) as l(module_position, title, summary, duration_s, bunny_video_id, body, ask)
  join charcu.courses c  on c.slug = 'jamon-de-bondiola-ahumado'
  join charcu.modules mo on mo.course_id = c.id and mo.position = l.module_position;

-- 4. Ingredientes y proporción: la tabla, por kilo y para los 4,2 kg del video.
update charcu.lessons l
   set summary = $t$La mezcla por kilo y la que pesamos en los videos para 4,2 kg. La sal de cura al 0,25% es el estándar seguro y el techo.$t$,
       body    = $t$La mezcla para **1 kg** de bondiola, y la que pesamos en los videos para **4,2 kg**:

| Ingrediente | 1 kg | 4,2 kg |
| --- | ---: | ---: |
| 🧂 Sal fina | **16,20 g** | 68,04 g |
| 🧪 Sal de cura #1 | **2,50 g** | 10,50 g |
| 🌶️ Pimienta negra | **1,20 g** | 5,04 g |
| 🧄 Ajo en polvo | **1,50 g** | 6,30 g |
| 🌿 Coriandro | **1,00 g** | 4,20 g |
| 🌰 Nuez moscada | **0,25 g** | 1,05 g |
| 🍬 Azúcar | **2,50 g** | 10,50 g |
| 🌶️ Paprika dulce | **1,20 g** | 5,04 g |
| 🌶️ Chile quebrado | **1,00 g** | 4,20 g |
| **TOTAL** | **27,35 g** | **114,87 g** |

La sal de cura #1 es la que también se vende como Prague Powder #1. Además vas a necesitar pellets o astillas de guayabo para el ahumado, y pita o cabuya para bridar.

La sal fina al 1,62% es lo que hace que quede sabroso sin salarse, y la sal de cura al 0,25% es el estándar seguro y también el techo: nunca más. El azúcar no está para endulzar — redondea la sal y ayuda al color durante el ahumado.

Aquí la sal de cura NO es opcional: la pieza pasa horas entre 30 y 60 °C mientras sube al centro, que es justo el rango donde el Clostridium botulinum trabaja mejor.

Pesa la carne antes de nada: todo se calcula sobre su peso real. Si no tienes 1 kg ni 4,2 kg, multiplica la columna de 1 kg por tus kilos, o pregúntale a El Charcu.$t$
  from charcu.modules mo
  join charcu.courses c on c.id = mo.course_id
 where l.module_id = mo.id
   and c.slug      = 'jamon-de-bondiola-ahumado'
   and mo.position = 3
   and l.position  = 0;

-- 5. Y justo después, el video pesándola.
insert into charcu.lessons
  (module_id, kind, title, summary, position, duration_s, poster_url, bunny_video_id, body, ask)
select mo.id, 'video', $t$Pesar la mezcla para 4,2 kg$t$,
       $t$Cada condimento por separado, en gramera.$t$, 1, 48,
       '/recipes/jamon-de-bondiola-ahumado.jpg', 'd5d76bf4-572e-40bd-b6e7-fc9d24cf2e02',
       $t$Pesamos la mezcla de la tabla para 4,2 kg. Cada condimento por separado y en una gramera de precisión: los **10,50 g de sal de cura** no se miden a ojo ni con cuchara.

Mezcla todos los secos en un bol antes de tocar la carne. Es lo único que garantiza que la sal de cura quede repartida pareja; echándolos uno a uno sobre la pieza siempre queda una zona con más.$t$,
       $t$Mis bondiolas no pesan 4,2 kg: ¿cuánto le pongo de cada condimento a mi peso?$t$
  from charcu.courses c
  join charcu.modules mo on mo.course_id = c.id and mo.position = 3
 where c.slug = 'jamon-de-bondiola-ahumado';

-- 6. La pregunta sugerida de la bienvenida hablaba de los 27,43 g de la receta.
update charcu.lessons l
   set ask = replace(l.ask, '27,43 g', '27,35 g')
  from charcu.modules mo
  join charcu.courses c on c.id = mo.course_id
 where l.module_id = mo.id
   and c.slug      = 'jamon-de-bondiola-ahumado'
   and mo.position = 0
   and l.position  = 0;
