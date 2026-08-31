/**
 * Configuración global de la marca El Charcu.
 * Fuente única de verdad para datos transversales (nav, redes, contacto).
 * Reemplazar los placeholders (teléfono/handles) por los datos reales.
 */

export interface NavItem {
  readonly label: string;
  readonly href: string;
}

export interface ContactChannel {
  readonly label: string;
  readonly value: string;
  readonly href: string;
}

const WHATSAPP_NUMBER = '573003526578';
/*
  El mensaje que va prellenado en el WhatsApp genérico.

  Decía "quiero hacer un pedido 🧀", de cuando el menú tenía Tienda y ese
  enlace era para comprar embutidos. Con la tienda escondida (2026-08-31), el
  mismo enlace lo usa ahora `Contacto` y el pie de página, así que alguien con
  una duda de suscripción abría WhatsApp con un pedido escrito.

  Neutro a propósito: quien escribe completa la frase. Los enlaces que SÍ saben
  a qué vienen —los de cada plan— traen su propio texto (`planWhatsappHref`).
*/
const WHATSAPP_MESSAGE = encodeURIComponent('Hola El Charcu, tengo una pregunta 🥩');

export const site = {
  name: 'El Charcu',
  tagline: 'Artesanal',
  slogan: 'Sin aditivos · Sin atajos',
  location: 'Manizales, Colombia',
  since: 2026,
  homeUrl: 'https://elcharcu.co',
  whatsappUrl: `https://wa.me/${WHATSAPP_NUMBER}?text=${WHATSAPP_MESSAGE}`,
  whatsappPhone: '+57 300 352 6578',
  instagramUrl: 'https://instagram.com/elcharcu_artesanal',
  instagramHandle: '@elcharcu_artesanal',
} as const;

/**
 * Rutas de la app (asistente + cursos), separadas del sitio público.
 * `start` es el único punto de entrada al producto: todos los CTA de la página
 * de ventas apuntan aquí, así que el camino se cambia en un solo lugar.
 */
export const appRoutes = {
  sales: '/asistente',
  /*
    Dónde entra alguien que todavía no tiene cuenta: a CREAR LA CUENTA.

    Ha cambiado dos veces en dos días y las dos por buen motivo:

    · Apuntaba a `/asistente/nuevo`, el onboarding anónimo. Ese formulario se
      mudó detrás del login (0016) y sin sesión contestaba 401, así que los
      botones de la web llevaban a un formulario que no podía guardar nada.
    · Se movió entonces a la PORTADA, razonando que ahí vive el asistente y se
      prueba sin registrarse (D14). Pero el botón principal está EN la portada:
      "Probar ahora" enlazaba a la página donde ya estabas y no pasaba nada.

    Ahora lleva a `/entrar` (Cristian, 2026-08-31). D14 sigue en pie —el
    asistente de la portada se usa sin cuenta y esa demostración no se toca—;
    lo que cambia es a dónde apunta el BOTÓN, que es lo que se toca cuando uno
    ya se convenció y quiere quedarse.
  */
  start: '/entrar',
  session: '/asistente/sesion',
  newRecipe: '/asistente/nueva-receta',
  subscription: '/asistente/suscripcion',
  login: '/entrar',
  /**
   * La APP de quien ya entró: tres pestañas abajo, como una app del celular.
   * El Charcu va en el centro porque es el producto; los cursos a la izquierda
   * porque es lo primero que se mira al llegar, y la cuenta a la derecha, que
   * es donde todo el mundo la busca.
   */
  appCourses: '/cursos',
  appAssistant: '/charcu',
  appAccount: '/cuenta',
  /**
   * El curso gratis, el que se enseña desde la web pública.
   *
   * Vive DENTRO de la app (2026-08-19), así que un visitante sin cuenta que
   * toque este enlace acaba en `/entrar`. Es coherente con el embudo nuevo
   * —una pregunta gratis y a entrar— pero conviene mirarlo cuando se
   * simplifique la portada (4e).
   */
  guidedRecipe: '/cursos/lomo-curado',
} as const;

/**
 * El menú sigue la separación de 2026-08-14: el home es la app y la
 * charcutería física vive en `/tienda`. Por eso `Productos`, `Proceso` y
 * `Contacto` ya no son anclas del home — apuntan a la tienda.
 */
/*
  El menú, simplificado el 2026-08-31 con la app ya en producción.

  Tres entradas se fueron y cada una por su motivo:

  · **Asistente** llevaba a `/`, o sea a la página donde el visitante ya
    está. Un enlace a la pantalla actual no navega a ningún sitio; solo
    gasta un hueco del menú y hace dudar de si funcionó.
  · **Tablas** tenía una sola tabla —la de quesos— y un ítem de menú para
    un elemento es prometer una sección. Ahora se llega desde `/recetas`,
    que es donde alguien la busca de verdad. La ruta `/tablas` sigue viva:
    puede estar compartida por WhatsApp.
  · **Tienda** se esconde por ahora. La ruta sigue existiendo, solo deja de
    anunciarse.

  ⚠️ `Contacto` apuntaba a `/tienda#contacto`. Al esconder Tienda del menú,
  ese enlace seguiría llevando a una página que ya no se anuncia — así que
  pasa a WhatsApp, que es por donde El Charcu responde de verdad.
*/
export const navItems: readonly NavItem[] = [
  { label: 'Cursos', href: '/#cursos' },
  { label: 'Precios', href: '/#precios' },
  { label: 'Recetas', href: '/recetas' },
  { label: 'Contacto', href: site.whatsappUrl },
  { label: 'Entrar', href: appRoutes.login },
];

export const contactChannels: readonly ContactChannel[] = [
  {
    label: 'WhatsApp',
    value: site.whatsappPhone,
    href: site.whatsappUrl,
  },
  {
    label: 'Instagram',
    value: site.instagramHandle,
    href: site.instagramUrl,
  },
];
