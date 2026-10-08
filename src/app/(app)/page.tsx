/**
 * `/` enseña lo mismo que `/cursos` (decisión de Cristian, 2026-10-07): Cursos
 * es el inicio. Sin redirección, por los enlaces y anuncios que apuntan a la
 * raíz; el `canonical` de la versión pública apunta a `/cursos` para no tener
 * dos páginas iguales en los buscadores.
 */
export { default, generateMetadata } from './cursos/page';
