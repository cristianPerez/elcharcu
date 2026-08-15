# ESTADO — El Charcu (plataforma)

Memoria viva del proyecto. Se actualiza al cerrar cada etapa.
Última actualización: 2026-08-15

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
| Sitio público    | ✅ `/`, `/recetas`, `/recetas/[slug]`, `/tablas`, `/tablas/[slug]`                  |

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
      Pendiente de este bloque: **las sesiones de receta siguen en el navegador**, y se
      quedan así a propósito — eran la unidad del modelo viejo (D15 las jubiló).
- [x] **5. Asistente con Gemini** — chat por receta, foto para diagnóstico de moho, y
      doble barrera de seguridad (prompt + revisión en código antes de mostrar). Probado
      contra la API real: dosis correcta, negativa ante 8 g/kg, y veredicto "descartar"
      con foto de moho verde. La conversación todavía NO se guarda: vive en la pantalla.
- [ ] **4c. Muro fusionado + cuenta al 3er mensaje.** Hoy son DOS interrupciones
      en el primer minuto: el muro blando (nombre/correo/WhatsApp) en la pregunta
      1 y, si se pide cuenta después, otra. Se fusionan en una sola en el mensaje
      3 — el mismo formulario, que además crea la cuenta con el enlace al correo.
      🔴 **BLOQUEADO por el SMTP propio**: hoy el correo de entrada es el de
      prueba de Supabase (pocos envíos por hora). Si la cuenta se vuelve
      obligatoria en el mensaje 3, ese correo pasa a ser el cuello de botella de
      TODO el embudo. Cristian está creando la cuenta de Resend.
- [ ] **5b. Guardar la conversación** en `charcu.chat_messages` y las fotos en Storage.
      Va junto con el 4b, porque las dos cosas necesitan la sesión del usuario.
- [ ] **6. Mini-cursos** en video (Bunny) con puerta libre/pago. El video se sirve con
      URL firmada: la app decide quién puede verlo, no Bunny.
- [ ] **7. Pagos reales** (Hotmart + webhook, D17). Tres cosas que hay que resolver sí o
      sí: emparejar la compra con el usuario de Supabase, atender el reembolso/chargeback
      para cortar el acceso, y no confiar en el correo del comprador a ciegas.
- [ ] **8. Importar recetas de redes** (lo último, es retención no captación)

---

## 💰 Tope de gasto de la IA (hecho el 2026-08-05)

`AI_DAILY_BUDGET_USD` (hoy en **5 USD**) ya frena de verdad las llamadas a Gemini.

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
| **Coste por pregunta** | **~0,0055 USD** | ≈ **900 preguntas al día** con 5 USD         |

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
      revisado con los tokens nuevos. Es lo siguiente.
- [ ] **Capa 4 — tipografía.** Escala aplicada solo en el asistente; falta el
      resto del sitio.
- [ ] **Capa 5 — movimiento.** No hay ni una animación y **no hay librería
      instalada**. Requiere `motion` (~4kb) y decidirlo, porque es una
      dependencia nueva. Las 7 de base están especificadas en el plan.
- [ ] **Estados de carga y vacíos.** No existen: hoy no hay skeleton ni empty
      state en ninguna pantalla.

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

- Hay dos entradas que no tienen archivo: el `0000_reset…` de ese día y una limpieza de
  datos de prueba. Son el registro honesto de lo que pasó, no migraciones del producto.
- La CLI **no puede hacer `push`** todavía: falta `supabase/config.toml` (`supabase init`)
  y la contraseña de la base. Por eso se aplicaron por la conexión del MCP.

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
3. ✅ **Plantilla de correo propia**: `supabase/templates/magic-link.html`, con la
   paleta de El Charcu y probada a 375px. Hay que **pegarla a mano** en Supabase
   (Authentication → Email Templates → Magic Link); no se despliega desde el repo.
   Faltan por hacer las otras plantillas (Confirm signup, Change email, Recovery),
   que siguen en inglés por defecto.
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
5. 🔜 **`supabase link --project-ref lcvmsbfnnpviumsqcxip`** — pide la contraseña de
   la base y esa no se pega en el chat. Sin esto la CLI no puede hacer `db push` y
   las migraciones hay que aplicarlas por el MCP.
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
- ⚠️ **Queda una vía para estirar el cupo gratis: borrar las cookies.** El visitante
  anónimo es una cookie `httpOnly`; quien la borre estrena 8 preguntas. Se cierra del
  todo solo pidiendo cuenta para preguntar, que es justo lo contrario de D14. Mientras
  tanto el freno real del bolsillo sigue siendo `AI_DAILY_BUDGET_USD`, que es global.
  En cuanto el visitante entra con su correo, el cupo pasa a contarse por cuenta y
  borrar cookies deja de servir.
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
