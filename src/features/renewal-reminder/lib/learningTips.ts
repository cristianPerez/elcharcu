/**
 * "Para tu próxima tanda": un dato distinto cada día del aviso, para que el
 * correo diario enseñe algo y no sea solo un cobro. Son técnicas que El Charcu
 * ya enseña en el recetario y los cursos; no inventar cifras nuevas aquí.
 */
export interface LearningTip {
  readonly title: string;
  readonly text: string;
}

const TIPS: readonly [LearningTip, ...LearningTip[]] = [
  {
    title: 'La regla de los 4 °C',
    text: 'Corta magro y grasa en cubos y llévalos al congelador hasta que estén casi cristalizados (−2 a 0 °C) antes de moler, y trabaja la masa siempre por debajo de 4 °C: si se templa, de vuelta al frío. En un clima cálido es lo que separa un chorizo jugoso de uno embarrado.',
  },
  {
    title: 'La prueba de la sartén',
    text: 'Antes de embutir, fríe una cucharada de la masa y pruébala. Así ajustas las especias cuando todavía puedes corregir, y no después de llenar metros de tripa.',
  },
  {
    title: 'Escaldar sin reventar la tripa',
    text: 'Agua entre 72 y 75 °C, nunca hirviendo, hasta que el centro del chorizo llegue a 68–70 °C con termómetro (71 °C si quieres margen). Luego, directo a agua con hielo: la tripa queda tersa y el queso no se escapa.',
  },
];

/** El dato del día: cambia con los días que faltan, así cada correo trae uno nuevo. */
export function tipForDay(daysLeft: number): LearningTip {
  const index = Math.abs(daysLeft) % TIPS.length;
  return TIPS[index] ?? TIPS[0];
}
