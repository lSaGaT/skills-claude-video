// mov.mjs — MOTOR DE MOVIMENTO (a camada que faltava no kit)
//
// Diagnóstico que motivou este arquivo: o reel de referência (81,41 s) tem movimento
// médio de 2,74 (diferença média entre quadros consecutivos, 180x320 gray, 30 fps);
// a primeira réplica tinha 0,51 — 19%. Em 71 dos 81 segundos ela estava MORTA:
// o elemento entrava com fade, pousava e congelava. O ref nunca congela.
//
// Camadas, na ordem em que o ref as usa:
//   0. grão/atmosfera -> piso de movimento em TODO frame (~0,2-0,5)
//   1. câmera         -> push/pan/snap/whip + handheld (faz a cena respirar)
//   2. entrada        -> kick de impacto + overshoot (nada pousa sem peso)
//   3. vida           -> typing, caret, cursor viajando, playhead, contador
//   4. saída          -> derrete / ilete / whip (nunca fade seco)

import { createCanvas } from "@napi-rs/canvas";
import { REF_W, REF_H, clamp, lerp, hexA, C, measureT, textT } from "./kit.mjs";

export const M = {
  outExpo: (t) => (t >= 1 ? 1 : 1 - Math.pow(2, -10 * t)),
  outCubic: (t) => 1 - Math.pow(1 - t, 3),
  outQuint: (t) => 1 - Math.pow(1 - t, 5),
  inCubic: (t) => t * t * t,
  inOutCubic: (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2),
  inOutQuint: (t) => (t < 0.5 ? 16 * t * t * t * t * t : 1 - Math.pow(-2 * t + 2, 5) / 2),
  // smootherstep: acelera e desacelera sem "degrau" na derivada (o ref usa isso na câmera)
  smooth: (t) => t * t * t * (t * (t * 6 - 15) + 10),
  outBack: (t, s = 1.6) => 1 + (s + 1) * Math.pow(t - 1, 3) + s * Math.pow(t - 1, 2),
  inBack: (t, s = 1.6) => (s + 1) * t * t * t - s * t * t,
  outElastic: (t) =>
    t <= 0 ? 0 : t >= 1 ? 1 : Math.pow(2, -9 * t) * Math.sin((t * 10 - 0.75) * ((2 * Math.PI) / 3)) + 1,
};

export const p = (t, t0, dur, fn = M.smooth) => fn(clamp((t - t0) / Math.max(dur, 1e-6), 0, 1));

// ruído suave 1D determinístico (soma de senos => sem repetição óbvia)
export function noise1(x, seed = 0) {
  return (
    Math.sin(x * 1.000 + seed * 12.9898) * 0.5 +
    Math.sin(x * 2.137 + seed * 78.233) * 0.3 +
    Math.sin(x * 4.311 + seed * 37.719) * 0.2
  );
}

// ---------------------------------------------------------------- 0. grão
let TILES = null;
function tiles() {
  if (TILES) return TILES;
  TILES = [];
  for (let k = 0; k < 6; k++) {
    const cv = createCanvas(REF_W + 40, REF_H + 40);
    const g = cv.getContext("2d");
    const img = g.createImageData(cv.width, cv.height);
    const d = img.data;
    let s = 12345.67 + k * 977.13;
    const rnd = () => ((s = (s * 16807) % 2147483647) / 2147483647);
    for (let i = 0; i < d.length; i += 4) {
      const v = rnd();
      d[i] = d[i + 1] = d[i + 2] = 255;
      d[i + 3] = Math.floor(v * v * 46); // cauda longa: poucos pixels fortes
    }
    g.putImageData(img, 0, 0);
    TILES.push(cv);
  }
  return TILES;
}

// grão: 6 padrões alternados + deslocamento inteiro por frame.
// Alpha 0.5-0.8 é o que o ref mostra em fundo chapado (medido: ~0,3 de diff/frame).
export function grain(g, tf, o = {}) {
  const { alpha = 0.13, seed = 0, scale = 1 } = o;
  const T = tiles();
  const f = Math.round(tf * 30);
  const tile = T[Math.abs(f + seed) % T.length];
  const ox = -20 + ((Math.sin(f * 12.9898 + seed) * 43758.5453) % 1 + 1) % 1 * 20;
  const oy = -20 + ((Math.sin(f * 78.233 + seed * 3.1) * 43758.5453) % 1 + 1) % 1 * 20;
  g.save();
  g.globalAlpha *= alpha;
  g.drawImage(tile, ox / scale, oy / scale, tile.width / scale, tile.height / scale);
  g.restore();
}

// varredura de luz (sheen) que atravessa a cena de tempos em tempos
export function sheen(g, t, o = {}) {
  const { period = 3.4, dur = 0.9, alpha = 0.05, ang = -0.5, far = 900 } = o;
  const ph = (t / period) % 1;
  if (ph > dur / period) return;
  const u = M.smooth(ph * period / dur);
  const x = -far + u * far * 3;
  g.save();
  g.globalAlpha *= alpha * Math.sin(u * Math.PI);
  g.translate(x, 0);
  g.rotate(ang);
  const lg = g.createLinearGradient(0, 0, 240, 0);
  lg.addColorStop(0, "rgba(255,255,255,0)");
  lg.addColorStop(0.5, "rgba(255,255,255,1)");
  lg.addColorStop(1, "rgba(255,255,255,0)");
  g.fillStyle = lg;
  g.fillRect(0, -400, 240, REF_H + 800);
  g.restore();
}

// ---------------------------------------------------------------- 1. câmera
// keys: [{ t, zoom, x, y }] em coordenadas da cena (720x1280).
// zoom 1 = enquadramento cheio; os keys são interpolados com smootherstep.
export function camShot(g, lt, dur, s = {}, fn) {
  const {
    keys = null,
    zoom0 = 1,
    zoom1 = 1.06,
    focus = [360, 640],
    drift = 9,
    driftPeriod = 5.2,
    jit = 1.8,
    rot = 0.0016,
    under = C.bg,
    fadeIn = 0,
    kickAmt = 0,
    breath = 0.004,   // respiração do zoom (±0,4%): movimento natural sem tremer
    breathPeriod = 3.2,
  } = s;

  g.save();
  if (under) { g.fillStyle = under; g.fillRect(0, 0, REF_W, REF_H + 2); }

  // --- zoom por keyframes (ou push linear suavizado)
  let z = 1, px = 0, py = 0;
  const seq = keys && keys.length
    ? keys
    : [{ t: 0, zoom: zoom0 }, { t: dur, zoom: zoom1 }];
  if (seq.length === 1) z = seq[0].zoom ?? 1;
  for (let i = 0; i < seq.length - 1; i++) {
    const a = seq[i], b = seq[i + 1];
    if (lt >= a.t && lt < b.t) {
      const u = M.smooth(clamp((lt - a.t) / Math.max(b.t - a.t, 1e-6), 0, 1));
      z = lerp(a.zoom ?? 1, b.zoom ?? 1, u);
      px = lerp(a.x ?? 0, b.x ?? 0, u);
      py = lerp(a.y ?? 0, b.y ?? 0, u);
      break;
    }
    if (lt >= b.t) { z = b.zoom ?? 1; px = b.x ?? 0; py = b.y ?? 0; }
  }

  // --- handheld: deriva lenta + tremor fino (o "pulso" que o ref tem mesmo parado)
  const t = lt;
  const dx = (drift ? noise1(t / driftPeriod, 1) * drift : 0) + noise1(t * 2.1, 7) * jit;
  const dy = (drift ? noise1(t / driftPeriod + 0.37, 2) * drift : 0) + noise1(t * 2.37, 9) * jit;
  const rr = noise1(t / 3.1, 5) * rot;

  // respiração: dolly lentíssimo que nunca para (tira o quadro do congelado)
  if (breath) z *= 1 + breath * Math.sin((t / breathPeriod) * Math.PI * 2);

  // kick de entrada: 1 frame "batendo" 1,5% maior e assentando em 180 ms
  let kz = 1;
  if (kickAmt) {
    const u = clamp(lt / 0.22, 0, 1);
    kz = 1 + kickAmt * (1 - M.outCubic(u));
  }

  g.translate(focus[0] + px, focus[1] + py);
  g.rotate(rr);
  g.scale(z * kz, z * kz);
  g.translate(-focus[0], -focus[1]);
  if (fadeIn) g.globalAlpha *= clamp(lt / fadeIn, 0, 1);
  fn(g);
  g.restore();
}

// ---------------------------------------------------------------- 2. entrada com impacto
export function kickScale(g, lt, o = {}) {
  const { amt = 0.018, dur = 0.2, focus = [360, 640] } = o;
  const u = clamp(lt / dur, 0, 1);
  const s = 1 + amt * (1 - M.outCubic(u));
  g.save();
  g.translate(focus[0], focus[1]); g.scale(s, s); g.translate(-focus[0], -focus[1]);
  return () => g.restore();
}

// ---------------------------------------------------------------- 3. vida
// caret de texto (pisca em 2 Hz como o ref, com 1 frame de "respiração")
export function caret(g, x, y, h, t, o = {}) {
  const { cor = C.orange, w = 6, freq = 2.2, alpha = 0.95 } = o;
  if (Math.floor(t * freq) % 2) return;
  g.save();
  g.globalAlpha *= alpha;
  g.fillStyle = cor;
  g.fillRect(x, y, w, h);
  g.restore();
}

// revelação palavra-a-palavra (parágrafos que "se escrevem" na tela)
// retorna a posição final do caret
export function wordReveal(g, txt, x, y, o = {}) {
  const {
    size = 30, font = "MB", color = C.white, align = "left",
    t = 0, t0 = 0, gap = 0.075, rise = 9, lineH = 1.35, maxW = 560,
    caretOn = true, corAtual = C.orange,
  } = o;
  const words = txt.split(" ");
  g.save();
  g.font = `${size}px ${font}`;
  const sp = g.measureText(" ").width;
  // layout
  const lin = [[]];
  let cw = 0;
  for (const w of words) {
    const ww = g.measureText(w).width;
    if (cw + ww > maxW && lin[lin.length - 1].length) { lin.push([]); cw = 0; }
    lin[lin.length - 1].push(w);
    cw += ww + sp;
  }
  g.restore();
  let lastX = x, lastY = y;
  let i = 0;
  for (let li = 0; li < lin.length; li++) {
    g.save();
    g.font = `${size}px ${font}`;
    const lw = lin[li].reduce((a, w, k) => a + g.measureText(w).width + (k ? sp : 0), 0);
    let cx = align === "center" ? x - lw / 2 : align === "right" ? x - lw : x;
    const yy = y + li * size * lineH;
    g.restore();
    for (const w of lin[li]) {
      g.save();
      g.font = `${size}px ${font}`;
      const ww = g.measureText(w).width;
      g.restore();
      const a = clamp((t - t0 - i * gap) / 0.16, 0, 1);
      if (a > 0) {
        const novo = t - t0 - i * gap < 0.24;
        g.save();
        g.globalAlpha *= a;
        g.font = `${size}px ${font}`;
        g.fillStyle = novo && corAtual ? corAtual : color;
        g.textBaseline = "alphabetic";
        g.fillText(w, cx, yy + (1 - M.outCubic(a)) * rise);
        g.restore();
      }
      cx += ww + sp;
      lastX = cx; lastY = yy;
      i++;
    }
  }
  if (caretOn && t > t0) caret(g, lastX + 2, lastY - size * 0.78, size * 0.94, t, { w: Math.max(3, size * 0.09) });
  return { x: lastX, y: lastY };
}

// texto que CRESCE por passos, sem sobrepor o passo anterior (o defeito clássico:
// desenhar "são feitas" e depois "são feitas em" por cima => texto embolado).
// steps = [[t0, "texto cumulativo"], ...]; só o delta anima.
export function typeStep(g, steps, t, o = {}) {
  const {
    size = 40, font = "AB", tracking = 0, align = "left", x = 0, y = 0,
    color = C.white, novo = null, instant = 0.14, rise = 0.35, caretOn = false, caretCor = C.orange,
  } = o;
  let i = -1;
  for (let k = 0; k < steps.length; k++) if (t >= steps[k][0]) i = k;
  if (i < 0) return { w: 0, txt: "" };
  const cur = [...steps[i][1]], prevLen = i > 0 ? [...steps[i - 1][1]].length : 0;
  const u = clamp((t - steps[i][0]) / instant, 0, 1);
  const e = M.outCubic(u);
  const total = measureT(g, steps[i][1], { size, font, tracking });
  let cx = align === "center" ? x - total / 2 : align === "right" ? x - total : x;
  g.save();
  g.font = `${size}px ${font}`;
  g.textBaseline = "alphabetic";
  for (let k = 0; k < cur.length; k++) {
    const w = g.measureText(cur[k]).width;
    const ehNovo = k >= prevLen;
    g.save();
    if (ehNovo) {
      g.globalAlpha *= e;
      g.fillStyle = novo && u < 1 ? novo : color;
      g.fillText(cur[k], cx, y + (1 - e) * size * rise);
    } else {
      g.fillStyle = color;
      g.fillText(cur[k], cx, y);
    }
    g.restore();
    cx += w + tracking;
  }
  g.restore();
  if (caretOn) caret(g, cx + 3, y - size * 0.78, size * 0.94, t, { cor: caretCor });
  return { w: total, txt: steps[i][1] };
}

// cursor viajando por keys [{t,x,y,click?}] com arco perpendicular e antecipação
export function cursorTravel(g, t, keys, o = {}) {
  const {
    label = null, cor = C.orange, scale = 1, arc = 0.12,
    trail = true, dip = 0.55, clickLabel = null,
  } = o;
  if (!keys.length) return null;
  let i = 0;
  while (i < keys.length - 1 && t >= keys[i + 1].t) i++;
  const a = keys[i], b = keys[Math.min(i + 1, keys.length - 1)];
  let u = b === a ? 1 : clamp((t - a.t) / Math.max(b.t - a.t, 1e-6), 0, 1);
  const e = M.inOutCubic(u);
  const dx = (b.x - a.x), dy = (b.y - a.y);
  const d = Math.hypot(dx, dy) || 1;
  // arco: deslocamento perpendicular proporcional à distância
  const bow = Math.sin(e * Math.PI) * d * arc;
  const nx = -dy / d, ny = dx / d;
  let x = a.x + dx * e + nx * bow;
  let y = a.y + dy * e + ny * bow;
  // antecipação antes do clique: recua 6 px e afunda
  let sc = scale;
  if (b.click) {
    const au = clamp((t - (b.t - 0.16)) / 0.16, 0, 1);
    if (au > 0 && au < 1) { x -= 6 * Math.sin(au * Math.PI); y += 4 * Math.sin(au * Math.PI); }
    sc *= 1 - dip * 0.09 * Math.sin(clamp((t - (b.t - 0.16)) / 0.16, 0, 1) * Math.PI);
  }
  if (trail) {
    for (let k = 3; k >= 1; k--) {
      const tk = t - k * 0.035;
      const uu = b === a ? 1 : clamp((tk - a.t) / Math.max(b.t - a.t, 1e-6), 0, 1);
      if (uu > 0 && uu < 1) {
        const ee = M.inOutCubic(uu);
        const xx = a.x + dx * ee + nx * Math.sin(ee * Math.PI) * d * arc;
        const yy = a.y + dy * ee + ny * Math.sin(ee * Math.PI) * d * arc;
        g.save();
        g.globalAlpha *= 0.18 * (1 - k / 4);
        g.fillStyle = "#ffffff";
        g.beginPath(); g.arc(xx, yy, 3.2, 0, Math.PI * 2); g.fill();
        g.restore();
      }
    }
  }
  drawPointer(g, x, y, { label, cor, scale: sc });
  for (const k of keys) if (k.click) ringClick(g, k.x, k.y, t, k.t, { cor });
  return { x, y };
}

function drawPointer(g, x, y, o) {
  const { label = null, cor = C.orange, scale = 1 } = o;
  g.save();
  g.translate(x, y); g.scale(scale * 2.4, scale * 2.4);
  const arrow = [[0, 0], [0, 26], [6.5, 19.5], [11, 29], [16, 26.5], [11.5, 17.5], [19.5, 16.5]];
  g.beginPath();
  arrow.forEach(([ax, ay], i) => (i ? g.lineTo(ax, ay) : g.moveTo(ax, ay)));
  g.closePath();
  // cursor do ref: GRANDE e LARANJA (prints do usuário)
  g.fillStyle = C.orange; g.fill();
  g.lineWidth = 1.4; g.strokeStyle = "#ffffff"; g.stroke();
  if (label) {
    g.font = "700 17px MXB";
    const w = g.measureText(label).width + 18;
    g.fillStyle = cor;
    g.beginPath();
    const bx = 15, by = 15;
    g.roundRect ? g.roundRect(bx, by, w, 25, 6) : g.rect(bx, by, w, 25);
    g.fill();
    g.fillStyle = "#fff";
    g.fillText(label, bx + 9, by + 18);
  }
  g.restore();
}

// anel de clique: 2 anéis expandindo, o "causa→efeito" do ref
export function ringClick(g, x, y, t, t0, o = {}) {
  const { cor = C.orange, dur = 0.55, r1 = 90 } = o;
  const u = (t - t0) / dur;
  if (u < 0 || u > 1) return;
  g.save();
  g.strokeStyle = cor;
  for (const [k, d] of [[1, 0], [0.62, 0.12]]) {
    const uu = (t - t0 - d) / (dur - d);
    if (uu < 0 || uu > 1) continue;
    g.globalAlpha *= (1 - uu) * 0.55 * k;
    g.lineWidth = 3.4 * (1 - uu) + 1;
    g.beginPath(); g.arc(x, y, 6 + uu * r1, 0, Math.PI * 2); g.stroke();
  }
  g.restore();
}

// stagger de lista: devolve o progresso de cada item
export const stagger = (t, t0, i, gap = 0.06, dur = 0.26, fn = M.outBack) =>
  fn(clamp((t - t0 - i * gap) / dur, 0, 1));

// micro-oscilação de "objeto vivo" (usar em cards/pills parados)
export const sway = (t, amp = 1.6, period = 3.1, phase = 0) =>
  Math.sin((t / period) * Math.PI * 2 + phase) * amp;

// ---------------------------------------------------------------- 3b. cinético
// entrada letra-a-letra com dispersão + rastro (o ref voa letras espalhadas nos
// beats cinéticos — folha 15,5–16,5 s do meta-demo: letras grandes girando com blur).
// Cada letra parte de um offset/rotação determinísticos (noise1) e pousa com outCubic.
export function lettersFly(g, txt, x, y, t, o = {}) {
  const {
    size = 62, font = "AB", color = C.white, align = "center", tracking = 0,
    t0 = 0, gap = 0.05, dur = 0.5, spread = 180, rot = 0.45, trail = true, seed = 1,
    from = 1, // as letras chegam maiores (o ref voa glifos grandes que encolhem ao pousar)
  } = o;
  const total = measureT(g, txt, { size, font, tracking });
  let cx = align === "center" ? x - total / 2 : align === "right" ? x - total : x;
  [...txt].forEach((ch, i) => {
    const w = measureT(g, ch, { size, font });
    const u = clamp((t - t0 - i * gap) / dur, 0, 1);
    if (u > 0 && ch !== " ") {
      const e = M.outCubic(u);
      const dx = noise1(i * 3.7 + seed, seed) * spread * (1 - e);
      const dy = noise1(i * 5.1 + seed, seed + 3) * spread * (1 - e);
      const rz = noise1(i * 2.3 + seed, seed + 7) * rot * (1 - e);
      const sc = lerp(from, 1, e);
      g.save();
      g.globalAlpha *= Math.min(1, u * 3);
      g.translate(cx + w / 2 + dx, y - size * 0.36 + dy);
      g.rotate(rz);
      g.scale(sc, sc);
      textT(g, ch, -w / 2, size * 0.36, { size, font, color });
      g.restore();
      if (trail && u < 0.9) {
        g.save();
        g.globalAlpha *= 0.22 * (1 - u);
        g.translate(cx + w / 2 - dx * 0.55, y - size * 0.36 - dy * 0.55);
        g.rotate(-rz * 0.6);
        g.scale(lerp(from, 1, e) * 0.96, lerp(from, 1, e) * 0.96);
        textT(g, ch, -w / 2, size * 0.36, { size, font, color });
        g.restore();
      }
    }
    cx += w + tracking;
  });
}

// texto tremendo letra a letra — o ref "desfaz" a palavra no beat do trema
// (68,8–70,0 s: as letras se dispersam em alta frequência). Determinístico por frame.
export function tremendoTexto(g, txt, x, y, t, o = {}) {
  const {
    size = 96, font = "AB", color = C.white, align = "center", tracking = 0,
    amp = 18, freq = 11, seed = 0,
  } = o;
  const total = measureT(g, txt, { size, font, tracking });
  let cx = align === "center" ? x - total / 2 : align === "right" ? x - total : x;
  const ph = t * freq;
  [...txt].forEach((ch, i) => {
    const w = measureT(g, ch, { size, font });
    if (ch !== " ") {
      const dx = noise1(ph + i * 7.3, seed) * amp;
      const dy = noise1(ph * 1.31 + i * 4.9, seed + 5) * amp * 0.7;
      const rz = noise1(ph * 0.87 + i * 9.1, seed + 9) * 0.09;
      g.save();
      g.translate(cx + w / 2 + dx, y - size * 0.36 + dy);
      g.rotate(rz);
      textT(g, ch, -w / 2, size * 0.36, { size, font, color });
      g.restore();
    }
    cx += w + tracking;
  });
}

// ---------------------------------------------------------------- 4. saída
// "derrete": squash pra baixo + ghosts verticais + escurecimento (o corte com peso do ref)
export function melt(g, u, raw, o = {}) {
  const { ghosts = 4, down = 44, squash = 0.2, dx = 26, under = true } = o;
  if (u <= 0.001) { raw(g); return; }
  for (let i = ghosts; i >= 1; i--) {
    const f = i / ghosts;
    g.save();
    g.globalAlpha *= u * (1 - f) * 0.42;
    g.translate(360, 640);
    g.scale(1 + 0.05 * u, 1 - squash * u * (0.6 + 0.4 * f));
    g.translate(-360 + u * dx, -640 - f * (18 + down * 1.5 * u));
    raw(g);
    g.restore();
  }
  g.save();
  g.globalAlpha *= 1 - 0.55 * u;
  g.translate(360, 640);
  g.scale(1 + 0.05 * u, 1 - squash * u);
  g.translate(-360 + u * dx, -640 - u * down);
  raw(g);
  g.restore();
  g.save();
  g.globalAlpha *= 0.4 * u;
  g.fillStyle = "#050506";
  g.fillRect(-80, -80, REF_W + 160, REF_H + 160);
  g.restore();
}

// whip: deslocamento vertical rápido com streaks horizontais (transição de 2 frames)
export function whip(g, u, dir = -1) {
  const d = u * 260 * dir;
  g.save();
  g.globalAlpha *= 1 - u;
  g.translate(0, d);
  g.restore();
}
