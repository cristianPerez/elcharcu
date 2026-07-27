/** Lee las credenciales de analítica desde variables de entorno públicas de Next.js. */
export const analyticsConfig = {
  mixpanelToken: process.env.NEXT_PUBLIC_MIXPANEL_TOKEN ?? '',
} as const;
