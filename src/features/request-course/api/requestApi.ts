import { type CourseCategory } from '@/entities/course';

type RequestPayload = { readonly category: CourseCategory } | { readonly body: string };

/** Guarda un pedido. `true` si quedó guardado (o ya lo estaba). */
export async function sendCourseRequest(payload: RequestPayload): Promise<boolean> {
  const response = await fetch('/api/pedidos-de-cursos', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  }).catch(() => null);

  return response?.ok === true;
}
