import { type Metadata } from 'next';
import { type ReactNode } from 'react';

import { AppCharcuView } from '@/views/app-charcu';

import { currentUser } from '@/shared/api/supabase/server';

export const metadata: Metadata = { title: 'El Charcu · tu asistente' };

export default async function CharcuPage(): Promise<ReactNode> {
  // Sin cuenta también se entra: dos preguntas gratis y la 3.ª pide la cuenta.
  return <AppCharcuView isSignedIn={(await currentUser()) !== null} />;
}
