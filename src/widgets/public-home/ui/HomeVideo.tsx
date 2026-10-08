'use client';

import { useEffect, useRef, type ReactNode } from 'react';

import { cn } from '@/shared/lib';

const BUNNY_ORIGIN = 'https://iframe.mediadelivery.net';

/** Lo que el reproductor de Bunny avisa por `postMessage` (protocolo player.js). */
function isReadyEvent(data: unknown): boolean {
  const raw = typeof data === 'string' ? data : null;
  if (raw === null) {
    return false;
  }
  try {
    const parsed: unknown = JSON.parse(raw);
    return (
      typeof parsed === 'object' &&
      parsed !== null &&
      (parsed as { context?: unknown }).context === 'player.js' &&
      (parsed as { event?: unknown }).event === 'ready'
    );
  } catch {
    return false;
  }
}

/**
 * El video de la portada sin cuenta (2026-10-07). Vertical, como todo lo de El
 * Charcu, y arranca solo, en silencio y en bucle al cargar: no hay que tocar
 * nada para verlo. Con los controles de Bunny se pausa, se adelanta y se le
 * activa el audio.
 *
 * ⚠️ `muted=true` en la URL NO basta: el reproductor recuerda el volumen de
 * otras lecciones y en un navegador que ya vio videos arrancaba CON audio. Por
 * eso, cuando avisa que está listo, se le manda `mute` (una sola vez: si luego
 * la persona activa el audio, se respeta).
 *
 * ⚠️ La URL llega HECHA desde el servidor: el id de la biblioteca de Bunny
 * (`BUNNY_LIBRARY_ID`) no existe en el navegador.
 *
 * Es UN solo reproductor para los dos tamaños (lo coloca la cuadrícula del
 * héroe): dos iframes con autoplay descargarían el video dos veces. Por debajo
 * de ~300 px de ancho la barra de controles de Bunny no cabe y el play queda
 * fuera: no lo hagas más estrecho.
 */
export function HomeVideo({
  embedUrl,
  className,
}: {
  readonly embedUrl: string | null;
  readonly className?: string | undefined;
}): ReactNode {
  const frameRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    let isMuted = false;
    const onMessage = (event: MessageEvent): void => {
      const player = frameRef.current?.contentWindow;
      if (
        isMuted ||
        event.origin !== BUNNY_ORIGIN ||
        player === null ||
        player === undefined ||
        event.source !== player ||
        !isReadyEvent(event.data)
      ) {
        return;
      }
      isMuted = true;
      player.postMessage(
        JSON.stringify({ context: 'player.js', version: '0.0.11', method: 'mute' }),
        BUNNY_ORIGIN,
      );
    };
    window.addEventListener('message', onMessage);
    return () => window.removeEventListener('message', onMessage);
  }, []);

  return (
    <div
      className={cn(
        'relative aspect-[9/16] overflow-hidden rounded-[20px] bg-forest-dark shadow-raised',
        className,
      )}
    >
      {embedUrl === null ? null : (
        <iframe
          ref={frameRef}
          src={embedUrl}
          title="Así se aprende en El Charcu"
          className="absolute inset-0 h-full w-full"
          allow="accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture; fullscreen"
          allowFullScreen
        />
      )}
    </div>
  );
}
