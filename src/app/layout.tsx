import { type Metadata } from 'next';
import { Fraunces, Inter } from 'next/font/google';
import { type ReactNode } from 'react';

import { AppProviders } from '@/app/providers';

import './styles/globals.css';

const fraunces = Fraunces({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  style: ['normal', 'italic'],
  variable: '--font-fraunces',
  display: 'swap',
});

const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--font-inter',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'El Charcu · Charcutería Artesanal',
  description:
    'Charcutería artesanal curada con técnica europea en Manizales, Colombia. Sin aditivos, sin atajos. Producto artesanal y Cursos Maestros del oficio.',
  keywords: [
    'charcutería artesanal',
    'embutidos curados',
    'chorizo ahumado',
    'lomo curado',
    'Manizales',
    'cursos de charcutería',
  ],
  openGraph: {
    title: 'El Charcu · Charcutería Artesanal',
    description:
      'Charcutería artesanal curada con técnica europea. Sin aditivos, sin atajos.',
    type: 'website',
    locale: 'es_CO',
  },
};

interface RootLayoutProps {
  readonly children: ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps): ReactNode {
  return (
    <html lang="es" className={`${fraunces.variable} ${inter.variable}`}>
      <body className="font-sans antialiased">
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}
