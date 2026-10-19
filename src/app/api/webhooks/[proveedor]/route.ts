import { NextResponse, type NextRequest } from 'next/server';

import { handlePaymentWebhook } from '@/features/payment-webhook';

/**
 * Los avisos de las pasarelas de pago: `/api/webhooks/onepay` hoy. Toda la
 * lógica vive en `features/payment-webhook`; aquí solo se lee el cuerpo CRUDO
 * (la firma se calcula sobre esos bytes) y se devuelve la respuesta.
 */
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ proveedor: string }> },
): Promise<NextResponse> {
  const { proveedor } = await params;
  const { status, body } = await handlePaymentWebhook(
    proveedor,
    request.headers,
    await request.text(),
  );
  return NextResponse.json(body, { status });
}
