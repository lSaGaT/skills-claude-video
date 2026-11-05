#!/usr/bin/env node
/**
 * render-readme-scroll.mjs — renderer v2 do formato A (README Scroll).
 *
 * O que a v2 acrescenta em relação à v1 (o que separa 4/10 de 8/10):
 *  - moldura neon fina sobre fundo preto, em vez de borda grossa colorida;
 *  - página do README dissolvida por gradiente atrás da legenda (banda preta);
 *  - legenda com entrada animada (subida + fade), acento com "pop" de escala;
 *  - caixas de destaque com traço desenhado UMA vez (na entrada da caixa) + glow;
 *  - scroll por keyframe: página parada entre falas; na virada, rolamento com
 *    duração proporcional à distância (salto longo = rola mais rápido), contínuo
 *    quadro a quadro (sem drift, sem corte seco — drift por beat estalava);
 *  - grão de filme e vinheta;
 *  - cartão final desenhado (pílula do repo + CTA).
 *
 * Uso:
 *   node render-readme-scroll.mjs cena.json [--stills 1.0,3.5] [--out saida.mp4]
 *
 * Requer @napi-rs/canvas + ffmpeg (ffmpeg-static ou FFMPEG no ambiente).
 * Fontes: Montserrat-*.ttf em fonts/ (achada subindo da pasta da skill).
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';
import { spawn } from 'node:child_process';
import { createCanvas, GlobalFonts, loadImage } from '@napi-rs/canvas';

const require = createRequire(import.meta.url);
const __dirname = path.dirname(fileURLToPath(import.meta.url));

const args = process.argv.slice(2);
const cfgPath = args.find((a) => !a.startsWith('--'));
if (!cfgPath) {
  console.error('uso: node render-readme-scroll.mjs cena.json [--stills 1.0,3.5] [--out saida.mp4]');
  process.exit(1);
}
const getArg = (nome) => {
  const i = args.indexOf(`--${nome}`);
  return i >= 0 ? args[i + 1] : undefined;
};
const stillsArg = getArg('stills');
const stills = stillsArg
  ? stillsArg.split(',').map(Number).filter((n) => !Number.isNaN(n))
  : [];

const cfg = JSON.parse(fs.readFileSync(cfgPath, 'utf8'));
const [W, H] = cfg.size || [1080, 1920];
const FPS = cfg.fps || 30;

// ---------- fontes ----------
// sobe da pasta da skill até achar fonts/ com Montserrat — a skill funciona
// tanto na raiz do workspace (.agents/skills/) quanto na gaveta do editor-chefe
const FONTS = (() => {
  for (let d = __dirname; ; d = path.dirname(d)) {
    if (fs.existsSync(path.join(d, 'fonts', 'Montserrat-Black.ttf'))) return path.join(d, 'fonts');
    if (d === path.parse(d).root) return null;
  }
})();
const registro = [
  ['ReelBlack', ['Montserrat-Black.ttf', 'Montserrat-ExtraBold.ttf']],
  ['ReelBold', ['Montserrat-ExtraBold.ttf', 'Montserrat-Bold.ttf']],
  ['ReelMedium', ['Montserrat-SemiBold.ttf', 'Montserrat-Bold.ttf']],
  ['ReelRegular', ['Montserrat-SemiBold.ttf', 'Montserrat-Bold.ttf']],
];
for (const [nome, cands] of registro) {
  if (!FONTS) break;
  for (const f of cands) {
    const p = path.join(FONTS, f);
    if (fs.existsSync(p)) {
      GlobalFonts.registerFromPath(p, nome);
      break;
    }
  }
}
const FONT = (peso, px) => `${px}px Reel${peso}, sans-serif`;

// ---------- geometria (escala 1080x1920) ----------
const s = W / 1080;
const FRAME_INSET = Math.round(13 * s);
const WIN_INSET = Math.round(21 * s);
const RADIUS = Math.round(20 * s);
const CHROME_H = Math.round(56 * s);
const ADDR_H = Math.round(44 * s);
const CAP_SIZE = Math.round(66 * s);
const CAP_CENTER_Y = Math.round(0.772 * H);
const CAP_MAXW = Math.round(940 * s);
const BOX_STROKE = Math.max(2, Math.round(2.4 * s));
const OK = '#ffd84d';
const OK_BOX = '#ffd400';

const winX = WIN_INSET;
const winY = WIN_INSET;
const winW = W - WIN_INSET * 2;
const winH = H - WIN_INSET * 2;
const contentTop = winY + CHROME_H + ADDR_H;
const contentH = winY + winH - contentTop;

// ---------- timeline ----------
const beats = (cfg.beats || [])
  .map((b, i, arr) => {
    const start = b.t ?? 0;
    const dur = b.dur ?? (arr[i + 1]?.t ?? start + 3) - start;
    return { ...b, start, dur, end: start + dur };
  })
  .sort((a, b) => a.start - b.start);
const TOTAL = beats.reduce((m, b) => Math.max(m, b.end), 0);

const clamp01 = (x) => Math.min(1, Math.max(0, x));
const easeOutCubic = (x) => 1 - Math.pow(1 - x, 3);
const easeInOutQuad = (x) => (x < 0.5 ? 2 * x * x : 1 - Math.pow(-2 * x + 2, 2) / 2);
const easeInOutCubic = (x) => (x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2);

function beatAt(t) {
  let cur = beats[0];
  for (const b of beats) if (t >= b.start) cur = b;
  return cur;
}
const indice = (b) => beats.indexOf(b);

// scroll: um keyframe por beat. O rolamento cruza a virada da fala (começa no fim
// da fala anterior, aterrissa logo depois de a fala nova começar) e a duração é
// proporcional à distância: ajuste curto é discreto, salto longo rola mais rápido.
// Entre rolamentos a página fica PARADA — o drift antigo (10 px/s dentro do beat,
// zerado na virada) dava um tranco para trás a cada fala: era o "stall" visível.
// Segmentos sequenciais e não sobrepostos: cada um começa exatamente onde o
// anterior terminou, então scrollEm(t) é contínuo por construção.
const VEL_ROLO = 2400;  // px/s de referência
const ROLO_MIN = 0.3;   // duração mínima do rolamento (s)
const ROLO_MAX = 1.15;  // duração máxima do rolamento (s)
const rolos = [];
const roloDoBeat = [];
{
  let limite = 0; // fim do rolamento anterior (janelas nunca se sobrepõem)
  beats.forEach((b, i) => {
    const de = i > 0 ? beats[i - 1].scroll || 0 : b.scroll || 0;
    const para = b.scroll || 0;
    const dist = Math.abs(para - de);
    if (i > 0 && dist >= 1) {
      const dur = Math.min(ROLO_MAX, Math.max(ROLO_MIN, dist / VEL_ROLO));
      // salto longo aterrissa mais tarde (a câmera "pousa" durante a fala nova)
      const aterrissa = dist > 800 ? 0.45 : 0.14;
      const t1 = Math.min(b.start + Math.min(aterrissa, b.dur * 0.4), b.end - 0.04);
      const t0 = Math.max(t1 - dur, limite);
      const r = { t0, t1, de, para, dist };
      rolos.push(r);
      roloDoBeat[i] = r;
      limite = t1;
    }
  });
}

function scrollEm(t) {
  let r = null;
  for (const x of rolos) {
    if (t >= x.t0) r = x;
    else break;
  }
  if (!r) return beats[0].scroll || 0;
  if (t >= r.t1) return r.para;
  const k = clamp01((t - r.t0) / Math.max(r.t1 - r.t0, 0.001));
  return r.de + (r.para - r.de) * easeInOutCubic(k);
}

// deriva lenta de câmera (zoom) do começo ao fim
const DERIVA = 0.028;

function roundRect(ctx, x, y, w, h, r) {
  const rr = Math.min(r, Math.min(w, h) / 2);
  ctx.beginPath();
  ctx.moveTo(x + rr, y);
  ctx.arcTo(x + w, y, x + w, y + h, rr);
  ctx.arcTo(x + w, y + h, x, y + h, rr);
  ctx.arcTo(x, y + h, x, y, rr);
  ctx.arcTo(x, y, x + w, y, rr);
  ctx.closePath();
}

function quebrar(ctx, texto, maxW, maxLinhas = 2) {
  const palavras = texto.split(/\s+/).filter(Boolean);
  const linhas = [];
  let atual = [];
  for (const p of palavras) {
    const teste = [...atual, p].join(' ');
    if (ctx.measureText(teste).width > maxW && atual.length) {
      linhas.push(atual);
      atual = [p];
    } else atual.push(p);
  }
  if (atual.length) linhas.push(atual);
  while (linhas.length > maxLinhas) {
    const ult = linhas.pop();
    linhas[linhas.length - 1] = linhas[linhas.length - 1].concat(ult);
  }
  return linhas;
}

// ---------- assets ----------
let pageImg = null;
if (cfg.pageImage) {
  const p = path.resolve(path.dirname(cfgPath), cfg.pageImage);
  if (fs.existsSync(p)) pageImg = await loadImage(p);
  else console.warn(`[aviso] pageImage não encontrada: ${p}`);
}

const canvas = createCanvas(W, H);
const ctx = canvas.getContext('2d');

// grão: tile gerado uma vez
const grao = (() => {
  const g = createCanvas(220, 220);
  const c = g.getContext('2d');
  const img = c.createImageData(220, 220);
  for (let i = 0; i < img.data.length; i += 4) {
    const v = 120 + Math.random() * 135;
    img.data[i] = img.data[i + 1] = img.data[i + 2] = v;
    img.data[i + 3] = 26;
  }
  c.putImageData(img, 0, 0);
  return g;
})();

function fundo(t) {
  ctx.fillStyle = '#04050a';
  ctx.fillRect(0, 0, W, H);
  // moldura neon
  const g = ctx.createLinearGradient(0, 0, W, H);
  g.addColorStop(0, '#ff77c0');
  g.addColorStop(0.45, '#8b5cff');
  g.addColorStop(1, '#3f7dff');
  ctx.save();
  for (let i = 0; i < 4; i++) {
    ctx.globalAlpha = 0.20 - i * 0.045;
    ctx.strokeStyle = g;
    ctx.lineWidth = (6 + i * 11) * s;
    roundRect(ctx, FRAME_INSET, FRAME_INSET, W - FRAME_INSET * 2, H - FRAME_INSET * 2, RADIUS + 7 * s);
    ctx.stroke();
  }
  ctx.globalAlpha = 1;
  ctx.strokeStyle = g;
  ctx.lineWidth = 3 * s;
  roundRect(ctx, FRAME_INSET, FRAME_INSET, W - FRAME_INSET * 2, H - FRAME_INSET * 2, RADIUS + 4 * s);
  ctx.stroke();
  ctx.restore();
}

function janela(t, scroll, zoom) {
  ctx.save();
  roundRect(ctx, winX, winY, winW, winH, RADIUS);
  ctx.fillStyle = '#0d1117';
  ctx.shadowColor = 'rgba(0,0,0,0.55)';
  ctx.shadowBlur = 34 * s;
  ctx.shadowOffsetY = 10 * s;
  ctx.fill();
  ctx.restore();

  // barra do navegador
  ctx.save();
  roundRect(ctx, winX, winY, winW, CHROME_H + RADIUS, RADIUS);
  ctx.clip();
  ctx.fillStyle = '#11161d';
  ctx.fillRect(winX, winY, winW, CHROME_H);
  ctx.fillStyle = '#e6edf3';
  ctx.beginPath();
  ctx.arc(winX + 30 * s, winY + CHROME_H / 2, 11 * s, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#11161d';
  ctx.font = FONT('Medium', 12 * s);
  ctx.textBaseline = 'middle';
  ctx.textAlign = 'center';
  ctx.fillText('GH', winX + 30 * s, winY + CHROME_H / 2 + 1 * s);
  ctx.textAlign = 'left';
  ctx.fillStyle = '#8b949e';
  ctx.font = FONT('Medium', 21 * s);
  ctx.fillText('GitHub', winX + 50 * s, winY + CHROME_H / 2);
  const wG = ctx.measureText('GitHub  ').width;
  ctx.fillStyle = '#c9d1d9';
  ctx.fillText(`— ${cfg.repo || 'usuario/repo'}`, winX + 50 * s + wG, winY + CHROME_H / 2);
  ctx.fillStyle = '#1f2630';
  roundRect(ctx, winX + winW - 52 * s, winY + (CHROME_H - 30 * s) / 2, 30 * s, 30 * s, 9 * s);
  ctx.fill();
  ctx.fillStyle = '#8b949e';
  ctx.font = FONT('Bold', 20 * s);
  ctx.textAlign = 'center';
  ctx.fillText('+', winX + winW - 37 * s, winY + CHROME_H / 2);
  ctx.textAlign = 'left';
  ctx.restore();

  // pílula de URL
  ctx.save();
  roundRect(ctx, winX + 12 * s, winY + CHROME_H + 4 * s, winW - 24 * s, ADDR_H - 8 * s, (ADDR_H - 8 * s) / 2);
  ctx.fillStyle = '#161b22';
  ctx.fill();
  const ly = winY + CHROME_H + ADDR_H / 2;
  ctx.strokeStyle = '#6e7681';
  ctx.lineWidth = 2 * s;
  ctx.beginPath();
  ctx.arc(winX + 32 * s, ly - 4 * s, 5 * s, Math.PI, 0);
  ctx.stroke();
  ctx.fillStyle = '#6e7681';
  roundRect(ctx, winX + 27 * s, ly - 4 * s, 11 * s, 9 * s, 2 * s);
  ctx.fill();
  ctx.fillStyle = '#c9d1d9';
  ctx.font = FONT('Medium', 19 * s);
  ctx.textBaseline = 'middle';
  ctx.fillText(cfg.url || 'github.com/usuario/repo', winX + 48 * s, ly);
  ctx.restore();

  // conteúdo
  ctx.save();
  roundRect(ctx, winX, contentTop, winW, contentH, 0);
  ctx.clip();
  ctx.fillStyle = '#0d1117';
  ctx.fillRect(winX, contentTop, winW, contentH);
  if (pageImg) {
    ctx.save();
    const z = 1 + zoom;
    // escala imagem -> largura da janela (as caixas usam a mesma escala)
    const escala = winW / pageImg.width;
    ctx.translate(winX + winW / 2, contentTop);
    ctx.scale(z, z);
    ctx.drawImage(pageImg, -winW / 2, -scroll * escala, winW, pageImg.height * escala);
    ctx.restore();
  }
  ctx.restore();
}

/** true quando a caixa do beat anterior é a mesma (a fala mudou, o alvo não) */
function mesmaCaixa(a, b) {
  return !!a && !!b && a.length === b.length &&
    a.every((r, k) => r.length === b[k].length && r.every((v, j) => Math.abs(v - b[k][j]) < 1));
}

function caixas(boxes, scroll, alpha, progresso) {
  if (!boxes || !alpha) return;
  ctx.save();
  roundRect(ctx, winX, contentTop, winW, contentH, 0);
  ctx.clip();
  ctx.globalAlpha = alpha;
  ctx.strokeStyle = OK_BOX;
  ctx.lineWidth = BOX_STROKE;
  ctx.shadowColor = 'rgba(255,212,0,0.45)';
  ctx.shadowBlur = 10 * s;
  const escala = winW / (pageImg ? pageImg.width : 1080);
  for (const [x, y, w, h] of boxes) {
    const rx = winX + x * escala - 7 * s;
    const ry = contentTop + y * escala - scroll * escala - 7 * s;
    const rw = w * escala + 14 * s;
    const rh = h * escala + 14 * s;
    if (ry + rh < contentTop - 40 || ry > contentTop + contentH + 40) continue;
    // traço desenhado progressivamente (perímetro)
    const per = 2 * (rw + rh);
    ctx.setLineDash([per * progresso, per]);
    ctx.beginPath();
    const rr = 8 * s;
    ctx.moveTo(rx + rr, ry);
    ctx.arcTo(rx + rw, ry, rx + rw, ry + rh, rr);
    ctx.arcTo(rx + rw, ry + rh, rx, ry + rh, rr);
    ctx.arcTo(rx, ry + rh, rx, ry, rr);
    ctx.arcTo(rx, ry, rx + rw, ry, rr);
    ctx.closePath();
    ctx.stroke();
    ctx.setLineDash([]);
  }
  ctx.restore();
}

function legenda(beat, t) {
  if (!beat.caption) return;
  const i = indice(beat);
  const ant = beats[i - 1];
  const p = clamp01((t - beat.start) / 0.22);
  const entrada = easeOutCubic(p);
  const alphaEntrada = entrada;
  const dy = (1 - entrada) * 26 * s;

  // saída da legenda anterior
  if (ant && ant.caption && t - beat.start < 0.16) {
    const q = clamp01((t - beat.start) / 0.16);
    ctx.save();
    ctx.globalAlpha = 1 - q;
    desenharLinha(ant.caption, ant.accent || [], 0, -q * 18 * s, 1);
    ctx.restore();
  }

  ctx.save();
  ctx.globalAlpha = alphaEntrada;
  // "pop" do acento
  const pop = 1 + 0.045 * Math.sin(Math.PI * clamp01((t - beat.start) / 0.5));
  desenharLinha(beat.caption, beat.accent || [], 0, dy, pop);
  ctx.restore();
}

function desenharLinha(texto, accent, dx, dy, pop) {
  const textoUp = texto.toUpperCase();
  let px = CAP_SIZE;
  ctx.font = FONT('Bold', px);
  let linhas = quebrar(ctx, textoUp, CAP_MAXW);
  while (linhas.length > 2 && px > CAP_SIZE * 0.62) {
    px -= Math.round(3 * s);
    ctx.font = FONT('Bold', px);
    linhas = quebrar(ctx, textoUp, CAP_MAXW);
  }
  const lh = Math.round(px * 1.12);
  const acc = new Set(accent);
  let idx = 0;
  const totalAltura = linhas.length * lh;
  ctx.textBaseline = 'middle';
  linhas.forEach((linha, li) => {
    const largura = ctx.measureText(linha.join(' ')).width;
    let x = (W - largura) / 2 + dx;
    const y = CAP_CENTER_Y - totalAltura / 2 + lh / 2 + li * lh + dy;
    for (const palavra of linha) {
      const wPal = ctx.measureText(palavra).width;
      const esp = ctx.measureText(' ').width;
      const destaque = acc.has(idx);
      if (destaque) {
        ctx.save();
        ctx.translate(x + wPal / 2, y);
        ctx.scale(pop, pop);
        ctx.fillStyle = OK;
        ctx.shadowColor = 'rgba(255,216,77,0.35)';
        ctx.shadowBlur = 18 * s;
        ctx.fillText(palavra, -wPal / 2, 0);
        ctx.restore();
      } else {
        ctx.fillStyle = '#ffffff';
        ctx.fillText(palavra, x, y);
      }
      x += wPal + esp;
      idx++;
    }
  });
}

function scrim() {
  const g = ctx.createLinearGradient(0, H * 0.46, 0, H * 0.72);
  g.addColorStop(0, 'rgba(4,5,10,0)');
  g.addColorStop(0.35, 'rgba(4,5,10,0.6)');
  g.addColorStop(1, 'rgba(4,5,10,0.985)');
  ctx.fillStyle = g;
  ctx.fillRect(0, H * 0.46, W, H * 0.26);
  // banda preta sólida a partir da legenda (o texto nunca disputa espaço com o README)
  ctx.fillStyle = '#04050a';
  ctx.fillRect(0, H * 0.715, W, H * 0.285);
}

function graoEVinheta(t) {
  const ox = (Math.random() * 220) | 0;
  const oy = (Math.random() * 220) | 0;
  ctx.save();
  ctx.globalAlpha = 0.5;
  for (let y = -oy; y < H; y += 220) for (let x = -ox; x < W; x += 220) ctx.drawImage(grao, x, y);
  ctx.restore();
  const v = ctx.createRadialGradient(W / 2, H / 2, H * 0.30, W / 2, H / 2, H * 0.78);
  v.addColorStop(0, 'rgba(0,0,0,0)');
  v.addColorStop(1, 'rgba(0,0,0,0.42)');
  ctx.fillStyle = v;
  ctx.fillRect(0, 0, W, H);
}

function fecho(beat, t) {
  const p = easeOutCubic(clamp01((t - beat.start) / 0.35));
  ctx.fillStyle = '#04050a';
  ctx.fillRect(0, 0, W, H);
  const cx = W / 2;
  const cy = H * 0.48;
  const repo = cfg.repo || 'usuario/repo';
  const url = cfg.url || 'github.com/usuario/repo';
  ctx.font = FONT('Black', 50 * s);
  const wRepo = ctx.measureText(repo).width;
  ctx.font = FONT('Medium', 26 * s);
  const wUrl = ctx.measureText(url).width;
  const pw = Math.min(W - 90 * s, Math.max(wRepo, wUrl) + 210 * s);
  const ph = 165 * s;

  ctx.save();
  ctx.globalAlpha = p;
  ctx.translate(0, (1 - p) * 24 * s);
  roundRect(ctx, cx - pw / 2, cy - ph / 2, pw, ph, 22 * s);
  ctx.fillStyle = '#0d1117';
  ctx.fill();
  ctx.strokeStyle = 'rgba(255,216,77,0.5)';
  ctx.lineWidth = 2.4 * s;
  ctx.stroke();

  const icx = cx - pw / 2 + 62 * s;
  const icy = cy - 14 * s;
  ctx.fillStyle = '#e6edf3';
  ctx.beginPath();
  ctx.arc(icx, icy, 23 * s, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#0d1117';
  ctx.font = FONT('Black', 20 * s);
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('GH', icx, icy + 1 * s);
  ctx.textAlign = 'left';
  ctx.fillStyle = '#ffffff';
  ctx.font = FONT('Black', 50 * s);
  ctx.fillText(repo, icx + 44 * s, cy - 26 * s);
  ctx.fillStyle = '#8b949e';
  ctx.font = FONT('Medium', 27 * s);
  ctx.fillText(url, icx + 44 * s, cy + 28 * s);
  ctx.restore();

  ctx.save();
  ctx.globalAlpha = p;
  ctx.fillStyle = OK;
  ctx.font = FONT('Black', 58 * s);
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText((beat.caption || 'NOS COMENTARIOS').toUpperCase(), cx, cy + ph / 2 + 104 * s);
  ctx.fillStyle = 'rgba(255,216,77,0.35)';
  ctx.fillRect(cx - 100 * s, cy + ph / 2 + 156 * s, 200 * s, 3 * s);
  ctx.textAlign = 'left';
  ctx.restore();
}

function desenhar(t) {
  const b = beatAt(t);
  if (b.type === 'endcard') {
    fecho(b, t);
    graoEVinheta(t);
    return;
  }
  const zoom = (DERIVA * t) / Math.max(TOTAL, 0.001);
  fundo(t);
  janela(t, scrollEm(t), zoom);
  // scrim ANTES das caixas? não: caixas ficam no conteúdo, scrim cobre a base
  // o traço desenha UMA vez, na entrada da caixa; se o beat anterior já apontava
  // para a mesma caixa, o contorno fica completo — não refaz o círculo a cada fala.
  // Caixa nova desenha no fim do rolamento (a câmera chega e o traço completa).
  const rolo = roloDoBeat[indice(b)];
  const repete = mesmaCaixa(b.boxes, beats[indice(b) - 1]?.boxes);
  const inicioCaixa = repete ? 0 : Math.max(b.start, rolo ? rolo.t1 - 0.1 : b.start);
  const prog = repete ? 1 : clamp01((t - inicioCaixa) / 0.24);
  caixas(b.boxes, scrollEm(t), repete ? 1 : clamp01(prog * 1.4), prog);
  scrim();
  legenda(b, t);
  graoEVinheta(t);
}

// ---------- saída ----------
const outPath = getArg('out') || cfg.out || 'reel-readme-scroll.mp4';

if (stills.length) {
  const base = outPath.replace(/\.mp4$/, '');
  for (const t of stills) {
    desenhar(t);
    const f = `${base}-t${String(t).replace('.', '_')}.png`;
    fs.writeFileSync(f, await canvas.encode('png'));
    console.log('still:', f);
  }
  process.exit(0);
}

function ffmpegBin() {
  if (process.env.FFMPEG) return process.env.FFMPEG;
  try {
    return require('ffmpeg-static');
  } catch {
    return 'ffmpeg';
  }
}

const ff = spawn(ffmpegBin(), [
  '-y', '-loglevel', 'error',
  '-f', 'rawvideo', '-pix_fmt', 'rgba', '-s', `${W}x${H}`, '-r', String(FPS), '-i', '-',
  '-c:v', 'libx264', '-preset', 'medium', '-crf', '18', '-pix_fmt', 'yuv420p',
  '-movflags', '+faststart', outPath,
], { stdio: ['pipe', 'inherit', 'inherit'] });

const totalFrames = Math.ceil(TOTAL * FPS);
const escrever = (buf) =>
  new Promise((res) => {
    if (ff.stdin.write(buf)) res();
    else ff.stdin.once('drain', res);
  });

for (let i = 0; i < totalFrames; i++) {
  desenhar(i / FPS);
  const { data } = ctx.getImageData(0, 0, W, H);
  await escrever(Buffer.from(data.buffer, data.byteOffset, data.byteLength));
  if (i % 90 === 0) process.stdout.write(`\r${i}/${totalFrames} quadros`);
}
ff.stdin.end();
await new Promise((res) => ff.on('close', res));
console.log(`\nok: ${outPath} (${TOTAL.toFixed(1)}s, ${totalFrames} quadros)`);
