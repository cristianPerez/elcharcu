# ESTADO — El Charcu (plataforma)

Memoria viva del proyecto. Se actualiza al cerrar cada etapa.
Última actualización: 2026-08-04

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
- ❌ Pasarela de pago
- ❌ PWA (instalable en el celular)

---

## Decisiones tomadas (DECIDE-INFORMA-AVANZA)

Cada una es reversible. Si alguna no te gusta, se cambia.

| #   | Decisión                                                                                        | Por qué                                                                                                                                                                                                                                            |
| --- | ----------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| D1  | **No instalar el SO en `docs/sistema/`**                                                        | Pedido explícito de Cristian: usar el proyecto y la arquitectura ya instalados y no gastar contexto en eso. Sigo el rol y la secuencia maestra de memoria.                                                                                         |
| D2  | **Stack = el que ya está** (Next 15 + FSD + Tailwind)                                           | Ya existe, ya cumple el spec (Next App Router + TS + Tailwind) y ya tiene los tokens de marca. Migrar sería destruir trabajo bueno.                                                                                                                |
| D3  | **Monetización = onboarding-first, no hard paywall**                                            | Regla dura del spec: una receta completa gratis, sin tarjeta. La receta gratis _es_ el argumento de venta. El muro aparece en la SEGUNDA receta.                                                                                                   |
| D4  | **Precios PROPUESTOS en COP** (ajustables)                                                      | Mercado colombiano; suscripción en dólares es una objeción documentada. Mensual $29.900 · Anual $239.000 (2 meses gratis) · Curso suelto $89.000.                                                                                                  |
| D5  | **Vender también el curso suelto**                                                              | Este nicho compra pago único con menos fricción que auto-renovación mensual.                                                                                                                                                                       |
| D6  | **Pasarela: Mercado Pago primero** (PSE, Nequi, tarjeta), detrás de una interfaz intercambiable | Métodos locales de Colombia. Hotmart queda como alternativa para cursos sueltos; Stripe solo para España/US.                                                                                                                                       |
| D7  | **Analítica = Mixpanel** (el que ya está), no agrego otra                                       | Ya instalado y con autocapture. Evita otra cuenta y otro costo.                                                                                                                                                                                    |
| D8  | **Español neutro con vocabulario Colombia** — "tú", no "vos"                                    | El spec manda Colombia-first. Por eso la frase del muro es _"Salva tu próximo kilo de carne"_, no la variante rioplatense del borrador. Capa España queda para después.                                                                            |
| D10 | **La IA es Gemini (Google), no Claude**                                                         | Decisión de Cristian el 2026-08-05, en contra de lo que decía el spec original. `.env.local` ya está preparado para Gemini. Los topes de seguridad de la sal de cura y la lectura de fotos de moho se implementan igual, solo cambia el proveedor. |
| D11 | **Todo el esquema vive en `charcu`, no en `public`**                                            | Así El Charcu nunca choca ni se mezcla con otra app que comparta base.                                                                                                                                                                             |
| D12 | **El candado y la puerta de cursos viven en la base de datos**                                  | Un trigger rechaza la segunda receta sin suscripción, y las políticas RLS deciden qué videos se entregan. Desde el navegador ya no se puede burlar.                                                                                                |
| D13 | **Login por enlace al correo primero**                                                          | Es lo único que funciona sin configurar nada más ni gastar dinero. Teléfono/SMS necesita un proveedor que se paga por mensaje, y Google necesita credenciales aparte; ambos se suman después sin rehacer nada.                                     |
| D9  | **Ruta de la app: `/asistente`**                                                                | Consistente con `/recetas` y `/tablas`, en español, y no rompe nada del sitio actual.                                                                                                                                                              |

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
- [ ] **4b. Mover perfil, sesiones y suscripción de `localStorage` a Supabase.** El
      código de la app todavía guarda en el navegador; la base ya está lista para
      recibirlo. Es lo primero del próximo tramo.
- [x] **5. Asistente con Gemini** — chat por receta, foto para diagnóstico de moho, y
      doble barrera de seguridad (prompt + revisión en código antes de mostrar). Probado
      contra la API real: dosis correcta, negativa ante 8 g/kg, y veredicto "descartar"
      con foto de moho verde. La conversación todavía NO se guarda: vive en la pantalla.
- [ ] **5b. Guardar la conversación** en `charcu.chat_messages` y las fotos en Storage.
      Va junto con el 4b, porque las dos cosas necesitan la sesión del usuario.
- [ ] **6. Mini-cursos** en video con puerta libre/pago
- [ ] **7. Pagos reales** (Mercado Pago + webhook)
- [ ] **8. Importar recetas de redes** (lo último, es retención no captación)

---

## ⚠️ Pendientes y avisos

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

1. **Sin control de gasto de la IA.** `AI_DAILY_BUDGET_USD=5` está en el archivo pero
   NADIE lo lee todavía: hoy no hay tope que frene las llamadas a Gemini. Cada
   respuesta gasta bastante en "pensamiento" (unos 600 tokens antes de responder).
   Hay que medirlo y cortarlo antes de abrir al público.
2. **El correo de entrada es el de prueba de Supabase**: en plan gratis está limitado
   a unos pocos envíos por hora y no sirve para lanzar. Antes de abrir al público hay
   que conectar un SMTP propio (Resend, SendGrid o similar).
3. **No se pueden editar las plantillas de correo en plan gratis.** Por eso el correo
   sale en inglés y con el texto por defecto de Supabase. Se arregla con el SMTP propio.
4. **`site_url` sigue en `http://localhost:3000`.** Hay que cambiarlo al dominio real
   antes de publicar, o los enlaces del correo llevarán al vacío.

### Cosas que SOLO Cristian puede hacer (te aviso clic por clic cuando toque)

1. Crear la cuenta de **Supabase** y pasarme 2 claves (base de datos + login).
2. Crear la cuenta de **Anthropic** y pasarme 1 clave (el cerebro del asistente). **Cuesta dinero por uso.**
3. Crear la cuenta de **Mercado Pago** (o Hotmart) y pasarme las claves de cobro.
4. Confirmar los **precios** finales.
5. Dar el **contenido**: videos de los cursos y tus recetas reales.

### Avisos abiertos

- ⚠️ **Faltan los 2 documentos de investigación de clientes.** El spec dice que están
  en `/docs`, pero esa carpeta no existe en el repo. Trabajo con las conclusiones ya
  destiladas dentro del propio spec. Si los tienes, pásalos y afino el copy.
- ⚠️ **El link del sistema de diseño de Claude devolvió 403** (es privado). Uso los
  tokens que ya están en `tailwind.config.ts`, que vienen de la Guía de Marca.
- ⚠️ **El perfil del onboarding se guarda HOY en el navegador** (`localStorage`), no en
  una base de datos. Eso significa que si el usuario cambia de celular o borra datos,
  pierde su receta gratis — y que el límite de "una sola receta gratis" todavía se puede
  saltar. Se arregla solo cuando llegue Supabase. Todo el guardado está aislado en
  `src/entities/curing-profile/lib/profileStorage.ts`: ese es el único archivo a cambiar.
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
