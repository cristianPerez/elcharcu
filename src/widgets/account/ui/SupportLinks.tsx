'use client';

import { useState, type ReactNode } from 'react';

import { SafetyExplainer } from '@/entities/cure-safety';

import { site } from '@/shared/config';
import { cn } from '@/shared/lib';
import { Dialog, IconCard, IconChat, IconChevron, IconShield } from '@/shared/ui';

const WHATSAPP_BASE = site.whatsappUrl.split('?')[0] ?? site.whatsappUrl;

/**
 * Pagos y facturas abre WhatsApp con el mensaje escrito: hasta que OnePay
 * esté conectado, los cobros se gestionan a mano por ahí (ver ESTADO.md).
 */
const PAYMENTS_HREF = `${WHATSAPP_BASE}?text=${encodeURIComponent(
  'Hola El Charcu, quiero revisar mis pagos y facturas.',
)}`;

interface SupportLinksProps {
  /** `rows`: filas con icono (celular). `menu`: el menú lateral de escritorio. */
  readonly variant: 'rows' | 'menu';
}

/** Pagos y facturas, seguridad y ayuda por WhatsApp. */
export function SupportLinks({ variant }: SupportLinksProps): ReactNode {
  const [safetyOpen, setSafetyOpen] = useState(false);
  const isRows = variant === 'rows';
  const item = cn(
    'flex w-full items-center gap-3 text-left text-[15px] transition-colors',
    isRows
      ? 'min-h-14 px-4 text-cocoa hover:bg-cream/60'
      : 'min-h-11 rounded-xl px-3 text-cocoa-soft hover:bg-cream-white hover:text-cocoa',
  );
  const chevron = isRows ? (
    <IconChevron size={18} className="ml-auto shrink-0 text-cocoa-muted" />
  ) : null;

  return (
    <>
      <li>
        <a
          href={PAYMENTS_HREF}
          target="_blank"
          rel="noopener noreferrer"
          className={item}
        >
          {isRows ? <IconCard size={20} /> : null}
          Pagos y facturas
          {chevron}
        </a>
      </li>
      <li>
        <button
          type="button"
          onClick={() => {
            setSafetyOpen(true);
          }}
          className={item}
        >
          {isRows ? <IconShield size={20} /> : null}
          {isRows ? 'Cómo funciona la seguridad' : 'Seguridad'}
          {chevron}
        </button>
        <Dialog
          open={safetyOpen}
          onClose={() => {
            setSafetyOpen(false);
          }}
          title="Cómo funciona la seguridad"
        >
          <SafetyExplainer />
        </Dialog>
      </li>
      <li>
        <a
          href={site.whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className={item}
        >
          {isRows ? <IconChat size={20} /> : null}
          Ayuda por WhatsApp
          {chevron}
        </a>
      </li>
    </>
  );
}
