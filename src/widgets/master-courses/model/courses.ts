export interface Course {
  readonly id: string;
  readonly name: string;
  readonly description: string;
  readonly rating: string;
}

export const courses: readonly Course[] = [
  {
    id: 'chorizos-del-mundo',
    name: 'Chorizos del Mundo',
    description: 'Recetas y técnicas de embutido fresco y curado de varias tradiciones.',
    rating: '4.9',
  },
  {
    id: 'jamones-cocidos-premium',
    name: 'Jamones Cocidos Premium',
    description: 'Jamón York y cocidos de calidad, sin fosfatos ni almidones.',
    rating: '4.8',
  },
  {
    id: 'jamones-curados',
    name: 'Jamones Curados de España e Italia',
    description: 'Curado en seco al estilo europeo: sal, tiempo y control de humedad.',
    rating: '5.0',
  },
];
