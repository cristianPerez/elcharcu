# ESTADO — El Charcu (plataforma)

Memoria viva del proyecto. Se actualiza al cerrar cada etapa.
Última actualización: 2026-08-29 — ver el **PLAN MAESTRO DE LANZAMIENTO** al final

---

## Qué estamos construyendo

La **app** que va detrás de elcharcu.co: un **asistente de charcutería con IA** +
**mini-cursos en video**, detrás de una suscripción freemium.

Dos cosas, y nada más:

1. Un asistente que ayuda **en el momento exacto de la duda** (durante el curado,
   la preparación o la cocción).
2. Mini-cursos cortos en video, uno por receta.

Todo lo demás es soporte.

- **Motor emocional #1:** orgullo + control — _"esto lo hice yo, sin químicos, y está sano"_.
- **Miedo #1:** enfermar a la familia (botulismo, dosis mala de sal de cura, moho peligroso).
- **Objeción #1:** _"¿para qué pago si está gratis en YouTube?"_ + desconfianza de
  suscripciones en dólares.
- **Contra-argumento #1:** ayuda personalizada en tiempo real atada a una persona
  real (Cristian, El Charcu) — no "recetas de IA".

**Mercado:** Colombia primero (Manizales), LATAM y España después.

---

## Lo que YA estaba instalado (no se toca, se reutiliza)

Verificado en el repo el 2026-08-04:

| Pieza            | Estado                                                                              |
| ---------------- | ----------------------------------------------------------------------------------- |
| Next.js 15       | ✅ App Router, `src/app`                                                            |
| TypeScript       | ✅ strict al máximo (`exactOptionalPropertyTypes`, `noUncheckedIndexedAccess`)      |
| Tailwind 3       | ✅ con la paleta de la Guía de Marca ya en `tailwind.config.ts`                     |
| Tipografía       | ✅ Fraunces (serif) + Inter (sans) vía `next/font`                                  |
| Arquitectura FSD | ✅ `app → views → widgets → features → entities → shared`, con ESLint que la vigila |
| Calidad          | ✅ ESLint + Prettier + Husky (pre-commit con `type-check`)                          |
| Analítica        | ✅ Mixpanel (`NEXT_PUBLIC_MIXPANEL_TOKEN` ya configurado)                           |
| Sitio público    | ✅ `/`, `/recetas`, `/recetas/[slug]`, `/tablas`, `/tablas/[slug]`, `/tienda`       |
| Cursos           | ✅ 5 cursos, 23 módulos, 60 lecciones. Solo el lomo tiene videos reales             |

**Tokens de marca ya disponibles como clases Tailwind:**
`forest` (#2D4A3E) · `terracota` (#C17A5A) · `cream` (#F4F1EB) · `sage` (#7A9E8E) ·
`cocoa` (#1E1612) · `font-serif` · `font-sans` · `tracking-eyebrow` · `.bg-grain`

**Kit UI compartido:** `Container`, `Eyebrow`, `ButtonLink`, `Logo`, `SearchBar`.

### Lo que NO está instalado todavía

- ✅ Supabase: librerías, código, esquema aplicado y tipos generados. Conectado y probado.
- ✅ Gemini conectado (`gemini-3.6-flash`), sin SDK: llamada directa desde el servidor
- 🔜 Pasarela: **Hotmart** (D17). El producto lo está configurando Cristian; el
  webhook que activa la suscripción todavía no existe (paso 7).
- ✅ Video: **Bunny** conectado (biblioteca 733344) con los 6 videos del lomo curado.
- ❌ Librería de animación: no hay ninguna. La capa 5 del rescate visual la necesita.
- ❌ PWA (instalable en el celular)
- ✅ Despliegue: **Vercel escucha a `develop`** y lo sirve en `qa.elcharcu.co`
  (2026-08-19). Producción (`main` → elcharcu.co) todavía no se ha usado.

---

## Decisiones tomadas (DECIDE-INFORMA-AVANZA)

Cada una es reversible. Si alguna no te gusta, se cambia.

| #   | Decisión                                                                                                   | Por qué                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       |
| --- | ---------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| D1  | **No instalar el SO en `docs/sistema/`**                                                                   | Pedido explícito de Cristian: usar el proyecto y la arquitectura ya instalados y no gastar contexto en eso. Sigo el rol y la secuencia maestra de memoria.                                                                                                                                                                                                                                                                                                                                                                                                                                    |
| D2  | **Stack = el que ya está** (Next 15 + FSD + Tailwind)                                                      | Ya existe, ya cumple el spec (Next App Router + TS + Tailwind) y ya tiene los tokens de marca. Migrar sería destruir trabajo bueno.                                                                                                                                                                                                                                                                                                                                                                                                                                                           |
| D3  | ~~**Monetización = 1 receta gratis completa**~~ **SUPERADA por D14** (2026-08-05)                          | Fue la regla del spec original. Cristian la cambia por un plan medido en preguntas e imágenes, con captura de datos tras la primera pregunta. Lo construido sigue sirviendo; cambia la unidad que se cuenta.                                                                                                                                                                                                                                                                                                                                                                                  |
| D4  | ~~**Precios PROPUESTOS en COP**~~ **SUPERADA por D18** (2026-08-14)                                        | Mercado colombiano; suscripción en dólares es una objeción documentada. Mensual $29.900 · Anual $239.000 (2 meses gratis) · Curso suelto $89.000.                                                                                                                                                                                                                                                                                                                                                                                                                                             |
| D5  | ~~**Vender también el curso suelto**~~ **RETIRADA el 2026-08-31**                                          | Era cierto para un CURSO. Lo que hay son mini tutoriales de tres minutos, y vender uno suelto no le sirve a nadie —ni a quien paga ni a quien cobra—. Además chocaba con el modelo que sí funciona: la ruta de cápsulas gratis llevando a la suscripción. Y la sección llevaba meses prometiendo "Disponible al lanzar" en las dos pantallas de venta; se lanzó sin ella, así que era una promesa vencida.                                                                                                                                                                                    |
| D6  | ~~**Pasarela: Mercado Pago primero**~~ **SUPERADA por D17** (2026-08-14)                                   | Métodos locales de Colombia. Sigue siendo el destino a futuro, pero no es por donde se lanza.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 |
| D17 | **Hotmart cobra la suscripción; los videos van en Bunny**                                                  | Decisión de Cristian (2026-08-14). Hotmart resuelve la recurrencia sin escribir código (cobro, tarjeta rechazada, reintentos, reembolsos, impuestos) a cambio de ~11% contra ~7% de Mercado Pago. Bunny aloja el video, así que NO se usa Hotmart Club. Se migra a Mercado Pago cuando el volumen justifique el trabajo; la interfaz de pago sigue siendo intercambiable.                                                                                                                                                                                                                     |
| D18 | **Precios en DÓLARES: US$ 9,99 al mes · US$ 89,90 al año**                                                 | Decisión de Cristian (2026-08-14), reafirmada tras advertirle el riesgo. Ojo: el propio spec documenta que la desconfianza hacia las suscripciones en dólares es la objeción nº1 de este mercado, y US$ 9,99 son ~$39.960 COP — un 34% más que los $29.900 anteriores. El anual son 9 mensualidades: se regalan 3 meses (25%). El copy "pagas en pesos, nada en dólares" se retiró de toda la web porque había quedado falso.                                                                                                                                                                 |
| D19 | ~~**Un chat = una receta. Recetas ILIMITADAS de pago, 1 en el gratis**~~ **SUPERADA por D20** (2026-08-20) | Decisión de Cristian (2026-08-15). Una receta cuesta 0 —una fila de 300 bytes— y el gasto real ya lo frenan preguntas y fotos. Cobrarlas además empujaría a meter dos curados en un mismo chat para ahorrarse una, que es justo el dato que arruina los insights. El plan gratis sí lleva 1, porque ahí la receta ES el producto. La receta la crea la PRIMERA pregunta (opción B): pedir un formulario antes de escribir reintroduce el muro que quitó D14.                                                                                                                                  |
| D20 | **Las recetas se CUENTAN pero no topan, en ningún plan**                                                   | Decisión de Cristian (2026-08-20), tras un fallo real en el celular. El tope de recetas prometía una cosa y hacía otra: el muro decía "una receta A LA VEZ" pero el contador contaba CREACIONES DEL MES, así que cerrar una no liberaba nada. Y no era el tope que protege el bolsillo — una receta es una fila de 300 bytes; lo que cuesta dinero son preguntas y fotos, que siguen topadas (8 y 2 en el gratis). `recipes_used` se sigue guardando a propósito: dice cuántos curados distintos lleva alguien, aunque no cierre ninguna puerta. Se revierte con un `UPDATE` a `plan_quotas`. |
| D7  | **Analítica = Mixpanel** (el que ya está), no agrego otra                                                  | Ya instalado y con autocapture. Evita otra cuenta y otro costo.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               |
| D8  | **Español neutro con vocabulario Colombia** — "tú", no "vos"                                               | El spec manda Colombia-first. Por eso la frase del muro es _"Salva tu próximo kilo de carne"_, no la variante rioplatense del borrador. Capa España queda para después.                                                                                                                                                                                                                                                                                                                                                                                                                       |
| D10 | **La IA es Gemini (Google), no Claude**                                                                    | Decisión de Cristian el 2026-08-05, en contra de lo que decía el spec original. `.env.local` ya está preparado para Gemini. Los topes de seguridad de la sal de cura y la lectura de fotos de moho se implementan igual, solo cambia el proveedor.                                                                                                                                                                                                                                                                                                                                            |
| D11 | **Todo el esquema vive en `charcu`, no en `public`**                                                       | Así El Charcu nunca choca ni se mezcla con otra app que comparta base.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        |
| D12 | **El candado y la puerta de cursos viven en la base de datos**                                             | Un trigger rechaza la segunda receta sin suscripción, y las políticas RLS deciden qué videos se entregan. Desde el navegador ya no se puede burlar.                                                                                                                                                                                                                                                                                                                                                                                                                                           |
| D14 | **El asistente vive en la PORTADA** (`/`), no detrás de una landing                                        | Pedido de Cristian (2026-08-05). Que el visitante pruebe el producto en el primer segundo, sin leer nada ni registrarse. El producto ES el argumento de venta.                                                                                                                                                                                                                                                                                                                                                                                                                                |
| D15 | **El plan se mide en PREGUNTAS e IMÁGENES**, no en recetas                                                 | Pedido de Cristian (2026-08-05). Es la unidad que el usuario entiende y la que de verdad cuesta dinero (cada pregunta gasta tokens de Gemini; cada imagen gasta bastante más).                                                                                                                                                                                                                                                                                                                                                                                                                |
| D16 | **Muro blando tras la 1ª pregunta: nombre, correo y WhatsApp**                                             | Pedido de Cristian (2026-08-05). Captura el contacto en el momento de máximo interés —ya vio que funciona— y sin pedir contraseña. WhatsApp es el canal real de venta de El Charcu.                                                                                                                                                                                                                                                                                                                                                                                                           |
| D13 | **Login por enlace al correo primero**                                                                     | Es lo único que funciona sin configurar nada más ni gastar dinero. Teléfono/SMS necesita un proveedor que se paga por mensaje, y Google necesita credenciales aparte; ambos se suman después sin rehacer nada.                                                                                                                                                                                                                                                                                                                                                                                |
| D9  | **Ruta de la app: `/asistente`**                                                                           | Consistente con `/recetas` y `/tablas`, en español, y no rompe nada del sitio actual.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         |

---

## Secuencia de construcción

Orden obligatorio: **ventas → onboarding → paywall → login → app interna → servicios externos.**
No se empieza por el chat.

- [x] **0. Reconocimiento** de lo instalado
- [x] **1. Página de ventas** (`/asistente`) — hecha y verificada en el navegador
- [x] **2. Onboarding** (`/asistente/nuevo`) — 3 preguntas, recorrido de punta a punta
      en el navegador. Los 6 CTA de la página de ventas ya apuntan aquí.
- [x] **2b. Sesión de la receta gratis** (`/asistente/sesion`) — lee el perfil y muestra
      la receta elegida. El chat todavía es una vista previa rotulada como tal.
- [x] **3. Paywall + candado de 1 receta gratis** — `/asistente/suscripcion` y
      `/asistente/nueva-receta`. Los 3 caminos del candado probados en el navegador:
      volver a la misma receta pasa, la segunda distinta choca con el muro, y el
      suscrito pasa. La regla vive en `src/features/start-recipe/model/gate.ts`.
- [x] **4. Login + base de datos** — esquema aplicado y verificado contra el proyecto
      real (`lcvmsbfnnpviumsqcxip`). Entrada por enlace al correo (`/entrar` →
      `/auth/callback`), middleware que refresca la sesión, y el candado viviendo en
      Postgres. Google y teléfono quedan apagados en Supabase; se suman cuando se
      configuren (el SMS se paga por mensaje).
- [x] **4b. El cupo y el perfil salen de `localStorage`** (2026-08-14). Lo importante:
      **el cupo ya no lo cuenta el navegador**, lo cuenta Postgres y lo descuenta el
      servidor antes de llamar a Gemini. El visitante anónimo se identifica con una
      cookie `httpOnly` (`elcharcu_vid`); al entrar con su correo, sus contadores se
      atan a la cuenta. El perfil (país y nivel) se guarda en `charcu.profiles` cuando
      hay cuenta. Probado de punta a punta contra la base real.
      Las recetas viven en `charcu.recipes` (2026-08-15) y la conversación de texto
      en `charcu.chat_messages` (2026-08-18). Ya no dependen del navegador.
- [x] **5. Asistente con Gemini** — chat por receta, foto para diagnóstico de moho, y
      doble barrera de seguridad (prompt + revisión en código antes de mostrar). Probado
      contra la API real: dosis correcta, negativa ante 8 g/kg, y veredicto "descartar"
      con foto de moho verde. El texto de la conversación ya se guarda; las fotos, no.
- [x] **4c. Muro fusionado: una pregunta gratis y a entrar** (2026-08-19). Las dos
      interrupciones son ahora una sola pantalla que guarda el lead y manda el enlace
      de entrada en el mismo envío. Y **bloquea**: no se cierra al mandar el correo,
      la retira la sesión cuando aparece (`useAccountSession` mira Supabase, ya no
      una marca en `localStorage` — quien vuelve por el enlace entra sin volver a
      ver el muro). Si el envío falla se dice, en vez de dejarlo esperando.
      El enlace vuelve a la portada (`?next=/`), que es donde vive el asistente;
      antes caía en `/asistente/sesion`. El `next` se valida: solo rutas de casa.
      ⚠️ **La conversación anterior NO se recupera si abre el enlace en otro
      aparato.** La receta anónima cuelga de la cookie del navegador donde
      preguntó. Decisión de Cristian (2026-08-19): para lanzar basta con que entre
      y siga el flujo normal, aunque sea a un chat limpio. La pantalla se lo dice
      ("ábrelo en este mismo aparato"). Emparejar por el correo del lead queda
      escrito abajo como mejora, no como bloqueo.
- [x] **5b. Guardar la conversación** en `charcu.chat_messages` (2026-08-18). Cada
      intercambio se escribe al responder —incluida la respuesta corregida si el
      candado de dosis bloqueó la original— y al recargar GET `/api/receta` recupera
      la receta abierta y el historial. El modelo deja de preguntar otra vez los
      kilos y la humedad.
      ⚠️ **Las FOTOS todavía no se guardan.** Guardar imágenes de la cocina de
      alguien es dato personal, cuesta almacenamiento y hay que decidir cuánto
      tiempo se conservan. Pendiente de que Cristian lo decida. Por ahora se
      apunta que hubo foto, no la foto.
- [x] **4d. La APP de quien ya entró** (2026-08-19). Tras validar el correo se cae
      dentro de la app, no en la web de venta: tres pestañas abajo, como una app de
      celular —**Mis cursos · El Charcu · Mi cuenta**, con El Charcu EN EL CENTRO
      porque es el producto y ahí cae el pulgar. Rutas `/cursos`, `/charcu`,
      `/cuenta` bajo el grupo `src/app/(app)`, y el candado vive en **el layout**:
      sin sesión, `redirect('/entrar')` antes de pintar nada (comprobado: las tres
      devuelven 307). Se usa `getUser()`, no `getSession()`, que se fía de la cookie.
      El marco es `widgets/app-frame`: `max-w-md` en cualquier pantalla y barra
      inferior con `env(safe-area-inset-bottom)`, para que en un iPhone el último
      botón no quede bajo la raya de gestos.
      **Colores de El Charcu, no los de Manos Creadoras**: se copió la ESTRUCTURA
      (marco de ancho de móvil, barra de 3 pestañas, entrada escalonada de las
      tarjetas) y se dejó fuera el tema oscuro dorado. Aquí es crema sobre blanco
      con terracota como único resalte, que es lo que ya dice la Guía de Marca.
      Sin librerías nuevas: la animación es CSS (`.reveal` en `globals.css`) y los
      3 iconos son SVG dibujados a mano en `shared/ui/icons.tsx` — no se instaló
      `lucide` ni `motion` para eso.
      ⚠️ **Mis cursos está casi vacío a propósito**: una sola receta guiada y tres
      títulos apagados marcados "grabando". No hay videos que enseñar (paso 6) y
      rellenar la pantalla con tarjetas falsas se paga en confianza.
      ⚠️ **Falta pasarla por el revisor visual.**
- [ ] **4e. Arreglar la portada ahora que la app existe** (escrito el 2026-08-19, sin
      ejecutar). Desde que hay app de verdad, `/` quedó descolocada. Tres cosas: 1. **"Entrar" no debe aparecer si ya hay sesión.** Hoy el menú lo enseña
      siempre (`navItems` en `src/shared/config/site.ts:73`, lista fija que no
      sabe nada del usuario). Con sesión abierta ese enlace debe ser **"Entrar a
      la app"** y llevar a `/charcu`. Pedirle entrar a quien ya entró es decirle
      que no lo reconocemos. Ojo al hacerlo: `navItems` es una constante y el
      encabezado se pinta en el servidor — o el menú pasa a leer la sesión, o el
      enlace se decide en el widget del encabezado. No vale un `useEffect` que
      cambie el texto después, porque parpadea. 2. **La portada tiene que ADELGAZAR.** Ya no es el producto: es el anzuelo.
      Su único trabajo es que un desconocido pruebe el asistente y se suscriba.
      Todo lo que no empuje a eso —secciones de más, repeticiones del mismo
      argumento, contenido que ya vive en `/recetas`, `/tablas` y `/tienda`— se
      va o se acorta. Hoy carga el chat entero, y el chat abajo del todo no
      convierte a nadie. 3. Decidir a dónde va `/` para quien ya tiene sesión: ¿la ve igual, o se le
      manda derecho a `/charcu`? Mandarlo derecho es lo cómodo, pero deja al
      usuario sin forma de volver a ver los precios para mejorar de plan.
- [x] **4h. Historial de conversaciones y sesiones** (2026-08-20). Se puede ver y
      retomar cualquier conversación anterior desde una hamburguesa en la
      pestaña de El Charcu, agrupadas por Hoy · Esta semana · Antes.

      **La regla de sesión** (decisión de Cristian, 2026-08-20): se empieza en
                                                      blanco cuando pasa CUALQUIERA de las dos cosas — **una hora sin escribir**
                                                      o **se cierra la pestaña**. Las dos salen de la misma línea:
                                                      `sessionStorage` muere al cerrar la pestaña y la marca de tiempo se
                                                      encarga de la inactividad, así que no hay que escuchar eventos ni
                                                      preguntarle nada al usuario
                                                      (`features/assistant-chat/lib/activeChat.ts`).
                                                      Una hora y no seis: una duda de charcutería se resuelve en minutos, y
                                                      quien vuelve al cabo de una hora casi seguro trae otra pregunta — meterla
                                                      en el hilo anterior ensucia las dos. Volver a lo de antes está a un toque
                                                      en el historial.

                                                      ⚠️ **Lo importante del cambio**: `/api/asistente` **dejó de retomar la
                                                      última receta abierta por su cuenta**. Ese rescate existía porque el id
                                                      vivía en memoria y una recarga lo perdía — pero tenía un efecto que nadie
                                                      había visto: era IMPOSIBLE empezar un chat nuevo, porque el servidor
                                                      siempre devolvía al anterior. Ahora manda el navegador y el servidor solo
                                                      comprueba que la receta sea suya.

                                                      **Los títulos los pone el asistente** tras la primera respuesta, con
                                                      `after()` de Next para no hacer esperar a nadie: se contesta primero y se
                                                      titula por detrás. Probado — "¿Cuánta sal de cura #1 para 1,8 kg de
                                                      bondiola?" quedó como **"Bondiola 1,8 kg"**. Si el titulador falla queda
                                                      el título provisional (la pregunta recortada): feo, no roto.

                                                      Verificado en producción local: recargar dentro de la ventana restaura la
                                                      conversación, pasada la hora empieza en blanco, una pregunta sin
                                                      `recipeId` abre receta nueva, y un id ajeno no entrega nada.

- [x] **4h-bis. Dos fallos del cupo, encontrados probando en el celular**
      (2026-08-20). El síntoma: la hamburguesa mostraba 5 conversaciones y la
      cuenta decía "3 de 8 preguntas". Eran dos cosas distintas.

      **1. El cupo se le cobraba a la primera cuenta que usó ese navegador.**
                                                  Las recetas de hoy tenían `user_id` de la cuenta personal, pero el
                                                  contador del mismo `visitor_id` seguía atado a la cuenta de trabajo, de
                                                  días antes. Dos `coalesce` preferían al dueño viejo:
                                                  `consume_quota` hacía `coalesce(c.user_id, excluded.user_id)` y
                                                  `link_visitor_to_user` solo escribía `where user_id is null`. Entre los
                                                  dos, un navegador no cambiaba de cuenta nunca.
                                                  Ahora manda quien está usando la app AHORA.
                                                  ⚠️ Las RECETAS siguen adoptándose solo si no tienen dueño: reasignarlas
                                                  le entregaría las conversaciones de una persona a otra por compartir un
                                                  teléfono.

                                                  **2. La pregunta de una lección se reenviaba en cada montaje.** Viajaba
                                                  en la URL (`/charcu?pregunta=…`) y el parámetro se quedaba ahí, así que
                                                  cada vuelta a esa pantalla la mandaba otra vez: quedaron **tres recetas
                                                  idénticas** ("Especias para bondiola") y tres preguntas del cupo gastadas
                                                  sin que nadie preguntara nada. Ahora el parámetro se borra de la URL en
                                                  cuanto se recoge, y la duda de una lección abre hilo aparte de forma
                                                  determinista — antes lo hacía por accidente, ganándole una carrera al
                                                  efecto que restaura la conversación.
                                                  De paso, `send` dejó de leer los mensajes del estado y los lee de una
                                                  ref: empezar hilo nuevo y mandar en el mismo tirón le colaba al modelo la
                                                  conversación anterior.

                                                  Verificado en producción local: rebotar tres veces a `/charcu` ya no crea
                                                  ni una receta, y un contador de la cuenta A pasa a la cuenta B en cuanto
                                                  B pregunta.

- [ ] **4j. La pregunta se cobra ANTES de crear la receta** (la causa raíz que
      queda viva — anotado el 2026-08-20 para arreglar mañana).

      En `/api/asistente` el orden es: se descuenta el cupo → se llama a Gemini
                                              → **se crea la receta**. Y `refundQuota` solo se dispara si falla Gemini.
                                              Si lo que falla es la escritura en la base, **la pregunta se cobró y no
                                              hay nada detrás**.

                                              No es teórico: es lo que infló los contadores durante las horas en que QA
                                              estuvo sin credenciales — `createRecipe` devolvía `null` en silencio
                                              mientras el cobro entraba igual. Acabó en un contador que decía 3 con una
                                              sola receta, y en una limpieza a mano
                                              (`20260820210148_limpieza_duplicados_y_contadores`).

                                              **Mientras esto siga así, cualquier caída de Supabase vuelve a descuadrar
                                              los números.** Y el usuario paga el error: pierde una pregunta de su cupo
                                              por un fallo nuestro.

                                              El arreglo es corto: que el `refundQuota` cubra también el fallo al
                                              escribir, no solo el de Gemini. Ojo al hacerlo con qué se le contesta al
                                              usuario — la respuesta del modelo SÍ llegó y estaría mal tirarla; lo que
                                              falló es guardarla. Probablemente haya que devolverle el texto y avisarle
                                              de que esa conversación no se guardó, en vez de fingir un error entero.

                                              ⚠️ Y de fondo hay algo más grande, para pensar sin prisa: el contador y la
                                              realidad pueden separarse sin que nada avise. Hoy se descubrió mirando la
                                              pantalla y sospechando. **Los cuatro fallos de cupo de hoy salen de ahí.**
                                              Un chequeo que compare contadores contra recetas —el mismo que se acaba de
                                              escribir a mano para la limpieza— convertido en algo que se pueda correr
                                              cuando se quiera, avisaría antes de que lo note un cliente.

- [ ] **4i. Cuándo más nace un chat nuevo** (fase 3, pedida por Cristian el
      2026-08-20 y **no construida**). Faltan dos disparadores: 1. **Preguntar desde una lección** (`/charcu?pregunta=…`) debería abrir
      SIEMPRE un hilo aparte. Hoy la duda cae en la conversación que
      estuviera abierta, y mezcla el curso con lo que fuera que se estaba
      hablando. Es un cambio pequeño: llamar a `startNewRecipe()` antes de
      mandar la pregunta que llega por la URL. 2. **Volver del segundo plano** tras una ausencia larga: preguntar
      "¿sigues con X o empiezas de cero?".
      ⚠️ El segundo es el delicado: si se dispara en cada `visibilitychange`,
      se vuelve insoportable — y acabamos de optimizar justo que cambiar de
      pestaña no moleste. Tiene que medirse por tiempo de ausencia real, no por
      cada vez que la pestaña recupera el foco.
- [ ] **4g. Proyectos: varios chats sobre la misma pieza** (pedido de Cristian,
      2026-08-20 — **anotado, sin construir**). Hoy una receta ES una
      conversación. Pero alguien puede preguntar varias cosas del mismo jamón en
      chats distintos —la sal el lunes, el moho a las tres semanas— y ahora mismo
      esos dos chats no se saben hermanos.
      La forma sería una capa por encima: un **proyecto** (la pieza) que agrupa
      varias recetas. En la base, tabla `projects` y un `project_id` en
      `charcu.recipes`.

      ⚠️ **La trampa está en el nombre, no en el modelo.** Hoy "receta" significa
                                                      "una conversación sobre una pieza". El día que existan proyectos, la pieza
                                                      es el proyecto y "receta" pasa a significar otra cosa — o deja de tener
                                                      sentido. Eso arrastra renombrar tabla, entidad, rutas y copy. **Cuanto
                                                      antes se decida el vocabulario, más barato sale**; hacerlo con cien
                                                      usuarios y URLs compartidas cuesta diez veces más.
                                                      Mi sugerencia para cuando toque: la pieza es el **proyecto**, y cada
                                                      conversación es una **consulta**. Pero es decisión tuya, y no la tomo yo.

- [ ] **4f. Qué hacemos con las recetas gratuitas** (pregunta abierta de Cristian,
      2026-08-19 — **decidir antes de tocar nada**). Hoy `/recetas` y `/tablas` son
      públicas y abiertas: es el contenido que trae gente por buscador, y es también
      lo que se puede leer sin dar nada a cambio.
      La idea sobre la mesa es **pedir el correo** para ver la receta completa. A
      favor: son visitas con intención real —quien busca "cuánta sal de cura" está a
      un paso de necesitar al asistente— y el correo es el activo que hoy no estamos
      cogiendo. En contra: un muro delante del contenido **hunde el SEO** (Google ve
      lo mismo que el visitante) y esas páginas son la puerta de entrada gratis de
      todo el sitio; taparlas es cortar la rama en la que se está sentado.
      La vía de en medio, si se quiere probar sin romper: dejar la receta entera
      abierta y pedir el correo solo por **lo que se lleva a la cocina** — la tabla
      de dosis descargable, el recordatorio de los días de curado, la receta en PDF.
      Se da valor a cambio del dato en vez de esconder lo que ya estaba.
      **Sin decidir. No se ha ejecutado nada.**
- [ ] **6. Mini-cursos en VIDEO** (Bunny) con puerta libre/pago. El video se sirve
      con URL firmada: la app decide quién puede verlo, no Bunny. La estructura
      que lo espera ya está hecha (6a/6b): falta la cuenta de Bunny y los videos.
      Cuando existan, a una lección se le pone `kind = 'video'` y su
      `bunny_video_id`, y el sitio del reproductor ya está en `LessonBody`.
- [x] **6a. Cursos, módulos y lecciones en la base** (2026-08-19). Migración
      `0011_cursos.sql`, aplicada y probada contra el proyecto real.

      ```
                                                                              curso ──1:N──▶ módulo ──1:N──▶ lección (video | pdf | imagen | texto)
                                                                              ```

                                                                              **La tercera entidad NO se llama `videos`**, se llama `lessons` con un
                                                                              campo `kind`. Pedido de Cristian: dejarla abierta a PDF e imagen. Si la
                                                                              tabla se llamara `videos`, el día del primer PDF habría filas en `videos`
                                                                              que no son videos y todo el código que las lee empezaría a mentir. Añadir
                                                                              un tipo nuevo es sumar un valor, no cambiar la estructura.
                                                                              · El **orden es un campo** (`position`) en los tres niveles, con
                                                                                `unique (padre, position)`. Reordenar es cambiar números.
                                                                              · Las columnas de origen (`bunny_video_id` · `file_url` · `body`) las
                                                                                vigila un `check` por tipo: **una lección de PDF sin archivo no entra
                                                                                en la tabla**. Se prefirió a un `jsonb` porque el `jsonb` muda la
                                                                                validación al TypeScript, y con la política de cero `any` eso acaba en
                                                                                guardas de tipo por todos lados.
                                                                              · **La puerta la vigila RLS** (D12): el curso de pago ni siquiera llega
                                                                                al servidor de quien no tiene suscripción. Probado — no sale en la
                                                                                lista y por URL directa da 404. Se contesta 404 y no "no tienes
                                                                                acceso" a propósito: un mensaje distinto delataría qué cursos existen.
                                                                              · En TypeScript la lección es una **unión discriminada por `kind`**, así
                                                                                que el `switch` que la pinta es exhaustivo: el día que se añada un tipo,
                                                                                deja de compilar hasta que alguien decida cómo se ve.

- [x] **6a-bis. Progreso por usuario y por curso** (2026-08-19). Se APUNTA por
      lección (`charcu.lesson_progress`) y se MUESTRA por curso
      (`charcu.course_progress`, que lo calcula contando). **Nunca se guarda un
      porcentaje**: si el curso pasa de 10 a 12 lecciones, quien iba al 100%
      bajaría al 83% y creería que perdió algo.
      `last_second` y `completed_at` son cosas distintas: retomar a mitad y dar
      por vista no son la misma pregunta. Se guarda por función
      (`save_lesson_progress`) y no por `insert` directo, porque hay que
      comprobar que la lección sea suya de ver — si no, cualquiera marca como
      completado un curso que no compró.
      Una vez terminada, **se queda terminada**: volver a abrirla para mirar un
      detalle no le descuenta avance a nadie.
      ⚠️ Hoy se marca **a mano** con un botón. Cuando haya video, el mismo
      guardado lo dispara el reproductor al 90% (`LESSON_COMPLETE_RATIO`) — 90 y
      no 100 porque nadie se ve los créditos.
- [x] **6b. Las pantallas del curso** (2026-08-19): `/cursos` (lista con barra y
      "1 de 4" por fila) · `/cursos/[curso]` (acordeón de módulos) ·
      `/cursos/[curso]/[leccion]`.
      · El acordeón **abre el módulo donde quedó**, no el primero.
      · La **barra de navegación va ARRIBA** —volver al curso, en qué módulo
      estás, y anterior/siguiente— porque abajo ya están las tres pestañas de
      la app y dos barras se pelean por el mismo pulgar. Las flechas sin
      destino se apagan en vez de desaparecer: si se van, las otras se mueven
      y el dedo pulsa lo que no era.
      · "Siguiente" **salta de módulo a módulo**: un curso que obliga a volver
      al índice cada tres lecciones no se termina.
      · La duda de la lección (`ask`) lleva a `/charcu?pregunta=…` y se manda
      sola. Es lo que une el curso con el asistente.
- [x] **6c. El experimento de la bondiola pasó a la base** (2026-08-19). Se
      retiraron `entities/guided-recipe`, `widgets/guided-recipe`, `views/curso`
      y la ruta `/curso/[slug]`. El contenido vive ahora en la base
      (`0012_curso_bondiola.sql`): 1 curso libre, 2 módulos, 4 lecciones de tipo
      `texto`, cada una con su `ask`. No se perdió nada.
      ⚠️ **El curso gratis ahora vive DENTRO de la app**, así que el botón de la
      web pública (`widgets/master-courses`) lleva a `/entrar` si no hay sesión.
      Es coherente con el embudo nuevo, pero hay que mirarlo al hacer el 4e.
      ⚠️ Al aplicar `0012` por el MCP **las tildes llegaron rotas** ("Â¿"). Se
      corrigió cargando el contenido por la API REST desde la terminal. El
      archivo del repo está bien; **el aviso es para la próxima**: si una
      migración lleva texto en español, revisar cómo quedó.
- [x] **6d. Cuatro cursos más y el catálogo deja de esconderse** (2026-08-21).
      Ya son 5 cursos: el lomo (libre) y longaniza, santarrosano, paisa y
      chorizo de ajo, los cuatro de **pago**. 23 módulos y 60 lecciones.

      ⚠️ **EL CAMBIO IMPORTANTE ES DE POLÍTICA, no de contenido.** Hasta hoy
                                  `courses_select_visible` usaba `can_read_course()`, que exige suscripción
                                  para los cursos de pago: eso no los bloqueaba, los hacía **invisibles**.
                                  Y un curso que nadie ve no se vende.
                                  Ahora el CATÁLOGO es público —título, resumen y portada de lo publicado—
                                  y lo cerrado es el CONTENIDO: `modules` y `lessons` conservan
                                  `can_read_course()` sin tocar. Se ve el escaparate, no se saca la
                                  mercancía. D12 sigue en pie.

                                  ⚠️ **Cómo se sabe que un curso está bloqueado, y cómo NO.** `listCourses`
                                  se lo pregunta a la base: pide los `modules` con la sesión del usuario y
                                  RLS solo devuelve los de cursos que puede abrir. NO se usa
                                  `access === 'pago'`, porque un suscriptor también tiene cursos de pago y
                                  para él no están bloqueados — sería duplicar la regla de la suscripción
                                  en TypeScript y acabar con dos verdades.

                                  ⚠️ **Y ojo con `course_progress`**: es `security definer` y cuenta las
                                  lecciones saltándose RLS, así que dice "13 lecciones" aunque no puedas
                                  ver ninguna. Sirve para enseñar cuánto hay dentro; NO sirve para saber si
                                  tienes acceso. Confundirlo dejó un botón de "Empezar el curso" que
                                  llevaba a una lección que la base nunca iba a entregar.

                                  Lo visual: en la lista, insignia de candado "El Charcu Pro", foto
                                  atenuada, "13 lecciones esperándote" en vez de una barra al 0% —un 0% en
                                  algo que no puedes empezar desanima; el número de lecciones vende— y el
                                  pie dice "Incluido en El Charcu Pro, ábrelo y mira lo que trae".

- [x] **6e. El índice de un curso de pago SE VE; el muro está en la lección**
      (2026-08-21).
      Antes, dentro de un curso cerrado se veía un panel de membresía y nada
      más. Enseñar la tabla de contenidos es justo lo que da ganas de pagar: un
      candado sin nada detrás no vende, solo frustra. Ahora se ven los 5 módulos
      con sus lecciones, y el muro aparece **al tocar una lección**.

      ⚠️ **Por qué una función y no abrir la RLS de `lessons`.** Si se relajara
                                  la política, cualquiera podría leer `bunny_video_id` por la API — y los
                                  enlaces de Bunny **no van firmados todavía**, así que con ese id se ve el
                                  video sin pagar. Se regalaría el producto por enseñar el índice.
                                  `charcu.course_outline(slug)` es `security definer` y devuelve SOLO
                                  títulos, resúmenes y orden. Nunca `bunny_video_id`, ni `body`, ni
                                  `file_url`, ni `ask`. Comprobado en el HTML servido: las 14 lecciones
                                  viajan con `bunnyVideoId: null` y sin un solo `href` a una lección.
                                  `modules` y `lessons` siguen cerradas con `can_read_course()` — la puerta
                                  de verdad no se tocó.

                                  El guardia de `/cursos/[curso]/[leccion]` redirige a la página de precios,
                                  **no a un 404**: decirle "no existe" a algo que el usuario acaba de ver en
                                  el índice es una mentira que además no vende nada.

                                  ⚠️ **De paso, un bug que estaba vivo:** `PLAN_LABEL` en "Mi cuenta" usaba
                                  las claves `charcutero` y `maestro`, que **no existen** en
                                  `charcu.plan_quotas` (son `aprendiz`, `pro-mensual`, `pro-anual`,
                                  `maestro-mensual`, `maestro-anual`). Al primer suscriptor le habría salido
                                  el id crudo en pantalla. El tier de cara al usuario es **El Charcu Pro**;
                                  "Charcutero" no existe en ninguna parte y ya no se nombra en el código.

                                  ⚠️ **Todos los videos de los 4 cursos nuevos son el MISMO placeholder**
                                  (el corte del lomo), a propósito, para ver la estructura antes de grabar.
                                  El "Ahumado al barril (opcional)" es compartido por los cuatro y se
                                  cambia de una vez:
                                  `update charcu.lessons set bunny_video_id = '<real>' where title = 'Ahumado al barril (opcional)';`

                                  ⚠️ **`chorizo-paisa` no tiene portada**: no hay foto suya en el repo ni
                                  receta pública. Se ve con el fondo verde de respaldo hasta que haya una.
                                  Y **`chorizo-de-ajo` es una elección mía**: el brief pedía 3 chorizos y
                                  hacían falta 4. Se cambia por otro con un `update` al slug y al título.

- [ ] **7. Pagos reales** (Hotmart + webhook, D17). Tres cosas que hay que resolver sí o
      sí: emparejar la compra con el usuario de Supabase, atender el reembolso/chargeback
      para cortar el acceso, y no confiar en el correo del comprador a ciegas.
- [ ] **8. Importar recetas de redes** (lo último, es retención no captación)

---

## ⚡ Por qué la app ya no pide datos en cada pestaña (2026-08-19)

Cambiar de pestaña costaba **3,2 s** y disparaba una cascada: la petición de la
página, `getUser()` tres veces (middleware, layout y página) y **dos llamadas a
`/api/cupo`** de 1,4 s cada una — que además hacían dos escrituras a la base
para volver a atar un rastro anónimo que ya estaba atado desde el primer
segundo.

**No se instaló ninguna librería de estado.** Redux o Zustand habrían dado un
sitio ordenado donde guardar lo mismo que ya se estaba pidiendo de más; el
problema no era dónde vivía el dato, era cuántas veces se iba a buscarlo.
Cuatro arreglos, cero dependencias nuevas:

1. **Caché de rutas del cliente** (`staleTimes` en `next.config.ts`). Las tres
   pestañas son rutas dinámicas y para esas Next trae `dynamic: 0` de fábrica:
   cada toque era una petición nueva aunque el usuario acabara de estar ahí.
   Con 30 segundos, ir y volver es instantáneo. **Medido: `/charcu` pasó de
   3,2 s a 54 ms.**
2. **`currentUser()` deduplicado** con el `cache()` de React
   (`shared/api/supabase/currentUser.ts`). El layout y la página comparten la
   respuesta en vez de preguntar cada uno lo suyo.
3. **El cupo se lee UNA vez, en el servidor**, y se reparte con `QuotaProvider`
   (contexto de React + el canal que ya existía). `/api/cupo` **ya no se llama
   al cambiar de pestaña**, solo desde el sitio público. Se actualiza solo:
   cada respuesta del asistente trae el cupo nuevo y lo publica.
4. **Atar el rastro anónimo se mudó a `/auth/callback`**, el único momento en
   que alguien deja de ser anónimo. Antes iba en `/api/cupo`, o sea en cada
   navegación.

Y la conversación abierta se recuerda en memoria (`assistant-chat/lib/chatMemory`):
volver a la pestaña del asistente ya no vuelve a pedir el historial. Se pierde
al recargar **a propósito** — recargar es justo cuando sí hay que preguntarle a
la base, porque pudo haber respondido desde otro dispositivo. Por eso salir de
la cuenta hace una **recarga entera** y no una navegación: así se va todo lo que
quedó en memoria del anterior.

⚠️ **La regla para lo que venga**: la base se toca cuando algo CAMBIA (terminar
una lección, mandar una pregunta), no cuando algo se mira. Después de un cambio,
`router.refresh()` invalida el caché y trae los datos de verdad.

### ⚡ El hueco mudo entre el toque y el esqueleto (2026-08-29)

El `loading.tsx` de las cinco rutas ya existía y estaba bien. Pero llega TARDE:
se pinta cuando la navegación ya empezó, y antes de eso hay un tramo en el que
el navegador espera al servidor y en pantalla no se mueve nada. En ese tramo
caben el middleware, la sesión de Supabase y —en desarrollo— la compilación de
la ruta. El usuario toca, no pasa nada, y vuelve a tocar.

`useLinkStatus` (Next 15.3+) vive DENTRO del `<Link>` y se pone en `pending` en
el mismo clic, sin esperar a nadie. De ahí salen `NavPending` y `NavPendingBar`
en `shared/ui`, enchufados en las tres pestañas, las cápsulas y los cursos.

**Medido:** 250 ms después del clic, `location.pathname` todavía es el viejo —o
sea, seguimos dentro del hueco— y la barra ya está en el DOM. Antes de tocar no
había nada.

Y tres arreglos de fondo el mismo día, que reducen el hueco en vez de taparlo:

1. **`findCourse` no estaba deduplicado.** La página de una lección lo llamaba
   en `generateMetadata` y otra vez al pintar, y cada llamada son tres consultas
   en cadena: seis viajes a Supabase para responder tres veces lo mismo. Ahora
   va con `cache()` de React, igual que `currentUser()`. También `listCourses`,
   `progressByCourse` y `completedLessonIds`.
2. **El layout tenía una consulta en serie de más**, metida al añadir la puerta
   del onboarding: `readProfile` iba antes de `readQuota` sin depender de ella.
   Ahora van en paralelo.
3. **El middleware corría en `_next/*`.** El `matcher` excluía `_next/static` y
   `_next/image` pero dejaba dentro `_next/webpack-hmr`, que en desarrollo se
   pide sin parar; cada petición se comía un `getUser()` contra Supabase.
   **Medido: de 5,8 s a 1,0 s.**

⚠️ **Lo que NO es arreglable y conviene recordar antes de volver a optimizar:**
en `next dev` el primer golpe a cada ruta compila —`/cursos` tardó 15 s la
primera vez y 1,2 s después— y el prefetch de `<Link>` está desactivado. Casi
todo lo que se siente lento navegando por primera vez en desarrollo no existe en
producción. Medir ahí antes de tocar nada.

**Queda sobre la mesa:** `findCourse` sigue haciendo 3 consultas en cadena. Se
bajan a 1 con un select anidado de PostgREST (`courses` con `modules` y
`lessons` embebidos). No se hizo porque toca el camino que decide si un curso
está bloqueado, que es seguridad (D12), y no se pudo probar con una sesión real.

### 🩻 El esqueleto, y por qué hay que medir en producción

Tocar una pestaña ya no congela: se cambia de pantalla al instante y se enseña
un esqueleto con la forma de lo que viene (ver "Estados de carga" más abajo).

⚠️ **Lección que costó una hora: `loading.tsx` NO se ve en `pnpm dev`.** En
desarrollo, Next compila la ruta —y el propio esqueleto— la primera vez que se
pisa, así que el navegador sigue esperando y parece que el arreglo no funciona.
Con `pnpm build && pnpm start` el esqueleto aparece a los 20 ms.

**De aquí en adelante, cualquier cosa de rendimiento se mide en producción.**
Hay una configuración lista en `.claude/launch.json` (`elcharcu-prod`, puerto 4321) para no tener que montarla cada vez. Medir velocidad en desarrollo es
medir el compilador, no la app.

⚠️ Y de paso: la cascada de aparición (`.reveal`) se acortó a 260 ms con
retrasos de 0,04-0,16 s. Con los retrasos largos de antes, al quitarse el
esqueleto quedaba medio segundo de pantalla **en blanco** — hueco gris, luego
nada, luego el contenido. Se veía peor que no animar.

---

## ✂️ El asistente responde corto (2026-08-19)

Las respuestas eran de manual: párrafos que nadie con las manos en la carne va a
leer, y tokens de salida —los caros— gastados en explicar lo que no se preguntó.

El prompt ahora manda **80 palabras como máximo, una idea por respuesta**, el
dato en la primera línea, sin repetir la pregunta ni cerrar con resumen ni
desearle suerte a nadie. Si el tema da para más, se ofrece en media línea y solo
se cuenta si lo piden. **Excepción única: una advertencia de seguridad se
explica entera** — la salud no se resume.

`maxOutputTokens` baja de 4000 a 2000. Es el freno de emergencia, no la regla:
quien manda en el largo es el prompt. No se aprieta más porque el razonamiento
del modelo gasta ~950 de ese presupuesto, y cortarse a media frase justo antes
de decir cuánta sal de cura poner sería peor que una respuesta larga.

Probado: "¿Cuánto tiempo se cura un chorizo?" se contestó en **66 palabras**,
con los dos casos y una pregunta de vuelta.

---

## 💰 Tope de gasto de la IA (hecho el 2026-08-05)

`AI_DAILY_BUDGET_USD` (hoy en **2 USD**) ya frena de verdad las llamadas a Gemini.

⚠️ **Bajado de 5 a 2 USD el 2026-08-19** por decisión de Cristian, mientras esto es
pruebas. Son ~360 preguntas al día: de sobra para probar, y si algo se desboca el
agujero es de 2 dólares. **Hay que subirlo antes de abrirlo a gente de verdad**, o el
asistente se queda mudo a media tarde.

**Cómo funciona.** Antes de cada llamada se mira cuánto se lleva gastado hoy; si se
pasó del tope, se corta y ni se llama a Google. Después de cada respuesta se apunta
el consumo **real** que declara Gemini, no una estimación. El contador vive en
`charcu.ai_spend`, en la base y no en memoria, porque en producción el servidor se
reinicia solo y un contador en memoria se borraría con él.

**Números medidos** (una pregunta de texto, sin foto):

| Concepto               | Tokens          | Nota                                         |
| ---------------------- | --------------- | -------------------------------------------- |
| Entrada (prompt)       | ~830            | a 0,75 USD el millón                         |
| **Pensamiento**        | **~950**        | se cobra como salida — es el gasto principal |
| Respuesta              | ~360            | a 3,75 USD el millón                         |
| **Coste por pregunta** | **~0,0055 USD** | ≈ **360 preguntas al día** con 2 USD         |

Lo llamativo: **el modelo gasta más pensando que respondiendo** (950 contra 360), y
eso se cobra a precio de salida. Es donde está el dinero.

⚠️ **El precio de Gemini se duplica el 1 de enero de 2027** (de 0,75/3,75 a 1,50/7,50
por millón). Las dos tarifas ya están en el código con la fecha de corte, así que el
cálculo se ajusta solo. Ese día el presupuesto rendirá la mitad: ~450 preguntas.

**Decisiones de diseño, por si hay que revisarlas:**

- Si `AI_DAILY_BUDGET_USD` falta o está rota, se asume **0 = todo cortado**. Ante una
  configuración mala preferimos un asistente mudo a una factura sin freno.
- Si la base de datos no responde al consultar el contador, **se deja pasar**. Una
  caída de Supabase no debería dejar mudo al asistente, y el gasto de unas pocas
  llamadas es menos grave que una caída total.
- El `thinkingBudget: 512` que le pedimos a Gemini es **una sugerencia, no un límite**:
  en la práctica gastó 951. No se puede confiar en él para controlar el coste.

**Pendiente: el gasto de IA debería contarse POR USUARIO** (pedido de Cristian,
2026-08-20 — anotado, no construido). Hoy `charcu.ai_spend` es un contador
global: sabemos cuánto gastó la app, no cuánto gastó cada quien. Eso sirve para
no reventar la factura, y para nada más.

Con el gasto por cuenta se puede responder lo que de verdad decide el negocio:
si un plan de 9,99 deja margen o lo come un solo usuario intensivo, quién está
usando el asistente de verdad, y si conviene topar por dinero en vez de por
preguntas. Hoy el cupo son 8 preguntas para todos, pero una pregunta con foto
cuesta bastante más que una de texto — y eso hoy no se ve en ninguna parte.

⚠️ Ojo al hacerlo: hay que contarlo también para el ANÓNIMO (por `visitor_id`),
o se pierde justo el gasto del embudo de entrada, que es el que no está pagando
nadie. Y el contador global se queda igual: es el que frena la factura y no
depende de que haya cuenta.

**Pendiente relacionado:** no hay aviso automático cuando se agota. Hoy solo queda el
evento `ai_budget_exhausted` en Mixpanel y una línea en el log del servidor.

---

## 🔄 Cambio de rumbo (2026-08-05): el asistente a la portada

Pedido de Cristian. Cambia el embudo completo: se deja de vender **antes** de probar y
se pasa a **probar primero, pedir datos después**.

### El embudo nuevo

```
Llega a elcharcu.co
      ↓
Ve el asistente YA, en la portada. Sin leer nada, sin registrarse.
      ↓
Pregunta 1 · GRATIS · sin pedir absolutamente nada
      ↓
Muro blando: nombre + correo + WhatsApp
      ↓
Preguntas 2..N gratis (N por definir) con su cupo de imágenes
      ↓
Se acaba el cupo → muro de suscripción, planes medidos en preguntas e imágenes
```

Por qué así: la primera pregunta es la demostración. Pedir los datos justo después es
el momento de máximo interés —acaba de ver que funciona— y todavía no le hemos cobrado
nada. El contacto de WhatsApp además cae en el canal por donde El Charcu ya vende.

### Qué hay que construir

- [x] **9a. Asistente en la portada.** El chat vive en `/`, arriba del todo, sin
      onboarding previo: se arranca a ciegas y el asistente pregunta lo que necesite.
- [x] **9b. Contador de preguntas e imágenes** por visitante (`entities/usage-quota`).
      El periodo es el **mes natural**, no el día — un reseteo diario dejaría el plan
      gratis ilimitado en la práctica. Vive en `localStorage`; se ata a la cuenta
      cuando llegue el 4b.
- [x] **9c. Muro blando de captura** tras la primera respuesta: nombre, correo y
      WhatsApp, sin contraseña, con la nota de la Ley 1581/2012. Tabla `charcu.leads`.
- [x] **9d. Planes medidos en preguntas/mes e imágenes/mes** (2026-08-14). `Plan` ahora
      lleva `quota`, y los textos de precios y del muro hablan de preguntas y fotos.
- [x] **9e. Muro de suscripción al agotar el cupo** (2026-08-14):
      `features/quota-wall`, que reemplaza al chat en la portada cuando se acaban las
      preguntas del mes. Probado en el navegador con el cupo forzado.

### Qué queda obsoleto (y qué se salva)

| Pieza actual                                        | Qué pasa con ella                                                                                             |
| --------------------------------------------------- | ------------------------------------------------------------------------------------------------------------- |
| Trigger `enforce_recipe_gate` en Postgres           | **Ya no aplica**: contaba recetas, no preguntas. Hay que reemplazarlo por contadores de preguntas e imágenes. |
| `features/start-recipe` (candado de recetas)        | Se retira o se reduce mucho.                                                                                  |
| `/asistente/nuevo` (onboarding de 3 preguntas)      | Deja de ser obligatorio para entrar. Puede quedar como ajuste opcional del perfil.                            |
| `/asistente` (página de ventas)                     | Se conserva, pero deja de ser la puerta principal.                                                            |
| `features/assistant-chat` + guardrails de seguridad | **Se salva entero.** Es lo que se mueve a la portada.                                                         |
| Esquema de Supabase, login, RLS                     | **Se salva.** Solo se añaden tablas y contadores.                                                             |

### ⚠️ Avisos de este cambio

- **Datos personales.** Guardar nombre, correo y WhatsApp es tratar datos personales.
  Hace falta una nota de privacidad visible en el formulario y decir para qué se usan
  (en Colombia aplica la Ley 1581 de 2012, habeas data). No es opcional.
- **El coste sube y se vuelve el riesgo principal.** Con el asistente en la portada,
  cualquiera que pase lo puede usar. Sin el tope de gasto (pendiente nº 1) esto puede
  vaciar el presupuesto de Gemini en un día. **El tope de gasto pasa a ser bloqueante
  antes de publicar este cambio**, no un "ya lo haremos".
- **Las imágenes cuestan mucho más que el texto.** Por eso su cupo debe ser bastante
  más chico que el de preguntas.
- ✅ **N y los cupos ya están puestos** (2026-08-14), y son PROPUESTA — se cambian en
  `entities/plan/model/plans.ts` y `entities/usage-quota/model/types.ts`:

  | Plan               | Preguntas/mes           | Fotos/mes | Coste IA estimado |
  | ------------------ | ----------------------- | --------- | ----------------- |
  | Aprendiz (gratis)  | 8 (la 1ª sin dar datos) | 2         | ~0,04 USD         |
  | Charcutero $29.900 | 200                     | 30        | ~1,10 USD + fotos |
  | Anual $239.000     | 300                     | 50        | ~1,65 USD + fotos |

  Con ~7,50 USD de ingreso mensual, el margen aguanta. **Cuando el precio de Gemini se
  duplique el 1/1/2027 hay que volver a esta tabla.**

- **El sistema de diseño de Claude sigue sin poder leerse.** El MCP `claude_design` no
  está conectado en la sesión del agente y el enlace público devuelve 403. Para usar el
  diseño de `Home Charcu App.dc.html` hay que conectar ese MCP o exportar los archivos
  al repo. Mientras tanto, la portada se haría con los tokens de marca ya instalados.

---

## 🎨 Rescate visual (2026-08-14, en curso)

Diagnóstico a 375px: un solo verde plano de arriba abajo, y la caja de escribir
—lo único que el visitante tiene que hacer— era lo que menos se veía.

Dirección elegida por Cristian: **clara, tipo cocina profesional**. Tres niveles
de superficie construidos SIN añadir colores a la paleta (`cream` → `cream-white`
→ `cream` otra vez dentro de la tarjeta; las sombras son `cocoa` con muy poca
opacidad). Terracota `#C17A5A` es **el único color de resalte** y solo aparece en
lo que se toca. Se mantiene Inter: el problema no era la fuente, era que todo el
texto pesaba igual.

- [x] **Capa 1 — tokens y profundidad.** `cream-white` y las sombras `surface` /
      `raised` en `tailwind.config.ts`.
- [x] **Capa 2 — el asistente.** Tarjeta blanca sobre crema, texto de 14 a 16px
      (se leen dosis de sal de cura con las manos llenas de carne, y 16 evita el
      zoom automático de iOS), muere el eyebrow en mayúsculas, el aviso de
      seguridad se pliega en un `details`.
- [ ] **Capa 3 — precios.** La sección sigue sobre `forest-dark` y NO se ha
      revisado con los tokens nuevos ni pasó por el revisor visual. El 2026-08-18
      se alineó el ritmo vertical (`py-16 md:py-24`) aquí y en el resto de
      secciones, pero eso no cierra la capa.
- [ ] **Capa 4 — tipografía.** Escala aplicada solo en el asistente; falta el
      resto del sitio.
- [ ] **Capa 5 — movimiento.** No hay ni una animación y **no hay librería
      instalada**. Requiere `motion` (~4kb) y decidirlo, porque es una
      dependencia nueva. Las 7 de base están especificadas en el plan.
- [x] **Estados de carga en la app** (2026-08-19). Las cinco pantallas de dentro
      tienen su `loading.tsx` con un esqueleto que **tiene la forma de lo que va a
      aparecer** — un rectángulo genérico no dice nada; una silueta con la forma de
      la tarjeta deja el ojo colocado. Y cada uno lleva su aviso en `sr-only`, que
      si no la app se queda muda para quien no ve la pantalla.
      Medido en producción: el esqueleto sale a los **20 ms** de tocar la pestaña y
      el contenido real a los **500 ms**. Antes el usuario se quedaba 1,5 s mirando
      la pantalla anterior, sin señal de que su toque hubiera hecho algo.
- [ ] **Estados vacíos: faltan en casi todas partes.** Solo existe el de "no hay
      cursos publicados". Faltan, como mínimo: sin recetas guardadas, búsqueda de
      recetas y de tablas sin resultados, curso sin módulos, chat sin historial,
      lista de leads vacía. Un vacío sin explicar se lee como "está roto" — la
      pantalla tiene que decir por qué no hay nada y qué se puede hacer.
- [ ] **Error boundaries propios, uno por pantalla** (pedido de Cristian,
      2026-08-19). Hoy no hay ni un `error.tsx` en todo el repo: cuando algo falla
      al pintar, el usuario ve la pantalla de error genérica de Next —en inglés y
      sin salida— o, peor, una pantalla a medias.
      Hace falta un `error.tsx` por ruta (o por grupo) que hable el idioma de la
      casa, diga qué pasó en una frase y ofrezca **reintentar** (`reset()`) y
      **volver**. La app y el sitio público necesitan tonos distintos: quien está
      dentro quiere volver a su curso, quien está fuera quiere volver a la portada.

      ⚠️ **El caso que lo destapó: sin conexión a Supabase.** Hoy la pantalla de
                                                                  entrar dice _"Las cuentas todavía no están conectadas. Vuelve en un rato"_
                                                                  cuando en realidad **faltan variables de entorno** —le pasó a Cristian en
                                                                  QA el 2026-08-19 y costó dos rondas de adivinar—. Ese mensaje miente a
                                                                  medias y no hay forma de diagnosticarlo desde fuera. Hay que separar tres
                                                                  cosas que hoy se ven igual:
                                                                  1. **Falta configuración** (sin claves): es un fallo de despliegue, no del
                                                                     usuario. Aviso claro en el log del servidor al arrancar, y en pantalla
                                                                     algo que no invite a "volver en un rato", porque solo, no se arregla.
                                                                  2. **Supabase no responde** (caída o red): ahí sí "vuelve en un rato", con
                                                                     botón de reintentar.
                                                                  3. **El usuario no tiene permiso**: ni error ni vacío, es la puerta
                                                                     haciendo su trabajo.

                                                                  Ojo al hacerlo: un `error.tsx` es un componente de cliente y **no atrapa lo
                                                                  que falla en el servidor durante el render** más que como error genérico; el
                                                                  detalle no viaja al navegador a propósito. Si se quiere distinguir los tres
                                                                  casos de arriba, la decisión se toma en el servidor y se baja como dato, no
                                                                  como excepción.

**El revisor visual ya existe**: `.claude/agents/revisor-visual.md`. Recibe la
RUTA de una captura, puntúa usabilidad /40 y craft /20 contra esta paleta, y la
puerta es ≥36 **y** ≥16. Quien hace el cambio no se puntúa a sí mismo.
⚠️ Las capas 1 y 2 se dieron por buenas **sin pasar por él** (no existía todavía).
Hay que pasarlas antes de darlas por cerradas.

---

## 🧾 Recetas y identidad del visitante (2026-08-15)

### Un chat = una receta

`charcu.recipes` es tabla NUEVA. `recipe_sessions` no servía y se retiró:
`user_id` era obligatorio (un anónimo no podía tener receta, y el asistente es
anónimo por diseño), `unique (user_id, product)` daba una sola "chorizo" por
persona para siempre, `product` era una lista cerrada de 8 opciones cuando una
receta necesita título libre, y arrastraba `is_free` del candado que jubiló D15.

**La regla de cobro**, verificada contra la base real:

| Acción                               | Receta                      | Pregunta |
| ------------------------------------ | --------------------------- | -------- |
| Primera pregunta, sin receta abierta | +1                          | +1       |
| Seguir en la misma receta            | —                           | +1       |
| Abrir una segunda con el plan gratis | **402 `deniedBy: recetas`** | no sube  |

`consume_quota` devuelve ahora **cuál** de los tres topes cerró la puerta
(`preguntas` · `fotos` · `recetas`), porque la pantalla necesita enseñar el muro
correcto y no uno genérico.

La receta se crea **después** de que la respuesta llegó bien: si se creara
antes, un fallo de Gemini dejaría recetas vacías en el historial de la gente.
Y si llega un `recipeId` que no es del visitante, se ignora y se le abre la
suya — nunca se escribe en la receta de otro.

### Un solo identificador para toda la casa

El `visitor_id` lo crea ahora el **middleware**, antes de que se pinte nada, así
que el layout lo pasa al navegador en el primer render y ninguna medición sale
sin él. Vive a la vez en: cookie `httpOnly` · `localStorage` · `sessionStorage`
· **`distinct_id` de Mixpanel** · la base.

Eso último era el agujero: hasta hoy Mixpanel inventaba su propio identificador
aleatorio, así que **un embudo de Mixpanel y una fila de Postgres no se podían
cruzar**. Al crear la cuenta se llama `identifyAccount()`, que hace `alias` una
sola vez y pega todo lo que hizo de anónimo a su perfil.

⚠️ Que estén en tres sitios del navegador **no es una red de tres nudos**: si
borra los datos del sitio, se van los tres juntos. Sirve contra el borrado
accidental, no contra el deliberado.

### Huella de dispositivo: descartada (2026-08-15)

Se evaluó identificar al visitante por red o navegador y **se descartó**:

- **Por IP es imposible**: los operadores móviles de Colombia usan CGNAT, miles
  de clientes salen por la misma IP pública, y esta cambia al pasar de wifi a
  datos.
- **Por huella del navegador no es fiable en móvil**: Safari/iOS aleatoriza
  activamente las señales, y el público de esto es móvil.
- **Las huellas chocan**: dos personas con el mismo iPhone, iOS, zona horaria e
  idioma dan la misma. Y el fallo va en la peor dirección — le diríamos "se
  acabaron tus preguntas" a alguien que nunca entró. Estirar el plan gratis
  cuesta céntimos; echar a un cliente nuevo lo pierde entero.
- **No ahorra permisos**: bajo la Ley 1581 (y el RGPD si se vende en España) la
  huella es dato personal igual que una cookie. Si hay que pedir consentimiento
  de todos modos, se pide el correo, que además sirve para vender.

**La identidad de verdad es la cuenta.** Todo lo demás es aproximar.

---

## ⚠️ Pendientes y avisos

### 🗂️ Las migraciones ahora sí se ejecutan desde los archivos (2026-08-14)

El esquema se había aplicado a mano y `supabase_migrations.schema_migrations` estaba
**vacío**: el repo y la base podían haberse separado sin que nadie se enterara. Con la
base todavía sin usuarios ni leads se borró el esquema `charcu` y se reconstruyó
ejecutando `supabase/migrations/0001…0007` en orden, cada archivo registrado en el
historial. De aquí en adelante: **un cambio de esquema = un archivo nuevo**, nunca SQL
suelto en el panel.

Ojo con dos cosas al mirar el historial:

- Ya **todas** las entradas del historial tienen archivo (2026-08-19). Las nueve que
  no lo tenían —el `0000_reset…`, las limpiezas de datos de prueba y
  `limpieza_cursos_reaplicar_20260819`— ahora existen **vacías, con un comentario
  que explica qué fueron**. Van sin SQL a propósito: sobre una base nueva no hay
  datos de prueba que limpiar ni esquema que reconstruir, y el `0000_reset` hacía
  `drop schema charcu cascade` — reproducirlo convertiría cualquier `db push` en un
  borrado de la base entera.

### 🚦 QA en `qa.elcharcu.co` (2026-08-19)

Vercel sirve `develop` en `qa.elcharcu.co` (Domains → Preview → rama `develop`),
con la protección de despliegue **encendida**: hay que entrar con la cuenta de
Vercel. Se deja así a propósito — un QA abierto con el asistente dentro es
alguien gastando el presupuesto de Gemini.

En Supabase, este proyecto pasó a ser el de QA: `site_url =
https://qa.elcharcu.co` y la lista de URLs permitidas incluye qa y
`http://localhost:*/**` (el comodín de puerto es porque `pnpm dev` cambia de
puerto solo cuando el 3000 está ocupado). El proyecto de producción se creará
aparte.

⚠️ **QA comparte base y clave de Gemini con producción.** Cada prueba escribe
datos reales y gasta del mismo tope diario. La separación de verdad es un
segundo proyecto de Supabase, no un segundo proyecto de Vercel.

### 💥 La trampa que costó una mañana: `NEXT_PUBLIC_*` + "Sensitive" (2026-08-19)

**Regla, para no repetirlo: en Vercel, una variable `NEXT_PUBLIC_*` NO puede
estar marcada como _Sensitive_. Va como Config / Plain.**

Por qué: Next sustituye las `NEXT_PUBLIC_*` por su valor literal **al
compilar** —en el bundle del navegador y también en el del servidor— y las
variables Sensitive de Vercel no existen durante la compilación. Combinadas,
quedan vacías en los dos lados.

Lo que se vio, y lo que despistó: la pantalla de entrar decía _"Las cuentas
todavía no están conectadas. Vuelve en un rato"_ y **no salía ninguna petición
a Supabase**, lo que hizo pensar en CORS. No lo era: `isSupabaseConfigured()`
devuelve `false` y corta antes de cualquier `fetch`. En paralelo, `/api/cupo` y
`/api/receta` daban 500 con "Your project's URL and Key are required" — el
mismo hueco vacío visto desde el servidor.

Y encima había un segundo problema encima del primero: **el dominio siguió
sirviendo el mismo despliegue** (`dpl_EHs8LV…`) durante horas. Redesplegar otro
despliegue no mueve lo que sirve el dominio; hace falta un despliegue NUEVO de
`develop`.

Lo que quedó construido a raíz de esto:

- **El servidor ya no depende de una variable pública.** Si la `NEXT_PUBLIC_`
  viene vacía, tira de `SUPABASE_URL` / `SUPABASE_PUBLISHABLE_KEY`, que se leen
  al ejecutar (`shared/api/supabase/serverConfig.ts`). El navegador no tiene
  arreglo posible —necesita la pública sí o sí— pero la app deja de caerse
  entera. De paso se descubrió que el cliente de administración también
  dependía de la pública: con esto mal, tampoco funcionaban el cupo ni los
  cursos, no solo el login.
- **Un aviso en el log que dice la verdad**: que falta configuración, que NO es
  una caída de Supabase, y que si son `NEXT_PUBLIC_` no pueden ser Sensitive.
- **`/api/salud`**: qué configuración ve ESTE despliegue y de qué commit y rama
  es. Solo `true`/`false` y longitudes — ni un valor, ni siquiera los públicos,
  para que siga siendo seguro tenerlo abierto. Es lo que cerró el diagnóstico
  en cinco segundos después de dos horas de adivinar.
- **`.env.example`**, que solo tenía la línea de Mixpanel, ahora lista todas
  las variables con este aviso arriba del todo.

### 🔒 Las migraciones a PRODUCCIÓN las aprueba Cristian (2026-09-01)

Regla de trabajo, no técnica: una migración nueva se aplica **solo a QA**
(`lcvmsbfnnpviumsqcxip`). A producción (`dpooajrgqjwetttberdo`) **no entra
ninguna** sin que Cristian lo apruebe, cada vez.

Vale igual para las destructivas y para las que solo añaden una columna: quien
decide cuándo cambia el esquema de la base con usuarios reales es él.

```bash
npx supabase link --project-ref lcvmsbfnnpviumsqcxip && npx supabase db push
```

Y después se avisa de que queda pendiente para producción. Nada de encadenar
los dos `link` en el mismo comando, que es justo como se habían venido
aplicando —incluido un `drop table`— hasta que puso la regla.

### 🗂️ La CLI ya aplica las migraciones (2026-08-19)

`supabase link` hecho y `supabase db push` funcionando: contesta
**"Remote database is up to date"**, que es lo que tiene que decir.

Para llegar ahí hubo que renombrar los archivos. La CLI espera
`<timestamp>_nombre.sql` y aquí se llamaban `0001_charcu_schema.sql`: para ella
"0001" y "20260815033921" eran migraciones distintas, así que veía 21 versiones
remotas que no reconocía y se negaba a hacer `push`. Ahora el nombre lleva las dos
cosas — `20260815033921_0001_charcu_schema.sql` — así que la CLI encuentra su
versión y una persona sigue leyendo el orden de un vistazo.

⚠️ **La CLI sugiere `migration repair --status reverted` cuando pasa esto. NO se
hace.** Marcaría las 21 como no aplicadas y el siguiente `push` intentaría
ejecutarlas todas sobre una base que ya las tiene, empezando por el `0000_reset`
que borra el esquema. Es el consejo genérico de la herramienta y aquí era el peor
camino posible.

**De aquí en adelante, una migración nueva se crea así** (el timestamp lo pone la
CLI, y así nunca vuelve a desalinearse):

```bash
npx supabase migration new nombre_en_snake_case
npx supabase db push
```

Y se acabó lo de aplicarlas por el MCP, que además rompía las tildes.

### 🗺️ Mapa de la base: qué es cada tabla (revisado el 2026-08-21)

**⚠️ Lo primero, porque se pregunta siempre: LOS USUARIOS NO ESTÁN EN `charcu`.**
Viven en `auth.users`, que es de Supabase y no se toca nunca. Todo lo de aquí
abajo cuelga de ellos con `user_id references auth.users (id)`. Borrar cualquier
tabla de `charcu` no borra ni una cuenta.

| Tabla                             | Para qué sirve                                                                                 |
| --------------------------------- | ---------------------------------------------------------------------------------------------- |
| `chat_messages`                   | Cada pregunta y cada respuesta. Es lo que hace que recargar no sea amnesia                     |
| `usage_counters`                  | El cupo por (navegador, mes). Ojo: la clave es el NAVEGADOR, no la cuenta                      |
| `recipes`                         | Una conversación = una receta. Alimenta el historial de la hamburguesa                         |
| `ai_spend`                        | El gasto diario en IA. Global, no por usuario (ver el pendiente más abajo)                     |
| `plan_quotas`                     | Cuánto da cada plan. La pantalla promete y esto cumple                                         |
| `courses` · `modules` · `lessons` | La estructura del curso. `lessons` admite video, PDF, imagen y texto                           |
| `lesson_progress`                 | Por dónde va cada quien. Se apunta por lección y se suma por curso                             |
| `profiles`                        | País y nivel. Se crea sola con cada cuenta nueva (trigger `handle_new_user`)                   |
| `leads`                           | Los correos del muro                                                                           |
| `onboarding_answers`              | Lo que contestó antes de tener cuenta                                                          |
| `course_waitlist`                 | Quién espera qué curso. El número es público; la lista, nunca (2026-08-29)                     |
| `knowledge`                       | Las recetas y técnicas de la casa, para el Charcu AI. **Solo la lee el servidor** (2026-08-29) |
| `subscriptions`                   | **Vacía, y es la más importante** — ver abajo                                                  |

**`subscriptions` es el interruptor del negocio.** Solo la escribe el webhook de
pagos, que todavía no existe (paso 7). Y `has_active_subscription` y
`effective_plan` leen de ahí, que son las que deciden **el plan de todo el
mundo** y **quién ve un curso de pago**. Como está vacía, hoy literalmente todos
son `aprendiz` y ningún curso de pago es visible para nadie. No está sin usar:
está esperando a Hotmart.

**Se borraron tres restos** (migración `20260821062225`), los tres vacíos y sin
un solo lector en código, funciones ni políticas:

- **`videos`** — la reemplazó `lessons` en la 0011. Dos tablas para lo mismo es
  la clase de cosa que hace que alguien escriba en la equivocada. Además estaba
  rota: el `drop table charcu.courses cascade` de la limpieza de cursos se llevó
  su clave foránea sin avisar, y `course_id` apuntaba al vacío.
- **`saved_recipes`** — era para importar recetas de redes (paso 8, lo último).
  Se diseñó antes de D19/D20; cuando toque, el modelo será otro. Se vuelve a
  crear ese día.
- **`profiles.free_recipe_used`** — la marca del candado que jubiló D15. Ya no
  la escribía nadie, pero hacía dudar de cuál es la regla de verdad.

### ✅ Base de datos conectada y verificada (2026-08-05)

**⚠️ `lcvmsbfnnpviumsqcxip` NO es la base de producción** (Cristian, 2026-08-29).
Producción va a tener **otra cuenta de Supabase y otra base**. Esta —la que se
llama "elcharcu qa"— es solo de trabajo.

Tres consecuencias que hay que tener presentes:

- Los datos de prueba de aquí **no llegan a producción**. La suscripción manual
  de la cuenta de Cristian, los ocho usuarios `prueba.*@elcharcu.co` y el
  historial de chat de las pruebas se quedan en esta base.
- El día del despliegue hay que **correr todas las migraciones desde cero**
  contra la base nueva. Por eso importa tanto que cada una aguante un
  `db push` sobre una base vacía — es lo que se comprobó al poner el
  `where exists` en la suscripción de prueba.
- Y hay que rehacer allá lo que no vive en el repo: `site_url`, las plantillas
  de correo, las claves en Vercel y el `supabase link`.

Proyecto de trabajo: **`lcvmsbfnnpviumsqcxip`**. El esquema `charcu` está aplicado y probado
contra la base real (usuario de prueba creado, usado y borrado; base en cero):

- El perfil se crea solo al registrarse.
- Primera receta → pasa, marcada gratis, y `free_recipe_used` se pone en `true`.
- Segunda receta distinta sin pagar → **la base la rechaza** (`PAYWALL: …`).
- Con suscripción activa → pasa, marcada como de pago.
- Un desconocido no lee ni escribe nada (401).
- Un usuario logueado ve solo lo suyo, y **no puede regalarse una suscripción** (403).

`charcu` está publicado en la API REST, y los tipos de TypeScript están generados
desde la base real en `src/shared/api/supabase/database.types.ts`.

### 🔴 Pendientes de la cuenta

1. ✅ **RESUELTO (2026-08-05): el tope de gasto ya funciona.** `AI_DAILY_BUDGET_USD`
   ahora sí se lee y frena de verdad. Ver la sección "Tope de gasto" más abajo.
2. ✅ **RESUELTO (2026-08-15): Resend conectado al dominio.** `RESEND_API_KEY` y
   `RESEND_FROM` ya están en `.env.local`. Se acabó el límite de unos pocos envíos
   por hora del correo de prueba de Supabase.
3. ✅ **Plantillas de correo propias** (2026-08-15): `magic-link.html`,
   `confirm-signup.html` y `change-email.html` en `supabase/templates/`. Hay que
   **pegarlas a mano** en Supabase (Authentication → Email Templates); no se
   despliegan desde el repo. No hay Reset Password: aquí no hay contraseñas.
   ⚠️ La importante es **Confirm signup**, no Magic Link: la app usa
   `signInWithOtp` sin `shouldCreateUser: false`, y a un correo nuevo Supabase
   le manda esa. Si en el panel sigue el inglés por defecto, el correo feo se
   lo lleva justo la persona que estamos intentando convertir.
4. **`site_url` sigue en `http://localhost:3000`.** Hay que cambiarlo al dominio real
   antes de publicar, o los enlaces del correo llevarán al vacío.

### Cosas que SOLO Cristian puede hacer

1. ✅ Cuenta de **Supabase** — hecha y conectada.
2. ✅ Clave de la IA — es **Gemini**, no Anthropic (D10). Conectada y con tope de gasto.
3. ✅ **Precios** confirmados: US$ 9,99 / US$ 89,90 (D18).
4. 🔜 **Configurar el producto en Hotmart** (en curso): un producto de suscripción
   con DOS planes de cobro, mensual y anual. El gratis no va en Hotmart, vive en la
   app. Después hacen falta las claves para el webhook (`HOTMART_HOTTOK` ya está en
   `.env.local`).
5. ✅ **`supabase link`** hecho por Cristian (2026-08-19). La contraseña vive en el
   llavero del sistema y en `supabase/.temp/`, que está en `.gitignore`: no toca el
   repo. `db push` ya funciona.
6. ✅ **RESUELTO por retirada (2026-08-31): el curso suelto ya no existe.** Se
   quitó la sección entera (D5 retirada), así que no hay precio que convertir.
7. 🔜 Dar el **contenido**: los videos de los cursos (van a Bunny) y tus recetas.
8. 🔜 Decidir si conectamos **Vercel a `develop`**. Hoy `git push` NO despliega nada:
   no hay `.github/workflows`, ni `vercel.json`, ni `netlify.toml`. "Subido" y
   "desplegado" no son lo mismo, y tampoco tengo forma de avisarte al celular.

### Avisos abiertos

- ⚠️ **Faltan los 2 documentos de investigación de clientes.** El spec dice que están
  en `/docs`, pero esa carpeta no existe en el repo. Trabajo con las conclusiones ya
  destiladas dentro del propio spec. Si los tienes, pásalos y afino el copy.
- ⚠️ **El link del sistema de diseño de Claude devolvió 403** (es privado). Uso los
  tokens que ya están en `tailwind.config.ts`, que vienen de la Guía de Marca.
- ✅ **RESUELTO (2026-08-14): el cupo ya se cuenta en Postgres y lo aplica el servidor.**
  `/api/asistente` descuenta el cupo ANTES de llamar a Gemini; sin cupo devuelve 402 y
  no hay respuesta, por más que alguien llame a la ruta a mano. Si Gemini falla, la
  pregunta **se devuelve** (`charcu.refund_quota`): no se cobra por un error nuestro.
- ⚠️ **Queda una vía para estirar el cupo gratis: borrar las cookies.** Desde el
  2026-08-19 el daño está acotado: sin cuenta solo se contesta **1 pregunta**, así que
  borrar cookies regala una pregunta cada vez (~0,0055 USD), no ocho. El freno real del
  bolsillo sigue siendo `AI_DAILY_BUDGET_USD`, que es global. En cuanto entra con su
  correo, el cupo se cuenta por cuenta y borrar cookies deja de servir.
  🔜 **Pendiente, no bloqueante para el lanzamiento:** medir si alguien lo está
  haciendo de verdad. La idea es cruzar `visitor_id` contra señales de sesión —muchos
  visitantes nuevos seguidos con el mismo patrón, o el mismo correo apareciendo con
  varios `visitor_id`— y sacar un número antes de decidir si hay que cerrarlo. Hoy no
  hay ninguna medición: no sabemos si el fraude existe. Primero se mide, después se
  gasta trabajo en tapar.
- ⚠️ **El muro todavía no cobra.** Los botones de los planes abren WhatsApp con el plan
  escrito, que es por donde El Charcu ya vende hoy. Sirve para vender desde ya, pero
  hay que atender esos mensajes a mano. Se reemplaza por el checkout de Mercado Pago en
  el paso 7; el único archivo a tocar es `src/widgets/paywall/ui/PaywallPlans.tsx`.
- ⚠️ **Al compilar (`pnpm build`) hay que parar antes el servidor de desarrollo.**
  El build reescribe la carpeta `.next` y deja al servidor sin sus archivos, y la web
  se queda sin responder a los clics. Si pasa: parar, borrar `.next`, volver a arrancar.
- ⚠️ **Ninguna clave se pega en el chat.** Cuando toque, van a un archivo `.env.local`
  que no se sube a git. Si alguna vez pegas una clave en el chat, hay que rotarla.
- ⚠️ La clave de Anthropic y la de Supabase **nunca** se exponen en el navegador:
  todo lo que las use corre en el servidor.

---

# 🚀 PLAN MAESTRO DE LANZAMIENTO — lunes 2026-08-31

Escrito el 2026-08-29 (sábado). **Quedan 2 días.** Este plan cubre cinco frentes
que trajo Cristian: pagos con OnePay, cursos dinámicos con lista de espera,
onboarding con intereses y WhatsApp, gamificación secuencial y el Charcu AI con
base de recetas.

**La regla que ordena todo:** el valor agregado del lanzamiento es **la IA**.
Todo lo demás existe para que la plataforma no se vea vacía alrededor de la IA.
Nada que ponga en riesgo que la IA funcione el lunes entra en estos dos días.

## 📊 Ranking: importancia vs. hacerlo AHORA

| #   | Frente                                         | Importancia (1-5) | Hacerlo ahora (1-5) | Veredicto para el lunes                                                                                                                                                                 |
| --- | ---------------------------------------------- | ----------------- | ------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 3   | **Onboarding** (intereses + nombre + WhatsApp) | 5                 | **5**               | ✅ ENTRA COMPLETO. Es lo más barato y lo que más rinde: alimenta la IA, alimenta el canal de venta y hace que la app se sienta personal desde el minuto uno.                            |
| 2   | **Cursos dinámicos + lista de espera**         | 5                 | **5**               | ✅ ENTRA COMPLETO. Es la solución real al bloqueo de grabar video: convierte "no tengo cursos" en "hay cola para entrar".                                                               |
| 5   | **Charcu AI con base de recetas**              | 5                 | **4**               | ⚠️ ENTRA A MEDIAS. Entra el contexto explícito (que se vea de qué curso/receta habla) y una tabla `knowledge` curada. NO entra RAG con embeddings.                                      |
| 1   | **Pagos con OnePay**                           | 5                 | **2**               | ❌ NO ENTRA COMO INTEGRACIÓN. El lunes se cobra con link manual + activación a mano. La integración va la semana 2. Explicación abajo, es la decisión más importante de este documento. |
| 4   | **Gamificación secuencial**                    | 3                 | **3**               | ⚠️ ENTRA LA VERSIÓN BARATA. Desbloqueo secuencial solo dentro de la ruta de las 5 cápsulas gratis. Sin rachas, sin puntos, sin insignias.                                               |

**Traducción:** el lunes se lanza con 3, 2, media 5 y un cuarto de 4. El 1 se
lanza **manual**, que es distinto de no lanzarlo.

---

## 1. Pagos — OnePay (D21)

### D21 — Se cambia Hotmart por OnePay, pero NO para el lunes

Cristian decide (2026-08-29) mover el cobro a **OnePay** (`api.onepay.la`), una
pasarela colombiana. Sustituye a D17 (Hotmart). Tiene sentido: comisión local,
cobro en pesos, PSE y Bre-B — que ataca de frente la objeción nº1 documentada
en el spec (desconfianza a las suscripciones en dólares). Ojo con D18: los
precios están hoy en **US$ 9,99 / US$ 89,90** y OnePay **solo soporta COP**.
Hay que fijar precio en pesos antes de crear el plan.

### Lo que dice la documentación (leída el 2026-08-29)

- **Autenticación:** `Authorization: Bearer sk_test_xxx` / `sk_live_xxx`. Un
  solo dominio, `https://api.onepay.la/v1`; el entorno lo decide **la clave**,
  no la URL. Esto es una trampa esperando: una clave `sk_live` en QA cobra de
  verdad. La clave se elige por variable de entorno y nunca se hardcodea.
- **Modelo:** `plan` (plantilla: monto + frecuencia) → `subscription`
  (instancia: cliente + plan + método de pago). Antes hay que crear el
  **cliente** (`/customers`) y tener una **tarjeta tokenizada** (`card_id`) o
  una **cuenta bancaria** (`account_id`). Solo uno de los dos.
- **`POST /plans`** — `name`, `amount`, `currency: "COP"`, `cycle_frequency`,
  `cycle_type` (`monthly` | `annual`).
- **`POST /subscriptions`** — requiere `x-idempotency` (header obligatorio),
  `customer_id`, `plan_id`, `card_id` o `account_id`.
  ⚠️ **La página "Crear suscripción" de OnePay está desactualizada y ellos
  mismos lo advierten**: el cuerpo largo que muestra (`amount_in_cents`,
  `cicle_frequency`, `cicles`, `trial`, `complex_payments`) **ya no se acepta**
  y devuelve 422 pidiendo `plan_id`. El monto y la periodicidad se definen al
  crear el plan. Antes de integrar hay que **confirmar el cuerpo con soporte de
  OnePay** — lo dice el propio doc.
- **Estados:** `CREATED` · `ACTIVE` · `UNPAID` (falló el último pago, reintenta)
  · `PASS_DUE` (fallaron todos los reintentos) · `FROZEN` (pausada) ·
  `CANCELED` · `FINISHED`.
- **Cancelar:** `DELETE /subscriptions/{id}`.
- **Webhooks** — esto es lo que de verdad hay que implementar:
  - Headers: `x-webhook-token` (siempre), `x-webhook-event` (siempre) y
    `Signature` (HMAC-SHA256 hex del cuerpo crudo, **solo si** configuraste
    secret).
  - ⚠️ **La firma va en `Signature`, NO en `x-onepay-signature`.** Versiones
    viejas del doc decían lo otro; si lo implementamos contra el header viejo,
    el endpoint procesa eventos sin autenticar y nunca nos enteramos.
  - El cuerpo hay que verificarlo **sin parsear** (`rawBody`). Si Next
    reserializa el JSON, la firma no cuadra jamás.
  - Comparación en **tiempo constante** (`timingSafeEqual`).
  - Eventos que nos importan: `subscription.active`, `subscription.paid`,
    `subscription.unpaid`, `subscription.pass_due`, `subscription.canceled`,
    `subscription.frozen`, `subscription.finished`. Para el curso suelto:
    `charge.paid`, `charge.failed`, `charge.refunded`, `payment.approved`.
  - Entrega: hay que responder **2xx/3xx en menos de 10 segundos**. 6 intentos
    (10 s, 30 s, 1 min, 2 min, 5 min). Un 4xx nuestro NO cancela los reintentos.
    Hay reconciliación cada 10 minutos, y ahí **un 4xx sí cuenta como rechazo
    definitivo**. Conclusión de diseño: el webhook **encola y contesta 200**, no
    hace trabajo pesado en línea. Y como reintenta 6 veces con el mismo cuerpo,
    **tiene que ser idempotente** — misma entrega dos veces, mismo resultado.
  - El `secret` **solo se ve una vez** al crear el webhook. Si se pierde, se
    borra y se crea otro.

### 🔴 Por qué OnePay NO entra el lunes

Tres bloqueos, ninguno de código:

1. **El cliente tiene que meter la tarjeta.** OnePay no tiene checkout alojado
   para suscripciones: el `card_id` sale de tokenizar con su **SDK Elements** en
   nuestro frontend (`POST /cards/tokenized` recibe el `card_token` que devuelve
   `tokenize()`), más 3D Secure. Eso es integrar un SDK que no hemos visto, en
   producción, con dinero real, en 48 horas. Es exactamente el tipo de cosa que
   se lanza rota.
2. **KYC.** Habilitar métodos de pago depende de la configuración de la cuenta —
   "comunícate con soporte para habilitar métodos adicionales". No es algo que
   se apruebe un domingo.
3. **El doc está en obras.** El propio OnePay pide confirmar el cuerpo de
   `POST /subscriptions` con soporte. Integrar contra un contrato que la casa
   marca como incierto, dos días antes de lanzar, es regalarle el lanzamiento al
   azar.

### ✅ Lo que SÍ se hace el lunes: cobro manual, activación real

El interruptor del negocio ya existe: `charcu.subscriptions` con
`has_active_subscription()` y `effective_plan()` leyendo de ahí. **No hay que
construir nada del lado de la app** — hay que llenar esa tabla.

- El botón "Suscribirme" abre **WhatsApp** con un mensaje prellenado (WhatsApp
  ya es el canal real de venta, D16). Cristian manda un link de cobro de OnePay
  o de Bre-B/Nequi.
- Cuando el pago entra, se activa con **un `UPDATE`**: `status = 'active'`,
  `rail = 'whatsapp'` (el `check` de la columna ya lo permite),
  `current_period_end = now() + interval '1 month'`.
- Se hace una **página mínima de admin** o, si no da el tiempo, un SQL guardado.
  Con 10 o 20 suscriptores esto sobra; el día que estorbe, es que el negocio
  funcionó.
- ⚠️ **Cristian nunca pide ni recibe datos de tarjeta por WhatsApp.** Link de
  pago o transferencia. Nada más.

### 📋 CÓMO ACTIVAR UNA SUSCRIPCIÓN A MANO (el lunes se usa esto)

El botón "Suscribirme" **ya abre WhatsApp** con el plan escrito
(`QuotaWallPlans`), y lo mide con `rail: 'whatsapp'`. Lo que falta después es
manual, y son dos pasos:

**1. Cristian manda el link de cobro** (PSE, Nequi, Bre-B o transferencia).
⚠️ Nunca se piden datos de tarjeta por WhatsApp. Link o transferencia, nada más.

**2. Cuando el pago entra, se activa con este SQL.** Cambiar el correo y el
ciclo; lo demás se queda igual:

```sql
insert into charcu.subscriptions
  (user_id, status, plan_id, rail, country, current_period_end)
select u.id, 'active', 'pro-mensual', 'whatsapp', 'co',
       now() + interval '1 month'   -- 'pro-anual' + interval '1 year' si pagó el año
  from auth.users u
 where u.email = 'CORREO_DEL_CLIENTE@ejemplo.com'
on conflict (user_id) do update
  set status = 'active',
      plan_id = excluded.plan_id,
      rail = excluded.rail,
      current_period_end = excluded.current_period_end,
      updated_at = now();
```

**Para comprobar que quedó:**

```sql
select u.email, s.status, s.plan_id, s.current_period_end::date,
       charcu.has_active_subscription(u.id) as le_funciona
  from auth.users u join charcu.subscriptions s on s.user_id = u.id
 where u.email = 'CORREO_DEL_CLIENTE@ejemplo.com';
```

**Para dar de baja** cuando alguien no renueve: `update charcu.subscriptions set
status = 'canceled' where user_id = ...`. No hace falta borrar la fila.

⚠️ `rail = 'whatsapp'` distingue estas de la fila de prueba (`rail = 'manual'`) y
de las que traerá OnePay. El día que la pasarela entre, esta lista dice a quién
hay que migrar.

⚠️ El cliente **no ve el cambio hasta recargar**: el plan se lee en el servidor
al pintar la página. Decírselo en el mismo WhatsApp ahorra el "no me funciona".

### Semana 2 — la integración de verdad, en orden

1. Cuenta OnePay, KYC, claves `sk_test` y `sk_live`. Confirmar con soporte el
   cuerpo real de `POST /subscriptions`.
2. Fijar precios **en COP** (revisar D18 — no hay multimoneda).
3. `src/shared/api/onepay/` — cliente tipado, cero `any`. `x-idempotency` en
   todo POST.
4. Crear los dos planes (mensual y anual) **una sola vez** y guardar los
   `plan_id` en variables de entorno. No se crean planes en caliente.
5. `charcu.subscriptions`: añadir `provider_customer_id`,
   `provider_subscription_id` y `provider` (`'onepay'`). El `rail` ya existe.
6. `POST /api/pagos/onepay/webhook` — `rawBody`, verificar `x-webhook-token`
   siempre y `Signature` si hay secret, en tiempo constante. Guardar el evento
   crudo en una tabla `payment_events` con clave única por id de evento
   (idempotencia), contestar 200, procesar aparte.
7. Mapa de estados OnePay → nuestra columna: `ACTIVE`/`paid` → `active`;
   `UNPAID` → `past_due`; `PASS_DUE`/`CANCELED`/`FINISHED` → `canceled`;
   `FROZEN` → `past_due` (no le quitamos el acceso a alguien que solo pausó).
8. Checkout con Elements + 3DS. **Primero en staging con `sk_test`.**
9. Alternativa que puede saltarse el paso 8: **PSE** vía
   `POST /charges/pse`, que sí devuelve un link (`https://s.onepay.la/short/...`).
   No es recurrente — sirve para el **curso suelto**, no para la suscripción.
   Ojo: hay antiduplicados de 2 minutos por (`customer_id`, `bank_id`, `amount`)
   que devuelve 429; variar `external_id` no lo esquiva.

---

## 2. Cursos — el catálogo dinámico y la lista de espera

El problema real que resuelve: **grabar y editar video tiene bloqueado a
Cristian**, y la plataforma se ve vacía. La salida no es grabar más rápido, es
que la escasez juegue a favor.

### Dos tipos de contenido, no uno

- **Cápsulas** (`kind = 'capsula'`) — 3 a 6 minutos, una técnica: cómo bridar un
  jamón, cómo embutir un chorizo sin bolsas de aire, qué es de verdad la sal de
  cura y por qué la dosis importa, cómo leer un moho. **Esto es lo que la gente
  quiere aprender**, más que la receta. Son baratas de grabar: una toma, un
  plano, sin guion largo.
- **Cursos** (`kind = 'curso'`) — la receta completa de punta a punta. Caros.
  Casi todos empiezan **en lista de espera**.

Esto se implementa como una columna en `charcu.courses`, no como tabla nueva:
la estructura curso ▸ módulo ▸ lección ya aguanta ambos.

### La lista de espera (el corazón del asunto)

Regla, en una frase: **un curso que no está grabado no se esconde — se abre a
lista de espera y muestra cuánta gente lo espera.**

1. El curso vive en la base con `status = 'lista-de-espera'` (nuevo valor del
   `check`, junto a `borrador` y `publicado`).
2. Cada curso lleva `waitlist_goal` (ej. 30). La ficha muestra la barra:
   _"18 de 30 personas esperando. Cuando lleguemos a 30, lo grabo."_
3. **Solo se apunta quien esté suscrito.** Es la promesa de valor de la
   suscripción hecha visible, y filtra ruido.
4. Al llegar a la meta, Cristian graba y cambia el estado a `publicado`. Se
   avisa por correo (Resend ya está conectado) y por WhatsApp.
5. Tabla nueva `charcu.course_waitlist (course_id, user_id, created_at)`, clave
   única `(course_id, user_id)`, RLS: cada quien ve y escribe lo suyo. El
   contador público sale de una vista o una función `security definer` que
   devuelva **solo el número** — nunca la lista de quién se apuntó.

### 🔜 PENDIENTE: el carrusel de imágenes (aplazado el 2026-08-29)

`lessons.kind` acepta hoy `video`, `pdf`, `imagen` y `texto`. **Falta
`carrusel`** — una lección de varias láminas, que es el formato en el que está
buena parte del archivo de recetas de Instagram.

Decisión de Cristian (2026-08-29): **se aplaza**, no entra en el lanzamiento.
Cuando toque, hay dos caminos:

1. **`kind = 'carrusel'` + columna `file_urls text[]`** en `lessons`, sumándolo
   al `check` de `lessons_source_matches_kind`. Es una migración corta.
2. **Tabla hija de láminas** (`lesson_slides`: `lesson_id`, `position`,
   `file_url`, `caption`). Más correcta —permite pie de foto y reordenar sin
   reescribir un array— y es a donde hay que ir si el carrusel se vuelve un
   formato de primera.

Mientras tanto, un carrusel de Instagram entra como **varias lecciones
`imagen`** seguidas dentro de un módulo, o como una sola `imagen` con la lámina
principal. Feo pero funciona, y no bloquea el lanzamiento.

### Reusar el contenido de Instagram (decidido el 2026-08-29)

Los videos ya están grabados **en vertical**, que es justo el reproductor que ya
existe. Es la vía más rápida para que el catálogo no se vea vacío.

- **Se descargan y se suben a Bunny. NO se incrustan los posts.** Un embed manda
  al estudiante fuera de la plataforma por la que paga, se queda en blanco si el
  post se archiva, carga el JS de Meta dentro de la app, y —lo que lo mata— no
  da señal de "terminó", que es la que necesita `lesson_progress` para el
  desbloqueo secuencial.
- **Doble uso:** cada receta de Instagram entra **dos veces** — como lección y
  como fila en `charcu.knowledge`. El mismo trabajo alimenta el catálogo y la
  base con la que responde el Charcu AI.
- ⚠️ **El tono de Instagram no es el tono de un curso.** Un reel está hecho para
  retener 30 segundos: gancho, corte rápido, pocas cifras. Volcar 20 reels tal
  cual convierte la pestaña de cursos en un feed, que es lo contrario de lo que
  vende esta plataforma. La cura: cada cápsula que venga de Instagram lleva al
  lado una lección de **`texto`** con los números que en el reel no caben —
  dosis, temperaturas, tiempos, humedad. Ahí está lo que no está gratis.
- **Curar, no volcar.** Mejor 8 cápsulas escogidas que 30 recicladas. Y usar el
  campo `ask` de cada lección, que es lo que empuja del video al asistente.

### Por qué esto es honesto y no un truco

Porque el compromiso es real y verificable: la barra sube sola, Cristian graba
cuando llega a la meta, y la gente ve la fecha. Lo que **no** se puede hacer es
inflar el contador. Si eso se hace una vez, el mecanismo entero queda muerto —
y esta plataforma se vende sobre la confianza en una persona real.

### El día del lanzamiento

- **5 cápsulas gratis** publicadas (las que se puedan grabar hoy y mañana).
- Los 5 cursos que ya están en la base pasan a `lista-de-espera`, con su
  portada, su temario visible (el índice ya se muestra, migración
  `20260821202602`) y su barra.
- La pestaña de cursos se reorganiza tipo Platzi: **fila de cápsulas arriba**
  (lo que se puede ver ya), **cuadrícula de cursos abajo** con su estado.

---

## 3. Onboarding — intereses, nombre y WhatsApp

Ya existe (`features/onboarding`: país → nivel → producto, guardando paso a
paso en `charcu.onboarding_answers`). **No se reescribe, se amplía.** El patrón
bueno que ya tiene —una pregunta por pantalla, guardado en cada paso, sin botón
de siguiente— se respeta.

### Lo que se agrega

1. **Nombre** — primera pantalla. Una sola línea. Se usa en todas partes
   ("Hola, Cristian") y hace que la app deje de sentirse anónima.
2. **Intereses (varios)** — sustituye a la pregunta de un solo `product`.
   Categorías: **Quesos · Jamones cocidos · Jamones curados · Chacinados ·
   Chorizos · Embutidos frescos · Ahumados · Sal de cura y seguridad**. Selección
   múltiple. Esto configura el panel Y el Charcu AI.
3. **WhatsApp** — última pantalla, con el indicativo del país que ya contestó
   (Colombia por defecto). **Se pide, no se exige**: un botón "Ahora no" visible.
   Pedirlo a la fuerza aquí mata la conversión — el momento de máximo interés
   para pedirlo es después de la primera respuesta buena de la IA (D16), no
   antes de haber visto nada.

### Base de datos

- `onboarding_answers`: agregar `full_name text`, `whatsapp text`,
  `interests text[]`. Actualizar `charcu.save_onboarding` (sube de 5 a 8
  parámetros; se crea la función nueva y se revoca la vieja).
- `profiles`: agregar `full_name` y `interests text[]`, que es de donde leerá la
  app día a día. `onboarding_answers` guarda lo del anónimo;
  `link_onboarding_to_user` ya lo ata al registrarse, y se amplía para que
  además copie nombre e intereses al perfil.
- ⚠️ **El WhatsApp es dato personal sensible (Ley 1581 de 2012).** Hace falta la
  casilla de autorización con enlace a la política de tratamiento, y guardar
  **cuándo** la aceptó. Sin eso no se puede usar para vender.

### Cuándo se dispara

Primera vez que alguien entra a la app con cuenta y `profiles.interests` está
vacío. **Se puede saltar entero.** Un onboarding obligatorio de 4 pantallas
delante de un producto que la gente todavía no sabe si quiere es un muro.

---

## 4. Gamificación — el desbloqueo secuencial

La idea de Cristian: hay que ver una lección para desbloquear la siguiente, y
así 5 cápsulas rinden como plataforma mientras él publica una nueva cada semana.

### Lo que entra el lunes (barato y honesto)

- **Ruta secuencial solo en las 5 cápsulas gratis.** La cápsula 2 se abre al
  terminar la 1. Ya existe `lesson_progress` y `/api/progreso`: es una columna
  `unlock_mode` en `courses` y una comprobación en la vista.
- **Al terminar la ruta**, la pantalla final ofrece **apuntarse a la lista de
  espera** de los cursos que le calzan con sus `interests`. Aquí se cierra el
  círculo: onboarding → contenido → lista de espera → suscripción.
- **Un curso nuevo por semana**, anunciado con fecha. El compromiso público es
  la mitad del valor.

### Lo que NO entra, y por qué

- Puntos, insignias, rachas, ranking. Son semanas de trabajo y este público —
  gente adulta curando carne en su casa— no responde a eso. Responde a **no
  enfermar a la familia** y a **que le quede bien**.
- **Bloquear contenido de pago detrás de progreso.** Alguien que paga y no puede
  ver lo que pagó pide reembolso, y tiene razón. El secuencial es para la ruta
  **gratis**, que es donde sirve de guía; en lo pagado, se sugiere el orden, no
  se impone.
- ⚠️ **El riesgo real de esta idea:** si el desbloqueo se siente como un peaje en
  vez de una guía, la gente se va. Se mitiga con dos cosas: cápsulas de 3-6
  minutos (nadie protesta por esperar 4 minutos) y un contador visible de "vas
  2 de 5".

---

## 5. El Charcu AI — la base de recetas y el contexto visible

Hoy el asistente responde con el conocimiento del modelo y el historial del
chat. Lo que pide Cristian es que responda **desde nuestro conocimiento** —
"basado en la receta del chorizo santarrosano"— y que se **vea** de qué está
hablando.

Son dos problemas distintos y solo uno es urgente.

### 5a. Que se vea de qué habla (ENTRA EL LUNES — es lo más barato y lo que más se nota)

- Cabecera pegajosa en el chat: **"Hablando de: Chorizo santarrosano"** con el
  enlace al curso o la receta, y un botón para cambiar de tema. La base ya
  soporta esto: una conversación **es** una receta (D19), y `recipes` ya existe.
- Desde una lección, el botón "Pregúntale al Charcu" abre el chat **ya atado a
  esa lección**, y la primera línea lo dice.
- Las burbujas que se apoyan en una receta nuestra llevan una marca discreta:
  _"según la receta de El Charcu"_. Distinguir lo nuestro de lo que sabe el
  modelo es una promesa de marca, no un adorno — el contra-argumento nº1 del
  spec es literalmente "no son recetas de IA".

### 5b. La base de conocimiento (ENTRA UNA VERSIÓN SIMPLE)

- Tabla `charcu.knowledge`: `slug`, `title`, `kind` (`receta` | `tecnica` |
  `seguridad`), `body` (markdown), `tags text[]`, `course_id` opcional.
- Se llena a mano con lo que Cristian ya tiene escrito: los tres guiones que ya
  están en `docs/` (chorizo de ajo, chorizo paisa, longaniza colombiana), la
  tabla de sal de cura y 5-10 recetas más.
- **Recuperación por palabras clave y tags, NO por embeddings.** Con 20 o 50
  documentos, buscar por `tags` y por texto (`websearch_to_tsquery` de Postgres)
  acierta igual que pgvector y se hace en una tarde en vez de una semana. El día
  que haya 300 documentos se cambia la recuperación sin tocar nada más — por eso
  el `body` va en la tabla y no en el prompt.
- El texto recuperado se inyecta en el prompt de `/api/asistente` con la
  instrucción explícita: **si la receta de El Charcu contradice lo que sabes,
  manda la receta de El Charcu**; y si no hay documento, decirlo en vez de
  inventar.
- ⚠️ **Ojo con el tope de gasto.** Meter 3 documentos en cada pregunta multiplica
  los tokens de entrada. `AI_DAILY_BUDGET_USD` ya frena el desastre, pero hay que
  **medir el costo por pregunta antes y después** del cambio. Se recortan los
  documentos a un máximo de caracteres y solo entran cuando el tema calza.
- ⚠️ **Y con la seguridad.** Las dosis de sal de cura ahora salen de nuestra
  tabla. Una cifra mal escrita en `knowledge` es una cifra que el asistente
  repite con total seguridad a alguien que va a dárselo de comer a su familia.
  **Cristian revisa a mano cada fila de seguridad antes de publicarla.**

### Lo que NO entra: RAG con embeddings

pgvector, generación de embeddings, reindexado, umbrales de similitud. Es la
solución correcta para dentro de tres meses y la equivocada para el lunes.

---

## 🗓️ Los dos días, hora por hora

### ✅ Bloque 1 HECHO — migraciones 0013, 0014 y 0015 (2026-08-29)

Aplicadas con `db push` y verificadas contra la base real. `migration list`
muestra las 35 alineadas, local = remoto.

| Migración                           | Qué trajo                                                                                                                                                                                            |
| ----------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `0013_capsulas_y_lista_de_espera`   | `courses.kind` · `waitlist_goal` · `unlock_mode` · `status = 'lista-de-espera'` · tabla `course_waitlist` · `join_waitlist()` · `course_waitlist_count()` · `is_in_waitlist()` · `can_open_lesson()` |
| `0014_perfil_y_onboarding_ampliado` | `profiles.full_name` e `interests` · `onboarding_answers.full_name/whatsapp/interests/consent_at` · `save_onboarding` de 8 parámetros                                                                |
| `0015_base_de_conocimiento`         | tabla `knowledge` · `search_knowledge()`                                                                                                                                                             |

**⚠️ El link con Supabase se había perdido.** `supabase/.temp/project-ref` ya no
estaba y `db push` contestaba "Cannot find project ref". Se recuperó **sin la
contraseña de la base**: el `SUPABASE_ACCESS_TOKEN` de `.env.local` basta para
`npx supabase link --project-ref lcvmsbfnnpviumsqcxip`. Anotado porque va a
volver a pasar, y el reflejo equivocado es pedirle la contraseña a Cristian.

**Tres cosas que se aprendieron aplicándolas:**

1. **`profiles_update_own` ya existía desde la 0001**, letra por letra. La 0014
   la traía otra vez y el `db push` se cayó (`42710`). El usuario SIEMPRE pudo
   editar su perfil; el `grant select, insert, update on all tables` de la 0001
   ya le daba el permiso. La sección se dejó escrita en el archivo, vacía y con
   la explicación, porque la pregunta se va a repetir.
2. **Ese `grant ... on all tables` solo alcanzó a las tablas que existían ese
   día.** `course_waitlist` y `knowledge` nacen sin permiso para
   `authenticated` — deseado en `knowledge`, y explícito en `course_waitlist`.
3. **`&` no existe para `text[]`.** Es de la extensión `intarray` y solo sirve
   con enteros. La intersección de tags en `search_knowledge` va con
   `intersect` dentro de un subselect.

**Verificado en la base:** las 5 filas de `courses` quedaron en `kind = 'curso'`,
`unlock_mode = 'libre'` y posiciones 10-50 sin choque; `knowledge` tiene RLS
encendida y **cero políticas** —llamar a `search_knowledge` desde un rol que no
sea el de servicio devuelve `permission denied`, que es exactamente el
comportamiento que se buscaba—; y de `save_onboarding` queda **una sola
versión**, así que nadie puede llamar por error a la vieja de 5 parámetros y
perder el nombre y el teléfono en silencio.

**Del lado de TypeScript:** tipos regenerados desde la base. El `type-check`
cazó al vuelo que `/api/onboarding` llamaba a la firma vieja; la ruta ya acepta
`fullName`, `whatsapp`, `interests` y `consent`, y las categorías canónicas
viven en `shared/config/interests.ts` — una sola lista para la pantalla, la ruta
y (mañana) el prompt. **El teléfono no se guarda sin la casilla marcada**: un
número sin permiso no se puede usar para nada, así que guardarlo sería quedarse
el riesgo sin el beneficio.

### ✅ Bloque 2 HECHO — el onboarding, y lo que se llevó por delante (2026-08-29)

**Migración `0016_onboarding_obligatorio`** aplicada: `profiles.onboarding_status`
(`pendiente` | `listo`), `whatsapp`, `whatsapp_consent_at` y la función
`complete_onboarding()`, que hace las cinco escrituras juntas o ninguna. Si el
flag se pusiera en `listo` por su cuenta y el resto fallara, esa persona
entraría a una app configurada con nada y sin forma de que se le vuelva a
preguntar.

**El onboarding se mudó DETRÁS del login.** Ya no es la pantalla anónima de
`/bienvenido`: se lanza cuando alguien vuelve del enlace del correo y entra por
primera vez. Ahí ya hay cuenta —así que las respuestas viven en `profiles` y no
colgando de una cookie— y ahí sí se puede exigir. Antes de tener cuenta, un
formulario obligatorio es el muro que quitó D14.

**La puerta vive en `src/app/(app)/layout.tsx`,** al lado de la del login.
⚠️ Se **renderiza** el formulario en vez de `children`; NO se redirige. Con un
`redirect` el formulario sería una ruta más y bastaría escribir `/charcu` en la
barra para saltárselo. Va además sin `AppFrame`: la barra de abajo invita a
irse a otra pestaña, y de aquí no se sale hasta completarlo.

**Dos pasos, en este orden:** (1) intereses, (2) nombre + WhatsApp en un solo
formulario. Los intereses van primeros porque son la pregunta agradable —se
contesta tocando y no pide un dato personal—; abrir pidiendo nombre y teléfono
es abrir pidiendo. El **nombre es obligatorio y el WhatsApp no**: es la única
forma honesta de hacer obligatorio el formulario entero. Si el teléfono fuera
obligatorio, el número que dejaría la gente sería falso.

⚠️ **El WhatsApp NO se verifica.** Pedido explícito de Cristian: el flujo de
código por WhatsApp queda fuera del lanzamiento. Consecuencia asumida: habrá
números mal escritos en la base.

**Lo que se cayó por el camino, y por qué:**

| Se fue                                              | Por qué                                                                                                                                                                                                                                                                      |
| --------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| La pregunta de **país**                             | Mixpanel da la analítica y el prompt saca el país de `x-vercel-ip-country`. Un dato que llega solo no se pregunta — y de paso se tapó un agujero: venía en el cuerpo de la petición, o sea que se podía escribir cualquier cosa desde la consola y acababa dentro del prompt |
| La pregunta de **nivel**                            | "Todos son charcus" (Cristian). `LEVEL_GUIDANCE` fuera del prompt: el oficio se explica igual para todos                                                                                                                                                                     |
| La pregunta de **producto**                         | Era casi la misma lista que intereses, dos pantallas antes                                                                                                                                                                                                                   |
| `COUNTRIES`, `EXPERIENCE_LEVELS`, `CURING_PRODUCTS` | Una sola lista ahora, `shared/config/interests.ts`. Eso desenganchó `recipe-session` de `curing-profile`: un import entre entidades menos                                                                                                                                    |
| El copy _"X es tu receta gratis"_ de `DoneStep`     | Prometía un tope que la base no aplica desde D20                                                                                                                                                                                                                             |
| `saveAnswers` y el guardado paso a paso             | Existía para aprender de quien abandona, y de este formulario no se puede abandonar                                                                                                                                                                                          |

**Editar desde la cuenta:** `features/edit-profile` enchufado en la pestaña de
cuenta, con `PATCH /api/perfil`. Existe porque los gustos cambian: alguien entra
queriendo chorizos y a los dos meses está con quesos. Sin esa pantalla, el panel
y el Charcu AI se quedarían configurados con lo del primer día.

⚠️ **Las 9 cuentas que ya existían quedaron en `pendiente`.** Ninguna tenía
intereses, así que ninguna se dio por hecha. La próxima vez que entren verán el
formulario una vez. Es deseado: a cambio dejan de ser cuentas de las que no
sabemos nada.

**Verificado:** `type-check` y `lint` en verde; `/charcu` compila y devuelve 307
a `/entrar` sin sesión. ⚠️ **Las dos pantallas del onboarding NO se han visto
renderizadas** — hacen falta una cuenta y un enlace de correo, y eso solo lo
puede probar Cristian.

### ✅ Bloque 3 HECHO — la pestaña de cursos (2026-08-29)

**`0017_capsulas_gratis_y_cursos_en_espera`** y
**`0018_lista_de_espera_sin_suscripcion`** aplicadas.

**Cinco cápsulas gratis**, en ruta secuencial: sal de cura (3 lecciones),
calcular con El Charcu (2), bridar un jamón (2), embutir un chorizo (2),
amarrar chorizos (2). Once lecciones en total.

⚠️ **NACEN EN TEXTO, NO EN VIDEO, Y ES A PROPÓSITO.** No hay video grabado y no
se finge. La 0012 y la del catálogo ya metieron el mismo placeholder del corte
del lomo en 13 lecciones; repetirlo en lo ÚNICO gratis del lanzamiento sería que
el primer contacto de todo visitante nuevo fuera un video que no habla de lo que
promete el título. Una lección de `texto` con las cantidades por escrito es
contenido de verdad, y el video se añade encima cuando exista sin tocar nada.

⚠️⚠️ **CRISTIAN TIENE QUE LEER LAS CÁPSULAS ANTES DE PUBLICAR.** El texto lo
redactó Claude. Las cifras de seguridad salen de sitios ya verificados en este
repo —`entities/cure-safety` y el prompt del asistente: 2,5 g/kg de cura #1,
156 ppm, #1 contra #2, pieza entera contra picado, 30-40 % de merma— y no de
ninguna parte nueva. Pero la VOZ y el CRITERIO del oficio son suyos, y la
cápsula de sal de cura es exactamente la fila donde una palabra mal puesta llega
a alguien que va a darle eso de comer a su familia.

**Los cuatro cursos con video de relleno pasaron a `lista-de-espera`** con meta
de 30. `lomo-curado` se queda publicado: es el único con videos reales.
Publicados prometían algo que no está detrás; en lista de espera dicen la verdad
y además nos dicen a cuánta gente le interesa cada uno, que es lo que decide qué
se graba primero.

**La 0018 quitó la exigencia de suscripción para apuntarse.** La 0013 la pedía, y
el razonamiento era bueno — pero daba por hecho que habría cómo suscribirse. Con
OnePay aplazado, `subscriptions` está vacía y el botón le habría contestado
`necesita-suscripcion` a todo el mundo: un botón muerto en la única pantalla que
tiene que demostrar que aquí pasan cosas. **La cuenta sí se sigue exigiendo**: sin
`user_id` no hay a quién avisar, y una lista anónima se infla desde una pestaña
de incógnito. Se revierte volviendo a poner tres líneas.

**En la app:** `CapsuleRow` (fila corta, numerada, con candado secuencial),
`CourseRow` con estado de lista de espera y barra, `WaitlistButton` que sube el
contador sin recargar, y `POST /api/lista-de-espera`.

⚠️ **El contador NUNCA se infla.** Si son 3, dice 3. Falsearlo una vez mata el
mecanismo entero: esto se vende sobre la confianza en una persona real.

**Verificado** en pantalla de celular con datos que replican los de la base: la
ruta de cápsulas con sus tres estados (terminada, abierta, cerrada) y las dos
variantes de la lista de espera (sin apuntarse y ya dentro). `type-check` y
`lint` en verde.

### 🚨 La migración vacía que casi hunde el lanzamiento (2026-08-30)

Al levantar la base de PRODUCCIÓN, `db push` se cayó en la migración 19 de 41:

```
ERROR: relation "courses" already exists (SQLSTATE 42P07)
```

**Causa.** La `0001` crea una `charcu.courses` de la versión 1 —`id text`,
`name`, `rating`, `is_published`— y la `0011` crea la de ahora. Son dos tablas
distintas con el mismo nombre, y entre las dos había un borrado. Ese borrado
vivía en `limpieza_cursos_reaplicar_20260819`, que se rehízo **vacía** con este
razonamiento: _"sobre una base nueva no hay datos de prueba que limpiar ni
esquema que reconstruir"_.

El razonamiento valía para las otras limpiezas y no para esa. En QA nunca se
notó porque allí el borrado sí se ejecutó, en su día y a mano.

**La lección, que vale para todo lo que venga:** una migración vaciada "porque
sobre una base nueva no hace falta" **hay que comprobarla contra una base nueva
de verdad**. Se descubrió el día antes del lanzamiento y por suerte sin datos
que perder.

**Arreglo.** Se devolvió el `drop table ... cascade` al archivo, y en producción
se reparó ESA SOLA migración (`migration repair --status reverted 20260820121141`)
para que volviera a correr. ⚠️ Esto no contradice el aviso de más arriba contra
`migration repair`: aquel era por repararlas TODAS, que habría re-ejecutado el
`0000_reset` y borrado el esquema. Reparar una sola, que solo tira dos tablas
que ya no deben existir, es otra cosa.

**Verificado en producción:** 41 migraciones, 5 cápsulas, 5 cursos, 71
lecciones, 5 planes, 0 usuarios y **0 suscripciones** — la migración de la
suscripción de prueba no insertó nada gracias a su `where exists`, que es
exactamente para lo que se puso.

### ⚠️ Lo que NO viaja en las migraciones (y hay que rehacer en cada base)

Descubierto al levantar producción, porque la app no podía leer nada:

1. **Exponer el esquema `charcu` en la API.** Settings → API → Data API →
   _Exposed schemas_. Sin esto, PostgREST contesta
   `PGRST106: Only the following schemas are exposed: public, graphql_public`
   y la app entera se queda ciega.
2. **`site_url`** al dominio real.
3. **Las plantillas de correo**, sobre todo _Confirm signup_.
4. **Las claves** (`SUPABASE_URL`, `SUPABASE_PUBLISHABLE_KEY`,
   `SUPABASE_SECRET_KEY`) en Vercel.

**Sábado 29 (hoy)**

1. Base de datos, todo en una tanda de migraciones (es lo que bloquea al resto):
   `courses.kind` y `status = 'lista-de-espera'` y `waitlist_goal`;
   `course_waitlist`; `knowledge`; `profiles.full_name/interests`;
   `onboarding_answers.full_name/whatsapp/interests` y `save_onboarding` nueva.
2. Regenerar los tipos de TypeScript desde la base real.
3. Onboarding ampliado (nombre, intereses múltiples, WhatsApp opcional con
   autorización).
4. Cabecera de contexto del chat (5a). Es media tarde y se nota muchísimo.

**Domingo 30**

5. Pestaña de cursos rehecha: cápsulas arriba, cuadrícula con barra de lista de
   espera abajo. Botón de apuntarse.
6. Desbloqueo secuencial en la ruta gratis + pantalla final que ofrece la lista
   de espera.
7. `knowledge` cargada con los tres guiones de `docs/` + sal de cura, e
   inyección en `/api/asistente`. **Medir el costo por pregunta.**
8. Botón de suscripción → WhatsApp. SQL de activación manual, guardado y probado
   de punta a punta con una cuenta de verdad.

**Lunes 31 — antes de publicar (esto no es opcional)**

9. `site_url` de Supabase al dominio real. **Sigue en `localhost:3000`** y si no
   se cambia, cada enlace de correo lleva al vacío. Es el pendiente que hunde el
   lanzamiento solo.
10. Plantillas de correo pegadas en el panel de Supabase — sobre todo **Confirm
    signup**, que es la que recibe la gente nueva.
11. Fusionar `develop` en `main` y conectar `main` a elcharcu.co. Producción
    nunca se ha usado: probarlo el lunes por primera vez es el segundo riesgo
    más grande del plan. **Hay que probar el despliegue a producción el
    domingo**, no el lunes.
12. Prueba de humo en celular real: registrarse con un correo nuevo, hacer el
    onboarding, preguntarle algo al asistente, ver una cápsula, apuntarse a una
    lista de espera, tocar suscribirse.

## ⚠️ Lo que puede salir mal

- **Producción nunca se ha estrenado.** El dominio, los correos y las variables
  de entorno de producción son tres cosas distintas de las de QA, y las tres
  fallan la primera vez. Por eso el punto 11 se adelanta al domingo.
- **`NEXT_PUBLIC_*` marcadas como "Sensitive" en Vercel** ya costó una mañana
  entera (está documentado más arriba). Revisar eso ANTES de tocar producción.
- **Cobrar a mano no escala, y está bien.** Si el lunes entran 30 suscriptores,
  son 30 `UPDATE` y un problema precioso de tener.
- **Cinco cápsulas es poco contenido.** Lo que sostiene el lanzamiento es la IA
  y el compromiso semanal, no el catálogo. Si el copy promete un catálogo, miente.
