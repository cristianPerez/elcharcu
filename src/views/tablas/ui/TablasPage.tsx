import { type ReactNode } from 'react';

import { SiteFooter } from '@/widgets/site-footer';
import { SiteHeader } from '@/widgets/site-header';
import { TablaSearch } from '@/widgets/tabla-search';

import { getTablaSummaries } from '@/entities/tabla';

/**
 * FSD `views` layer: página de listado de tablas.
 * Carga los resúmenes en el servidor y los pasa al buscador (cliente).
 */
export function TablasPage(): ReactNode {
  const tablas = getTablaSummaries();

  return (
    <>
      <SiteHeader />
      <main>
        <TablaSearch tablas={tablas} />
      </main>
      <SiteFooter />
    </>
  );
}
