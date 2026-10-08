'use client';

import { useEffect, useState, type ReactNode } from 'react';

import { IconInfo, IconMail } from '@/shared/ui';

/**
 * Cuánto hay que esperar para reenviar. Es el mismo límite de Supabase: un
 * enlace por minuto para el mismo correo. Reenviar antes daría un error.
 */
const RESEND_AFTER_S = 60;

const MAIL_APPS = [
  { label: 'Abrir Gmail', href: 'https://mail.google.com/mail/u/0/#inbox' },
  { label: 'Abrir Outlook', href: 'https://outlook.live.com/mail/0/' },
] as const;

interface SignupStepCheckProps {
  readonly email: string;
  /** "la cápsula 1". */
  readonly returnLabel: string;
  readonly onChangeEmail: () => void;
  readonly onResend: () => void;
}

function useCountdown(seconds: number): readonly [number, () => void] {
  const [left, setLeft] = useState(seconds);
  useEffect(() => {
    if (left <= 0) {
      return undefined;
    }
    const timer = window.setTimeout(() => setLeft((value) => value - 1), 1000);
    return () => window.clearTimeout(timer);
  }, [left]);
  return [left, () => setLeft(seconds)];
}

/** Paso 2 (diseño final 04/06): revisa tu correo, cambiarlo, reenviar. */
export function SignupStepCheck({
  email,
  returnLabel,
  onChangeEmail,
  onResend,
}: SignupStepCheckProps): ReactNode {
  const [left, restart] = useCountdown(RESEND_AFTER_S);
  const clock = `${String(Math.floor(left / 60))}:${String(left % 60).padStart(2, '0')}`;

  return (
    <div className="flex flex-col items-center px-5 pb-6 pt-6 text-center md:px-8 md:pb-8">
      <span
        aria-hidden="true"
        className="grid size-[72px] place-items-center rounded-full bg-capsule-current text-brasa-tinta"
      >
        <IconMail size={30} />
      </span>
      <p className="mt-4 font-serif text-[28px] font-semibold text-forest" role="status">
        Revisa tu correo
      </p>
      <p className="mt-2 text-[15px] leading-relaxed text-cocoa-soft">
        Te enviamos un enlace para entrar a{' '}
        <strong className="font-semibold text-cocoa">{email}</strong> ·{' '}
        <button
          type="button"
          onClick={onChangeEmail}
          className="font-semibold text-brasa-tinta underline underline-offset-2"
        >
          cambiar
        </button>
      </p>

      <p className="mt-5 flex w-full gap-3 rounded-2xl bg-cream p-4 text-left text-sm leading-relaxed text-cocoa">
        <IconInfo size={18} className="mt-0.5 shrink-0 text-forest" />
        <span>
          <span className="md:hidden">
            Al tocarlo, vuelves directo a <strong>{returnLabel}</strong>, ya con tu
            cuenta.
          </span>
          <span className="hidden md:inline">
            Puedes dejar esta pestaña abierta: cuando toques el enlace, se abre{' '}
            <strong>{returnLabel}</strong> y esta pestaña también entra sola.
          </span>
        </span>
      </p>

      <div className="mt-5 grid w-full grid-cols-2 gap-3">
        {MAIL_APPS.map(({ label, href }) => (
          <a
            key={label}
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex min-h-12 items-center justify-center rounded-full border border-forest text-[15px] font-semibold text-forest hover:bg-cream"
          >
            {label}
          </a>
        ))}
      </div>

      <p className="mt-4 text-sm text-cocoa-soft">
        ¿No te llegó? Revisa spam ·{' '}
        {left > 0 ? (
          <span>Reenviar en {clock}</span>
        ) : (
          <button
            type="button"
            onClick={() => {
              restart();
              onResend();
            }}
            className="min-h-11 font-semibold text-brasa-tinta underline underline-offset-2"
          >
            Reenviar
          </button>
        )}
      </p>
    </div>
  );
}
