# Archivos descargables de GeoGebra

Guarda aquí las construcciones .ggb, agrupadas por semana y sesión.

Ruta de ejemplo:

    public/geogebra/semana-01/sesion-01/ejercicio-01.ggb

Para obtener máxima calidad en el PDF, guarda también el SVG exportado por
GeoGebra en esa misma carpeta. El nombre del SVG debe ser el ID del material:

    public/geogebra/semana-01/sesion-01/s6aev7zg.svg

Después indica la ruta pública dentro del componente Ejercicio:

    archivo="/geogebra/semana-01/sesion-01/ejercicio-01.ggb"

El componente toma la carpeta de `archivo` y busca automáticamente
`s6aev7zg.svg` cuando `geogebraId="s6aev7zg"`. Si no encuentra el SVG,
el generador utiliza como respaldo una captura PNG en resolución 2x.

Si todavía no has agregado el archivo, el portafolio mostrará
«Archivo pendiente» sin romper la página.