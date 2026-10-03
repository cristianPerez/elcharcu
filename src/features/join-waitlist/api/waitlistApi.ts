export type WaitlistResult = 'ok' | 'necesita-suscripcion' | 'error';

async function send(
  method: 'POST' | 'DELETE',
  courseId: string,
): Promise<WaitlistResult> {
  const response = await fetch('/api/lista-de-espera', {
    method,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ courseId }),
  }).catch(() => null);

  if (response === null) {
    return 'error';
  }
  if (response.ok) {
    return 'ok';
  }

  const body: unknown = await response.json().catch(() => null);
  const reason =
    typeof body === 'object' && body !== null
      ? (body as Record<string, unknown>).error
      : undefined;

  return reason === 'necesita-suscripcion' ? 'necesita-suscripcion' : 'error';
}

export function joinWaitlist(courseId: string): Promise<WaitlistResult> {
  return send('POST', courseId);
}

export function leaveWaitlist(courseId: string): Promise<WaitlistResult> {
  return send('DELETE', courseId);
}
