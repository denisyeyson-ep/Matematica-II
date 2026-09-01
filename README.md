# Portafolio Académico de Matemática - Astro

Portafolio responsive para organizar 18 semanas, 36 sesiones y hasta 180 ejercicios de Matemática con teoría en MDX, fórmulas KaTeX, gráficos interactivos de GeoGebra, búsqueda y temas claro/oscuro.

Cada sesión incluye un botón para descargar una versión PDF diseñada para A4. Durante el despliegue, GitHub Actions genera automáticamente los 36 documentos con Playwright.

## Inicio rápido en Linux Mint

1. Instala Node.js 24 o una versión compatible igual o superior a 22.12.
2. Abre una terminal dentro de la carpeta del proyecto.
3. Ejecuta:

```bash
npm install
npm run dev
```

4. Abre la dirección que indica la terminal; normalmente:

```text
http://localhost:4321/
```

## Personalizar la portada

Edita el archivo:

```text
src/config/portfolio.ts
```

Allí puedes cambiar el estudiante, el docente, la sección, el curso, la carrera, el ciclo académico y la fecha de inicio.

## Añadir contenido semanal

Cada sesión corresponde a un archivo:

```text
src/content/sesiones/semana-01-sesion-01.mdx
src/content/sesiones/semana-01-sesion-02.mdx
...
src/content/sesiones/semana-18-sesion-02.mdx
```

Edita el archivo correspondiente y cambia published: false por published: true cuando el contenido esté listo.

## Insertar un ejercicio con GeoGebra

```mdx
<Ejercicio
  numero={1}
  titulo="Ecuación de la recta"
  geogebraId="s6aev7zg"
  archivo="/geogebra/semana-01/sesion-01/ejercicio-01.ggb"
  dificultad="Intermedio"
>

**Enunciado.** Escribe el ejercicio.

### Resolución

$$
y=mx+b
$$

**Respuesta:** escribe el resultado.

</Ejercicio>
```

El identificador es la última parte del enlace de GeoGebra. Si no tienes el archivo descargable, elimina el atributo archivo y aparecerá el aviso «Archivo pendiente».

## Comandos disponibles

| Comando | Función |
| --- | --- |
| npm install | Instala las dependencias. |
| npm run dev | Inicia el servidor local. |
| npm run build | Genera el sitio estático y el índice de búsqueda. |
| npm run preview | Permite revisar localmente el sitio ya compilado. |
| npm run pdf:generate | Genera los PDF dentro de `dist/pdfs/` después de compilar. |

## Publicación automática en GitHub Pages

El proyecto incluye `.github/workflows/deploy.yml`. La configuración de Astro detecta automáticamente el nombre del repositorio y aplica la ruta base correcta, por lo que funcionan la navegación, Pagefind y las descargas `.ggb` en una URL como:

```text
https://TU-USUARIO.github.io/TU-REPOSITORIO/
```

Después de subirlo a la rama `main`, entra en **Settings → Pages** y selecciona **GitHub Actions** en **Source**. Cada nuevo `git push` compilará y publicará el portafolio.

No escribas manualmente el usuario ni el repositorio en `astro.config.mjs`: GitHub Actions los proporciona durante la compilación.

Revisa `docs/MANUAL_GITHUB_PAGES.md` para el procedimiento completo.
