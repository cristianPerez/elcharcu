import { type ReactNode } from 'react';

import { contactChannels, site } from '@/shared/config';
import { Container, Eyebrow } from '@/shared/ui';

/** Cierre de conversión: invitación a pedir por WhatsApp / Instagram. */
export function ContactCta(): ReactNode {
  return (
    <section id="contacto" className="bg-grain bg-forest py-20 text-cream md:py-28">
      <Container>
        <div className="mx-auto max-w-2xl text-center">
          <Eyebrow className="text-sage">Contacto</Eyebrow>
          <h2 className="mt-6 font-serif text-4xl font-semibold leading-tight md:text-5xl">
            Hagamos mesa.
          </h2>
          <p className="mt-4 text-base leading-relaxed text-cream/75">
            Pedidos en lotes pequeños, siempre frescos. Escríbenos y llevamos la
            charcutería a tu mesa en {site.location}.
          </p>
        </div>

        <div className="mx-auto mt-12 grid max-w-2xl gap-4 sm:grid-cols-2">
          {contactChannels.map((channel) => (
            <a
              key={channel.label}
              href={channel.href}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center justify-between rounded-2xl border border-cream/15 bg-cream/5 px-6 py-5 transition-colors hover:bg-cream/10"
            >
              <span>
                <span className="block font-serif text-lg font-semibold text-cream">
                  {channel.label}
                </span>
                <span className="mt-1 block text-sm text-cream/75">{channel.value}</span>
              </span>
              <span
                aria-hidden
                className="text-terracota transition-transform group-hover:translate-x-1"
              >
                →
              </span>
            </a>
          ))}
        </div>
      </Container>
    </section>
  );
}
