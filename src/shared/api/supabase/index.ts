/**
 * Puerta pública para el NAVEGADOR (y para el middleware).
 *
 * Ojo: aquí no puede entrar nada que use `next/headers`. Si se cuela, Next
 * intenta empaquetar código de servidor dentro del navegador y la página
 * revienta en tiempo de ejecución, aunque los tipos y el linter pasen.
 * El cliente de servidor vive en `./server`.
 */
export { supabaseConfig, isSupabaseConfigured } from './config';
export { createSupabaseBrowserClient } from './browserClient';
export type { SupabaseBrowserClient } from './browserClient';
export type { Database } from './database.types';
