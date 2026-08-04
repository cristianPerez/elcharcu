export interface HowStep {
  readonly number: string;
  readonly title: string;
  readonly description: string;
}

export const howSteps: readonly HowStep[] = [
  {
    number: '01',
    title: 'Dices qué vas a hacer',
    description:
      'Chorizo ahumado, salame criollo, longaniza, jamón serrano, un queso. Le cuentas tus kilos, tu clima y con qué equipo cuentas.',
  },
  {
    number: '02',
    title: 'Preguntas en el momento justo',
    description:
      'Con las manos en la carne, no después. Le escribes o le mandas una foto y te responde ahí mismo, sobre TU pieza.',
  },
  {
    number: '03',
    title: 'Te acompaña hasta el final',
    description:
      'Un curado son semanas. La conversación queda guardada: vuelves al día 12, le muestras cómo va, y sigue donde quedaron.',
  },
];
