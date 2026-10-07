'use client';

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react';

import { safeDestination } from '@/shared/lib/access';
import { startAuthAttempt, type AuthTrigger } from '@/shared/lib/analytics';

/**
 * Lo que la hoja de crear cuenta necesita saber de lo que tocó la persona
 * (diseño final 03–06). El título es contextual: "Cápsula 1 · Qué saber de la
 * sal de cura", no un "Crea tu cuenta" a secas.
 */
export interface SignupRequest {
  readonly trigger: AuthTrigger;
  /** "Cápsula gratis", "Curso gratis", "El Charcu". */
  readonly eyebrow: string;
  /** Lo que tocó: "Qué saber de la sal de cura". */
  readonly title: string;
  /** El número de la cápsula, si es una cápsula ("1"). */
  readonly badge?: string | null | undefined;
  /** "1 de 5": lo que acompaña al eyebrow en escritorio. */
  readonly counter?: string | null | undefined;
  /** La foto de la cabecera en escritorio. */
  readonly image?: string | null | undefined;
  /** A dónde vuelve al tocar el enlace. Se valida: solo rutas internas. */
  readonly destination: string;
  /** Cómo se nombra el destino en el paso 2: "la cápsula 1", "el curso de lomo". */
  readonly returnLabel: string;
  /** "Crea tu cuenta gratis para empezar", salvo en la 3.ª pregunta o Avísame. */
  readonly heading?: string | undefined;
}

interface SignupPromptValue {
  readonly request: SignupRequest | null;
  readonly openSignup: (request: SignupRequest) => void;
  readonly closeSignup: () => void;
  /** Lo que abre la hoja al tocarse sin cuenta: dirección → contexto. */
  readonly targets: ReadonlyMap<string, SignupRequest>;
  /** Una pantalla registra sus enlaces que piden cuenta (ver `SignupTargets`). */
  readonly registerTargets: (targets: readonly SignupRequest[]) => () => void;
}

const SignupPromptContext = createContext<SignupPromptValue | null>(null);

/**
 * Quien abre y cierra la hoja de crear cuenta. Va en el marco de la app, así
 * que cualquier pantalla —una cápsula, la 3.ª pregunta, "Avísame"— la abre con
 * `openSignup` y su contexto.
 *
 * Abrirla abre también el intento del embudo del enlace mágico
 * (`auth_modal_opened` con su `trigger` y el destino como origen).
 */
export function SignupPromptProvider({
  children,
}: {
  readonly children: ReactNode;
}): ReactNode {
  const [request, setRequest] = useState<SignupRequest | null>(null);

  const openSignup = useCallback((next: SignupRequest): void => {
    const destination = safeDestination(next.destination);
    startAuthAttempt(next.trigger, destination);
    setRequest({ ...next, destination });
  }, []);

  const closeSignup = useCallback((): void => setRequest(null), []);

  const [targets, setTargets] = useState<ReadonlyMap<string, SignupRequest>>(new Map());
  const registerTargets = useCallback((list: readonly SignupRequest[]): (() => void) => {
    setTargets((current) => {
      const next = new Map(current);
      for (const target of list) {
        next.set(target.destination, target);
      }
      return next;
    });
    return () => {
      setTargets((current) => {
        const next = new Map(current);
        for (const target of list) {
          next.delete(target.destination);
        }
        return next;
      });
    };
  }, []);

  const value = useMemo(
    () => ({ request, openSignup, closeSignup, targets, registerTargets }),
    [request, openSignup, closeSignup, targets, registerTargets],
  );

  return (
    <SignupPromptContext.Provider value={value}>{children}</SignupPromptContext.Provider>
  );
}

/** `openSignup` y compañía. Fuera del proveedor no hace nada (no rompe). */
export function useSignupPrompt(): SignupPromptValue {
  return (
    useContext(SignupPromptContext) ?? {
      request: null,
      openSignup: () => {},
      closeSignup: () => {},
      targets: new Map(),
      registerTargets: () => () => {},
    }
  );
}
