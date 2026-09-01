import { chromium } from 'playwright';
import { mkdir } from 'node:fs/promises';
import { spawn } from 'node:child_process';
import process from 'node:process';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const repository = process.env.GITHUB_REPOSITORY?.split('/')[1] ?? '';
const projectBase = process.env.GITHUB_ACTIONS === 'true' && repository && !repository.endsWith('.github.io')
  ? `/${repository}`
  : '';
const origin = 'http://127.0.0.1:4321';
const outputDirectory = fileURLToPath(new URL('../dist/pdfs/', import.meta.url));
const limit = Number(process.env.PDF_LIMIT || 36);

await mkdir(outputDirectory, { recursive: true });

const server = spawn(process.execPath, ['./node_modules/astro/astro.js', 'preview', '--host', '127.0.0.1', '--port', '4321'], {
  stdio: ['ignore', 'pipe', 'pipe'],
  env: process.env,
});

async function waitForServer() {
  const deadline = Date.now() + 30_000;
  while (Date.now() < deadline) {
    try {
      const response = await fetch(`${origin}${projectBase}/`);
      if (response.ok) return;
    } catch {}
    await new Promise((resolve) => setTimeout(resolve, 250));
  }
  throw new Error('El servidor de vista previa no inició a tiempo.');
}

function pad(value) {
  return String(value).padStart(2, '0');
}

let browser;
try {
  await waitForServer();
  browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ viewport: { width: 1440, height: 1000 } });
  await context.route('https://www.geogebra.org/**', (route) => route.abort());
  const page = await context.newPage();
  let generated = 0;

  for (let week = 1; week <= 18 && generated < limit; week += 1) {
    for (let session = 1; session <= 2 && generated < limit; session += 1) {
      const weekText = pad(week);
      const sessionText = pad(session);
      const url = `${origin}${projectBase}/semanas/${weekText}/sesion-${sessionText}/`;
      const filename = `semana-${weekText}-sesion-${sessionText}.pdf`;

      await page.goto(url, { waitUntil: 'networkidle' });
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
  server.kill('SIGTERM');
}
