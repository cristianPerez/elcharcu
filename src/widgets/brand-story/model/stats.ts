export interface Stat {
  readonly value: string;
  readonly label: string;
}

export const stats: readonly Stat[] = [
  { value: '0', label: 'Aditivos artificiales' },
  { value: '100%', label: 'Curado a mano' },
  { value: 'ES · IT', label: 'Técnica europea' },
  { value: '2026', label: 'Desde, en Manizales' },
];
