import { type ReactNode } from 'react';

import {
  countryName,
  curingProductName,
  experienceLevelName,
  type CuringProfile,
} from '@/entities/curing-profile';

import { appRoutes } from '@/shared/config';
import { ButtonLink, Eyebrow } from '@/shared/ui';

interface DoneStepProps {
  readonly profile: CuringProfile;
}

/** Cierre del onboarding: le decimos exactamente qué acaba de conseguir. */
export function DoneStep({ profile }: DoneStepProps): ReactNode {
  const recipe = curingProductName(profile.freeRecipe);

  return (
    <div>
      <Eyebrow className="text-terracota-dark">Todo listo</Eyebrow>

      <h1 className="mt-6 font-serif text-3xl font-semibold leading-tight text-forest md:text-4xl">
        {recipe} es tu receta gratis.
      </h1>

      <p className="mt-4 text-base leading-relaxed text-cocoa/65">
        Tienes esta pieza completa con el asistente al lado, de principio a fin, sin poner
        tarjeta. Puedes volver las veces que quieras mientras dure el curado.
      </p>

      <ul className="mt-8 flex flex-wrap gap-2">
        {[countryName(profile.country), experienceLevelName(profile.level), recipe].map(
          (chip) => (
            <li
              key={chip}
              className="rounded-full border border-cocoa/15 px-4 py-1.5 text-sm text-cocoa/70"
            >
              {chip}
            </li>
          ),
        )}
      </ul>

      <div className="mt-9">
        <ButtonLink href={appRoutes.session} variant="primary">
          Abrir mi receta gratis
        </ButtonLink>
      </div>

      <p className="mt-5 text-sm leading-relaxed text-cocoa/65">
        Cuando empieces una segunda receta distinta, ahí sí aparece la suscripción.
      </p>
    </div>
  );
}
