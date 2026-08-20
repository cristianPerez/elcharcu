# ESTADO — El Charcu (plataforma)

Memoria viva del proyecto. Se actualiza al cerrar cada etapa.
Última actualización: 2026-08-18

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
| Cursos           | ✅ `/cursos` en la base (curso ▸ módulo ▸ lección) con progreso. Sin videos aún     |

**Tokens de marca ya disponibles como clases Tailwind:**
`forest` (#2D4A3E) · `terracota` (#C17A5A) · `cream` (#F4F1EB) · `sage` (#7A9E8E) ·
`cocoa` (#1E1612) · `font-serif` · `font-sans` · `tracking-eyebrow` · `.bg-grain`

**Kit UI compartido:** `Container`, `Eyebrow`, `ButtonLink`, `Logo`, `SearchBar`.

### Lo que NO está instalado todavía

- ✅ Supabase: librerías, código, esquema aplicado y tipos generados. Conectado y probado.
- ✅ Gemini conectado (`gemini-3.6-flash`), sin SDK: llamada directa desde el servidor
- 🔜 Pasarela: **Hotmart** (D17). El producto lo está configurando Cristian; el
  webhook que activa la suscripción todavía no existe (paso 7).
- ❌ Video: **Bunny** todavía sin cuenta ni videos (paso 6).
- ❌ Librería de animación: no hay ninguna. La capa 5 del rescate visual la necesita.
- ❌ PWA (instalable en el celular)
- ❌ Despliegue: **nada escucha a `develop`**. `git push` no publica.

---

## Decisiones tomadas (DECIDE-INFORMA-AVANZA)

Cada una es reversible. Si alguna no te gusta, se cambia.

| #   | Decisión                                                                          | Por qué                                                                                                                                                                                                                                                                                                                                                                                                                                                      |
| --- | --------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| D1  | **No instalar el SO en `docs/sistema/`**                                          | Pedido explícito de Cristian: usar el proyecto y la arquitectura ya instalados y no gastar contexto en eso. Sigo el rol y la secuencia maestra de memoria.                                                                                                                                                                                                                                                                                                   |
| D2  | **Stack = el que ya está** (Next 15 + FSD + Tailwind)                             | Ya existe, ya cumple el spec (Next App Router + TS + Tailwind) y ya tiene los tokens de marca. Migrar sería destruir trabajo bueno.                                                                                                                                                                                                                                                                                                                          |
| D3  | ~~**Monetización = 1 receta gratis completa**~~ **SUPERADA por D14** (2026-08-05) | Fue la regla del spec original. Cristian la cambia por un plan medido en preguntas e imágenes, con captura de datos tras la primera pregunta. Lo construido sigue sirviendo; cambia la unidad que se cuenta.                                                                                                                                                                                                                                                 |
| D4  | ~~**Precios PROPUESTOS en COP**~~ **SUPERADA por D18** (2026-08-14)               | Mercado colombiano; suscripción en dólares es una objeción documentada. Mensual $29.900 · Anual $239.000 (2 meses gratis) · Curso suelto $89.000.                                                                                                                                                                                                                                                                                                            |
| D5  | **Vender también el curso suelto**                                                | Este nicho compra pago único con menos fricción que auto-renovación mensual.                                                                                                                                                                                                                                                                                                                                                                                 |
| D6  | ~~**Pasarela: Mercado Pago primero**~~ **SUPERADA por D17** (2026-08-14)          | Métodos locales de Colombia. Sigue siendo el destino a futuro, pero no es por donde se lanza.                                                                                                                                                                                                                                                                                                                                                                |
| D17 | **Hotmart cobra la suscripción; los videos van en Bunny**                         | Decisión de Cristian (2026-08-14). Hotmart resuelve la recurrencia sin escribir código (cobro, tarjeta rechazada, reintentos, reembolsos, impuestos) a cambio de ~11% contra ~7% de Mercado Pago. Bunny aloja el video, así que NO se usa Hotmart Club. Se migra a Mercado Pago cuando el volumen justifique el trabajo; la interfaz de pago sigue siendo intercambiable.                                                                                    |
| D18 | **Precios en DÓLARES: US$ 9,99 al mes · US$ 89,90 al año**                        | Decisión de Cristian (2026-08-14), reafirmada tras advertirle el riesgo. Ojo: el propio spec documenta que la desconfianza hacia las suscripciones en dólares es la objeción nº1 de este mercado, y US$ 9,99 son ~$39.960 COP — un 34% más que los $29.900 anteriores. El anual son 9 mensualidades: se regalan 3 meses (25%). El copy "pagas en pesos, nada en dólares" se retiró de toda la web porque había quedado falso.                                |
| D19 | **Un chat = una receta. Recetas ILIMITADAS de pago, 1 en el gratis**              | Decisión de Cristian (2026-08-15). Una receta cuesta 0 —una fila de 300 bytes— y el gasto real ya lo frenan preguntas y fotos. Cobrarlas además empujaría a meter dos curados en un mismo chat para ahorrarse una, que es justo el dato que arruina los insights. El plan gratis sí lleva 1, porque ahí la receta ES el producto. La receta la crea la PRIMERA pregunta (opción B): pedir un formulario antes de escribir reintroduce el muro que quitó D14. |
| D7  | **Analítica = Mixpanel** (el que ya está), no agrego otra                         | Ya instalado y con autocapture. Evita otra cuenta y otro costo.                                                                                                                                                                                                                                                                                                                                                                                              |
| D8  | **Español neutro con vocabulario Colombia** — "tú", no "vos"                      | El spec manda Colombia-first. Por eso la frase del muro es _"Salva tu próximo kilo de carne"_, no la variante rioplatense del borrador. Capa España queda para después.                                                                                                                                                                                                                                                                                      |
| D10 | **La IA es Gemini (Google), no Claude**                                           | Decisión de Cristian el 2026-08-05, en contra de lo que decía el spec original. `.env.local` ya está preparado para Gemini. Los topes de seguridad de la sal de cura y la lectura de fotos de moho se implementan igual, solo cambia el proveedor.                                                                                                                                                                                                           |
| D11 | **Todo el esquema vive en `charcu`, no en `public`**                              | Así El Charcu nunca choca ni se mezcla con otra app que comparta base.                                                                                                                                                                                                                                                                                                                                                                                       |
| D12 | **El candado y la puerta de cursos viven en la base de datos**                    | Un trigger rechaza la segunda receta sin suscripción, y las políticas RLS deciden qué videos se entregan. Desde el navegador ya no se puede burlar.                                                                                                                                                                                                                                                                                                          |
| D14 | **El asistente vive en la PORTADA** (`/`), no detrás de una landing               | Pedido de Cristian (2026-08-05). Que el visitante pruebe el producto en el primer segundo, sin leer nada ni registrarse. El producto ES el argumento de venta.                                                                                                                                                                                                                                                                                               |
| D15 | **El plan se mide en PREGUNTAS e IMÁGENES**, no en recetas                        | Pedido de Cristian (2026-08-05). Es la unidad que el usuario entiende y la que de verdad cuesta dinero (cada pregunta gasta tokens de Gemini; cada imagen gasta bastante más).                                                                                                                                                                                                                                                                               |
| D16 | **Muro blando tras la 1ª pregunta: nombre, correo y WhatsApp**                    | Pedido de Cristian (2026-08-05). Captura el contacto en el momento de máximo interés —ya vio que funciona— y sin pedir contraseña. WhatsApp es el canal real de venta de El Charcu.                                                                                                                                                                                                                                                                          |
| D13 | **Login por enlace al correo primero**                                            | Es lo único que funciona sin configurar nada más ni gastar dinero. Teléfono/SMS necesita un proveedor que se paga por mensaje, y Google necesita credenciales aparte; ambos se suman después sin rehacer nada.                                                                                                                                                                                                                                               |
| D9  | **Ruta de la app: `/asistente`**                                                  | Consistente con `/recetas` y `/tablas`, en español, y no rompe nada del sitio actual.                                                                                                                                                                                                                                                                                                                                                                        |

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

### ✅ Base de datos conectada y verificada (2026-08-05)

Proyecto: **`lcvmsbfnnpviumsqcxip`**. El esquema `charcu` está aplicado y probado
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
6. 🔜 **Precio del curso suelto en dólares.** Sigue en $89.000 COP, con la moneda
   escrita al lado para que nadie lo lea como 89 dólares. Chirría junto a US$ 9,99.
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
