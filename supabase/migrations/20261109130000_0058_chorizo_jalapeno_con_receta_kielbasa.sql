-- ============================================================================
-- 0058 · EL CURSO DE CHORIZOS DE JALAPEÑO PASA A LA RECETA DE KIELBASA (2026-11-09)
--
-- Los videos de `chorizos-picantes-jalapeno-queso-cheddar` se grabaron con la
-- receta de Kielbasa de Mozzarella y Jalapeño (2 kg, 70% a cuchillo y 30%
-- molida fina, Cure #1, dos días y ahumado). El texto del curso todavía era el
-- del chorizo fresco de cheddar (1 kg, sin sal de cura). Decisión de Cristian:
-- los textos siguen a los videos.
--
--   · Solo se cambia el TEXTO: título, resumen, cuerpo y pregunta para El
--     Charcu. Cada lección conserva su `bunny_video_id`.
--   · `update` en el sitio, por curso + posición de módulo + posición de
--     lección. No se borran módulos como en la 0034, porque hay progreso de
--     usuarios en estas lecciones y sus ids tienen que quedar igual.
--   · El slug no cambia (no se rompen enlaces). El título nombra los dos
--     quesos: lleva cheddar Y mozzarella (140 g cada uno), como en el video.
--   · La ficha del recetario con este slug NO se toca (decisión de Cristian).
--   · 72 °C internos: la misma cifra que ya usa la receta de kielbasa del sitio.
--
-- Volver a aplicarla da el mismo resultado.
-- ============================================================================

update charcu.courses
   set title      = $t$Chorizos Picantes de Jalapeño, Cheddar y Mozzarella$t$,
       summary    = $t$Chorizo ahumado de textura artesanal —70% picado a cuchillo— con jalapeño y cubos de cheddar y mozzarella: tres días de trabajo y, al cuarto, a la mesa.$t$,
       updated_at = now()
 where slug = $t$chorizos-picantes-jalapeno-queso-cheddar$t$;

-- Bienvenida -----------------------------------------------------------------

update charcu.lessons l
   set bunny_video_id = $t$44f06715-af6d-4a06-844f-43f228a6723f$t$,
       title   = $t$Esto es lo que vas a lograr$t$,
       summary = $t$Picado a cuchillo, con cheddar, mozzarella y jalapeño, y ahumado al tercer día.$t$,
       body    = $t$Un chorizo de estructura, no de emulsión: el 70% de la carne va picada a cuchillo y solo el 30% molida fina, que es la que liga y sostiene todo.

Se trabaja en tres días. El primero, solo carne, condimentos y agua: se amasa hasta que la masa ligue y reposa 8 horas en frío. El segundo, entran el jalapeño bien seco y los cubos de cheddar y mozzarella, con la mano suave para que lleguen enteros; se embute, se pincha el aire y los chorizos se cuelgan en la nevera hasta el día siguiente. El tercero, se ahúman de forma progresiva, se enfrían en agua con hielo y pasan la noche colgados en la nevera. El cuarto, se empacan o se disfrutan.

El queso funde por dentro y el jalapeño corta la grasa. Al tajarlo se ven los cubos de queso y el verde repartidos en una masa de grano grueso.

«El queso y el jalapeño no son adorno: son agua y grasa dentro de una tripa cerrada. Por eso aquí manda la presión, no la prisa.»$t$,
       ask     = $t$La receta de Chorizos Picantes de Jalapeño, Cheddar y Mozzarella está para 2 kg de carne. Mi carne pesa otra cosa. ¿Cómo reescalo todos los ingredientes sin equivocarme, sobre todo las sales?$t$
  from charcu.modules m, charcu.courses c
 where l.module_id = m.id and m.course_id = c.id
   and c.slug = $t$chorizos-picantes-jalapeno-queso-cheddar$t$
   and m.position = 0 and l.position = 0;

-- Antes de empezar -----------------------------------------------------------

update charcu.modules m
   set summary = $t$Qué lleva, en qué proporción y por qué.$t$
  from charcu.courses c
 where m.course_id = c.id
   and c.slug = $t$chorizos-picantes-jalapeno-queso-cheddar$t$
   and m.position = 1;

update charcu.lessons l
   set title   = $t$Ingredientes y proporción$t$,
       summary = $t$2 kg de cerdo: 70% picado a cuchillo y 30% molido fino.$t$,
       body    = $t$Carne
• Carne de cerdo picada a cuchillo: 1400 g (70%)
• Carne de cerdo molida fina: 600 g (30%)

Condimentos
• Sal: 30 g (1.5%)
• Sal de cura #1 (Cure #1): 5 g (0.25%)
• Azúcar: 3.3 g (0.17%)
• Ajo en polvo: 2.7 g (0.14%)
• Pimienta negra: 1.75 g (0.09%)
• Coriandro molido: 1 g (0.05%)
• Paprika dulce: 1 g (0.05%)
• Nuez moscada: 0.2 g (0.01%)
• Agua helada: 100 ml (5%)

Inclusiones (Día 2)
• Jalapeño encurtido (o fresco, mejor), en trozos no tan pequeños y bien seco: 140 g (7%)
• Queso cheddar congelado, en cubos de 5–7 mm: 140 g (7%)
• Mozzarella en cubos de 5–7 mm, muy fría: 140 g (7%)

70% picada a cuchillo y 30% molida fina: esa es la receta. El grano grueso da la mordida artesanal y lo molido fino da la liga que sostiene todo. Si subes lo molido fino, la masa se acerca a una emulsión y pierde el carácter. Si lo bajas, el chorizo se desarma al tajarlo.

El porcentaje es el peso sobre los 2 kg de carne. Por kilo: sal 15 g, sal de cura #1 2,5 g, azúcar 1,65 g, ajo en polvo 1,35 g, pimienta negra 0,88 g, coriandro 0,5 g, paprika 0,5 g, nuez moscada 0,1 g, agua helada 50 ml, jalapeño 70 g, cheddar 70 g y mozzarella 70 g. Los 2,5 g de Cure #1 por kilo dan 156 ppm de nitrito de entrada: el nivel estándar para un embutido cocido, y también el techo. Si tu sal de cura tiene otra concentración de nitrito, la dosis no es la misma.

Los quesos y el jalapeño entran el segundo día, nunca en el amasado del primero: si se amasan con la masa se deshacen y sueltan su agua por dentro. El jalapeño hay que escurrirlo y secarlo de verdad, porque el líquido del encurtido es lo que después revienta la tripa.$t$,
       ask     = $t$Estoy haciendo Chorizos Picantes de Jalapeño, Cheddar y Mozzarella y no consigo todos los ingredientes. ¿Cuáles puedo cambiar sin arruinarla y cuáles no se tocan?$t$
  from charcu.modules m, charcu.courses c
 where l.module_id = m.id and m.course_id = c.id
   and c.slug = $t$chorizos-picantes-jalapeno-queso-cheddar$t$
   and m.position = 1 and l.position = 0;

-- Paso a paso y Terminar -----------------------------------------------------
--
-- Paso a paso: siete lecciones de video, del Día 1 al embutido del Día 2.
-- Terminar: el ahumado (video), enfriar y empacar (lectura), cómo calentarlo,
-- los consejos y la foto final (Cristian, 2026-11-09).
--
-- Las lecciones que ya existían se MUEVEN (module_id + posición), no se
-- recrean, para que conserven su id y el progreso de quien las vio. Hay
-- `unique (module_id, position)`, así que el orden importa: primero se corre
-- lo que ya está en Terminar, después se mueve lo que viene de Paso a paso, y
-- al final se crea lo que falta y se escriben los textos.
--
-- Funciona desde dos puntos de partida: una base con solo la 0034 (ahumado en
-- Paso a paso, posición 3, «Reposo y cocción») y QA, donde ya estuvo una
-- versión anterior de esta migración. Volver a aplicarla da el mismo resultado.
--
-- Videos: los definitivos de este curso (Cristian, 2026-11-09).
-- «Así tiene que quedar» pasa de foto a video: el mismo de la bienvenida.
--
-- Los pasos van en líneas `- ` seguidas: `LessonText` los pinta como viñetas,
-- un ítem por cosa que se hace en el video, sin número.

-- 1. Lo que ya está en Terminar baja tres puestos, buscado por su título.
update charcu.lessons l
   set position = case l.title
                    when $t$Cómo cocinarlo y servirlo$t$ then 3
                    when $t$Lo que dice el charcutero$t$ then 4
                    when $t$Así tiene que quedar$t$      then 5
                  end
  from charcu.modules m, charcu.courses c
 where l.module_id = m.id and m.course_id = c.id
   and c.slug = $t$chorizos-picantes-jalapeno-queso-cheddar$t$
   and m.position = 3
   and l.title in ($t$Cómo cocinarlo y servirlo$t$, $t$Lo que dice el charcutero$t$, $t$Así tiene que quedar$t$)
   and l.position < 3;

-- 2. De Paso a paso a Terminar: el ahumado (video) y, si existen, enfriar y
--    empacar, que pasan a ser lecturas.
update charcu.lessons l
   set module_id      = t.id,
       position       = case when l.bunny_video_id = $t$9767cee6-0bf7-451a-a3c5-1e6925b8eb9b$t$
                              and l.title in ($t$Reposo y cocción$t$, $t$Ahumado y cocción$t$) then 0
                             when l.title = $t$Enfriar y colgar toda la noche$t$ then 1
                             else 2
                        end
  from charcu.modules m, charcu.modules t, charcu.courses c
 where l.module_id = m.id and m.course_id = c.id and t.course_id = c.id
   and c.slug = $t$chorizos-picantes-jalapeno-queso-cheddar$t$
   and m.position = 2 and t.position = 3
   and (   (l.bunny_video_id = $t$9767cee6-0bf7-451a-a3c5-1e6925b8eb9b$t$
            and l.title in ($t$Reposo y cocción$t$, $t$Ahumado y cocción$t$))
        or l.title in ($t$Enfriar y colgar toda la noche$t$, $t$Empacar o disfrutar$t$));

-- 3. Los módulos.
update charcu.modules m
   set summary = case m.position
                   when 2 then $t$Día 1 la carne y la liga, Día 2 los quesos, la tripa y el embutido.$t$
                   else $t$Ahumar, enfriar, guardar y servir.$t$
                 end
  from charcu.courses c
 where m.course_id = c.id
   and c.slug = $t$chorizos-picantes-jalapeno-queso-cheddar$t$
   and m.position in (2, 3);

-- 4. Las lecciones de los dos módulos: se crean las que faltan y se escriben
--    todas. La foto final (Terminar, 5) solo cambia resumen y pregunta, más
--    abajo.
create temp table lecciones_0058
  (modulo int, pos int, kind text, title text, summary text, body text, video text, ask text)
  on commit drop;

insert into lecciones_0058 values
  (2, 0, 'video', $t$Las dos texturas de carne$t$, $t$Día 1 — 1400 g picada a cuchillo y 600 g molida fina.$t$,
   $t$- Pica 1400 g de carne de cerdo a cuchillo y muele finos los 600 g restantes. Todo muy frío.
- Junta las dos texturas de carne en un bol.$t$,
   $t$bfb48972-95e0-45a7-bf4f-c8189e57e595$t$, null),
  (2, 1, 'video', $t$Condimentos, liga y reposo$t$, $t$Día 1 — Solo carne, condimentos y agua, amasados hasta la liga.$t$,
   $t$- Agrega la sal, el Cure #1, el ajo en polvo, la pimienta negra, el coriandro molido, la nuez moscada, la paprika dulce, el azúcar y los 100 ml de agua helada.
- Amasa hasta desarrollar la liga: la masa tiene que quedar pegajosa y cohesiva, agarrándose a la mano. Aquí no se escatima.
- Cubre y refrigera durante 8 horas.$t$,
   $t$5c56ade5-3964-4531-83ce-5629201787e1$t$, null),
  (2, 2, 'video', $t$Picar el jalapeño y los quesos$t$, $t$Día 2 — El jalapeño seco y los dos quesos en cubos iguales.$t$,
   $t$- Corta los 140 g de jalapeño encurtido en trozos no tan pequeños, sécalos con una toalla de cocina y resérvalos. Si tienes jalapeño fresco, sin encurtir, mucho mejor.
- Corta los 140 g de queso cheddar, congelado, en cubos de 5–7 mm.
- Corta los 140 g de mozzarella en cubos del mismo tamaño, de 5–7 mm.$t$,
   $t$0d7b136a-e70e-4bce-805b-ecf414cf0ec1$t$, null),
  (2, 3, 'video', $t$Mezclar los quesos y el jalapeño con la carne$t$, $t$Día 2 — Con la masa muy fría y la mano suave.$t$,
   $t$- Saca la masa y trabájala muy fría. Si se ha templado, métela un rato al congelador antes de seguir.
- Añade a la masa el jalapeño, el cheddar y la mozzarella.
- Mezcla suavemente, solo hasta repartir: los cubos de queso y el jalapeño tienen que llegar enteros, sin romperse.$t$,
   $t$58b7c37f-ca18-4b8c-9ae4-d8bd2d96d58c$t$, null),
  (2, 4, 'video', $t$Lavar la tripa, hidratarla y preparar la máquina$t$, $t$Día 2 — Tripa limpia y flexible, embutidora lista y sin aire.$t$,
   $t$- Lava la tripa por dentro y por fuera con agua, para quitarle la sal.
- Hidrátala en agua tibia hasta que quede suave y flexible.
- Prepara la embutidora limpia y fría, y carga la masa apretándola para no dejar bolsas de aire.$t$,
   $t$38a5bcea-73c8-4dc1-a49b-baa4268b9739$t$, null),
  (2, 5, 'video', $t$Embutir$t$, $t$Día 2 — Ritmo parejo y la tripa sin sobrellenar.$t$,
   $t$- Coloca la tripa en el embudo de la embutidora.
- Embute a ritmo parejo, sin sobrellenar la tripa. Deja margen: el queso fundido y el vapor van a empujar desde dentro.$t$,
   $t$c2158f37-1958-4134-b2ed-ad581111f22e$t$, null),
  (2, 6, 'video', $t$Dobleces, sacar el aire y colgar$t$, $t$Día 2 — Formar los chorizos, pinchar el aire y a la nevera.$t$,
   $t$- Haz los dobleces que marcan cada chorizo, para después amarrarlos.
- Con una punta o un punzón, pincha los chorizos donde veas aire atrapado. El aire es el peor enemigo de los embutidos.
- Cuelga los chorizos en la nevera hasta el día siguiente, para que la tripa se seque y se pegue al chorizo.$t$,
   $t$29529342-ee52-4d2f-84e3-0b704407d4fb$t$, null),
  (3, 0, 'video', $t$Ahumado y cocción$t$, $t$Día 3 — Calor progresivo, sin golpes, hasta 72 °C en el centro.$t$,
   $t$- Ahúma y cocina de forma progresiva, subiendo la temperatura por escalones y evitando temperaturas excesivamente altas.
- Controla la temperatura interna con una sonda en el centro del chorizo más grueso.
- Sigue la cocción hasta 72 °C internos, parejos en toda la pieza.$t$,
   $t$3d9314dd-b5b4-41e0-bc20-8563c5961409$t$,
   $t$Hice Chorizos Picantes de Jalapeño, Cheddar y Mozzarella (ahumado progresivo, sin golpes de calor). ¿Cómo sé que está bien por dentro sin que me quede seco?$t$),
  (3, 1, 'texto', $t$Enfriar y colgar toda la noche$t$, $t$Día 3 — Agua con hielo, y una noche en la nevera para el color.$t$,
   $t$- Enfría los chorizos rápido en agua con hielo, en cuanto salen del ahumador.
- Cuélgalos en la nevera toda la noche, para que se sequen y tomen un mejor color.$t$,
   null, null),
  (3, 2, 'texto', $t$Empacar o disfrutar$t$, $t$Día 4 — Listos para guardar o para la mesa.$t$,
   $t$- Al día siguiente, empácalos para guardarlos.
- O disfrútalos de una vez.$t$,
   null, null),
  (3, 3, 'texto', $t$Cómo calentarlo y servirlo$t$, $t$Ya está cocido: solo hay que calentarlo, sin reventar el queso.$t$,
   $t$El chorizo sale del ahumador cocido. Para comerlo no hay que volver a cocinarlo: basta con calentarlo y dorarlo, siempre a fuego medio.

A la parrilla
- Fuego medio, girándolo seguido, hasta que dore por fuera y esté caliente por dentro.
- Nunca a fuego fuerte: el queso funde de golpe, empuja y revienta la tripa.

A la sartén
- Entero, a fuego medio-bajo con una gota de aceite, girándolo hasta dorar parejo.
- En tajadas gruesas, un minuto por lado: el queso se tuesta en el corte.

Al horno o en freidora de aire
- A temperatura media, hasta que esté caliente en el centro y la tripa brille.

Empacado al vacío
- Caliéntalo dentro de la bolsa, en agua caliente que no hierva, y dóralo después en sartén o parrilla.

Para no perder el queso
- No lo pinches mientras se calienta: por el agujero se escapan el jugo y el queso.
- Déjalo reposar un minuto antes de cortarlo, para que el queso se asiente.

Cómo servirlo
- En pan, como perro caliente, con cebolla y pico de gallo.
- En tajadas, en una tabla con otros embutidos.
- Picado, en tacos o arepas.$t$,
   null, null),
  (3, 4, 'texto', $t$Lo que dice el charcutero$t$, $t$Meter queso en una tripa es un problema de presión, no de sabor.$t$,
   $t$El jalapeño, seco de verdad
Escúrrelo y sécalo con una toalla de cocina hasta que no suelte nada. El líquido del encurtido se convierte en vapor dentro de la tripa, y ese vapor es presión.

No sobrellenes la tripa
Es el error que revienta estos chorizos. El queso funde y ocupa más, el agua se evapora y no tiene a dónde ir. Embute con margen.

El aire, fuera
Las bolsas de aire se llenan de agua y grasa y abren huecos en la tajada. Pínchalas con el punzón antes de colgar.

Calor progresivo, nunca de golpe
Con una temperatura alta desde el principio, el queso funde antes de que la masa cuaje y la tripa cede por el punto más lleno. Sube por escalones.

Los quesos y el jalapeño, el Día 2
El amasado del Día 1 es solo carne, condimentos y agua. Si metes las inclusiones ahí, se deshacen y engrasan la masa.

Para no fallar
- Seca bien el jalapeño antes de incorporarlo.
- Mantén la masa muy fría el Día 1 y el Día 2.
- Embute sin sobrellenar, pincha el aire y cuelga los chorizos en la nevera hasta el día siguiente.
- Sube la temperatura por escalones y mide con sonda hasta 72 °C internos.$t$,
   null, null);

insert into charcu.lessons
  (module_id, kind, title, summary, position, body, poster_url, bunny_video_id, file_url, ask)
select m.id, p.kind, p.title, p.summary, p.pos, p.body,
       case when p.kind = 'video' then $t$/recipes/chorizos-picantes-jalapeno-queso-cheddar.jpg$t$ end,
       p.video, null, p.ask
  from charcu.modules m
  join charcu.courses c on c.id = m.course_id
  join lecciones_0058 p on p.modulo = m.position
 where c.slug = $t$chorizos-picantes-jalapeno-queso-cheddar$t$
   and not exists (select 1 from charcu.lessons x where x.module_id = m.id and x.position = p.pos);

update charcu.lessons l
   set kind           = p.kind,
       title          = p.title,
       summary        = p.summary,
       body           = p.body,
       bunny_video_id = p.video,
       poster_url     = case when p.kind = 'video' then $t$/recipes/chorizos-picantes-jalapeno-queso-cheddar.jpg$t$ end,
       ask            = p.ask
  from charcu.modules m, charcu.courses c, lecciones_0058 p
 where l.module_id = m.id and m.course_id = c.id
   and c.slug = $t$chorizos-picantes-jalapeno-queso-cheddar$t$
   and m.position = p.modulo and l.position = p.pos;

-- 5. El final: deja de ser la foto y pasa a ser video, el mismo de la
--    bienvenida. `file_url` se queda: es la foto, y sirve si se vuelve atrás.
update charcu.lessons l
   set kind           = 'video',
       bunny_video_id = $t$44f06715-af6d-4a06-844f-43f228a6723f$t$,
       poster_url     = $t$/recipes/chorizos-picantes-jalapeno-queso-cheddar.jpg$t$,
       title   = $t$Así tiene que quedar$t$,
       summary = $t$Grano grueso, jugoso y picante, con los quesos fundidos y el jalapeño a la vista en cada tajada.$t$,
       ask     = $t$Te voy a mandar una foto de mi Chorizos Picantes de Jalapeño, Cheddar y Mozzarella (tripa natural de cerdo, cal. 32–38 mm) para que me digas si va bien, qué le falta y cuánto aguanta una vez esté.$t$
  from charcu.modules m, charcu.courses c
 where l.module_id = m.id and m.course_id = c.id
   and c.slug = $t$chorizos-picantes-jalapeno-queso-cheddar$t$
   and m.position = 3 and l.position = 5;
