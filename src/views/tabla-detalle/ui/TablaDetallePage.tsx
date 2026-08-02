import { type ReactNode } from 'react';

import { SiteFooter } from '@/widgets/site-footer';
import { SiteHeader } from '@/widgets/site-header';
import { TablaDetail } from '@/widgets/tabla-detail';

import { type Tabla } from '@/entities/tabla';

interface TablaDetallePageProps {
  readonly tabla: Tabla;
}

/** FSD `views` layer: página de detalle de una tabla. */
export function TablaDetallePage({ tabla }: TablaDetallePageProps): ReactNode {
  return (
    <>
      <SiteHeader />
      <main>
        <TablaDetail tabla={tabla} />
      </main>
      <SiteFooter />
    </>
  );
}
