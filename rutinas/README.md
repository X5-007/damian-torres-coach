# Sistema de rutinas

Para armar rutinas personalizadas y mandárselas a tus alumnos por WhatsApp.
Cada alumno tiene su propia página con un link que no cambia: si editas la
rutina, el mismo link muestra lo nuevo.

---

## Cómo armar y mandar una rutina

**1. Abre el armador**

```
https://x5-007.github.io/damian-torres-coach/rutinas/armador/
```

Guárdalo en favoritos. Es solo para ti: no está enlazado desde tu página y
le pedimos a Google que no lo muestre en las búsquedas.

**2. Llena los datos del alumno**

El *link de la rutina* se genera solo a partir del nombre, con un código
aleatorio al final (`juan-p-7k2f`). Ese código evita que alguien adivine
las rutinas de otros alumnos. Si no te gusta, pulsa ↻ para generar otro.

**3. Agrega los días**

Pulsa «+ Agregar día» y ponle nombre («Lunes») y enfoque («Pecho / Tríceps»).
El día con borde rojo es el **día activo**: ahí se agregan los ejercicios.
Haz clic en otro día para cambiar de destino.

**4. Agrega ejercicios**

Búscalos en la biblioteca de la izquierda o filtra por grupo muscular, y
pulsa el **+**. Se agrupan solos por grupo muscular, en el orden en que los
vas poniendo. Luego llenas series, repeticiones, descanso y la nota de técnica.

**5. Revisa con «Vista previa»**

Abre la rutina tal como la verá el alumno, en una pestaña nueva.

**6. Pulsa «Exportar rutina»**

Descarga los dos archivos:

| Archivo | Para qué es |
|---|---|
| `index.html` | La página que ve el alumno. Ya trae dentro los datos y las etiquetas para que el link se vea bonito en WhatsApp. |
| `rutina.json` | Una copia de los datos para poder **editar** la rutina después. |

**7. Súbelos a GitHub**

1. Entra a tu repositorio y abre la carpeta `rutinas`.
2. **Add file → Upload files**.
3. Arrastra los dos archivos. En el nombre del archivo escribe la carpeta
   antes: `juan-p-7k2f/index.html`. GitHub crea la carpeta sola.
4. **Commit changes**. En menos de un minuto el link ya funciona.

**8. Mándalo**

En el armador, pulsa «Copiar mensaje para WhatsApp» y pégalo en el chat.

---

## Cómo editar una rutina ya enviada

1. Abre el armador y pulsa **«Importar JSON»**.
2. Elige el `rutina.json` de ese alumno.
3. Haz los cambios y cambia la fecha de actualización.
4. Exporta y sube los archivos **a la misma carpeta**, reemplazando los
   anteriores.

El link es el mismo, así que el alumno no necesita nada nuevo: abre el que
ya tiene y ve la rutina actualizada.

> El armador guarda un borrador automático en tu navegador. Si cierras la
> pestaña por accidente, al volver sigue ahí. Pero el borrador vive **solo
> en esa computadora**: el `rutina.json` es tu respaldo de verdad.

---

## Agregar ejercicios a la biblioteca

Edita `ejercicios.js`. Copia un bloque y cambia los valores:

```js
{
  id: "remo-con-barra",          // único, en minúsculas y con guiones
  nombre: "Remo con barra",      // como lo verá el alumno
  grupo: "Espalda",              // uno de los de GRUPOS
  clip: "remo-con-barra.mp4",    // el archivo dentro de clips/
  poster: "remo-con-barra.jpg",  // opcional
},
```

Si todavía no grabaste el video, deja `clip: ""`. El ejercicio aparece
igual en la rutina, solo que con un recuadro en lugar de la animación.

Las especificaciones de los videos están en **`clips/LEEME.txt`**:
3 a 6 segundos, MP4, menos de 1 MB. Los tres que vienen son de ejemplo,
reemplázalos por los tuyos con el mismo nombre de archivo.

---

## Qué hay en cada carpeta

| | |
|---|---|
| `armador/` | Tu panel para crear rutinas. Solo tuyo. |
| `ejercicios.js` | La biblioteca de ejercicios. |
| `clips/` | Los videos y sus miniaturas. |
| `base/` | El diseño y el motor que dibuja la rutina del alumno. **No lo edites** para cambiar una rutina. |
| `og.jpg` | La imagen que sale en la vista previa de WhatsApp. |
| `demo-juan-a3k9/` | Rutina de ejemplo. Bórrala cuando quieras. |
| `<alumno>/` | Una carpeta por alumno. |

---

## Cosas que conviene saber

**Los links son públicos.** Cualquiera que tenga la URL puede abrir la
rutina, y los archivos están en un repositorio público. Por eso el link
lleva un código aleatorio: no se puede adivinar ni aparece listado en
ningún lado. Aun así, no pongas ahí datos sensibles del alumno (peso,
medidas, temas de salud) salvo que él esté de acuerdo.

**Los videos no se descargan hasta que se ven.** Cada clip empieza a
cargar solo cuando el alumno llega a ese ejercicio, y se pausa cuando
cambia de día. Así no le gastas sus datos móviles de más.

**Si un celular no reproduce solo el video** (pasa en iPhone con Modo de
Bajo Consumo), aparece un botón de play y basta un toque.

**El alumno puede guardar la rutina en PDF** desde el menú de su navegador:
al imprimir salen todos los días, sin los videos.

**Tu WhatsApp sale de `content.js`.** Si lo cambias ahí, las rutinas nuevas
lo toman solo. Las ya publicadas conservan el número con el que se crearon.
