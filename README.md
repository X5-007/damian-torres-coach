# Damian Torres — Coach de entrenamiento

Sitio web estático (HTML + CSS + JavaScript, sin dependencias ni compilación).
Se puede publicar tal cual en GitHub Pages, Netlify, Vercel o cualquier hosting.

## Archivos

| Archivo | Para qué sirve |
|---|---|
| `index.html` | Estructura de la página (secciones y orden). |
| `style.css` | Todo el diseño: colores, tipografías, espaciados, responsive. |
| `script.js` | Toma la información de `content.js` y la dibuja en la página. También controla el juego "Descubre tu plan". |
| `content.js` | **El único archivo que necesitas editar para cambiar textos, precios y contactos.** |
| `img/perfil.png` | Foto de perfil (nav, sobre mí, tarjeta del hero). |
| `img/hero-bg.jpg` | Foto principal del bloque de inicio. |

## Cómo actualizar la información

Abre `content.js` y cambia lo que está entre comillas `" "`. No borres las comas.

- **Mostrar u ocultar precios:** `showPrices: true` / `false`.
- **Apagar una sección:** `enabled: false` (suplementos, juego, botón flotante).
- **Cambiar el WhatsApp:** `contact.whatsappNumber` (solo los 10 dígitos).
- **Destacar un paquete:** `highlight: true` lo convierte en la tarjeta oscura con distintivo.
- **Acento dorado en un paquete:** `accent: "gold"`.

Si cambias las fotos, conserva los mismos nombres de archivo dentro de `img/`.

## Sistema de diseño

Dirección de arte *editorial*: base cálida tipo papel, tinta profunda y un único
acento en arcilla con apoyos en bronce. Tipografías **Fraunces** (títulos) e
**Inter** (texto), cargadas desde Google Fonts.

Todos los colores, tamaños y espaciados están definidos como variables al
principio de `style.css`, en el bloque `:root`. Cambiar una variable ahí
actualiza el sitio completo. Por ejemplo:

```css
--clay:   #b23a2e;   /* acento principal */
--bronze: #a97b3f;   /* acento secundario */
--paper:  #f7f4ef;   /* fondo claro */
--ink:    #171512;   /* fondo oscuro */
```

Las superficies oscuras (`.section--ink`, la tarjeta VIP, la cabecera de la
rutina) reasignan estas variables, así que cualquier contenido nuevo que
coloques dentro hereda automáticamente el contraste correcto.

## Detalles incluidos

- Diseño responsive de 320 px a pantallas grandes, con menú móvil.
- Aparición progresiva de las secciones al hacer scroll y resaltado del enlace activo en el menú.
- Respeta `prefers-reduced-motion` y tiene estilos de impresión.
- Enlace directo para saltar al contenido y foco visible para navegación con teclado.

## Publicar

Sube los archivos a la rama que sirve tu sitio (en GitHub Pages normalmente
`main`). No hay que compilar nada: al recargar la página ya se ven los cambios.
