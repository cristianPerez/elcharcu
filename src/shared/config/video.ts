/**
 * Bunny Stream: dónde viven los videos de los cursos.
 *
 * ⚠️ `BUNNY_LIBRARY_ID` va SIN el prefijo `NEXT_PUBLIC_`, y no es un descuido.
 *
 * Toda la cadena que pinta el reproductor —la página de la lección, la vista,
 * `LessonBody` y `LessonVideo`— corre en el SERVIDOR. La dirección del iframe
 * se arma ahí y llega al navegador ya escrita en el HTML, así que la variable
 * se lee al ejecutar y nunca hace falta incrustarla al compilar.
 *
 * Eso la deja fuera de la trampa que nos costó una mañana el 2026-08-19: las
 * `NEXT_PUBLIC_*` se sustituyen AL COMPILAR y las variables *Sensitive* de
 * Vercel no existen en ese momento, así que marcadas así quedan vacías. Esta
 * puede ser Sensitive sin romper nada.
 *
 * Ojo si algún día el reproductor se mueve a un componente de cliente: ahí
 * `process.env.BUNNY_LIBRARY_ID` sería `undefined` y habría que pasarle el
 * valor como prop desde el servidor, no cambiarle el nombre a la variable.
 *
 * El id de la biblioteca no es un secreto —viaja en la dirección del
 * reproductor, a la vista de cualquiera—, pero se configura igual para no
 * tener que tocar código al cambiar de cuenta de Bunny.
 *
 * Lo que SÍ es secreto es la clave de la API de Bunny, y esa todavía no hace
 * falta: llegará el día que se firmen las URLs para que un video de pago no se
 * pueda ver copiando el enlace.
 */
export function bunnyLibraryId(): string {
  return (process.env.BUNNY_LIBRARY_ID ?? '').trim();
}

export function isBunnyConfigured(): boolean {
  return bunnyLibraryId() !== '';
}

/**
 * La dirección del reproductor para un video, o `null` si falta la biblioteca.
 *
 * Devuelve `null` en vez de armar una dirección rota a propósito: quien la
 * llama enseña el cartel de "Video en camino", que es feo pero honesto. Un
 * iframe apuntando a `/embed//loquesea` sería un rectángulo negro con un error
 * de Bunny dentro.
 *
 * `preload=false`: sin eso, abrir una lección se pone a descargar video antes
 * de que nadie le dé al play. En un celular con datos móviles es gastarle el
 * plan a alguien por mirar.
 *
 * `autoplay=false` y `muted=false` también a propósito. La convención de los
 * Reels es arrancar solo y en silencio, pero aquí el audio ES el contenido
 * —Cristian explicando— y un video que se enciende solo en una cocina con
 * gente alrededor molesta más de lo que ayuda.
 */
export function bunnyEmbedUrl(videoId: string): string | null {
  const library = bunnyLibraryId();
  if (library === '' || videoId.trim() === '') {
    return null;
  }

  const params = new URLSearchParams({
    autoplay: 'false',
    preload: 'false',
    responsive: 'true',
    loop: 'false',
    muted: 'false',
  });

  return `https://iframe.mediadelivery.net/embed/${library}/${videoId}?${params.toString()}`;
}
