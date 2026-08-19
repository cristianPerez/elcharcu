import { type Metadata } from 'next';
import { type ReactNode } from 'react';

import { AppCharcuView } from '@/views/app-charcu';

export const metadata: Metadata = { title: 'El Charcu · tu asistente' };

export default function CharcuPage(): ReactNode {
  return <AppCharcuView />;
}
