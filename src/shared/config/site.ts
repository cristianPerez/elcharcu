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
const WHATSAPP_MESSAGE = encodeURIComponent('Hola El Charcu, quiero hacer un pedido 🧀');

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
  start: '/asistente/nuevo',
  session: '/asistente/sesion',
  newRecipe: '/asistente/nueva-receta',
  subscription: '/asistente/suscripcion',
  login: '/entrar',
  /**
   * Receta guiada (EXPERIMENTAL): el curso y el maestro en la misma pantalla.
   * Hoy solo existe una, así que la ruta apunta directo a ella.
   */
  guidedRecipe: '/curso/bondiola-curada',
} as const;

/**
 * El menú sigue la separación de 2026-08-14: el home es la app y la
 * charcutería física vive en `/tienda`. Por eso `Productos`, `Proceso` y
 * `Contacto` ya no son anclas del home — apuntan a la tienda.
 */
export const navItems: readonly NavItem[] = [
  { label: 'Asistente', href: '/' },
  { label: 'Cursos', href: '/#cursos' },
  { label: 'Precios', href: '/#precios' },
  { label: 'Recetas', href: '/recetas' },
  { label: 'Tablas', href: '/tablas' },
  { label: 'Tienda', href: '/tienda' },
  { label: 'Contacto', href: '/tienda#contacto' },
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
