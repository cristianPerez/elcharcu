import { type Product } from './types';

/**
 * Catálogo de producto artesanal. En producción vendría de una API/CMS;
 * aquí es estático para la landing.
 */
export const products: readonly Product[] = [
  {
    id: 'chorizo-ahumado',
    name: 'Chorizo Ahumado',
    description: 'Ahumado en leña y curado lento. Pimentón, ajo y tiempo — nada más.',
    price: '$18.000',
    unit: '250 g',
    accent: 'terracota',
  },
  {
    id: 'lomo-curado',
    name: 'Lomo Curado',
    description: 'Lomo de cerdo curado al estilo español, en su punto justo de sal.',
    price: '$32.000',
    unit: '200 g',
    accent: 'forest',
  },
  {
    id: 'jamon-york',
    name: 'Jamón York',
    description: 'Cocido artesanal, sin fosfatos ni almidones añadidos. Sabor limpio.',
    price: '$22.000',
    unit: '300 g',
    accent: 'sage',
  },
  {
    id: 'combo-tabla',
    name: 'Combo Tabla',
    description: 'Selección de curados y ahumados lista para compartir en mesa.',
    price: '$65.000',
    unit: 'Combo',
    accent: 'terracota',
  },
];
