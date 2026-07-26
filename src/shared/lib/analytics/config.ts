/** Lee las credenciales de analítica desde variables de entorno públicas de Next.js. */
export const analyticsConfig = {
  mixpanelToken: process.env.NEXT_PUBLIC_MIXPANEL_TOKEN ?? '',
  hotjarId: Number(process.env.NEXT_PUBLIC_HOTJAR_ID ?? ''),
  hotjarVersion: Number(process.env.NEXT_PUBLIC_HOTJAR_SV ?? '6'),
} as const;
