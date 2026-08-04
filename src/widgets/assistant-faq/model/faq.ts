export interface FaqItem {
  readonly question: string;
  readonly answer: string;
}

export const faqItems: readonly FaqItem[] = [
  {
    question: '¿De verdad la primera receta es gratis?',
    answer:
      'Sí, y completa. Eliges qué vas a curar y el asistente te acompaña de principio a fin en esa pieza, con fotos incluidas. No pedimos tarjeta. El muro aparece el día que empieces una SEGUNDA receta distinta.',
  },
  {
    question: '¿Esto es otra IA que inventa recetas?',
    answer:
      'No. Está armado sobre el método de El Charcu y sobre normas de seguridad alimentaria, no sobre lo primero que encuentre en internet. No te da "una receta generada": te ayuda con la tuya, la que ya tienes entre manos.',
  },
  {
    question: 'Nunca he curado nada. ¿Me sirve?',
    answer:
      'Es para quien más sirve. Al entrar dices si eres curioso, apasionado o avanzado, y el asistente ajusta cuánto te explica. A un curioso le explica por qué, no solo cuánto.',
  },
  {
    question: '¿Voy a pagar en dólares?',
    answer:
      'No. El precio está en pesos colombianos y se paga con Nequi, PSE o tarjeta. Si estás en otro país de la región, se habilita el método local de tu país.',
  },
  {
    question: '¿Puedo cancelar?',
    answer:
      'Cuando quieras, desde la app, en dos toques. Sin llamadas, sin escribir a nadie, sin retención.',
  },
  {
    question: '¿Y si el asistente se equivoca y enfermo a alguien?',
    answer:
      'Por eso tiene topes que no puede cruzar: nunca pasa de 2,5 g de sal de cura #1 por kilo, y ante un moho dudoso siempre dice descartar. Aun así, es una ayuda a tu criterio, no un reemplazo: la manipulación y la decisión final son tuyas.',
  },
  {
    question: '¿Funciona desde el celular?',
    answer:
      'Está hecho primero para el celular, que es donde vas a estar cuando surja la duda. Se puede dejar instalado en la pantalla de inicio como una app más.',
  },
];
