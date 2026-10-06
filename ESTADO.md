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

**OnePay (D21)** está investigado pero sin integrar. La primera lectura
(2026-08-29) sigue en `git show 6a644b2:ESTADO.md`, sección _"1. Pagos —
OnePay"_: autenticación, estados y las reglas del webhook siguen valiendo.

### 🟠 Miniplan — suscripciones con OnePay (empezado el 2026-09-27)

**Lo que cambia respecto a agosto: el bloqueo nº1 desaparece.** Entonces se
creía que el `card_id` solo salía de integrar el SDK Elements + 3DS en nuestro
frontend. No: OnePay tiene **Links de Captura** (`POST /connect-links`), una
página alojada en `pagos.onepay.la` donde el cliente mete tarjeta, cuenta o
Nequi, y nos avisa con el webhook `connect_link.completed`. Nada de PCI ni de
SDK de nuestro lado.

**El flujo, de punta a punta:**

```
[Suscribirme] ─► formulario corto (cédula; nombre y WhatsApp ya los tenemos)
   ─► POST /api/pagos/onepay/checkout   (servidor, sk_* por env)
        1. POST /customers         (una vez por persona; se guarda el id)
        2. POST /connect-links     (single_use, external_id = user_id)
   ─► redirect a pagos.onepay.la/connect-link/…  ─► vuelve a /asistente/suscripcion
webhook connect_link.completed
   ─► POST /subscriptions  (customer_id + price_id + card_id|account_id)
webhook subscription.active|paid|unpaid|pass_due|frozen|canceled|finished
   ─► UPDATE charcu.subscriptions  (status, current_period_end)
```

**Fases, en orden.** Cada una se puede cerrar y probar sola.

1. **Cuenta y contrato** — KYC aprobado, claves `sk_test`/`sk_live`, webhook
   creado en el panel (el `secret` se ve UNA vez). Pedirle a soporte **el cuerpo
   real de `POST /subscriptions`** y qué métodos tiene habilitados la cuenta
   (`allows`). _Solo Cristian._
2. **Catálogo** — un producto por plan (Pro, Maestro) y **cuatro precios** con
   `lookup_key` estable (`pro_mensual`, `pro_anual`, `maestro_mensual`,
   `maestro_anual`), creados una sola vez con un script, no en caliente. El
   código apunta al `lookup_key`, no al id: los precios son inmutables y así se
   cambia el monto sin redesplegar.
3. **Base** (migración, solo QA) — en `charcu.subscriptions`: `provider`,
   `provider_customer_id`, `provider_subscription_id`, `provider_payment_method_id`.
   Tabla `charcu.payment_events` (cuerpo crudo + clave única armada: tipo de
   evento + id del recurso; en `connect_link.completed`, además el
   `payment_method.id`). Tabla o columnas para el checkout pendiente: qué
   `lookup_key` eligió quien abrió el link. Todo lo escribe solo `service_role`
   (D12).
4. **Cliente tipado** — `src/shared/api/onepay/`, cero `any`, `x-idempotency`
   en todo POST, respuestas validadas con type guards (el doc y la API no
   siempre coinciden: ver abajo).
5. **Webhook** — `POST /api/pagos/onepay/webhook`: cuerpo crudo, `x-webhook-token`
   siempre y `Signature` (HMAC-SHA256 hex) si hay secret, en tiempo constante.
   Guardar el evento, contestar 200 en <10 s y procesar con `after()`. Rechazar
   eventos con `event.environment` que no toca (un `test` en producción).
6. **Checkout** — botón de `QuotaWallPlans`/`Pricing`, formulario de cédula,
   ruta de checkout, página de vuelta que diga _"estamos confirmando tu pago"_
   hasta que llegue el webhook (el `redirect_url` NO prueba que pagó).
7. **Cancelar desde la app** — `DELETE /subscriptions/{id}`, conservando el
   acceso hasta `current_period_end`. El plan ya promete _"cancelas cuando
   quieras, desde la app"_.
8. **Migrar a las de `rail = 'whatsapp'`** y quitar el WhatsApp de los botones.

**Mapa de estados** (el de agosto, sin cambios): `active`/`paid` → `active` ·
`unpaid`, `frozen` → `past_due` · `pass_due`, `canceled`, `finished` → `canceled`.
`current_period_end` se mueve con cada `subscription.paid`.

**⚠️ Decisiones que faltan — de Cristian, antes de la fase 2:**

- **Los cuatro precios en COP.** OnePay solo cobra en pesos y D18 los tiene en
  dólares. Esto sustituye a D18: cuando se decida, entra como D22.
- **Cómo se hace el anual.** `POST /prices` solo acepta `interval: day | month`
  (`year` devuelve 422). Anual = `month` con `interval_count: 12`, pero hay que
  confirmar con soporte que se cobra **una vez** y no doce.
- **Pedir la cédula.** `POST /customers` exige `document_type` + `document_number`
  y teléfono con prefijo. Es fricción nueva justo antes de pagar; no se puede
  esquivar.
- **Prueba gratis sí o no** (`trial_period_days` en el precio).

**⚠️ La documentación de OnePay está en obras, y se contradice:**

- La página "Crear suscripción" avisa ella misma de que su cuerpo **ya no se
  acepta**: hoy pide `plan_id` **o** `price_id`, `customer_id`,
  `payment_method_type` y `payment_method_id` — pero la introducción de la
  misma sección usa `card_id`. Hay que probar en `sk_test` cuál vale.
- La página "Crear plan" es **una copia de la de crear cliente**. Por eso el
  plan va con productos + precios, que sí están documentados y son más nuevos.
- Los estados salen en minúscula en unas páginas y en MAYÚSCULA en otras: se
  normalizan antes de comparar.
- La guía de webhooks lista solo tres eventos de suscripción; la referencia
  (`/client/webhooks/index`) tiene los ocho. Manda la referencia.
- Un 4xx nuestro dispara reintentos, pero la reconciliación lo da por
  definitivo. Un endpoint que falla seguido **se desactiva solo** y lo que pasa
  mientras está apagado no se reenvía.

### 🟠 Rediseño de la app — lo que quedó pendiente (2026-10-03)

Mis cursos, búsqueda, Cursos maestros, El Charcu y Mi cuenta ya siguen
`design-refs/`. Lo que falta, y por qué:

- **Aplazado por Cristian: el estado de la receta (M3) y el contrato
  estructurado con Gemini.** Sin ellos no hay "2 kg · Paso 2 de 6 · Adobar"
  ni la barra de segmentos en la cabecera, ni la tarjeta de ingredientes con
  −/+, ni quick replies, ni el grupo "Dudas sueltas" en Mis recetas (hoy solo
  En proceso / Terminadas, por `recipes.status`). La propuesta está en el plan
  del rediseño: `responseSchema` de Gemini, validado con type guards, y las
  dosis de la tarjeta auditadas contra `MAX_CURE_1_G_PER_KG`.
- **Migraciones solo en QA: 0029, 0030, 0031 y 0032.** Ninguna está en producción.
  - **0029**: categoría y técnicas de cada curso. El relleno es una propuesta
    por slug **para revisar**: la longaniza va en "Embutidos frescos" (su
    resumen lo dice) y bridar un jamón en "Jamones curados".
  - **0030**: `course_requests` ("Quiero un curso de…" y "Propón un curso").
  - **0031**: los tres avisos del perfil.
- **Los avisos no envían nada.** Recordatorios de pasos, cursos nuevos y el
  correo de novedades solo guardan la preferencia: no existe ningún canal.
- **Avísame sigue cerrado a quien no paga (0021).** Al usuario gratis se le
  explica que la lista es de El Charcu Pro. Con `subscriptions` vacía en
  producción, hoy nadie puede apuntarse desde la app.
- **Fotos de los cursos.** Encendidas. Las de `public/curso/` se comprimieron
  al estándar (600 px, calidad 65) y el paisa toma prestada la del chorizo
  parrillero (0032, solo QA). Las cápsulas no llevan foto: la maqueta no la
  pinta.
- **"Gestionar plan" y "Pagos y facturas" abren WhatsApp** hasta que exista
  OnePay.
- **Escritorio con una receta en curso** queda con la columna de recetas y
  la conversación; la vista de 3 columnas con "Ficha" está fuera de alcance.
- **Los e2e** (`pnpm test:e2e`) corren contra QA con dos cuentas de prueba
  (`e2e-gratis@`, `e2e-pro@elcharcu.test`) y la IA simulada, en el Chrome
  instalado: la 1.63 de Playwright ya no trae Chromium para macOS 13.

### 🟡 Un hueco conocido en la auditoría de seguridad

Los dos falsos positivos del 2026-09-14 están cerrados. Queda uno, y es
**preexistente** —comprobado contra el código anterior, no lo introdujo el
arreglo—: el patrón exige que el número vaya ANTES de "por kilo", así que

```
"Por kilo lleva 7 g de sal de cura #1, 1,2 g de pimienta…"
```

se escapa. Cerrarlo pide un segundo patrón en orden inverso, y cada
ensanchamiento de esta regla crea aristas nuevas: el primer intento de arreglo
de ese día introdujo **tres falsos negativos** que solo se vieron por la matriz
de casos.

⚠️ **Antes y después de tocar `cure-safety`:**

```bash
npx tsx scripts/comprobar-seguridad.ts
```

En ese módulo, pasarse de preciso es peor que pasarse de ancho.

### 🔴 `knowledge` está vacía y nadie la lee

La tabla existe, con RLS y cero políticas de lectura a propósito, y
`search_knowledge` es solo para `service_role`. Pero está **vacía** y
`/api/asistente` **no la consulta**. Es el único punto del plan de lanzamiento
que nunca se hizo.

Desde el 2026-09-01 el asistente sí conoce la receta que la persona está
leyendo (se le inyecta desde el slug), lo cual cubre buena parte de lo que
`knowledge` iba a resolver. Habría que decidir si sigue teniendo sentido o si lo
que hace falta es otra cosa.

### 🟡 Las dudas de las recetas, escritas a mano

Las cinco fases de los CTA están hechas. Lo único que quedó abierto es una
decisión: hoy las cuatro preguntas de cada receta se generan de sus datos
—rendimiento, tipo de sal de cura, semanas de curado— y salen específicas sin
escribir nada. El campo `doubts` del JSON permite escribir a mano la que se
quiera y esa gana.

**Falta decidir si merece la pena** redactar a mano las de las recetas con más
tráfico. Unas cinco, no 45. Y para saber cuáles son hace falta que corra la
medición unos días.

### ⚠️ Tres cosas que el sistema hace y conviene no olvidar

Salen de las fases 3, 4 y 5. No son pendientes: son cómo se comporta.

- **Publicar un curso no se refleja en las recetas hasta el siguiente
  despliegue.** Qué cursos están grabados se lee al COMPILAR, para no volver
  dinámicas las 45 recetas. Falla del lado seguro —deja de ofrecer algo que
  existe, nunca ofrece algo que no— pero grabar la longaniza y publicarla **no
  basta**: hay que redesplegar.
- **Los dos presupuestos de IA son globales POR PÚBLICO, no por persona.** Un
  solo suscriptor puede agotar el de `pro` para los demás. Hoy da igual porque
  `subscriptions` está vacía; cuando haya varios pagando hay que decidir si el
  tope pasa a ser por cuenta.
- **`lead_captured` no es "contacto nuevo".** El muro le sale a cualquiera sin
  sesión, así que quien vuelve tras cerrar sesión queda contado. Los contactos
  nuevos de verdad son `account_created`.

### 🟡 Responder desde `chat_messages` sin ir a Gemini — descartado por ahora

Cristian lo propuso el 2026-09-01 para ahorrar. Medido antes de construirlo:
**producción tiene 4 preguntas y 0 repetidas**; QA tiene 32 con 4 repetidas, y
esas 4 son pruebas repetidas a mano. Hoy no ahorraría nada.

⚠️ Y el problema no es solo que no sirva. Estas tres son la MISMA duda escrita
distinto: _"¿cuánta sal de cura por kilo?"_, _"¿cuántos gramos de sal de cura #2
por kilo?"_, _"¿cuánta sal de cura #2 uso para 2 kg de bondiola?"_. Una caché
exacta no atrapa ninguna —son cadenas distintas— y una difusa las atrapa todas,
pudiendo contestar una pregunta de **#2 con la respuesta de #1**, que es
justamente la distinción de la que depende la seguridad. **La caché es o inútil
o peligrosa.**

Además el 47% de las preguntas llevan números (_"mi bondiola pesa 1,8 kg"_) y la
respuesta se calcula para ESOS kilos. Servirla a otro es un error de dosis.

Se revisa si algún día el gasto duele y hay repeticiones reales medidas. La
condición mínima para volver a mirarlo: misma receta, sin foto, sin números,
primer turno de la conversación, y la respuesta sin ninguna dosis dentro.

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
| `bridar-un-jamon` · "Cómo bridar un jamón"     | una CÁPSULA de 4 lecciones (2 en video), no un curso           |
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

### 🔴 El asistente no sabe qué está haciendo quien le escribe en la app

Dentro de `/charcu` va `recipe: null`: el único contexto viene del `recipeSlug`,
o sea solo desde las 45 páginas del sitio. Lo llevaba `product`, retirada el
2026-09-01 con el agujero de inyección — y nada la reemplazó por ese camino.
**29 de 29 sesiones con `product` en null, y otras 29 con `summary` en null.**

Se vio con Julieth el 2026-09-14. Diagnóstico, arreglos y el plan de "recetas de
la comunidad" que Cristian quiere encima de esto:
**[docs/plan-recetas-de-la-comunidad.md](docs/plan-recetas-de-la-comunidad.md)**.

### 🟠 El Charcu ya recomienda cursos — lo que quedó pendiente (2026-10-04)

Desde el 2026-10-04 el prompt lleva el catálogo de cursos, cápsulas, recetas y
la suscripción, y la receta de la casa que alguien nombra sin tenerla abierta
(casos de Felipe y Ana, ver `catalogAnchor.ts`). Falta:

- **No sabe lo que esa persona ya hizo.** Le puede recomendar una cápsula que
  ya terminó: a Felipe le volvería a ofrecer "Qué saber de la sal de cura", que
  completó entera. Hay que pasarle su avance (`progressByCourse` /
  `completedLessonIds`) para que recomiende lo SIGUIENTE.
- **Los nombres de cursos en el chat no se pueden tocar.** `MessageBubble` solo
  pinta negritas, no enlaces; el Charcu nombra el curso y la persona tiene que
  ir a buscarlo a Cursos. Un enlace directo a `/cursos/<slug>` cerraría el
  camino (el catálogo del prompt tendría que llevar el slug).
- **No siempre reconoce que la otra opción también vale.** En la prueba con la
  pregunta de Ana (seco vs. salmuera en un jamón cocido) ya contesta con el
  método de la receta, pero no admite que la salmuera también es válida, que
  era justo lo que ella planteaba. El prompt se lo pide; el modelo no siempre.
- **Medir si funciona:** en unos días, revisar en producción cuántas
  conversaciones nombran un curso y si después hay `lesson_progress` de esa
  persona en ese curso.

### 🟡 Los e2e de CI fallan a ratos, y no por el código (2026-10-06)

En el PR #25 fallaron 8 tests de escritorio con el mismo síntoma: tras un
clic en un enlace (buscador, menú, "Ver todos", "Continuar lección") la URL
**no cambia** y el servidor ni siquiera recibe la petición. La navegación no
llega a arrancar en el navegador.

No era el cambio: los mismos tests pasaron en local con el mismo código y la
misma base de QA, y en CI pasaron al relanzarlos sin tocar nada. Y no es
nuevo: el 2026-10-03, mientras se montaba el CI, ya fallaban igual otros tests
(`busqueda.spec.ts:27`, "Próximos" de cursos maestros), en móvil y escritorio.

Sin causa todavía. Ojo: no es solo `next dev`. Esos fallos del 2026-10-03
fueron ANTES de db9b7af, que es cuando los e2e pasaron a `next dev`, o sea que
ya pasaba con el build. Lo que sí se repite: en CI el escritorio corre DESPUÉS
de los ~10 min de móvil sobre el mismo servidor, y en local un `next dev` que
llevaba rato encendido también se quedó sin archivos de `.next` (ENOENT) y dejó
de navegar. Otra pista a mirar: que el clic llegue antes de que la página
termine de hidratar.

Mientras no se arregle, **bloquea PRs a main de vez en cuando**; el remedio de
hoy es relanzar el trabajo fallido (`gh run rerun <id> --failed`). Para
investigarlo: el informe de Playwright de la corrida 37411457358 tiene las
trazas, y probar con `next build && next start` o un servidor por proyecto.

### 🟢 Sueltos

- **Borrar las cookies regala DOS preguntas gratis** (~0,011 USD la tanda,
  desde que el muro pasó de 1 a 2 el 2026-09-01). No es un fallo: es el precio
  de que la demostración no pida cuenta (D14), y ahora lo acota el presupuesto
  diario de `lead`. **Antes de gastar trabajo en taparlo hay que medir si
  alguien lo hace de verdad** — hoy no hay ninguna medición.
- **Los fallos del servidor solo viven en los logs de Vercel**, que se purgan.
  Datadog se planteó y Cristian lo aparcó el 2026-09-01. No queda nada a medias:
  `reportError` / `reportWarning` ya centralizan todo fallo técnico en JSON, así
  que el día que haga falta un proveedor se cablea **en ese único archivo**.
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
