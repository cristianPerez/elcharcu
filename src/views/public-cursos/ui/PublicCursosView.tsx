import { type ReactNode } from 'react';

import { AppFooter } from '@/widgets/app-footer';
import {
  BrandClosing,
  CapsulePreviewRail,
  CharcuDemo,
  IncludesBlock,
  MasterCoursesPreview,
  MobileTopBar,
  PlansSection,
  PublicHero,
  signupTargetsFor,
} from '@/widgets/public-home';

import { SignupTargets } from '@/features/auth-by-email';

import { type PublicCatalog } from '@/entities/course/server';

interface PublicCursosViewProps {
  readonly catalog: PublicCatalog;
  /** `?abrir=`: llegó a una cápsula o curso sin cuenta; se abre la hoja. */
  readonly openOnMount: string | null;
}

/**
 * La pestaña Cursos para quien NO tiene cuenta (diseño final 01 web, 02
 * móvil). Es el inicio: no hay pestaña "Inicio". El orden es el de las
 * capturas — cursos y cápsulas primero, la demo de El Charcu más abajo.
 *
 * Solo composición: cada sección es un widget.
 */
export function PublicCursosView({
  catalog,
  openOnMount,
}: PublicCursosViewProps): ReactNode {
  return (
    <div className="flex flex-col gap-12 md:gap-20">
      <SignupTargets
        targets={signupTargetsFor(catalog.capsules, catalog.masters)}
        openOnMount={openOnMount}
      />
      <div>
        <MobileTopBar />
        <PublicHero
          masterCount={catalog.masters.length}
          capsuleCount={catalog.capsules.length}
          lessonCount={catalog.masterLessons}
        />
      </div>
      <CapsulePreviewRail capsules={catalog.capsules} />
      <MasterCoursesPreview
        courses={catalog.masters}
        lessonsByCourse={catalog.lessonsByCourse}
      />
      <IncludesBlock />
      <CharcuDemo />
      <PlansSection />
      <BrandClosing />
      <AppFooter />
    </div>
  );
}
