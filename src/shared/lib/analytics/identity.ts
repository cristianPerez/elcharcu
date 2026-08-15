import mixpanel from 'mixpanel-browser';

const STORAGE_KEY = 'elcharcu:visitor-id';

/**
 * Un solo identificador para toda la casa.
 *
 * El servidor lo crea y lo guarda en una cookie `httpOnly` (el navegador no la
 * puede tocar). Aquí se replica en `localStorage` y `sessionStorage`, y —lo
 * importante— se le da a Mixpanel como `distinct_id`.
 *
 * Hasta ahora Mixpanel inventaba su propio identificador aleatorio, así que un
 * embudo de Mixpanel y una fila de Postgres hablaban de la misma persona sin
 * poder cruzarse nunca. Con esto, sí.
 *
 * ⚠️ Que estén en tres sitios del navegador NO es una red de tres nudos: si el
 * usuario borra los datos del sitio, se van los tres a la vez. Sirve contra el
 * borrado accidental, no contra el deliberado. La identidad de verdad es la
 * cuenta, y por eso se pide.
 *
 * NO se usa huella del dispositivo a propósito (decisión del 2026-08-15): en
 * móvil es poco fiable, las huellas chocan entre teléfonos iguales —y el fallo
 * va en la peor dirección, negarle el plan gratis a alguien que nunca entró— y
 * legalmente es dato personal igual que una cookie, así que no ahorra permisos.
 */
export function adoptVisitorId(visitorId: string): void {
  if (typeof window === 'undefined' || visitorId === '') {
    return;
  }

  try {
    window.localStorage.setItem(STORAGE_KEY, visitorId);
    window.sessionStorage.setItem(STORAGE_KEY, visitorId);
  } catch {
    // Modo incógnito o almacenamiento lleno: la cookie sigue mandando.
  }

  try {
    // eslint-disable-next-line import/no-named-as-default-member -- API de la instancia por defecto de Mixpanel
    mixpanel.identify(visitorId);
  } catch {
    // Mixpanel sin token: no hay nada que identificar.
  }
}

/** El identificador que este navegador recuerda, si lo recuerda. */
export function rememberedVisitorId(): string | null {
  if (typeof window === 'undefined') {
    return null;
  }

  try {
    return (
      window.sessionStorage.getItem(STORAGE_KEY) ??
      window.localStorage.getItem(STORAGE_KEY)
    );
  } catch {
    return null;
  }
}

/**
 * Ata todo lo que hizo de anónimo a su cuenta recién creada.
 *
 * Es lo que hace que el embudo no se parta en dos: sin esto, la persona que
 * probó el asistente y la que se registró parecen dos personas distintas, y el
 * dato de conversión que más importa se pierde.
 */
const ALIAS_KEY = 'elcharcu:aliased';

export function identifyAccount(userId: string, email?: string): void {
  if (typeof window === 'undefined' || userId === '') {
    return;
  }

  // `alias` solo vale la PRIMERA vez que se enlaza un anónimo con una cuenta.
  // Llamarlo en cada carga ensucia el perfil y Mixpanel lo ignora igual.
  try {
    if (window.localStorage.getItem(ALIAS_KEY) === userId) {
      // eslint-disable-next-line import/no-named-as-default-member -- API de la instancia por defecto
      mixpanel.identify(userId);
      return;
    }
    window.localStorage.setItem(ALIAS_KEY, userId);
  } catch {
    // Sin almacenamiento se enlaza de nuevo: es preferible a no enlazar.
  }

  try {
    /* eslint-disable import/no-named-as-default-member -- API de la instancia por defecto */
    mixpanel.alias(userId);
    mixpanel.identify(userId);
    mixpanel.people.set({
      $email: email,
      cuenta_creada: new Date().toISOString(),
    });
    /* eslint-enable import/no-named-as-default-member */
  } catch {
    // Sin token de Mixpanel no hay nada que enlazar.
  }
}
