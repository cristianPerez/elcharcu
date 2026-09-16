# Recetas de la comunidad — plan, sin empezar

**Escrito el 2026-09-16. Nada de esto está construido.** Es la idea de Cristian
puesta por escrito para no perderla, con los problemas que encontramos al
pensarla. No se toca código hasta que él lo diga.

## De dónde sale

Julieth (`julieth2104@hotmail.com`, 2026-09-14) montó con El Charcu un
**glaseado de lulo y aguardiente** para sus chorizos santarrosanos: panela,
pulpa de lulo, aguardiente, vinagre, y hasta el texto de la etiqueta para que
el cliente sepa pincelarlo en los últimos dos minutos de asado.

Es contenido bueno, colombiano y específico, que no está en las 45 recetas de
la casa y que no costó nada escribir. Y hoy **vive enterrado en un chat**: ni
siquiera ella puede volver a encontrarlo sin releer la conversación entera.

La idea: que cada quien pueda guardar lo que arma con El Charcu como receta
suya, con su nombre, y —si quiere— abrirla para que otros la hagan.

## Los tres problemas, por gravedad

### 1. Seguridad alimentaria — es el que decide el diseño

Las 45 recetas las escribió Cristian y **aun así la chistorra llevaba la sal de
cura equivocada** (corregido el 2026-09-16, lo encontró un usuario). Y al
revisar el salami de res ese mismo día aparecieron tres fallos de fermentación
más, en la receta más cuidada del catálogo.

Ese es el argumento de verdad: si las recetas escritas a mano por quien sabe
salen con fallos, las de gente que acaba de empezar saldrán con más.

Abrir publicación significa poner **dosis de nitrito bajo la marca El Charcu**
que nadie ha mirado. `auditCureDoses` vigila lo que el asistente dice en un
chat; no es un revisor de recetas publicadas. Y una receta mal calculada que
otro sigue durante tres semanas no se parece en nada a una respuesta de chat
que se lee y se olvida.

**La línea: sin sal de cura se publica solo; con sal de cura no sale sin que
Cristian lo apruebe.** No es arbitraria — es la misma frontera que ya separa lo
que puede hacer daño de lo que no, y el código ya sabe detectarla (`CURE_SALT`
en `recipeDoubts.ts`, `auditCureDoses` en `entities/cure-safety`).

El glaseado de Julieth no lleva sal de cura. Panela, lulo, aguardiente,
vinagre. Cae del lado que se publica solo.

### 2. El SEO, que es el canal de adquisición

Las 45 recetas funcionan porque son **estáticas, completas y únicas**, y Google
las indexa enteras (`generateStaticParams`). Contenido de usuarios es lo
contrario: delgado, parecido entre sí y dinámico. Google castiga eso, y **no
solo en las páginas nuevas — puede arrastrar al dominio**.

Sería arriesgar lo único que hoy trae gente, para ganar algo que todavía no
sabemos si funciona.

**Mitigación: lo compartido nace con `noindex`**, en su propia ruta y separado
de las 45. Quitar un `noindex` cuando haya volumen y calidad es trivial;
recuperar un dominio penalizado no lo es.

### 3. Arranque en frío

19 usuarios, 29 conversaciones. Un "centro de recetas de la comunidad" con
cuatro recetas se lee como un sitio abandonado, y eso resta en vez de sumar.

## La versión mínima

No un centro de recetas. **Un botón al final de la conversación.**

**Fase A — guardar (privado).** "Guardar esto como receta mía". El asistente ya
escribió la receta; solo hay que guardarla, no generarla. Nace privada, en "Mis
recetas".

⚠️ **La fase A se justifica sola, aunque nadie comparta nunca.** Hoy Julieth
tiene que rebuscar en un chat para encontrar su propio glaseado. Eso es lo que
hace que la apuesta sea barata: el valor no depende de que la comunidad
despegue.

**Fase B — compartir.** Un segundo botón, aparte y explícito. Con nombre y foto
si quiere. Vive en `/recetas/comunidad`, con `noindex`, y las que llevan sal de
cura quedan en cola de aprobación.

## Lo que hay que resolver en el esquema

⚠️ **`charcu.recipes` NO son recetas: son conversaciones.** Tiene `title`,
`product`, `summary`, `started_at`, `last_message_at`. La colisión de
vocabulario ya está haciendo daño hoy (ver abajo), y meter recetas de verdad
en esa tabla la empeoraría.

Una receta guardada necesita entidad propia. Y conviene aprovechar para
renombrar `recipes` a lo que es —`conversations`— antes de que haya dos cosas
llamadas igual.

## Antes de escribir una línea

**Preguntárselo a Julieth.** "Ese glaseado que armaste, ¿lo querrías guardado
con tu nombre? ¿Te molestaría que otro lo hiciera?"

Hay una posibilidad real: **que sea su receta de negocio y no la quiera
regalar**. Vende chorizos etiquetados y ese glaseado es diferenciación. Si es
así, el producto no es compartir — es _guardar y organizar lo tuyo_, que es
otra cosa, igual de buena y más fácil.

## ⚠️ Esto va antes que nada de lo anterior

**El asistente no ve ni el título de la conversación.**

En `app/api/asistente/route.ts` el único contexto de receta viene del
`recipeSlug`, o sea solo desde las 45 páginas del sitio. Dentro de la app
(`/charcu`) va `recipe: null` y el modelo no sabe qué está haciendo esa
persona.

Lo llevaba la columna `product`, retirada el 2026-09-01 al cerrar el agujero de
inyección de prompt. La decisión fue correcta; **lo que no pasó es que nada la
reemplazara por este camino**.

En la base: **29 de 29 sesiones con `product` en null, y 29 de 29 con `summary`
en null.** Las dos columnas están muertas.

Se vio con Julieth el 2026-09-14: dijo "es el que está en la receta" y el
asistente contestó "no me aparece la receta aquí en el chat". Se comportó bien
—no se inventó nada— pero la hizo contestar tres preguntas para llegar a donde
quería. Y hay trampa de vocabulario: la interfaz llama "receta" a su
conversación, y el asistente entiende "una de las 45 del sitio".

Los arreglos, de más barato a menos:

1. **Mandarle el título de la sesión.** "Glaseado para chorizo" ya estaba
   guardado y nunca se envió. Una línea en el prompt.
2. **Que al no ver algo ofrezca la salida**: "no tengo tu receta a la vista,
   pégamela y seguimos", en vez de un interrogatorio.
3. **Revivir `product` por la puerta segura**: preguntarlo una vez, guardarlo, e
   inyectarlo **como mensaje de usuario, nunca en el prompt del sistema**. Así
   el texto libre no puede convertirse en instrucciones y el agujero sigue
   cerrado.
4. **Arreglar la palabra**: que el asistente distinga "esta conversación" de
   "las recetas de la web".

Construir un centro de recetas encima de una base que no sabe qué está haciendo
la persona es empezar por el tejado.
