-- ============================================================================
-- Jamón de Bondiola Ahumado: el paso a paso, con sus videos reales
-- (2026-10-06)
--
-- Con esto el curso deja de tener videos de relleno. El módulo "Paso a paso"
-- (posición 4 desde 0037) queda así:
--
--   0  Poner el rub y empacar al vacío   video  (era "Pesar, mezclar y masajear")
--   1  Sacarla de la nevera y bridarla   video  (era "Curar al vacío, bridar y ahumar")
--   2  Ahumar hasta 75 °C en el centro   video  (era "75 °C, frío de golpe y reposo")
--   3  El choque térmico: agua y hielo   texto  NUEVA
--   4  Al día siguiente: afilar y cortar video  NUEVA
--
-- ⚠️ LAS TRES PRIMERAS SE ACTUALIZAN EN SU SITIO, como en 0035: el avance de
-- quien ya las vio cuelga de su id. El pesaje que vivía en la primera ya tiene
-- su propio video desde 0037 ("Pesar la mezcla para 4,2 kg"), así que aquí
-- empieza en el rub.
--
-- El texto sale de los pasos de `jamon-de-bondiola-ahumado.json`; lo único
-- nuevo es la lección del choque térmico, que pidió Cristian por escrito.
-- ============================================================================

update charcu.modules mo
   set summary = 'Del rub al corte, en orden.'
  from charcu.courses c
 where c.id = mo.course_id
   and c.slug = 'jamon-de-bondiola-ahumado'
   and mo.position = 4;

-- 1. Las tres que ya existían, con su video y su texto nuevos.
update charcu.lessons l
   set title          = n.title,
       summary        = n.summary,
       bunny_video_id = n.bunny_video_id,
       duration_s     = n.duration_s,
       body           = n.body,
       ask            = coalesce(n.ask, l.ask)
  from (values
    (0, $t$Poner el rub y empacar al vacío$t$,
     $t$Toda la mezcla sobre la carne, y al vacío a la nevera.$t$,
     '38bc7e53-d105-47c7-b352-4213238f96ac', 76,
     $t$Con la mezcla ya pesada y revuelta en el bol, cubre cada pieza masajeando bien toda la superficie, incluidos los pliegues y las puntas. No sobra nada: todo lo que pesaste va sobre la carne.

Empaca al vacío y a la nevera: **un día por cada kilo** de cada pieza. Voltea la bolsa una vez al día para que la salmuera que se forma bañe la pieza por los dos lados.$t$,
     $t$Ya empaqué mi bondiola al vacío con el rub: ¿es normal que suelte tanto líquido, y qué hago si la bolsa pierde el vacío en la nevera?$t$),

    (1, $t$Sacarla de la nevera y bridarla$t$,
     $t$Cumplido el curado, se escurre y se brida en forma de cilindro.$t$,
     'fff3a8ee-b1e0-42e1-bac4-ebb3a6a69f5c', 260,
     $t$Cumplido el curado, saca las piezas de la bolsa y escúrrelas.

Brida cada una con pita o cabuya dándole forma cilíndrica. Esa forma no es estética: una pieza pareja se cocina pareja y se corta en lonchas redondas.

Si es tu primera vez bridando, la cápsula **Cómo bridar un jamón** lo explica paso a paso.$t$,
     $t$Estoy bridando mi bondiola y me queda floja o despareja: ¿cómo la aprieto sin deformarla?$t$),

    (2, $t$Ahumar hasta 75 °C en el centro$t$,
     $t$Humo de guayabo constante, y el termómetro manda sobre el reloj.$t$,
     'ecb19b91-0cb1-4219-a2eb-20758b05ab47', 68,
     $t$Precalienta el barril u horno a 200 °C y mete las piezas. Añade pellets de guayabo cada 30 minutos para mantener el humo constante durante toda la cocción.

Cocina hasta que el **centro** de la pieza marque **75 °C**. Clava el termómetro en la parte más gruesa y mide; nunca cuentes tiempo: dos bondiolas del mismo peso pueden tardar distinto según su forma.$t$,
     null)  -- la pregunta del termómetro que ya tenía le sigue sirviendo
  ) as n(position, title, summary, bunny_video_id, duration_s, body, ask)
  join charcu.courses c  on c.slug = 'jamon-de-bondiola-ahumado'
  join charcu.modules mo on mo.course_id = c.id and mo.position = 4
 where l.module_id = mo.id
   and l.position  = n.position;

-- 2. Las dos nuevas.
insert into charcu.lessons
  (module_id, kind, title, summary, position, duration_s, poster_url, bunny_video_id, body, ask)
select mo.id, l.kind, l.title, l.summary, l.position, l.duration_s,
       l.poster_url, l.bunny_video_id, l.body, l.ask
  from (values
    ('texto', 3, $t$El choque térmico: agua y hielo$t$,
     $t$Apenas el centro marca 75 °C, a enfriar de golpe.$t$,
     null::integer, null, null,
     $t$En cuanto el centro de la pieza marque **75 °C**, sácala del humo y métela directo en un recipiente con **agua y hielo**, que la cubra entera, hasta que esté fría al tacto. Si el hielo se derrite, repón: el agua tiene que seguir helada.

**Por qué:** la pieza sigue cocinándose por dentro un buen rato después de salir del calor. El choque térmico corta esa cocción residual, y así no se pasa ni se seca.

**Y es seguridad:** entre 60 y 5 °C es el rango donde más rápido crecen las bacterias. Enfriando de golpe, la carne cruza ese rango en poco tiempo en vez de quedarse horas ahí.

Ya fría, envuélvela en papel aluminio y a la nevera toda la noche.$t$,
     $t$Saqué mi jamón a 75 °C y lo metí en agua con hielo: ¿cuánto tiempo lo dejo y cómo sé que ya está frío por dentro?$t$),

    ('video', 4, $t$Al día siguiente: afilar y cortar$t$,
     $t$En frío y con buen filo, en lonchas finas.$t$,
     76, '/recipes/jamon-de-bondiola-ahumado.jpg', '057eb836-304b-4d26-b559-49920a54b574',
     $t$Después de reposar toda la noche en la nevera, saca el jamón. Afila bien el cuchillo antes de empezar: en una pieza fría, un buen filo es lo que da lonchas finas y limpias.

Corta en frío y en lonchas finas: en caliente se desarma, en frío se corta limpio. Y a disfrutar.$t$,
     $t$¿Cuánto me dura el jamón de bondiola en la nevera, y cómo lo guardo una vez cortado?$t$)
  ) as l(kind, position, title, summary, duration_s, poster_url, bunny_video_id, body, ask)
  join charcu.courses c  on c.slug = 'jamon-de-bondiola-ahumado'
  join charcu.modules mo on mo.course_id = c.id and mo.position = 4;
