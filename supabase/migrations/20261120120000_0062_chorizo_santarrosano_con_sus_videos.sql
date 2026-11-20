-- ============================================================================
-- 0062 · CHORIZO SANTARROSANO: SUS VIDEOS DE VERDAD Y SU ESTRENO (2026-11-20)
--
-- El curso se grabó completo: 7 videos, 13:29, biblioteca 733344 de Bunny. Con
-- ellos el curso pasa de `lista-de-espera` a `publicado` — es el primer estreno
-- del calendario de la 0059 (prometido para el 18 de noviembre).
--
-- El guion de grabación, con el resumen de cada video y de dónde sale cada
-- texto, está en `docs/guion-chorizo-santarrosano.md`.
--
-- Lo que cambia, y por qué:
--
--   · 9 lecciones → 11. La 0034 sacó el curso de la receta en automático y metía
--     "Mezclar y embutir" en un solo video. Ahora hay un video por técnica, como
--     en el curso de jalapeño (0058): picar, condimentar, amasar, embutir,
--     amarrar.
--   · Las lecciones que ya existían se MUEVEN y se reescriben, no se recrean,
--     para que conserven su `id` y el progreso de quien las abrió. Se buscan por
--     título —el viejo o el nuevo—, así que volver a aplicar la migración da el
--     mismo resultado.
--   · La RECETA del recetario cambia de verdad, no de forma. Al grabar salieron
--     cinco cosas que la receta publicada decía mal:
--       - Los 5 pasos ya no son ciertos: el reposo largo (18–24 h) va ANTES de
--         embutir, no después, y el secado son 2–3 h al sol de la tarde, no una
--         noche a temperatura ambiente.
--       - Es picado A CUCHILLO, y eso no aparecía en ninguna parte.
--       - El corte es PIERNA (con bondiola no se puede calcular el 70–30).
--       - La sal baja de 18 g a 15 g: contando la que trae la sal de cura, 18 g
--         dejaban el chorizo en 1,99% de sal y salía salado (Cristian lo probó).
--       - La sal de cura baja de 2,5 g a 2 g (0,2% = 125 ppm), que es lo que se
--         dice en cámara.
--   · El amarre es por torsión: no lleva hilo. Sí lleva un chuzo para el aire.
--
-- Los textos de las lecciones NO son markdown: se pintan tal cual, con sus
-- saltos de línea. Solo se entienden `**negrita**`, las líneas seguidas que
-- empiezan por `- ` (lista) y las tablas con `|` y su fila de `---`.
-- ============================================================================

-- ----------------------------------------------------------------------------
-- 1. Los videos de Bunny (biblioteca 733344)
-- ----------------------------------------------------------------------------

create temp table videos_0062 (clave text primary key, video_id text not null)
  on commit drop;

-- Comprobados uno por uno en el panel de Bunny el 2026-11-20, por título y
-- duración. El número del archivo (`0.1`, `0.2`…) cambió mientras subían, así
-- que lo que manda es el título, no el número.
insert into videos_0062 values
  -- 0.1 Esto es lo que vas a lograr.mp4 · 0:10
  ('bienvenida',  $t$d4c4a9b3-85f6-43ff-88c6-e60db8272e58$t$),
  -- 0.2 Pesar y picar la carne y el tocino.mp4 · 2:15
  ('picar',       $t$cd361bd1-acec-43c4-9273-80225c511b21$t$),
  -- 0.3 Condimentos, preparar ajo y cebolla.mp4 · 1:25
  ('condimentos', $t$63abbfbd-be99-4a1d-9326-cd2417003cf9$t$),
  -- 0.4 Pesar los ingredientes, amasar y reposar.mp4 · 1:54
  ('amasar',      $t$e2b180bc-d039-424e-aaf9-826aceffe6fa$t$),
  -- 0.5 Tripa y embutido.mp4 · 4:42
  ('embutir',     $t$1458ecde-5c9f-4b26-8b17-184e9e7f754e$t$),
  -- 0.6 Amarrar, secar al aire y una noche en la nevera.mp4 · 2:50
  ('amarrar',     $t$b74fb584-8bee-4d5e-bec9-001ed5f2c0b5$t$),
  -- 0.7 A la parrilla- asar y disfrutar.mp4 · 0:11
  ('parrilla',    $t$b655d856-2db7-47df-afab-dabbbb3905bc$t$);

-- ----------------------------------------------------------------------------
-- 2. El curso: se publica y se le arregla el resumen
-- ----------------------------------------------------------------------------

update charcu.courses
   set status  = 'publicado',
       summary = $t$El chorizo más tradicional de Santa Rosa de Cabal: pierna de cerdo y tocino picados a cuchillo, en proporción 70–30. Tres días de trabajo repartido y, al tercero, a la parrilla.$t$,
       updated_at = now()
 where slug = $t$chorizo-santarrosano$t$;

-- ----------------------------------------------------------------------------
-- 3. Los módulos
-- ----------------------------------------------------------------------------

update charcu.modules m
   set summary = case m.position
                   when 0 then $t$Lo que vas a lograr, y en cuánto tiempo.$t$
                   when 1 then $t$Qué lleva, en qué proporción y por qué.$t$
                   when 2 then $t$Día 1 la carne y el reposo; día 2 el embutido y el sol.$t$
                   else        $t$Asarlo, servirlo y saber que quedó bien.$t$
                 end
  from charcu.courses c
 where m.course_id = c.id
   and c.slug = $t$chorizo-santarrosano$t$;

-- ----------------------------------------------------------------------------
-- 4. Las 11 lecciones
--
-- `titulo_viejo` es el título que tenía la lección en la 0034, para encontrarla
-- y moverla en vez de crear una nueva. Las que no lo traen son nuevas.
-- ----------------------------------------------------------------------------

create temp table lecciones_0062 (
  modulo       int  not null,
  pos          int  not null,
  kind         text not null,
  title        text not null,
  titulo_viejo text,
  summary      text not null,
  body         text,
  video        text,
  poster_url   text,
  file_url     text,
  ask          text
) on commit drop;

insert into lecciones_0062
  (modulo, pos, kind, title, titulo_viejo, summary, body, video, poster_url, file_url, ask)
values

-- Módulo 0 · Bienvenida ------------------------------------------------------

(0, 0, 'video', $t$Esto es lo que vas a lograr$t$, $t$Esto es lo que vas a lograr$t$,
 $t$El chorizo tradicional de Santa Rosa de Cabal, picado a cuchillo y a la parrilla al tercer día.$t$,
 $t$**El chorizo de Santa Rosa de Cabal**

Santa Rosa de Cabal, en Risaralda, es un pueblo al que la gente llega por los termales y del que se va hablando del chorizo. No es una receta complicada —carne, tocino y las especias justas— y ahí está la gracia: todo lo que la hace buena es oficio, no ingredientes raros.

**Qué vas a lograr**

Un chorizo fresco, de grano grueso, con la grasa en puntos y no untada. Al corte se le ve la carne; en la parrilla suelta jugo y no se desarma. Nada que ver con el chorizo de supermercado, que es pasta pareja: ahí hay agua, almidón y relleno.

El secreto no está en el condimento. Está en dos cosas: que la carne y el tocino se piquen **a cuchillo** —no molidos— y que todo se mantenga frío de principio a fin. Eso es lo que vas a aprender a hacer con las manos.

**Cuánto tiempo te va a tomar**

- **Día 1** — Picas, condimentas, mezclas y la masa duerme 18–24 h en la nevera. Hora y media de trabajo, y ya está.
- **Día 2** — Embutes, amarras y los cuelgas 2 o 3 horas al sol de la tarde; de ahí a la nevera, a dormir toda la noche.
- **Día 3** — A la parrilla.

Son tres días, pero de trabajo real hay dos ratos. El resto lo hace el tiempo.

**Qué necesitas tener antes de empezar**

- Un buen cuchillo y una tabla. Es la herramienta principal de este curso.
- Gramera de 0,1 g — por los 2 g de sal de cura, que no se calculan a ojo.
- Pistola de embutir, o una boquilla o un embudo.
- Tripa natural de cerdo. **Hilo no hace falta**: aquí se amarra girando la tripa.
- Un chuzo o una aguja fina, para sacarle el aire.
- Espacio en la nevera, y un sitio donde colgarlos al sol una tarde.

Si te falta algo, consíguelo ahora. A mitad de camino no se puede parar: la masa ya está condimentada y el reloj corre.

«La tradición no necesita complicarse: carne, tocino y las especias justas.»$t$,
 (select video_id from videos_0062 where clave = 'bienvenida'),
 $t$/recipes/chorizo-santarrosano.jpg$t$, null,
 $t$La receta de Chorizo Santarrosano está para 1 kg. Mi carne pesa otra cosa. ¿Cómo reescalo todos los ingredientes sin equivocarme, sobre todo las sales?$t$),

-- Módulo 1 · Antes de empezar ------------------------------------------------

(1, 0, 'texto', $t$Ingredientes y proporción$t$, $t$Ingredientes y proporción$t$,
 $t$700 g de pierna y 300 g de tocino, los dos picados a cuchillo.$t$,
 $t$**Carne**
- Pierna de cerdo, picada a cuchillo: 700 g (70%)
- Tocino, picado a cuchillo: 300 g (30%)

**Condimentos**
- Sal: 15 g (1,5%)
- Sal de cura #1 (Prague Powder #1): 2 g (0,2%)
- Ajo fresco, picado: 18 g (1,8%) — unos 4 o 5 dientes
- Cebolla larga picada, mitad blanco y mitad verde: 25 g (2,5%)
- Pimienta negra molida: 2 g (0,2%)
- Comino molido: 2 g (0,2%)
- Paprika dulce: 2 g (0,2%)

**Por qué pierna y no otra cosa**

Pierna de cerdo, limpia. Es el corte que te deja controlar la proporción, porque llega casi sin grasa propia: tú decides cuánta grasa entra y la pones tú con el tocino. Si usas bondiola, cabeza de lomo o papada, la pieza ya trae su propia grasa repartida por dentro y el 70–30 deja de ser real — terminas con 50–50 sin saberlo, y ese chorizo se desarma en la parrilla.

**70% carne y 30% tocino**

Es el balance santarrosano: suficiente grasa para que quede jugoso sin perder firmeza en la parrilla. Pero la jugosidad no la da solo la cantidad de tocino: la da la forma de cortarlo. Los dos van **picados a cuchillo**, nunca molidos.

**Cómo escalar la receta**

El porcentaje junto a cada ingrediente es su peso sobre el total de carne y grasa. Domínalo y escalas a cualquier cantidad: por cada kilo de carne y tocino, sal 15 g, sal de cura 2 g, ajo 18 g, cebolla larga 25 g, y 2 g de cada especia.

**Sobre las dos sales**

Son dos cosas distintas y se pesan aparte. La sal de cura #1 lleva nitrito: 2 g por kilo son 125 ppm de entrada, y es lo que cubre las horas que el chorizo pasa fuera del frío —las 18–24 h de masa condimentada y las horas colgado al sol—, además de darle el color y el sabor curado. Si tu sal de cura tiene otra concentración de nitrito, la dosis no es la misma.

Y ojo con una cuenta que casi nadie hace: la sal de cura es 93,75% sal común, así que esos 2 g meten 1,9 g de sal más. Con los 15 g de sal, el chorizo queda en 1,69% de sal total. Por eso no van 18 g: con 18 se va a casi el 2% y sale salado.$t$,
 null, null, null,
 $t$Chorizo Santarrosano lleva Sal de cura #1. ¿Cuánta va exactamente para la carne que tengo, qué pasa si me paso, y se puede hacer sin ella?$t$),

-- Módulo 2 · Paso a paso -----------------------------------------------------

(2, 0, 'video', $t$Pesar y picar la carne y el tocino$t$, null,
 $t$Día 1 — 700 g de pierna y 300 g de tocino, picados a cuchillo y muy fríos.$t$,
 $t$- Pesa 700 g de pierna de cerdo y 300 g de tocino, con las piezas enteras.
- Guarda el tocino en el congelador mientras picas la carne.
- Corta la carne en láminas finas, luego en cuadritos de 1 cm, y repásalos con el cuchillo como si los trituraras.
- Quítale la piel al tocino y pícalo en cubos lo más pequeños posible.

**El picado a cuchillo es la receta**

Un santarrosano no se muele. Se pica. Y no es nostalgia: el cuchillo **corta** la grasa, mientras el molino y el procesador la **aplastan**. Al aplastarla, la célula de grasa se rompe, suelta el aceite y ese aceite se unta en la carne. Un chorizo untado se ve pálido y pastoso al corte, y en la parrilla la grasa se va al carbón en vez de quedarse adentro. Por eso aquí la jugosidad no la da la cantidad de tocino: la da la forma en que lo cortaste.

**Los dos cortes, y por qué son distintos**

- **Carne:** láminas finas, cuadritos de más o menos 1 cm, y encima un repaso con el cuchillo. No busques un grano perfecto: busca trozos de varios tamaños. Ese desorden es la mordida del santarrosano.
- **Tocino:** quítale la piel primero —con piel no hay forma de cortarlo parejo— y sácalo en cubos **más pequeños que la carne**, para que la grasa se reparta por todo el chorizo en vez de aparecer en pedazos.
- Vuelve sobre los trozos grandes que quedaron. Se pica hasta que la consistencia sea la que tú quieres.

**El frío es la mitad del trabajo**

El tocino va a la nevera —mejor al congelador— mientras picas la carne. La carne, medio congelada. No es solo por seguridad: la grasa fría se corta limpia y los cubos salen parejos; la grasa tibia se pega al cuchillo, se embadurna y se acabó. Si en cualquier momento ves que el tocino empieza a brillar o a ponerse blando, pára y devuélvelo al congelador 15 minutos. Ese parón no te cuesta nada; el lote untado sí.

**Trucos del charcu**

- **Pide la pierna entera y límpiala tú.** Si pides "carne para chorizo" te dan recortes con grasa que no puedes pesar.
- **Medio congelada, no congelada.** El cuchillo tiene que entrar con resistencia, pero entrar.
- **Pesa antes de picar, nunca después.** Picado, el volumen engaña y siempre se pierde algo en la tabla.
- **El cuchillo, no el procesador.** Ni un pulso rápido. Es el único paso del curso sin atajo, y es el que se ve al corte.
- **Dos tamaños, no uno.** El tocino más fino que la carne.$t$,
 (select video_id from videos_0062 where clave = 'picar'),
 $t$/recipes/chorizo-santarrosano.jpg$t$, null,
 $t$Estoy picando a cuchillo mi Chorizo Santarrosano y el tocino se me está untando. ¿Lo salvo o lo vuelvo a empezar?$t$),

(2, 1, 'video', $t$Condimentos, preparar ajo y cebolla$t$, null,
 $t$Día 1 — La cebolla larga mitad blanco y mitad verde, y el ajo picado y pesado.$t$,
 $t$- Quítale la puntica seca a la cebolla larga y separa mitad de lo blanco y mitad de lo verde.
- Ábrela a lo largo, pártela y termina con el corte múltiple, hasta que quede bien fina.
- Pela 4 o 5 dientes de ajo y pícalos finos, a cuchillo o con un picador.
- Pesa el ajo y la cebolla ya picados, contra el porcentaje de la receta.

**Siete cosas, dos de ellas frescas**

El condimento del santarrosano es corto: sal, sal de cura, pimienta negra, comino, paprika dulce, ajo y cebolla larga. Las cinco primeras se pesan y se van al bol tal como están. Las dos últimas son frescas, y por eso hay que prepararlas antes de pesarlas.

Que sean frescas no es un detalle. Un ajo en polvo daría un sabor más plano y el chorizo duraría más; el ajo y la cebolla de verdad son los que hacen que este sepa como el de Santa Rosa, y también la razón por la que este chorizo se come o se congela pronto.

**La cebolla larga, mitad blanco y mitad verde**

Cebolla larga —de rama o junca; en otros países, la parte verde del cebollín—. Usa **la mitad de lo blanco y la mitad de lo verde**. No es por aprovechar: son dos sabores distintos. Lo blanco aporta el dulce y el cuerpo; lo verde, el aroma fresco y herbal. Solo con lo blanco el chorizo queda dulzón y chato; solo con lo verde, aguado.

Tiene que quedar **fina de verdad**: la cebolla larga es agua, y un trozo grande deja una bolsa de humedad dentro del chorizo, que es donde empieza un reventón o una mancha gris.

**El ajo: pelado, picado, y pesado después**

Cuatro o cinco dientes, según el tamaño. Y aquí está lo importante: **los dientes no son una medida**. Un diente puede pesar 3 g o 7 g. Por eso se pica primero y se pesa después. Si te sobra, guárdalo; si te falta, pela otro.

**Trucos del charcu**

- **El picador de ajo te ahorra el paso más aburrido.** Lo que no sirve es la licuadora: hace puré, y el puré de ajo amarga.
- **Pica, luego pesa.** Vale para los dos frescos.
- **Mitad y mitad, de verdad.** Haz los dos montones aparte antes de picar; si picas todo junto, siempre gana lo verde.
- **Fina es fina.** Si puedes agarrar un trozo de cebolla con los dedos, vuelve a picar.
- **La cura se pesa aparte y de último**, en su propio recipiente y con la gramera en cero.$t$,
 (select video_id from videos_0062 where clave = 'condimentos'),
 $t$/recipes/chorizo-santarrosano.jpg$t$, null,
 $t$¿Cuánto ajo fresco y cuánta cebolla larga van para la carne que tengo, y los puedo cambiar por ajo en polvo?$t$),

(2, 2, 'video', $t$Pesar los ingredientes, amasar y reposar$t$, $t$Mezclar y embutir$t$,
 $t$Día 1 — Primero la grasa, después el condimento, y 18–24 h en la nevera.$t$,
 $t$- Junta la carne picada y el tocino en un recipiente y revuelve hasta repartir la grasa.
- Pesa y echa los condimentos: pimienta 2 g, paprika 2 g, comino 2 g, sal de cura 2 g, ajo 18 g, cebolla larga 25 g y sal 15 g.
- Revuelve con una cuchara hasta integrar todo.
- Tapa con papel film, bien sellado, y reposa 18 a 24 horas en la nevera.

**Primero la grasa, después el condimento**

La carne y el tocino se juntan y se revuelven **antes** de echar nada más. Parece un detalle de orden y no lo es: lo que buscas es que la grasa quede repartida por todo, y eso se consigue mejor cuando todavía no hay sal ni especias de por medio. Si echas todo junto de una vez, siempre quedan zonas con más tocino que otras — y ese chorizo sale desigual: unos jugosos y otros secos del mismo lote.

La regla para saber si vas bien: **en cualquier parte de la masa tiene que haber grasa, cebolla y ajo**. No es una masa uniforme, es una masa parejamente desigual.

**Se revuelve, no se amasa**

Aquí la cuchara es mejor que la mano, y a propósito. Este chorizo lleva la carne picada a cuchillo, y lo que le da el carácter es ese grano: si lo amasas con fuerza como se amasa un embutido cocido, el grano se deshace, la grasa se unta con el calor de las manos y pierdes lo que ganaste picando. Revuelve lo justo para integrar y párate ahí.

**El reposo en frío: dónde empieza el sabor**

Tapa el recipiente con papel film, bien sellado y pegado a la masa, y mételo a la nevera de **18 a 24 horas** antes de embutir. En ese tiempo pasan tres cosas: la sal penetra y deja de estar solo por fuera de los trozos; la sal de cura empieza a hacer su trabajo de color y de seguridad; y el ajo, la cebolla y las especias dejan de ser ingredientes sueltos y se vuelven un sabor solo.

Un chorizo embutido de inmediato sabe a carne con especias encima. Este sabe a chorizo.

**Trucos del charcu**

- **La grasa primero, sola.** Es el único momento en que puedes arreglar un reparto desigual.
- **La cuchara, no los puños.** Si la masa se ve brillante o pastosa, ya te pasaste.
- **Prueba de los dos puñados.** Saca uno de arriba y otro del fondo: si se ven iguales, listo.
- **Film pegado a la masa, no al borde.** Menos aire encima, menos capa gris al día siguiente.
- **Pesa sobre el bol, en cero**, antes de cada condimento. Menos el de la sal de cura, que va aparte.
- **La bolita de prueba.** Antes de tapar, fríe una cucharadita y pruébala: es el último momento para corregir la sal.$t$,
 (select video_id from videos_0062 where clave = 'amasar'),
 $t$/recipes/chorizo-santarrosano.jpg$t$, null,
 $t$Mezclé mi Chorizo Santarrosano y lo tengo reposando. ¿Cuánto puede esperar en la nevera antes de embutir y cómo sé si todavía está bien?$t$),

(2, 3, 'video', $t$Tripa y embutido$t$, null,
 $t$Día 2 — Lavar la tripa por dentro, enhebrarla y embutir sin apretar.$t$,
 $t$- Lava la tripa con agua tibia y un poco de vinagre, y pásale agua por dentro hasta que salga por la otra punta.
- Enhébrala en la boquilla sosteniéndola en alto.
- Carga la masa con una cuchara, en bolitas, empujando cada una para no dejar aire.
- Cierra el embutidor dejando sobrar tripa en la punta, y no la amarres todavía.
- Embute dejando correr la tripa, sin apretar, y deja ventaja de tripa al final.

**La tripa viene salada: hay que lavarla, no solo mojarla**

La tripa natural se vende en madeja, enterrada en sal — es así como se conserva. Si la embutes tal cual, ese exceso de sal se suma a la que ya pesaste.

Se lava con **agua tibia y un chorrito de vinagre**. El agua tibia relaja la tripa y la hace elástica, que es lo que evita que se rompa después; el vinagre le quita el olor. Y hay que lavarla **por dentro**: se le mete agua por una punta y se deja correr por todo el tubo. Mojarla por fuera no sirve de nada, porque la sal está adentro.

**Enhebrarla: el truco es la altura**

Recoge la punta y métela en la boquilla —de la pistola, de un embudo o de una botella cortada— **sosteniendo la tripa en alto**. Colgando se desliza sola y entra; apoyada en la mesa se dobla y se pega. Es el único truco que hay, y cambia el paso de imposible a fácil.

**Cargar la masa: bolitas y presión, no puñados**

Con una cuchara, de poco en poco, haciendo bolitas y empujando cada una. Así la masa entra sin arrastrar aire. Si la tiras a puñados, entre puñado y puñado queda una bolsa de aire que después es una cueva dentro del chorizo — y una cueva es masa que falta, sal que no llegó y oxígeno donde no debe haberlo. Un kilo da para tres cargas de la pistola; cargada a tope cuesta el doble empujarla.

**No hagas el nudo todavía**

La primera parte del embutidor tiene aire, y ese aire tiene que salir por algún lado. Si amarras la punta antes de empezar, el aire se queda adentro y te hace la primera burbuja. Déjala abierta, empuja hasta que veas aparecer la masa, y ahí sigue tranquilo.

**El ritmo: la tripa se deja correr, no se estira**

La tripa va montada en la boquilla y hay que **irla soltando** al ritmo que entra la masa, con la mano acompañando. El punto es un chorizo **ni apretado ni suelto**. Apretado se revienta —al amarrar, al colgar o en la parrilla— y además no te deja girar la tripa para hacer los nudos. Suelto queda flojo y deforme.

**Trucos del charcu**

- **Agua tibia y un chorrito de vinagre.** Tibia, no caliente: el agua caliente cuece la tripa y la vuelve quebradiza.
- **Lávala por dentro, no por fuera.** La sal está adentro.
- **Mantén la tripa en alto para enhebrarla.**
- **Bolitas con la cuchara, no puñados.** Las cuevas de aire se evitan aquí, no se arreglan después.
- **Tres cargas por kilo, no más.**
- **No amarres la punta hasta que salga la masa.**
- **Ventaja de tripa en las dos puntas**, para mover, amarrar y cortar.
- **Si dudas, más suelto que apretado.** Lo flojo se arregla al amarrar; lo apretado se revienta.$t$,
 (select video_id from videos_0062 where clave = 'embutir'),
 $t$/recipes/chorizo-santarrosano.jpg$t$, null,
 $t$Se me revienta la tripa al embutir mi Chorizo Santarrosano, ¿qué estoy haciendo mal?$t$),

(2, 4, 'video', $t$Amarrar, secar al sol y una noche en la nevera$t$, $t$Secar y reposar$t$,
 $t$Día 2 — Amarrar girando, sacar el aire, 2–3 h de sol y a la nevera.$t$,
 $t$- Mide el largo que quieres y dale una vuelta completa a la tripa, siempre hacia el mismo lado.
- Ve corriendo la masa con los dedos antes de cada vuelta.
- Haz los chorizos de 80 a 100 g, todos del mismo tamaño.
- Repasa uno por uno y chuza donde veas aire.
- Cuélgalos 2 o 3 horas al sol de la tarde, y de ahí a la nevera toda la noche.

**El amarre más simple: girar, no anudar**

No hay nudos en este chorizo. Se mide el largo, se sujeta y se le da una vuelta completa a la tripa sobre sí misma. Eso sella, separa y aguanta. Dos reglas y sale solo:

- **Siempre hacia el mismo lado.** Si alternas el sentido, cada giro deshace el anterior y la ristra se abre sola al colgarla.
- **Ve corriendo la masa.** Antes de cada vuelta, mueve un poco la carne hacia donde te falta. Por eso se embutió sin apretar: esa holgura es la que te deja trabajar aquí.

**El tamaño: de 80 a 100 gramos**

Ese es el santarrosano, y no es capricho: a ese tamaño el chorizo se cocina parejo — se dora por fuera justo cuando el centro llega a su punto. Más grande, el exterior se quema antes de que el interior esté listo. Más pequeño, se seca. Un kilo da para unos diez u once.

**El aire: búscalo y sácalo**

Repasa uno por uno. Donde veas una burbuja, un chuzazo con una aguja fina o la punta de un cuchillo. No lo pinches al azar: solo donde hay aire.

Se hace por dos razones, y la segunda casi nadie la cuenta. La primera es que una bolsa de aire es masa que falta: ahí no llegó la sal, hay oxígeno y es por donde empieza a dañarse. La segunda es que **al sacar el aire la tripa se pega a la carne** — queda abrazada, y es esa unión la que da el chorizo firme y bien formado en vez de uno flojo con la piel suelta.

Míralos a contraluz antes de colgarlos: el aire se ve más fácil de lo que se busca con el dedo.

**Dos o tres horas de sol, no más**

Cuélgalos donde les llegue el **último sol de la tarde**, dos o tres horas. El sol de esa hora es suave: seca la superficie sin cocinar nada. Lo que buscas es que la tripa deje de estar húmeda y se forme esa piel ligeramente seca que después se dora bien en la parrilla.

No es sol del mediodía y no son seis horas. Con sol fuerte la grasa se calienta, empieza a ponerse rancia y el chorizo coge un sabor que no se quita. Si donde vives hace calor de verdad, cuélgalos a la sombra con brisa, o sáltate el paso y mándalos directo a la nevera: pierdes un poco de piel, no el lote.

**Y a dormir en la nevera**

Después del sol, toda la noche en frío. Ahí la sal de cura termina de dar el color, el sabor se asienta y la superficie se seca un poco más. Al día siguiente están listos para la parrilla.

**Si tienes ahumador: un oreo corto con leña (opcional)**

Después de las horas de sol, y antes de la noche en la nevera, puedes darle un oreo corto con humo frío. Le da color y un fondo ahumado que aguanta bien la parrilla.

Tres cosas que no cambian: va **después** del sol, nunca en vez de — el humo se agarra en la piel ya seca, y sobre tripa húmeda queda manchado y amargo. El humo **no reemplaza la sal de cura**: lo que cubre las horas fuera del frío es el nitrito. Y tiene que ser humo frío; si se calienta, estás cocinando el chorizo a medias.

Sin ahumador el santarrosano está completo. El humo de verdad lo pone el carbón cuando lo ases.

**Trucos del charcu**

- **Siempre hacia el mismo lado.** Alternar las vueltas es deshacer lo que acabas de hacer.
- **Ve corriendo la masa antes de cada vuelta.**
- **De 80 a 100 g cada uno.** Grande se quema por fuera, pequeño se seca.
- **Donde veas aire, chuzo.** Y a contraluz se encuentran todos en un minuto.
- **Sacar el aire pega la tripa a la carne**, y eso es lo que da el chorizo firme.
- **El último sol, no el del mediodía.**
- **Si hace calor, a la sombra o directo a la nevera.**
- **Pinchar es aquí, no en la parrilla.** En el fuego, jamás: ahí se va el jugo.$t$,
 (select video_id from videos_0062 where clave = 'amarrar'),
 $t$/recipes/chorizo-santarrosano.jpg$t$, null,
 $t$Mis Chorizos Santarrosanos están colgados al sol. ¿Cómo sé cuándo ya es suficiente y cuándo me pasé?$t$),

-- Módulo 3 · Terminar --------------------------------------------------------

(3, 0, 'video', $t$A la parrilla: asar y disfrutar$t$, $t$A la parrilla$t$,
 $t$Día 3 — Fuego medio, girando, y a la mesa.$t$,
 $t$Al tercer día ya están. Fuego medio, girando con frecuencia, y a la mesa.

Lo único que no se hace nunca: pincharlos en la parrilla. El aire se sacó al amarrar; en el fuego, un pinchazo es jugo que se va al carbón.

Cómo saber que está en su punto, y cómo guardarlos si te sobran, está en la lección siguiente.$t$,
 (select video_id from videos_0062 where clave = 'parrilla'),
 $t$/recipes/chorizo-santarrosano.jpg$t$, null, null),

(3, 1, 'texto', $t$Cómo cocinarlo y servirlo$t$, $t$Cómo cocinarlo y servirlo$t$,
 $t$Fuego medio, 71–74 °C en el centro, y sin pincharlo nunca.$t$,
 $t$**Parrilla**

Fuego medio y brasa pareja, girándolos con frecuencia hasta dorar por todos los lados. El fuego fuerte es el error clásico: la tripa se tuesta y se abre antes de que el centro esté hecho, y toda la grasa se va al carbón.

**Sartén**

Fuego medio-bajo, con unas gotas de agua al principio y tapado unos minutos: así el centro se hace mientras la tripa se mantiene. Después, destapa y deja que dore.

**Cómo saber que está**

Entre **71 y 74 °C en el centro**. Con termómetro es un segundo; sin termómetro, el chorizo se siente firme al apretarlo y suelta jugo claro, no rosado. Al partir uno, la masa está parejamente rosada y hecha — ese color rosa es de la sal de cura y es normal, no es que esté crudo.

**Lo que no se hace nunca**

No lo pinches en el fuego. El aire se sacó al amarrar; aquí un pinchazo es jugo que se va. Y no lo aplastes con la pinza, por lo mismo.

**Déjalo reposar**

Dos o tres minutos fuera del fuego antes de partirlo. El jugo se reparte y no se te va todo en el primer corte.

**Cómo guardarlo**

- **En la nevera, crudos:** 2 o 3 días. Este chorizo lleva ajo y cebolla frescos, y eso le acorta la vida: no es un curado, es un fresco.
- **Congelados:** hasta 3 meses, mejor empacados al vacío o bien envueltos de a pocos. Congela el mismo día que los haces, no al tercero.
- **Ya cocinados:** 3 o 4 días en la nevera.

Si vas a tardar en comértelos, congélalos de una vez. Es mejor congelar un chorizo recién hecho que comerse uno que llevaba cinco días esperando.$t$,
 null, null, null,
 $t$Hice Chorizo Santarrosano. ¿Cómo sé que está bien por dentro sin que me quede seco?$t$),

(3, 2, 'texto', $t$Lo que dice el charcutero$t$, $t$Lo que dice el charcutero$t$,
 $t$Las cinco cosas que deciden si el lote sale bien.$t$,
 $t$**El cuchillo no se negocia**

Es lo que separa este chorizo de uno de supermercado. El molino aplasta la grasa y la unta; el cuchillo la corta y la deja en puntos. Si solo te llevas una cosa del curso, que sea esta.

**Precisión con la sal de cura**

Pesa los 2 g de sal de cura #1 con gramera de 0,1 g, aparte y de último. Es clave para el color y para cubrir las horas que el chorizo pasa fuera del frío. Y recuerda que trae sal: ya está contada en los 15 g.

**Pinchar sí, pero en su momento**

Se pincha **al amarrar**, y solo donde ves una burbuja: saca el aire y hace que la tripa se pegue a la carne. En la parrilla, **nunca**: ahí el pinchazo solo saca jugo.

**La bolita de prueba**

Antes de tapar la masa para el reposo, fríe una cucharadita y pruébala. Es el último momento en que puedes corregir la sal. Después del reposo ya no se toca.

**Respeta los dos reposos**

Son dos y hacen cosas distintas: las 18–24 h de la masa en frío reparten la sal y asientan el sabor; las 2–3 h de sol y la noche en la nevera secan la piel y fijan el color. Saltarse cualquiera de los dos da un chorizo que sirve, pero no sabe igual.

**Para no fallar**

- Mantén la carne y el tocino fríos todo el proceso.
- Pesa la sal de cura con precisión, aparte.
- Pica a cuchillo, los dos: carne y tocino.
- Embute sin apretar; amarra siempre hacia el mismo lado.
- Saca el aire antes de colgar, mirándolos a contraluz.
- Sol de tarde, no de mediodía.
- No pinches los chorizos durante la cocción.$t$,
 null, null, null, null),

(3, 3, 'imagen', $t$Así tiene que quedar$t$, $t$Así tiene que quedar$t$,
 $t$Al tercer día: firmes, de color parejo y listos para la parrilla.$t$,
 null, null, null, $t$/recipes/chorizo-santarrosano.jpg$t$,
 $t$Te voy a mandar una foto de mi Chorizo Santarrosano (tripa Natural) para que me digas si va bien, qué le falta y cuánto aguanta una vez esté.$t$);

-- 4.1 · Las lecciones que ya existen se apartan, para liberar las posiciones.
update charcu.lessons l
   set position = l.position + 100
  from charcu.modules m, charcu.courses c
 where l.module_id = m.id and m.course_id = c.id
   and c.slug = $t$chorizo-santarrosano$t$
   and l.position < 100;

-- 4.2 · Las que ya existen se mueven y se reescriben (conservan su id).
update charcu.lessons l
   set module_id      = destino.id,
       position       = p.pos,
       kind           = p.kind,
       title          = p.title,
       summary        = p.summary,
       body           = p.body,
       bunny_video_id = p.video,
       poster_url     = p.poster_url,
       file_url       = p.file_url,
       ask            = p.ask
  from charcu.modules m, charcu.modules destino, charcu.courses c, lecciones_0062 p
 where l.module_id = m.id and m.course_id = c.id and destino.course_id = c.id
   and c.slug = $t$chorizo-santarrosano$t$
   and destino.position = p.modulo
   and l.title in (p.title, p.titulo_viejo);

-- 4.3 · Las que faltan se crean.
insert into charcu.lessons
  (module_id, position, kind, title, summary, body, bunny_video_id, poster_url, file_url, ask)
select destino.id, p.pos, p.kind, p.title, p.summary, p.body, p.video,
       p.poster_url, p.file_url, p.ask
  from lecciones_0062 p
  join charcu.courses c on c.slug = $t$chorizo-santarrosano$t$
  join charcu.modules destino
    on destino.course_id = c.id and destino.position = p.modulo
 where not exists (
   select 1
     from charcu.lessons l
     join charcu.modules m on m.id = l.module_id
    where m.course_id = c.id and l.title = p.title
 );

-- ----------------------------------------------------------------------------
-- 5. La receta del recetario
--
-- Cambian los ingredientes (pierna picada a cuchillo, las dos sales), los pasos
-- (de 5 a 6, con el reposo antes de embutir y el sol en vez de la noche al
-- ambiente), los consejos, los tiempos y el origen.
-- ----------------------------------------------------------------------------

update charcu.recetario
   set origin = $t$Santa Rosa de Cabal, Colombia · 1 kg$t$,
       content = content
         || jsonb_build_object(
           'description', $t$El chorizo más tradicional de Santa Rosa de Cabal: pierna de cerdo y tocino picados a cuchillo, en proporción 70–30. Jugoso, de grano grueso y directo a la parrilla.$t$,
           'subtitle',    $t$El chorizo tradicional de Santa Rosa de Cabal, picado a cuchillo y a la parrilla al tercer día.$t$,
           'ingredientsNote', $t$Para 1 kg de carne: 700 g de pierna de cerdo y 300 g de tocino, los dos picados a cuchillo.$t$,
           'proportionNote',  $t$70% pierna y 30% tocino es el balance santarrosano: suficiente grasa para que quede jugoso sin perder firmeza en la parrilla. Los dos van picados a cuchillo, nunca molidos: el molino aplasta la grasa y la unta, el cuchillo la corta y la deja en puntos.$t$,
           'charcuteroNote',  $t$El porcentaje junto a cada ingrediente es su peso sobre el total de carne y grasa. Domínalo y escalas la receta a cualquier cantidad. Y cuenta la sal de la cura: el Prague Powder #1 es 93,75% sal común, así que esos 2 g suman 1,9 g de sal a los 15 g que pesaste.$t$,
           'resultNote',      $t$Al tercer día tendrás unos chorizos firmes, de color parejo y listos para asar, con un sabor tradicional que nunca pasa de moda.$t$,
           'stats', jsonb_build_array(
             jsonb_build_object('label', 'Rendimiento base',      'value', '1 kg'),
             jsonb_build_object('label', 'Tipo',                  'value', 'Embutido fresco'),
             jsonb_build_object('label', 'Nivel',                 'value', 'Fácil'),
             jsonb_build_object('label', 'Tiempo de preparación', 'value', '1 h 30 min'),
             jsonb_build_object('label', 'Tiempo de reposo',      'value', '2 días'),
             jsonb_build_object('label', 'Tipo de tripa',         'value', 'Natural de cerdo')
           ),
           'details', jsonb_build_array(
             jsonb_build_object('title', 'Origen',  'description', 'De Santa Rosa de Cabal, en Risaralda: un pueblo al que la gente llega por los termales y del que se va hablando del chorizo.'),
             jsonb_build_object('title', 'Textura', 'description', 'Pierna y tocino picados a cuchillo, 70–30. El grano grueso y la grasa en puntos son la mordida del santarrosano.'),
             jsonb_build_object('title', 'Sabor',   'description', 'Ajo fresco, cebolla larga mitad blanco y mitad verde, comino y paprika dulce. Corto, fresco y reconocible.')
           ),
           'ingredients', jsonb_build_array(
             jsonb_build_object('name', 'Pierna de cerdo, picada a cuchillo',          'amount', '700 g', 'pct', '70%'),
             jsonb_build_object('name', 'Tocino, picado a cuchillo',                   'amount', '300 g', 'pct', '30%'),
             jsonb_build_object('name', 'Sal',                                         'amount', '15 g',  'pct', '1,5%'),
             jsonb_build_object('name', 'Sal de cura #1 (Prague Powder #1)',           'amount', '2 g',   'pct', '0,2%'),
             jsonb_build_object('name', 'Ajo fresco picado (unos 4 o 5 dientes)',      'amount', '18 g',  'pct', '1,8%'),
             jsonb_build_object('name', 'Cebolla larga picada (mitad blanco, mitad verde)', 'amount', '25 g', 'pct', '2,5%'),
             jsonb_build_object('name', 'Pimienta negra molida',                       'amount', '2 g',   'pct', '0,2%'),
             jsonb_build_object('name', 'Comino molido',                               'amount', '2 g',   'pct', '0,2%'),
             jsonb_build_object('name', 'Paprika dulce',                               'amount', '2 g',   'pct', '0,2%')
           ),
           'steps', jsonb_build_array(
             jsonb_build_object('n', '01', 'text', 'Picar a cuchillo la pierna y el tocino, muy fríos, y juntarlos revolviendo hasta repartir la grasa.'),
             jsonb_build_object('n', '02', 'text', 'Pesar y añadir los condimentos —las dos sales aparte— y revolver con una cuchara hasta integrar.'),
             jsonb_build_object('n', '03', 'text', 'Tapar con papel film, bien sellado, y reposar de 18 a 24 horas en la nevera.'),
             jsonb_build_object('n', '04', 'text', 'Embutir en tripa natural sin apretar, y amarrar girando la tripa siempre hacia el mismo lado.'),
             jsonb_build_object('n', '05', 'text', 'Chuzar donde haya aire y colgar 2 o 3 horas al sol de la tarde; de ahí a la nevera toda la noche.'),
             jsonb_build_object('n', '06', 'text', 'Al día siguiente, asar a fuego medio hasta 71–74 °C en el centro, sin pincharlos.')
           ),
           'tips', jsonb_build_array(
             jsonb_build_object('title', 'El cuchillo no se negocia', 'description', 'Pierna y tocino picados a mano. El molino y el procesador aplastan la grasa, la untan y el chorizo pierde la mordida y el jugo.'),
             jsonb_build_object('title', 'Precisión con la sal de cura', 'description', 'Los 2 g de Prague Powder #1 se pesan aparte y en gramera de 0,1 g: son 125 ppm de nitrito, el color y lo que cubre las horas fuera del frío.'),
             jsonb_build_object('title', 'Pinchar al amarrar, nunca al cocinar', 'description', 'El aire se saca antes de colgar, y de paso la tripa se pega a la carne. En la parrilla un pinchazo solo saca jugo.'),
             jsonb_build_object('title', 'Respeta los dos reposos', 'description', 'Las 18–24 h de masa en frío reparten la sal; las 2–3 h de sol y la noche en nevera secan la piel y fijan el color.')
           ),
           'cookMethods', jsonb_build_array(
             jsonb_build_object('title', 'Parrilla', 'description', 'Fuego medio y brasa pareja, girando con frecuencia hasta dorar parejo. Entre 71 y 74 °C en el centro.'),
             jsonb_build_object('title', 'Sartén',   'description', 'Fuego medio-bajo, unas gotas de agua y tapado unos minutos; después destapar y dejar dorar.')
           ),
           'recommendations', jsonb_build_array(
             $t$Pica a cuchillo la carne y el tocino, y mantenlos fríos todo el proceso.$t$,
             $t$Pesa la sal de cura aparte, con gramera de 0,1 g.$t$,
             $t$Embute sin apretar y amarra siempre hacia el mismo lado.$t$,
             $t$Saca el aire antes de colgar, mirando los chorizos a contraluz.$t$,
             $t$Sol de tarde, 2 o 3 horas. Si hace calor, a la sombra o directo a la nevera.$t$,
             $t$No pinches los chorizos durante la cocción.$t$
           )
         ),
       updated_at = now()
 where slug = $t$chorizo-santarrosano$t$;
