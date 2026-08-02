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

export const navItems: readonly NavItem[] = [
  { label: 'Historia', href: '/#historia' },
  { label: 'Productos', href: '/#productos' },
  { label: 'Recetas', href: '/recetas' },
  { label: 'Tablas', href: '/tablas' },
  { label: 'Cursos', href: '/#cursos' },
  { label: 'Proceso', href: '/#proceso' },
  { label: 'Contacto', href: '/#contacto' },
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
