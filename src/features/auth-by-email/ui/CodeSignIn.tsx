'use client';

import { type ReactNode } from 'react';

import { useCodeSignIn } from '../model/useCodeSignIn';

import { CodeEntry } from './CodeEntry';

interface CodeSignInProps {
  /** El correo al que se mandó el código. */
  readonly email: string;
  /** A dónde vuelve al entrar. Solo rutas internas. */
  readonly next: string;
}

/**
 * La casilla del código ya conectada, para pantallas que piden el correo por
 * su cuenta (2026-10-30). Hoy, el muro de la portada vieja `/asistente`
 * (`LeadCaptureModal`): sin ella, desde que el correo no trae enlace, quien
 * pidiera la cuenta allí no tendría por dónde entrar.
 */
export function CodeSignIn({ email, next }: CodeSignInProps): ReactNode {
  const code = useCodeSignIn();
  return (
    <CodeEntry
      onSubmit={(value) => void code.verify(email, value, next)}
      isChecking={code.state.status === 'checking'}
      error={code.state.status === 'error' ? code.state.message : null}
    />
  );
}
