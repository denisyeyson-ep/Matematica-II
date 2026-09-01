import { chromium } from 'playwright';
import { mkdir, readFile, stat } from 'node:fs/promises';
import { createServer } from 'node:http';
import process from 'node:process';
import { extname, join, normalize } from 'node:path';
import { fileURLToPath } from 'node:url';

const repository = process.env.GITHUB_REPOSITORY?.split('/')[1] ?? '';
const projectBase = process.env.GITHUB_ACTIONS === 'true' && repository && !repository.endsWith('.github.io')
    ? `/${repository}`
    : '';
const origin = 'http://127.0.0.1:4321';
const distDirectory = fileURLToPath(new URL('../dist/', import.meta.url));
const outputDirectory = fileURLToPath(new URL('../dist/pdfs/', import.meta.url));
const limit = Number(process.env.PDF_LIMIT || 36);
const graphScale = Number(process.env.PDF_GRAPH_SCALE || 2);

await mkdir(outputDirectory, { recursive: true });

const contentTypes = {
  '.css': 'text/css; charset=utf-8',
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.woff2': 'font/woff2',
};

const server = createServer(async (request, response) => {
  try {
    const requestUrl = new URL(request.url ?? '/', origin);
    let pathname = decodeURIComponent(requestUrl.pathname);

    if (projectBase && pathname.startsWith(projectBase)) {
      pathname = pathname.slice(projectBase.length) || '/';
    }

    let relativePath = pathname.replace(/^\/+/, '');
    if (!relativePath || relativePath.endsWith('/')) relativePath += 'index.html';
    const safePath = normalize(relativePath).replace(/^(\.\.(\/|\\|$))+/, '');
    let filePath = join(distDirectory, safePath);

    try {
      if ((await stat(filePath)).isDirectory()) filePath = join(filePath, 'index.html');
    } catch {
      response.writeHead(404).end('Not found');
      return;
    }

    const file = await readFile(filePath);
    response.writeHead(200, { 'Content-Type': contentTypes[extname(filePath)] ?? 'application/octet-stream' });
    response.end(file);
  } catch (error) {
    console.error(error);
    response.writeHead(500).end('Internal server error');
  }
});

await new Promise((resolve, reject) => {
  server.once('error', reject);
  server.listen(4321, '127.0.0.1', resolve);
});
console.log(`Servidor PDF listo en ${origin}${projectBase}/`);

function pad(value) {
  return String(value).padStart(2, '0');
}

let browser;
try {
  browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1440, height: 1000 },
    deviceScaleFactor: graphScale,
  });
  const page = await context.newPage();
  let generated = 0;

  for (let week = 1; week <= 18 && generated < limit; week += 1) {
    for (let session = 1; session <= 2 && generated < limit; session += 1) {
      const weekText = pad(week);
      const sessionText = pad(session);
      const url = `${origin}${projectBase}/semanas/${weekText}/sesion-${sessionText}/`;
      const filename = `semana-${weekText}-sesion-${sessionText}.pdf`;

      await page.emulateMedia({ media: 'screen', colorScheme: 'light' });
      await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 45_000 });
      await page.waitForTimeout(3_000);

      const graphs = page.locator('.geogebra-frame');
      const graphCount = await graphs.count();
      for (let graphIndex = 0; graphIndex < graphCount; graphIndex += 1) {
        const graph = graphs.nth(graphIndex);
        let vectorInserted = false;

        const svgSource = await graph.getAttribute('data-pdf-svg');
        if (svgSource) {
          try {
            const svgAddress = new URL(svgSource, page.url()).href;
            const svgResponse = await context.request.get(svgAddress);
            if (svgResponse.ok()) {
              const svgMarkup = await svgResponse.text();
              if (/<svg(?:\s|>)/i.test(svgMarkup)) {
                await graph.evaluate((element, markup) => {
                  const preview = document.createElement('div');
                  preview.className = 'pdf-geogebra-preview pdf-geogebra-vector';
                  preview.setAttribute('role', 'img');
                  preview.setAttribute('aria-label', 'Vista vectorial del gráfico de GeoGebra');
                  preview.innerHTML = markup;
                  const svg = preview.querySelector('svg');
                  if (!svg) throw new Error('El archivo no contiene un elemento SVG válido.');
                  if (!svg.hasAttribute('viewBox')) {
                    const width = Number.parseFloat(svg.getAttribute('width') || '');
                    const height = Number.parseFloat(svg.getAttribute('height') || '');
                    if (width > 0 && height > 0) svg.setAttribute('viewBox', `0 0 ${width} ${height}`);
                  }
                  svg.removeAttribute('width');
                  svg.removeAttribute('height');
                  svg.setAttribute('preserveAspectRatio', 'xMidYMid meet');
                  svg.style.width = '100%';
                  svg.style.height = '100%';
                  svg.style.overflow = 'visible';
                  element.insertAdjacentElement('beforebegin', preview);
                }, svgMarkup);
                vectorInserted = true;
                console.log(`SVG vectorial: ${svgSource}`);
              }
            }
          } catch (error) {
            console.warn(`No se pudo usar ${svgSource}; se generará una captura PNG:`, error.message);
          }
        }

        if (vectorInserted) continue;

        try {
          await graph.scrollIntoViewIfNeeded();
          // Los iframes usan carga diferida; damos tiempo a GeoGebra para dibujar la vista.
          await page.waitForTimeout(1_500);
          const screenshot = await graph.screenshot({
            type: 'png',
            scale: 'device',
            animations: 'disabled',
            timeout: 20_000,
          });
          const dataUrl = `data:image/png;base64,${screenshot.toString('base64')}`;
          await graph.evaluate((element, source) => {
            const preview = document.createElement('img');
            preview.className = 'pdf-geogebra-preview';
            preview.src = source;
            preview.alt = 'Vista previa del gráfico de GeoGebra';
            element.insertAdjacentElement('beforebegin', preview);
          }, dataUrl);
        } catch (error) {
          console.warn(`No se pudo capturar el gráfico ${graphIndex + 1} de ${filename}:`, error.message);
        }
      }

      await page.emulateMedia({ media: 'print', colorScheme: 'light' });
      await page.pdf({
        path: join(outputDirectory, filename),
        format: 'A4',
        printBackground: true,
        displayHeaderFooter: true,
        margin: { top: '18mm', right: '14mm', bottom: '18mm', left: '14mm' },
        headerTemplate: '<div style="width:100%;font-size:8px;color:#64748b;text-align:center">Portafolio Académico de Matemática</div>',
        footerTemplate: '<div style="width:100%;font-size:8px;color:#64748b;text-align:center"><span class="pageNumber"></span> / <span class="totalPages"></span></div>',
      });
      generated += 1;
      console.log(`PDF ${generated}/${limit}: ${filename}`);
    }
  }
} finally {
  await browser?.close();
  await new Promise((resolve) => server.close(resolve));
}