# Plantillas de correo

Se pegan **a mano** en Supabase → Authentication → Email Templates. No se
despliegan desde el repo; están aquí para tener una sola fuente de verdad y
poder ver los cambios en git.

| Archivo               | Plantilla de Supabase    | Cuándo se manda                                     |
| --------------------- | ------------------------ | --------------------------------------------------- |
| `confirm-signup.html` | **Confirm signup**       | Correo NUEVO. Es la que ve todo el que se registra. |
| `magic-link.html`     | **Magic Link**           | Correo que ya tiene cuenta y vuelve a entrar.       |
| `change-email.html`   | **Change Email Address** | Cambia el correo de su cuenta.                      |

⚠️ **La más importante es `confirm-signup.html`, no la del enlace mágico.** La
app usa `signInWithOtp` sin `shouldCreateUser: false`, así que a un correo que
no existe Supabase le manda **Confirm signup**. Si esa queda en el inglés por
defecto, el correo feo se lo lleva justo la persona que estamos intentando
convertir.

No se incluye **Reset Password**: aquí no hay contraseñas.

## Por qué el HTML se ve así

Los clientes de correo rompen casi todo lo que se da por hecho en la web:
maquetado con tablas (nada de flex ni grid), estilos en línea (Gmail recorta
`<style>`), botón hecho con una tabla y relleno (Outlook ignora el padding de
los enlaces), sin fuentes externas (Georgia hace de Fraunces) y
`supported-color-schemes: light` para que el modo oscuro no invierta la paleta
por su cuenta.

Todos los colores son de la Guía de Marca. Los dos tonos de apoyo son `cocoa`
con opacidad, ya aplanada sobre el fondo: `#787371` es cocoa/60 sobre blanco y
`#E8E8E7` es cocoa/10 sobre blanco.

El botón va en **terracota-dark** (`#A8664A`) y no en el terracota normal: con
blanco encima, el claro se queda en 3,4:1 y el texto del botón (16px en negrita
= 12pt) NO cuenta como "texto grande" para WCAG. El oscuro da 4,5:1.

## Si cambias una, cámbialas todas

Las tres salen del mismo esqueleto. Si tocas la cabecera, el pie o el botón en
una, hazlo en las tres o se separan con el tiempo.
