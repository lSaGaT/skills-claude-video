// capturar-carimbos.mjs — captura recortes de jornal (papel rasgado, transparente) de um HTML
// Uso: node capturar-carimbos.mjs [--html carimbos.html] [--out carimbos] [--seletor .pad]
// O HTML deve: fundo transparente, elementos capturáveis (padrão: .pad), marcar
// window.__PRONTO=true depois de aplicar clip-path/tamanho final, e usar
// deviceScaleFactor 1.5 (nitidez no zoompan do vídeo).
import puppeteer from 'puppeteer-core';
import fs from 'node:fs';

const arg = (nome, padrao) => {
  const i = process.argv.indexOf(`--${nome}`);
  return i > 0 ? process.argv[i + 1] : padrao;
};
const html = arg('html', 'carimbos.html');
const outDir = arg('out', 'carimbos');
const seletor = arg('seletor', '.pad');
fs.mkdirSync(outDir, { recursive: true });

const browser = await puppeteer.launch({
  executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe',
  args: ['--no-sandbox', '--hide-scrollbars', '--force-device-scale-factor=1.5'],
});
const page = await browser.newPage();
await page.setViewport({ width: 1100, height: 2400, deviceScaleFactor: 1.5 });
await page.goto(`file://${process.cwd()}/${html}`);
await page.evaluate(() =>
  Promise.all(['900 40px MB', '800 40px MXB', '600 30px MSB'].map((f) => document.fonts.load(f)))
);
await page.waitForFunction('window.__PRONTO === true', { timeout: 15000 });
await new Promise((r) => setTimeout(r, 250));

const els = await page.$$(seletor);
console.log('elementos encontrados:', els.length);
let i = 0;
for (const el of els) {
  i++;
  const path = `${outDir}/carimbo-${String(i).padStart(2, '0')}.png`;
  await el.screenshot({ path, omitBackground: true });
  console.log('OK', path);
}
await browser.close();
console.log('CONCLUÍDO:', i, 'recortes — anexar matérias NO FIM do array preserva os índices existentes.');
