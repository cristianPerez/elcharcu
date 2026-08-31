import { type Metadata } from 'next';
import { type ReactNode } from 'react';

import { AsistentePage } from '@/views/asistente';

export const metadata: Metadata = {
  title: 'Asistente de charcutería · El Charcu',
  description:
    'Ten al Charcu para preguntarle lo que quieras: dosis de sal de cura, diagnóstico de moho por foto y ajuste por tu clima, en el momento exacto de la duda. La primera pregunta es gratis y sin tarjeta.',
  keywords: [
    'asistente de charcutería',
    'sal de cura por kilo',
    'moho en embutidos',
    'curado en casa',
    'cursos de charcutería',
  ],
  openGraph: {
    title: 'Asistente de charcutería · El Charcu',
    description:
      'Responde en el momento de la duda: sal de cura, moho, humedad y costos. Tu primera receta, gratis.',
    type: 'website',
    locale: 'es_CO',
  },
};

export default function Page(): ReactNode {
  return <AsistentePage />;
}
