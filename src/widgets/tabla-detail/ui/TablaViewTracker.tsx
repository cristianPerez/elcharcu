'use client';

import { type ReactNode, useEffect } from 'react';

import { track } from '@/shared/lib';

interface TablaViewTrackerProps {
  readonly slug: string;
  readonly name: string;
  readonly tags: readonly string[];
}

/** Envía el evento de vista de tabla sin convertir el resto del árbol en cliente. */
export function TablaViewTracker({ slug, name, tags }: TablaViewTrackerProps): ReactNode {
  useEffect(() => {
    track('tabla_detail_view', {
      tabla_slug: slug,
      tabla_name: name,
      tags: tags.join(','),
    });
  }, [slug, name, tags]);

  return null;
}
