// kit.mjs — primitivas e biblioteca de mockups do formato "meta-demo"
// Gramática: preto + dot grid + glow, tipografia cinética palavra-a-palavra,
// cursor com pílula de agente, janelas/softwares falsos desenhados em canvas.
// Todas as coordenadas são em "px de referência" (720x1280) e escaladas por S.

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { GlobalFonts } from "@napi-rs/canvas";

export const REF_W = 720, REF_H = 1280;
export const OUT_W = 1080, OUT_H = 1920;
export const S = OUT_W / REF_W; // 1.5
export const FPS = 30;

const HERE = path.dirname(fileURLToPath(import.meta.url));
export const FONTS_DIR = path.resolve(HERE, "../../assets/fonts");

let registered = false;
export function registerFonts(extra = []) {
  if (registered) return;
  const f = (name, file) => {
    const p = path.join(FONTS_DIR, file);
    if (fs.existsSync(p)) GlobalFonts.registerFromPath(p, name);
  };
  // display: Inter Display Black é o que casa com o reel de referência (desvio <7% de largura)
  f("AB", "InterDisplay-Black.ttf");
  f("DISPLAY", "InterDisplay-Black.ttf");
  f("ABold", "Inter-Black.ttf");
  f("ISI", "InstrumentSerif-Italic.ttf");
  f("ISR", "InstrumentSerif-Regular.ttf");
  f("Mono", "IBMPlexMono-Regular.ttf");
  f("MonoM", "IBMPlexMono-Medium.ttf");
  f("UI", "InterTight-var.ttf");
  // fonts/ da raiz do projeto: procura subindo a partir do cwd e do próprio kit
  const candidatos = [];
  let d = process.cwd();
  for (let i = 0; i < 6; i++) { candidatos.push(path.join(d, "fonts")); d = path.dirname(d); }
  const root = candidatos.find((p) => fs.existsSync(path.join(p, "Montserrat-Black.ttf"))) || candidatos[0];
  const g = (name, file) => {
    const p = path.join(root, file);
    if (fs.existsSync(p)) GlobalFonts.registerFromPath(p, name);
  };
  g("MSemi", "Montserrat-SemiBold.ttf");
  g("MB", "Montserrat-Bold.ttf");
  g("MXB", "Montserrat-ExtraBold.ttf");
  g("MK", "Montserrat-Black.ttf");
  for (const [n, file] of extra) f(n, file);
  registered = true;
}

// ---------------------------------------------------------------- cores
export const C = {
  bg: "#08080a",
  cream: "#eceade",
  cream2: "#e7e5d9",
  ink: "#141310",
  orange: "#f1561c",
  orange2: "#ee5b22",
  yellow: "#f5b626",
  white: "#f6f7f2",
  gray: "#6c6a70",
  gray2: "#9a979d",
  grayText: "#87837a",
  purple: "#7c5cf6",
  purpleDeep: "#6a49ec",
  purpleDark: "#221e39",
  teal: "#2dd4c0",
  blue: "#6190e0",
  blueDeep: "#2f4e9e",
  card: "#18171c",
  card2: "#1b1b20",
  line: "#2a2a30",
};

// ---------------------------------------------------------------- util
export const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
export const lerp = (a, b, t) => a + (b - a) * t;
export const seg = (t, a, b) => clamp((t - a) / (b - a), 0, 1);
export const easeOut = (t) => 1 - Math.pow(1 - t, 3);
export const easeInOut = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
export const easeOutBack = (t, s = 1.7) => 1 + (s + 1) * Math.pow(t - 1, 3) + s * Math.pow(t - 1, 2);
export const easeOutExpo = (t) => (t >= 1 ? 1 : 1 - Math.pow(2, -10 * t));
// entra em `dur` s a partir de `t0`
export const enter = (t, t0, dur = 0.22, fn = easeOut) => fn(clamp((t - t0) / dur, 0, 1));

export function rr(g, x, y, w, h, r) {
  g.beginPath();
  const k = Math.min(r, w / 2, h / 2);
  g.moveTo(x + k, y);
  g.arcTo(x + w, y, x + w, y + h, k);
  g.arcTo(x + w, y + h, x, y + h, k);
  g.arcTo(x, y + h, x, y, k);
  g.arcTo(x, y, x + w, y, k);
  g.closePath();
}
export function circle(g, x, y, r) { g.beginPath(); g.arc(x, y, r, 0, Math.PI * 2); g.closePath(); }
export function diamond(g, x, y, r) {
  g.beginPath(); g.moveTo(x, y - r); g.lineTo(x + r, y); g.lineTo(x, y + r); g.lineTo(x - r, y); g.closePath();
}
export function poly(g, pts, close = true) {
  g.beginPath();
  pts.forEach(([x, y], i) => (i ? g.lineTo(x, y) : g.moveTo(x, y)));
  if (close) g.closePath();
}
export function shadow(g, color, blur, ox = 0, oy = 0) {
  g.save(); g.shadowColor = color; g.shadowBlur = blur; g.shadowOffsetX = ox; g.shadowOffsetY = oy;
}
export const noShadow = (g) => g.restore();

// ---------------------------------------------------------------- fundo
export function bg(g, t = 0, opt = {}) {
  const { glow = C.orange, glowA = 0.17, gx = 360, gy = 760, gr = 520, dark = C.bg, dots = 0.075, grid = 26 } = opt;
  g.fillStyle = dark; g.fillRect(0, 0, REF_W, REF_H);
  if (glowA > 0) {
    const rg = g.createRadialGradient(gx, gy, 0, gx, gy, gr);
    rg.addColorStop(0, hexA(glow, glowA));
    rg.addColorStop(1, hexA(glow, 0));
    g.fillStyle = rg; g.fillRect(0, 0, REF_W, REF_H);
  }
  if (dots > 0) {
    g.fillStyle = hexA(dark === C.bg ? "#ffffff" : "#000000", dots);
    for (let y = grid / 2; y < REF_H; y += grid) {
      for (let x = grid / 2; x < REF_W; x += grid) {
        g.fillRect(x, y, 1.6, 1.6);
      }
    }
  }
}

export function hexA(hex, a) {
  const h = hex.replace("#", "");
  const n = parseInt(h.length === 3 ? h.split("").map((c) => c + c).join("") : h, 16);
  return `rgba(${(n >> 16) & 255},${(n >> 8) & 255},${n & 255},${a})`;
}

export function vignette(g, a = 0.5) {
  const rg = g.createRadialGradient(360, 640, 300, 360, 640, 780);
  rg.addColorStop(0, "rgba(0,0,0,0)");
  rg.addColorStop(1, `rgba(0,0,0,${a})`);
  g.fillStyle = rg; g.fillRect(0, 0, REF_W, REF_H);
}

// ---------------------------------------------------------------- tipografia
// desenha com tracking manual (px por caractere); retorna a largura
export function textT(g, txt, x, y, o = {}) {
  const { size = 40, font = "AB", tracking = 0, align = "left", color = C.white, alpha = 1 } = o;
  g.save();
  g.globalAlpha *= alpha;
  g.font = `${size}px ${font}`;
  g.fillStyle = color;
  g.textBaseline = "alphabetic";
  const chars = [...txt];
  const widths = chars.map((c) => g.measureText(c).width);
  const total = widths.reduce((a, b) => a + b, 0) + tracking * Math.max(0, chars.length - 1);
  let cx = align === "center" ? x - total / 2 : align === "right" ? x - total : x;
  chars.forEach((c, i) => { g.fillText(c, cx, y); cx += widths[i] + tracking; });
  g.restore();
  return total;
}
export function measureT(g, txt, o = {}) {
  const { size = 40, font = "AB", tracking = 0 } = o;
  g.save(); g.font = `${size}px ${font}`;
  const w = [...txt].reduce((a, c) => a + g.measureText(c).width, 0) + tracking * Math.max(0, [...txt].length - 1);
  g.restore();
  return w;
}

// linha cinética: uma frase que aparece palavra a palavra
// palavras: [{ t, w, cor?, box?, italico? }]
export function kineticLine(g, palavras, t, o = {}) {
  const {
    x = 60, y = 300, size = 44, lineH = 1.16, maxW = 600, align = "left",
    font = "MB", fontAlt = "MB", corNova = C.white, corVelha = C.gray,
    dim = true, janela = 0.75, riseY = 14, boxPad = 6,
  } = o;
  const lh = size * lineH;
  // layout
  const lines = [[]];
  let curW = 0;
  for (const p of palavras) {
    const f = p.italico ? fontAlt : font;
    const w = measureT(g, p.w, { size, font: f }) + size * 0.28;
    if (curW + w > maxW && lines[lines.length - 1].length) { lines.push([]); curW = 0; }
    lines[lines.length - 1].push({ ...p, wpx: w, f });
    curW += w;
  }
  const totalH = lines.length * lh;
  let ly = y - totalH + lh * 0.8;
  const rendered = [];
  for (const line of lines) {
    const lw = line.reduce((a, b) => a + b.wpx, 0);
    let lx = align === "center" ? x - lw / 2 : align === "right" ? x - lw : x;
    for (const p of line) {
      const a = enter(t, p.t, p.dur || 0.16);
      if (a > 0.001) rendered.push({ p, lx, ly, a });
      lx += p.wpx;
    }
    ly += lh;
  }
  // pinta do mais antigo para o mais novo
  const ordenado = rendered.slice().sort((a, b) => a.p.t - b.p.t);
  const base = ordenado.length ? ordenado[ordenado.length - 1].p.t : 0;
  for (const r of ordenado) {
    const { p, lx, ly: yy, a } = r;
    const velho = dim && p.t < base - janela;
    const cor = p.cor || (velho ? corVelha : corNova);
    const tx = lx;
    const ty = yy + (1 - a) * riseY;
    g.save();
    g.globalAlpha *= a < 1 ? a : 1;
    if (p.box) {
      const w = measureT(g, p.w, { size, font: p.f });
      g.fillStyle = p.box;
      rr(g, tx - boxPad, ty - size * 0.72 - boxPad * 0.4, w + boxPad * 2, size * 0.95 + boxPad, 8);
      g.fill();
    }
    textT(g, p.w, tx, ty, { size, font: p.f, color: p.cor || cor, tracking: p.box ? 0 : -0.4 });
    if (p.sublinhado) {
      const w = measureT(g, p.w, { size, font: p.f });
      g.fillStyle = p.cor || cor;
      g.fillRect(tx, ty + size * 0.16, w, 3);
    }
    if (p.rasurado) {
      const w = measureT(g, p.w, { size, font: p.f });
      g.strokeStyle = C.orange; g.lineWidth = size * 0.11;
      g.beginPath(); g.moveTo(tx - 4, ty - size * 0.24); g.lineTo(tx + w + 4, ty - size * 0.24); g.stroke();
    }
    g.restore();
  }
  return { lines: lines.length, h: totalH };
}

// ---------------------------------------------------------------- cursor + pílula
export function cursor(g, x, y, o = {}) {
  const { label = null, cor = C.orange, alpha = 1, rot = 0, scale = 1 } = o;
  g.save();
  g.globalAlpha *= alpha;
  g.translate(x, y); g.rotate(rot);
  const arrow = [[0, 0], [0, 26], [6.5, 19.5], [11, 29], [16, 26.5], [11.5, 17.5], [19.5, 16.5]];
  g.save();
  g.scale(scale * 2.4, scale * 2.4);
  // sombra
  g.save();
  g.translate(2, 3); poly(g, arrow); g.fillStyle = "rgba(0,0,0,.45)"; g.fill();
  g.restore();
  // o cursor do ref é GRANDE e LARANJA (prints do usuário: o nosso era pequeno/branco)
  poly(g, arrow); g.fillStyle = C.orange; g.fill();
  g.lineWidth = 1.4; g.strokeStyle = "#ffffff"; g.lineJoin = "round"; g.stroke();
  g.restore();
  if (label) {
    // o chip é desenhado em unidades de PALCO (o ref: ~93x31 px de 720) — antes ele
    // herdava o 2,4x do cursor e virava um bloco de 300 px cobrindo os arquivos
    g.font = "700 15px MB";
    const w = g.measureText(label).width + 20;
    const bx = 24 * scale, by = 26 * scale, bh = 28;
    g.save();
    shadow(g, "rgba(0,0,0,.5)", 10, 0, 2);
    rr(g, bx, by, w, bh, 7); g.fillStyle = cor; g.fill();
    g.restore();
    g.fillStyle = "#ffffff"; g.textBaseline = "middle";
    g.fillText(label, bx + 10, by + bh / 2 + 0.5);
    g.textBaseline = "alphabetic";
  }
  g.restore();
}

// ---------------------------------------------------------------- pílulas / chips
export function pillTexto(g, x, y, txt, o = {}) {
  const { size = 40, font = "MB", bgCor = null, cor = C.white, pad = 14, padY = 12, r = 12, strike = false, box = false } = o;
  g.font = `${size}px ${font}`;
  const w = g.measureText(txt).width;
  const h = size + padY * 2;
  if (bgCor) { rr(g, x, y - size - padY, w + pad * 2, h, r); g.fillStyle = bgCor; g.fill(); }
  if (box) { rr(g, x, y - size - padY, w + pad * 2, h, r); g.fillStyle = C.orange; g.fill(); }
  g.fillStyle = cor;
  g.fillText(txt, x + pad, y);
  if (strike) {
    g.strokeStyle = C.orange; g.lineWidth = size * 0.11;
    g.beginPath(); g.moveTo(x + pad - 4, y - size * 0.26); g.lineTo(x + pad + w + 4, y - size * 0.26); g.stroke();
  }
  return w + pad * 2;
}

// pill escuro arredondado com ícone + rótulo (ex.: "After Effects")
export function pillApp(g, x, y, txt, o = {}) {
  const { size = 26, strike = false, strikeU = 1, dim = 1, icon = "sparkle", w = null, h = 46 } = o;
  g.save(); g.globalAlpha *= strike ? dim * 0.72 : dim;
  g.font = `700 ${size}px MB`;
  const pw = w || g.measureText(txt).width + h * 1.5 + size * 0.7;
  rr(g, x, y, pw, h, h / 2);
  g.fillStyle = "#1e1e24"; g.fill();
  g.strokeStyle = "rgba(255,255,255,.08)"; g.lineWidth = 1.4; g.stroke();
  // ícone
  const is = h * 0.66, ix = x + h * 0.16, iy = y + (h - is) / 2;
  rr(g, ix, iy, is, is, is * 0.26);
  g.fillStyle = icon === "play" ? "rgba(255,255,255,.10)" : "rgba(255,255,255,.08)"; g.fill();
  g.save(); g.translate(ix + is / 2, iy + is / 2); g.scale(is / 46, is / 46);
  if (icon === "sparkle") {
    g.strokeStyle = "#b9a7ff"; g.lineWidth = 3; g.lineCap = "round";
    g.beginPath(); g.moveTo(-9, 9); g.lineTo(9, -9); g.stroke();
    poly(g, [[9, -9], [3, -9], [9, -3]]); g.fillStyle = "#b9a7ff"; g.fill();
    poly(g, [[-6, 6], [-9, 6], [-6, 9]]); g.fill();
  } else {
    g.strokeStyle = "#e2e0f5"; g.lineWidth = 2.6; g.lineJoin = "round";
    rr(g, -10, -8, 17, 16, 3); g.stroke();
    poly(g, [[-3, -4], [4, 0], [-3, 4]]); g.fillStyle = "#e2e0f5"; g.fill();
  }
  g.restore();
  textT(g, txt, ix + is + h * 0.26, y + h / 2 + size * 0.35, { size, font: "MB", color: C.white });
  if (strike) {
    g.strokeStyle = "#d8452e"; g.lineWidth = h * 0.09; g.lineCap = "round";
    const x0 = x + h * 0.34, x1 = x + pw - h * 0.2;
    g.beginPath(); g.moveTo(x0, y + h / 2); g.lineTo(lerp(x0, x1, clamp(strikeU, 0, 1)), y + h / 2); g.stroke();
  }
  g.restore();
}

// ---------------------------------------------------------------- janela macOS
export function macWindow(g, x, y, w, h, o = {}) {
  const { title = "", bgCor = C.card, r = 14, chromeH = 44, titleSize = 20, focus = null, chromeCor = "#141418" } = o;
  g.save();
  shadow(g, "rgba(0,0,0,.42)", 15, 0, 7);
  rr(g, x, y, w, h, r); g.fillStyle = bgCor; g.fill(); g.restore();
  if (focus) { rr(g, x - 2.5, y - 2.5, w + 5, h + 5, r + 3); g.strokeStyle = focus; g.lineWidth = 3.5; g.stroke(); }
  // barra
  g.save();
  rr(g, x, y, w, chromeH, r); g.clip();
  g.fillStyle = chromeCor; g.fillRect(x, y, w, chromeH);
  g.fillStyle = "rgba(255,255,255,.06)"; g.fillRect(x, y, w, 1);
  g.restore();
  const lx = x + 16, ly = y + chromeH / 2;
  for (const [i, c] of [["#f26462"], ["#f5bd4f"], ["#54c22c"]].entries()) {
    circle(g, lx + i * 16, ly, 6.2); g.fillStyle = c[0]; g.fill();
  }
  if (title) textT(g, title, x + w / 2, ly + titleSize * 0.35, { size: titleSize, font: "MSemi", color: C.gray2, align: "center" });
  return { x, y, w, h, chromeH };
}

// ================================================================ MOCKUPS
// --- Finder com 4 arquivos
export function finderWindow(g, x, y, w, h, o = {}) {
  const { sel = [], hide = [], tFree = 0, pop = 4, popStep = 0.16, goneT = 2.2, lixeira = true } = o;
  macWindow(g, x, y, w, h, { title: "PENDRIVE_DO_PRIMO (E:)", bgCor: "#101116", r: 16, chromeH: 46, titleSize: 20 });
  textT(g, "E:\\ > arquivos > NAO_APAGAR", x + 60, y + 92, { size: 19, font: "Mono", color: C.gray2 });
  const files = [
    { nome: "CapCut_PRO_crac\nkeado (2).exe", tag: "EXE", tagBg: "#e0552a", tagCor: "#fff" },
    { nome: "fotos_churrasco_2\n019.zip", tag: "ZIP", tagBg: "#d8b424", tagCor: "#1a1a1a" },
    { nome: "trabalho_FINAL_a\ngora_vai.docx", tag: "DOC", tagBg: "#3f8fd8", tagCor: "#fff" },
    { nome: "musica (3).mp3", tag: "MP3", tagBg: "#d8589a", tagCor: "#1a1a1a" },
  ];
  const cw = (w - 92) / 2 - 6, ch = (h - 150) / 2 - 6;
  files.forEach((f, i) => {
    if (i >= pop) return;
    if (hide.includes(i)) return;
    // pop-in sequencial: cada card nasce com scale (o ref mostra um a um)
    const pu = easeOutBack(clamp((tFree - i * popStep) / 0.32, 0, 1));
    if (pu <= 0.01) return;
    const cx = x + 46 + (i % 2) * (cw + 14);
    const cy = y + 108 + Math.floor(i / 2) * (ch + 14);
    const gone = i < 3 ? clamp((tFree - goneT - i * 0.12) / 0.12, 0, 1) : 0;
    g.save();
    g.globalAlpha = (1 - gone) * clamp(pu, 0, 1);
    g.translate(cx + cw / 2, cy + ch / 2); g.scale(clamp(pu, 0.01, 1), clamp(pu, 0.01, 1)); g.translate(-(cx + cw / 2), -(cy + ch / 2));
    rr(g, cx, cy, cw, ch, 12); g.fillStyle = "#1b2a52"; g.fill();
    rr(g, cx, cy, cw, ch, 12); g.strokeStyle = C.blueDeep; g.lineWidth = 1.6; g.stroke();
    const iw = 40, ih = 52, ix = cx + 16, iy = cy + (ch - ih) / 2;
    g.save();
    poly(g, [[ix, iy], [ix + iw - 14, iy], [ix + iw, iy + 14], [ix + iw, iy + ih], [ix, iy + ih]]);
    g.fillStyle = "#6d7178"; g.fill();
    poly(g, [[ix + iw - 14, iy], [ix + iw, iy + 14], [ix + iw - 14, iy + 14]]); g.fillStyle = "#9aa0a6"; g.fill();
    g.restore();
    rr(g, ix + 3, iy + ih - 23, 29, 15, 4); g.fillStyle = f.tagBg; g.fill();
    textT(g, f.tag, ix + 17.5, iy + ih - 12, { size: 11, font: "MB", color: f.tagCor, align: "center" });
    const l1 = f.nome.split("\n");
    l1.forEach((l, li) => textT(g, l, ix + iw + 14, cy + 26 + li * 20, { size: 16, font: "MSemi", color: C.white }));
    // seleção (clique do mouse)
    if (sel.includes(i)) {
      rr(g, cx - 2, cy - 2, cw + 4, ch + 4, 14); g.strokeStyle = C.orange; g.lineWidth = 3.4; g.stroke();
      rr(g, cx, cy, cw, ch, 12); g.fillStyle = "rgba(240,86,30,.14)"; g.fill();
    }
    g.restore();
  });
  // lixeira (desligada quando a cena usa a lixeira grande externa)
  if (!lixeira) return { files: files.length };
  const tx = x + w / 2, ty = y + h - 44;
  g.save();
  g.strokeStyle = C.gray2; g.lineWidth = 2.2; g.lineJoin = "round";
  g.beginPath(); g.moveTo(tx - 15, ty - 14); g.lineTo(tx + 15, ty - 14); g.lineTo(tx + 11, ty + 15); g.lineTo(tx - 11, ty + 15); g.closePath(); g.stroke();
  g.beginPath(); g.moveTo(tx - 19, ty - 20); g.lineTo(tx + 19, ty - 20); g.stroke();
  g.restore();
  textT(g, "Lixeira", tx, ty + 34, { size: 15, font: "MSemi", color: C.gray2, align: "center" });
  return { files: files.length };
}

// --- diálogo macOS "Abrir 'Software Gráfico'?"
export function dialogAbrir(g, x, y, w, h, o = {}) {
  const { hover = null } = o;
  rr(g, x, y, w, h, 22); g.fillStyle = "#1c1c22"; g.fill();
  g.strokeStyle = "rgba(255,255,255,.07)"; g.lineWidth = 1.5; g.stroke();
  const cx = x + w / 2;
  // ícone
  rr(g, cx - 34, y + 26, 68, 68, 18); g.fillStyle = "#2c2c34"; g.fill();
  g.save(); g.translate(cx, y + 60);
  g.strokeStyle = C.orange; g.lineWidth = 4; g.lineCap = "round"; g.lineJoin = "round";
  g.beginPath(); g.moveTo(-13, 11); g.lineTo(13, -13); g.stroke();
  g.beginPath(); g.moveTo(-13, 11); g.lineTo(-13, 3); g.moveTo(-13, 11); g.lineTo(-5, 11); g.stroke();
  g.restore();
  textT(g, "Abrir “Software Gráfico”?", cx, y + 162, { size: 34, font: "MXB", color: C.white, align: "center" });
  textT(g, "Carregando 214 plugins...", cx, y + 202, { size: 24, font: "MSemi", color: C.gray2, align: "center" });
  textT(g, "tempo estimado: 4 min", cx, y + 232, { size: 24, font: "MSemi", color: C.gray2, align: "center" });
  const bw = (w - 70) / 2, by = y + h - 96;
  rr(g, x + 24, by, bw, 54, 12); g.fillStyle = "#2c2c33"; g.fill();
  textT(g, "Cancelar", x + 24 + bw / 2, by + 35, { size: 26, font: "MB", color: C.white, align: "center" });
  rr(g, x + 46 + bw, by, w - 46 - bw - 24, 54, 12); g.fillStyle = C.orange; g.fill();
  textT(g, "Abrir", x + 46 + bw + (w - 46 - bw - 24) / 2, by + 35, { size: 26, font: "MB", color: C.white, align: "center" });
  return { btnY: by, botao: (i) => (i === 0 ? [x + 24 + bw / 2, by + 27] : [x + 46 + bw + (w - 70) / 4, by + 27]) };
}

// --- editor de curvas (bezier) com keyframe arrastando
// curva de dois segmentos que passa por um ponto central móvel (p1)
function curvaPor(g, p0, p1, p2) {
  g.beginPath();
  g.moveTo(p0[0], p0[1]);
  g.bezierCurveTo(p0[0] + (p1[0] - p0[0]) * 0.55, p0[1] - (p0[1] - p1[1]) * 0.62,
    p1[0] - (p1[0] - p0[0]) * 0.5, p1[1] - 46, p1[0], p1[1]);
  g.bezierCurveTo(p1[0] + (p2[0] - p1[0]) * 0.5, p1[1] + 40,
    p2[0] - (p2[0] - p1[0]) * 0.42, p2[1] - 24, p2[0], p2[1]);
}

export function curveEditor(g, x, y, w, h, o = {}) {
  const { lift = 0, ghost = 0, rotulo = "original" } = o;
  macWindow(g, x, y, w, h, { title: "Editor de curvas", bgCor: "#141317", r: 18, chromeH: 42 });
  // grade
  g.save();
  rr(g, x, y + 42, w, h - 42, 0); g.clip();
  g.strokeStyle = "rgba(255,255,255,.05)"; g.lineWidth = 1;
  for (let i = 1; i < 8; i++) { const gx = x + (w / 8) * i; g.beginPath(); g.moveTo(gx, y + 42); g.lineTo(gx, y + h); g.stroke(); }
  for (let i = 1; i < 5; i++) { const gy = y + 42 + ((h - 42) / 5) * i; g.beginPath(); g.moveTo(x, gy); g.lineTo(x + w, gy); g.stroke(); }
  // curva
  const p0 = [x + 0.1 * w, y + 0.78 * h], p1 = [x + 0.52 * w, y + 0.5 * h - 30], p2 = [x + 0.88 * w, y + 0.74 * h];
  // o keyframe do meio sobe/desce com o mouse: a curva inteira ESTICA junto
  const pk = [p1[0], p1[1] + lift];
  // tracejado "original": a curva de antes do arrasto, que fica plantada no lugar
  if (ghost > 0.01) {
    g.save(); g.globalAlpha *= clamp(ghost, 0, 1);
    g.setLineDash([9, 10]); g.strokeStyle = "rgba(226,226,234,.5)"; g.lineWidth = 2.4;
    curvaPor(g, p0, p1, p2); g.stroke();
    g.restore();
    g.save(); g.globalAlpha *= clamp(ghost, 0, 1) * 0.85;
    textT(g, rotulo, p1[0] - 28, p1[1] - 18, { size: 15, font: "Mono", color: "#b9b9c2", align: "right" });
    g.restore();
  }
  g.strokeStyle = C.orange; g.lineWidth = 3.4; g.lineCap = "round";
  g.save(); g.shadowColor = "rgba(240,86,30,.55)"; g.shadowBlur = lift !== 0 ? 14 : 0;
  curvaPor(g, p0, pk, p2); g.stroke();
  g.restore();
  // handles
  g.strokeStyle = "rgba(255,255,255,.5)"; g.lineWidth = 1.4;
  g.beginPath(); g.moveTo(pk[0], pk[1]); g.lineTo(pk[0] - 56, pk[1]); g.stroke();
  g.beginPath(); g.moveTo(pk[0], pk[1]); g.lineTo(pk[0] + 78, pk[1]); g.stroke();
  g.fillStyle = "#141317"; g.strokeStyle = "#e9e9ef"; g.lineWidth = 2.4;
  circle(g, pk[0] - 56, pk[1], 6); g.fill(); g.stroke();
  circle(g, pk[0] + 78, pk[1], 6); g.fill(); g.stroke();
  // keyframes
  g.fillStyle = "#eceef2";
  diamond(g, p0[0], p0[1], 9); g.fill();
  diamond(g, p2[0], p2[1], 9); g.fill();
  g.fillStyle = C.orange; diamond(g, pk[0], pk[1], 11); g.fill();
  g.restore();
  // (o selo 🚫 de "não arrasta" é desenhado pela cena, no ponto do keyframe)
  return { kx: pk[0], ky: pk[1], kx0: p1[0], ky0: p1[1], p0, p2 };
}

// --- diálogo de render com barra de progresso
export function renderDialog(g, x, y, w, h, o = {}) {
  const { pct = 0.2, restante = "10s", nome = "final_FINAL_v3_agora_vai.mp4", alpha = 1, big = false } = o;
  g.save(); g.globalAlpha = alpha;
  rr(g, x, y, w, h, 20); g.fillStyle = "#1b1b20"; g.fill();
  g.strokeStyle = "rgba(255,255,255,.05)"; g.lineWidth = 1.5; g.stroke();
  // spinner
  const sx = x + 40, sy = y + 44;
  g.strokeStyle = "rgba(255,255,255,.18)"; g.lineWidth = 4;
  circle(g, sx, sy, 13); g.stroke();
  g.strokeStyle = C.orange;
  g.beginPath(); g.arc(sx, sy, 13, -Math.PI / 2, -Math.PI / 2 + 2.2); g.stroke();
  textT(g, "Renderizando...", sx + 26, sy + 11, { size: 28, font: "MXB", color: C.white });
  textT(g, nome, x + 40, y + 96, { size: 19, font: "Mono", color: "rgba(255,255,255,.55)" });
  // barra
  const bx = x + 40, by = y + 118, bw = w - 80, bh = 14;
  rr(g, bx, by, bw, bh, 7); g.fillStyle = "#2f2f36"; g.fill();
  const grad = g.createLinearGradient(bx, 0, bx + bw, 0);
  grad.addColorStop(0, C.orange2); grad.addColorStop(1, "#f6c02a");
  rr(g, bx, by, Math.max(12, bw * pct), bh, 7); g.fillStyle = grad; g.fill();
  textT(g, `${Math.round(pct * 100)}%`, x + 40, y + 208, { size: 96, font: "AB", color: C.white });
  textT(g, `tempo restante: ${restante}`, x + w - 40, y + 196, { size: 22, font: "MSemi", color: C.gray2, align: "right" });
  g.restore();
}

// --- "99%" com aberração cromática
export function pct99(g, cx, cy, size, o = {}) {
  const { glitch = 1, rot = -0.02 } = o;
  g.save(); g.translate(cx, cy); g.rotate(rot);
  const layers = [
    ["#22d3ee", -6 * glitch, 0, 0.9],
    ["#f0396b", 6 * glitch, 0, 0.9],
    [C.white, 0, 0, 1],
  ];
  for (const [cor, dx, dy, a] of layers) {
    g.globalAlpha = a;
    textT(g, "99%", dx, size * 0.36 + dy, { size, font: "MXB", color: cor, align: "center", tracking: -6 });
  }
  g.restore();
}

// --- card de vídeo (MOTION / NODO PRIME)
export function phoneCard(g, x, y, w, h, o = {}) {
  const { marca = "NODO\nPRIME", marcaSize = null, mote = "GRAPHICS", glow = false, progress = true, play = false, alpha = 1, r = 22 } = o;
  g.save(); g.globalAlpha *= alpha;
  rr(g, x, y, w, h, r); g.fillStyle = "#191a1e"; g.fill();
  g.strokeStyle = "rgba(255,255,255,.09)"; g.lineWidth = 2; g.stroke();
  // círculo laranja com glow
  const dot = [x + w * 0.62, y + h * 0.26];
  if (glow) { shadow(g, hexA(C.orange, .55), 40); }
  circle(g, dot[0], dot[1], 26); g.fillStyle = C.orange2; g.fill();
  if (glow) { g.restore(); g.save(); g.globalAlpha *= alpha; }
  if (play) {
    circle(g, x + w * 0.5 - 2, y + h * 0.42 - 6, 52); g.fillStyle = "rgba(60,60,70,.92)"; g.fill();
    poly(g, [[x + w * 0.5 - 14, y + h * 0.42 - 30], [x + w * 0.5 + 22, y + h * 0.42 - 6], [x + w * 0.5 - 14, y + h * 0.42 + 18]]);
    g.fillStyle = "#f0f0f4"; g.fill();
  }
  const ms = marcaSize || Math.round(w * 0.155);
  const linhas = marca.split("\n");
  linhas.forEach((l, i) => {
    textT(g, l, x + w * 0.16, y + h * 0.70 + i * ms * 1.02 + (linhas.length > 1 ? -ms * 0.5 : 0), { size: ms, font: "AB", color: C.white, tracking: -ms * 0.03 });
  });
  if (mote) textT(g, mote, x + w * 0.16, y + h * 0.70 + ms * (linhas.length > 1 ? 1.5 : 0.62), { size: ms * 0.62, font: "AB", color: "#8f8f96", tracking: -ms * 0.02 });
  if (progress) {
    const py = y + h * 0.78;
    rr(g, x + w * 0.16, py, w * 0.68, 4, 2); g.fillStyle = "rgba(255,255,255,.18)"; g.fill();
    circle(g, x + w * 0.16 + w * 0.42, py + 2, 5.5); g.fillStyle = C.yellow; g.fill();
  }
  g.restore();
}

// --- card hero "MOTION EM HTML." (anúncio)
// mistura duas cores hex (u 0→1) — para morf de cor (clique → paleta troca)
function mixHex(a, b, u) {
  const px = (h) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16));
  const A = px(a), Bc = px(b);
  return `rgb(${A.map((v, i) => Math.round(v + (Bc[i] - v) * u)).join(",")})`;
}

export function cardHero(g, x, y, w, h, o = {}) {
  const { marca = "NODO\nPRIME", title = "EM HTML.", btn = "Assistir", dots = false, pctBar = 0.16, morf = 0 } = o;
  const corMorf = morf > 0 ? mixHex(C.orange2, C.purple, morf) : C.orange2;
  g.save();
  rr(g, x, y, w, h, 22); g.fillStyle = "#1a1b1f"; g.fill();
  g.save(); rr(g, x, y, w, h, 22); g.clip();
  // quarto de círculo (laranja → roxo no morf)
  g.beginPath(); g.arc(x + w * 0.62, y + h * 0.16, w * 0.42, 0, Math.PI * 2); g.fillStyle = corMorf; g.fill();
  // anel (amarelo → teal no morf)
  g.strokeStyle = morf > 0 ? mixHex(C.yellow, C.teal, morf) : C.yellow; g.lineWidth = 8;
  circle(g, x + w * 0.17, y + h * 0.24, 20); g.stroke();
  g.restore();
  const ms = Math.round(w * 0.148);
  const linhas = marca.split("\n");
  linhas.forEach((l, i) => textT(g, l, x + w * 0.1, y + h * 0.52 + i * ms * 1.02, { size: ms, font: "AB", color: C.white, tracking: -ms * 0.03 }));
  textT(g, title, x + w * 0.1, y + h * 0.52 + ms * (linhas.length) * 1.02, { size: ms, font: "AB", color: C.white, tracking: -ms * 0.03 });
  // botão
  const by = y + h * 0.81;
  g.font = "700 20px MB";
  const bw = g.measureText(btn).width + 62;
  rr(g, x + w * 0.1, by, bw, 38, 8); g.fillStyle = corMorf; g.fill();
  textT(g, btn, x + w * 0.1 + 16, by + 26, { size: 21, font: "MB", color: C.white });
  poly(g, [[x + w * 0.1 + bw - 26, by + 13], [x + w * 0.1 + bw - 16, by + 19], [x + w * 0.1 + bw - 26, by + 25]]);
  g.fillStyle = C.white; g.fill();
  // barra de progresso
  const px = x + w * 0.1 + bw + 34, pw = w - (px - x) - w * 0.1;
  rr(g, px, by + 17, pw, 8, 4); g.fillStyle = "#3a3a40"; g.fill();
  rr(g, px, by + 17, pw * pctBar, 8, 4); g.fillStyle = corMorf; g.fill();
  // bolinhas de cor (o anel de seleção pula para a 2ª no morf, como no ref)
  if (dots) {
    const cores = ["#ff8a3d", "#7c5cf6", "#2dd4c0", "#f0568f", "#f5b626", "#3b82f6"];
    const dy = y + h * 0.95, r = 11, gap = 30, x0 = x + w * 0.1 + r;
    const selDot = morf > 0.5 ? 1 : 0;
    cores.forEach((c, i) => {
      circle(g, x0 + i * gap, dy, r); g.fillStyle = c; g.fill();
      if (i === selDot) { circle(g, x0 + i * gap, dy, r); g.strokeStyle = "rgba(255,255,255,.75)"; g.lineWidth = 2; g.stroke(); }
    });
  }
  g.restore();
}

// --- navegador com site cream
export function browserWindow(g, x, y, w, h, o = {}) {
  const { url = "nodo-prime.html", focus = "#3b6ff0", caret = true, badge = null, alpha = 1 } = o;
  g.save(); g.globalAlpha *= alpha;
  const chromeH = Math.round(h * 0.135), topH = Math.round(chromeH * 0.52);
  macWindow(g, x, y, w, h, { bgCor: "#0f0f13", r: 12, chromeH: topH, focus });
  // barra de URL
  const bx = x + 10, by = y + topH + 6, bw = w - 20, bh = chromeH - topH - 12;
  rr(g, bx, by, bw, bh, bh / 2); g.fillStyle = "#1c1c21"; g.fill();
  g.strokeStyle = "rgba(255,255,255,.35)"; g.lineWidth = 1.8; g.lineCap = "round";
  g.beginPath(); g.arc(bx + 18, by + bh / 2, bh * 0.2, -1.1, 2.0); g.stroke();
  poly(g, [[bx + 13, by + bh / 2 - 5], [bx + 13, by + bh / 2], [bx + 15, by + bh / 2 - 1]]);
  g.fillStyle = "rgba(255,255,255,.35)"; g.fillRect(bx + 34, by + bh / 2 - 3.5, 8, 6);
  g.beginPath(); g.arc(bx + 38, by + bh / 2 - 3.5, 3, Math.PI, 0); g.strokeStyle = "rgba(255,255,255,.35)"; g.lineWidth = 1.5; g.stroke();
  textT(g, url, bx + 50, by + bh / 2 + 6, { size: bh * 0.52, font: "Mono", color: "#cfcfd6" });
  g.restore();
  // conteúdo do site (cream), desenhado em espaço fixo de 608 e escalado
  const cy = y + chromeH;
  const k = (w - 8) / 608;
  g.save();
  g.beginPath(); g.rect(x + 3, cy - 1, w - 6, h - chromeH + 1); g.clip();
  g.translate(x + 4, cy); g.scale(k, k);
  const SW = 608, SH = (h - chromeH) / k;
  g.fillStyle = C.cream; g.fillRect(0, 0, SW, SH + 2);
  g.fillStyle = "rgba(0,0,0,.05)";
  for (let yy = 10; yy < SH + 20; yy += 16) for (let xx = 8; xx < SW; xx += 16) g.fillRect(xx, yy, 1.2, 1.2);
  if (caret) {
    const ly = 34;
    poly(g, [[26, ly], [36, ly + 8], [26, ly + 16], [16, ly + 8]]); g.fillStyle = "#14130f"; g.fill();
    textT(g, "meu.site", 44, ly + 13, { size: 24, font: "MXB", color: "#14130f" });
    textT(g, "Sobre    Projetos    Contato", SW - 26, ly + 12, { size: 19, font: "MSemi", color: "#3c3b36", align: "right" });
    g.fillStyle = "rgba(0,0,0,.08)"; g.fillRect(8, 62, SW - 16, 1.6);
    textT(g, "Feito em HTML.", 28, 160, { size: 46, font: "AB", color: "#14130f", tracking: -1.4 });
    textT(g, "Linha por linha, frame por frame — sem timeline.", 28, 198, { size: 20, font: "MSemi", color: "#4a4944" });
    rr(g, 28, 222, 112, 42, 9); g.fillStyle = "#14130f"; g.fill();
    textT(g, "Ver mais", 44, 250, { size: 21, font: "MB", color: "#f4f2ea" });
    textT(g, "→", 44 + measureT(g, "Ver mais", { size: 21, font: "MB" }) + 10, 250, { size: 21, font: "MSemi", color: "#f4f2ea" });
    const gy = 282, gh = SH - gy - 12;
    const gr = g.createLinearGradient(28, gy, SW - 28, gy + gh);
    gr.addColorStop(0, "#f8c8a8"); gr.addColorStop(1, "#f28a5c");
    rr(g, 28, gy, SW - 56, Math.max(40, gh), 14); g.fillStyle = gr; g.fill();
    circle(g, SW / 2, gy + gh * 0.42, 28); g.fillStyle = C.orange2; g.fill();
    rr(g, SW * 0.32, gy + gh * 0.68, SW * 0.36, 8, 4); g.fillStyle = "rgba(90,60,40,.45)"; g.fill();
  }
  g.restore();
  if (badge) {
    g.font = "700 22px MB";
    const bw2 = g.measureText(badge).width + 34;
    rr(g, x + w - bw2 - 6, y + h + 10, bw2, 38, 19); g.fillStyle = "#2f6bf6"; g.fill();
    textT(g, badge, x + w - bw2 - 6 + bw2 / 2, y + h + 36, { size: 22, font: "MB", color: "#fff", align: "center" });
  }
  return { cy };
}

// --- cantos de seleção (brackets)
export function brackets(g, x, y, w, h, o = {}) {
  const { l = 46, a = 1, cor = "#eef0ec" } = o;
  g.save(); g.globalAlpha *= a;
  g.strokeStyle = cor; g.lineWidth = 5; g.lineCap = "round"; g.lineJoin = "round";
  const cantos = [
    [[x, y + l], [x, y], [x + l, y]],
    [[x + w - l, y], [x + w, y], [x + w, y + l]],
    [[x + w, y + h - l], [x + w, y + h], [x + w - l, y + h]],
    [[x + l, y + h], [x, y + h], [x, y + h - l]],
  ];
  for (const c of cantos) {
    g.beginPath(); g.moveTo(c[0][0], c[0][1]); g.lineTo(c[1][0], c[1][1]); g.lineTo(c[2][0], c[2][1]); g.stroke();
  }
  g.restore();
}

// --- tira de filme (contact sheet)
export function filmstrip(g, o = {}) {
  const { y = 860, h = 190, n = 6, off = 0, grande = false, frame = 1, total = 2562, pastas = 2 } = o;
  g.save();
  g.fillStyle = "rgba(255,255,255,.03)"; g.fillRect(0, y, REF_W, h);
  // bordas pontilhadas
  g.save();
  g.strokeStyle = "rgba(255,255,255,.22)"; g.lineWidth = 3; g.setLineDash([7, 7]);
  for (const yy of [y + 6, y + h - 6]) { g.beginPath(); g.moveTo(0, yy); g.lineTo(REF_W, yy); g.stroke(); }
  g.restore();
  // miniaturas
  const tw = 68, thh = 108;
  const gap = 16;
  for (let i = 0; i < 26; i++) {
    const mx = i * (tw + gap) - off;
    if (mx < -tw - 40 || mx > REF_W + 40) continue;
    g.save(); g.globalAlpha = clamp(1 - Math.abs(mx + tw / 2 - REF_W / 2) / 620, 0.12, 0.85);
    rr(g, mx, y + (h - thh) / 2, tw, thh, 8); g.fillStyle = "#1b1c20"; g.fill();
    circle(g, mx + tw / 2, y + (h - thh) / 2 + 34, 9); g.fillStyle = C.orange2; g.fill();
    textT(g, "NODO", mx + tw / 2, y + (h - thh) / 2 + 74, { size: 14, font: "AB", color: C.white, align: "center" });
    textT(g, "PRIME", mx + tw / 2, y + (h - thh) / 2 + 90, { size: 14, font: "AB", color: C.white, align: "center" });
    g.restore();
  }
  g.restore();
}

// --- editor de vídeo NOVO (play + MOTION + círculo roxo + timeline de barras)
export function editorNovo(g, x, y, w, h, o = {}) {
  const { alpha = 1, scale = 1, comTimeline = true, playheadX = 0.28, previewX = 0.76, purple = "#7c5cf6", marca = "NODO\nPRIME" } = o;
  g.save(); g.globalAlpha *= alpha; g.translate(x + w / 2, y); g.scale(scale, scale); g.translate(-(x + w / 2), -y);
  macWindow(g, x, y, w, h, { title: "Editor de vídeo", bgCor: "#17161d", r: 16, chromeH: 42, focus: "rgba(124,92,246,.55)", titleSize: 19 });
  // viewer
  const vx = x + 16, vy = y + 56, vw = w - 32, vh = 268;
  rr(g, vx, vy, vw, vh, 12); g.fillStyle = "#221e39"; g.fill();
  const gr = g.createRadialGradient(vx + vw * previewX, vy + vh * 0.5, 10, vx + vw * previewX, vy + vh * 0.5, 260);
  gr.addColorStop(0, "rgba(124,92,246,.45)"); gr.addColorStop(1, "rgba(124,92,246,0)");
  g.fillStyle = gr; g.fillRect(vx, vy, vw, vh);
  circle(g, vx + vw * previewX, vy + vh * 0.5, 78); g.fillStyle = purple; g.fill();
  circle(g, vx + 46, vy + 46, 24); g.fillStyle = "rgba(60,60,72,.9)"; g.fill();
  poly(g, [[vx + 40, vy + 38], [vx + 54, vy + 46], [vx + 40, vy + 54]]); g.fillStyle = "#e8e8ee"; g.fill();
  const ms = 46;
  ["NODO", "PRIME"].forEach((l, i) => textT(g, l, vx + 24, vy + vh - 84 + i * ms, { size: ms, font: "AB", color: C.white, tracking: -1.4 }));
  if (comTimeline) {
    const ty = vy + vh + 14, th = h - (ty - y) - 16;
    rr(g, x + 10, ty, w - 20, th, 10); g.fillStyle = "#121118"; g.fill();
    // régua
    const cols = ["#7c5cf6", "#7c5cf6", "#7c5cf6", "#7c5cf6", "#7c5cf6", "#7c5cf6", "#7c5cf6"];
    g.font = "500 13px Mono"; g.fillStyle = "rgba(255,255,255,.45)";
    for (let i = 0; i < 7; i++) g.fillText(`00:0${i}`, x + 26 + i * ((w - 52) / 6.2), ty + 20);
    const bars = [
      [[0.0, 0.24, "#e8753f"], [0.28, 0.30, "#e8753f"], [0.62, 0.34, "#e8753f"]],
      [[0.06, 0.30, "#5b8ce8"], [0.40, 0.44, "#5b8ce8"]],
      [[0.02, 0.28, "#3fbf8f"], [0.34, 0.52, "#3fbf8f"], [0.90, 0.10, "#3fbf8f"]],
    ];
    bars.forEach((row, ri) => {
      for (const [bx, bwid, cor] of row) {
        const rx = x + 22 + bx * (w - 44), rw = bwid * (w - 44), ry = ty + 32 + ri * 34, rh = 26;
        rr(g, rx, ry, rw, rh, 13); g.fillStyle = cor; g.fill();
      }
    });
    // playhead roxo
    const px = x + 22 + playheadX * (w - 44);
    g.fillStyle = C.purple; g.fillRect(px, ty + 26, 3, th - 34);
    circle(g, px + 1.5, ty + 26, 4); g.fill();
  }
  g.restore();
}

// --- timeline antiga (softwares gráficos): toolbar + trilhas + playhead laranja
export function timelineAntiga(g, x, y, w, h, o = {}) {
  const { rot = -0.055, alpha = 1, render = true, trilhas = true, keys = true, sweep = 0, profundidade = 0, dx = 0, dy = 0, pegador = null } = o;
  g.save(); g.globalAlpha *= alpha;
  g.translate(dx, dy);
  g.translate(x + w / 2, y + h / 2);
  // profundidade: cisalhamento + leve compressão vertical = leitura de card em 3D
  if (profundidade) g.transform(1, 0.03 * profundidade, -0.11 * profundidade, 1 - 0.055 * profundidade, 0, 0);
  g.rotate(rot); g.translate(-(x + w / 2), -(y + h / 2));
  rr(g, x, y, w, h, 16); g.fillStyle = "#131317"; g.fill();
  g.strokeStyle = "rgba(255,255,255,.07)"; g.lineWidth = 1.5; g.stroke();
  // toolbar
  const tools = ["cursor", "pen", "square", "circle", "T", "hand"];
  if (render) {
    g.font = "700 17px MB";
    const bw = g.measureText("Renderizar").width + 58;
    rr(g, x + w - bw + 8, y + 10, bw, 40, 9); g.fillStyle = C.orange; g.fill();
    textT(g, "Renderizar", x + w - bw + 44, y + 37, { size: 19, font: "MB", color: C.white });
    poly(g, [[x + w - bw + 26, y + 24], [x + w - bw + 34, y + 30], [x + w - bw + 26, y + 36]]); g.fillStyle = C.white; g.fill();
  }
  tools.forEach((tl, i) => {
    const tx = x + 16 + i * 46, ty = y + 12;
    if (tl === "cursor") { rr(g, tx, ty, 38, 38, 9); g.fillStyle = C.orange; g.fill(); }
    g.save(); g.translate(tx + 19, ty + 19);
    g.strokeStyle = tl === "cursor" ? "#fff" : "rgba(255,255,255,.62)"; g.lineWidth = 2.2; g.lineCap = "round"; g.lineJoin = "round";
    if (tl === "cursor") { poly(g, [[-5, -7], [-5, 8], [-1, 5], [2, 10], [4.4, 9], [1.5, 4], [5, 3.6]]); g.fillStyle = "#fff"; g.fill(); }
    else if (tl === "pen") { g.beginPath(); g.moveTo(-7, 7); g.lineTo(6, -6); g.stroke(); g.beginPath(); g.moveTo(-7, 7); g.lineTo(-7, 3); g.moveTo(-7, 7); g.lineTo(-3, 7); g.stroke(); }
    else if (tl === "square") { g.strokeRect(-7, -7, 14, 14); }
    else if (tl === "circle") { g.beginPath(); g.arc(0, 0, 7.5, 0, 6.3); g.stroke(); }
    else if (tl === "T") { g.font = "700 20px MB"; g.fillStyle = "rgba(255,255,255,.62)"; g.textAlign = "center"; g.fillText("T", 0, 7); g.textAlign = "left"; }
    else { g.beginPath(); g.moveTo(-6, -6); g.lineTo(-6, 3); g.quadraticCurveTo(-6, 8, 0, 8); g.quadraticCurveTo(6, 8, 6, 3); g.lineTo(6, -6); g.stroke(); }
    g.restore();
  });
  if (trilhas) {
    const tx0 = x + 108, tw = w - 130, ty0 = y + 104;
    g.font = "500 14px Mono"; g.fillStyle = "rgba(255,255,255,.4)";
    for (let i = 0; i <= 5; i++) g.fillText(`${i}s`, tx0 + (tw / 5) * i, ty0 - 14);
    // barras com tamanhos e começos diferentes (antes quase todas iguais) e uma
    // que vai até o fim da régua; trilhas mais espaçadas, com divisória
    const linhas = [
      ["Texto 01", "#e8753f", 0.05, 0.30],
      ["Forma 2", "#5b8ce8", 0.14, 0.34],
      ["Câmera", "#3fbf8f", 0.02, 0.68],
      ["Ajuste", "#b0559a", 0.26, 0.25],
      ["Fundo", "#b8a53f", 0.34, 0.60],
    ];
    const passo = 64;
    const pxLinha = tx0 + lerp(0.02, 0.95, clamp(sweep, 0, 1)) * tw;
    // UM keyframe aceso por vez: entre todos os da régua, só o MAIS PRÓXIMO da
    // linha fica laranja — quando ela segue, o anterior apaga (antes acendiam
    // vários juntos porque a regra olhava só a distância de cada um)
    const marcas = linhas.map(([, , r0, len], i) => {
      const bx = tx0 + r0 * tw, bwid = len * tw;
      return { i, bx, bwid, kfs: [bx + 6, bx + bwid * 0.46, bx + bwid - 6] };
    });
    let acesaEm = -1, menorD = 1e9;
    if (keys && sweep > 0.002) {
      for (const m of marcas) for (const kx of m.kfs) {
        if (kx < tx0 - 2 || kx > tx0 + tw + 2) continue;
        const d = Math.abs(kx - pxLinha);
        if (d < menorD) { menorD = d; acesaEm = kx * 100 + m.i; }
      }
      if (menorD > 34) acesaEm = -1;
    }
    linhas.forEach(([nome, cor], i) => {
      const { bx, bwid, kfs } = marcas[i];
      const ry = ty0 + i * passo;
      if (i) { g.fillStyle = "rgba(255,255,255,.05)"; g.fillRect(x + 16, ry - 21, w - 32, 1.4); }
      circle(g, x + 22, ry + 12, 5); g.fillStyle = cor; g.fill();
      textT(g, nome, x + 34, ry + 18, { size: 17, font: "MSemi", color: "#d9d9de" });
      rr(g, bx, ry, bwid, 24, 12); g.fillStyle = hexA(cor, .55); g.fill();
      if (keys) {
        for (const kx of kfs) {
          if (kx < tx0 - 2 || kx > tx0 + tw + 2) continue;
          const aceso = acesaEm >= 0 && Math.round(acesaEm) === Math.round(kx * 100 + i);
          if (aceso) { g.save(); g.shadowColor = C.orange; g.shadowBlur = 18; }
          diamond(g, kx, ry + 12, aceso ? 9.8 : 7);
          g.fillStyle = aceso ? C.orange : "#f2f2f6"; g.fill();
          if (aceso) { g.strokeStyle = "rgba(255,255,255,.9)"; g.lineWidth = 1.6; g.stroke(); g.restore(); }
        }
      }
    });
    // a linha laranja é o PRÓPRIO playhead: começa na ESQUERDA e anda para a
    // direita; o card acompanha (dx) como se o mouse o arrastasse
    const pxFinal = pxLinha;
    g.save();
    g.shadowColor = C.orange; g.shadowBlur = 16;
    g.strokeStyle = C.orange; g.lineWidth = 3.4; g.lineCap = "round";
    g.beginPath(); g.moveTo(pxFinal, ty0 - 26); g.lineTo(pxFinal, ty0 + 4 * passo + 28); g.stroke();
    g.restore();
    // pegador (a alça que o mouse agarra)
    rr(g, pxFinal - 7, ty0 - 34, 14, 14, 4); g.fillStyle = "#ffdcc9"; g.fill();
    circle(g, pxFinal, ty0 - 26, 6); g.fillStyle = C.orange; g.fill();
    // mouse PRESO na alça: o card anda junto com a linha (desenhado aqui dentro
    // para não descolar do playhead quando o card gira/inclina)
    if (pegador) {
      g.save();
      g.translate(pxFinal - 4, ty0 - 32);
      g.rotate(-rot);
      cursor(g, 0, 0, { alpha: 1, ...pegador, cor: pegador.cor || C.orange });
      g.restore();
    }
  }
  g.restore();
}

// --- painel de comentários
export function commentsPanel(g, x, y, w, h, o = {}) {
  const { alpha = 1, texto = "", avatar = "NODO\nPRIME", coracao = 0, tick = 45 } = o;
  g.save(); g.globalAlpha *= alpha;
  rr(g, x, y, w, h, 16); g.fillStyle = "rgba(26,25,32,.92)"; g.fill();
  g.strokeStyle = "rgba(255,255,255,.07)"; g.lineWidth = 1.5; g.stroke();
  textT(g, "Comentários", x + w / 2, y + 34, { size: 22, font: "MB", color: "#e9e9ee", align: "center" });
  g.fillStyle = "rgba(255,255,255,.08)"; g.fillRect(x + 16, y + 52, w - 32, 1.6);
  // lista (só se houver comentário postado)
  if (texto) {
    const ly = y + 82;
    circle(g, x + 40, ly + 12, 16); g.fillStyle = "#3fc6e8"; g.fill();
    textT(g, "nodo_prime_oficial", x + 66, ly + 6, { size: 14, font: "MSemi", color: "#8f8f98" });
    textT(g, texto, x + 66, ly + 28, { size: 21, font: "MXB", color: C.white });
    // coração
    const hx = x + w - 84, hy = ly + 20;
    g.save(); g.translate(hx, hy); g.scale(1.35, 1.35);
    g.beginPath();
    g.moveTo(0, 6); g.bezierCurveTo(-9, -2, -6, -10, 0, -5); g.bezierCurveTo(6, -10, 9, -2, 0, 6);
    g.closePath();
    g.strokeStyle = coracao > 0 ? "#f0396b" : "#e8e8ee"; g.lineWidth = 2.4; g.stroke();
    if (coracao > 0) { g.fillStyle = "#f0396b"; g.fill(); }
    g.restore();
  }
  // campo de digitação
  const iy = y + h - 76, ih = 56;
  rr(g, x + 16, iy, w - 32, ih, 28); g.fillStyle = "#141319"; g.fill();
  g.strokeStyle = "rgba(255,255,255,.08)"; g.lineWidth = 1.5; g.stroke();
  const gr = g.createLinearGradient(x + 46, iy, x + 46 + 34, iy + 34);
  gr.addColorStop(0, "#3fc6e8"); gr.addColorStop(1, "#4f7ff0");
  circle(g, x + 46, iy + ih / 2, 17); g.fillStyle = gr; g.fill();
  if (avatar) textT(g, avatar.replace("\n", " "), x + 74, iy + ih / 2 + 8, { size: 21, font: "MXB", color: C.white });
  if (texto) {
    const cx = x + 96;
    g.fillStyle = C.purple; g.fillRect(cx, iy + 14, 2.4, 28);
  }
  // botão enviar
  circle(g, x + w - 44, iy + ih / 2, 21); g.fillStyle = C.purple; g.fill();
  g.strokeStyle = "#fff"; g.lineWidth = 2.6; g.lineCap = "round"; g.lineJoin = "round";
  g.beginPath(); g.moveTo(x + w - 44, iy + ih / 2 + 9); g.lineTo(x + w - 44, iy + ih / 2 - 8); g.stroke();
  g.beginPath(); g.moveTo(x + w - 50, iy + ih / 2 - 2); g.lineTo(x + w - 44, iy + ih / 2 - 9); g.lineTo(x + w - 38, iy + ih / 2 - 2); g.stroke();
  g.restore();
  return { enviar: [x + w - 44, iy + ih / 2], inputX: x + 100, inputY: iy + ih / 2 };
}

// --- pílula de mídia (video.mp4 · 01:25)
export function mediaPill(g, x, y, o = {}) {
  const { nome = "video.mp4", dur = "01:25", alpha = 1 } = o;
  g.save(); g.globalAlpha *= alpha;
  g.font = "600 22px Mono";
  const w = g.measureText(nome).width + g.measureText(dur).width + 68;
  g.restore();
  rr(g, x - w / 2, y, w, 44, 22); g.fillStyle = "#22222a"; g.fill();
  textT(g, nome, x - w / 2 + 22, y + 30, { size: 22, font: "MonoM", color: "#e6e6ee" });
  g.fillStyle = "#7a7a84"; circle(g, x - w / 2 + 22 + g.measureText(nome).width + 14, y + 22, 3); g.fill();
  textT(g, dur, x + w / 2 - 22, y + 30, { size: 22, font: "Mono", color: "#9a9aa4", align: "right" });
  g.restore();
}

// --- onda de áudio + playhead
// Barras FIXAS (determinísticas em i, sem termo t): o ref tem a silhueta parada,
// com faixa "já tocada" (cinza) antes do playhead e "não tocada" (branca) depois.
// Re-randomizar por frame media 4,8/s num beat do ref de 0,84 (casamento t=55).
export function waveform(g, x, y, w, h, o = {}) {
  const { t = 0, playhead = 0.62, nome = "gravando_esse_audio.wav", tempo = "00:56:22 / 01:24:21" } = o;
  const mid = y + h / 2;
  g.save();
  g.lineWidth = 1.6;
  const n = 210;
  for (let i = 0; i < n; i++) {
    const fx = i / n;
    // envelope sustentado (o ref NÃO decai até o fim): cheio até ~85% e cai no último trecho
    const env = (1 - 0.55 * Math.pow(fx, 3)) * (0.72 + 0.28 * Math.sin(fx * 46 + 1.2));
    let amp = clamp(env * (0.45 + 0.55 * Math.abs(Math.sin(i * 12.9898) % 1)), 0.04, 1) * (h / 2) * 0.96;
    // micro-wobble só perto do playhead (a "cabeça" de leitura vive)
    const dp = Math.abs(fx - playhead);
    if (dp < 0.06) amp *= 1 + Math.sin(t * 10 + i) * 0.1 * (1 - dp / 0.06);
    const px = x + fx * w;
    g.strokeStyle = fx < playhead ? "rgba(255,255,255,.42)" : "rgba(255,255,255,.85)";
    g.beginPath(); g.moveTo(px, mid - amp); g.lineTo(px, mid + amp); g.stroke();
  }
  // linha central pontilhada
  g.save();
  g.setLineDash([2, 6]); g.strokeStyle = "rgba(255,255,255,.28)"; g.lineWidth = 1.4;
  g.beginPath(); g.moveTo(x, mid); g.lineTo(x + w + 60, mid); g.stroke();
  g.restore();
  const phx = x + playhead * w;
  g.fillStyle = C.orange; g.fillRect(phx - 1.4, mid - 130, 2.8, 230);
  circle(g, phx, mid - 130, 9); g.fillStyle = C.orange; g.fill();
  g.restore();
  // chip do arquivo
  g.font = "600 22px Mono";
  const cw = g.measureText(nome).width + 62;
  const cx = 360, cy = y + h + 30;
  rr(g, cx - cw / 2, cy, cw, 48, 24); g.fillStyle = "#232329"; g.fill();
  circle(g, cx - cw / 2 + 24, cy + 24, 6); g.fillStyle = "#e5484d"; g.fill();
  textT(g, nome, cx - cw / 2 + 38, cy + 31, { size: 22, font: "MonoM", color: "#e6e6ee" });
  textT(g, tempo, cx, cy + 88, { size: 22, font: "Mono", color: "#8b8b94", align: "center" });
}

// --- nó / laço (knot) desenhado progressivamente
export function knot(g, cx, cy, r, o = {}) {
  const { p = 1, lw = 13 } = o;
  g.save();
  g.strokeStyle = C.orange; g.lineWidth = lw; g.lineCap = "round"; g.lineJoin = "round";
  const loops = [
    [0, 0, 0.30],
    [0.52, -0.22, 0.30],
    [-0.5, 0.16, 0.30],
  ];
  const total = loops.length;
  loops.forEach(([ox, oy, sc], i) => {
    const local = clamp((p - i / total) * total * 1.6, 0, 1);
    if (local <= 0) return;
    g.save();
    g.translate(cx + ox * r, cy + oy * r);
    g.rotate(i * 1.05);
    g.beginPath();
    const seg = Math.PI * 2 * sc;
    g.arc(0, 0, r, -Math.PI / 2, -Math.PI / 2 + seg * local);
    g.stroke();
    g.restore();
  });
  // ponto central
  if (p > 0.55) { circle(g, cx + 4, cy + 12, lw * 0.42); g.fillStyle = C.orange; g.fill(); }
  g.restore();
}

// --- garatuja (squiggle) do "relaxa"
export function squiggle(g, x, y, w, o = {}) {
  const { p = 1, lw = 14 } = o;
  g.save();
  g.strokeStyle = C.orange; g.lineWidth = lw; g.lineCap = "round";
  g.beginPath();
  const n = 40;
  for (let i = 0; i <= n * p; i++) {
    const fx = i / n;
    const px = x + fx * w;
    const py = y + Math.sin(fx * Math.PI * 5.6) * 22 * Math.min(1, fx * 6);
    i ? g.lineTo(px, py) : g.moveTo(px, py);
  }
  g.stroke();
  g.restore();
}

// --- sparkle (faísca de 4 pontas)
export function sparkle(g, x, y, r, a = 1) {
  g.save(); g.globalAlpha *= a;
  g.fillStyle = C.yellow;
  g.beginPath();
  g.moveTo(x, y - r); g.quadraticCurveTo(x + r * 0.16, y - r * 0.16, x + r, y);
  g.quadraticCurveTo(x + r * 0.16, y + r * 0.16, x, y + r);
  g.quadraticCurveTo(x - r * 0.16, y + r * 0.16, x - r, y);
  g.quadraticCurveTo(x - r * 0.16, y - r * 0.16, x, y - r);
  g.closePath(); g.fill();
  g.restore();
}

// --- gráfico de barras (preview) + badge de velocidade
export function previewChart(g, x, y, w, h, o = {}) {
  const { t = 0, vel = 1, bars = [0.5, 0.72, 0.34, 0.16, 0.42, 0.78, 0.56], pulso = 0 } = o;
  macWindow(g, x, y, w, h, { title: "preview", bgCor: "#191a1f", r: 16, chromeH: 40, titleSize: 19 });
  const radii = [255, 62, 112];
  // badge de velocidade
  const bx = x + w - 66, by = y + 54;
  rr(g, bx, by, 52, 38, 19); g.fillStyle = "rgba(255,255,255,.10)"; g.fill();
  textT(g, `${vel}×`, bx + 26, by + 26, { size: 21, font: "MXB", color: C.white, align: "center" });
  const inner = x + 34, iw = w - 68, base = y + h - 60, maxH = 150;
  const bw = iw / 13;
  bars.forEach((v0, i) => {
    // pulso acelera com vel (o ref: clicou "mais rápido" → barras disparam)
    const v = pulso ? clamp(v0 * (1 + pulso * Math.sin(t * (vel > 1 ? 15 : 7) + i * 1.7)), 0.04, 1) : v0;
    const bh = v * maxH, xb = inner + i * (iw / bars.length) + bw * 0.2;
    const larg = iw / bars.length - bw * 0.5;
    rr(g, xb, base - bh, larg, bh, larg / 2);
    g.fillStyle = i % 2 ? C.teal : "#7b5df9"; g.fill();
  });
  // bolinha branca — pinga na barra; após o "mais rápido" ela dispara
  const cxi = inner + iw * (0.42 + 0.3 * Math.sin(t * (vel > 1 ? 11 : 2.6)));
  const cyi = base - maxH * 0.86;
  circle(g, cxi, cyi, 15); g.fillStyle = "#f7f4ef"; g.fill();
  return { base, inner, iw };
}

// --- campo de mensagem (chat) com botão roxo
export function chatInput(g, x, y, w, o = {}) {
  const { texto = "", h = 60, alpha = 1, caret = true } = o;
  g.save(); g.globalAlpha *= alpha;
  rr(g, x, y, w, h, h / 2); g.fillStyle = "#1d1c24"; g.fill();
  g.strokeStyle = "rgba(255,255,255,.10)"; g.lineWidth = 1.6; g.stroke();
  if (texto) textT(g, texto, x + 26, y + h / 2 + 8, { size: 22, font: "MSemi", color: "#e9e9ef" });
  const bw = 44;
  rr(g, x + w - bw - 10, y + (h - bw) / 2, bw, bw, bw / 2); g.fillStyle = C.purple; g.fill();
  g.strokeStyle = "#fff"; g.lineWidth = 2.6; g.lineCap = "round"; g.lineJoin = "round";
  g.beginPath(); g.moveTo(x + w - bw / 2 - 10, y + h / 2 + 8); g.lineTo(x + w - bw / 2 - 10, y + h / 2 - 7); g.stroke();
  g.beginPath();
  g.moveTo(x + w - bw / 2 - 16, y + h / 2 - 1); g.lineTo(x + w - bw / 2 - 10, y + h / 2 - 8); g.lineTo(x + w - bw / 2 - 4, y + h / 2 - 1);
  g.stroke();
  g.restore();
}

// --- bloco de código / chaves do "escrever código"
export function codeBrackets(g, x, y, a = 1, esc = 1.9) {
  g.save(); g.globalAlpha *= a;
  g.strokeStyle = "#55545c"; g.lineWidth = 11; g.lineCap = "round"; g.lineJoin = "round";
  g.translate(x, y); g.scale(esc, esc);
  g.beginPath(); g.moveTo(-24, -46); g.quadraticCurveTo(-46, -46, -46, -24); g.lineTo(-46, -8);
  g.quadraticCurveTo(-46, 0, -60, 0); g.quadraticCurveTo(-46, 0, -46, 8); g.lineTo(-46, 24);
  g.quadraticCurveTo(-46, 46, -24, 46); g.stroke();
  g.beginPath(); g.moveTo(24, -46); g.quadraticCurveTo(46, -46, 46, -24); g.lineTo(46, -8);
  g.quadraticCurveTo(46, 0, 60, 0); g.quadraticCurveTo(46, 0, 46, 8); g.lineTo(46, 24);
  g.quadraticCurveTo(46, 46, 24, 46); g.stroke();
  g.restore();
}

// --- pilha de cards 3D com tags </section id="sNN">
export function cardStack(g, o = {}) {
  const { t = 0, p = 1, marca = "NODO\nPRIME" } = o;
  const cards = [
    { id: "s01", x: 150, y: 560, w: 300, h: 460, rot: -0.12, kind: "texto" },
    { id: "s02", x: 470, y: 470, w: 300, h: 460, rot: -0.12, kind: "circulo" },
    { id: "s03", x: 790, y: 380, w: 300, h: 460, rot: -0.12, kind: "escrito" },
    { id: "s04", x: 200, y: 900, w: 300, h: 460, rot: -0.12, kind: "vazio" },
    { id: "s05", x: 520, y: 830, w: 300, h: 460, rot: -0.12, kind: "marca" },
    { id: "s06", x: 840, y: 760, w: 300, h: 460, rot: -0.12, kind: "pct" },
  ];
  g.save();
  g.translate(360, 640); g.rotate(-0.12); g.scale(1, 1); g.translate(-360, -640);
  for (const c of cards) {
    const a = enter(t, 0.02 + (["s02", "s03", "s01", "s05", "s06", "s04"].indexOf(c.id) * 0.05), 0.4);
    if (a < 0.01) continue;
    const idx = ["s02", "s03", "s01", "s05", "s06", "s04"].indexOf(c.id);
    // percurso 3D por card (o ref: desce, sobe, vai pro lado, gira e vai pro fundo)
    const ph = (1 - a);
    const arcY = Math.sin(a * Math.PI) * 34 * (idx % 2 ? 1 : -1);
    const arcX = Math.cos(a * Math.PI) * 46 * (idx % 3 === 0 ? 1 : -1);
    const spin = (1 - a) * 0.34 * (idx % 2 ? 1 : -1);
    const scale3 = 1 + ph * 0.28;
    g.save(); g.globalAlpha *= a;
    g.translate(c.x + c.w / 2 + arcX, c.y + c.h / 2 + arcY - ph * 220);
    g.rotate(c.rot + spin); g.scale(scale3, scale3);
    g.translate(-(c.x + c.w / 2), -(c.y + c.h / 2));
    rr(g, c.x, c.y, c.w, c.h, 18); g.fillStyle = c.kind === "escrito" ? C.cream : "#131417"; g.fill();
    g.strokeStyle = "rgba(255,255,255,.12)"; g.lineWidth = 2; g.stroke();
    if (c.kind === "texto") {
      textT(g, "ESSE", c.x + 34, c.y + 200, { size: 58, font: "AB", color: C.white, tracking: -2 });
      textT(g, "VÍDEO", c.x + 34, c.y + 258, { size: 58, font: "AB", color: C.white, tracking: -2 });
      rr(g, c.x + 30, c.y + 286, 168, 52, 10); g.fillStyle = C.orange; g.fill();
      textT(g, "agora", c.x + 48, c.y + 324, { size: 38, font: "AB", color: C.white });
    } else if (c.kind === "circulo") {
      circle(g, c.x + 96, c.y + 172, 66); g.fillStyle = C.orange2; g.fill();
      circle(g, c.x + 96, c.y + 172, 30); g.fillStyle = "#131417"; g.fill();
    } else if (c.kind === "escrito") {
      textT(g, "Ele foi", c.x + 42, c.y + 186, { size: 22, font: "MXB", color: C.grayText });
      textT(g, "escrito.", c.x + 42, c.y + 250, { size: 52, font: "ISI", color: "#171610" });
    } else if (c.kind === "marca") {
      circle(g, c.x + 60, c.y + 150, 12); g.fillStyle = C.orange2; g.fill();
      textT(g, marca.split("\n")[0], c.x + 40, c.y + 250, { size: 48, font: "AB", color: C.white, tracking: -1.6 });
      textT(g, marca.split("\n")[1] || "GRAPHICS", c.x + 40, c.y + 296, { size: 30, font: "AB", color: "#8f8f96", tracking: -1 });
      g.strokeStyle = C.yellow; g.lineWidth = 4; rr(g, c.x + 44, c.y + 330, 18, 18, 4); g.stroke();
    } else if (c.kind === "pct") {
      textT(g, "99%", c.x + 34, c.y + 250, { size: 72, font: "MXB", color: C.white, tracking: -3 });
    }
    g.restore();
    // tag </section id="sNN">
    g.save(); g.globalAlpha *= a;
    textT(g, `<section id="${c.id}">`, c.x - 40, c.y - 14, { size: 19, font: "Mono", color: "#8a8a92" });
    g.restore();
  }
  g.restore();
}

// --- grade de cards 3x3 para "são feitas"
// Espaçamento UNIFORME (antes se sobrepunham) e bloco inteiro deslocável: a cena
// empurra a grade para a esquerda/baixo/direita e depois deixa cair ao centro.
export function gridCards(g, o = {}) {
  const { t = 0, dx = 0, dy = 0, sc = 1, rot = -0.09, shear = 0.15, marca = "NODO\nPRIME", mote = "VÍDEO EM HTML" } = o;
  const w = 158, h = 212, gap = 22;
  const x0 = 360 - (3 * w + 2 * gap) / 2, y0 = 640 - (3 * h + 2 * gap) / 2;
  const kinds = ["texto", "circulo", "escrito", "vazio", "marca", "pct", "codigo", "grafico", "padrao"];
  g.save();
  g.translate(360 + dx, 640 + dy);
  g.rotate(rot); g.transform(1, 0, -shear, 1, 0, 0); g.scale(sc, sc);
  g.translate(-360, -640);
  kinds.forEach((kind, i) => {
    const a = enter(t, 0.04 + i * 0.05, 0.42, easeOutBack);
    if (a <= 0.01) return;
    const cx = x0 + (i % 3) * (w + gap), cy = y0 + Math.floor(i / 3) * (h + gap);
    const sobe = (1 - clamp(a, 0, 1)) * 56;
    g.save(); g.globalAlpha *= clamp(a, 0, 1);
    g.translate(0, sobe);
    textT(g, `<section id="s0${i + 1}">`, cx + 2, cy - 12, { size: 11, font: "Mono", color: "#7d7d85" });
    rr(g, cx, cy, w, h, 12); g.fillStyle = kind === "escrito" ? C.cream : "#131417"; g.fill();
    g.strokeStyle = "rgba(255,255,255,.15)"; g.lineWidth = 1.4; g.stroke();
    if (kind === "texto") {
      textT(g, "ESSE", cx + 22, cy + 74, { size: 30, font: "AB", color: C.white, tracking: -1.2 });
      textT(g, "VÍDEO", cx + 22, cy + 108, { size: 30, font: "AB", color: C.white, tracking: -1.2 });
      rr(g, cx + 20, cy + 122, 86, 28, 6); g.fillStyle = C.orange; g.fill();
      textT(g, "agora", cx + 31, cy + 144, { size: 20, font: "AB", color: C.white });
    } else if (kind === "circulo") {
      g.strokeStyle = C.orange2; g.lineWidth = 30;
      circle(g, cx + w / 2, cy + h / 2 - 10, 40); g.stroke();
    } else if (kind === "escrito") {
      textT(g, "Ele foi", cx + 24, cy + 92, { size: 12, font: "MXB", color: C.grayText });
      textT(g, "escrito.", cx + 20, cy + 134, { size: 30, font: "ISI", color: "#171610" });
    } else if (kind === "vazio") {
      g.fillStyle = C.orange; g.fillRect(cx + w / 2 - 1, cy + 92, 3, 34);
      cursor(g, cx + w / 2 - 34, cy + 108, { label: "EDITOR CHEFE", cor: C.orange, scale: 0.4 });
    } else if (kind === "marca") {
      circle(g, cx + 28, cy + 46, 7); g.fillStyle = C.orange2; g.fill();
      textT(g, marca.split("\n")[0], cx + 20, cy + 104, { size: 24, font: "AB", color: C.white, tracking: -0.9 });
      textT(g, marca.split("\n")[1] || "PRIME", cx + 20, cy + 130, { size: 24, font: "AB", color: C.white, tracking: -0.9 });
      textT(g, mote, cx + 20, cy + 158, { size: 11, font: "AB", color: "#8f8f96", tracking: -0.3 });
      g.strokeStyle = C.yellow; g.lineWidth = 2.2; rr(g, cx + 22, cy + 168, 10, 10, 2); g.stroke();
    } else if (kind === "pct") {
      textT(g, "99%", cx + 18, cy + 120, { size: 44, font: "AB", color: C.white, tracking: -1.8 });
    } else if (kind === "codigo") {
      const ls = [["<html>", "#7c9bf0"], [" <section>", "#e8603a"], ["  <h1>", "#8fd48f"], [" </section>", "#e8603a"]];
      ls.forEach(([txt, cor], k) => textT(g, txt, cx + 18, cy + 60 + k * 26, { size: 15, font: "Mono", color: cor }));
    } else if (kind === "grafico") {
      const hh = [42, 74, 56, 96, 68];
      hh.forEach((hv, k) => {
        rr(g, cx + 22 + k * 24, cy + 168 - hv, 15, hv, 5);
        g.fillStyle = k === 3 ? C.orange : "rgba(255,255,255,.22)"; g.fill();
      });
    } else {
      g.fillStyle = "rgba(255,255,255,.16)";
      for (let ry = 0; ry < 7; ry++) for (let rxx = 0; rxx < 5; rxx++) { circle(g, cx + 34 + rxx * 24, cy + 52 + ry * 24, 2.3); g.fill(); }
    }
    g.restore();
  });
  g.restore();
}

// --- texto com seleção azul + barra de ferramentas (trema)
// shake > 0: as letras Tremem em alta frequência (o ref "desfaz" a palavra);
// o chip e a toolbar continuam parados. t = tempo do bloco.
export function selectionText(g, x, y, txt, o = {}) {
  const { size = 96, alpha = 1, sel = 1, toolbar = false, cursorFerramenta = null, shake = 0, t = 0 } = o;
  g.save(); g.globalAlpha *= alpha;
  // SOMENTE as letras tremem (o chip fica parado — correção do usuário)
  const w = measureT(g, txt, { size, font: "AB", tracking: -size * 0.03 });
  if (sel > 0) {
    g.save(); g.globalAlpha *= clamp(sel, 0, 1);
    g.fillStyle = "#1f3a7a"; g.fillRect(x - 10, y - size * 0.76, w + 20, size * 1.0);
    g.restore();
  }
  if (shake > 0) {
    let cx2 = x;
    [...txt].forEach((ch, i) => {
      const cw = measureT(g, ch, { size, font: "AB" });
      if (ch !== " ") {
        const dx = Math.sin(t * 69 + i * 7.3) * size * 0.6 * shake;
        const dy = Math.sin(t * 53 + i * 4.9) * size * 0.4 * shake;
        const rz = Math.sin(t * 61 + i * 9.1) * 0.22 * shake;
        g.save();
        g.translate(cx2 + cw / 2 + dx, y - size * 0.36 + dy);
        g.rotate(rz);
        textT(g, ch, -cw / 2, size * 0.36, { size, font: "AB", color: C.white });
        g.restore();
      }
      cx2 += cw - size * 0.03;
    });
  } else {
    textT(g, txt, x, y, { size, font: "AB", color: C.white, tracking: -size * 0.03 });
  }
  if (toolbar) {
    const tw = 250, th = 46, tx = x + 96, ty = y - size * 1.5;
    rr(g, tx, ty, tw, th, 10); g.fillStyle = "#22222a"; g.fill();
    g.strokeStyle = "rgba(255,255,255,.1)"; g.lineWidth = 1.5; g.stroke();
    textT(g, "B", tx + 20, ty + 31, { size: 23, font: "MXB", color: "#e8e8ee" });
    textT(g, "I", tx + 52, ty + 31, { size: 23, font: "MXB", color: "#e8e8ee" });
    textT(g, "U", tx + 82, ty + 31, { size: 23, font: "MXB", color: "#e8e8ee" });
    circle(g, tx + 118, ty + 23, 9); g.fillStyle = C.orange; g.fill();
    poly(g, [[tx + 148, ty + 27], [tx + 156, ty + 23], [tx + 152, ty + 15], [tx + 144, ty + 19]]); g.fillStyle = "#c9c9d2"; g.fill();
    // pílula "Trêmer"
    rr(g, tx + 96, ty + 4, 138, 38, 8); g.fillStyle = "#3b3bd0"; g.fill();
    textT(g, "Trêmer", tx + 168, ty + 30, { size: 20, font: "MB", color: C.white, align: "center" });
    poly(g, [[tx + 120, ty + 22], [tx + 132, ty + 22], [tx + 126, ty + 30]]); g.fillStyle = "#3b3bd0"; g.fill();
    textT(g, "⌁", tx + 138, ty + 29, { size: 18, font: "MSemi", color: "#e8e8ee" });
    if (cursorFerramenta) cursor(g, tx + 168, ty + 30, { label: "EDITOR CHEFE", cor: C.orange, scale: 0.62 });
  }
  g.restore();
  return w;
}

// ================================================================ MOTOR DE MOVIMENTO
// Regra soberana: cada draw é estado limpo por frame — TODO movimento aqui é
// função determinística de t. Nada de estado acumulado.

export const EASE = {
  outCubic: (t) => 1 - Math.pow(1 - t, 3),
  outQuart: (t) => 1 - Math.pow(1 - t, 4),
  outExpo: easeOutExpo,
  outBack: (t, s = 1.56) => easeOutBack(t, s),
  inBack: (t, s = 1.56) => t * t * ((s + 1) * t - s),
  inOutCubic: easeInOut,
  outCirc: (t) => (t >= 1 ? 1 : Math.sqrt(1 - Math.pow(1 - t, 2))),
  inOutQuad: (t) => (t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2),
};

// "tempo relativo": fn aplicada à janela [t0, t0+dur]; determinística
export const tr = (t, t0, dur, fn = easeOut) => fn(clamp((t - t0) / Math.max(dur, 1e-6), 0, 1));

// pseudo-aleatório determinístico (igual em todo frame com o mesmo seed)
export const hash01 = (n) => {
  const x = Math.sin(n * 127.1 + 311.7) * 43758.5453;
  return x - Math.floor(x); // [0,1)
};

// ---------------------------------------------------------------- câmera viva
// push-in leve contínuo + drift senoidal por bloco, centrado no foco.
// Garante cobertura de bordas: escala mínima cobre o drift + 3px de sangria.
export function withCam(g, t, t0, t1, o = {}, fn) {
  const {
    push = 0.03, ease = easeInOut, cx = 360, cy = 640,
    drift = 4, period = 4, fase = 0, under = C.bg, rot = 0,
  } = o;
  g.save();
  if (under) { g.fillStyle = under; g.fillRect(0, 0, REF_W, REF_H + 2); }
  const u = t1 > t0 ? clamp((t - t0) / (t1 - t0), 0, 1) : 0;
  const k = 1 + push * ease(u);
  const tt = t - fase;
  const dx = drift ? Math.sin(tt * (Math.PI * 2 / period) + fase) * drift : 0;
  const dy = drift ? Math.cos(tt * (Math.PI * 2 / period) * 0.83 + 1.3) * drift : 0;
  const ksx = Math.max(k, 1 + (Math.abs(dx) + 3) / (REF_W / 2));
  const ksy = Math.max(k, 1 + (Math.abs(dy) + 3) / (REF_H / 2));
  g.translate(cx, cy);
  if (rot) g.rotate(rot * Math.sin(u * Math.PI * 2 / (period || 4)));
  g.scale(ksx, ksy);
  g.translate(-cx + dx, -cy + dy);
  fn(g);
  g.restore();
}

// ---------------------------------------------------------------- entrada com peso (scale 0.92→1 outBack)
export function popIn(g, t, t0, dur, o = {}, fn) {
  const { cx = 360, cy = 640, s0 = 0.92, back = 1.56, fn: efn = null } = o;
  if (t < t0) return;
  const e = efn ? tr(t, t0, dur, efn) : tr(t, t0, dur, (u) => easeOutBack(u, back));
  const s = lerp(s0, 1, e);
  g.save();
  g.translate(cx, cy); g.scale(s, s); g.translate(-cx, -cy);
  fn(g);
  g.restore();
}

// ---------------------------------------------------------------- typing de verdade
// letra-a-letra; as letras "em progresso" ficam CINZA antes de virar brancas.
// Retorna { n, w, hx, hy } — n letras visíveis, largura visível, posição do cursor.
export function typing(g, txt, x, y, o = {}) {
  const {
    size = 40, font = "AB", tracking = 0, align = "left",
    color = C.white, cinza = "#8a8a8e", meio = "#b6b6bc",
    t, t0 = 0, ms = 75, solid = 0.16, caret = false, caretCor = null, caretW = null, caretAlpha = 0.95,
  } = o;
  const chars = [...txt];
  g.save();
  g.font = `${size}px ${font}`;
  const widths = chars.map((c) => g.measureText(c).width);
  const total = widths.reduce((a, b) => a + b, 0) + tracking * Math.max(0, chars.length - 1);
  const lt = t - t0;
  const nVis = lt < 0 ? 0 : clamp(Math.floor(lt / (ms / 1000)) + 1, 0, chars.length);
  let cx = align === "center" ? x - total / 2 : align === "right" ? x - total : x;
  g.textBaseline = "alphabetic";
  let wVis = 0, headX = cx;
  for (let i = 0; i < nVis; i++) {
    const age = lt - i * (ms / 1000);
    let cor = color;
    if (age < solid) cor = cinza;
    else if (age < solid * 1.6 && color !== cinza) cor = meio;
    g.fillStyle = cor;
    g.globalAlpha *= 1;
    g.fillText(chars[i], cx, y);
    cx += widths[i] + tracking;
    wVis = cx - (align === "center" ? x - total / 2 : align === "right" ? x - total : x);
  }
  headX = cx;
  g.restore();
  // cursor de texto/caneta colado na última letra
  if (caret && nVis > 0) {
    const wlc = caretW || Math.max(2, size * 0.045);
    const blink = Math.floor(t * 2.6) % 2 === 0;
    if (blink) {
      g.save();
      g.globalAlpha *= caretAlpha;
      g.fillStyle = caretCor || C.orange;
      g.fillRect(caretW != null ? caretW : headX, y - size * 0.74, wlc, size * 0.92);
      g.restore();
    }
  }
  return { n: nVis, w: wVis, hx: headX, end: nVis >= chars.length };
}

// ---------------------------------------------------------------- rascunho (display grande entra "sujado" e solidifica)
// cópias ghost convergindo + alpha ramp; ao solidificar só resta o texto limpo.
export function draftText(g, txt, x, y, o = {}) {
  const {
    size = 40, font = "AB", tracking = 0, align = "left", color = C.white,
    t, t0 = 0, dur = 0.35, copies = 4, amp = 22, ghostA = 0.35,
  } = o;
  const a = clamp((t - t0) / dur, 0, 1);
  const total = measureT(g, txt, { size, font, tracking });
  if (a <= 0) return total;
  const e = easeOut(a);
  let ox = align === "center" ? x - total / 2 : align === "right" ? x - total : x;
  // ghosts (do mais parcelado pro mais próximo)
  for (let i = copies; i >= 1; i--) {
    const d = (1 - e) * (i / copies);
    if (d < 0.02) continue;
    const gx = (hash01(i * 3.3 + t0 * 7) - 0.5) * 2 * amp * d;
    const gy = (hash01(i * 8.1 + t0 * 13) - 0.5) * 2 * amp * 0.6 * d;
    g.save();
    g.globalAlpha *= ghostA / i * e;
    textT(g, txt, ox + gx, y + gy, { size, font, tracking, align: "left", color });
    g.restore();
  }
  // sólido
  g.save();
  g.globalAlpha *= e;
  textT(g, txt, ox, y, { size, font, tracking, align: "left", color });
  g.restore();
  return total;
}

// ---------------------------------------------------------------- aberração cromática RGB
export function rgbSplitText(g, txt, x, y, o = {}) {
  const {
    size = 40, font = "AB", tracking = 0, align = "center", color = C.white,
    amount = 2.5, alpha = 0.4, tremor = 0, t = 0,
  } = o;
  const jx = tremor ? Math.sin(t * 41.0) * tremor + (hash01(Math.floor(t * 30)) - 0.5) * tremor : 0;
  const jy = tremor ? Math.cos(t * 37.0) * tremor * 0.6 : 0;
  g.save();
  g.globalAlpha *= alpha;
  textT(g, txt, x - amount + jx, y + jy, { size, font, tracking, align, color: "#22d3ee" });
  textT(g, txt, x + amount - jx, y - jy, { size, font, tracking, align, color: "#f0396b" });
  g.restore();
  textT(g, txt, x, y, { size, font, tracking, align, color });
}

// ---------------------------------------------------------------- cursor viajando em arco (+ streaks em velocidade alta)
export function cursorArc(g, t, t0, dur, a, b, o = {}) {
  const {
    label = null, cor = C.orange, scale = 1, arc = 0.09, streak = true,
    fps = 30, streakMin = 1300, after = null, alpha = 1,
  } = o;
  if (t < t0) return null;
  const [x0, y0] = a, [x1, y1] = b;
  const dx = x1 - x0, dy = y1 - y0;
  const dist = Math.max(1, Math.hypot(dx, dy));
  const nx = -dy / dist, ny = dx / dist;
  const off = dist * arc;
  const posAt = (tt) => {
    const p = tr(tt, t0, dur, easeInOut);
    const s = Math.sin(Math.PI * p);
    return [x0 + dx * p - nx * off * s, y0 + dy * p - ny * off * s];
  };
  const vel = 1 / dur; // velocidade normalizada por segundo atual
  // streaks: cópias fantasma atrás do cursor quando rápido
  if (streak) {
    for (let k = 1; k <= 3; k++) {
      const tt = t - (k / fps) * (dur > 0 ? dur * 0.22 : 0.05);
      if (tt < t0 || tt > t0 + dur) continue;
      const [sx, sy] = posAt(tt);
      const gap = Math.hypot(sx - posAt(t)[0], sy - posAt(t)[1]);
      if (gap < 26) continue;
      g.save();
      g.globalAlpha *= (0.3 / k) * alpha;
      cursor(g, sx, sy, { scale: scale * (1 - k * 0.06) });
      g.restore();
    }
  }
  const [px, py] = posAt(t);
  const lt = t - t0;
  const aFin = lt < 0.12 ? tr(lt, 0, 0.12, easeOut) : 1;
  cursor(g, px, py, { label: label === null ? null : (lt > (o.labelDelay ?? 0.25) ? label : null), cor, scale, alpha: aFin * alpha });
  return [px, py];
}

// ---------------------------------------------------------------- ripple de clique
export function ripple(g, x, y, t, t0, o = {}) {
  const { cor = C.orange, anel = 2, dur = 0.75, r0 = 8, r1 = 95, lw = 3 } = o;
  for (let i = 0; i < anel; i++) {
    const p = tr(t, t0 + i * 0.2, dur, easeOut);
    if (p <= 0.01 || p >= 1) continue;
    g.save();
    g.globalAlpha *= (1 - p) * 0.55;
    circle(g, x, y, lerp(r0, r1, p));
    g.strokeStyle = cor; g.lineWidth = lerp(lw, 1, p); g.stroke();
    g.restore();
  }
}

// ---------------------------------------------------------------- strikethrough vermelho que se desenha
export function strikeIn(g, x0, x1, y, t, t0, o = {}) {
  const {
    cor = "#e5484d", lw = 12, dur = 0.32, tip = 0.09,
  } = o;
  const p = tr(t, t0, dur, easeOut);
  if (p <= 0) return p;
  const w = (x1 - x0) * p;
  g.save();
  g.strokeStyle = cor; g.lineCap = "round";
  g.lineWidth = lw;
  g.beginPath(); g.moveTo(x0, y); g.lineTo(x0 + w, y); g.stroke();
  // ponta irregular: um risco curto/mais fino além da ponta
  const tick = w < (x1 - x0) ? lw * 0.7 : 0;
  if (tick) {
    g.lineWidth = lw * 0.55;
    g.beginPath(); g.moveTo(x0 + w, y - lw * 0.12); g.lineTo(x0 + w + lw * tip, y + lw * 0.06); g.stroke();
  }
  g.restore();
  return p;
}

// ---------------------------------------------------------------- iris (transição circular de fechamento)
export function iris(g, t, t0, dur, o = {}) {
  const { cx = 360, cy = 640, r0 = 1000, r1 = 60, cor = "#08080a" } = o;
  const p = tr(t, t0, dur, easeInOut);
  if (p <= 0) return;
  const r = lerp(r0, r1, p);
  g.save();
  g.fillStyle = cor;
  g.beginPath();
  g.rect(0, 0, REF_W, REF_H);
  g.arc(cx, cy, r, 0, Math.PI * 2, true); // sentido oposto = buraco
  g.fill("evenodd");
  // anel de borda
  g.beginPath();
  g.arc(cx, cy, r + 14, 0, Math.PI * 2);
  g.arc(cx, cy, r, 0, Math.PI * 2, true);
  g.fillStyle = "rgba(255,255,255,.05)";
  g.fill("evenodd");
  g.restore();
}

// ---------------------------------------------------------------- contadores com outExpo (keyframes monotônicos)
export function counterKf(t, kfs, o = {}) {
  const { fn = easeOutExpo } = o; // kfs = [[t0, v0], [t1, v1], ...] tempo crescente
  if (t <= kfs[0][0]) return kfs[0][1];
  for (let i = 0; i < kfs.length - 1; i++) {
    const [ta, va] = kfs[i], [tb, vb] = kfs[i + 1];
    if (t < tb) return lerp(va, vb, fn(seg(t, ta, tb)));
  }
  return kfs[kfs.length - 1][1];
}

// --- chave de contorno + ferramenta (para "não abre software gráfico")
export function appIcon(g, x, y, s, a = 1) {
  g.save(); g.globalAlpha *= a;
  rr(g, x, y, s, s, s * 0.24); g.fillStyle = "#2c2c34"; g.fill();
  rr(g, x, y, s, s, s * 0.24); g.strokeStyle = "rgba(255,255,255,.09)"; g.lineWidth = 2; g.stroke();
  g.save(); g.translate(x + s / 2, y + s / 2); g.scale(s / 100, s / 100); g.rotate(-0.78);
  // corpo do lápis
  g.fillStyle = C.orange;
  rr(g, -9, -26, 18, 40, 3); g.fill();
  // ponta
  poly(g, [[-9, 14], [9, 14], [0, 30]]); g.fillStyle = "#f6bfa4"; g.fill();
  poly(g, [[-4, 24], [4, 24], [0, 30]]); g.fillStyle = "#2a2a30"; g.fill();
  // virola
  g.fillStyle = "#e9e1d6"; g.fillRect(-9, -30, 18, 6);
  g.fillStyle = C.orange; g.fillRect(-9, -34, 18, 5);
  g.restore();
  g.restore();
}
