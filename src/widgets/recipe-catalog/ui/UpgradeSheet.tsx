'use client';

import { type ReactNode } from 'react';

import { formatUsd, planWhatsappHref, priceFor, proPlan } from '@/entities/plan';

import { Dialog, IconCheck } from '@/shared/ui';

import { type LockedCard } from '../model';

const PERKS = [
  'Todas las recetas, con buscador',
  'Todos los cursos maestros en video',
  `${String(proPlan.quota.questionsPerMonth)} preguntas y ${String(proPlan.quota.imagesPerMonth)} fotos al mes con El Charcu`,
] as const;

/** "US$ 7,49" → "US$7,49", como en el diseño. */
function money(amount: number): string {
  return formatUsd(amount).replace('US$ ', 'US$');
}

interface UpgradeSheetProps {
  readonly recipe: LockedCard | null;
  readonly onClose: () => void;
}

/**
 * "Pasar a Pro" al tocar una receta con candado (diseño final 09). Hoja desde
 * abajo en el celular, modal en escritorio. El precio sale de `plans.ts`.
 * "Pasar a Pro" lleva a WhatsApp, como el resto de planes mientras no haya
 * pago automático.
 */
export function UpgradeSheet({ recipe, onClose }: UpgradeSheetProps): ReactNode {
  if (recipe === null) {
    return null;
  }
  const yearly = priceFor(proPlan, 'anual');

  return (
    <Dialog
      open
      onClose={onClose}
      title={`Receta Pro · ${recipe.name}`}
      placement="sheet"
      bare
      closeTone="onImage"
    >
      <div className="relative h-36 bg-forest">
        <span
          aria-hidden="true"
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${recipe.image})` }}
        />
        <span
          aria-hidden="true"
          className="absolute inset-0 bg-gradient-to-t from-cocoa/80 to-transparent"
        />
        <span className="absolute inset-x-5 bottom-4">
          <span className="block text-[11px] font-semibold uppercase tracking-eyebrow text-cream/80">
            Receta Pro
          </span>
          <span className="block font-serif text-xl font-semibold text-cream-white">
            {recipe.name}
          </span>
        </span>
      </div>
      <div className="px-5 pb-6 pt-5 md:px-8 md:pb-8">
        <p className="font-serif text-[26px] font-semibold leading-tight text-forest">
          El recetario completo es parte de El Charcu Pro
        </p>
        <ul className="mt-4 flex flex-col gap-2.5">
          {PERKS.map((perk) => (
            <li key={perk} className="flex gap-2.5 text-[15px] text-cocoa">
              <IconCheck size={17} className="mt-0.5 shrink-0 text-forest" />
              {perk}
            </li>
          ))}
        </ul>
        {yearly === null ? null : (
          <p className="mt-5 rounded-2xl bg-cream px-5 py-4">
            <span className="font-serif text-3xl font-semibold text-forest">
              {money(yearly.perMonthUsd)}
            </span>{' '}
            <span className="text-sm text-cocoa-soft">
              /mes · se cobra {money(yearly.priceUsd)} al año
            </span>
          </p>
        )}
        <a
          href={planWhatsappHref(proPlan, yearly)}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-4 flex min-h-14 items-center justify-center rounded-full bg-brasa text-base font-semibold text-cocoa hover:bg-brasa-dark"
        >
          Pasar a Pro
        </a>
        <button
          type="button"
          onClick={onClose}
          className="mt-2 min-h-12 w-full text-[15px] font-semibold text-cocoa-soft"
        >
          Ahora no
        </button>
      </div>
    </Dialog>
  );
}
