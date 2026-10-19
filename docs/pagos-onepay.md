# Pagos con OnePay

Copiado de Manos Creadoras (`docs/WEBHOOKS.md`, `lib/webhooks/`), donde está
probado de punta a punta. Desde el 2026-10-17.

## Cómo funciona

1. El botón **Suscribirme** (planes de la portada) y **Pasar a Pro** (Recetas)
   llevan al checkout de OnePay del plan. Los enlaces viven en
   `charcu.plan_checkout` (migración 0050), por `modo`:
   - **pruebas** → QA, previews y local (los planes del modo de pruebas de OnePay);
   - **produccion** → elcharcu.co.

   Lo decide `VERCEL_ENV`, no una variable. Un plan sin enlace (hoy, el
   Maestro) sigue yendo a WhatsApp.

2. Cuando alguien paga, OnePay avisa a **`/api/webhooks/onepay`**. Ese aviso es
   lo ÚNICO que activa la suscripción: si se pierde, alguien pagó y se quedó
   fuera.

3. El webhook verifica el token (`x-webhook-token`) **y** la firma HMAC
   (`signature`). Después guarda el cuerpo entero en `charcu.webhook_eventos`
   **antes** de procesarlo y aplica el evento a `charcu.subscriptions`:

   | Evento                  | Qué hace                                                                                            |
   | ----------------------- | --------------------------------------------------------------------------------------------------- |
   | `subscription.paid`     | `active`, el plan y `current_period_end`: la próxima cobranza o, si no viene, `paid_at` + 1 año/mes |
   | `subscription.canceled` | marca `canceled_at`; **conserva el acceso** hasta `current_period_end`                              |
   | impagada / vencida      | si quedan días pagados, los conserva; si no, `past_due`                                             |
   | `subscription.created`  | nada: el acceso lo abre el **pago**                                                                 |

   **Para saber de quién es el pago**, primero se busca la suscripción ya
   conocida. Si es nueva, se busca el **correo del checkout** y después el
   **teléfono**, contra el WhatsApp del perfil (migración 0051: últimos 10
   dígitos, y solo si una única cuenta lo tiene). ⚠️ El checkout de OnePay pide
   WhatsApp y no correo: el aviso real trae `hola@onepay.ai`. Si nada coincide,
   el evento queda `huerfano`, guardado y avisado, para activarlo a mano.

   El aviso real (2026-10-18) es `{event:{type}, payment:{id, paid_at},
subscription:{id, plan_id, customer:{email, phone}}}`, sin próxima
   cobranza. La huella usa `payment.id`: cada cobro es distinto, un reintento no.

4. **Casi todo responde 200.** OnePay reintenta ante un 4xx y **desactiva el
   endpoint** si falla seguido. Solo una firma mala da 401, y un fallo nuestro
   al guardar, 500.

## Configurarlo (una vez por entorno)

1. **OnePay → Desarrolladores → Webhooks**: crear el webhook con los eventos de
   suscripción. Para QA, hacerlo en el modo de pruebas.
   - QA: `https://qa.elcharcu.co/api/webhooks/onepay`
   - Producción: `https://www.elcharcu.co/api/webhooks/onepay`
2. Copiar el **secret** (se ve una sola vez) y el **token** a Vercel, en ese
   entorno: `ONEPAY_WEBHOOK_SECRET` y `ONEPAY_WEBHOOK_TOKEN`. Hay que redesplegar
   para que la app los lea.
3. ⚠️ **QA tiene que estar abierta para que lleguen los avisos.** Detrás del
   login de Vercel (Deployment Protection), OnePay recibe un 302 y el aviso no
   llega a la app. Se resolvió como en Manos Creadoras: **QA abierta al
   público, pero fuera de Google**:
   - `src/app/robots.ts`: fuera de producción, `Disallow: /`;
   - `next.config.ts`: fuera de producción, `X-Robots-Tag: noindex, nofollow`
     en TODA respuesta (robots.txt solo impide rastrear; el `noindex` saca del
     índice una página que alguien haya enlazado).

   Las dos condiciones van al revés: solo `VERCEL_ENV === 'production'` se
   indexa. La alternativa sería mantener la protección y usar el "Protection
   Bypass for Automation" de Vercel en la URL del webhook.

## Probarlo

- `e2e/webhook-onepay.spec.ts` firma eventos igual que OnePay, con claves de
  prueba que solo existen en los e2e. Cubre:
  - firma mala;
  - pago;
  - reintento;
  - renovación;
  - cancelación;
  - huérfano.
- Cuando el webhook ya esté configurado en QA: hacer una suscripción de
  prueba con las tarjetas de prueba de OnePay y mirar la fila en
  `charcu.webhook_eventos`. La **forma real** del cuerpo es lo primero que hay
  que confirmar. La documentación de OnePay se contradice, y `onepay.ts` acepta
  las dos formas por si acaso.

## Seguir un pago

Cada aviso recibe una **traza** de 8 letras, que está en la fila y en todas sus
líneas de log de Vercel (`"area":"pagos"`). `duracion_ms` dice cuánto tardó:
OnePay corta a los 10 s.

```sql
-- Lo que necesita atención
select recibido_en, traza, evento, estado, nota
  from charcu.webhook_eventos
 where estado in ('huerfano', 'error')
 order by recibido_en desc;
```

## Lo que falta

- **Correo de bienvenida al activarse.** Manos Creadoras lo manda; aquí no se
  copió, porque El Charcu no tiene todavía ese correo.
- **El Maestro en OnePay**: sus botones siguen en WhatsApp hasta que existan
  sus planes y sus filas en `plan_checkout`.
- **"Gestionar plan" y cancelar desde la app** siguen en WhatsApp.
