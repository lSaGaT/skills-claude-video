#!/usr/bin/env node
/**
 * capturar-readme.mjs — captura o README de um repositório GitHub como PNG alto
 * e devolve as coordenadas dos elementos (para virar `boxes` no cena.json).
 *
 * Uso:
 *   node capturar-readme.mjs https://github.com/usuario/repo [--out ./capturas] [--width 1080]
 *
 * Saída: <out>/page.png e <out>/boxes.json
 * Requer puppeteer-core + Chrome instalado (CHROME_PATH para caminho customizado).
 */
import fs from 'node:fs';
import path from 'node:path';
import puppeteer from 'puppeteer-core';

const args = process.argv.slice(2);
const url = args[0];
if (!url) {
  console.error('uso: node capturar-readme.mjs <url-do-repo> [--out pasta] [--width 1080]');
  process.exit(1);
}
const getArg = (n) => {
  const i = args.indexOf(`--${n}`);
  return i >= 0 ? args[i + 1] : undefined;
};
const outDir = path.resolve(getArg('out') || 'capturas');
const LARGURA = Number(getArg('width') || 1080);
const ZOOM = Number(getArg('zoom') || 1.25); // amplia o README para o texto ficar grande como na referência
const SELETOR = getArg('sel') || '.repository-content'; // inclui barra de arquivo + abas README

const candidatos = [
  process.env.CHROME_PATH,
  'C:/Program Files/Google/Chrome/Application/chrome.exe',
  'C:/Program Files (x86)/Google/Chrome/Application/chrome.exe',
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  '/usr/bin/google-chrome',
  '/usr/bin/chromium',
].filter(Boolean);
const chrome = candidatos.find((p) => fs.existsSync(p));
if (!chrome) {
  console.error('Chrome não encontrado. Defina CHROME_PATH.');
  process.exit(1);
}

fs.mkdirSync(outDir, { recursive: true });

const browser = await puppeteer.launch({
  executablePath: chrome,
  headless: 'new',
  args: ['--hide-scrollbars', '--force-device-scale-factor=1'],
});
const page = await browser.newPage();
await page.emulateMediaFeatures([{ name: 'prefers-color-scheme', value: 'dark' }]);
await page.setViewport({ width: LARGURA, height: 1400, deviceScaleFactor: 1 });
await page.goto(url, { waitUntil: 'networkidle2', timeout: 60000 });
// tema escuro (GitHub respeita a classe no <html>)
await page.evaluate(() => {
  document.documentElement.setAttribute('data-color-mode', 'dark');
  document.documentElement.setAttribute('data-dark-theme', 'dark');
  document.documentElement.classList.add('dark');
});

// só o README interessa (o vídeo de referência mostra apenas o artigo)
await page.waitForSelector('.markdown-body', { timeout: 30000 });
await page.addStyleTag({
  content: `
    header, footer, .js-sticky-header, [data-testid="sticky-sidebar"],
    .Layout-sidebar, .repository-content > .mt-4,
    nav[aria-label="File navigation"], [data-testid="file-navigation"]
      { display:none !important; }
    ::-webkit-scrollbar { display:none !important; }
    html, body { background:#0d1117 !important; }
    .Layout, .Layout-main, .Layout-main-region, .Layout-content, main,
    .prc-PageLayout-Content-xWL-A, .prc-PageLayout-ContentWrapper-gR9eG,
    .prc-PageLayout-PageLayoutContent-BneH9, turbo-frame, .Box
      { display:block !important; width:100% !important; max-width:none !important; }
    .repository-content { display:block !important;
      width:${Math.round(LARGURA / ZOOM)}px !important;
      max-width:none !important; zoom:${ZOOM}; background:#0d1117 !important; }
    article.markdown-body { max-width:none !important; width:100% !important; padding:0 !important;
      overflow:visible !important; background:#0d1117 !important; }
    .markdown-body { max-width:none !important; width:100% !important; font-size:16px !important;
      background:#0d1117 !important; color:#e6edf3 !important; }
    .markdown-body img { max-width:100% !important; height:auto !important; }
    .markdown-body table { width:100% !important; display:table !important; table-layout:fixed !important; }
    .markdown-body th, .markdown-body td { border-color:#30363d !important;
      overflow-wrap:anywhere !important; white-space:normal !important; }
    .markdown-body tr:nth-child(2n) { background:#161b22 !important; }
    .markdown-body pre { overflow-wrap:anywhere !important; }
  `,
});

// container = a coluna de conteúdo real do README (sem abas/arquivos)
const el = (await page.$(SELETOR)) || (await page.$('article.markdown-body'));
if (!el) {
  console.error(`seletor não encontrado: ${SELETOR}`);
  process.exit(1);
}
const box = await el.boundingBox();
const clipX = Math.max(0, Math.floor(box.x));
const clipY = Math.max(0, Math.floor(box.y));
const clipH = Math.ceil(box.height);

const boxes = await el.evaluate((node) => {
  const raiz = node.getBoundingClientRect();
  const alvos = node.querySelectorAll(
    'p, li, pre, table, tr, h1, h2, h3, h4, blockquote',
  );
  return [...alvos]
    .map((n, i) => {
      const r = n.getBoundingClientRect();
      const texto = (n.innerText || '').replace(/\s+/g, ' ').trim();
      return {
        i,
        tag: n.tagName.toLowerCase(),
        texto: texto.slice(0, 70),
        rect: [
          Math.round(r.left - raiz.left),
          Math.round(r.top - raiz.top),
          Math.round(r.width),
          Math.round(r.height),
        ],
      };
    })
    .filter((o) => o.rect[3] > 16 && o.rect[2] > 120 && o.texto.length > 1);
}, {});

// corta a sobra à direita (coluna vazia depois do conteúdo) para o README preencher a janela
const direita = Math.max(...boxes.map((b) => b.rect[0] + b.rect[2]), 400);
const clipW = Math.min(LARGURA, Math.ceil(direita) + 16);

await page.screenshot({
  path: path.join(outDir, 'page.png'),
  clip: { x: clipX, y: clipY, width: clipW, height: clipH },
  captureBeyondViewport: true,
});

fs.writeFileSync(
  path.join(outDir, 'boxes.json'),
  JSON.stringify({ url, width: clipW, height: clipH, boxes }, null, 1),
);
await browser.close();
console.log(`page.png ${clipW}x${clipH} + ${boxes.length} elementos em ${outDir}`);
