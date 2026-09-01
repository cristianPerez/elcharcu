# ESTADO — El Charcu

**Solo lo que está VIVO.** Lo que se termina se borra de aquí.

Este archivo llegó a 1.827 líneas contando la historia de cosas ya hechas
—narraciones de arreglos, planes de un lanzamiento que ya ocurrió, mapas de
tablas que ya no existen—. Todo eso ya lo guarda mejor otro sitio: los
comentarios del código, los de las migraciones y los mensajes de commit, que en
este repo son largos a propósito. Repetirlo aquí solo creaba una segunda
versión de la verdad que envejece sin que nadie se entere.

**La regla: aquí solo entra lo que ningún otro sitio registra.** Decisiones
abiertas, trabajo pendiente y restricciones que no se deducen leyendo el código.
Cuando algo se hace, **se quita** — el objetivo es vaciarlo, no engordarlo.

---

## Qué estamos construyendo

La app detrás de elcharcu.co: un **asistente de charcutería con IA** +
**mini-cursos en video**, con suscripción freemium.

- **Motor emocional:** orgullo y control — _"esto lo hice yo, sin químicos, y está sano"_.
- **Miedo nº1:** enfermar a la familia (botulismo, dosis mala de sal de cura, moho).
- **Objeción nº1:** _"¿para qué pago si está gratis en YouTube?"_ + desconfianza
  de las suscripciones en dólares.
- **Respuesta:** ayuda real en el momento de la duda, atada a una persona real.

**Mercado:** Colombia primero (Manizales), LATAM y España después.

**En producción** desde el 2026-08-31: `www.elcharcu.co` (rama `main`), con su
propia base de Supabase. QA es `qa.elcharcu.co` (rama `develop`), base aparte.

---

## Decisiones (DECIDE-INFORMA-AVANZA)

⚠️ **Esta tabla no se borra aunque una decisión quede superada.** El código y las
migraciones citan estos números al vuelo —`D1 D4 D5 D8 D12 D14 D15 D16 D17 D18
D19 D20 D21`—, así que quitar una fila deja huérfano un comentario. Las
superadas se tachan y se apunta quién las sustituye.

| #   | Decisión                                                           | Por qué                                                                                                                                                         |
| --- | ------------------------------------------------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| D1  | **No instalar el SO en `docs/sistema/`**                           | Pedido de Cristian: usar la arquitectura ya instalada y no gastar contexto en eso.                                                                              |
| D2  | **Stack = el que ya está** (Next 15 + FSD + Tailwind)              | Ya existe y ya cumple. Migrar sería destruir trabajo bueno.                                                                                                     |
| D3  | ~~1 receta gratis completa~~ **superada por D14**                  | Cambia la unidad que se cuenta.                                                                                                                                 |
| D4  | ~~Precios en COP~~ **superada por D18**                            | —                                                                                                                                                               |
| D5  | ~~Vender el curso suelto~~ **retirada el 2026-08-31**              | Son mini tutoriales de tres minutos; vender uno suelto no le sirve a nadie. Chocaba con lo que sí funciona: cápsulas gratis llevando a la suscripción.          |
| D6  | ~~Mercado Pago primero~~ **superada por D17**, y D17 por D21       | —                                                                                                                                                               |
| D7  | **Analítica = Mixpanel**                                           | Ya instalado, con autocapture. Evita otra cuenta y otro costo.                                                                                                  |
| D8  | **Español neutro con vocabulario de Colombia** — "tú", nunca "vos" | El mercado es Colombia primero. La capa de España queda para después.                                                                                           |
| D9  | **Ruta de la app: `/asistente`**                                   | Consistente con `/recetas` y `/tablas`, y no rompe el sitio.                                                                                                    |
| D10 | **La IA es Gemini**, no Claude                                     | Decisión de Cristian (2026-08-05). Los topes de seguridad se implementan igual; solo cambia el proveedor.                                                       |
| D11 | **Todo el esquema vive en `charcu`**, nunca en `public`            | Así no choca con otra app que comparta base.                                                                                                                    |
| D12 | **El candado vive en la BASE DE DATOS**, no en la pantalla         | Triggers y RLS deciden. Desde el navegador no se puede burlar. _"La puerta vive en la base."_                                                                   |
| D13 | **Login por enlace al correo**                                     | Lo único que funciona sin configurar nada ni gastar dinero. SMS y Google se suman después sin rehacer nada.                                                     |
| D14 | **El asistente vive en la PORTADA**                                | Que el visitante pruebe el producto en el primer segundo, sin leer nada ni registrarse. **El producto ES el argumento de venta.**                               |
| D15 | **El plan se mide en PREGUNTAS e IMÁGENES**, no en recetas         | Es la unidad que el usuario entiende y la que de verdad cuesta dinero.                                                                                          |
| D16 | **Muro blando: se pide el correo en la SEGUNDA pregunta**          | En el momento de máximo interés —ya vio que funciona— y sin pedir contraseña. Se movió de la primera a la segunda el 2026-08-31: la primera es la demostración. |
| D17 | ~~Hotmart cobra; los videos en Bunny~~ **superada por D21**        | Bunny sigue siendo el video. Lo que cambia es el cobro.                                                                                                         |
| D18 | **Precios: US$ 9,99 al mes · US$ 89,90 al año**                    | Decisión de Cristian (2026-08-14) tras advertirle el riesgo: el propio spec dice que la desconfianza a los dólares es la objeción nº1. ⚠️ Choca con D21.        |
| D19 | ~~Un chat = una receta, ilimitadas de pago~~ **superada por D20**  | La receta la crea la PRIMERA pregunta (opción B): pedir un formulario antes de escribir reintroduce el muro que quitó D14.                                      |
| D20 | **Las recetas se CUENTAN pero no topan, en ningún plan**           | Una receta es una fila de 300 bytes; lo que cuesta son preguntas y fotos. `recipes_used` se sigue guardando: dice cuántos curados lleva alguien.                |
| D21 | **El cobro pasa a OnePay** (`api.onepay.la`), pasarela colombiana  | Decisión de Cristian (2026-08-29). Comisión local, cobro en pesos, PSE y Bre-B — ataca de frente la objeción de las suscripciones en dólares.                   |

---

## Lo que falta

### 🔴 El negocio todavía no cobra

`charcu.subscriptions` está **vacía en producción** (comprobado el 2026-09-01), y
`has_active_subscription` y `effective_plan` leen de ahí. Así que hoy **todo el
mundo es `aprendiz`** y ningún curso de pago es visible para nadie.

No está sin usar: está esperando la pasarela. Mientras tanto, los botones de los
planes abren WhatsApp con el plan escrito y la suscripción se activa a mano.

**OnePay (D21)** está investigado pero sin integrar: falta el KYC, el SDK de
Elements, el 3DS y el webhook.

📌 La investigación de su API —autenticación, endpoints, planes, 3DS, webhook—
son 167 líneas que se leyeron el 2026-08-29 y que **no están en el código porque
todavía no hay código**. Se quedaron en la versión larga de este archivo:
`git show 6a644b2:ESTADO.md`, sección _"1. Pagos — OnePay"_. Cuando se empiece a
integrar, o se recuperan de ahí o se releen de su documentación. ⚠️ **OnePay solo cobra en COP y D18 fija los
precios en dólares** — hay que decidir el precio en pesos antes de crear el plan.

### 🔴 `knowledge` está vacía y nadie la lee

La tabla existe, con RLS y cero políticas de lectura a propósito, y
`search_knowledge` es solo para `service_role`. Pero está **vacía** y
`/api/asistente` **no la consulta**. Es el único punto del plan de lanzamiento
que nunca se hizo.

Desde el 2026-09-01 el asistente sí conoce la receta que la persona está
leyendo (se le inyecta desde el slug), lo cual cubre buena parte de lo que
`knowledge` iba a resolver. Habría que decidir si sigue teniendo sentido o si lo
que hace falta es otra cosa.

### 🟡 Los CTA dentro de las recetas — fases pendientes

La fase 1 y la 1.1 están hechas: dos dudas por receta y El Charcu en un panel
sobre la receta, anclado a ella.

- **Fase 2 · decisión de Cristian.** Hoy las frases de las dudas salen solas del
  contenido, sin escribir nada a mano. Falta decidir si redacta a mano las de sus
  recetas con más tráfico (campo opcional que sobrescribe; unas cinco, no 45).
- ~~**Fase 3 · medir.**~~ Hecha el 2026-09-01. `recipe_doubt_tapped` (con el
  hueco), `recipe_assistant_opened` (con el `via`), `lead_wall_shown`, y `place`
  - `recipe_slug` en `lead_captured`. El denominador es `recipe_detail_view`,
    que ya existía. ⚠️ **Falta confirmarlo en Mixpanel Live View sobre QA**: se
    comprobó que tocar una duda dispara una petición a Mixpanel, pero desde el
    navegador no se pudo leer el cuerpo para verificar las propiedades.
- **Fase 4 · el cierre al final de la receta.** La cápsula relacionada o el plan.
  La duda es _ayuda_; esto es _oferta_. Van separadas a propósito.
- **Fase 5 · el tope de gasto, a conciencia.** `checkBudget()` se comprueba
  ANTES de mirar la sesión, así que al agotarse el presupuesto diario se agota
  **para todos, incluido quien paga**. Con 45 recetas indexadas empujando
  preguntas gratis, esto pasa de teórico a probable. Va después de medir.

### 🟡 Volver a la receta desde el enlace del correo

Hoy el enlace del correo siempre cae en `/charcu`, así que quien deja su correo
leyendo una receta entra a la app y **pierde de vista lo que estaba haciendo**.
Debería volver a esa receta.

⚠️ **El mecanismo ya existe, solo está fijo.** `sendAccountLink` escribe
`emailRedirectTo: …/auth/callback?next=%2Fcharcu` a pelo, y `/auth/callback` ya
lee `next` y lo pasa por `safeNext`, que es la guarda contra el redirect abierto
—un `next` que llega por correo y se pega detrás del origen convierte
`//otro-sitio.co` en una redirección a otra casa—. Falta pasar la ruta actual en
vez de la constante.

Dos cosas a decidir al hacerlo:

- **Qué pasa con la conversación anónima.** Cuelga de la cookie de ese
  navegador: si abre el enlace en el teléfono habiendo preguntado en el
  computador, vuelve a la receta pero sin el hilo. Ya está aceptado, pero al
  volver a la receta se va a notar más.
- **`safeNext` tiene que seguir mandando.** La ruta viaja por correo, así que es
  entrada de fuera aunque la escribamos nosotros.

### 🟡 Los cursos en la portada no invitan a nada

La sección de cursos del home debería invitar a entrar y enseñar el curso
gratuito, en vez de quedarse en catálogo.

⚠️ **Y hay que aclarar cuál.** Cristian lo pidió como "el curso gratuito de
**Jamón curado**" (2026-09-01) y ese curso NO existe. Comprobado en producción:

| lo que hay                                     | qué es                                                         |
| ---------------------------------------------- | -------------------------------------------------------------- |
| `lomo-curado` · "Lomo de cerdo curado"         | el ÚNICO curso publicado, 7 lecciones, el único con video real |
| `bridar-un-jamon` · "Cómo bridar un jamón"     | una CÁPSULA de 2 lecciones, no un curso                        |
| longaniza, santarrosano, paisa, chorizo de ajo | los cuatro en lista de espera, sin grabar                      |

Lo más probable es que se refiera al **lomo curado**, que es el que está
publicado y grabado. Pero "jamón" aparece en la cápsula de bridar, así que no se
adivina: hay que preguntarle antes de construirlo.

### 🟡 Contenido, que solo puede dar Cristian

- Los **videos** reales: 4 de las 5 cápsulas y los 4 cursos en lista de espera
  (4 esperando en producción). Hoy las cápsulas son texto.
- El **carrusel de imágenes** como tipo de lección (`kind = 'carrusel'`),
  aplazado por él.

### ⚠️ Revisar el salami de res — lo más urgente de esta lista

`salami-de-res.json` se publicó **sin que Cristian revisara las cantidades**, y
es el contenido de más riesgo del sitio: lleva sal de cura #2 y las cifras se
cruzaron contra fuentes, no contra su criterio.

Desde el 2026-09-01 **pesa más**: con la receta inyectada en el prompt, El Charcu
repite esas cantidades **citándolas como lo que dice la receta**. Le puso un
altavoz a un número sin revisar.

### 🟢 Sueltos

- **Borrar las cookies sigue regalando una pregunta gratis** (~0,0055 USD cada
  vez). No es un fallo: es el precio de que la demostración no pida cuenta
  (D14). **Antes de gastar trabajo en taparlo hay que medir si alguien lo hace
  de verdad** — hoy no hay ninguna medición.
- **`QuotaWall` quedó sin usar** y sigue exportado. Lo sustituyó `QuotaNotice`.
- **`FreeSession` es una pantalla de transición** que sobrevive a su modelo. Se
  va cuando exista "Mis recetas" de verdad.

---

## Reglas de trabajo

**Migraciones a producción, solo con el visto bueno de Cristian.** Una migración
nueva se aplica **solo a QA** (`lcvmsbfnnpviumsqcxip`). A producción
(`dpooajrgqjwetttberdo`) no entra ninguna sin que él lo apruebe, cada vez — vale
igual para un `drop table` que para añadir una columna.

```bash
npx supabase migration new nombre_en_snake_case
npx supabase link --project-ref lcvmsbfnnpviumsqcxip && npx supabase db push
```

**Un cambio de esquema = un archivo nuevo.** Nunca SQL suelto en el panel, y
nunca por el MCP (además rompe las tildes). Toda migración tiene que aguantar un
`db push` sobre una base vacía.

**En Vercel, una variable `NEXT_PUBLIC_*` NO puede ser _Sensitive_.** Va como
Config / Plain. Next las sustituye por su valor **al compilar**, y las Sensitive
no existen durante la compilación: quedan vacías en el navegador y en el
servidor. Costó una mañana. `/api/salud` dice qué configuración ve cada
despliegue.

**Ninguna clave se pega en el chat.** Van a `.env.local`, que no se sube. Si
alguna vez se pega una, hay que rotarla.

**Antes de `pnpm build`, parar el servidor de desarrollo.** El build reescribe
`.next` y deja al servidor sin sus archivos. Si pasa: parar, `rm -rf .next`,
arrancar otra vez.

**`git push` NO despliega nada** por sí solo, y no hay forma de avisar al
celular. "Subido" y "desplegado" no son lo mismo.

---

## Dónde está lo que ya no está aquí

- **Por qué algo se hizo así** → el comentario de cabecera del archivo o de la
  migración. Son largos a propósito.
- **Qué pasó y cuándo** → `git log`. Los mensajes de commit llevan el problema,
  la causa y cómo se comprobó.
- **Qué hay en la base** → la base. Un mapa de tablas escrito a mano envejece
  mal: el que había aquí seguía documentando `leads`, `onboarding_answers`,
  `videos` y `saved_recipes`, y las cuatro llevaban tiempo borradas.
