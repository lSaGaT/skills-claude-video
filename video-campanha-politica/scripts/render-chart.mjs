// render-chart.mjs — render determinístico de gráfico HTML canvas → MP4 1080×1920
// Uso: node render-chart.mjs --html mapa-brasil.html --dur 58.8 [--fps 24] [--out saida.mp4] [--tudo]
//   --html  arquivo HTML com window.RENDER(t) determinístico e loop que respeita window.__STOP
//   --dur   duração em segundos (padrão: window.BEATMAP?.dur ou window.DUR no HTML)
//   --tudo  ignora o MP4 existente e re-renderiza (padrão: pula se já existe)
// O HTML precisa das fontes carregadas via document.fonts.load (MB/MXB/MSB — Montserrat).
import puppeteer from 'puppeteer-core';
import fs from 'node:fs';
import { execFileSync } from 'node:child_process';

const arg = (nome, padrao) => {
  const i = process.argv.indexOf(`--${nome}`);
  return i > 0 ? process.argv[i + 1] : padrao;
};
const html = arg('html');
if (!html) { console.error('uso: --html <arquivo.html> --dur <segundos>'); process.exit(1); }
const FPS = Number(arg('fps', 24));
const out = arg('out', html.replace(/\.html$/, '') + '.mp4');
const forcar = process.argv.includes('--tudo');

if (!forcar && fs.existsSync(out)) { console.log('pula', out, '(existe — use --tudo para forçar)'); process.exit(0); }

const BASE = process.cwd();
const FF = 'node_modules/ffmpeg-static/ffmpeg.exe';
const dur = Number(arg('dur', 0)) || await (async () => {
  // sem --dur: lê window.DUR ou window.BEATMAP.dur direto do HTML
  const src = fs.readFileSync(html, 'utf8');
  const m = src.match(/(?:window\.DUR|const DUR)\s*=\s*([\d.]+)/) || src.match(/window\.BEATMAP\s*=\s*(\{.*?\});/s);
  if (!m) { console.error('--dur obrigatório (não achei DUR no HTML)'); process.exit(1); }
  return m[1].startsWith('{') ? JSON.parse(m[1]).map?.dur ?? JSON.parse(m[1]).dur : Number(m[1]);
})();

const browser = await puppeteer.launch({
  executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe',
  args: ['--no-sandbox', '--hide-scrollbars', '--force-device-scale-factor=1'],
});
const page = await browser.newPage();
page.on('pageerror', (e) => console.error('PAGEERROR:', e.message));
await page.setViewport({ width: 1080, height: 1920 });
const dir = `frames/${html.replace(/\.html$/, '')}`;
fs.rmSync(dir, { recursive: true, force: true });
fs.mkdirSync(dir, { recursive: true });
await page.goto(`file://${BASE}/${html}`);
await page.evaluate(() =>
  Promise.all(['900 60px MB', '800 40px MXB', '600 30px MSB'].map((f) => document.fonts.load(f)))
);
await page.evaluate(() => { window.__STOP = true; });
await new Promise((r) => setTimeout(r, 200));
if (!(await page.evaluate(() => typeof window.RENDER === 'function'))) {
  console.error('window.RENDER não definida — veja PAGEERROR acima (script externo? <script src> em vez de fetch)');
  await browser.close(); process.exit(1);
}
const N = Math.round(dur * FPS);
for (let f = 0; f < N; f++) {
  await page.evaluate((t) => window.RENDER(t), f / FPS);
  fs.writeFileSync(`${dir}/f${String(f).padStart(4, '0')}.jpg`, await page.screenshot({ type: 'jpeg', quality: 92 }));
}
await browser.close();
execFileSync(FF, ['-y', '-framerate', String(FPS), '-i', `${dir}/f%04d.jpg`,
  '-c:v', 'libx264', '-crf', '18', '-pix_fmt', 'yuv420p', '-movflags', '+faststart', out], { stdio: 'pipe' });
console.log(`OK ${out} (${N} frames, ${dur}s)`);
