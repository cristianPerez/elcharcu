import { type Metadata } from 'next';
import { type ReactNode } from 'react';

import { AppProviders } from '@/app/providers';

import './styles/globals.css';

export const metadata: Metadata = {
  title: 'elcharcu',
  description: 'Next.js + TypeScript strict + Feature-Sliced Design',
};

interface RootLayoutProps {
  readonly children: ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps): ReactNode {
  return (
    <html lang="es">
      <body>
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}
