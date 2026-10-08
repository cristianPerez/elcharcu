import { type ReactNode } from 'react';

const STATS = [
  { value: '0', label: 'Aditivos artificiales' },
  { value: '100%', label: 'Curado a mano' },
  { value: 'ES · IT', label: 'Técnica europea' },
] as const;

/** El cierre de marca de la portada (diseño final 01/02). */
export function BrandClosing(): ReactNode {
  return (
    <section className="mx-auto w-full max-w-app px-5 text-center md:px-8">
      <blockquote className="font-serif text-[26px] italic leading-snug text-forest md:text-[30px]">
        “El tiempo también es un ingrediente.”
      </blockquote>
      <dl className="mx-auto mt-6 hidden max-w-md grid-cols-3 gap-6 md:grid">
        {STATS.map(({ value, label }) => (
          <div key={label} className="flex flex-col-reverse">
            <dt className="mt-0.5 text-xs text-cocoa-soft">{label}</dt>
            <dd className="font-serif text-2xl font-semibold text-forest">{value}</dd>
          </div>
        ))}
      </dl>
      <p className="mt-5 text-xs uppercase tracking-eyebrow text-cocoa-soft">
        Sin aditivos · Sin atajos
      </p>
    </section>
  );
}
