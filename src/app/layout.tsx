import { type Metadata } from 'next';
import { Fraunces, Inter } from 'next/font/google';
import { cookies } from 'next/headers';
import { type ReactNode } from 'react';

import { AppProviders } from '@/app/providers';

import { VISITOR_COOKIE } from '@/shared/api/visitor';
import { site } from '@/shared/config';

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
  metadataBase: new URL(site.homeUrl),
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
    siteName: site.name,
    images: [
      {
        url: '/recipes/chorizo-iberico.jpg',
        width: 430,
        height: 180,
        alt: site.name,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'El Charcu · Charcutería Artesanal',
    description:
      'Charcutería artesanal curada con técnica europea. Sin aditivos, sin atajos.',
    images: ['/recipes/chorizo-iberico.jpg'],
  },
};

interface RootLayoutProps {
  readonly children: ReactNode;
}

export default async function RootLayout({
  children,
}: RootLayoutProps): Promise<ReactNode> {
  // El middleware ya garantizó la cookie antes de llegar aquí, así que el
  // identificador viaja al navegador en el primer render y ninguna medición
  // sale sin él.
  const visitorId = (await cookies()).get(VISITOR_COOKIE)?.value ?? '';

  return (
    <html lang="es" className={`${fraunces.variable} ${inter.variable}`}>
      <body className="font-sans antialiased">
        <AppProviders visitorId={visitorId}>{children}</AppProviders>
      </body>
    </html>
  );
}
