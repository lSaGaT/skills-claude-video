// gerar-previews-fontes.mjs — Fase B: para cada fonte do manifesto, gera o preview
// do card IGUAL ao painel do CapCut: o título renderizado NA fonte, claro sobre escuro.
// Saída: stickers/<id>_<stem>.png (o painel passa a preferir .png quando existir).
import { createRequire } from 'node:module';
import { readFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';

const require2 = createRequire('C:/Users/Conectare/Downloads/video/package.json');
const { createCanvas, GlobalFonts } = require2('@napi-rs/canvas');

const SKILL = 'C:/Users/Conectare/Downloads/video/.agents/skills/capcut-effects-filters/evidence/catalogo-visual';
const manifesto = JSON.parse(readFileSync(join(SKILL, 'fontes-manifesto.json'), 'utf8'));
const W = 220, H = 220;
let ok = 0, falha = 0;

for (const f of manifesto) {
  const ttf = f.ttf.replaceAll('\\', '/');
  if (!existsSync(ttf)) continue;
  // stem do webp correspondente (o painel referencia stickers/<stem>.<ext>)
  const alvoWebp = join(SKILL, 'stickers', `${f.id}_x.webp`);
  // acha o stem real pelo id
  const fs = await import('node:fs');
  const stem = fs.readdirSync(join(SKILL, 'stickers')).find(n => n.startsWith(f.id + '_') && n.endsWith('.webp'));
  if (!stem) continue;
  const saida = join(SKILL, 'stickers', stem.replace(/\.webp$/, '.png'));
  if (existsSync(saida)) { ok++; continue; }

  try {
    const fam = `fnt_${f.id}`;
    GlobalFonts.registerFromPath(ttf, fam);
    const c = createCanvas(W, H);
    const ctx = c.getContext('2d');
    ctx.fillStyle = '#26262e';
    ctx.fillRect(0, 0, W, H);
    const texto = (f.titulo || 'Aa 123').trim() || 'Aa 123';
    // fitSize: começa grande e encolhe até caber em 2 linhas de 180px de largura
    let size = 34;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    let linhas = [];
    for (; size >= 10; size -= 2) {
      ctx.font = `${size}px "${fam}"`;
      const palavras = texto.split(/\s+/);
      linhas = [];
      let linha = '';
      for (const p of palavras) {
        const teste = linha ? linha + ' ' + p : p;
        if (ctx.measureText(teste).width <= 184) linha = teste;
        else { if (linha) linhas.push(linha); linha = p; }
        if (linhas.length >= 2) break;
      }
      if (linhas.length < 2 && linha) linhas.push(linha);
      const maior = Math.max(...linhas.map(l => ctx.measureText(l).width), 0);
      if (linhas.length <= 2 && maior <= 184) break;
    }
    ctx.fillStyle = '#e8e8ea';
    const altLinha = size * 1.25;
    const y0 = H / 2 - ((linhas.length - 1) * altLinha) / 2;
    linhas.forEach((l, i) => ctx.fillText(l, W / 2, y0 + i * altLinha));
    fs.writeFileSync(saida, c.toBuffer('image/png'));
    ok++;
  } catch (e) {
    falha++;
    if (falha <= 5) console.log('falha', f.id, e.message.slice(0, 60));
  }
}
console.log(`previews gerados: ${ok} · falhas: ${falha}`);
