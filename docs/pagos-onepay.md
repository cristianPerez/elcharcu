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

   | Evento                  | Qué hace                                                                                   |
   | ----------------------- | ------------------------------------------------------------------------------------------ |
   | `subscription.paid`     | `active`, el plan (`pro-mensual`/`pro-anual`) y `current_period_end` = la próxima cobranza |
   | `subscription.canceled` | marca `canceled_at`; **conserva el acceso** hasta `current_period_end`                     |
   | impagada / vencida      | si quedan días pagados, los conserva; si no, `past_due`                                    |
   | `subscription.created`  | nada: el acceso lo abre el **pago**                                                        |

   **Para saber de quién es el pago**, primero se busca la suscripción ya
   conocida. Si es nueva, se busca el **correo del checkout**, que es el único
   puente: el enlace es genérico. Si no hay cuenta con ese correo, el evento
   queda `huerfano`, guardado y avisado, para activarlo a mano.

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
3. ⚠️ **QA está detrás del inicio de sesión de Vercel** (Deployment
   Protection). OnePay no puede pasar ese login, así que sus avisos recibirían
   un 401 de Vercel antes de llegar a la app. Hay que usar el **Protection
   Bypass for Automation** de Vercel y poner la URL del webhook con
   `?x-vercel-protection-bypass=<secreto>`. La otra opción es quitar la
   protección de esa ruta.

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
