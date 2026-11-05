// render-video.mjs — renderiza o vídeo de campanha (9:16) a partir de cenas.json + config.json
// Uso: node render-video.mjs [pasta-do-projeto] [--preview <segundo>]
// Schema completo em references/render-video.md
import { createCanvas, GlobalFonts, loadImage } from '@napi-rs/canvas';
import { spawnSync, spawn } from 'node:child_process';
import { writeFileSync, existsSync, mkdirSync, readFileSync } from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const ffmpegPath = require('ffmpeg-static');
const ffprobePath = require('ffprobe-static').path;

const ROOT = process.argv[2] && !process.argv[2].startsWith('--') ? process.argv[2] : '.';
const W = 1080, H = 1920, FPS = 30;

// ---------- config ----------
const cfg = existsSync(path.join(ROOT, 'config.json'))
  ? JSON.parse(readFileSync(path.join(ROOT, 'config.json'), 'utf8')) : {};
const SAIDA = cfg.saida || 'video-final.mp4';
const BADGE = cfg.badge || '';
const GAP = cfg.gap ?? 0.35, LEAD = cfg.lead ?? 0.3, TAIL = cfg.tail ?? 2.5;
const COR = {
  fundo: '#0053A0', escuro: '#002E6D', destaque: '#FFC800', branco: '#FFFFFF',
  verde: '#2FA84F', vermelho: '#E03A3E', card: '#0A3A6E', badgeBg: '#0B2A4A',
  apoio: '#9FB3C8', apoioClaro: '#C9D9EA', textoCard: '#002E6D', autor: '#5A6B7D',
  ...cfg.paleta,
};
const nomeCor = c => COR[c] || c || COR.branco;

// ---------- fontes ----------
const fontesDir = path.join(ROOT, cfg.fontesDir || 'fonts');
for (const [alias, file] of [
  ['MSB', 'Montserrat-Black.ttf'], ['MXB', 'Montserrat-ExtraBold.ttf'],
  ['MB', 'Montserrat-Bold.ttf'], ['MS', 'Montserrat-SemiBold.ttf'],
]) {
  const p = path.join(fontesDir, file);
  if (existsSync(p)) GlobalFonts.registerFromPath(p, alias);
  else console.log(`AVISO: fonte ausente ${p}`);
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
let t = 0; // tempo relativo da cena

function fitSize(text, fam, size, maxW, min = 30) {
  ctx.font = fontStr(fam, size);
  while (ctx.measureText(text).width > maxW && size > min) { size -= 2; ctx.font = fontStr(fam, size); }
  return size;
}
function txt(s, x, y, size, fam = '800', color = COR.branco, alpha = 1, scale = 1) {
  if (alpha <= 0.01 || scale <= 0.01) return;
  ctx.save();
  ctx.globalAlpha = alpha;
  ctx.translate(x, y);
  if (scale !== 1) ctx.scale(scale, scale);
  ctx.font = fontStr(fam, size);
  ctx.fillStyle = color;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.shadowColor = 'rgba(0,0,0,0.30)'; ctx.shadowBlur = size * 0.18; ctx.shadowOffsetY = size * 0.06;
  ctx.fillText(s, 0, 0);
  ctx.restore();
}
const pop = (t0, dur = 0.4) => easeOutBack((t - t0) / dur);
const rise = (t0, dur = 0.45) => (1 - easeOutCubic((t - t0) / dur)) * 80;
const fade = (t0, dur = 0.35) => easeOutCubic((t - t0) / dur);
function rr(x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}
function bg(cor) { ctx.fillStyle = cor; ctx.fillRect(0, 0, W, H); }
function stripe() {
  ctx.fillStyle = COR.destaque;
  ctx.beginPath(); ctx.moveTo(870, H); ctx.lineTo(W, 1400); ctx.lineTo(W, H); ctx.closePath(); ctx.fill();
}
function badge() {
  if (!BADGE) return;
  ctx.font = fontStr('600', 27);
  const w = ctx.measureText(BADGE).width + 80;
  ctx.fillStyle = COR.badgeBg;
  rr((W - w) / 2, 1748, w, 74, 37); ctx.fill();
  txt(BADGE, W / 2, 1786, 27, '600', '#D7E3F0');
}
function redLine(x, y, w) { ctx.fillStyle = COR.vermelho; ctx.fillRect(x, y, w, 8); }

// efeito carimbo: despenca acelerando, treme ao pousar, fica levemente rotacionada
function stamp(img, cx, cy, w, t0, rot, landDur = 0.18) {
  if (!img) return;
  const p = clamp01((t - t0) / landDur);
  if (p <= 0) return;
  const scale = 2.4 - 1.4 * easeInCubic(p);
  const a = clamp01(p * 2.5);
  const since = t - t0 - landDur;
  const shake = since > 0 ? Math.max(0, 1 - since / 0.2) : 0;
  const jx = (Math.random() - 0.5) * 12 * shake;
  const jy = (Math.random() - 0.5) * 12 * shake;
  const h = Math.round(w * img.height / img.width);
  ctx.save();
  ctx.globalAlpha = a;
  ctx.translate(cx + jx, cy + jy);
  ctx.rotate((rot || 0) * Math.PI / 180);
  ctx.scale(scale, scale);
  ctx.shadowColor = 'rgba(0,0,0,0.45)'; ctx.shadowBlur = 36; ctx.shadowOffsetY = 16;
  ctx.fillStyle = '#FFFFFF'; rr(-w / 2 - 10, -h / 2 - 10, w + 20, h + 20, 14); ctx.fill();
  ctx.shadowColor = 'transparent';
  ctx.drawImage(img, -w / 2, -h / 2, w, h);
  ctx.restore();
}

// ---------- carrega arte + imagens de carimbo ----------
let ARTE = null;
if (cfg.arte) { try { ARTE = await loadImage(path.join(ROOT, cfg.arte)); } catch { console.log('AVISO: arte não carregada', cfg.arte); } }
const cenas = JSON.parse(readFileSync(path.join(ROOT, 'cenas.json'), 'utf8'));
const imgCache = new Map();
async function carrega(p) {
  const full = path.join(ROOT, p);
  if (!imgCache.has(full)) { try { imgCache.set(full, await loadImage(full)); } catch { console.log('AVISO: imagem ausente', p); imgCache.set(full, null); } }
  return imgCache.get(full);
}
for (const cena of cenas) for (const c of cena.carimbos || []) await carrega(c.imagem);

// ---------- renderizadores por tipo de cena ----------
function cenatitulo(c, D) {
  bg(c.fundo === 'escuro' ? COR.escuro : COR.fundo); stripe();
  if (c.heroi) txt(c.heroi.texto, W / 2, 480 + rise(c.heroi.t0 * D), fitSize(c.heroi.texto, '900', 96, W - 120), '900', nomeCor(c.heroi.cor), fade(c.heroi.t0 * D), pop(c.heroi.t0 * D));
  (c.linhas || []).forEach((L, i) => {
    const t0 = L.t0 * D;
    txt(L.texto, W / 2, 700 + i * 200 + rise(t0), fitSize(L.texto, '800', 84, W - 100), '800', nomeCor(L.cor), fade(t0), pop(t0));
  });
  if (c.pergunta) {
    const p = fade(c.pergunta.t0 * D);
    (c.linhas || []).forEach((L, i) => txt(L.texto, W / 2, 700 + i * 200, fitSize(L.texto, '800', 84, W - 100), '800', nomeCor(L.cor), 1 - p));
    const pulse = 1 + 0.02 * Math.sin(t * 6) * p;
    txt(c.pergunta.texto, W / 2, 1160, fitSize(c.pergunta.texto, '900', 130, W - 90), '900', nomeCor(c.pergunta.cor), p, pop(c.pergunta.t0 * D) * pulse);
  }
  badge();
}

function cenalista(c, D) {
  bg(c.fundo === 'escuro' ? COR.escuro : COR.fundo); stripe();
  txt(c.cabecalho, W / 2, 220 + rise(0.3), fitSize(c.cabecalho, '800', 62, W - 90), '800', COR.branco, fade(0.3), pop(0.3));
  const p0 = c.remate ? fade(c.remate.t0 * D) : 0;
  (c.itens || []).forEach((s, i) => {
    const t0 = 0.05 * D + i * 0.07 * D, y = 400 + i * 150;
    const a = fade(t0) * (1 - p0), sc = pop(t0);
    ctx.save(); ctx.globalAlpha = a;
    ctx.fillStyle = COR.card; rr(140, y - 56 + rise(t0), W - 280, 112, 56); ctx.fill();
    ctx.restore();
    txt(s, W / 2, y + rise(t0), fitSize(s, '700', 50, W - 380), '700', COR.branco, a, sc);
  });
  if (c.remate) {
    const e = fade(c.remate.t0 * D, 0.45);
    txt(c.remate.texto, W / 2, 620 - rise(c.remate.t0 * D), fitSize(c.remate.texto, '900', 100, W - 110), '900', nomeCor(c.remate.cor), e, pop(c.remate.t0 * D, 0.45));
  }
  if (c.final) txt(c.final.texto, W / 2, 1170, fitSize(c.final.texto, '800', 58, W - 120), '800', COR.branco, fade(c.final.t0 * D, 0.45));
  (c.carimbos || []).forEach(cb => stamp(imgCache.get(path.join(ROOT, cb.imagem)) || imgCache.get(cb.imagem), cb.x, cb.y, cb.largura, cb.t0 * D, cb.rotacao));
  badge();
}

function cenachecklist(c, D) {
  bg(c.fundo === 'escuro' ? COR.escuro : COR.fundo); stripe();
  txt(c.cabecalho, W / 2, 220 + rise(0.3), fitSize(c.cabecalho, '800', 64, W - 90), '800', nomeCor(c.corCabecalho) || COR.destaque, fade(0.3), pop(0.3));
  (c.itens || []).forEach((s, i) => {
    const t0 = 0.06 * D + i * 0.1 * D, y = 430 + i * 165;
    const a = fade(t0), sc = pop(t0);
    ctx.save(); ctx.globalAlpha = a;
    ctx.fillStyle = COR.card; rr(120, y - 58 + rise(t0), W - 240, 116, 58); ctx.fill();
    ctx.fillStyle = COR.verde; ctx.beginPath(); ctx.arc(190, y + rise(t0), 30, 0, Math.PI * 2); ctx.fill();
    if (a > 0.5) {
      ctx.globalAlpha = Math.min(1, (a - 0.5) * 2);
      ctx.strokeStyle = COR.textoCard; ctx.lineWidth = 8; ctx.lineCap = 'round'; ctx.lineJoin = 'round';
      const yy = y + rise(t0);
      ctx.beginPath(); ctx.moveTo(177, yy - 1); ctx.lineTo(187, yy + 9); ctx.lineTo(204, yy - 11); ctx.stroke();
    }
    ctx.restore();
    txt(s, W / 2 + 40, y + rise(t0), fitSize(s, '700', 44, W - 460), '700', COR.branco, a, sc);
  });
  (c.linhasFinais || []).forEach((L, i) => {
    const t0 = L.t0 * D, y = 1545 + i * 105;
    txt(L.texto, W / 2, y + rise(t0), L.grande ? fitSize(L.texto, '900', 86, W - 220) : fitSize(L.texto, '800', 50, W - 120), L.grande ? '900' : '800', nomeCor(L.cor), fade(t0), pop(t0));
  });
  (c.carimbos || []).forEach(cb => stamp(imgCache.get(path.join(ROOT, cb.imagem)) || imgCache.get(cb.imagem), cb.x, cb.y, cb.largura, cb.t0 * D, cb.rotacao));
  badge();
}

function cenacontador(c, D) {
  bg(COR.escuro);
  (c.cabecalho || []).forEach((s, i) => txt(s, W / 2, 210 + i * 60 + rise(0.3), 46, '600', COR.apoioClaro, fade(0.3)));
  const c0 = 0.06 * D, cp = clamp01((t - c0) / 2.2);
  const n = Math.round((c.valor ?? 59) * easeOutCubic(cp));
  const shake = cp < 1 ? (Math.random() - 0.5) * 6 * (1 - cp) : 0;
  const ghost = cp < 1 ? 14 * (1 - cp) : 0;
  txt(c.rotulo || 'BRASIL', W / 2, 470 + rise(c0), 60, '800', COR.branco, fade(c0), pop(c0));
  const sv = String(n);
  if (ghost > 0) { txt(sv, W / 2 - ghost, 700, 300, '900', COR.destaque, 0.25); txt(sv, W / 2 + ghost, 700, 300, '900', COR.destaque, 0.25); }
  txt(sv, W / 2 + shake, 700, 300, '900', COR.destaque, fade(c0), pop(c0));
  if (c.sufixo) txt(c.sufixo, W / 2, 900, 70, '800', COR.branco, fade(c0 + 0.4), pop(c0 + 0.4));
  (c.itens || []).forEach((L, i) => {
    const t0 = L.t0 * D, y = 1090 + i * 110;
    txt(L.texto, W / 2, y + rise(t0), fitSize(L.texto, '700', 54, W - 200), '700', COR.apoioClaro, fade(t0), pop(t0));
  });
  (c.destaques || []).forEach((L, i) => {
    const t0 = L.t0 * D, y = 1370 + i * 80;
    txt(L.texto, W / 2, y + rise(t0), fitSize(L.texto, '800', 64, W - 110), '800', COR.destaque, fade(t0), pop(t0));
  });
  (c.carimbos || []).forEach(cb => stamp(imgCache.get(path.join(ROOT, cb.imagem)) || imgCache.get(cb.imagem), cb.x, cb.y, cb.largura, cb.t0 * D, cb.rotacao));
  badge();
}

function cenaempilhada(c, D) {
  bg(c.fundo === 'escuro' ? COR.escuro : COR.fundo);
  const endP = c.palavraFinal ? fade(c.palavraFinal.t0 * D, 0.4) : 0;
  let y = 240;
  (c.elementos || []).forEach(el => {
    const t0 = el.t0 * D, a = fade(t0) * (1 - endP);
    if (el.tipo === 'pill') {
      const fs = fitSize(el.texto, '900', 48, W - 260);
      ctx.font = fontStr('900', fs);
      const w = ctx.measureText(el.texto).width + 90;
      ctx.save(); ctx.globalAlpha = a;
      ctx.fillStyle = COR.destaque; rr((W - w) / 2, y - 52 + rise(t0), w, 104, 52); ctx.fill();
      ctx.restore();
      txt(el.texto, W / 2, y + rise(t0), fs, '900', COR.textoCard, a, pop(t0));
      y += 150;
    } else if (el.tipo === 'citacao') {
      ctx.save(); ctx.globalAlpha = a;
      ctx.shadowColor = 'rgba(0,0,0,0.3)'; ctx.shadowBlur = 24; ctx.shadowOffsetY = 10;
      ctx.fillStyle = '#FFFFFF'; rr(110, y + rise(t0), W - 220, 210, 36); ctx.fill();
      ctx.shadowColor = 'transparent';
      redLine(110, y + rise(t0), W - 220);
      ctx.restore();
      txt(el.texto, W / 2, y + 85 + rise(t0), fitSize(el.texto, '900', 62, W - 300), '900', COR.textoCard, a);
      if (el.autor) txt(el.autor, W / 2, y + 170 + rise(t0), 36, '600', COR.autor, a);
      y += 240;
    } else {
      txt(el.texto, W / 2, y + rise(t0), fitSize(el.texto, '800', 56, W - 110), '800', nomeCor(el.cor), a, pop(t0));
      y += 75;
    }
  });
  if (c.remate) {
    const t0 = c.remate.t0 * D;
    txt(c.remate.texto, W / 2, y + 60 + rise(t0), fitSize(c.remate.texto, '800', 54, W - 100), '800', nomeCor(c.remate.cor) || COR.destaque, fade(t0), pop(t0));
  }
  (c.carimbos || []).forEach(cb => stamp(imgCache.get(path.join(ROOT, cb.imagem)) || imgCache.get(cb.imagem), cb.x, cb.y, cb.largura, cb.t0 * D, cb.rotacao));
  if (c.palavraFinal) txt(c.palavraFinal.texto, W / 2, 1050, fitSize(c.palavraFinal.texto, '900', 240, W - 120), '900', COR.branco, endP, pop(c.palavraFinal.t0 * D, 0.45));
  badge();
}

function cenacampanha(c, D) {
  bg(COR.fundo); stripe();
  ctx.fillStyle = COR.verde;
  ctx.beginPath(); ctx.moveTo(W, 1620); ctx.lineTo(W, H); ctx.lineTo(700, H); ctx.closePath(); ctx.fill();
  (c.linhasTopo || []).forEach((L, i) => {
    const t0 = L.t0 * D;
    txt(L.texto, W / 2, 280 + i * 80 + rise(t0), fitSize(L.texto, '800', 64, W - 90), '800', COR.branco, fade(t0), pop(t0));
  });
  if (c.voto) {
    const t0 = c.voto.t0 * D;
    if (c.voto.legenda) txt(c.voto.legenda, W / 2, 520 + rise(t0), 40, '600', COR.branco, fade(t0), pop(t0));
    const pulse = 1 + 0.02 * Math.sin(t * 5);
    txt(String(c.voto.numero), W / 2, 760, 340, '900', COR.destaque, fade(t0, 0.5), pop(t0, 0.5) * pulse);
  }
  if (c.arte && ARTE) {
    const ap = clamp01((t - c.arte.t0 * D) / 0.55);
    const a = easeOutCubic(ap), off = (1 - a) * 300;
    if (a > 0.01) {
      const cw = 880, ch = Math.round(cw * ARTE.height / ARTE.width);
      const cx = (W - cw) / 2, cy = 990 + off;
      ctx.save(); ctx.globalAlpha = a;
      ctx.shadowColor = 'rgba(0,0,0,0.40)'; ctx.shadowBlur = 46; ctx.shadowOffsetY = 20;
      ctx.fillStyle = COR.badgeBg; rr(cx, cy, cw, ch, 32); ctx.fill();
      ctx.shadowColor = 'transparent';
      rr(cx, cy, cw, ch, 32); ctx.clip();
      ctx.drawImage(ARTE, cx, cy, cw, ch);
      ctx.restore();
      if (c.arte.legenda) txt(c.arte.legenda, W / 2, cy + ch + 62, fitSize(c.arte.legenda, '800', 46, W - 140), '800', COR.branco, a);
    }
  } else if (c.arte?.legenda) {
    const t0 = c.arte.t0 * D;
    txt(c.arte.legenda, W / 2, 1180 + rise(t0), fitSize(c.arte.legenda, '800', 60, W - 90), '800', COR.branco, fade(t0), pop(t0));
  }
  if (c.pill) {
    const pl = fade(c.pill.t0 * D, 0.4);
    const fs = fitSize(c.pill.texto, '900', 54, W - 200);
    ctx.font = fontStr('900', fs);
    const w = ctx.measureText(c.pill.texto).width + 110;
    ctx.save(); ctx.globalAlpha = pl;
    ctx.fillStyle = COR.destaque; rr((W - w) / 2, 1650 - rise(c.pill.t0 * D), w, 106, 53); ctx.fill();
    ctx.restore();
    txt(c.pill.texto, W / 2, 1703 - rise(c.pill.t0 * D), fs, '900', COR.textoCard, pl, pop(c.pill.t0 * D, 0.4));
  }
}

const RENDER = { titulo: cenatitulo, lista: cenalista, checklist: cenachecklist, contador: cenacontador, empilhada: cenaempilhada, campanha: cenacampanha };

// ---------- timeline ----------
function dur(arq) {
  const r = spawnSync(ffprobePath, ['-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', path.join(ROOT, arq)]);
  return parseFloat(r.stdout.toString().trim());
}
const durs = cenas.map(c => dur(c.audio));
let tc = LEAD;
const segs = durs.map(d => { const s = { start: tc, dur: d }; tc += d + GAP; return s; });
const TOTAL = tc - GAP + TAIL;

// carimbos e tempos globais de pouso (para o som)
const todosCarimbos = [];
cenas.forEach((c, i) => (c.carimbos || []).forEach(cb => todosCarimbos.push({ ...cb, global: segs[i].start + cb.t0 * durs[i] + 0.16 })));

// ---------- preview ----------
const pi = process.argv.indexOf('--preview');
if (pi > -1) {
  const time = parseFloat(process.argv[pi + 1]);
  const i = segs.findIndex(s => time >= s.start && time < s.start + s.dur);
  const si = i === -1 ? cenas.length - 1 : i;
  t = time - segs[si].start;
  RENDER[cenas[si].tipo](cenas[si], segs[si].dur);
  writeFileSync(path.join(ROOT, 'preview.png'), canvas.toBuffer('image/png'));
  console.log(`preview.png @ ${time}s (cena ${si + 1}, tipo ${cenas[si].tipo})`);
  process.exit(0);
}

// ---------- render completo ----------
console.log(`Timeline: ${segs.map((s, i) => `cena${i + 1}(${cenas[i].tipo})@${s.start.toFixed(1)}`).join(' ')} | total ${TOTAL.toFixed(1)}s | carimbos: ${todosCarimbos.length}`);
const frames = Math.ceil(TOTAL * FPS);

const args = ['-y', '-f', 'rawvideo', '-pix_fmt', 'rgba', '-s', `${W}x${H}`, '-r', String(FPS), '-i', 'pipe:0'];
cenas.forEach(c => args.push('-i', path.join(ROOT, c.audio)));
args.push('-f', 'lavfi', '-t', String(LEAD), '-i', 'anullsrc=r=44100:cl=mono');
for (let i = 0; i < cenas.length - 1; i++) args.push('-f', 'lavfi', '-t', String(GAP), '-i', 'anullsrc=r=44100:cl=mono');
args.push('-f', 'lavfi', '-t', String(TAIL), '-i', 'anullsrc=r=44100:cl=mono');
const somCarimbo = cfg.somCarimbo && existsSync(path.join(ROOT, cfg.somCarimbo)) ? path.join(ROOT, cfg.somCarimbo) : null;
if (somCarimbo && todosCarimbos.length) todosCarimbos.forEach(() => args.push('-i', somCarimbo));

const AF = (idx) => `[${idx}:a]aformat=sample_rates=44100:channel_layouts=mono[a${idx}]`;
let graph = cenas.map((_, i) => AF(i + 1)).join(';');
let nSil = cenas.length + 1; // lead + gaps + tail
for (let i = 0; i < nSil; i++) {
  const idx = 1 + cenas.length + i;
  graph += `;[${idx}:a]aformat=sample_rates=44100:channel_layouts=mono[s${i}]`;
}
// concat: sil(lead) a1 sil(gap) a2 ... aN sil(tail)
const ordem = ['s0'];
cenas.forEach((_, i) => { ordem.push(`a${i + 1}`); ordem.push(i < cenas.length - 1 ? `s${i + 1}` : `s${cenas.length}`); });
graph += `;${ordem.map(o => `[${o}]`).join('')}concat=n=${nSil + cenas.length}:v=0:a=1[aout]`;
let mapa = '[aout]';
if (somCarimbo && todosCarimbos.length) {
  const base = 1 + cenas.length + nSil;
  graph += ';' + todosCarimbos.map((cb, i) => {
    const ms = Math.max(0, Math.round(cb.global * 1000));
    return `[${base + i}:a]adelay=${ms}:all=1,volume=2.0[st${i}]`;
  }).join(';');
  graph += `;[aout]${todosCarimbos.map((_, i) => `[st${i}]`).join('')}amix=inputs=${todosCarimbos.length + 1}:duration=first:normalize=0[mix]`;
  mapa = '[mix]';
}

args.push('-filter_complex', graph, '-map', '0:v', '-map', mapa,
  '-c:v', 'libx264', '-preset', 'veryfast', '-crf', '20', '-pix_fmt', 'yuv420p',
  '-c:a', 'aac', '-b:a', '160k', '-movflags', '+faststart', path.join(ROOT, SAIDA));

mkdirSync(ROOT, { recursive: true });
const ff = spawn(ffmpegPath, args, { stdio: ['pipe', 'ignore', 'pipe'] });
let errTail = [], ffDead = false;
ff.stderr.on('data', d => {
  errTail.push(d.toString()); if (errTail.length > 40) errTail.shift();
  const m = d.toString().match(/frame=\s*(\d+)/);
  if (m && (+m[1]) % 300 < FPS) process.stdout.write(`frame ${m[1]}/${frames}\n`);
});
ff.stdin.on('error', () => { ffDead = true; });
ff.on('close', code => {
  if (code !== 0) { ffDead = true; console.log('FFMPEG FALHOU (código ' + code + '). Últimas linhas do stderr:'); console.log(errTail.join('')); }
});
ff.on('error', e => { console.error('ffmpeg erro:', e); process.exit(1); });

const t0 = Date.now();
for (let f = 0; f < frames; f++) {
  const time = f / FPS;
  const si = segs.findIndex(s => time >= s.start && time < s.start + s.dur);
  const i = si === -1 ? cenas.length - 1 : si;
  t = time - segs[i].start;
  RENDER[cenas[i].tipo](cenas[i], segs[i].dur);
  const img = ctx.getImageData(0, 0, W, H);
  const buf = Buffer.from(img.data.buffer, img.data.byteOffset, img.data.byteLength);
  if (ffDead) { console.log(`ffmpeg morreu antes do frame ${f}; abortando.`); break; }
  if (!ff.stdin.write(buf)) await new Promise(r => ff.stdin.once('drain', r));
  if (f % 300 === 0) console.log(`frame ${f}/${frames} (${((Date.now() - t0) / 1000).toFixed(0)}s)`);
}
ff.stdin.end();
await new Promise(r => ff.on('close', r));
console.log(`\nCONCLUÍDO: ${SAIDA} (${((Date.now() - t0) / 1000).toFixed(0)}s de render)`);
