/* Genera los JPG de las tarjetas de paquetes a partir de paquetes.html.
   Uso:  node marketing/render.mjs                                    */
import { chromium } from 'playwright';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const here = dirname(fileURLToPath(import.meta.url));
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1200, height: 1200 }, deviceScaleFactor: 1 });

await page.goto('file://' + join(here, 'paquetes.html'), { waitUntil: 'networkidle' });
await page.evaluate(() => document.fonts.ready);
await page.waitForTimeout(600);

for (const num of ['01', '02', '03', '04']) {
  const el = await page.$(`#board-${num}`);
  await el.screenshot({ path: join(here, `paquete-${num}.jpg`), type: 'jpeg', quality: 94 });
  console.log('generado paquete-' + num + '.jpg');
}

await browser.close();
