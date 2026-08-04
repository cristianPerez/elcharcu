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

- ❌ Supabase (base de datos, login, almacenamiento de fotos)
- ❌ SDK de Anthropic (el cerebro del asistente)
- ❌ Pasarela de pago
- ❌ PWA (instalable en el celular)

---

## Decisiones tomadas (DECIDE-INFORMA-AVANZA)

Cada una es reversible. Si alguna no te gusta, se cambia.

| #   | Decisión                                                                                        | Por qué                                                                                                                                                                 |
| --- | ----------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| D1  | **No instalar el SO en `docs/sistema/`**                                                        | Pedido explícito de Cristian: usar el proyecto y la arquitectura ya instalados y no gastar contexto en eso. Sigo el rol y la secuencia maestra de memoria.              |
| D2  | **Stack = el que ya está** (Next 15 + FSD + Tailwind)                                           | Ya existe, ya cumple el spec (Next App Router + TS + Tailwind) y ya tiene los tokens de marca. Migrar sería destruir trabajo bueno.                                     |
| D3  | **Monetización = onboarding-first, no hard paywall**                                            | Regla dura del spec: una receta completa gratis, sin tarjeta. La receta gratis _es_ el argumento de venta. El muro aparece en la SEGUNDA receta.                        |
| D4  | **Precios PROPUESTOS en COP** (ajustables)                                                      | Mercado colombiano; suscripción en dólares es una objeción documentada. Mensual $29.900 · Anual $239.000 (2 meses gratis) · Curso suelto $89.000.                       |
| D5  | **Vender también el curso suelto**                                                              | Este nicho compra pago único con menos fricción que auto-renovación mensual.                                                                                            |
| D6  | **Pasarela: Mercado Pago primero** (PSE, Nequi, tarjeta), detrás de una interfaz intercambiable | Métodos locales de Colombia. Hotmart queda como alternativa para cursos sueltos; Stripe solo para España/US.                                                            |
| D7  | **Analítica = Mixpanel** (el que ya está), no agrego otra                                       | Ya instalado y con autocapture. Evita otra cuenta y otro costo.                                                                                                         |
| D8  | **Español neutro con vocabulario Colombia** — "tú", no "vos"                                    | El spec manda Colombia-first. Por eso la frase del muro es _"Salva tu próximo kilo de carne"_, no la variante rioplatense del borrador. Capa España queda para después. |
| D9  | **Ruta de la app: `/asistente`**                                                                | Consistente con `/recetas` y `/tablas`, en español, y no rompe nada del sitio actual.                                                                                   |

---

## Secuencia de construcción

Orden obligatorio: **ventas → onboarding → paywall → login → app interna → servicios externos.**
No se empieza por el chat.

- [x] **0. Reconocimiento** de lo instalado
- [x] **1. Página de ventas** (`/asistente`) — hecha y verificada en el navegador
- [ ] **2. Onboarding** (país, nivel, qué vas a curar) ← sigue
- [ ] **2b. Conectar el CTA:** cambiar `appRoutes.start` en `src/shared/config/site.ts`
      de `/asistente#precios` a `/asistente/nuevo` cuando exista el onboarding.
      Los 5 botones de la página de ventas lo siguen solos.
- [ ] **3. Paywall** + regla de 1 receta gratis
- [ ] **4. Login** (Supabase: teléfono/OTP, Google, email)
- [ ] **5. Asistente** (chat + foto de moho + guardrails de seguridad)
- [ ] **6. Mini-cursos** en video con puerta libre/pago
- [ ] **7. Pagos reales** (Mercado Pago + webhook)
- [ ] **8. Importar recetas de redes** (lo último, es retención no captación)

---

## ⚠️ Pendientes y avisos

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
- ⚠️ **Ninguna clave se pega en el chat.** Cuando toque, van a un archivo `.env.local`
  que no se sube a git. Si alguna vez pegas una clave en el chat, hay que rotarla.
- ⚠️ La clave de Anthropic y la de Supabase **nunca** se exponen en el navegador:
  todo lo que las use corre en el servidor.
