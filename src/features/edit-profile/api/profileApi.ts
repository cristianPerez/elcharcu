import { type InterestId } from '@/shared/config';

export interface ProfilePatch {
  readonly fullName?: string;
  readonly interests?: readonly InterestId[];
  readonly notifyStepReminders?: boolean;
  readonly notifyNewCourses?: boolean;
  readonly notifyNews?: boolean;
}

/** Guarda solo lo que cambió. `true` si quedó guardado. */
export async function patchProfile(patch: ProfilePatch): Promise<boolean> {
  const response = await fetch('/api/perfil', {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(patch),
  }).catch(() => null);

  return response?.ok === true;
}
