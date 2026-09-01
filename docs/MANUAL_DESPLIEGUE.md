# Manual completo de instalación, edición y despliegue

## 1. Qué incluye el proyecto

- 18 semanas académicas agrupadas por unidades.
- 36 sesiones, dos por cada semana.
- Cinco espacios de ejercicios por sesión: 180 ejercicios en total.
- Dos sesiones iniciales completamente desarrolladas como ejemplo.
- Contenido editable en MDX y compatible con archivos Markdown.
- Fórmulas matemáticas mediante KaTeX.
- Gráficos interactivos de GeoGebra con botón para abrirlos.
- Descarga opcional de archivos .ggb.
- Buscador global y atajo Ctrl + K.
- Tema claro y oscuro con persistencia de la preferencia.
- Diseño adaptable a computadora y celular.

## 2. Requisitos en Linux Mint

Necesitas Node.js 22.12 o posterior; recomendamos Node.js 24.

Comprueba tu versión actual:

```bash
node --version
npm --version
```

Si el comando node no existe o muestra una versión inferior a 22.12, instala Node.js 24. En Linux Mint puedes usar el repositorio NodeSource:

```bash
sudo apt update
sudo apt install -y curl unzip
curl -fsSL https://deb.nodesource.com/setup_24.x -o /tmp/nodesource_setup.sh
sudo bash /tmp/nodesource_setup.sh
sudo apt install -y nodejs
node --version
npm --version
```

También puedes instalar Node.js 24 mediante nvm o descargarlo desde nodejs.org.

## 3. Descomprimir el proyecto

Si descargaste el ZIP en tu carpeta Descargas:

```bash
cd /home/denisyeyson/Descargas
unzip Portafolio_Astro_Matematica.zip
cd portafolio-academico-matematica
```

También puedes hacer clic derecho sobre el ZIP y seleccionar Extraer aquí.

## 4. Instalar dependencias

Dentro de la carpeta del proyecto ejecuta:

```bash
npm install
```

La primera instalación requiere conexión a internet y puede tardar algunos minutos. La carpeta node_modules no viene dentro del ZIP porque es regenerable y haría demasiado pesada la descarga.

## 5. Levantar el proyecto localmente

```bash
npm run dev
```

Abre la dirección mostrada en la terminal:

```text
http://localhost:4321/
```

El servidor se actualiza automáticamente cuando guardas cambios. Para detenerlo, vuelve a la terminal y presiona Ctrl + C.

## 6. Abrir el sitio desde el celular

Conecta el celular y la laptop a la misma red Wi-Fi. El comando npm run dev muestra una dirección Network similar a:

```text
http://192.168.1.25:4321/
```

Escribe esa dirección en el navegador del celular. Si no conecta, revisa el firewall de Linux Mint y confirma que ambos equipos están en la misma red.

## 7. Editar la carátula y los datos personales

Abre este archivo:

```text
src/config/portfolio.ts
```

Modifica las propiedades:

```ts
student: 'Denis Espinoza',
studentFullName: 'Denis Yeyson Espinoza Ponciano',
career: 'Ingeniería de Software',
course: 'Matemática 2',
teacher: 'Nombre del profesor',
section: 'Tu sección',
semester: '2026-II',
firstWeekDate: '2026-08-10',
```

Los cambios se reflejan automáticamente en la portada, el encabezado y el progreso.

## 8. Organización del contenido

Los archivos editables están en:

```text
src/content/sesiones/
├── semana-01-sesion-01.mdx
├── semana-01-sesion-02.mdx
├── semana-02-sesion-01.mdx
├── semana-02-sesion-02.mdx
└── ... hasta semana-18-sesion-02.mdx
```

Cada archivo contiene dos partes: propiedades iniciales entre líneas --- y el contenido de la clase.

## 9. Propiedades de una sesión

```yaml
title: "Ecuación de la recta"
description: "Pendiente, formas de la recta y ejercicios."
week: 2
session: 1
date: 2026-08-17
unit: 1
tags:
  - Pendiente
  - Geometría analítica
published: true
duration: "2 horas"
difficulty: "Intermedio"
exercises: 5
```

Cuando una sesión está terminada cambia published de false a true. Esto actualiza los contadores y la barra de progreso.

## 10. Escribir teoría y fórmulas

El contenido utiliza Markdown:

```markdown
## Teoría

Una recta tiene pendiente constante.

### Fórmula

$$
m = \frac{y_2-y_1}{x_2-x_1}
$$

> Nota: recuerda respetar los signos.
```

Usa $formula$ para expresiones dentro de una línea y $$ en líneas separadas para fórmulas centradas.

## 11. Escribir un ejercicio

```mdx
<Ejercicio
  numero={1}
  titulo="Ecuación de la mediatriz"
  geogebraId="s6aev7zg"
  archivo="/geogebra/semana-02/sesion-01/ejercicio-01.ggb"
  dificultad="Intermedio"
>

**Enunciado.** Encuentra la mediatriz del segmento AB.

### Resolución

1. Calcula el punto medio.
2. Encuentra la pendiente perpendicular.
3. Escribe la ecuación de la recta.

$$
y-y_1=m(x-x_1)
$$

**Respuesta:** escribe aquí la ecuación final.

</Ejercicio>
```

## 12. Obtener el identificador de GeoGebra

Si el enlace es:

```text
https://www.geogebra.org/calculator/s6aev7zg
```

El identificador es s6aev7zg. Escríbelo como geogebraId="s6aev7zg". El gráfico aparecerá integrado sin las barras principales de herramientas y con un botón para abrirlo en GeoGebra.

Si GeoGebra muestra una vista desplazada, ajusta la posición y el zoom directamente en el material original antes de guardarlo.

## 13. Agregar el archivo descargable .ggb

Descarga la construcción desde GeoGebra y guárdala en:

```text
public/geogebra/semana-02/sesion-01/ejercicio-01.ggb
```

Después agrega al ejercicio:

```mdx
archivo="/geogebra/semana-02/sesion-01/ejercicio-01.ggb"
```

Si todavía no existe el archivo, omite el atributo archivo. El sitio mostrará un estado pendiente y no generará enlaces rotos.

## 14. Reutilizar tus notas Markdown de Obsidian

Copia la teoría desde tus notas .md y pégala debajo del encabezado ## Teoría de la sesión correspondiente. Las fórmulas entre $ y $$ se mantienen.

Las extensiones específicas de Obsidian, como [[enlaces internos]], bloques Dataview y callouts personalizados, deben convertirse a Markdown estándar antes de usarlas en Astro.

## 15. Cambiar temas de unidades y colores

Las unidades y sus nombres se definen en src/config/portfolio.ts. El diseño, los colores y la versión móvil se ajustan en src/styles/global.css.

El selector claro/oscuro recuerda la elección en el navegador. No necesitas instalar ninguna extensión.

## 16. Buscador general

Presiona Ctrl + K o utiliza el botón superior. El buscador reconoce nombres de temas, semanas, sesiones y etiquetas.

Al ejecutar npm run build también se genera un índice completo de búsqueda mediante Pagefind.

## 17. Generar la versión de producción

```bash
npm run build
```

El resultado se crea dentro de dist/. Para revisarlo localmente:

```bash
npm run preview
```

Abre la dirección indicada por la terminal.

## 18. Desplegar en Cloudflare Pages

1. Crea un repositorio en GitHub y sube la carpeta del proyecto.
2. Ingresa a Cloudflare Dashboard y abre Workers & Pages.
3. Selecciona Create application, Pages e Import an existing Git repository.
4. Autoriza GitHub y elige el repositorio.
5. Usa estos valores:

```text
Build command: npm run build
Build output directory: dist
NODE_VERSION: 24
```

6. Confirma el despliegue. Cloudflare entregará una URL pública.
7. Cada cambio enviado a GitHub generará una actualización automática.

## 19. Desplegar en Netlify

1. Crea un repositorio en GitHub y sube el proyecto.
2. Entra en Netlify y selecciona Add new site > Import an existing project.
3. Conecta GitHub y selecciona el repositorio.
4. Netlify reconocerá automáticamente el archivo netlify.toml.
5. Si solicita datos manuales, usa npm run build y la carpeta dist.
6. Pulsa Deploy site.

## 20. Subir el proyecto a GitHub

```bash
git init
git add .
git commit -m "Portafolio académico inicial"
git branch -M main
git remote add origin https://github.com/TU-USUARIO/TU-REPOSITORIO.git
git push -u origin main
```

Sustituye TU-USUARIO y TU-REPOSITORIO con tus datos reales. No subas node_modules ni archivos .env.

## 21. Problemas frecuentes

### npm: comando no encontrado

Node.js no está instalado o la terminal no se ha reiniciado. Instálalo y comprueba node --version.

### Versión de Node no compatible

Instala Node.js 24. El proyecto requiere una versión igual o superior a 22.12.

### Error al ejecutar npm install

Verifica tu conexión a internet. Si persiste, borra únicamente la carpeta node_modules y vuelve a ejecutar npm install.

### El gráfico de GeoGebra no aparece

Comprueba que el identificador sea correcto, que el material esté publicado y que el navegador tenga conexión a internet.

### El botón Descargar .ggb no funciona

Comprueba que el archivo exista dentro de public/geogebra/ y que el atributo archivo coincida exactamente con su ruta.

### No se actualiza el progreso

Cambia published: false a published: true en el archivo MDX correspondiente.

### El celular no encuentra el sitio

Usa la dirección Network mostrada por npm run dev, conecta ambos equipos al mismo Wi-Fi y revisa el firewall.

## 22. Flujo semanal recomendado

1. Abre la sesión correspondiente dentro de src/content/sesiones/.
2. Cambia el título, la fecha y las etiquetas.
3. Copia la teoría y las fórmulas desde tus apuntes.
4. Completa los cinco ejercicios.
5. Pega los identificadores de GeoGebra.
6. Guarda los archivos .ggb dentro de public/geogebra/.
7. Cambia published a true.
8. Revisa el resultado con npm run dev.
9. Envía tus cambios a GitHub si utilizas despliegue automático.
