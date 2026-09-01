# Publicar el portafolio con GitHub Pages

## 1. Crear el repositorio

En GitHub crea un repositorio vacío, por ejemplo `portafolio-matematica`. Puede ser público. No agregues README, `.gitignore` ni licencia desde GitHub porque el proyecto ya contiene sus archivos.

## 2. Subir el proyecto

Abre una terminal dentro de `portafolio-academico-matematica` y ejecuta:

```bash
git init
git add .
git commit -m "Publicar portafolio de matemática"
git branch -M main
git remote add origin https://github.com/TU-USUARIO/TU-REPOSITORIO.git
git push -u origin main
```

Reemplaza `TU-USUARIO` y `TU-REPOSITORIO` por los valores reales.

## 3. Activar GitHub Pages

1. Abre el repositorio en GitHub.
2. Entra en **Settings → Pages**.
3. En **Build and deployment**, selecciona **GitHub Actions** como fuente.
4. Abre la pestaña **Actions** y espera que termine el flujo **Deploy Astro to GitHub Pages**.

La dirección final será:

```text
https://TU-USUARIO.github.io/TU-REPOSITORIO/
```

La ruta del repositorio se calcula automáticamente. También funciona si el repositorio se llama `TU-USUARIO.github.io`, en cuyo caso la web se publica directamente en la raíz.

## 4. Actualizar el sitio

Después de modificar contenido, comprueba el proyecto y publica los cambios:

```bash
npm run build
git add .
git commit -m "Actualizar semana 02"
git push
```

Cada envío a `main` inicia un nuevo despliegue. Puedes ver el progreso en la pestaña **Actions**.

Durante este proceso GitHub instala Chromium y genera automáticamente un PDF A4 por cada sesión. No debes subir manualmente la carpeta `dist/pdfs`.

## Descargar las sesiones como PDF

Cada página de sesión muestra el botón **Descargar sesión en PDF**. Los documentos incluyen portada, datos de la sesión, teoría, fórmulas, ejercicios resueltos, enlaces a GeoGebra y numeración de páginas.

Los gráficos no permanecen interactivos dentro del PDF; en su lugar aparece el enlace al material original de GeoGebra.

Para generarlos localmente necesitas instalar el navegador de Playwright una sola vez:

```bash
npx playwright install chromium
npm run build
npm run pdf:generate
```

Los resultados se guardan en:

```text
dist/pdfs/semana-01-sesion-01.pdf
```

## 5. Probar la ruta de GitHub Pages localmente

Para simular que el repositorio se llama `portafolio-matematica`:

```bash
GITHUB_ACTIONS=true \
GITHUB_REPOSITORY="TU-USUARIO/portafolio-matematica" \
GITHUB_REPOSITORY_OWNER="TU-USUARIO" \
npm run build
```

Revisa que los enlaces generados empiecen con `/portafolio-matematica/`.

## Problemas frecuentes

- **La acción no inicia:** verifica que la rama se llame `main`.
- **Pages muestra un error de configuración:** selecciona GitHub Actions en **Settings → Pages**.
- **Una descarga `.ggb` devuelve 404:** confirma que el archivo exista dentro de `public/geogebra/` y respeta mayúsculas y minúsculas.
- **El despliegue falla en `npm ci`:** no elimines `package-lock.json` y usa Node.js 22 o superior.
- **La página antigua sigue visible:** espera a que el trabajo `deploy` termine en la pestaña **Actions** y recarga sin caché.
