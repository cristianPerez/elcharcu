import { type Metadata } from 'next';
import { type ReactNode } from 'react';

import { AppCursosView } from '@/views/app-cursos';

export const metadata: Metadata = { title: 'Mis cursos · El Charcu' };

export default function CursosPage(): ReactNode {
  return <AppCursosView />;
}
