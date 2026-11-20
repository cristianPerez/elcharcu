# Guion de grabación — Curso "Chorizo Santarrosano"

Estreno prometido: **miércoles 18 de noviembre de 2026** (`releases_on`, migración 0059).
Estado hoy: `lista-de-espera`. Formato: vertical 9:16. Tuteo, directo, sin atajos.

Convención: `⟨algo⟩` = dato que hay que confirmar antes de grabar (no está en el repo).

---

## 1. Qué hay hoy

El curso existe desde la 0034 (`20261003170000_0034_cursos_desde_recetas.sql`), sacado
automáticamente de la receta del recetario. Son **4 módulos y 9 lecciones**:

| #   | Módulo           | Lección                     | Tipo   | Video                   |
| --- | ---------------- | --------------------------- | ------ | ----------------------- |
| 1   | Bienvenida       | Esto es lo que vas a lograr | video  | `6bca551d…` **relleno** |
| 2   | Antes de empezar | Ingredientes y proporción   | texto  | —                       |
| 3   | Paso a paso      | Mezclar y embutir           | video  | `8693ac0e…` **relleno** |
| 4   | Paso a paso      | Secar y reposar             | video  | `14c9bb65…` **relleno** |
| 5   | Paso a paso      | A la parrilla               | video  | `9767cee6…` **relleno** |
| 6   | Terminar         | Cómo cocinarlo y servirlo   | texto  | —                       |
| 7   | Terminar         | Lo que dice el charcutero   | texto  | —                       |
| 8   | Terminar         | Así tiene que quedar        | imagen | —                       |

Los cuatro `bunny_video_id` son los mismos que usan otros 9 cursos: son **videos de
relleno**, no hay un solo video real de santarrosano. Hay que grabar y editar todo.

El estándar de calidad ya existe: el curso de jalapeño, cheddar y mozzarella (0058),
con **15 lecciones y un video por técnica** (`01a15…`, los definitivos). Ese es el
molde; el santarrosano está muy por debajo: mete mezclar **y** embutir en un solo
video, y la cocción —que es donde se arruina un chorizo fresco— es texto.

---

## 2. Qué le falta al contenido (receta y curso)

Esto hay que decidirlo **antes** de grabar, porque cambia lo que se dice en cámara:

1. **Por qué va sal de cura en un chorizo fresco.** Es el punto fuerte del curso y hoy
   no está explicado. La respuesta real, ya con el video 7 grabado: porque la masa
   pasa **18–24 h condimentada** y los chorizos **2–3 h colgados al sol**, y en ese
   tiempo fuera del frío el nitrito es lo que cubre; más el color y el sabor curado
   que sin él no salen. **2 g/kg** de Cure #1 = 125 ppm de nitrito de entrada
   (decidido el 2026-11-19, ver §5.2); si tu sal de cura tiene otra concentración, la
   dosis no es la misma.
2. **Qué sol y cuánto.** Ya resuelto en el video 7: el **último sol de la tarde, 2 o 3
   horas**, no el del mediodía ni seis horas. Falta decirlo también en la receta, con
   la salida para tierra caliente: a la sombra con brisa, o directo a la nevera.
3. **Contradicción a arreglar.** "No pinches los chorizos durante la cocción" convive
   con sacar el aire al embutir. Hay que separarlo en cámara: se pincha **al embutir**
   (burbujas), nunca **en la parrilla**.
4. **Tripa:** falta calibre y cuánta. ⟨natural de cerdo, 32–36 mm, ~1,5 m por kilo⟩.
5. **"Hasta integrar bien" es vago.** Lo que se busca es la **liga**: la masa se pega
   a la palma y la masa se sostiene boca abajo. Eso se ve en video.
6. **La bolita de prueba.** Freír una cucharada antes de embutir para corregir sal.
   No está en ninguna parte y es el consejo que más salva lotes.
7. **Temperatura interna al cocinar:** "cocinar por completo" → ⟨71–74 °C⟩ en el centro.
8. **Conservación:** no se dice cuánto dura. ⟨nevera 3 días / congelado 3 meses⟩. Y
   que la cebolla larga **fresca** acorta la vida útil: es razón de más para congelar.
9. **"Cebolla larga"** no se entiende fuera de Colombia: decir en cámara "cebolla de
   rama o junca; en otros países, la parte verde del cebollín".
10. **Equipo mínimo** antes de empezar: gramera de 0,1 g (por los 2 g de cura),
    un buen cuchillo y tabla, pistola de embutir o boquilla, y un chuzo o aguja fina
    para el aire. **Sin hilo**: el amarre es por torsión (video 7).
11. **Preguntas al Charcu (`ask`):** solo 3 de 9 lecciones tienen. Faltan en embutir
    (reventones y aire) y en el reposo (olor y color al día siguiente).
12. **No se dice que es picado a cuchillo.** Ni la receta del recetario (paso 01:
    "mezclar la carne magra, el tocino…") ni el curso lo mencionan, y es **la** técnica
    que define el santarrosano. Hay que arreglarlo en los dos sitios: paso 01 de la
    receta, el `summary` del curso y el ingrediente, que pasa a ser **pierna de cerdo
    picada a cuchillo**. (Confirmado al grabar el video 3, 2026-11-19.)
13. **El 50–50 de la cebolla larga no está escrito.** La receta dice solo "cebolla
    larga finamente picada, 25 g". Mitad blanco y mitad verde cambia el sabor y es
    una decisión, no una obviedad: va en el ingrediente. (Video 4, 2026-11-19.)
14. **El ajo está en gramos, pero nadie compra gramos de ajo.** 18 g ≈ ⟨4–5 dientes⟩.
    Conviene decir las dos cosas en el ingrediente, igual que se hace en cámara.
15. **No se nombra Santa Rosa de Cabal.** La receta dice "Colombia" y el detalle
    _Origen_ habla de la proporción carne–grasa, no del lugar. El pueblo es Santa Rosa
    de Cabal, en Risaralda — es el nombre del producto y da el contexto que el alumno
    no tiene. Va en _Origen_ y en el `summary` del curso. (Video 1, 2026-11-20.)
16. ⚠️ **El video 6 promete una cápsula que no existe.** Dice: _"les he dejado una
    cápsula con cómo administrar una madeja de tripa natural"_. Las cápsulas son
    cinco y ninguna es esa: `sal-de-cura`, `calcular-con-el-charcu`,
    `bridar-un-jamon`, `embutir-un-chorizo` y `amarrar-chorizos`. Tres salidas:
    **(a)** grabar la cápsula de la madeja —es un tema que da para 2 min y le sirve a
    todos los cursos de embutido, mi favorita—; **(b)** cambiar la frase del audio por
    "la cápsula de formas de embutir", que sí existe; **(c)** cortar la frase. Lo que
    no se puede es publicar prometiendo algo que no está. (Video 6, 2026-11-20.)
    · **Aplazado por Cristian el 2026-11-20: no se toca por ahora.** Pero es un
    bloqueo de **publicación**, no de edición: hay que resolverlo antes del estreno.
17. **El calibre de la tripa sigue sin decirse** — ni en cámara en el video 6, ni en la
    receta. Hace falta para que el alumno sepa qué comprar: ⟨calibre y metros por kilo⟩.

---

## 3. Temario — 11 lecciones, 7 videos (4 editados, 3 por editar)

Mismo esqueleto de 4 módulos (no rompe el progreso de quien ya abrió el curso), pero
**un video por técnica**, como en jalapeño. Marcado con **[E]** lo que hay que editar
y con **✅** lo que ya está.

### Módulo 1 · Bienvenida

**1. Esto es lo que vas a lograr — 0:11 — ✅ EDITADO (2026-11-20)**

> _"Hola charcus, bienvenidos al curso de chorizo santarrosano. Aprenderemos a hacer
> el chorizo más tradicional de Santa Rosa de Cabal y miren esta pinta."_

Son **11 segundos**: un saludo y el plano del chorizo. Es un gancho, y como gancho
funciona — el "miren esta pinta" sobre el producto terminado es exactamente lo que
hace que alguien siga. Pero no es la bienvenida completa que estaba escrita aquí.

**La consecuencia es importante:** esta es la lección que se ve **antes de pagar**, y
es la que tiene que contestar "¿qué compro y qué me va a costar en tiempo?". En 11
segundos eso no cabe. Así que todo el pitch —el corte, el 70–30, los tres días, el
equipo— **se baja al `body` de la lección**, que es texto y se lee debajo del video.
Queda repartido: el video enamora, el texto informa.

✅ **Decidido (Cristian, 2026-11-20): se queda en 11 s** y el peso lo lleva el texto.
No se alarga el video ni se regraba audio.

#### Lección de texto que acompaña al video

> **El chorizo de Santa Rosa de Cabal**
>
> Santa Rosa de Cabal, en Risaralda, es un pueblo al que la gente llega por los
> termales y del que se va hablando del chorizo. No es una receta complicada —carne,
> tocino y las especias justas— y ahí está la gracia: todo lo que la hace buena es
> oficio, no ingredientes raros.
>
> **Qué vas a lograr**
>
> Un chorizo fresco, de grano grueso, con la grasa en puntos y no untada. Al corte se
> le ve la carne; en la parrilla suelta jugo y no se desarma. Nada que ver con el
> chorizo de supermercado, que es pasta pareja: ahí hay agua, almidón y relleno.
>
> El secreto no está en el condimento. Está en dos cosas: que la carne y el tocino se
> piquen **a cuchillo** —no molidos— y que todo se mantenga frío de principio a fin.
> Eso es lo que vas a aprender a hacer con las manos.
>
> **Cuánto tiempo te va a tomar**
>
> - **Día 1** — Picas, condimentas, mezclas y la masa duerme 18–24 h en la nevera.
>   Hora y media de trabajo, y ya está.
> - **Día 2** — Embutes, amarras y los cuelgas 2 o 3 horas al sol de la tarde; de ahí
>   a la nevera, a dormir toda la noche.
> - **Día 3** — A la parrilla.
>
> Son tres días, pero de trabajo real hay dos ratos. El resto lo hace el tiempo.
>
> **Qué necesitas tener antes de empezar**
>
> - Un buen cuchillo y una tabla. Es la herramienta principal de este curso.
> - Gramera de 0,1 g — por los 2 g de sal de cura, que no se calculan a ojo.
> - Pistola de embutir, o una boquilla o un embudo. Con un kilo se llena tres veces.
> - ⟨tripa natural de cerdo, calibre y metros⟩. **Hilo no hace falta**: aquí se amarra
>   girando la tripa.
> - Un chuzo o una aguja fina, para sacarle el aire.
> - Espacio en la nevera, y un sitio donde colgarlos al sol una tarde.
>
> Si te falta algo, consíguelo ahora. A mitad de camino no se puede parar: la masa ya
> está condimentada y el reloj corre.
>
> «La tradición no necesita complicarse: carne, tocino y las especias justas.»

### Módulo 2 · Antes de empezar

**2. Ingredientes y proporción** — texto (ya existe; añadirle los puntos 1, 4, 10 y la
tabla por kilo, al estilo del de jalapeño).

### Módulo 3 · Paso a paso

**3. Pesar y picar la carne y el tocino — 2:15 — ✅ EDITADO (2026-11-19)**

Título anterior: "La carne y el tocino, muy fríos". El video quedó más largo de lo
previsto porque absorbió el **pesaje de la carne**, que estaba en la lección de texto
_Ingredientes y proporción_. Bien: pesar 700/300 en cámara es lo que hace creíble el
70–30, y el picado a cuchillo es la técnica que define este chorizo.

Qué muestra, en orden: pesar 700 g de pierna y 300 g de tocino → el tocino al
congelador → la carne en láminas finas → cuadritos de ~1 cm → el repaso con el
cuchillo "como triturando" → separar los grandes y volver a picar → el tocino sin
piel, en láminas y en cubos lo más pequeños posibles.

**Consecuencias para el resto del curso** (hay que arreglarlas en la 0062):

- _Ingredientes y proporción_ ya no lleva el pesaje: ahora dice **pierna** y remite a
  este video.
- El corte queda definido: **pierna de cerdo**, no bondiola. Eso cierra el `⟨corte de
carne⟩` que estaba pendiente.
- El santarrosano es **picado a cuchillo**, y eso no aparece en ninguna parte de la
  receta del recetario ni en los pasos del curso (ver hueco 12).
- El video 5 (_Pesar los ingredientes, amasar y reposar_) ya no tiene que explicar el
  frío: se explica aquí.

#### Lección de texto que acompaña al video

Va como `body` de esta misma lección. Las líneas con `- ` las pinta `LessonText` como
viñetas; los párrafos van sueltos.

> **El picado a cuchillo es la receta**
>
> Un santarrosano no se muele. Se pica. Y no es nostalgia: el cuchillo **corta** la
> grasa, mientras el molino y el procesador la **aplastan**. Al aplastarla, la célula
> de grasa se rompe, suelta el aceite y ese aceite se unta en la carne. Un chorizo
> untado se ve pálido y pastoso al corte, y en la parrilla la grasa se va al carbón en
> vez de quedarse adentro. Por eso aquí la jugosidad no la da la cantidad de tocino:
> la da la forma en que lo cortaste.
>
> **Por qué pierna y no otra cosa**
>
> Pierna de cerdo, limpia. Es el corte que te deja controlar la proporción, porque
> llega casi sin grasa propia: tú decides cuánta grasa entra y la pones tú con el
> tocino. Si usas bondiola, cabeza de lomo o papada, la pieza ya trae su propia grasa
> repartida por dentro y el 70–30 deja de ser real — terminas con 50–50 sin saberlo, y
> ese chorizo se desarma en la parrilla.
>
> **Los dos cortes, y por qué son distintos**
>
> - **Carne:** láminas finas, luego cuadritos de más o menos 1 cm, y encima un repaso
>   con el cuchillo, como triturando. No busques un grano perfecto: busca que haya
>   trozos de varios tamaños. Ese desorden es la mordida del santarrosano.
> - **Tocino:** quítale la piel primero — con piel no hay forma de cortarlo parejo — y
>   sácalo en cubos **lo más pequeños que puedas**, más pequeños que la carne. El
>   tocino tiene que repartirse por todo el chorizo, no aparecer en pedazos.
> - Vuelve sobre los trozos grandes que quedaron. Se pica hasta que la consistencia
>   sea la que tú quieres, no hasta que se acabe el tiempo.
>
> **El frío es la mitad del trabajo**
>
> El tocino va a la nevera —mejor al congelador— mientras picas la carne. La carne,
> medio congelada. No es solo por seguridad: la grasa fría se corta limpia y los cubos
> salen parejos; la grasa tibia se pega al cuchillo, se embadurna y se acabó. Si en
> cualquier momento ves que el tocino empieza a brillar o a ponerse blando, pára y
> devuélvelo al congelador 15 minutos. Ese parón no te cuesta nada; el lote untado sí.

#### Trucos del charcu

> **Pide la pierna entera y límpiala tú**
> Si le pides al carnicero "carne para chorizo", te da recortes con grasa que no
> puedes pesar. Pide pierna y quítale tú lo que sobre: así el 70–30 es de verdad.
>
> **Medio congelada, no congelada**
> El punto es que el cuchillo entre con resistencia pero entre. Si está dura como
> piedra, déjala 10 minutos fuera. ⟨tiempo al congelador que usaste: ~45 min?⟩
>
> **Pesa antes de picar, nunca después**
> Picado, el volumen engaña y siempre se pierde algo en la tabla. Los 700 y los 300 se
> pesan con la pieza entera, y de ahí no se mueven.
>
> **Quítale la piel al tocino antes de cortarlo**
> Con piel el cuchillo resbala y los cubos salen desiguales. Guarda la piel: sirve
> para un caldo.
>
> **El cuchillo, no el procesador**
> Ni molino, ni procesador, ni "un pulso rápido". Es el único paso del curso donde no
> hay atajo que funcione, y es justo el que se ve al corte.
>
> **Dos tamaños, no uno**
> Tocino más fino que la carne. Si los picas iguales, el chorizo queda plano; con el
> tocino más fino, la grasa se reparte y la carne se siente.

`ask` sugerida: "Estoy picando a cuchillo mi Chorizo Santarrosano y el tocino se me
está untando. ¿Lo salvo o lo vuelvo a empezar?"

**4. Condimentos, preparar ajo y cebolla — 1:26 — ✅ EDITADO (2026-11-19)**

Título anterior: "Pesar los condimentos". El pesaje sigue dentro —la gramera aparece
al final, cuando el ajo ya está picado— pero no es lo que manda en el video: lo que
manda es **preparar los dos frescos**. El título nuevo dice lo que se ve.

Qué muestra, en orden: los siete condimentos presentados juntos (cebolla larga, ajo
fresco, pimienta, paprika dulce, comino, sal de cura y sal) → las proporciones → la
cebolla larga: quitar la puntica del tallo verde, **50–50 entre lo blanco y lo verde**,
abrir por la mitad, partir y el corte múltiple → el ajo: 4 o 5 dientes según tamaño,
pelados y pasados por el picador → pesar el ajo en la gramera contra el porcentaje de
la receta.

#### Lección de texto que acompaña al video

> **Siete cosas, dos de ellas frescas**
>
> El condimento del santarrosano es corto: sal, sal de cura, pimienta negra, comino,
> paprika dulce, ajo y cebolla larga. Las cinco primeras se pesan y se van al bol tal
> como están. Las dos últimas —el ajo y la cebolla— son frescas, y por eso hay que
> prepararlas antes de pesarlas. Eso es todo lo que pasa en este video.
>
> Que sean frescas no es un detalle. Un ajo en polvo te daría el sabor más plano y el
> chorizo duraría más; el ajo y la cebolla de verdad son los que hacen que este sepa
> como el de Santa Rosa, y también la razón por la que este chorizo se come o se
> congela pronto, no se guarda una semana en la nevera.
>
> **La cebolla larga, mitad blanco y mitad verde**
>
> Cebolla larga —de rama o junca; en otros países, la parte verde del cebollín—.
> Quítale la puntica seca del tallo y usa **la mitad de lo blanco y la mitad de lo
> verde**. No es por aprovechar: son dos sabores distintos. Lo blanco es el que
> aporta el dulce y el cuerpo; lo verde, el aroma fresco y herbal que se reconoce al
> primer bocado. Solo con lo blanco el chorizo queda dulzón y chato; solo con lo
> verde, aguado y con sabor a pasto.
>
> Para picarla: ábrela a lo largo por la mitad, pártela, y termina con el corte
> múltiple —la mano sobre el lomo del cuchillo y el filo bajando rápido sobre el
> montón—. Tiene que quedar **fina de verdad**: la cebolla larga es agua, y un trozo
> grande deja una bolsa de humedad dentro del chorizo, que es donde empieza un
> reventón o una mancha gris.
>
> **El ajo, pelado y picado, pesado después**
>
> Cuatro o cinco dientes, según el tamaño, pelados. Pícalos finos —a cuchillo o con
> un picador de ajo, que es más rápido y queda más parejo—. Y aquí está lo
> importante: **los dientes no son una medida**. Un diente puede pesar 3 g o 7 g. Por
> eso se pica primero y se pesa después, contra el porcentaje de la receta. Si te
> sobra, guárdalo; si te falta, pela otro.
>
> **Pesar, al final**
>
> - La sal y la sal de cura, cada una en su recipiente y la de cura en gramera de
>   0,1 g. Nunca juntas ni "a ojo".
> - Pimienta, comino y paprika, los tres iguales, y van directo al bol.
> - El ajo y la cebolla, ya picados, se pesan al final — es el único orden que
>   funciona con un ingrediente fresco.

#### Trucos del charcu

> **El picador de ajo te ahorra el paso más aburrido**
> No cambia el sabor y sí la paciencia. Lo que no sirve es la licuadora: hace puré y
> el puré de ajo se pasa de amargo.
>
> **Pica, luego pesa**
> Vale para los dos frescos. "Cuatro dientes" y "25 g de cebolla" no son lo mismo en
> tu cocina que en la mía.
>
> **Mitad y mitad, de verdad**
> Haz los dos montones aparte antes de picar. Si picas todo junto, siempre te va a
> ganar lo verde, que es lo que más hay.
>
> **Fina es fina**
> Si ves un trozo de cebolla que podrías agarrar con los dedos, vuelve a picar. Ese
> trozo es agua esperando a salir.
>
> **La cura se pesa aparte y de último**
> Déjala para el final, en su propio recipiente y con la gramera en cero. Es el único
> ingrediente del curso donde equivocarse no se arregla.
>
> **Si usas ajo en polvo, no es equivalente**
> ⟨si quieres darle la salida a quien no tiene ajo fresco: la conversión no es 1:1 y
> conviene decir el número⟩. Y avisa que el chorizo deja de ser el mismo.

`ask` sugerida: "¿Cuánto ajo fresco y cuánta cebolla larga van para la carne que
tengo, y los puedo cambiar por ajo en polvo?"

**5. Pesar los ingredientes, amasar y reposar — 1:55 — ✅ EDITADO (2026-11-19)**

Título anterior: "Amasar hasta la liga". Fuera "la liga": lo que se graba no es un
amasado de liga como el del jalapeño —aquí se revuelve con cuchara— y el video además
termina con el reposo, que no estaba en el título.

Qué muestra, en orden: juntar la carne picada y el tocino en un recipiente → revolver
para repartir la grasa → pesar y echar los condimentos (pimienta 2 g, paprika dulce
2 g, comino 2 g, sal de cura 2 g, ajo fresco 18 g, cebolla larga 25 g, sal 15 g) →
revolver con cuchara hasta integrar todo → papel film bien sellado → **18 a 24 horas
en la nevera**.

> ⚠️ **Ver §5 antes de escribir la migración.** Este video cambió tres cosas de la
> receta publicada: la cronología (el reposo va **antes** de embutir, §5.1), la sal de
> cura (2 g, §5.2) y la sal normal (15 g, §5.3). Las tres decididas.

#### Lección de texto que acompaña al video

> **Primero la grasa, después el condimento**
>
> La carne y el tocino se juntan y se revuelven **antes** de echar nada más. Parece un
> detalle de orden y no lo es: lo que buscas es que la grasa quede repartida por todo,
> y eso se consigue mejor cuando todavía no hay sal ni especias de por medio. Si
> echas todo junto de una vez, siempre quedan zonas con más tocino que otras — y ese
> chorizo sale desigual: unos jugosos y otros secos del mismo lote.
>
> La regla para saber si vas bien: **en cualquier parte de la masa tiene que haber
> grasa, cebolla y ajo**. No es una masa uniforme, es una masa parejamente desigual.
> Coge un puñado de un lado y otro del otro: tienen que verse iguales.
>
> **Los condimentos, pesados, no calculados**
>
> Para este kilo: pimienta negra 2 g, paprika dulce 2 g, comino 2 g, sal de cura 2 g,
> ajo fresco 18 g, cebolla larga picada 25 g y sal 15 g. Se pesan todos.
> Los dos gramos de pimienta y los dos de comino se parecen mucho a ojo y no son lo
> mismo en la boca; y la sal de cura, además, es el único ingrediente donde pasarse no
> se arregla.
>
> **Se revuelve, no se amasa**
>
> Aquí la cuchara es mejor que la mano, y a propósito. Este chorizo lleva la carne
> picada a cuchillo, y lo que le da el carácter es justamente ese grano: si lo amasas
> con fuerza como se amasa un embutido cocido, el grano se deshace, la grasa se unta
> con el calor de las manos y pierdes lo que ganaste picando. Revuelve lo justo para
> integrar y párate ahí.
>
> **El reposo en frío: dónde empieza el sabor**
>
> Tapa el recipiente con papel film, bien sellado y pegado, y mételo a la nevera de
> **18 a 24 horas** antes de embutir. En ese tiempo pasan tres cosas: la sal penetra y
> deja de estar solo por fuera de los trozos; la sal de cura empieza a hacer su
> trabajo de color y de seguridad; y el ajo, la cebolla y las especias dejan de ser
> ingredientes sueltos y se vuelven un sabor solo. Un chorizo embutido de inmediato
> sabe a carne con especias encima. Este sabe a chorizo.
>
> Sellar bien no es manía: la carne descubierta en la nevera se oxida por fuera y
> coge el olor de todo lo que haya al lado.

#### Trucos del charcu

> **La grasa primero, sola**
> Carne y tocino revueltos antes del condimento. Es el único momento en que puedes
> arreglar un reparto desigual de grasa.
>
> **La cuchara, no los puños**
> Cada minuto de más amasando es grano que pierdes. Si la masa empieza a verse
> brillante o pastosa, ya te pasaste.
>
> **Prueba de los dos puñados**
> Saca un puñado de arriba y otro del fondo y compáralos. Si uno tiene más grasa o
> más verde que el otro, revuelve un poco más. Si se ven iguales, listo.
>
> **Film pegado a la masa, no al borde**
> Baja el film hasta tocar la carne y luego sella los bordes. Menos aire encima,
> menos capa gris al día siguiente.
>
> **Pesa sobre el bol, en cero**
> Pon el recipiente en la gramera y ponla en cero antes de cada condimento. Siete
> pesajes seguidos y ni un plato más que lavar — menos el de la sal de cura, que va
> aparte.
>
> **De 18 a 24 h, no 4**
> Si te apuras y embutes el mismo día, el chorizo sirve, pero no sabe igual. Este
> paso es gratis: solo es esperar.
>
> **La bolita de prueba** ⟨opcional, no está grabada⟩
> Antes de tapar, fríe una cucharadita y pruébala. Es el último momento para
> corregir la sal. Después del reposo ya no se toca.

`ask` sugerida: "Mezclé mi Chorizo Santarrosano y lo tengo reposando. ¿Cuánto puede
esperar en la nevera antes de embutir y cómo sé si todavía está bien?"

**6. Tripa y embutido — 4:41 — ✅ EDITADO (2026-11-20)** · _(fusiona los antiguos 6 y 7)_

El más largo del curso, y está bien que lo sea: es el paso donde la gente abandona.

Qué muestra, en orden: lavar la tripa con agua tibia y un poco de vinagre → pasarle
agua por dentro para quitarle la sal de la madeja → enhebrarla en la pistola
manteniéndola alta → cargar la masa con una cuchara, en bolitas, empujando para no
dejar aire → cerrar el embutidor dejando sobrar tripa en la punta → embutir sin nudo
al principio, dejando salir el aire → ir corriendo la tripa para que no quede apretada
→ tres cargas de la pistola para el kilo → dejar ventaja de tripa al final para cortar.

> ⚠️ **El video promete una cápsula que no existe.** Ver hueco 16 de §2.

Cierra dos `⟨pendientes⟩` y abre uno: el equipo es una **pistola de embutir manual**
que se carga con cuchara (no embutidora de palanca ni molino), y el kilo da para
**tres cargas**. El **calibre de la tripa** sigue sin decirse, ni en cámara ni en la
receta.

#### Lección de texto que acompaña al video

> **La tripa viene salada: hay que lavarla, no solo mojarla**
>
> La tripa natural se vende en madeja, enterrada en sal — es así como se conserva. Si
> la embutes tal cual, ese exceso de sal se suma a la que ya pesaste y el chorizo sale
> salado por fuera.
>
> Se lava con **agua tibia y un chorrito de vinagre**. El agua tibia relaja la tripa y
> la hace elástica, que es lo que evita que se rompa después; el vinagre le quita el
> olor y la deja limpia. Y hay que lavarla **por dentro**: se le mete agua por una
> punta y se deja correr por todo el tubo hasta que salga por la otra. Mojarla por
> fuera no sirve de nada, porque la sal está adentro.
>
> **Enhebrarla: el truco es la altura**
>
> Recoge la punta de la tripa y métela en la boquilla —de la pistola, de un embudo o
> de una botella cortada, lo que tengas— **sosteniendo la tripa en alto**. Colgando se
> desliza sola y entra; apoyada en la mesa se dobla y se pega. Es el único truco que
> hay, y cambia el paso de imposible a fácil.
>
> **Cargar la masa: bolitas y presión, no puñados**
>
> Con una cuchara, de poco en poco, haciendo bolitas y empujando cada una. Así la masa
> entra sin arrastrar aire. Si la tiras a puñados, entre puñado y puñado queda una
> bolsa de aire que después es una cueva dentro del chorizo — y una cueva es masa que
> falta, sal que no llegó y oxígeno donde no debe haberlo.
>
> Un kilo da para **tres cargas** de la pistola. No la llenes más de eso: cargada a
> tope cuesta el doble empujarla y pierdes el control de la salida.
>
> **No hagas el nudo todavía**
>
> La primera parte del embutidor tiene aire, y ese aire tiene que salir por algún
> lado. Si amarras la punta antes de empezar, el aire se queda adentro y te hace la
> primera burbuja. Déjala abierta, empuja hasta que salga el aire y veas aparecer la
> masa; ahí ya puedes seguir tranquilo.
>
> **El ritmo: la tripa se deja correr, no se estira**
>
> Esto es lo que separa un chorizo bueno de uno reventado. La tripa va montada en la
> boquilla y hay que **irla soltando** al ritmo que entra la masa, con la mano
> acompañando. No se estira ni se sujeta de más.
>
> El punto es un chorizo **ni apretado ni suelto**. Apretado se revienta —al amarrar,
> al colgar o en la parrilla— y además no te deja girar la tripa para hacer los
> nudos. Suelto queda flojo y deforme. Si tienes duda, déjalo un poco más suelto: eso
> se arregla al amarrar, y lo apretado no.
>
> **Deja ventaja de tripa en las dos puntas**
>
> Al empezar y al terminar, deja un pedazo de tripa vacía de sobra. Es margen: te deja
> mover la masa, corregir, amarrar cómodo y cortar sin perder chorizo. Es gratis y se
> agradece en el paso siguiente.

#### Trucos del charcu

> **Agua tibia y un chorrito de vinagre**
> Tibia, no caliente. El agua caliente cuece la tripa y la vuelve quebradiza.
>
> **Lávala por dentro, no por fuera**
> Métele agua por una punta hasta que salga por la otra. La sal está adentro.
>
> **Mantén la tripa en alto para enhebrarla**
> Colgando entra sola. Apoyada en la mesa se dobla y se pega.
>
> **Bolitas con la cuchara, no puñados**
> Cada bolita empujada es aire que no entra. Las cuevas de aire se evitan aquí, no se
> arreglan después.
>
> **Tres cargas por kilo, no más**
> La pistola llena a tope no se controla. Mejor cargar tres veces y empujar suave.
>
> **No amarres la punta hasta que salga la masa**
> El aire del cilindro tiene que irse por ahí. Un nudo prematuro es tu primera burbuja.
>
> **Ventaja de tripa en las dos puntas**
> Un pedazo vacío al principio y otro al final. Margen para mover, amarrar y cortar.
>
> **Si dudas, más suelto que apretado**
> Lo flojo se arregla al amarrar. Lo apretado se revienta y no se arregla.

`ask`: "Se me revienta la tripa al embutir, ¿qué estoy haciendo mal?"

Remite a la **cápsula 4 · Formas de embutir un chorizo** (`embutir-un-chorizo`), que
ya tiene una lección entera sobre las cuevas de aire y encaja perfecto aquí.

**7. Amarrar, secar al sol y una noche en la nevera — 2:50 — ✅ EDITADO (2026-11-20)** ·
_(fusiona los antiguos 8 y 9)_

Cierra el día 2 completo: amarrar por torsión, sacar el aire, colgar al sol y, al
final de la tarde, a la nevera.

Qué muestra, en orden: sacar el tamaño del chorizo y darle vuelta, siempre **hacia el
mismo lado** → medir cada uno igual, de **80 a 100 g** → ir corriendo la masa para que
dé juego → repasar todos buscando aire y **chuzarlos** donde lo haya → colgarlos al
sol **2 o 3 horas** con el último rayo de la tarde → a la nevera, a dormir toda la
noche.

> ⚠️ **Esto cambia la receta otra vez. Ver §5.1.** No es "una noche al aire libre": son
> **2–3 horas al sol de la tarde** y después la nevera. El secado largo al ambiente que
> dice la receta publicada no existe en el curso.

**Título:** propongo cambiarlo a _"Amarrar, secar al sol y una noche en la nevera"_ —
"al aire" no dice lo que se ve, y el sol es justo lo que lo hace distinto.

**Se amarra por torsión, sin hilo.** Eso cierra una cosa que yo tenía mal en el equipo
mínimo: **no hace falta hilo**. Lo que sí hace falta es un **chuzo o una aguja**.

#### Lección de texto que acompaña al video

> **El amarre más simple: girar, no anudar**
>
> No hay nudos en este chorizo. Se mide el largo que quieres, se sujeta y se le da una
> vuelta completa a la tripa sobre sí misma. Eso sella, separa y aguanta. Es el amarre
> más antiguo y el más rápido, y para un fresco que se come en dos días es todo lo que
> se necesita.
>
> Dos reglas y el amarre sale solo:
>
> - **Siempre hacia el mismo lado.** Si alternas el sentido de las vueltas, cada giro
>   deshace el anterior y la ristra se abre sola al colgarla.
> - **Ve corriendo la masa.** Antes de cada vuelta, mueve un poco la carne con los
>   dedos hacia donde te falta. Por eso se embutió sin apretar: esa holgura es la que
>   te deja trabajar aquí.
>
> **El tamaño: de 80 a 100 gramos**
>
> Ese es el santarrosano. No es capricho: a ese tamaño el chorizo se cocina parejo —se
> dora por fuera justo cuando el centro llega a su punto—. Más grande, el exterior se
> quema antes de que el interior esté listo. Más pequeño, se seca. Un kilo da para
> unos diez u once.
>
> **El aire: búscalo y sácalo**
>
> Repasa uno por uno. Donde veas una burbuja, un chuzazo con la punta de un cuchillo
> fino o una aguja. No lo pinches al azar: solo donde hay aire.
>
> Se hace por dos razones, y la segunda casi nadie la cuenta. La primera es que una
> bolsa de aire es masa que falta: ahí no llegó la sal, hay oxígeno y es por donde
> empieza a dañarse. La segunda es que **al sacar el aire la tripa se pega a la
> carne** — queda abrazada, y es esa unión la que da el chorizo firme y bien formado
> en vez de uno flojo con la piel suelta.
>
> Mira cada chorizo a contraluz antes de colgarlo: el aire se ve más fácil de lo que
> se busca con el dedo.
>
> **Dos o tres horas de sol, no más**
>
> Cuélgalos donde les llegue el **último sol de la tarde**, dos o tres horas. El sol
> de esa hora es suave: seca la superficie sin cocinar nada. Lo que buscas es que la
> tripa deje de estar húmeda y se forme esa piel ligeramente seca que después se dora
> bien en la parrilla y no se pega a la rejilla.
>
> No es sol del mediodía y no son seis horas. Con sol fuerte la grasa se calienta,
> empieza a ponerse rancia y el chorizo coge un sabor que no se quita. Si donde vives
> hace calor de verdad, cuélgalos a la sombra con brisa, o sáltate el paso y mándalos
> directo a la nevera: pierdes un poco de piel, no el lote.
>
> **Y a dormir en la nevera**
>
> Después del sol, toda la noche en frío. Ahí la sal de cura termina de dar el color,
> el sabor se asienta y la superficie se seca un poco más. Al día siguiente están
> listos para la parrilla.

#### Trucos del charcu

> **Siempre hacia el mismo lado**
> Todas las vueltas en el mismo sentido. Alternarlas es deshacer lo que acabas de
> hacer.
>
> **Ve corriendo la masa antes de cada vuelta**
> Un empujoncito con los dedos y el siguiente chorizo te queda del tamaño que quieres.
>
> **De 80 a 100 g cada uno**
> El tamaño en que se cocina parejo. Grande se quema por fuera, pequeño se seca.
>
> **Donde veas aire, chuzo**
> Solo donde lo veas. Y a contraluz se encuentran todos en un minuto.
>
> **Sacar el aire pega la tripa a la carne**
> No es solo por conservación: es lo que hace que el chorizo quede firme y no flojo
> con la piel suelta.
>
> **El último sol, no el del mediodía**
> Dos o tres horas de sol suave. Con sol fuerte la grasa se pone rancia y eso no se
> quita.
>
> **Si hace calor, a la sombra o directo a la nevera**
> Pierdes un poco de piel seca. Es mejor que perder el lote.
>
> **Pinchar es aquí, no en la parrilla**
> Este es el único momento del curso en que se pincha un chorizo. En el fuego, jamás:
> ahí se va el jugo.

`ask`: "Mis Chorizos Santarrosanos están colgados al sol. ¿Cómo sé cuándo ya es
suficiente y cuándo me pasé?"

Remite a la **cápsula 5 · Cómo amarrar los chorizos** (`amarrar-chorizos`).

El **oreo con leña** va solo como texto en esta lección, no en cámara — es opcional y
no se le pone puerta a quien no tiene ahumador. Texto propuesto:

> **Si tienes ahumador: un oreo corto con leña** _(opcional)_
>
> Después de las horas de sol, y antes de la noche en la nevera, puedes darle un oreo
> corto con humo frío — ⟨tiempo y leña: guayabo?⟩. Le da color y un fondo ahumado que
> aguanta bien la parrilla.
>
> Tres cosas que no cambian: va **después** del sol, nunca en vez de — el humo se
> agarra en la piel ya seca, y sobre tripa húmeda queda manchado y amargo. El humo
> **no reemplaza la sal de cura**: lo que cubre las horas fuera del frío es el
> nitrito. Y tiene que ser humo frío; si subes de ⟨30 °C⟩ estás cocinando el chorizo a
> medias y alargando el tiempo en zona de peligro.
>
> Sin ahumador el santarrosano está completo. El humo de verdad lo pone el carbón
> cuando lo ases.

### Módulo 4 · Terminar

**8. A la parrilla: asar y disfrutar — 0:11 — ✅ EDITADO (2026-11-20)** · _(fusiona los
antiguos 10 y 13; es el último video del curso)_

Once segundos, como la bienvenida. El curso abre y cierra corto, y eso le da simetría:
el primero enseña la pinta, el último la recompensa.

**Lo que hay que asumir:** en 11 s no cabe la técnica de cocción. El fuego medio, los
giros, el no pinchar y la temperatura interna **no están en video**, así que la
lección 9 (_Cómo cocinarlo y servirlo_) deja de ser un texto de apoyo y pasa a ser
**la que enseña a cocinarlo**. Hay que escribirla completa, no ampliarla: es el único
sitio del curso donde va la cocción.

Y sigue en pie la decisión del final: cómo cocinarlo sin reventarlo es, junto al
embutido, donde más lotes se pierden. Si en algún momento quieres un video de verdad
de la parrilla, este es el que yo alargaría primero.

**9. Cómo cocinarlo y servirlo** — texto (ya existe; añadir temperatura interna y
conservación).

**10. Lo que dice el charcutero** — texto (ya existe; separar "pinchar al embutir" de
"no pinchar al cocinar" y añadir la bolita de prueba).

**11. Así tiene que quedar** — imagen (se queda como foto: el corte final ya está en el
video 8, y esta lección es la que invita a mandarle la foto al Charcu).

---

## 4. Estado y orden de edición

**11 lecciones · 7 videos · 🎬 los 7 grabados y editados.**

| L   | Módulo           | Lección                                        | Tipo   | Estado                |
| --- | ---------------- | ---------------------------------------------- | ------ | --------------------- |
| 1   | Bienvenida       | Esto es lo que vas a lograr                    | video  | ✅ 0:11               |
| 2   | Antes de empezar | Ingredientes y proporción                      | texto  | reescribir            |
| 3   | Paso a paso      | Pesar y picar la carne y el tocino             | video  | ✅ 2:15               |
| 4   | Paso a paso      | Condimentos, preparar ajo y cebolla            | video  | ✅ 1:26               |
| 5   | Paso a paso      | Pesar los ingredientes, amasar y reposar       | video  | ✅ 1:55               |
| 6   | Paso a paso      | Tripa y embutido                               | video  | ✅ 4:41               |
| 7   | Paso a paso      | Amarrar, secar al sol y una noche en la nevera | video  | ✅ 2:50               |
| 8   | Terminar         | A la parrilla: asar y disfrutar                | video  | ✅ 0:11               |
| 9   | Terminar         | Cómo cocinarlo y servirlo                      | texto  | **escribir completa** |
| 10  | Terminar         | Lo que dice el charcutero                      | texto  | ampliar               |
| 11  | Terminar         | Así tiene que quedar                           | imagen | se queda              |

**El video está completo: 13:29 en siete lecciones.**

| L   | Video                                          | Dur. |
| --- | ---------------------------------------------- | ---- |
| 1   | Esto es lo que vas a lograr                    | 0:11 |
| 3   | Pesar y picar la carne y el tocino             | 2:15 |
| 4   | Condimentos, preparar ajo y cebolla            | 1:26 |
| 5   | Pesar los ingredientes, amasar y reposar       | 1:55 |
| 6   | Tripa y embutido                               | 4:41 |
| 7   | Amarrar, secar al sol y una noche en la nevera | 2:50 |
| 8   | A la parrilla: asar y disfrutar                | 0:11 |

De aquí en adelante no queda cámara, solo escritura:

- **Lección 2 · Ingredientes y proporción** — pierna, 15 g de sal, 2 g de cura, el
  50–50 de la cebolla, el ajo en dientes, el equipo y el calibre de tripa.
- **Lección 9 · Cómo cocinarlo y servirlo** — completa, porque la cocción no quedó en
  video (ver lección 8).
- **Lección 10 · Lo que dice el charcutero** — separar el pinchar al embutir del no
  pinchar al cocinar, y la bolita de prueba.
- **La receta del recetario** — todo el §5.
- **La migración 0062.**

Y antes del estreno, el hueco 16: la cápsula que el video 6 promete y no existe.

Todo esto va en una migración nueva (`0062`) con el mismo método de la 0058: mover las
lecciones que ya existen (conservan su `id` y el progreso), crear las que faltan, y
publicar el curso a mano el día del estreno.

---

## 5. Lo que cambia en la receta del recetario

Las tres salieron al grabar, y las tres tocan la receta publicada, no solo el curso.
Son lo que el alumno va a hacer en su casa, así que no se pueden dejar para después.

### 5.1 La cronología — ✅ RESUELTA (Cristian, 2026-11-19)

La receta publicada en `charcu.recetario` tiene 5 pasos y **ya no son ciertos**: el
reposo largo se movió a antes de embutir, y ahora hay dos reposos, no uno.

|                       | Receta publicada          | Lo que se graba                        |
| --------------------- | ------------------------- | -------------------------------------- |
| Mezclar y condimentar | día 1                     | día 1                                  |
| **Reposo de la masa** | —                         | **18–24 h en nevera, tapada con film** |
| Embutir               | día 1                     | día 2                                  |
| Amarrar por torsión   | —                         | día 2                                  |
| Secado                | **una noche al ambiente** | **2–3 h al sol de la tarde**           |
| Reposo en frío        | 24 h                      | toda la noche en la nevera             |
| Asar                  | día 2                     | día 3                                  |

Dos cambios, no uno. El reposo largo se movió a antes de embutir —es el método del
curso de jalapeño, y tiene más sentido: la sal penetra mejor en la masa suelta que
dentro de la tripa—. Y el secado **no es una noche al ambiente: son 2 o 3 horas de sol
suave** y de ahí a la nevera (video 7, 2026-11-20).

Lo del sol es mejor noticia de lo que parece: tres horas de sol de la tarde dejan al
chorizo fuera del frío mucho menos tiempo que una noche entera, así que el paso es más
seguro que el que decía la receta, no menos.

**Los 6 pasos nuevos de la receta:**

> 01 Mezclar la carne picada a cuchillo con el tocino, hasta repartir la grasa.
> 02 Pesar y añadir los condimentos; revolver hasta integrar.
> 03 Tapar con film y reposar 18–24 h en la nevera.
> 04 Embutir en tripa natural y amarrar por torsión, sacando el aire con un chuzo.
> 05 Colgar 2 o 3 horas al sol de la tarde; luego toda la noche en la nevera.
> 06 Al día siguiente, asar, freír o cocinar.

Y lo que arrastra:

- El stat **"Tiempo de reposo"**: de "24–36 h" a ⟨**2 días**⟩.
- El `summary` del curso y la bienvenida: son **tres días**, no dos.
- El resumen del módulo _Paso a paso_ ("Los 5 pasos de la receta, en orden") pasa a
  hablar del día 1 y el día 2.
- El consejo **"Respeta el doble reposo"** de la receta, que hoy dice "el secado a
  temperatura ambiente y las 24 h en frío": hay que reescribirlo con el sol y la noche
  en nevera.
- El stat **"Tipo de tripa: Natural"** se queda, pero le falta el calibre (hueco 17).

### 5.2 Sal de cura: 2 g — ✅ DECIDIDO (Cristian, 2026-11-19)

Manda el video. **2 g por kilo = 0,2% = 125 ppm** de nitrito de entrada. La receta
decía 2,5 g (0,25%, 156 ppm) y hay que corregirla.

Sitios a cambiar en la 0062:

- `charcu.recetario` → ingrediente "Sal de cura (Prague Powder #1)": `amount` **2 g**,
  `pct` **0,2%**.
- Lección _Ingredientes y proporción_ del curso: la línea del ingrediente y la cifra de
  los ppm (156 → 125).
- El hueco 1 de §2, ya corregido en este guion.

125 ppm es dosis de sobra para lo que hace aquí —color, sabor curado y cubrir la noche
al ambiente— en un chorizo que además se cocina antes de comerse. No hay que subirla.

### 5.3 La sal normal: 15 g — ✅ DECIDIDO (Cristian, 2026-11-19)

Baja de 18 g a **15 g (1,5%)**. Lo probaste y quedó salado, y los números te dan la
razón.

Sitios a cambiar en la 0062:

- `charcu.recetario` → ingrediente "Sal": `amount` **15 g**, `pct` **1,5%**.
- Lección _Ingredientes y proporción_ del curso: la línea de la sal.
- La tabla por kilo, si se escribe como en el de jalapeño.

**El error está en no contar la sal de cura.** El Cure #1 es 93,75% sal común y solo
6,25% nitrito. Así que los 2 g de cura meten **1,9 g de sal** más:

|                 | Sal añadida | Sal de la cura | **Sal total** | % sobre 1 kg |
| --------------- | ----------- | -------------- | ------------- | ------------ |
| Hoy             | 18 g        | 1,9 g          | **19,9 g**    | **1,99%**    |
| Jalapeño (0058) | 15 g/kg     | 2,3 g/kg       | 17,3 g/kg     | 1,73%        |
| Propuesta       | **15 g**    | 1,9 g          | **16,9 g**    | **1,69%**    |

El 2% de sal es el techo de lo que se usa en embutidos, y es un techo pensado para
salamis y curados en seco, donde la pieza pierde mucha agua en semanas y la sal se
reparte despacio. Este es un **fresco que se come al tercer día**, y además pasa por la
parrilla: ahí pierde humedad y la sal que queda se concentra todavía más. Por eso se
siente más salado de lo que dice el número.

Súmale que el ajo y la cebolla frescos no tapan la sal como lo harían un ahumado o una
fermentación. En el santarrosano la sal está desnuda.

**15 g es la misma sal que el curso de jalapeño**, así que la casa queda con un solo
estándar. Total con la cura: 1,69% — dentro del rango tradicional de un fresco
(1,5–1,8%), suficiente para el reposo de 18–24 h, y deja al alumno salar en la mesa si
quiere. Al revés no funciona: un lote salado no se arregla. Por debajo de 14 g sí hay
problema, porque la masa no agarra cuerpo y el reposo en frío deja de ser seguro — 15 g
está lejos de ese borde.

⚠️ **El video 5 dice "18 gramos de sal normal" en voz alta.** Hay que arreglar ese
pedacito antes de publicar, o el video y la receta van a decir cosas distintas — el
mismo problema que acabamos de cerrar con la cura. Tres salidas, de mejor a peor:

1. **Regrabar el audio** de esa frase y pegarlo sobre el plano de la gramera. Es el
   único arreglo que deja el video correcto.
2. **Cortar la frase** y dejar solo el plano de la gramera con el número en pantalla.
   Funciona si la toma no muestra el "18" en el display.
3. **Rótulo en pantalla** corrigiendo la cifra. Es el peor: el alumno oye un número y
   lee otro.

Si el plano muestra el 18 en el display de la gramera, ninguna de las tres sirve y hay
que volver a grabar el pesaje de la sal.
