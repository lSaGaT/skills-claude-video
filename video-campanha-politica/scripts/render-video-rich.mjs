// render-flavio.mjs — renderiza o vídeo de ataque do Flávio (9:16) a partir de cenas.json
// Arquitetura em SEGMENTOS: cenas canvas (foto/contador/reportagem/checklist/campanha) via pipe RGBA;
// clipes via ffmpeg (escala 9:16 + overlay); áudio mestre montado por offsets; concat final.
// Uso: node render-flavio.mjs [--preview <segundo>]
import { createCanvas, GlobalFonts, loadImage } from '@napi-rs/canvas';
import { spawnSync, spawn } from 'node:child_process';
import { writeFileSync, existsSync, mkdirSync, readFileSync, rmSync } from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';

const DIR = path.dirname(fileURLToPath(import.meta.url));
process.chdir(DIR);
const W = 1080, H = 1920, FPS = 30;

// ---------- config ----------
const cfg = JSON.parse(readFileSync('cenas.json', 'utf8'));
const cenas = cfg.cenas;
const LEAD = cfg.lead ?? 0.5, GAP = cfg.gap ?? 0.15, TAIL = cfg.tail ?? 2.0;
const SAIDA = cfg.saida || '../video-flavio-ataque.mp4';
const FF = path.resolve(cfg.ffmpeg), FFP = path.resolve(cfg.ffprobe);
const COR = {
  fundo: '#0053A0', escuro: '#071B33', destaque: '#FFC800', branco: '#FFFFFF',
  verde: '#3DDC6A', vermelho: '#FF5A5E', card: '#0A3A6E',
  apoio: '#9FB3C8', apoioClaro: '#C9D9EA', textoCard: '#101820',
};
const nomeCor = c => COR[c] || c || COR.branco;

// ---------- fontes ----------
for (const [alias, file] of [
  ['MSB', 'Montserrat-Black.ttf'], ['MXB', 'Montserrat-ExtraBold.ttf'],
  ['MB', 'Montserrat-Bold.ttf'], ['MS', 'Montserrat-SemiBold.ttf'],
]) {
  const p = path.join(cfg.fontesDir, file);
  if (existsSync(p)) GlobalFonts.registerFromPath(p, alias);
  else console.log('AVISO: fonte ausente', p);
}
const FAM = { '900': 'MSB', '800': 'MXB', '700': 'MB', '600': 'MS' };
const fontStr = (w, size) => `${w} ${size}px ${FAM[w] || 'MS'}`;

// ---------- canvas e helpers ----------
const canvas = createCanvas(W, H);
const ctx = canvas.getContext('2d');
const clamp01 = v => Math.max(0, Math.min(1, v));
const easeOutBack = p => { p = clamp01(p); const c = 1.70158; return 1 + (c + 1) * Math.pow(p - 1, 3) + c * Math.pow(p - 1, 2); };
const easeOutCubic = p => 1 - Math.pow(1 - clamp01(p), 3);
const easeInCubic = p => { p = clamp01(p); return p * p * p; };
let t = 0;

function fitSize(text, fam, size, maxW, min = 24) {
  ctx.font = fontStr(fam, size);
  while (ctx.measureText(text).width > maxW && size > min) { size -= 2; ctx.font = fontStr(fam, size); }
  return size;
}
function txt(s, x, y, size, fam = '800', color = COR.branco, alpha = 1, scale = 1) {
  if (alpha <= 0.01 || scale <= 0.01) return;
  ctx.save(); ctx.globalAlpha = alpha; ctx.translate(x, y);
  if (scale !== 1) ctx.scale(scale, scale);
  ctx.font = fontStr(fam, size); ctx.fillStyle = color;
  ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  ctx.shadowColor = 'rgba(0,0,0,0.45)'; ctx.shadowBlur = size * 0.22; ctx.shadowOffsetY = size * 0.05;
  ctx.fillText(s, 0, 0); ctx.restore();
}
const pop = (t0, dur = 0.4) => easeOutBack((t - t0) / dur);
const rise = (t0, dur = 0.45) => (1 - easeOutCubic((t - t0) / dur)) * 70;
const fade = (t0, dur = 0.35) => easeOutCubic((t - t0) / dur);
function rr(x, y, w, h, r) {
  ctx.beginPath(); ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r); ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r); ctx.arcTo(x, y, x + w, y, r); ctx.closePath();
}
function pill(texto, cx, cy, size, opts = {}) {
  const fs = fitSize(texto, opts.fam || '800', size, (opts.maxW || W - 160));
  ctx.font = fontStr(opts.fam || '800', fs);
  const w = ctx.measureText(texto).width + (opts.padX ?? 56), h = fs + (opts.padY ?? 40);
  ctx.save(); ctx.globalAlpha = opts.alpha ?? 1;
  ctx.shadowColor = 'rgba(0,0,0,0.4)'; ctx.shadowBlur = 22; ctx.shadowOffsetY = 8;
  ctx.fillStyle = opts.bg || COR.destaque; rr(cx - w / 2, cy - h / 2, w, h, h / 2); ctx.fill();
  ctx.shadowColor = 'transparent';
  ctx.fillStyle = opts.cor || '#101820'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  ctx.fillText(texto, cx, cy + 2); ctx.restore();
}
function drawCheck(x, y, r, alpha) {
  ctx.save(); ctx.globalAlpha = alpha;
  ctx.strokeStyle = COR.textoCard; ctx.lineWidth = r * 0.42; ctx.lineCap = 'round'; ctx.lineJoin = 'round';
  ctx.beginPath(); ctx.moveTo(x - r * 0.55, y); ctx.lineTo(x - r * 0.12, y + r * 0.45); ctx.lineTo(x + r * 0.62, y - r * 0.42); ctx.stroke();
  ctx.restore();
}
// tom, grão, vinheta
let tomOK = true;
function tom(tipo) {
  if (!tipo || !tomOK) return;
  ctx.save();
  if (tipo === 'frio') {
    try {
      ctx.globalCompositeOperation = 'saturation'; ctx.globalAlpha = 0.42;
      ctx.fillStyle = 'hsl(0,0%,50%)'; ctx.fillRect(0, 0, W, H);
      ctx.globalAlpha = 0.15; ctx.globalCompositeOperation = 'overlay';
      ctx.fillStyle = 'rgb(70,110,190)'; ctx.fillRect(0, 0, W, H);
    } catch { tomOK = false; }
  } else {
    ctx.globalCompositeOperation = 'overlay'; ctx.globalAlpha = 0.13;
    ctx.fillStyle = 'rgb(255,150,30)'; ctx.fillRect(0, 0, W, H);
  }
  ctx.restore();
}
const ruídos = [];
for (let n = 0; n < 3; n++) {
  const c = createCanvas(270, 480), x = c.getContext('2d');
  const id = x.createImageData(270, 480);
  for (let i = 0; i < id.data.length; i += 4) {
    const v = 90 + Math.random() * 110;
    id.data[i] = id.data[i + 1] = id.data[i + 2] = v; id.data[i + 3] = 255;
  }
  x.putImageData(id, 0, 0); ruídos.push(c);
}
function grão() {
  ctx.save(); ctx.globalAlpha = 0.05; ctx.globalCompositeOperation = 'overlay';
  ctx.drawImage(ruídos[Math.floor(t * 24) % 3], 0, 0, W, H); ctx.restore();
}
let vinhetaCache = null;
function vinheta() {
  if (!vinhetaCache) {
    vinhetaCache = ctx.createRadialGradient(W / 2, H / 2, H * 0.35, W / 2, H / 2, H * 0.72);
    vinhetaCache.addColorStop(0, 'rgba(0,0,0,0)'); vinhetaCache.addColorStop(1, 'rgba(0,0,0,0.42)');
  }
  ctx.fillStyle = vinhetaCache; ctx.fillRect(0, 0, W, H);
}
function gradienteEscuro() {
  const g = ctx.createLinearGradient(0, 0, 0, H);
  g.addColorStop(0, 'rgba(2,10,24,0.30)'); g.addColorStop(0.45, 'rgba(2,10,24,0.42)'); g.addColorStop(1, 'rgba(2,10,24,0.86)');
  ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
}
function kenburns(img, extra = 0.06) {
  const s = 1.04 + extra * clamp01(t / 8);
  const iw = img.width, ih = img.height;
  const cover = Math.max(W / iw, H / ih) * s;
  const dw = iw * cover, dh = ih * cover;
  ctx.drawImage(img, (W - dw) / 2, (H - dh) / 2, dw, dh);
}
function fundoGradiente() {
  const g = ctx.createLinearGradient(0, 0, 0, H);
  g.addColorStop(0, '#0A2A4E'); g.addColorStop(0.5, '#071B33'); g.addColorStop(1, '#04101F');
  ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
  ctx.save(); ctx.globalAlpha = 0.10; ctx.fillStyle = COR.destaque;
  ctx.beginPath(); ctx.moveTo(W * 0.55, 0); ctx.lineTo(W, 0); ctx.lineTo(W * 0.25, H); ctx.lineTo(0, H); ctx.closePath(); ctx.fill();
  ctx.restore();
}
// flash + shake dos pousos de carimbo
let pousos = []; // {t}
function efeitoPouso() {
  for (const p of pousos) {
    const d = t - p.t;
    if (d >= 0 && d < 0.07) { ctx.fillStyle = `rgba(255,255,255,${0.5 * (1 - d / 0.07)})`; ctx.fillRect(0, 0, W, H); }
  }
}
function shakeAtual() {
  for (const p of pousos) {
    const d = t - p.t;
    if (d >= 0 && d < 0.14) return Math.max(0, 1 - d / 0.14) * 7;
  }
  return 0;
}
// carimbo (documento que despenca)
function stamp(img, cx, cy, w, t0, rot) {
  if (!img) return;
  const p = clamp01((t - t0) / 0.18);
  if (p <= 0) return;
  const scale = 2.2 - 1.2 * easeInCubic(p);
  const a = clamp01(p * 2.5);
  const since = t - t0 - 0.18;
  const shk = since > 0 ? Math.max(0, 1 - since / 0.2) : 0;
  const h = Math.round(w * img.height / img.width);
  ctx.save(); ctx.globalAlpha = a;
  ctx.translate(cx + (Math.random() - 0.5) * 14 * shk, cy + (Math.random() - 0.5) * 14 * shk);
  ctx.rotate((rot || 0) * Math.PI / 180); ctx.scale(scale, scale);
  ctx.shadowColor = 'rgba(0,0,0,0.5)'; ctx.shadowBlur = 34; ctx.shadowOffsetY = 14;
  ctx.fillStyle = '#FFFFFF'; rr(-w / 2 - 8, -h / 2 - 8, w + 16, h + 16, 12); ctx.fill();
  ctx.shadowColor = 'transparent';
  ctx.drawImage(img, -w / 2, -h / 2, w, h); ctx.restore();
}

// ---------- durações ----------
function dur(arq) {
  const r = spawnSync(FFP, ['-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', arq]);
  return parseFloat(r.stdout.toString().trim());
}

// ---------- timeline de PARTES ----------
const parts = [];
pousos = [];
const sfx = []; // {t (global), vol}
let cursor = LEAD;
for (const sc of cenas) {
  const narrDur = dur(sc.audio);
  const sceneStart = cursor;
  sc._narrDur = narrDur; sc._start = sceneStart;
  const mapa = [
    ['foto', drawFoto], ['contador', drawContador], ['reportagem', drawReportagem],
    ['checklist', drawChecklist], ['campanha', drawCampanha],
  ];
  const ehCanvas = mapa.map(m => m[0]).includes(sc.tipo);
  if (ehCanvas) {
    const d = narrDur + (sc.hold ?? 1.0);
    parts.push({ kind: 'canvas', scene: sc, dur: d + GAP, draw: mapa.find(m => m[0] === sc.tipo)[1] });
    // sfx
    if (sc.tipo === 'reportagem') sc.cards.forEach((c, i) => sfx.push({ t: sceneStart + c.t0 + 0.16, vol: 2.0 }));
    if (sc.tipo === 'contador') sfx.push({ t: sceneStart + 2.7, vol: 2.0 });
    if (sc.tipo === 'checklist') {
      sc.itens.forEach((_, i) => sfx.push({ t: sceneStart + 0.7 + i * 0.9, vol: 1.6 }));
      (sc.carimbos || []).forEach(cb => sfx.push({ t: sceneStart + (cb.t0 ?? 1.5) + 0.16, vol: 2.0 }));
    }
    if (sc.tipo === 'campanha') sfx.push({ t: sceneStart + (sc.voto?.t0 ?? 1) + 0.3, vol: 2.0 });
    pousosReportagem(sc, sceneStart);
    cursor += d + GAP;
    parts[parts.length - 1].audio = { tipo: 'narr', arquivo: sc.audio, at: sceneStart, vol: 1.0 };
  } else if (sc.tipo === 'clipe') {
    const c0 = sc.clipes[0];
    const d = c0.t + (sc.hold ?? 0.8);
    parts.push({ kind: 'clip', scene: sc, clip: c0, dur: d + GAP, pad: (sc.hold ?? 0.8) + GAP });
    sfx.push({ t: sceneStart, vol: 1.5 });
    cursor += d + GAP;
    parts[parts.length - 1].audio = [
      { tipo: 'clip', arquivo: c0.arquivo, ss: c0.ss, t: c0.t, at: sceneStart, vol: sc.duck ? 0.25 : 1.0 },
      ...(sc.duck ? [{ tipo: 'narr', arquivo: sc.audio, at: sceneStart, vol: 1.0 }] : []),
    ];
  } else if (sc.tipo === 'falas') {
    const introDur = narrDur + 0.3;
    parts.push({ kind: 'canvas', scene: sc, dur: introDur, draw: drawIntro, intro: true });
    parts[parts.length - 1].audio = { tipo: 'narr', arquivo: sc.audio, at: sceneStart, vol: 1.0 };
    cursor += introDur;
    sc.clipes.forEach((c, i) => {
      const last = i === sc.clipes.length - 1;
      const d = c.t + (last ? 0.5 + GAP : 0);
      parts.push({ kind: 'clip', scene: sc, clip: c, dur: d, pad: last ? 0.5 + GAP : 0 });
      parts[parts.length - 1].audio = [{ tipo: 'clip', arquivo: c.arquivo, ss: c.ss, t: c.t, at: cursor, vol: 1.0 }];
      sfx.push({ t: cursor, vol: 1.5 });
      cursor += d;
    });
    cursor += GAP;
  }
}
const TOTAL = cursor + TAIL;
function pousosReportagem(sc, start) {
  (sc.cards || []).forEach(c => pousos.push({ t: start + c.t0 + 0.16 }));
  (sc.carimbos || []).forEach(c => pousos.push({ t: start + c.t0 + 0.16 }));
}
// pousos para falas/clipe (transição) também sacodem
parts.forEach(p => { if (p.kind === 'clip') pousos.push({ t: p.audio?.[0]?.at ?? 0 }); });

// ---------- assets ----------
mkdirSync('assets', { recursive: true });
mkdirSync('segs', { recursive: true });
const imgCache = new Map();
async function img(p) {
  const full = path.resolve(p);
  if (!imgCache.has(full)) {
    try { imgCache.set(full, await loadImage(full)); }
    catch { console.log('AVISO: imagem ausente', p); imgCache.set(full, null); }
  }
  return imgCache.get(full);
}
function makeBg(src, opts = {}) {
  const hash = crypto.createHash('md5').update(src + JSON.stringify(opts)).digest('hex').slice(0, 10);
  const out = `assets/bg-${hash}.jpg`;
  if (existsSync(out)) return out;
  const vf = `scale=${W}:${H}:force_original_aspect_ratio=increase,crop=${W}:${H},gblur=sigma=${opts.blur ?? 26},eq=brightness=-${opts.dark ?? 0.20}:saturation=${opts.sat ?? 0.95}`;
  const r = spawnSync(FF, ['-y', '-v', 'error', '-i', src, '-vf', vf, '-frames:v', '1', '-q:v', '4', out]);
  if (r.status !== 0) { console.log('AVISO: bg falhou para', src, r.stderr?.toString().slice(-300)); return null; }
  return out;
}
for (const sc of cenas) {
  if (sc.tipo === 'contador' || sc.tipo === 'campanha') sc._bg = await img(makeBg(sc.bg));
  if (sc.tipo === 'foto' && sc.bg) {
    const im = await img(sc.bg);
    if (!im || im.width / im.height >= 1) sc._bg = await img(makeBg(sc.bg, { blur: 30, dark: 0.28, sat: 0.9 }));
  }
  if (sc.tipo === 'falas') sc._introBg = await img(makeBg(sc.intro.bg, { blur: 18, dark: 0.30, sat: 0.35 }));
}
// overlays dos clipes (vinheta + legendas + chip) — PNG transparente
async function overlayPara(clip, tom) {
  const hash = crypto.createHash('md5').update(clip.arquivo + JSON.stringify(clip.legenda) + (clip.chip || '') + tom).digest('hex').slice(0, 10);
  const out = `assets/ov-${hash}.png`;
  if (existsSync(out)) return out;
  const c = createCanvas(W, H), x = c.getContext('2d');
  const g = x.createRadialGradient(W / 2, H / 2, H * 0.35, W / 2, H / 2, H * 0.75);
  g.addColorStop(0, 'rgba(0,0,0,0)'); g.addColorStop(1, 'rgba(0,0,0,0.5)');
  x.fillStyle = g; x.fillRect(0, 0, W, H);
  const gb = x.createLinearGradient(0, 0, 0, H);
  gb.addColorStop(0, 'rgba(0,0,0,0.55)'); gb.addColorStop(0.25, 'rgba(0,0,0,0)'); gb.addColorStop(0.8, 'rgba(0,0,0,0)'); gb.addColorStop(1, 'rgba(0,0,0,0.7)');
  x.fillStyle = gb; x.fillRect(0, 0, W, H);
  if (clip.legenda?.length) {
    let y = 330;
    clip.legenda.forEach(L => {
      const fs = fitSize(L, '900', 64, W - 140);
      x.font = fontStr('900', fs);
      const w = Math.min(W - 100, x.measureText(L).width + 70);
      x.save(); x.globalAlpha = 0.96;
      x.fillStyle = 'rgba(7,20,40,0.82)'; rr((W - w) / 2, y - fs / 2 - 18, w, fs + 36, 20); x.fill();
      x.strokeStyle = COR.destaque; x.lineWidth = 4; rr((W - w) / 2, y - fs / 2 - 18, w, fs + 36, 20); x.stroke();
      x.fillStyle = '#FFFFFF'; x.textAlign = 'center'; x.textBaseline = 'middle';
      x.fillText(L, W / 2, y + 2); x.restore();
      y += fs + 56;
    });
  }
  if (clip.chip) {
    x.font = fontStr('700', 34);
    const w = x.measureText(clip.chip).width + 70;
    x.fillStyle = 'rgba(7,20,40,0.88)'; rr((W - w) / 2, 1735, w, 66, 33); x.fill();
    x.fillStyle = COR.destaque; rr((W - w) / 2, 1735, w, 8, 4); x.fill();
    x.fillStyle = '#FFFFFF'; x.textAlign = 'center'; x.textBaseline = 'middle';
    x.fillText(clip.chip, W / 2, 1772);
  }
  writeFileSync(out, c.toBuffer('image/png'));
  return out;
}

// ---------- desenho das cenas canvas ----------
function drawFoto(sc, D) {
  if (sc._bg) ctx.drawImage(sc._bg, 0, 0, W, H);
  else if (sc.bg) { const im = imgCache.get(path.resolve(sc.bg)); if (im) kenburns(im, 0.05); }
  gradienteEscuro();
  if (sc.kicker) pill(sc.kicker, W / 2, 220 + rise(0.3), 40, { alpha: fade(0.3), bg: 'rgba(7,20,40,0.85)', cor: COR.destaque, maxW: W - 200 });
  (sc.linhas || []).forEach(L => {
    const t0 = L.t0 ?? 0.3;
    txt(L.texto, W / 2, L.y + rise(t0), fitSize(L.texto, '900', L.size, W - 110), '900', nomeCor(L.cor), fade(t0), pop(t0));
  });
  if (sc.arte) {
    const a = easeOutCubic(clamp01((t - sc.arte.t0) / 0.55));
    if (a > 0.01) {
      const im = imgCache.get(path.resolve(sc.arte.caminho));
      if (im) {
        const cw = 900, ch = Math.round(cw * im.height / im.width);
        const cx = (W - cw) / 2, cy = 660 + (1 - a) * 300;
        ctx.save(); ctx.globalAlpha = a;
        ctx.shadowColor = 'rgba(0,0,0,0.5)'; ctx.shadowBlur = 46; ctx.shadowOffsetY = 20;
        ctx.fillStyle = '#0B2A4A'; rr(cx, cy, cw, ch, 30); ctx.fill(); ctx.shadowColor = 'transparent';
        rr(cx, cy, cw, ch, 30); ctx.clip(); ctx.drawImage(im, cx, cy, cw, ch); ctx.restore();
      }
    }
  }
}
function drawContador(sc, D) {
  if (sc._bg) ctx.drawImage(sc._bg, 0, 0, W, H);
  gradienteEscuro();
  if (sc.kicker) pill(sc.kicker, W / 2, 155, 36, { alpha: fade(0.25), bg: 'rgba(7,20,40,0.85)', cor: COR.destaque, maxW: W - 160 });
  (sc.sub || []).forEach((s, i) => txt(s, W / 2, 270 + i * 70 + rise(0.3), fitSize(s, '700', 44, W - 160), '700', COR.apoioClaro, fade(0.3)));
  const cp = clamp01((t - 0.5) / 2.2);
  const n = Math.round((sc.de + (sc.para - sc.de) * easeOutCubic(cp)));
  const shk = cp < 1 ? (Math.random() - 0.5) * 6 * (1 - cp) : 0;
  txt(sc.rotulo || 'BRASIL', W / 2, 560 + rise(0.4), 66, '800', COR.branco, fade(0.4), pop(0.4));
  txt((sc.prefixo || '') + n, W / 2 + shk, 830, fitSize((sc.prefixo || '') + sc.para, '900', 280, W - 100), '900', COR.destaque, fade(0.5), pop(0.5));
  if (cp >= 1) txt('AUXÍLIO MAIS QUE TRIPLICADO', W / 2, 1120, 54, '900', COR.branco, fade(2.7, 0.4), pop(2.7, 0.4));
  if (sc.chip) pill(sc.chip, W / 2, 1700, 38, { alpha: fade(0.8), bg: 'rgba(7,20,40,0.85)', cor: COR.apoioClaro });
}
function drawReportagem(sc, D) {
  fundoGradiente();
  if (sc.kicker) pill(sc.kicker, W / 2, 210 + rise(0.25), 40, { alpha: fade(0.25), bg: 'rgba(7,20,40,0.85)', cor: COR.destaque, maxW: W - 200 });
  const cards = sc.cards || [];
  const n = cards.length;
  const cardW = n > 1 ? 930 : 1000;
  const RODAPE = 78;
  const GAPC = 95;
  let rawH = cards.map(c => {
    const im = imgCache.get(path.resolve(c.imagem));
    const ih = im ? cardW * im.height / im.width : 320;
    return ih + RODAPE;
  });
  const zonaTop = 320, zonaBottom = 1570, zonaH = zonaBottom - zonaTop;
  let totalH = rawH.reduce((a, b) => a + b, 0) + GAPC * (n - 1);
  const escala = totalH > zonaH ? zonaH / totalH : 1;
  const wE = cardW * escala, hE = rawH.map(h => h * escala), gapE = GAPC * escala;
  const blockH = totalH * escala;
  let y = zonaTop + (zonaH - blockH) / 2;
  cards.forEach((c, i) => {
    const im = imgCache.get(path.resolve(c.imagem));
    const t0 = c.t0 ?? 0.3;
    const p = clamp01((t - t0) / 0.18);
    if (p <= 0) { y += hE[i] + gapE; return; }
    const since = t - t0 - 0.18;
    const shk = since > 0 ? Math.max(0, 1 - since / 0.22) : 0;
    const pulse = 1 + 0.012 * Math.sin(t * 3 + i);
    const cw = wE * pulse, ch = hE[i] * pulse;
    const ih = (im ? cw * im.height / im.width : ch - RODAPE * escala * pulse);
    const cx = W / 2 + (Math.random() - 0.5) * 10 * shk, cy = y + (Math.random() - 0.5) * 10 * shk;
    ctx.save(); ctx.globalAlpha = clamp01(p * 2.2);
    ctx.translate(cx, cy); ctx.rotate((i % 2 ? 1.1 : -1.1) * Math.PI / 180);
    const sc2 = 1.9 - 0.9 * easeInCubic(p); ctx.scale(sc2, sc2);
    ctx.shadowColor = 'rgba(0,0,0,0.55)'; ctx.shadowBlur = 40; ctx.shadowOffsetY = 16;
    ctx.fillStyle = '#FFFFFF'; rr(-cw / 2 - 10, -ch / 2 - 10, cw + 20, ch + 20, 14); ctx.fill();
    ctx.shadowColor = 'transparent';
    ctx.fillStyle = COR.vermelho; ctx.fillRect(-cw / 2 - 10, -ch / 2 - 10, cw + 20, 10);
    const topo = -ch / 2;
    if (im) ctx.drawImage(im, -cw / 2, topo, cw, ih);
    const fy = topo + ih + (RODAPE * escala * pulse) / 2;
    ctx.font = fontStr('800', Math.min(30, cw * 0.034)); ctx.fillStyle = '#101820'; ctx.textAlign = 'left'; ctx.textBaseline = 'middle';
    ctx.fillText(c.fonte || '', -cw / 2 + 14, fy);
    ctx.textAlign = 'right'; ctx.fillStyle = '#5A6470'; ctx.fillText(c.data || '', cw / 2 - 14, fy);
    ctx.restore();
    y += hE[i] + gapE;
  });
  if (sc.destaque) {
    const t0 = sc.destaque.t0 ?? 1;
    const pulse = 1 + 0.02 * Math.sin(t * 5);
    txt(sc.destaque.texto, W / 2, 1660 + rise(t0) * 0.5, fitSize(sc.destaque.texto, '900', 96, W - 60), '900', nomeCor(sc.destaque.cor), fade(t0, 0.45), pop(t0, 0.45) * pulse);
  }
  efeitoPouso();
}
function drawChecklist(sc, D) {
  fundoGradiente();
  txt(sc.cabecalho, W / 2, 300 + rise(0.3), fitSize(sc.cabecalho, '900', 88, W - 140), '900', COR.destaque, fade(0.3), pop(0.3));
  (sc.itens || []).forEach((s, i) => {
    const t0 = 0.55 + i * 0.9, y = 560 + i * 190;
    const a = fade(t0), pc = pop(t0);
    ctx.save(); ctx.globalAlpha = a;
    ctx.fillStyle = 'rgba(255,255,255,0.97)'; rr(110, y - 62 + rise(t0), W - 220, 124, 62); ctx.fill();
    ctx.fillStyle = COR.verde; ctx.beginPath(); ctx.arc(185, y + rise(t0), 34, 0, Math.PI * 2); ctx.fill();
    if (a > 0.5) drawCheck(185, y + rise(t0), 34, Math.min(1, (a - 0.5) * 2));
    ctx.restore();
    const fs = fitSize(s, '800', 40, W - 400);
    txt(s, W / 2 + 40, y + rise(t0), fs, '800', COR.textoCard, a, pc);
  });
  // carimbos como cards centralizados (mesmo padrão das reportagens)
  const cbs = sc.carimbos || [];
  if (cbs.length) {
    const cw = 930, rodape = 20, gapC = 80;
    const zoneTop = 1070, zoneBottom = 1740, zoneH = zoneBottom - zoneTop;
    const rawH = cbs.map(cb => {
      const im = imgCache.get(path.resolve(cb.imagem));
      return (im ? cw * im.height / im.width : 180) + rodape;
    });
    const tot = rawH.reduce((a, b) => a + b, 0) + gapC * (cbs.length - 1);
    const esc = tot > zoneH ? zoneH / tot : 1;
    let cy = zoneTop + (zoneH - tot * esc) / 2;
    cbs.forEach((cb, i) => {
      const im = imgCache.get(path.resolve(cb.imagem));
      const t0 = cb.t0 ?? 1.5 + i * 1.2;
      const p = clamp01((t - t0) / 0.18);
      const ch = rawH[i] * esc, cwE = cw * esc;
      if (p > 0) {
        const since = t - t0 - 0.18;
        const shk = since > 0 ? Math.max(0, 1 - since / 0.22) : 0;
        const pulse = 1 + 0.012 * Math.sin(t * 3 + i);
        const w = cwE * pulse, h = ch * pulse;
        const cx = W / 2 + (Math.random() - 0.5) * 10 * shk, cyy = cy + (Math.random() - 0.5) * 10 * shk;
        ctx.save(); ctx.globalAlpha = clamp01(p * 2.2);
        ctx.translate(cx, cyy); ctx.rotate((i % 2 ? 1.1 : -1.1) * Math.PI / 180);
        const s2 = 1.9 - 0.9 * easeInCubic(p); ctx.scale(s2, s2);
        ctx.shadowColor = 'rgba(0,0,0,0.55)'; ctx.shadowBlur = 40; ctx.shadowOffsetY = 16;
        ctx.fillStyle = '#FFFFFF'; rr(-w / 2 - 10, -h / 2 - 10, w + 20, h + 20, 14); ctx.fill();
        ctx.shadowColor = 'transparent';
        ctx.fillStyle = COR.vermelho; ctx.fillRect(-w / 2 - 10, -h / 2 - 10, w + 20, 10);
        if (im) ctx.drawImage(im, -w / 2, -h / 2, w, h - rodape * esc);
        ctx.restore();
      }
      cy += ch + gapC;
    });
  }
  efeitoPouso();
}
function drawIntro(sc, D) {
  if (sc._introBg) ctx.drawImage(sc._introBg, 0, 0, W, H);
  else if (sc.intro?.bg) { const im = imgCache.get(path.resolve(sc.intro.bg)); if (im) kenburns(im, 0.04); }
  gradienteEscuro();
  (sc.intro?.linhas || []).forEach(L => {
    txt(L.texto, W / 2, L.y + rise(L.t0 ?? 0.3), fitSize(L.texto, '900', L.size, W - 100), '900', nomeCor(L.cor), fade(L.t0 ?? 0.3), pop(L.t0 ?? 0.3));
  });
}
function drawCampanha(sc, D) {
  if (sc._bg) ctx.drawImage(sc._bg, 0, 0, W, H);
  gradienteEscuro();
  (sc.linhasTopo || []).forEach((L, i) => {
    txt(L.texto, W / 2, 210 + i * 88 + rise(L.t0), fitSize(L.texto, '800', 56, W - 110), '800', COR.branco, fade(L.t0), pop(L.t0));
  });
  if (sc.voto) {
    const t0 = sc.voto.t0 ?? 1, pulse = 1 + 0.025 * Math.sin(t * 5);
    txt('VOTE', W / 2, 425 + rise(t0), 50, '800', COR.branco, fade(t0), pop(t0));
    txt(String(sc.voto.numero), W / 2, 640, 270, '900', COR.destaque, fade(t0, 0.5), pop(t0, 0.5) * pulse);
  }
  if (sc.arte) {
    const a = easeOutCubic(clamp01((t - sc.arte.t0) / 0.55));
    const im = imgCache.get(path.resolve(sc.arte.caminho));
    if (im && a > 0.01) {
      const cw = 880, ch = Math.round(cw * im.height / im.width);
      const cx = (W - cw) / 2, cy = 830 + (1 - a) * 300;
      ctx.save(); ctx.globalAlpha = a;
      ctx.shadowColor = 'rgba(0,0,0,0.5)'; ctx.shadowBlur = 46; ctx.shadowOffsetY = 20;
      ctx.fillStyle = '#0B2A4A'; rr(cx, cy, cw, ch, 30); ctx.fill(); ctx.shadowColor = 'transparent';
      rr(cx, cy, cw, ch, 30); ctx.clip(); ctx.drawImage(im, cx, cy, cw, ch); ctx.restore();
    }
  }
  if (sc.pill) {
    const t0 = sc.pill.t0 ?? 2;
    pill(sc.pill.texto, W / 2, 1740 - rise(t0), 52, { alpha: fade(t0, 0.45), bg: COR.destaque, cor: '#101820', fam: '900' });
  }
}

// ---------- pré-carga das imagens ----------
for (const sc of cenas) {
  if (sc.cards) for (const c of sc.cards) await img(c.imagem);
  if (sc.carimbos) for (const c of sc.carimbos) await img(c.imagem);
  if (sc.arte) await img(sc.arte.caminho);
  if (sc.tipo === 'foto' && sc.bg) await img(sc.bg);
}
for (const p of parts.filter(p => p.kind === 'clip')) {
  p.overlay = await overlayPara(p.clip, p.scene.tom);
}
pousos = pousos.filter(p => p.t > 0).sort((a, b) => a.t - b.t);
const sfxList = sfx.filter(s => s.t >= 0 && s.t < TOTAL).sort((a, b) => a.t - b.t);

console.log(`Timeline: ${cenas.length} cenas, ${parts.length} partes, ${sfxList.length} impactos, total ${TOTAL.toFixed(1)}s`);
const idxDe = (tempo) => {
  let acc = LEAD;
  for (let i = 0; i < parts.length; i++) { if (tempo < acc + parts[i].dur) return { i, t: tempo - acc }; acc += parts[i].dur; }
  return { i: parts.length - 1, t: parts[parts.length - 1].dur - 0.05 };
};

// ---------- preview ----------
const pi = process.argv.indexOf('--preview');
if (pi > -1) {
  const tempo = parseFloat(process.argv[pi + 1]);
  const { i, t: tl } = idxDe(tempo);
  const p = parts[i];
  if (p.kind === 'canvas') {
    t = tl;
    const base = tempo - tl;
    const salvos = pousos;
    pousos = pousos.filter(x => x.t >= base && x.t < base + p.dur).map(x => ({ t: x.t - base }));
    ctx.clearRect(0, 0, W, H);
    p.draw(p.scene, p.dur); tom(p.scene.tom); grão(); vinheta();
    writeFileSync('preview.png', canvas.toBuffer('image/png'));
    pousos = salvos;
    console.log(`preview.png @ ${tempo}s (parte ${i}, ${p.scene.id})`);
  } else {
    console.log(`parte ${i} é CLIPE (${p.scene.id}) — extraia com ffmpeg direto do corte.`);
  }
  process.exit(0);
}

// ---------- render das partes ----------
const t0ms = Date.now();
const segFiles = [];
for (let i = 0; i < parts.length; i++) {
  const p = parts[i];
  const seg = `segs/seg-${String(i).padStart(2, '0')}-${p.scene.id}.mp4`;
  segFiles.push(seg);
  if (p.kind === 'canvas') {
    const frames = Math.round(p.dur * FPS);
    const ff = spawn(FF, ['-y', '-v', 'error', '-f', 'rawvideo', '-pix_fmt', 'rgba', '-s', `${W}x${H}`, '-r', String(FPS), '-i', 'pipe:0',
      '-c:v', 'libx264', '-preset', 'veryfast', '-crf', '20', '-pix_fmt', 'yuv420p', '-r', String(FPS), seg], { stdio: ['pipe', 'ignore', 'pipe'] });
    let dead = false; ff.on('close', c => { if (c !== 0) dead = true; });
    ff.stderr.on('data', d => { if (String(d).includes('Error')) console.log('ffmpeg:', String(d).slice(0, 300)); });
    // pousos globais -> locais (preserva a lista global)
    const base = parts.slice(0, i).reduce((a, q) => a + q.dur, LEAD);
    const salvos = pousos;
    pousos = salvos.filter(x => x.t >= base && x.t < base + p.dur).map(x => ({ t: x.t - base }));
    for (let f = 0; f < frames; f++) {
      t = f / FPS;
      ctx.clearRect(0, 0, W, H);
      const shk = shakeAtual();
      ctx.save();
      if (shk > 0) ctx.translate((Math.random() - 0.5) * shk, (Math.random() - 0.5) * shk);
      p.draw(p.scene, p.dur);
      ctx.restore();
      tom(p.scene.tom); grão(); vinheta();
      const imD = ctx.getImageData(0, 0, W, H);
      const buf = Buffer.from(imD.data.buffer, imD.data.byteOffset, imD.data.byteLength);
      if (dead) { console.log(`ffmpeg morreu na parte ${i}`); process.exit(1); }
      if (!ff.stdin.write(buf)) await new Promise(r => ff.stdin.once('drain', r));
    }
    pousos = salvos;
    ff.stdin.end();
    await new Promise(r => ff.on('close', r));
    console.log(`parte ${i + 1}/${parts.length} canvas OK (${p.scene.id}, ${p.dur.toFixed(1)}s)`);
  } else {
    const c = p.clip;
    const eqTom = p.scene.tom === 'frio' ? ',eq=saturation=0.72:brightness=-0.04,colorbalance=bs=0.10:bm=0.04' : (p.scene.tom === 'quente' ? ',eq=saturation=1.06,colorbalance=rs=0.07:rm=0.03' : '');
    const cf = (c.cropF ?? 0.5).toFixed(3);
    const fc = `[0:v]scale=${W}:${H}:force_original_aspect_ratio=increase,crop=${W}:${H}:(iw-${W})*${cf}:(ih-${H})/2,fps=${FPS},setsar=1${eqTom}` +
      (p.pad > 0 ? `,tpad=stop_mode=clone:stop_duration=${p.pad.toFixed(3)}` : '') + `[v];[v][1:v]overlay=0:0,format=yuv420p[out]`;
    const r = spawnSync(FF, ['-y', '-v', 'error', '-ss', String(c.ss), '-t', String(c.t), '-i', c.arquivo, '-i', p.overlay,
      '-filter_complex', fc, '-map', '[out]', '-an', '-c:v', 'libx264', '-preset', 'veryfast', '-crf', '20', '-r', String(FPS), seg]);
    if (r.status !== 0) { console.log(`FALHOU parte ${i} (${c.arquivo}):`, r.stderr?.toString().slice(-400)); process.exit(1); }
    console.log(`parte ${i + 1}/${parts.length} clipe OK (${p.scene.id}, ${p.dur.toFixed(1)}s)`);
  }
}

// ---------- áudio mestre ----------
const audioArgs = ['-y', '-v', 'error', '-f', 'lavfi', '-t', TOTAL.toFixed(3), '-i', 'anullsrc=r=44100:cl=stereo'];
const filtros = [], mixRefs = [];
let ai = 1;
for (const p of parts) {
  for (const a of [].concat(p.audio)) {
    if (a.tipo === 'narr') audioArgs.push('-i', a.arquivo);
    else audioArgs.push('-ss', String(a.ss), '-t', String(a.t), '-i', a.arquivo);
    filtros.push(`[${ai}:a]aformat=sample_rates=44100:channel_layouts=stereo,volume=${a.vol},adelay=${Math.round(a.at * 1000)}:all=1[p${ai}]`);
    mixRefs.push(`[p${ai}]`); ai++;
  }
}
if (sfxList.length && existsSync(cfg.somCarimbo)) {
  for (const s of sfxList) {
    audioArgs.push('-i', cfg.somCarimbo);
    filtros.push(`[${ai}:a]aformat=sample_rates=44100:channel_layouts=stereo,volume=${s.vol},adelay=${Math.round(s.t * 1000)}:all=1[p${ai}]`);
    mixRefs.push(`[p${ai}]`); ai++;
  }
}
filtros.push(`[0:a]anull[base]`);
mixRefs.unshift('[base]');
filtros.push(`${mixRefs.join('')}amix=inputs=${mixRefs.length}:duration=first:normalize=0[aout]`);
audioArgs.push('-filter_complex', filtros.join(';'), '-map', '[aout]', '-c:a', 'aac', '-b:a', '160k', 'audio/mestra.m4a');
mkdirSync('audio', { recursive: true });
{
  const r = spawnSync(FF, audioArgs);
  if (r.status !== 0) { console.log('FALHOU áudio mestre:', r.stderr?.toString().slice(-600)); process.exit(1); }
  console.log('áudio mestre OK');
}

// ---------- concat + mux ----------
writeFileSync('segs/lista.txt', segFiles.map(f => `file '${path.resolve(f).replace(/\\/g, '/').replace(/'/g, "'\\''")}'`).join('\n'));
{
  const r = spawnSync(FF, ['-y', '-v', 'error', '-f', 'concat', '-safe', '0', '-i', 'segs/lista.txt', '-c', 'copy', 'segs/concat.mp4']);
  if (r.status !== 0) { console.log('FALHOU concat:', r.stderr?.toString().slice(-600)); process.exit(1); }
  const r2 = spawnSync(FF, ['-y', '-v', 'error', '-i', 'segs/concat.mp4', '-i', 'audio/mestra.m4a', '-map', '0:v', '-map', '1:a', '-c', 'copy', '-movflags', '+faststart', SAIDA]);
  if (r2.status !== 0) { console.log('FALHOU mux:', r2.stderr?.toString().slice(-600)); process.exit(1); }
}
console.log(`\nCONCLUÍDO: ${SAIDA} (${((Date.now() - t0ms) / 1000).toFixed(0)}s de render, ${TOTAL.toFixed(1)}s de vídeo)`);
