export interface ProcessStep {
  readonly number: string;
  readonly title: string;
  readonly description: string;
}

export const steps: readonly ProcessStep[] = [
  {
    number: '01',
    title: 'Selección',
    description: 'Carnes locales de confianza, elegidas pieza por pieza.',
  },
  {
    number: '02',
    title: 'Salado y curado',
    description: 'La dosis exacta de sal de cura — sin exceso, sin riesgo.',
  },
  {
    number: '03',
    title: 'Ahumado',
    description: 'Leña, humo y paciencia. El sabor que no se apura.',
  },
  {
    number: '04',
    title: 'Maduración',
    description: 'Tiempo y aire hasta alcanzar el punto justo de textura.',
  },
];
