// cena-meta-demo.mjs — composição do reel "meta-demo" (o vídeo que se explica)
// Beats medidos quadro a quadro no reel de referência (81,41 s, 720x1280, 30 fps).
// Trocar de marca = mexer em MARCA / MOTE / AGENTE e nos textos dos blocos 4, 15, 21 e 22.

import {
  bg, C, REF_W, clamp, seg, lerp, enter, easeOut, easeInOut, easeOutBack, easeOutExpo,
  rr, circle, diamond, poly, shadow, textT, measureT, kineticLine, cursor,
  pillApp, macWindow, finderWindow, dialogAbrir, curveEditor, renderDialog, pct99,
  phoneCard, cardHero, browserWindow, brackets, filmstrip, editorNovo, timelineAntiga,
  commentsPanel, mediaPill, waveform, knot, squiggle, sparkle, previewChart, chatInput,
  codeBrackets, cardStack, gridCards, selectionText, appIcon, hexA, vignette,
  popIn, typing, draftText, rgbSplitText, cursorArc, ripple, strikeIn, iris, counterKf, hash01, EASE,
} from "./lib/kit.mjs";
import { M, grain, camShot, cursorTravel, wordReveal, caret, stagger, sway, typeStep, melt, lettersFly, tremendoTexto, ringClick } from "./lib/mov.mjs";
const REF_H = 1280;

export let DUR = 81.41;
export const MARCA = "NODO\nPRIME";
export const MOTE = "VÍDEO EM HTML";
export const AGENTE = "EDITOR CHEFE";
const ORANGE = C.orange;

const B = [];
const add = (t0, t1, nome, draw) => B.push({ t0, t1, nome, draw });

// ------------------------------------------------------------------ ícones
function emojiTriste(g, x, y, r) {
  g.save();
  circle(g, x, y, r); g.fillStyle = "#f5c518"; g.fill();
  // faixa vermelha
  g.strokeStyle = "#e5484d"; g.lineWidth = r * 0.34; g.lineCap = "round";
  g.beginPath(); g.moveTo(x - r * 0.9, y - r * 0.72); g.lineTo(x + r * 0.9, y - r * 0.72); g.stroke();
  g.fillStyle = "#2a2118";
  circle(g, x - r * 0.34, y - r * 0.16, r * 0.11); g.fill();
  circle(g, x + r * 0.34, y - r * 0.16, r * 0.11); g.fill();
  // boca
  g.strokeStyle = "#2a2118"; g.lineWidth = r * 0.13;
  g.beginPath(); g.arc(x, y + r * 0.42, r * 0.3, Math.PI * 1.15, Math.PI * 1.85); g.stroke();
  // lágrimas
  g.fillStyle = "#3aa7f0";
  for (const s of [-1, 1]) {
    g.beginPath();
    g.moveTo(x + s * r * 0.34, y + r * 0.04);
    g.quadraticCurveTo(x + s * r * 0.52, y + r * 0.42, x + s * r * 0.34, y + r * 0.66);
    g.quadraticCurveTo(x + s * r * 0.16, y + r * 0.42, x + s * r * 0.34, y + r * 0.04);
    g.fill();
  }
  g.restore();
}
// carinha com óculos escuros (fecho do "não chora")
function emojiCool(g, x, y, r) {
  g.save();
  circle(g, x, y, r); g.fillStyle = "#f5c518"; g.fill();
  // óculos
  g.fillStyle = "#23201c";
  circle(g, x - r * 0.36, y - r * 0.1, r * 0.24); g.fill();
  circle(g, x + r * 0.36, y - r * 0.1, r * 0.24); g.fill();
  g.fillRect(x - r * 0.2, y - r * 0.18, r * 0.4, r * 0.08);
  // sorriso
  g.strokeStyle = "#2a2118"; g.lineWidth = r * 0.12; g.lineCap = "round";
  g.beginPath(); g.arc(x, y + r * 0.2, r * 0.34, Math.PI * 0.15, Math.PI * 0.85); g.stroke();
  g.restore();
}
function emojiFone(g, x, y, r) {  g.save();
  g.strokeStyle = "#f0f0f4"; g.lineWidth = r * 0.26; g.lineCap = "round";
  g.beginPath(); g.arc(x, y + r * 0.12, r * 0.72, Math.PI * 1.15, Math.PI * 1.85); g.stroke();
  g.fillStyle = "#f0f0f4";
  rr(g, x - r * 0.92, y + r * 0.02, r * 0.42, r * 0.72, r * 0.2); g.fill();
  rr(g, x + r * 0.5, y + r * 0.02, r * 0.42, r * 0.72, r * 0.2); g.fill();
  g.restore();
}
function raio(g, x, y, s) {
  g.save(); g.fillStyle = "#f5b626";
  poly(g, [[x + s * 0.15, y - s], [x - s * 0.55, y + s * 0.12], [x - s * 0.08, y + s * 0.12],
    [x - s * 0.2, y + s], [x + s * 0.55, y - s * 0.18], [x + s * 0.05, y - s * 0.18]]);
  g.fill(); g.restore();
}
function confete(g, x, y, s) {
  g.save(); g.fillStyle = "#f5b626";
  for (let i = 0; i < 5; i++) {
    const a = (i / 5) * Math.PI * 2 + 0.4;
    circle(g, x + Math.cos(a) * s * 0.7, y + Math.sin(a) * s * 0.7, s * 0.18); g.fill();
  }
  g.restore();
}
function estrela(g, x, y, r) {
  g.save(); g.fillStyle = "#f5b626";
  g.beginPath();
  for (let i = 0; i < 10; i++) {
    const a = -Math.PI / 2 + (i * Math.PI) / 5;
    const rr2 = i % 2 ? r * 0.44 : r;
    i ? g.lineTo(x + Math.cos(a) * rr2, y + Math.sin(a) * rr2) : g.moveTo(x + Math.cos(a) * rr2, y + Math.sin(a) * rr2);
  }
  g.closePath(); g.fill(); g.restore();
}

// uma chave { / } desenhada de verdade (lado 1 = "{", -1 = "}"), usada na sanfona
function chaveSola(g, x, y, h, lado, o = {}) {
  const { cor = "#57565e", lw = 13, t = 18, q = 28 } = o;
  const hw = h / 2;
  g.save();
  g.translate(x, y); g.scale(lado, 1);
  g.strokeStyle = cor; g.lineWidth = lw; g.lineCap = "round"; g.lineJoin = "round";
  g.beginPath();
  g.moveTo(t, -hw);
  g.bezierCurveTo(t * 0.2, -hw, 0, -hw * 0.84, 0, -hw * 0.56);
  g.lineTo(0, -hw * 0.34);
  g.bezierCurveTo(0, -hw * 0.14, -q, -hw * 0.12, -q, 0);   // bico central apontando pra fora
  g.bezierCurveTo(-q, hw * 0.12, 0, hw * 0.14, 0, hw * 0.34);
  g.lineTo(0, hw * 0.56);
  g.bezierCurveTo(0, hw * 0.84, t * 0.2, hw, t, hw);
  g.stroke();
  g.restore();
}

// cabeçalho de título: "não" em pílula laranja + resto branco
function headline(g, x, y, partes, o = {}) {
  const { size = 64, align = "center", font = "AB", tracking = -2 } = o;
  const fontStr = `${size}px ${font}`;
  g.save(); g.font = fontStr;
  let total = 0;
  const ws = partes.map((p) => {
    const w = g.measureText(p.txt).width;
    total += w + (p.esp || size * 0.26);
    return w;
  });
  let cx = align === "center" ? x - total / 2 : align === "right" ? x - total : x;
  partes.forEach((p, i) => {
    if (p.pill) {
      const pad = size * 0.22, ph = size * 1.06;
      rr(g, cx - pad, y - size * 0.78, ws[i] + pad * 2, ph, size * 0.14);
      g.fillStyle = p.pill; g.fill();
      textT(g, p.txt, cx, y, { size, font, color: "#ffffff", tracking });
    } else {
      textT(g, p.txt, cx, y, { size, font, color: p.cor || C.white, tracking });
    }
    cx += ws[i] + (p.esp || size * 0.26);
  });
  g.restore();
  return total;
}

// ================================================================== 1) ESSE VÍDEO
add(0, 2.67, "B1", (g, lt) => {
  bg(g, lt, { gx: 400, gy: 640, glowA: 0.19, gr: 560, dots: 0.05 });
  // camada de RASCUNHO: "ESSE VÍDEO" inteiro SÓ CONTORNO atrás (o ref mostra o
  // esqueleto da frase enquanto digita — prints 1-6)
  if (lt > 0.25) {
    g.save(); g.globalAlpha = enter(lt, 0.25, 0.3) * 0.5;
    g.lineWidth = 2.5; g.strokeStyle = "rgba(246,247,242,.55)";
    g.font = "181px AB";
    g.strokeText("ESSE", 52, 438);
    g.strokeText("VÍDEO", 52, 619);
    g.restore();
  }
  // digitação real: "ESSE" (draft convergindo) e "VÍDEO" letra a letra com
  // bloco de seleção escura na letra em formação + caret laranja
  draftText(g, "ESSE", 52, 438, { size: 181, font: "AB", tracking: -2, color: C.white, t: lt, t0: 0.02, dur: 0.34, copies: 4, amp: 26 });
  const tp = typing(g, "VÍDEO", 52, 619, { size: 181, font: "AB", tracking: -2, color: C.white, t: lt, t0: 0.6, ms: 82, solid: 0.2 });
  if (tp.n > 0 && (Math.floor(lt * 3) % 2 === 0 || lt < 1.05)) {
    g.fillStyle = ORANGE; g.fillRect(52 + tp.w + 14, 497, 7, 128);
  }
  // cursor presente desde cedo (o ref mantém o cursor laranja com etiqueta)
  cursorArc(g, lt, 0.5, 0.9, [700, 520], [520, 402], { label: AGENTE, scale: 0.92, streak: true, arc: 0.1 });
  kineticLine(g, [
    { t: 0.78, w: "que" },
    { t: 1.95, w: "você" },
    { t: 2.05, w: "tá" },
    { t: 2.15, w: "vendo" },
  ], lt, { x: 58, y: 731, size: 42, font: "MB", maxW: 600, lineH: 1.2, riseY: 8, dim: false, corNova: "#8a8890" });
  // "agora" em caixa laranja GRANDE (o ref usa destaque cheio, não chip pequeno)
  const ag = enter(lt, 2.3, 0.1);
  if (ag > 0.01) {
    const txt = lt < 2.42 ? "agor" : "agora";
    g.font = "800 44px MXB";
    const w = g.measureText(txt).width;
    rr(g, 186, 778, w + 34, 62, 12); g.fillStyle = ORANGE; g.fill();
    textT(g, txt, 205, 821, { size: 44, font: "MXB", color: "#fff", tracking: -1 });
    if (lt < 2.44) { g.fillStyle = "rgba(255,255,255,.85)"; g.fillRect(205 + w + 4, 786, 4, 46); }
  }
  // pill do cronômetro "• AGORA 00:02:13" (print 8: dot vermelho + tempo)
  if (lt > 2.45) {
    g.save(); g.globalAlpha = enter(lt, 2.45, 0.16);
    g.font = "700 24px MonoM";
    const w2 = g.measureText("AGORA 00:02:13").width + 74;
    rr(g, 360 - w2 / 2, 872, w2, 52, 12); g.fillStyle = "#1c1c22"; g.fill();
    g.strokeStyle = "rgba(255,255,255,.14)"; g.lineWidth = 2; g.stroke();
    circle(g, 360 - w2 / 2 + 30, 898, 7); g.fillStyle = "#e5484d"; g.fill();
    textT(g, "AGORA", 360 - w2 / 2 + 48, 907, { size: 24, font: "MXB", color: "#e8e8ee" });
    textT(g, "00:02:13", 360 + w2 / 2 - 22, 907, { size: 24, font: "MonoM", color: "#9a9aa4", align: "right" });
    g.restore();
  }
});

// ================================================================== 2) ele não foi EDITADO
add(2.67, 10.03, "B2", (g, lt) => {
  bg(g, lt, { gx: 360, gy: 700, glowA: 0.16, gr: 520 });
  const t = 2.67 + lt;
  const palavras = [
    { t: 0.02, w: "ele" }, { t: 0.32, w: "não" }, { t: 0.62, w: "foi" },
  ];
  // o texto de cima e os ícones somem quando as pílulas/janela entram (o ref faz isso)
  const someBeleza = 1 - enter(lt, 2.95, 0.3);
  g.save(); g.globalAlpha *= clamp(someBeleza, 0, 1);
  kineticLine(g, palavras, lt, { x: 48, y: 409, size: 46, font: "MB", maxW: 620, lineH: 1.15, riseY: 8, dim: false, corNova: "#8a8a8a" });
  const aE = enter(lt, 0.75, 0.16);
  if (aE > 0.01) {
    g.save(); g.globalAlpha *= aE;
    g.translate(0, (1 - aE) * 14);
    // "EDITADO" digita de verdade e depois a rasura se desenha esq→dir
    typing(g, "EDITADO", 47, 537, { size: 137, font: "AB", tracking: -1, color: C.white, t: lt, t0: 0.75, ms: 60, solid: 0.22 });
    const wE = measureT(g, "EDITADO", { size: 137, font: "AB", tracking: -1 });
    strikeIn(g, 34, 34 + wE + 30, 490, lt, 1.25, { cor: ORANGE, lw: 13, dur: 0.34 });
    g.restore();
  }
  g.restore();
  // "em nenhum programa": 4 ícones de app + legenda
  if (lt > 1.55 && lt < 3.0) {
    const someIcones = 1 - enter(lt, 2.7, 0.28);
    g.save(); g.globalAlpha = clamp(someIcones, 0, 1);
    const ai = enter(lt, 1.55, 0.28);
    const apps = ["pen", "video", "layers", "spark"];
    apps.forEach((tp, i) => {
      const s = easeOutBack(clamp((lt - 1.55 - i * 0.06) / 0.26, 0, 1), 1.3);
      const ix = 112 + i * 136, iy = 640, is = 88;
      g.save(); g.globalAlpha *= ai; g.translate(ix + is / 2, iy + is / 2); g.scale(s, s); g.translate(-(ix + is / 2), -(iy + is / 2));
      rr(g, ix, iy, is, is, 20); g.fillStyle = "#232329"; g.fill();
      g.save(); g.translate(ix + is / 2, iy + is / 2); g.scale(is / 90, is / 90);
      g.lineCap = "round"; g.lineJoin = "round";
      if (tp === "pen") {
        g.rotate(-0.78);
        g.fillStyle = C.orange; rr(g, -8, -22, 16, 34, 3); g.fill();
        poly(g, [[-8, 12], [8, 12], [0, 26]]); g.fillStyle = "#f6bfa4"; g.fill();
        poly(g, [[-3, 20], [3, 20], [0, 26]]); g.fillStyle = "#2a2a30"; g.fill();
        g.fillStyle = "#e9e1d6"; g.fillRect(-8, -26, 16, 5);
      } else if (tp === "video") {
        g.strokeStyle = "#e8e8ee"; g.lineWidth = 5.5; rr(g, -26, -19, 44, 38, 7); g.stroke();
        poly(g, [[-8, -10], [10, 0], [-8, 10]]); g.fillStyle = "#e8e8ee"; g.fill();
      } else if (tp === "layers") {
        g.strokeStyle = "#3ecf9a"; g.lineWidth = 7;
        for (let k = 0; k < 3; k++) {
          g.beginPath(); g.moveTo(0, -26 + k * 14); g.lineTo(30, -11 + k * 14); g.lineTo(0, 4 + k * 14); g.lineTo(-30, -11 + k * 14); g.closePath(); g.stroke();
        }
      } else {
        g.strokeStyle = "#f0568f"; g.lineWidth = 7;
        g.beginPath(); g.moveTo(-20, 22); g.lineTo(20, -22); g.stroke();
        g.fillStyle = "#f0568f"; poly(g, [[20, -22], [6, -22], [20, -8]]); g.fill();
      }
      g.restore();
      // badges
      if (i === 0) {
        circle(g, ix + is - 2, iy + 2, 13); g.fillStyle = "#43434d"; g.fill();
        g.strokeStyle = "#e8e8ee"; g.lineWidth = 2.6; g.lineCap = "round";
        g.beginPath(); g.moveTo(ix + is - 7, iy - 3); g.lineTo(ix + is + 3, iy + 7);
        g.moveTo(ix + is + 3, iy - 3); g.lineTo(ix + is - 7, iy + 7); g.stroke();
      }
      if (i === 1) {
        circle(g, ix + is + 4, iy - 2, 12); g.fillStyle = "#c2571f"; g.fill();
        g.strokeStyle = "#fff"; g.lineWidth = 2.6; g.lineCap = "round";
        g.beginPath(); g.moveTo(ix + is - 2, iy - 2); g.lineTo(ix + is + 10, iy - 2);
        g.moveTo(ix + is + 4, iy - 8); g.lineTo(ix + is + 4, iy + 4); g.stroke();
      }
      g.restore();
    });
    const ac = enter(lt, 1.8, 0.26);
    g.save(); g.globalAlpha *= ac;
    textT(g, "em nenhum programa", 360, 800, { size: 30, font: "MB", color: "#9a989f", align: "center" });
    g.restore();
    g.restore();
  }
  // pílulas dos softwares: AE e Premiere NASCEM NO CENTRO (uma sob a outra),
  // levam o risco e só sobem quando o Finder entra e toma o meio da tela
  const sobe = easeInOut(clamp((lt - 5.45) / 0.55, 0, 1));
  const aeIn = enter(lt, 3.25, 0.24);
  if (aeIn > 0.01) {
    const x = lerp(105, 238, sobe), y = lerp(468, 218, sobe), hh = lerp(76, 46, sobe), ww = lerp(510, 274, sobe);
    popIn(g, lt, 3.25, 0.36, { cx: x + ww / 2, cy: y + hh / 2, s0: 0.84, back: 1.5 }, (gg) => {
      pillApp(gg, x, y, "After Effects", { w: ww, h: hh, dim: clamp(aeIn, 0, 1), strike: lt > 4.55, strikeU: (lt - 4.55) / 0.3, size: lerp(38, 22, sobe) });
    });
  }
  const prIn = enter(lt, 4.35, 0.24);
  if (prIn > 0.01) {
    const x = lerp(105, 238, sobe), y = lerp(556, 302, sobe), hh = lerp(76, 46, sobe), ww = lerp(510, 274, sobe);
    popIn(g, lt, 4.35, 0.36, { cx: x + ww / 2, cy: y + hh / 2, s0: 0.84, back: 1.5 }, (gg) => {
      pillApp(gg, x, y, "Premiere", { w: ww, h: hh, dim: prIn, icon: "play", strike: lt > 5.15, strikeU: (lt - 5.15) / 0.3, size: lerp(34, 22, sobe) });
    });
  }
  // finder: entra e fica no MEIO da tela (as pílulas sobem para cima dele)
  const fIn = enter(lt, 5.75, 0.34);
  if (fIn > 0.01) {
    g.save(); g.globalAlpha = fIn;
    const tf = Math.max(0, lt - 6.4);
    popIn(g, lt, 5.75, 0.42, { cx: 360, cy: 643, s0: 0.92, back: 1.35 }, (gg) => {
      finderWindow(gg, 65, 430, 590, 426, {
        tFree: tf, pop: 4, popStep: 0.5, goneT: 99, lixeira: false,
        sel: lt > 9.15 && lt < 10.4 ? [0] : [],
        hide: lt > 10.42 ? [0] : [],
      });
    });
    g.restore();
    // LIXEIRA GRANDE branca FORA/embaixo da janela (o ref arrasta até ela)
    if (lt > 6.05) {
      const uL = enter(lt, 6.05, 0.3);
      const bx = 360, by = 1150;
      g.save(); g.globalAlpha = uL;
      g.fillStyle = "#f2f3f0";
      g.beginPath(); g.moveTo(bx - 34, by - 30); g.lineTo(bx + 34, by - 30); g.lineTo(bx + 26, by + 36); g.lineTo(bx - 26, by + 36); g.closePath(); g.fill();
      g.fillRect(bx - 42, by - 44, 84, 10);
      textT(g, "Lixeira", bx, by + 66, { size: 22, font: "MSemi", color: "#8a8890", align: "center" });
      g.restore();
      // a lixeira acende quando o arquivo chega perto
      const chegou = clamp((lt - 10.0) / 0.3, 0, 1);
      if (chegou > 0.01) {
        g.save(); g.globalAlpha = chegou * 0.9;
        g.strokeStyle = ORANGE; g.lineWidth = 4; g.lineCap = "round";
        g.beginPath(); g.arc(bx, by + 2, 58 + 26 * chegou, 0, Math.PI * 2); g.stroke();
        g.restore();
      }
    }
    // clique em CapCut_PRO → seleciona → segura → arrasta até a lixeira
    const P0 = [232, 604], P1 = [360, 1112];
    if (lt > 8.35 && lt < 9.4) {
      const u = easeInOut(clamp((lt - 8.35) / 0.7, 0, 1));
      cursor(g, lerp(540, P0[0] + 26, u), lerp(960, P0[1] + 18, u), { label: lt > 8.9 ? AGENTE : null });
      ripple(g, P0[0] + 12, P0[1] + 8, lt, 9.05, { cor: ORANGE, anel: 2, dur: 0.6, r1: 70 });
    } else if (lt >= 9.4 && lt < 10.45) {
      const d = M.inOutCubic(clamp((lt - 9.4) / 0.95, 0, 1));
      const px = lerp(P0[0], P1[0], d), py = lerp(P0[1], P1[1], d);
      // rastro do arrasto
      for (const [gk, ga] of [[0.4, 0.26], [0.2, 0.14]]) {
        const dd = M.inOutCubic(clamp((lt - 9.4) / 0.95 - gk, 0, 1));
        g.save(); g.globalAlpha *= ga;
        rr(g, lerp(P0[0], P1[0], dd) - 40, lerp(P0[1], P1[1], dd) - 32, 80, 64, 10);
        g.fillStyle = "#1b2a52"; g.fill();
        g.restore();
      }
      // card do exe com CAVEIRA
      g.save();
      g.translate(px, py); g.rotate(-0.06 + 0.12 * d);
      rr(g, -40, -32, 80, 64, 10); g.fillStyle = "#20242c"; g.fill();
      g.strokeStyle = "#e0552a"; g.lineWidth = 2.5; g.stroke();
      circle(g, 0, -8, 15); g.fillStyle = "#e8e8ee"; g.fill();
      g.fillStyle = "#20242c";
      circle(g, -6, -9, 4.5); g.fill();
      circle(g, 6, -9, 4.5); g.fill();
      g.fillRect(-5, 6, 10, 6);
      g.restore();
      cursor(g, px + 30, py + 24, { label: d > 0.55 ? "EXCLUIR" : AGENTE, scale: 0.95 });
    }
    // soltou: some na lixeira com um pulso
    if (lt >= 10.45) {
      ripple(g, P1[0], P1[1], lt, 10.45, { cor: ORANGE, anel: 3, dur: 0.55, r1: 90 });
      cursor(g, P1[0] + 40, P1[1] + 6, { label: null, alpha: clamp((10.76 - lt) / 0.16, 0, 1) });
    }
  }
  // O LARANJA (ref 5,3-5,9, pico de 11,5): INSERT. A cena apaga sob um véu escuro
  // e um O laranja (rosca de borda macia) NASCE PEQUENO no centro (5,39: ~25% da
  // largura) e cresce até tomar a tela (5,77: ~90%), com a cena seguinte
  // desabrochando dentro do buraco. Corte seco em 5,85 — prova visual do casamento.
  if (lt >= 2.58 && lt < 3.18) {
    const u = clamp((lt - 2.58) / 0.6, 0, 1);
    const e2 = M.smooth(u);
    const veil = clamp((lt - 2.58) / 0.22, 0, 1);
    g.save(); g.globalAlpha = veil * 0.92;
    g.fillStyle = "#0b0b0e"; g.fillRect(-20, -20, REF_W + 40, REF_H + 40);
    g.restore();
    const sc = lerp(0.28, 1.9, e2);
    const ory = 560 * sc, orx = 380 * sc;
    g.save();
    g.translate(360, 560);
    g.shadowColor = "#f0561e"; g.shadowBlur = 30 * (1 - e2) + 8;
    g.scale(orx / ory, 1);
    circle(g, 0, 0, ory); g.fillStyle = "#f0561e"; g.fill();
    g.restore();
    const iry = ory * 0.42, irx = orx * 0.42;
    g.save();
    g.translate(360, 560); g.scale(irx / iry, 1);
    const gd = g.createRadialGradient(0, 0, iry * 0.82, 0, 0, iry);
    gd.addColorStop(0, "rgba(8,8,10,1)"); gd.addColorStop(0.88, "rgba(8,8,10,0.96)"); gd.addColorStop(1, "rgba(8,8,10,0)");
    g.fillStyle = gd;
    circle(g, 0, 0, iry); g.fill();
    g.restore();
    const ag = clamp((u - 0.62) / 0.38, 0, 1);
    if (ag > 0.01) {
      g.save(); g.globalAlpha = ag * 0.85;
      g.translate(360, 560); g.scale(lerp(1.6, 1, M.outCubic(ag)), 1);
      textT(g, "After Effects", 0, 10, { size: 30, font: "MB", color: "#e8e8ee", align: "center" });
      g.restore();
    }
  }
});

// ================================================================== 3) Ele foi escrito (cream)
add(10.03, 12.40, "B3", (g, lt) => {
  bg(g, lt, { dark: C.cream, dots: 0.055, glow: "#ffffff", glowA: 0.45, gx: 360, gy: 400, gr: 700 });
  const a1 = enter(lt, 0.02, 0.3);
  const a2 = enter(lt, 0.55, 0.3);
  const a3 = enter(lt, 1.15, 0.34);
  // "Ele" centralizado → vira "Ele foi" à esquerda quando entra o <h1>
  // (mesma margem esquerda nas duas versões: o texto cresce para a direita, não pula)
  const wEle = measureT(g, "Ele foi", { size: 50, font: "MB" });
  const xEle = 360 - wEle / 2;
  if (a2 < 0.6) {
    g.save(); g.globalAlpha = a1 * (1 - a2 / 0.6);
    textT(g, "Ele", xEle, 480, { size: 50, font: "MB", color: C.grayText });
    g.restore();
  }
  if (a2 > 0.4) {
    g.save(); g.globalAlpha = clamp((a2 - 0.4) / 0.6, 0, 1);
    textT(g, "Ele foi", xEle, 480, { size: 50, font: "MB", color: C.grayText });
    g.restore();
  }
  if (a3 > 0.01) {
    g.save(); g.globalAlpha = clamp(a3, 0, 1);
    typing(g, "<h1>", 57, 470, { size: 38, font: "MonoM", color: "#e0663a", cinza: "#a97a5c", t: lt, t0: 1.15, ms: 45 });
    g.restore();
    // "escrito." digita de verdade (o ref digita letra-a-letra com caret) — no ref
    // ele é MAIOR e mais baixo, com </h1> + cursor I-beam no canto inferior direito
    const s = easeOutBack(a3, 1.2);
    g.save();
    g.translate(70, 700); g.scale(lerp(0.95, 1, s) * 1.02, lerp(0.95, 1, s) * 1.02);
    typing(g, "escrito.", 0, 0, { size: 240, font: "ISI", tracking: -3, color: "#151410", cinza: "#a9a79e", t: lt, t0: 1.0, ms: 96, solid: 0.22, caret: true, caretCor: "#151410" });
    g.restore();
  }
  // </h1> + cursor I-beam (o ref fecha a tag no canto direito, abaixo do título)
  if (lt > 1.7) {
    g.save(); g.globalAlpha = 0.55;
    textT(g, "</h1>", 556, 838, { size: 24, font: "MonoM", color: "#e0663a" });
    g.strokeStyle = "#2a2823"; g.lineWidth = 3;
    g.beginPath(); g.moveTo(668, 800); g.lineTo(668, 862); g.stroke();
    g.beginPath(); g.moveTo(660, 800); g.lineTo(676, 800); g.stroke();
    g.beginPath(); g.moveTo(660, 862); g.lineTo(676, 862); g.stroke();
    g.restore();
  }
});

// ================================================================== 4) Isso porque o EDITOR CHEFE
add(12.40, 14.95, "B4", (g, lt) => {
  bg(g, lt, { gx: 300, gy: 620, glowA: 0.14, gr: 520, dots: 0.045 });
  const t = 12.4 + lt;
  kineticLine(g, [{ t: 0.02, w: "Isso" }, { t: 0.12, w: "porque" }, { t: 0.3, w: "o" }], lt,
    { x: 360, y: 440, size: 26, font: "MXB", maxW: 600, align: "center", riseY: 6, janela: 0.45 });
  // pílula com ROLAGEM de números (0 → alvo em cada estágio; o ref CONTA os
  // números, não pisca versões — prints do usuário: "parecendo bug")
  const stages = [[0.4, 2.0], [0.95, 2.5], [1.35, 2.9], [1.7, 4.0], [2.0, 5.5]];
  let si = -1;
  for (let i = 0; i < stages.length; i++) if (lt >= stages[i][0]) si = i;
  if (si >= 0) {
    const t0 = stages[si][0], alvo = stages[si][1], prev = si > 0 ? stages[si - 1][1] : 0;
    const u = M.outCubic(clamp((lt - t0) / 0.4, 0, 1));
    const txt = `EDITOR CHEFE ${(prev + (alvo - prev) * u).toFixed(1)}`;
    const a = enter(lt, t0, 0.1);
    g.save(); g.globalAlpha = a;
    g.font = "800 34px MXB";
    const w = g.measureText(txt).width + 44;
    rr(g, 150, 588, w, 62, 13); g.fillStyle = ORANGE; g.fill();
    textT(g, txt, 172, 630, { size: 34, font: "MXB", color: "#fff", tracking: -0.6 });
    g.restore();
    cursor(g, 116, 556, { alpha: a, label: null });
  }
  // frase obrigatória: NODO PRIME é uma das skills do agente
  const ac = enter(lt, 1.3, 0.4);
  if (ac > 0.01) {
    const frase = "a skill NODO PRIME, um dos motores do agente";
    // margem de 90 px à direita: a câmera amplia 1,12 e a frase encostava na borda
    const maxW = 720 - 172 - 90;
    const wF = measureT(g, frase, { size: 21, font: "MSemi" });
    const sz = wF > maxW ? Math.floor((21 * maxW) / wF) : 21;
    g.save(); g.globalAlpha = ac;
    textT(g, frase, 172, 700, { size: sz, font: "MSemi", color: "#8b8a92" });
    g.restore();
  }
});

// ================================================================== 5) ele faz + MOTION GRAPHICS + timeline
add(14.95, 20.67, "B5", (g, lt) => {
  // batida 1 (ref 15,0-15,5): "ele faz" no navy com pontinhos
  if (lt < 0.5) {
    bg(g, lt, { glow: "#3a5fd0", glowA: 0.2, gx: 360, gy: 700, gr: 420, dots: 0.05 });
    const a = enter(lt, 0.0, 0.12);
    g.save(); g.globalAlpha = a;
    textT(g, "ele faz", 360, 440, { size: 42, font: "MXB", color: "#a8a6ad", align: "center" });
    g.restore();
    return;
  }
  // batida 2 (ref 15,5-16,9): MOTION GRAPHICS — letras CAEM para o lugar, Os
  // laranjas, GRAPHICS com blur, underline laranja e ÓRBITA de shapes com rastro
  if (lt < 3.35) {
    const t = lt - 0.5;
    bg(g, lt, { gx: 360, gy: 640, glowA: 0.08, gr: 560, dots: 0.05 });
    g.save(); g.globalAlpha = 0.9;
    textT(g, "ele faz", 360, 356, { size: 30, font: "MXB", color: "#8a8890", align: "center" });
    g.restore();
    // letras de MOTION caindo (M,O,T,I,O,N — Os em laranja) com rastro de queda
    const letras = ["M", "O", "T", "I", "O", "N"];
    const size = 104;
    g.font = `${size}px AB`;
    const larguras = letras.map((c) => g.measureText(c).width);
    const total = larguras.reduce((a, b) => a + b, 0) - letras.length * 4;
    let lx = 360 - total / 2;
    letras.forEach((c, i) => {
      const u = M.outCubic(clamp((t - 0.12 - i * 0.07) / 0.34, 0, 1));
      const yy = lerp(160, 560, u) - (1 - u) * 0;
      const cor = c === "O" ? "#f0561e" : C.white;
      // rastro de queda (2 fantasmas acima)
      if (u > 0 && u < 0.95) {
        for (const [gf, ga] of [[0.55, 0.3], [0.28, 0.16]]) {
          g.save(); g.globalAlpha *= ga;
          textT(g, c, lx, yy - (1 - u) * 260 * gf, { size, font: "AB", color: cor });
          g.restore();
        }
      }
      if (u > 0.01) {
        g.save(); g.globalAlpha *= Math.min(1, u * 4);
        textT(g, c, lx, yy, { size, font: "AB", color: cor });
        g.restore();
      }
      lx += larguras[i] + 4;
    });
    // GRAPHICS aparece com blur de escala + underline laranja desenhando
    const ga = enter(t, 0.75, 0.3);
    if (ga > 0.01) {
      g.save(); g.globalAlpha = ga;
      g.translate(360, 656); g.scale(lerp(1.25, 1, ga), lerp(1.25, 1, ga)); g.translate(-360, -656);
      textT(g, "GRAPHICS", 360, 656, { size: 62, font: "AB", color: C.white, align: "center", tracking: -1.5 });
      g.restore();
    }
    const un = clamp((t - 1.05) / 0.4, 0, 1);
    if (un > 0.01) {
      g.save();
      g.strokeStyle = "#f0561e"; g.lineWidth = 7; g.lineCap = "round";
      g.beginPath(); g.moveTo(360 - 170 * un, 700); g.lineTo(360 + 170 * un, 700); g.stroke();
      g.restore();
    }
    // órbita de shapes — a nota do usuário: abre UM (círculo laranja), ele se
    // MULTIPLICA girando e volta a parar em UM só. Nada de já nascer multiplicado.
    const shapes = [
      { tipo: "circle", cor: "#f0561e" }, { tipo: "quad", cor: "#f5b626" },
      { tipo: "tri", cor: "#4d7fe0" }, { tipo: "ring", cor: "#f0568f" }, { tipo: "x", cor: "#ffffff" },
    ];
    const CX = 360, CY = 700, RX = 300, RY = 384;
    const abre = easeInOut(clamp((t - 0.35) / 0.75, 0, 1));
    const fecha = easeInOut(clamp((t - 2.25) / 0.40, 0, 1));
    const spread = abre * (1 - fecha);          // 0 = colapsado no centro
    const gira = 1.7 * Math.max(0, t - 0.35);
    const nasce = easeOutBack(clamp(t / 0.42, 0, 1), 1.5);
    shapes.forEach((s, i) => {
      const base = (i * Math.PI * 2) / 5 - Math.PI / 2;
      const ang = base + gira;
      const sx = CX + Math.cos(ang) * RX * spread;
      const sy = CY + Math.sin(ang) * RY * spread;
      // o círculo é o "um" — os outros só têm corpo enquanto o conjunto está aberto
      const al = i === 0 ? Math.min(1, nasce) : clamp(spread, 0, 1);
      if (al <= 0.02) return;
      const desenha = (x, y, k, a) => {
        g.save(); g.globalAlpha *= a; g.translate(x, y); g.scale(k, k);
        if (s.tipo === "circle") { circle(g, 0, 0, 15); g.fillStyle = s.cor; g.fill(); }
        else if (s.tipo === "quad") { g.rotate(0.4); rr(g, -13, -13, 26, 26, 7); g.fillStyle = s.cor; g.fill(); g.strokeStyle = "#141310"; g.lineWidth = 3; g.stroke(); }
        else if (s.tipo === "tri") { poly(g, [[0, -15], [-14, 11], [14, 11]]); g.fillStyle = s.cor; g.fill(); }
        else if (s.tipo === "ring") { circle(g, 0, 0, 13); g.strokeStyle = s.cor; g.lineWidth = 6; g.stroke(); }
        else { g.rotate(0.7); g.strokeStyle = s.cor; g.lineWidth = 6; g.lineCap = "round"; g.beginPath(); g.moveTo(-10, -10); g.lineTo(10, 10); g.moveTo(10, -10); g.lineTo(-10, 10); g.stroke(); }
        g.restore();
      };
      // rastro de fase só com o conjunto aberto (nasce de UM, não de várias cópias)
      if (spread > 0.25) {
        for (const [dA, fa] of [[0.18, 0.2], [0.36, 0.09]]) {
          const a2 = ang - dA * spread;
          desenha(CX + Math.cos(a2) * RX * spread, CY + Math.sin(a2) * RY * spread, i === 0 ? 1 : 0.9, al * fa);
        }
      }
      desenha(sx, sy, i === 0 ? Math.max(0.2, nasce) : 0.9 + 0.1 * spread, al);
    });
    return;
  }
  // batida 3 (ref 17,0-20,67): timeline GRANDE, título digitando, "normal" laranja
  // e o MOUSE arrastando o playhead — o card anda da esquerda para a direita junto
  bg(g, lt, { gx: 360, gy: 640, glowA: 0.10, gr: 560, dots: 0.05 });
  const t = lt - 3.35;
  // título pequeno no topo-esquerda (o ref: texto ~34px, não 62 centrado)
  typeStep(g, [[0.0, "mas"], [0.35, "mas não"], [0.7, "mas não do"], [1.1, "mas não do jeito"]], t,
    { size: 40, font: "MXB", color: C.white, x: 42, y: 130, tracking: -0.6, novo: "#8a8890" });
  const an = enter(t, 1.5, 0.3);
  if (an > 0.01) {
    g.save(); g.globalAlpha = an;
    textT(g, "“normal”", 44, 196, { size: 58, font: "ISI", color: "#e8603a", tracking: -1 });
    g.restore();
  }
  // 2,55 s de varredura: a linha sai da esquerda, cruza os keyframes e para à direita
  const varre = M.smooth(clamp((t - 0.95) / 2.55, 0, 1));
  // já entra VISÍVEL no primeiro frame do beat (antes havia 0,2 s de tela vazia
  // logo depois da órbita, o que parecia um corte)
  const pIn = clamp(0.4 + 0.6 * M.outCubic(clamp(t / 0.32, 0, 1)), 0, 1);
  if (pIn > 0.01) {
    g.save(); g.globalAlpha = pIn;
    g.translate(360, 690); g.scale(lerp(0.92, 1, pIn), lerp(0.92, 1, pIn)); g.translate(-360, -690);
    timelineAntiga(g, 78, 462, 566, 462, {
      rot: -0.03 + 0.014 * varre,      // inclina de leve enquanto anda
      profundidade: pIn,
      sweep: varre,
      dx: lerp(-70, 24, varre),        // o card anda da esquerda para a direita
      pegador: t > 0.55 ? { alpha: enter(t, 0.55, 0.2) } : null,
    });
    g.restore();
  }
});

// ================================================================== 6) não abre / arrasta / chora
add(20.67, 27.10, "B6", (g, lt) => {
  bg(g, lt, { gx: 360, gy: 720, glowA: 0.13, gr: 520, dots: 0.045 });
  if (lt < 1.4) {
    // não abre — headline no topo-ESQUERDA (o ref: "não abre" + "software" cinza abaixo)
    const as = enter(lt, 0.45, 0.16), aSw = enter(lt, 1.15, 0.16);
    g.save(); g.globalAlpha = as;
    headline(g, 120, 200, [{ txt: "não", pill: ORANGE }, { txt: "abre" }], { size: 60 });
    g.restore();
    if (aSw > 0.01) {
      g.save(); g.globalAlpha = aSw;
      textT(g, "software", 120, 258, { size: 38, font: "MXB", color: "#8a8890", tracking: -0.5 });
      g.restore();
    }
    const dIn = enter(lt, 0.15, 0.26);
    if (dIn > 0.01) {
      dialogAbrir(g, 98, 465 + (1 - dIn) * 20, 525, 450, {});
      if (lt > 0.62) cursor(g, lerp(340, 240, enter(lt, 0.62, 0.3)), lerp(1000, 846, enter(lt, 0.62, 0.3)), { label: lt > 0.8 ? AGENTE : null });
    }
    return;
  }
  if (lt < 2.1) {
    // app grande + X
    const a = enter(lt, 1.4, 0.2);
    g.save(); g.globalAlpha = a;
    appIcon(g, 300, 520, 120);
    g.fillStyle = "#2b2b33"; circle(g, 392, 510, 24); g.fill();
    g.strokeStyle = "#f0f0f4"; g.lineWidth = 3; g.lineCap = "round";
    g.beginPath(); g.moveTo(384, 502); g.lineTo(400, 518); g.moveTo(400, 502); g.lineTo(384, 518); g.stroke();
    g.restore();
    cursor(g, 480, 700, { label: AGENTE });
    return;
  }
  if (lt < 4.7) {
    // não arrasta keyframe — o CARD fica PARADO; o mouse clica no keyframe laranja
    // e puxa PARA CIMA: a curva ESTICA (elástico), o tracejado "original" fica
    // plantado no lugar e, ao soltar, o keyframe volta vibrlando para a posição.
    const t = lt - 2.1;
    const ak = enter(t, 0.35, 0.16);
    g.save(); g.globalAlpha = 1;
    headline(g, 120, 200, [{ txt: "não", pill: ORANGE }, { txt: "arrasta" }], { size: 60 });
    g.restore();
    if (ak > 0.01) {
      g.save(); g.globalAlpha = ak;
      typing(g, "keyframe", 120, 330, { size: 64, font: "AB", color: "#e8603a", tracking: -1.6, t, t0: 1.0, ms: 62, solid: 0.22, caret: true, caretCor: "#e8603a" });
      g.restore();
    }
    const cIn = enter(t, 0.1, 0.26);
    // puxa de 0,75 a 1,55 · solta e volta oscilando (outElastic) até 2,6
    const puxa = t < 1.55 ? seg(t, 0.75, 1.55) : 1;
    const solta = clamp((t - 1.55) / 1.05, 0, 1);
    const volta = solta > 0 ? 1 - M.outElastic(solta) : 1;
    const lift = -108 * puxa * volta;
    const ce = curveEditor(g, 52, 460 + (1 - cIn) * 20, 616, 430, {
      lift,
      ghost: clamp(puxa * 2.4, 0, 1),
      rotulo: "original",
    });
    // mouse colado no keyframe: sobe junto, desce junto
    if (t > 0.55 && t < 2.45) {
      const a = enter(t, 0.55, 0.15) * (1 - enter(t, 2.2, 0.22));
      cursor(g, ce.kx + 6, ce.ky + 7, { alpha: a, label: t > 0.9 ? AGENTE : null });
    }
    // cursor proibido 🚫 (o ref: círculo vermelho com barra no ponto do keyframe)
    if (t >= 2.2) {
      const k = enter(t, 2.2, 0.22);
      const nx = ce.kx0 + 56, ny = ce.ky0 - 6 + (1 - k) * 14;
      g.save(); g.globalAlpha = k;
      circle(g, nx, ny, 26); g.fillStyle = "rgba(229,72,77,.92)"; g.fill();
      g.strokeStyle = "#ffffff"; g.lineWidth = 4; g.stroke();
      g.beginPath(); g.moveTo(nx - 13, ny - 13); g.lineTo(nx + 13, ny + 13); g.stroke();
      g.restore();
    }
    return;
  }
  // render + chora — barra cresce rápido (ref: 87% em 25,0) e segura o 99 até o burst
  const t = lt - 4.7;
  const pct = 0.2 + 0.79 * clamp(t / 1.1, 0, 1);
  const rest = Math.max(0, Math.round(10 - t * 3.8));
  if (t < 1.73) {
    headline(g, 360, 262, t < 0.35 ? [{ txt: "não", pill: ORANGE, esp: 0 }] : [{ txt: "não", pill: ORANGE }, { txt: "chora" }], { size: 72 });
    if (t > 0.45) {
      emojiTriste(g, 556, 240, 30);
      const aq = enter(t, 0.62, 0.18);
      if (aq > 0.01) {
        g.save(); g.globalAlpha = aq;
        textT(g, "quando o render trava", 360, 336, { size: 34, font: "MXB", color: "#9a989f", align: "center" });
        g.restore();
      }
    }
    const rIn = enter(t, 0.1, 0.24);
    renderDialog(g, 78, 450 + (1 - rIn) * 20, 564, 344, { pct, restante: `${rest}s` });
    return;
  }
  // 99% EXPLODE DO MODAL (ref 26,0-26,2): o modal some e o número escala 0,24→1 em
  // ~0,14 s com ghosts (echo do valor anterior) — INSERT, não zoom de câmera.
  // Depois assenta e só respira com micro-glitch + RGB split.
  const tg = t - 1.73;
  g.save(); g.globalAlpha = 0.85;
  headline(g, 360, 262, [{ txt: "não", pill: ORANGE }, { txt: "chora" }], { size: 72 });
  emojiTriste(g, 556, 240, 30);
  textT(g, "quando o render trava", 360, 336, { size: 34, font: "MXB", color: "#9a989f", align: "center" });
  g.restore();
  const burst = M.outCubic(clamp(tg / 0.14, 0, 1));
  const esc = lerp(0.24, 1, burst);
  const dim = enter(tg, 0.35, 0.2);
  if (dim > 0.01) {
    g.save(); g.globalAlpha = 0.3 * dim;
    for (let i = 0; i < 14; i++) {
      const w = 40 + Math.abs(Math.sin(i * 2.1)) * 300;
      rr(g, 78 + (i % 3) * 160, 440 + i * 12, w, 10, 5); g.fillStyle = "rgba(255,255,255,.10)"; g.fill();
    }
    g.restore();
  }
  const gl = 1 + Math.sin(tg * 22) * 0.012;
  g.save(); g.translate(360, 660);
  g.rotate(-0.03); g.scale(1.06 * gl * esc, gl * esc);
  if (burst < 0.98) {
    // ghosts do burst (echo): cópias na escala anterior, alpha caindo
    for (const [gf, ga] of [[0.72, 0.35], [0.5, 0.2]]) {
      g.save(); g.globalAlpha = (1 - burst) * ga;
      g.scale(gf, gf);
      textT(g, "99%", 0, 62, { size: 240, font: "AB", color: C.white, align: "center", tracking: -10 });
      g.restore();
    }
  }
  for (const [cor, dx] of [["#22d3ee", -6], ["#f0396b", 6], [C.white, 0]]) {
    textT(g, "99%", dx, 62, { size: 240, font: "AB", color: cor, align: "center", tracking: -10 });
  }
  g.restore();
  if (t > 2.05) { emojiCool(g, 620, 890, 30); cursor(g, 560, 960, { label: AGENTE }); }
});

// ================================================================== 7) O que ele faz é escrever código
add(27.10, 30.40, "B7", (g, lt) => {
  bg(g, lt, { gx: 360, gy: 620, glowA: 0.11, gr: 520, dots: 0.045 });
  const a1 = enter(lt, 0.05, 0.2), a2 = enter(lt, 0.5, 0.2);
  // "O que ele faz é" em CINZA (o ref: cinza, não branco)
  g.save(); g.globalAlpha = a1 * (1 - a2);
  textT(g, "O que", 360, 466, { size: 36, font: "MB", color: "#9a989f", align: "center" });
  g.restore();
  if (a2 > 0.01) {
    g.save(); g.globalAlpha = a2;
    textT(g, "O que ele faz é", 360, 466, { size: 36, font: "MB", color: "#9a989f", align: "center" });
    g.restore();
  }

  // SANFONA: as chaves chegam das LATERAIS e apertam o texto (acordeão). Antes
  // elas caíam dos cantos de cima e o texto não reagia — parecia colagem.
  const uCh = clamp((lt - 1.95) / 0.5, 0, 1);
  const eCh = uCh > 0 ? M.outElastic(uCh) : 0;
  const sq = 1 - 0.13 * clamp(eCh, 0, 1.2);          // compressão horizontal do texto

  g.save();
  g.translate(360, 640); g.scale(sq, 1); g.translate(-360, -640);
  // "escrever" digitado letra a letra (caret bloco laranja)
  typing(g, "escrever", 360, 596, {
    size: 100, font: "AB", tracking: -2, align: "center", color: C.white,
    t: lt, t0: 0.55, ms: 75, solid: 0.2, caret: true, caretCor: ORANGE,
  });
  // "código" em laranja, também digitado
  typing(g, "código", 360, 716, {
    size: 100, font: "AB", tracking: -2, align: "center", color: "#e8603a",
    t: lt, t0: 1.3, ms: 75, solid: 0.2, caret: true, caretCor: ORANGE,
  });
  g.restore();

  // chaves: entram da esquerda e da direita, esticam e abraçam o texto
  if (uCh > 0.001) {
    chaveSola(g, lerp(-160, 84, eCh), 648, 250, 1, { cor: "rgba(150,149,158,.95)", lw: 15, q: 34 });
    chaveSola(g, lerp(880, 636, eCh), 648, 250, -1, { cor: "rgba(150,149,158,.95)", lw: 15, q: 34 });
  }
});

// ================================================================== 8) cards → são feitas em HTML
add(30.40, 34.20, "B8", (g, lt) => {
  bg(g, lt, { gx: 360, gy: 700, glowA: 0.08, gr: 520, dots: 0.045 });
  // PAREDE 3x3 uniforme: os cards sobem um a um, a grade ANDA (esquerda → desce →
  // direita) e no fim CAI ao centro, com as 9 seções aparecendo. Antes os cards
  // ficavam empilhados uns por cima dos outros.
  let dx = 0, dy = 0, sc = 1;
  if (lt > 0.95 && lt < 1.95) {
    dx = lerp(0, -300, M.smooth(clamp((lt - 0.95) / 1.0, 0, 1)));
  } else if (lt >= 1.95 && lt < 2.65) {
    dx = -300; dy = lerp(0, 230, M.smooth(clamp((lt - 1.95) / 0.7, 0, 1)));
  } else if (lt >= 2.65 && lt < 3.55) {
    dy = 230; dx = lerp(-300, 290, M.smooth(clamp((lt - 2.65) / 0.9, 0, 1)));
  } else if (lt >= 3.55) {
    const e = clamp(M.outElastic(clamp((lt - 3.55) / 0.85, 0, 1)), 0, 1.35);
    dx = lerp(290, 0, e); dy = lerp(230, 0, e); sc = lerp(1, 0.74, e);
  }
  gridCards(g, { t: lt, dx, dy, sc, marca: MARCA, mote: MOTE });
  if (lt < 3.2) cursor(g, 600 - dx * 0.1, 1090 - dy * 0.1, { label: AGENTE, alpha: enter(lt, 0.2, 0.3) });
  // "são feitas" digitando por cima, quando a parede já caiu ao centro
  if (lt >= 3.7) {
    const t = lt - 3.7;
    typeStep(g, [[0.02, "são feitas"], [0.34, "são feitas em"]], t,
      { size: 56, font: "AB", color: C.white, align: "center", x: 360, y: 250, tracking: -2, novo: "#8a8890" });
  }
});

// ================================================================== 9) como quem de fato escreve um site
add(34.20, 38.40, "B9", (g, lt) => {
  bg(g, lt, { gx: 360, gy: 640, glowA: 0.09, gr: 560 });
  // === a mágica do 0:38: "são feitas em" → "html" fica LARANJA → o html VOA
  // para o card de código → pousa com impacto → o card começa a escrever.
  if (lt < 3.7) {
    const WX = 56, WY = 470, WW = 608, WH = 430;
    // a grade 3x3 do B8 ainda está ali e vai SUMINDO — o corte entre os blocos
    // não pode aparecer (antes ela desaparecia de um frame para o outro)
    if (lt < 0.5) {
      g.save(); g.globalAlpha *= 1 - clamp(lt / 0.45, 0, 1);
      gridCards(g, { t: 9, sc: 0.74, marca: MARCA, mote: MOTE });
      g.restore();
    }
    const wIn = enter(lt, 1.12, 0.3);
    // texto de cima (veio do B8, mesmas coordenadas: sem corte visível)
    textT(g, "são feitas em", 360, 250, { size: 56, font: "AB", color: C.white, align: "center", tracking: -2 });

    // card de código (janela) por baixo
    const sair = clamp((lt - 2.95) / 0.6, 0, 1);
    const treme = lt > 1.45 ? Math.sin((lt - 1.45) * 42) * 8 * clamp(1 - (lt - 1.45) / 0.5, 0, 1) : 0;
    if (wIn > 0.01) {
      g.save();
      g.globalAlpha = wIn * (1 - sair);
      g.translate(treme - sair * 130, (1 - wIn) * 26 - sair * 150);
      g.scale(1 - sair * 0.28, 1 - sair * 0.28);
      macWindow(g, WX, WY, WW, WH, { title: "motion.html", bgCor: "#131317", r: 14, chromeH: 40, titleSize: 17 });
      const linhas = [
        ["<html>", "#7c9bf0"],
        ["  <section id=\"titulo\">", "#e8603a"],
        ["    <h1>", "#8fd48f"],
        ["    </h1>", "#8fd48f"],
        ["  </section>", "#e8603a"],
      ];
      // linha 1 nasce com o POUSO (1,45) e o resto vai sendo escrito
      const nLin = lt < 1.45 ? 0 : clamp(1 + Math.floor((lt - 1.55) / 0.30), 1, linhas.length);
      for (let i = 0; i < linhas.length; i++) {
        const ly = WY + 92 + i * 46;
        if (i === nLin - 1 && nLin < linhas.length) {
          rr(g, WX + 6, ly - 22, WW - 12, 40, 0); g.fillStyle = "#24242b"; g.fill();
          g.fillStyle = ORANGE; g.fillRect(WX + 6, ly - 22, 4, 40);
        }
        textT(g, String(i + 1), WX + 30, ly, { size: 20, font: "Mono", color: "#6d6d76" });
        if (i < nLin) textT(g, linhas[i][0], WX + 64, ly, { size: 20, font: "Mono", color: linhas[i][1] });
      }
      // caret laranja piscando na linha viva
      if (nLin >= 1 && nLin < linhas.length && Math.floor(lt * 3.2) % 2 === 0) {
        const ci = nLin - 1, txt = linhas[ci][0];
        const wx2 = WX + 64 + measureT(g, txt, { size: 20, font: "Mono" });
        g.fillStyle = ORANGE; g.fillRect(wx2 + 2, WY + 92 + ci * 46 - 19, 11, 26);
      }
      g.restore();
    }
    // pílula "Linha 0N" embaixo do card
    if (lt > 1.5) {
      const lb = enter(lt, 1.5, 0.22) * (1 - sair);
      const n = lt < 1.55 ? 1 : Math.min(5, 1 + Math.floor((lt - 1.55) / 0.30));
      g.save(); g.globalAlpha = lb;
      const lbl = `Linha 0${n}`;
      g.font = "700 22px MB";
      const bw2 = g.measureText(lbl).width + 44;
      rr(g, 360 - bw2 / 2, WY + WH + 24, bw2, 44, 22); g.fillStyle = ORANGE; g.fill();
      textT(g, lbl, 360, WY + WH + 54, { size: 22, font: "MB", color: "#fff", align: "center" });
      g.restore();
    }
    // "html" grande, laranja, com as setinhas azuis: ele VOA até a linha 1
    const aHtml = enter(lt, 0.02, 0.24);
    const voo = clamp((lt - 0.95) / 0.5, 0, 1);
    const eVoo = voo * voo * voo;                     // acelera ao cair
    const hx = lerp(360, WX + 108, eVoo), hy = lerp(700, WY + 86, eVoo);
    const hs = lerp(1, 0.14, eVoo);
    if (aHtml > 0.01 && lt < 1.47) {
      g.save();
      g.globalAlpha = aHtml * (1 - clamp((voo - 0.75) / 0.25, 0, 1) * 0.85);
      g.translate(hx, hy); g.scale(hs, hs);
      if (voo > 0.04 && voo < 0.99) {
        for (const [ox, al] of [[0.16, 0.3], [0.32, 0.15]]) {
          g.save(); g.globalAlpha *= al; g.translate(-ox * 260, ox * 120);
          textT(g, "html", 0, 0, { size: 150, font: "AB", color: "#e8603a", align: "center", tracking: -5 });
          g.restore();
        }
      }
      textT(g, "html", 0, 0, { size: 150, font: "AB", color: "#e8603a", align: "center", tracking: -5 });
      // <  e  > azuis
      g.strokeStyle = "#4d7fe0"; g.lineWidth = 16; g.lineCap = "round"; g.lineJoin = "round";
      for (const dir of [-1, 1]) {
        g.save(); g.translate(dir * 250, -4); g.scale(dir, 1);
        g.beginPath(); g.moveTo(-26, -54); g.lineTo(26, 4); g.lineTo(-26, 60); g.stroke();
        g.restore();
      }
      g.restore();
    }
    // impacto do pouso: anel de choque na linha 1
    const ip = clamp((lt - 1.45) / 0.3, 0, 1);
    if (lt > 1.45 && ip < 1) {
      g.save(); g.globalAlpha = (1 - ip) * 0.55;
      circle(g, WX + 96, WY + 82, 8 + 40 * M.outCubic(ip));
      g.strokeStyle = "#ffd9c6"; g.lineWidth = 3; g.stroke();
      g.restore();
    }
    return;
  }
  // === 2º beat: "como quem de fato escreve um site" + navegador
  const t = lt - 3.7;
  const a1 = enter(t, 0.02, 0.2), a2 = enter(t, 0.25, 0.2);
  g.save(); g.globalAlpha = a1;
  textT(g, "como quem de fato", 360, 240, { size: 34, font: "MB", color: "#9a989f", align: "center" });
  g.restore();
  if (a2 > 0.01) {
    g.save(); g.globalAlpha = a2;
    const w1 = measureT(g, "escreve", { size: 60, font: "AB", tracking: -2 });
    const w2 = measureT(g, "um site", { size: 60, font: "AB", tracking: -2 });
    textT(g, "escreve", 360 - (w1 + 16 + w2) / 2 + w1 / 2, 342, { size: 60, font: "AB", color: C.white, align: "center", tracking: -2 });
    g.restore();
  }
  const a3 = enter(t, 0.8, 0.2);
  if (a3 > 0.01) {
    g.save(); g.globalAlpha = a3;
    const w1 = measureT(g, "escreve", { size: 60, font: "AB", tracking: -2 });
    const w2 = measureT(g, "um site", { size: 60, font: "AB", tracking: -2 });
    textT(g, "um site", 360 + (w1 + 16 + w2) / 2 - w2 / 2, 342, { size: 60, font: "AB", color: C.white, align: "center", tracking: -2 });
    g.restore();
  }
  // navegador: o ref mostra o site BRANCO E VAZIO primeiro (35,5-36,3) e o conteúdo
  // só aparece depois — caret liga o conteúdo do browserWindow
  const bIn = enter(t, 0.02, 0.28);
  if (bIn > 0.01) {
    g.save(); g.globalAlpha = bIn;
    browserWindow(g, 56, 400 + (1 - bIn) * 24, 508, 580, {
      url: "motion.html", focus: "#2a2a30", badge: t > 1.15 ? "755 × 860" : null,
      caret: t > 1.15, // ref: site BRANCO e vazio primeiro; conteúdo só depois
    });
    g.restore();
  }
});

// ================================================================== 10) frame por frame
add(38.40, 41.95, "B10", (g, lt) => {
  bg(g, lt, { gx: 360, gy: 620, glowA: 0.10, gr: 560, dots: 0.045 });
  const a1 = enter(lt, 0.9, 0.18), a2 = enter(lt, 1.95, 0.18);
  if (a1 > 0.01) {
    g.save(); g.globalAlpha = a1;
    textT(g, "frame", 75, 250, { size: 62, font: "AB", color: C.white, tracking: -2 });
    g.restore();
  }
  if (a2 > 0.01) {
    g.save(); g.globalAlpha = a2;
    const w = measureT(g, "frame ", { size: 62, font: "AB", tracking: -2 });
    textT(g, "por frame", 75 + w, 250, { size: 62, font: "AB", color: C.white, tracking: -2 });
    g.restore();
  }
  const cIn = enter(lt, 0.05, 0.26);
  phoneCard(g, 235, 360, 250, 400, { marca: MARCA, mote: MOTE, glow: true, alpha: cIn, r: 26 });
  const brIn = enter(lt, 0.55, 0.24);
  if (brIn > 0.01) brackets(g, 213, 335, 294, 450, { a: brIn });
  const miniIn = enter(lt, 0.3, 0.24);
  if (miniIn > 0.01) phoneCard(g, 78, 830, 100, 158, { marca: MARCA, mote: null, glow: true, alpha: miniIn, r: 12 });
  const chipIn = enter(lt, 0.75, 0.2);
  if (chipIn > 0.01) {
    const f = Math.min(2545, 1 + Math.round(clamp(lt - 1.0, 0, 30) * 60));
    g.save(); g.globalAlpha = chipIn;
    g.font = "500 19px Mono";
    const lbl = `frame  ${String(f).padStart(4, "0")}  /  2562`;
    const w = g.measureText(lbl).width + 62;
    rr(g, 360 - w / 2, 855, w, 40, 20); g.fillStyle = "#1b1b20"; g.fill();
    circle(g, 360 - w / 2 + 22, 875, 6); g.fillStyle = "#e5484d"; g.fill();
    textT(g, lbl, 360 - w / 2 + 38, 882, { size: 19, font: "Mono", color: "#dcdce2" });
    g.restore();
  }
  const fIn = enter(lt, 2.1, 0.3);
  const rz = clamp((lt - 3.0) / 0.55, 0, 1);
  if (fIn > 0.01 && rz < 1) {
    g.save(); g.globalAlpha = fIn * (1 - rz);
    // super velocidade: o rolo acelera (40 px/s → 170 px/s) a partir de lt 2,6
    const vel = lt < 2.6 ? 40 : 170;
    filmstrip(g, { y: 1000, h: 190, n: 6, off: clamp(lt - 2.1, 0, 3) * vel });
    g.restore();
  }
  // telas "printadas" CAINDO para o rolo (o ref: screenshot → caem → viram frames)
  if (lt > 1.15 && lt < 2.85) {
    for (let k = 0; k < 3; k++) {
      const u = clamp((lt - 1.15 - k * 0.45) / 0.5, 0, 1);
      if (u <= 0.02 || u >= 0.98) continue;
      const yy = lerp(430, 1030, u * u);
      g.save(); g.globalAlpha *= 1 - u * 0.3;
      phoneCard(g, 258 + k * 26, yy, 96, 150, { marca: MARCA, mote: MOTE, glow: true, alpha: 1, r: 10 });
      g.restore();
    }
  }
  // o rolo SOBE e vira UMA imagem (lt 3,0-3,55: sobe + a imagem grande aparece)
  if (rz > 0 && fIn > 0.01) {
    g.save(); g.globalAlpha = fIn;
    g.translate(0, -rz * 330);
    filmstrip(g, { y: 1000, h: 190, n: 6, off: 120 + lt * 170 });
    g.restore();
    if (rz > 0.35) {
      g.save(); g.globalAlpha = (rz - 0.35) / 0.65;
      phoneCard(g, 210, 400, 300, 470, { marca: MARCA, mote: MOTE, glow: true, alpha: 1, r: 26 });
      brackets(g, 190, 375, 340, 520, { a: 1 });
      g.restore();
    }
  }
});

// ================================================================== 11) e depois junta tudo em um vídeo
add(41.95, 43.95, "B11", (g, lt) => {
  bg(g, lt, { gx: 360, gy: 640, glowA: 0.10, gr: 560 });
  const a1 = enter(lt, 0.05, 0.18);
  const a2 = enter(lt, 0.5, 0.18);
  const a3 = enter(lt, 1.6, 0.18);
  if (a1 > 0.01) {
    g.save(); g.globalAlpha = a1 * (1 - enter(lt, 0.42, 0.2));
    textT(g, "e depois junta tudo", 360, 330, { size: 44, font: "AB", color: C.white, align: "center", tracking: -1.6 });
    g.restore();
  }
  if (a2 > 0.01) {
    g.save(); g.globalAlpha = a2;
    textT(g, "em um", 292, 340, { size: 46, font: "AB", color: C.white, align: "center", tracking: -1.6 });
    g.restore();
  }
  if (a3 > 0.01) {
    g.save(); g.globalAlpha = a3;
    const s = easeOutBack(a3, 1.6);
    g.translate(430, 340); g.scale(lerp(0.9, 1, s), lerp(0.9, 1, s));
    textT(g, "vídeo", 0, 0, { size: 46, font: "AB", color: "#e8603a", align: "center", tracking: -1.6 });
    g.restore();
  }
  const cIn = enter(lt, 0.25, 0.26);
  if (cIn > 0.01) {
    g.save(); g.globalAlpha = cIn;
    phoneCard(g, 232, 420, 250, 400, { marca: "MOTION", mote: null, glow: true, play: lt > 0.7, progress: true, r: 26 });
    g.restore();
  }
  const pIn = enter(lt, 1.75, 0.22);
  if (pIn > 0.01) {
    g.save(); g.globalAlpha = pIn;
    mediaPill(g, 360, 860, { nome: "video.mp4", dur: "01:25" });
    g.restore();
  }
  if (lt > 1.2) cursor(g, lerp(560, 520, seg(lt, 1.2, 2.0)), lerp(960, 900, seg(lt, 1.2, 2.0)), { label: AGENTE });
});

// ================================================================== 12) O texto que você tá lendo
add(43.95, 49.20, "B12", (g, lt) => {
  bg(g, lt, { gx: 360, gy: 700, glowA: 0.07, gr: 600 });
  // tail: o zoom do telefone começa AQUI no ref (t=49 = 9,0 de movimento) — o bloco
  // inteiro cresce nos últimos 0,3 s (depois de t=48, que é calmo no ref: 0,22).
  const zz = lt > 4.95 ? Math.exp(2.2 * (lt - 4.95)) : 1;
  g.save();
  if (zz > 1.001) { g.translate(360, 560); g.scale(zz, zz); g.translate(-360, -560); }
  const W = (tt, w, extra = {}) => ({ t: tt, w, ...extra });
  // o ref mostra o texto CENTRALIZADO e GRANDE (não canto superior esquerdo pequeno)
  kineticLine(g, [
    W(0.05, "O texto"), W(0.5, "que você tá"), W(1.05, "lendo agora foi"),
    W(1.85, "animado por uma"), W(2.35, "IA", { box: ORANGE }),
    W(2.8, "que tá falando sobre"), W(3.75, "ela mesma,", { cor: "#e8603a" }),
    W(4.3, "animando", { cor: "#e8603a" }), W(4.75, "o texto que você tá"), W(5.2, "lendo agora."),
  ], lt, { x: 360, y: 360, size: 40, font: "MXB", maxW: 620, lineH: 1.36, dim: false, riseY: 8, align: "center" });
  // anotação "(ela mesma)"
  const an = enter(lt, 5.1, 0.3);
  if (an > 0.01) {
    g.save(); g.globalAlpha *= an;
    g.strokeStyle = "#f0a13c"; g.lineWidth = 2;
    g.beginPath(); g.ellipse(300, 218, 148, 46, -0.06, 0, Math.PI * 2); g.stroke();
    textT(g, "(ela mesma)", 310, 286, { size: 19, font: "ISI", color: "#c9a06a", align: "center" });
    g.restore();
    cursor(g, 340, 296, { label: AGENTE, scale: 0.8 });
  }
  // cartãozinho com a miniatura do próprio bloco
  const mc = enter(lt, 5.5, 0.3);
  if (mc > 0.01) {
    g.save(); g.globalAlpha *= mc;
    rr(g, 250, 620 + (1 - mc) * 20, 240, 400, 18); g.fillStyle = "#141418"; g.fill();
    g.strokeStyle = "rgba(255,255,255,.12)"; g.lineWidth = 2; g.stroke();
    textT(g, "O texto que você tá", 272, 694, { size: 13, font: "MXB", color: C.white });
    textT(g, "lendo agora foi", 272, 716, { size: 13, font: "MXB", color: C.white });
    textT(g, "animado por uma", 272, 738, { size: 13, font: "MXB", color: C.white });
    g.fillStyle = ORANGE; g.fillRect(394, 728, 15, 13);
    textT(g, "que tá falando sobre", 272, 760, { size: 13, font: "MXB", color: C.white });
    textT(g, "ela mesma, animando o", 272, 782, { size: 13, font: "MXB", color: "#e8603a" });
    textT(g, "texto que você tá", 272, 804, { size: 13, font: "MXB", color: C.white });
    textT(g, "lendo agora.", 272, 826, { size: 13, font: "MXB", color: C.white });
    rr(g, 310, 946, 120, 56, 6); g.fillStyle = "#22222a"; g.fill();
    textT(g, "00:12:04", 326, 980, { size: 11, font: "Mono", color: "#9a9aa4" });
    g.restore();
  }
  g.restore();
});

// ================================================================== 13) deu um nó
add(49.20, 53.30, "B13", (g, lt) => {
  bg(g, lt, { gx: 360, gy: 700, glowA: 0.09, gr: 560 });
  // TELEFONE DENTRO DE TELEFONE (picos do ref: 9,0 / 23,8 / 28,1 em 49–51):
  // fase 1 — zoom exponencial acelerando (1→8,5 em 1,1 s, ~6%/frame no fim);
  // fase 2 — o telefone ocupa a tela e o TEXTO INTERNO ROLA rápido (é isso que
  // sustenta os 28 do ref em t=51) + tilt crescendo. Níveis 0,55×: fuga infinita.
  if (lt < 2.62) {
    // o zoom NÃO para: o nível corrente cresce de 35% até estourar a tela (ref
    // 51,0-51,8: o telefone dobra de tamanho) — exp até 7,7, depois linear até 15
    const zz = lt <= 1.05 ? Math.exp(1.75 * lt) : 6.4 + 8.6 * clamp((lt - 1.05) / 1.55, 0, 1);
    // o ref GIRA o telefone inteiro no fim (51,0-51,8: ~100°, com blur) —
    // ~2,5 rad/s; 0,57 rad/s media 53% do pico do ref
    const rot = (lt < 1.2 ? Math.sin(lt * 1.1) * 0.03 : 0) - 0.02 - 2.2 * M.smooth(clamp((lt - 1.35) / 1.25, 0, 1));
    // rolagem moderada (~0,5→0,8 linha/frame): o efeito é a TELA CRESCENDO
    // (infinito), não letras voando — o usuário marcou o excesso
    const su = clamp((lt - 0.85) / 0.45, 0, 1);
    const scroll = 380 + 420 * M.smooth(su);
    // CADEIA DESCENDENTE (ref 50-51: cada filho fica na parte de BAIXO da tela do
    // pai, como uma câmera apontando para a tela — NÃO é túnel concêntrico)
    const NIV = 6, RAZ = 0.52;
    const niveis = [];
    let ncx = 360, ncy = 640, npw = 300, nph = 520;
    for (let d = 0; d < NIV; d++) {
      niveis.push({ cx: ncx, cy: ncy, w: npw, h: nph });
      ncy += nph * 0.24; npw *= RAZ; nph *= RAZ;
    }
    // o foco ACOMPANHA a cadeia, mas os marcos são quando o PRÓXIMO nível toma a
    // tela (zz·w_{d+1} = 720): 4,6 / 8,9 / 17,1 — focar cedo deixa o nível que
    // preenche deslocado e um nível pequeno centrado (bug da folha d51)
    const zMs = [2.3, 4.6, 8.9, 17.1];
    let fy = niveis[0].cy;
    for (let i = 0; i < zMs.length - 1; i++) {
      if (zz >= zMs[i]) {
        const uu = clamp((Math.log(zz) - Math.log(zMs[i])) / (Math.log(zMs[i + 1]) - Math.log(zMs[i])), 0, 1);
        fy = lerp(niveis[Math.min(i, NIV - 2)].cy, niveis[Math.min(i + 1, NIV - 1)].cy, uu);
      }
    }
    if (zz >= zMs[zMs.length - 1]) fy = niveis[NIV - 2].cy;
    // MOTION BLUR (o ref 51,4-51,8 é borrado — dois frames borrados diferem muito
    // mais que dois nítidos; sem blur a rotação média 42% do pico do ref):
    // desenha a recursão 3× em sub-frames (0 / -33 ms / -66 ms) com alpha caindo.
    const desenhaRec = (lt2) => {
      const li = ["O texto que você tá", "lendo agora foi", "animado por uma IA", "que tá falando sobre", "ela mesma, animando o", "texto que você tá lendo", "agora."];
      // zoom: parado até lt 0,35 (o ref t=49 só acelera no fim da janela), exp até
      // 4,96, depois linear até 15 — o nível corrente cresce até estourar a tela
      const zz2 = lt2 < 0.35 ? 1
        : lt2 <= 1.05 ? Math.exp(2.3 * (lt2 - 0.35))
        : 6.4 + 8.6 * clamp((lt2 - 1.05) / 1.55, 0, 1);
      const rot2 = (lt2 < 1.2 ? Math.sin(lt2 * 1.1) * 0.03 : 0) - 0.02 - 2.2 * M.smooth(clamp((lt2 - 1.35) / 1.25, 0, 1));
      const su2 = clamp((lt2 - 0.85) / 0.45, 0, 1);
      const scroll2 = 450 + 950 * M.smooth(su2);
      let fy2 = niveis[0].cy;
      for (let i = 0; i < zMs.length - 1; i++) {
        if (zz2 >= zMs[i]) {
          const uu = clamp((Math.log(zz2) - Math.log(zMs[i])) / (Math.log(zMs[i + 1]) - Math.log(zMs[i])), 0, 1);
          fy2 = lerp(niveis[Math.min(i, NIV - 2)].cy, niveis[Math.min(i + 1, NIV - 1)].cy, uu);
        }
      }
      if (zz2 >= zMs[zMs.length - 1]) fy2 = niveis[NIV - 2].cy;
      g.save();
      g.translate(360, fy2); g.rotate(rot2); g.scale(zz2, zz2); g.translate(-360, -fy2);
      for (let d = 0; d < NIV; d++) {
        const { cx: lx, cy: ly, w, h } = niveis[d];
        const k = w / 300;
        const x = lx - w / 2, y = ly - h / 2;
        rr(g, x, y, w, h, Math.max(3, 22 * k)); g.fillStyle = "#0c0c10"; g.fill();
        g.strokeStyle = `rgba(255,255,255,${0.07 + 0.03 * (d % 2)})`; g.lineWidth = Math.max(0.8, 2 * k); g.stroke();
        const fs = 20 * k, lh = 30 * k, y0 = y + 44 * k;
        const off = ((scroll2 * k) % (7 * lh) + 7 * lh) % (7 * lh);
        const shift = Math.floor((scroll2 * k) / lh);
        g.save();
        g.beginPath(); g.rect(x, y, w, h); g.clip();
        // 22 linhas: o corpo do card tem 520k/30k ≈ 17 linhas de altura — desenhar
        // só 9 deixava 60% do telefone VAZIO no zoom alto (teto do diff em t=51)
        for (let i = 0; i < 22; i++) {
          const idx = ((i - shift) % 7 + 7) % 7;
          const txt = d < 4 ? li[idx] : "O texto que você tá lendo";
          textT(g, txt, x + 18 * k, y0 + i * lh - off, { size: fs, font: "MXB", color: idx === 4 ? "#e8603a" : C.white });
        }
        g.restore();
      }
      g.restore();
    };
    g.save();
    // fantasmas ANTES (do mais velho), principal POR ÚLTIMO em alpha cheio —
    // ao contrário, os fills escuros dos fantasmas cobrem o texto e matam o contraste
    g.globalAlpha = 0.22; desenhaRec(lt - 2 / 15);
    g.globalAlpha = 0.45; desenhaRec(lt - 1 / 15);
    g.globalAlpha = 1; desenhaRec(lt);
    g.restore();
    return;
  }
  const a1 = enter(lt, 2.62, 0.2);
  const dim = 1 - 0.55 * enter(lt, 3.4, 0.3);
  g.save(); g.globalAlpha = a1 * dim;
  g.font = "64px AB";
  const w1 = measureT(g, "deu um ", { size: 62, font: "AB", tracking: -2 });
  const w0 = measureT(g, "deu um nó", { size: 62, font: "AB", tracking: -2 });
  textT(g, "deu um", 360 - w0 / 2, 250, { size: 62, font: "AB", color: C.white, tracking: -2 });
  textT(g, "nó", 360 - w0 / 2 + w1, 250, { size: 62, font: "AB", color: "#e8603a", tracking: -2 });
  g.restore();
  const kp = clamp((lt - 2.75) / 1.2, 0, 1);
  // INFINITO (∞) desenhado progressivamente — o ref desenha um laço infinito
  // (não um nó torto); no beat seguinte ele vira a linha sonoidal do B14
  g.save();
  g.translate(360, 640);
  g.rotate(sway(lt, 0.03, 3.4));
  g.strokeStyle = "#f0561e"; g.lineWidth = 15; g.lineCap = "round";
  const R = 64, dxo = 68;
  // sweep máximo 1,995·π: 2π exato com anticlockwise some em alguns canvas
  if (kp > 0) {
    const pa = Math.min(1, kp / 0.5) * Math.PI * 1.995;
    g.beginPath();
    g.arc(-dxo, 0, R, Math.PI / 2, Math.PI / 2 - pa, true);
    g.stroke();
  }
  if (kp > 0.5) {
    const pb = ((kp - 0.5) / 0.5) * Math.PI * 1.995;
    g.beginPath();
    g.arc(dxo, 0, R, Math.PI / 2, Math.PI / 2 + pb, false);
    g.stroke();
  }
  g.restore();
  const a2 = enter(lt, 3.35, 0.25);
  if (a2 > 0.01) {
    g.save(); g.globalAlpha = a2;
    textT(g, "na sua cabeça?", 360, 322, { size: 28, font: "MXB", color: "#9a989f", align: "center" });
    g.restore();
  }
});

// ================================================================== 14) relaxa + waveform
add(53.30, 55.80, "B14", (g, lt) => {
  bg(g, lt, { gx: 360, gy: 640, glowA: 0.10, gr: 520 });
  if (lt < 0.62) {
    const a = enter(lt, 0.02, 0.16);
    g.save(); g.globalAlpha = a;
    textT(g, "relaxa", 360, 380, { size: 78, font: "ISI", color: "#f0efe8", align: "center" });
    g.restore();
    squiggle(g, 190, 700, 340, { p: clamp(lt / 0.45, 0, 1) });
    return;
  }
  const t = lt - 0.62;
  const wA = enter(t, 0.02, 0.2);
  g.save(); g.globalAlpha = wA;
  // duas linhas: a segunda é "quando eu gravava esse" (no ref ela entra logo abaixo)
  typeStep(g, [[0.02, "deu"], [0.22, "deu na"], [0.4, "deu na minha"], [0.58, "deu na minha própria"], [0.74, "deu na minha também"]], t,
    { size: 62, font: "AB", color: C.white, x: 30, y: 248, tracking: -2.4, novo: "#e8603a" });
  const w2 = enter(t, 0.95, 0.2);
  if (w2 > 0.01) {
    g.save(); g.globalAlpha *= w2;
    textT(g, "quando eu gravava esse", 30, 316, { size: 40, font: "AB", color: "#7d7b84", tracking: -1.4 });
    g.restore();
  }
  waveform(g, 62, 470, 600, 330, { t, playhead: 0.62 });
  // o trefoil do beat anterior fica pequeno no topo, girando devagar
  if (lt > 1.85) {
    g.save();
    g.translate(360, 196 + sway(t, 3, 2.4));
    g.rotate(sway(t, 0.06, 3.1));
    knot(g, 0, 0, 30, { p: 1, lw: 6 });
    g.restore();
  }
});

// ================================================================== 15) o melhor de tudo / muito leve
add(55.80, 60.03, "B15", (g, lt) => {
  bg(g, lt, { gx: 360, gy: 700, glowA: 0.05, gr: 600 });
  if (lt < 2.5) {
    // abre com a estrelinha ✦ que brilha e some (ref 55,8-56,1), texto depois
    const su2 = clamp((lt - 0.02) / 0.55, 0, 1);
    sparkle(g, 360, 580, Math.sin(su2 * Math.PI) * 26);
    const a3 = enter(lt, 1.75, 0.2);
    typeStep(g, [[0.45, "o melhor"], [1.4, "o melhor de"], [1.72, "o melhor de tudo"]], lt,
      { size: 40, font: "MB", color: C.white, align: "center", x: 360, y: 880, novo: "#e8603a" });
    if (a3 > 0.01) { g.save(); g.globalAlpha = a3; textT(g, "muito", 360, 940, { size: 32, font: "MB", color: "#9a989f", align: "center" }); g.restore(); }
    const al = enter(lt, 2.15, 0.3);
    if (al > 0.01) {
      g.save(); g.globalAlpha = al * 0.9;
      textT(g, "leve", 360, 1080, { size: 62, font: "ISI", color: "#cfcdc4", align: "center" });
      g.restore();
      g.save(); g.globalAlpha = al;
      cardHero(g, 480, 900, 200, 176, { marca: MARCA, title: "EM HTML.", btn: "Assista", dots: false });
      g.restore();
    }
    return;
  }
  const t = lt - 2.5;
  const a1 = enter(t, 0.0, 0.2), a2 = enter(t, 0.25, 0.2);
  g.save(); g.globalAlpha = a1;
  textT(g, "muito fácil", 360, 640, { size: 34, font: "MB", color: "#9a989f", align: "center" });
  g.restore();
  if (a2 > 0.01) {
    g.save(); g.globalAlpha = a2;
    textT(g, "de", 360, 726, { size: 48, font: "MB", color: C.white, align: "center" });
    g.restore();
    const blink = Math.floor(lt * 3) % 2 === 0;
    if (blink) { g.fillStyle = "#2a2a30"; g.fillRect(378, 690, 2.5, 42); }
  }
  const a3 = enter(t, 0.45, 0.18);
  if (a3 > 0.01) {
    g.save(); g.globalAlpha = a3;
    textT(g, "de alterar", 360, 726, { size: 48, font: "MB", color: C.white, align: "center" });
    g.restore();
  }
});

// ================================================================== 16) não gostou da cor?
add(60.03, 62.50, "B16", (g, lt) => {
  bg(g, lt, { gx: 360, gy: 640, glowA: 0.10, gr: 560 });
  const cIn = enter(lt, 0.05, 0.3);
  // clique → morf laranja→roxo: no ref o morf completa ~62,0 e o arco GIGANTE varre
  // o topo até 62,2 — morf em lt 1,6-2,0 (61,63-62,03) para o pico cair em t=62.
  const morf = clamp((lt - 1.6) / 0.4, 0, 1);
  if (lt > 1.45 && lt < 2.05) ringClick(g, 622, 916, lt, 1.55, { cor: "#8b6cf6", r1: 150 });
  // chat "mudar a cor para" clicável (o ref: a seta clica no enviar e a cor muda)
  if (lt > 0.9 && lt < 2.05) {
    chatInput(g, 68, 890, 584, { texto: lt > 0.9 ? "mudar a cor pra roxo" : "" });
    if (lt > 1.45) cursor(g, 622, 916, { label: null });
  }
  const flip = 1 - 0.14 * Math.sin(clamp((lt - 1.6) / 0.4, 0, 1) * Math.PI);
  const dip = -14 * Math.sin(clamp((lt - 1.6) / 0.4, 0, 1) * Math.PI);
  g.save(); g.globalAlpha = cIn;
  g.translate(0, (1 - cIn) * 20 + dip);
  g.translate(360, 520); g.scale(flip, 1); g.translate(-360, -520);
  cardHero(g, 110, 300, 500, 440, { marca: "MOTION", title: "EM HTML.", btn: "Assista", dots: lt > 0.2, morf, pctBar: 0.16 + 0.39 * morf });
  g.restore();
  // o arco do ref é GROSSO e varre até fora do frame (62,0-62,2: pico de 6,4)
  if (lt > 1.55 && lt < 2.3) {
    const u = (lt - 1.55) / 0.75;
    g.save();
    g.globalAlpha = (1 - u) * 0.9;
    g.strokeStyle = "#8b6cf6"; g.lineWidth = lerp(110, 8, u); g.lineCap = "round";
    g.beginPath(); g.arc(150, 330, 30 + u * 800, -1.2, 1.4); g.stroke();
    g.restore();
  }
  typeStep(g, [[0.35, "não gostou"], [0.8, "não gostou da"], [1.02, "não gostou da cor?"]], lt,
    { size: 40, font: "AB", color: C.white, align: "center", x: 360, y: 830, tracking: -1.4, novo: "#e8603a", caretOn: lt < 1.5 });
});

// ================================================================== 17) quer mais rápido?
add(62.50, 65.20, "B17", (g, lt) => {
  bg(g, lt, { gx: 360, gy: 620, glowA: 0.10, gr: 560, dots: 0.045 });
  // o ref corta a seco: o gráfico JÁ está na tela no primeiro frame (CUT_IN) e as
  // barras ANIMAM (preview gravando — o ref 62,5-62,9 tem as barras mudando)
  previewChart(g, 68, 460, 584, 330, { t: lt, pulso: 1, vel: lt > 1.3 ? 2 : 1 });
  chatInput(g, 60, 865, 600, { texto: lt > 1.2 ? (lt > 1.45 ? "deixa mais rápido" : "deixa mais rápi") : lt > 0.7 ? "dei" : "" });
  if (lt > 1.45) raio(g, 590, 895, 15);
  const a1 = enter(lt, 0.3, 0.16), a3 = enter(lt, 1.25, 0.2);
  typeStep(g, [[0.3, "quer"], [0.55, "quer mais"]], lt,
    { size: 46, font: "AB", color: C.white, align: "center", x: 360, y: 290, tracking: -1.6, novo: C.white });
  // "rápido?" desliza DA ESQUERDA em alta velocidade (roxo, rastro de motion blur)
  const sl = M.outCubic(clamp((lt - 1.25) / 0.22, 0, 1));
  if (sl > 0.01) {
    for (const [gk, ga] of [[0.3, 0.3], [0.15, 0.5]]) {
      g.save(); g.globalAlpha = a3 * ga;
      textT(g, "rápido?", lerp(-420, 360, sl) - gk * 90, 356, { size: 54, font: "ISI", color: "#8b6cf6", align: "center" });
      g.restore();
    }
    g.save(); g.globalAlpha = a3;
    textT(g, "rápido?", lerp(-420, 360, sl), 356, { size: 54, font: "ISI", color: "#8b6cf6", align: "center" });
    g.restore();
  }
  if (lt > 1.85) cursor(g, 566, 925, { label: AGENTE, scale: 0.9 });
});

// ================================================================== 18) e se quiser que uma determinada palavra trema
add(65.20, 70.00, "B18", (g, lt) => {
  bg(g, lt, { gx: 360, gy: 640, glowA: 0.08, gr: 560 });
  kineticLine(g, [
    { t: 0.05, w: "e" }, { t: 1.0, w: "se quiser que" },
    { t: 1.5, w: "uma determinada" }, { t: 1.75, w: "palavra" },
    { t: 2.35, w: "aqui" },
  ], lt, { x: 360, y: 300, size: 30, font: "MXB", maxW: 380, align: "center", lineH: 1.3, riseY: 6, janela: 0.45 });
  // t=67–68 estava a 294%/207% do ref (entrada nervosa demais) — entrada calma.
  const a = enter(lt, 2.55, 0.18);
  if (a > 0.01) {
    g.save(); g.globalAlpha = a;
    selectionText(g, 128, 600, "trema", { size: 96, t: lt,
      sel: clamp((lt - 2.73) / 0.16, 0, 1),
      toolbar: lt > 3.05 && lt < 3.55,
      cursorFerramenta: lt > 3.2 && lt < 3.55,
      // o ref "desfaz" a palavra em 68,8–70,0 (pico de 7,5): as letras tremem
      shake: clamp((lt - 3.55) / 0.35, 0, 1) });
    g.restore();
  }
  // "ela vai tremer." embaixo — entra com a bagunça (ref 69,0) e treme junto
  const av = enter(lt, 3.78, 0.2);
  if (av > 0.01) {
    g.save(); g.globalAlpha *= av;
    if (lt > 3.55) {
      tremendoTexto(g, "ela vai", 265, 870, lt, { size: 40, font: "MB", color: "#9a989f", amp: 18, freq: 12 });
      tremendoTexto(g, "tremer.", 445, 882, lt, { size: 58, font: "ISI", color: "#8b6cf6", amp: 22, freq: 12 });
    } else {
      const w1 = measureT(g, "ela vai ", { size: 40, font: "MB" });
      const w2 = measureT(g, "tremer.", { size: 58, font: "ISI" });
      const x0 = 360 - (w1 + w2) / 2;
      textT(g, "ela vai ", x0, 870, { size: 40, font: "MB", color: "#9a989f" });
      textT(g, "tremer.", x0 + w1, 882, { size: 58, font: "ISI", color: "#8b6cf6" });
    }
    g.restore();
  }
});

// ================================================================== 19) ao que tudo indica... o editor de vídeo do futuro
add(70.00, 72.40, "B19", (g, lt) => {
  bg(g, lt, { glow: "#6a49ec", glowA: 0.16, gx: 360, gy: 700, gr: 620 });
  const someFrase = 1 - enter(lt, 0.55, 0.2);
  if (someFrase > 0.01) {
    g.save(); g.globalAlpha *= someFrase;
    typeStep(g, [[0.05, "ao que"], [0.34, "ao que tudo"], [0.5, "ao que tudo..."]], lt,
      { size: 46, font: "AB", color: "#9a989f", align: "center", x: 360, y: 250, tracking: -1.6, novo: C.white });
    g.restore();
  }
  typeStep(g, [[0.5, "o editor"], [1.0, "o editor de"], [1.9, "o editor de vídeo do"]], lt,
    { size: 46, font: "AB", color: C.white, align: "center", x: 360, y: 250, tracking: -1.6, novo: "#8b6cf6" });
  const eIn = enter(lt, 0.1, 0.3);
  if (eIn > 0.01) {
    g.save(); g.globalAlpha = eIn;
    editorNovo(g, 78, 430 + (1 - eIn) * 24, 564, 470, { marca: MARCA, comTimeline: true });
    g.restore();
  }
  // legenda roxa embaixo ("do futuro") — entra depois, sem colidir com o título
  const a4 = enter(lt, 2.1, 0.2);
  if (a4 > 0.01) {
    g.save(); g.globalAlpha = a4;
    textT(g, "do futuro", 360, 980, { size: 38, font: "ISI", color: "#b3a4f5", align: "center" });
    g.restore();
  }
});

// ================================================================== 20) não tem timeline
add(72.40, 74.30, "B20", (g, lt) => {
  bg(g, lt, { glow: "#6a49ec", glowA: 0.16, gx: 360, gy: 640, gr: 620, dots: 0.045 });
  editorNovo(g, 78, 300, 564, 470, { marca: MARCA, comTimeline: lt < 1.6 });
  // SELECT-ALL (brilho azul sobre a timeline) → DELETE → os blocos CAEM
  if (lt > 0.9 && lt < 1.3) {
    g.save(); g.globalAlpha = 0.4 * Math.sin(clamp((lt - 0.9) / 0.4, 0, 1) * Math.PI) + 0.18;
    rr(g, 108, 640, 524, 96, 8); g.fillStyle = "#3b6ff0"; g.fill();
    g.restore();
    textT(g, "selecionar tudo", 592, 752, { size: 17, font: "MSemi", color: "#9db8f0", align: "right" });
  }
  if (lt > 1.3) {
    // os blocos coloridos CAEM girando (fora do editor, para baixo)
    const uf = clamp((lt - 1.3) / 0.7, 0, 1);
    const cores = [ORANGE, "#4d7fe0", "#3ecf9a", "#b06fd8", "#d8b424"];
    cores.forEach((c, i) => {
      const u = clamp(uf - i * 0.09, 0, 1);
      if (u <= 0) return;
      const yy = lerp(688, 1250, u * u);
      g.save(); g.globalAlpha *= 1 - u * 0.55;
      g.translate(150 + i * 118 + i * 7, yy); g.rotate((1 - u) * 1.2 * (i % 2 ? 1 : -1));
      rr(g, -55, -14, 110, 28, 14); g.fillStyle = c; g.fill();
      g.restore();
    });
    if (lt < 1.75) textT(g, "⌫ delete", 592, 752, { size: 19, font: "MSemi", color: "#e6e6ee", align: "right" });
  }
  // headline em CASCATA (cada estágio sai quando o próximo entra — empilhados lêem bug)
  const a1 = enter(lt, 0.02, 0.14) * (1 - enter(lt, 0.42, 0.14));
  const a2 = enter(lt, 0.42, 0.14) * (1 - enter(lt, 0.6, 0.14));
  const a3 = enter(lt, 0.6, 0.14);
  g.save(); g.globalAlpha = a1;
  headline(g, 360, 250, [{ txt: "não", pill: "#6a49ec", esp: 26 }], { size: 58 });
  g.restore();
  if (a2 > 0.01) {
    g.save(); g.globalAlpha = a2;
    headline(g, 360, 250, [{ txt: "não", pill: "#6a49ec" }, { txt: "tem" }], { size: 58 });
    g.restore();
  }
  if (a3 > 0.01) {
    g.save(); g.globalAlpha = a3;
    headline(g, 360, 250, [{ txt: "não", pill: "#6a49ec" }, { txt: "tem" }, { txt: "timeline", rasurado: lt > 1.0 }], { size: 58 });
    g.restore();
  }
  if (lt > 1.6) {
    g.save();
    rr(g, 520, 700, 130, 46, 22); g.fillStyle = "#1c1b22"; g.fill();
    textT(g, "⌀ delete", 545, 730, { size: 19, font: "MSemi", color: "#e6e6ee" });
    g.restore();
  }
});

// ================================================================== 21) ele vai ter só uma boa conversa
add(74.30, 76.65, "B21", (g, lt) => {
  bg(g, lt, { glow: "#6a49ec", glowA: 0.18, gx: 360, gy: 620, gr: 620 });
  editorNovo(g, 78, 300, 564, 470, { marca: MARCA, comTimeline: false });
  const a1 = enter(lt, 0.02, 0.14);
  g.save(); g.globalAlpha = a1;
  textT(g, "ele", 92, 250, { size: 42, font: "MB", color: "#9a989f" });
  g.restore();
  // pílula do chat
  const a2 = enter(lt, 0.1, 0.24);
  if (a2 > 0.01) {
    g.save(); g.globalAlpha = a2;
    g.font = "600 26px MSemi";
    const txt = "cria um motion pra esse áudio";
    const w = g.measureText(txt).width + 96;
    rr(g, 650 - w, 790 + (1 - a2) * 14, w, 62, 31); g.fillStyle = "#7c5cf6"; g.fill();
    textT(g, txt, 650 - w + 30, 830, { size: 26, font: "MSemi", color: "#fff" });
    emojiFone(g, 650 - 44, 820, 18);
    g.restore();
  }
  const a3 = enter(lt, 1.0, 0.16), a4 = enter(lt, 1.9, 0.16);
  if (a3 > 0.01) {
    g.save(); g.globalAlpha *= a3;
    textT(g, "ele vai ter só uma boa", 360, 224, { size: 32, font: "MB", color: C.white, align: "center" });
    g.restore();
  }
  if (a4 > 0.01) {
    g.save(); g.globalAlpha *= a4;
    textT(g, "conversa.", 360, 290, { size: 48, font: "ISI", color: "#c9bff0", align: "center" });
    g.restore();
  }
  // painel "Pronto! Tá aqui"
  const a5 = enter(lt, 1.1, 0.24);
  if (a5 > 0.01) {
    g.save(); g.globalAlpha *= a5;
    rr(g, 92, 862 + (1 - a5) * 16, 300, 112, 16); g.fillStyle = "#20202a"; g.fill();
    textT(g, "Pronto! Tá aqui", 112, 894, { size: 20, font: "MSemi", color: "#e9e9ef" });
    confete(g, 268, 886, 10);
    mediaPill(g, 112 + 108, 918, { nome: "video.mp4", dur: "" });
    g.restore();
  }
});

// ================================================================== 22) quer saber mais? comenta NODO PRIME
add(76.65, 81.41, "B22", (g, lt) => {
  bg(g, lt, { glow: "#6a49ec", glowA: 0.2, gx: 360, gy: 700, gr: 640 });
  const a1 = enter(lt, 0.05, 0.2);
  g.save(); g.globalAlpha *= a1 * (1 - enter(lt, 0.45, 0.15));
  textT(g, "quer", 360, 420, { size: 34, font: "MB", color: "#9a989f", align: "center" });
  g.restore();
  const a2 = enter(lt, 0.5, 0.16);
  if (a2 > 0.01) {
    g.save(); g.globalAlpha = a2;
    textT(g, "quer saber mais?", 360, 420, { size: 34, font: "MB", color: "#9a989f", align: "center" });
    g.restore();
  }
  const a3 = enter(lt, 0.75, 0.18);
  if (a3 > 0.01) {
    g.save(); g.globalAlpha = a3;
    textT(g, "comenta", 360, 500, { size: 58, font: "AB", color: C.white, align: "center", tracking: -2 });
    g.restore();
  }
  const a4 = enter(lt, 1.35, 0.24);
  if (a4 > 0.01) {
    const s = easeOutBack(a4, 1.1);
    g.save();
    g.translate(360, 640); g.scale(lerp(0.92, 1, s), lerp(0.92, 1, s));
    textT(g, "NODO", 0, -34, { size: 118, font: "AB", color: "#8b6cf6", align: "center", tracking: -6 });
    textT(g, "PRIME", 0, 84, { size: 118, font: "AB", color: "#8b6cf6", align: "center", tracking: -6 });
    g.restore();
  }
  const pIn = enter(lt, 0.9, 0.3);
  if (pIn > 0.01) {
    const cp = commentsPanel(g, 58, 780 + (1 - pIn) * 20, 604, 330, {
      texto: lt > 3.0 ? "NODO PRIME" : "",
      coracao: lt > 3.4 ? 1 : 0,
    });
    if (lt > 1.7) cursor(g, 560, 930, { label: AGENTE, scale: 0.95 });
  }
  typeStep(g, [[3.1, "que eu te mostro"], [3.7, "que eu te mostro como fiz."]], lt,
    { size: 34, font: "ISI", color: "#d8d7d0", align: "center", x: 360, y: 1128, novo: "#e8a13c" });
});

// ================================================================== MOTOR: câmera viva + entrada + saída de beat
// Medido: o ref tem 2,74 de movimento/frame; a réplica tinha 0,51 (19%) e 71 s mortos.
// Cada bloco agora passa por: ENTRADA (deslize + ghosts, 0,18 s) → CÂMERA (keyframes
// de zoom/pan + handheld) → VIDA (do próprio bloco) → SAÍDA (derrete, 0,3 s).
// O grão entra por cima de tudo: é o piso de movimento que o ref tem em fundo chapado.
const RIG = {
  B1:  { keys: [{ t: 0, zoom: 1 }, { t: 2.67, zoom: 1.075 }], focus: [360, 560], drift: 8, entryAmp: 130 },
  // o "O" laranja (ref 5,3-5,9) é INSERT desenhado no bloco, não zoom de câmera —
  // punch de 2,6x aqui duplicava o efeito e destoava do ref
  B2:  { keys: [{ t: 0, zoom: 1.02 }, { t: 2.35, zoom: 1.03 }, { t: 2.72, zoom: 1.06 }, { t: 3.05, zoom: 1.02 }, { t: 7.36, zoom: 1.06 }], focus: [360, 620], entryAmp: 150 },
  B3:  { keys: [{ t: 0, zoom: 1.09 }, { t: 2.37, zoom: 1.0 }], focus: [360, 540], drift: 5, under: C.cream, grain: 0.05 },
  B4:  { keys: [{ t: 0, zoom: 1.0 }, { t: 2.55, zoom: 1.12 }], focus: [360, 600], entryAmp: 110 },
  // MOTION GRAPHICS: letras voando + zoom no final
  B5:  { keys: [{ t: 0, zoom: 1.16 }, { t: 0.42, zoom: 1.0 }, { t: 1.55, zoom: 1.02 }, { t: 1.95, zoom: 1.11 }, { t: 3.2, zoom: 1.0 }, { t: 5.6, zoom: 1.03 }, { t: 7.5, zoom: 1.06 }], focus: [360, 600], entryAmp: 170 },
  // modal → editor de curva → 99% (o burst do 99% é insert no bloco, lt 5,33;
  // câmera fica quieta — punch de 1,3 aqui disputava com o burst)
  B6:  { keys: [{ t: 0, zoom: 1.04 }, { t: 1.4, zoom: 1.0 }, { t: 2.15, zoom: 1.0 }, { t: 2.95, zoom: 1.04 }, { t: 3.62, zoom: 1.02 }, { t: 3.8, zoom: 1.0 }, { t: 7.4, zoom: 1.05 }], focus: [360, 600], entryAmp: 140 },
  B7:  { keys: [{ t: 0, zoom: 1.0 }, { t: 4.2, zoom: 1.08 }], focus: [360, 600], entryAmp: 140 },
  // parede de cards chegando torta → html5 (o voo/encolhe é desenhado no bloco)
  B8:  { keys: [{ t: 0, zoom: 1.0 }, { t: 1.2, zoom: 1.04 }, { t: 3.0, zoom: 1.0 }, { t: 4.4, zoom: 1.02 }, { t: 5.0, zoom: 1.0 }], focus: [360, 600], entryAmp: 200 },
  B9:  { keys: [{ t: 0, zoom: 1.0 }, { t: 0.45, zoom: 1.03 }, { t: 1.0, zoom: 1.16 }, { t: 1.35, zoom: 1.02 }, { t: 3.4, zoom: 1.0 }, { t: 4.2, zoom: 1.05 }, { t: 5.9, zoom: 1.08 }], focus: [360, 620], entryAmp: 150 },
  B10: { keys: [{ t: 0, zoom: 1.0 }, { t: 2.5, zoom: 1.14 }, { t: 3.75, zoom: 1.05 }], focus: [360, 600], entryAmp: 130 },
  B11: { keys: [{ t: 0, zoom: 1.06 }, { t: 2.0, zoom: 1.0 }], focus: [360, 620], entryAmp: 150 },
  B12: { keys: [{ t: 0, zoom: 1.0 }, { t: 4.2, zoom: 1.06 }, { t: 4.95, zoom: 1.08 }, { t: 5.25, zoom: 1.1 }], focus: [360, 480], entryAmp: 120 },
  // card gigante de "O texto…" tomando a tela (pico de 23,8 de movimento no ref)
  // (B13 recomeça em 49,2 para caber a fuga do telefone; ver add(49.20…))
  B13: { keys: [{ t: 0, zoom: 1.0 }, { t: 1.72, zoom: 1.06 }, { t: 2.6, zoom: 1.02 }, { t: 4.1, zoom: 1.08 }], focus: [360, 560], entryAmp: 220 },
  B14: { keys: [{ t: 0, zoom: 1.0 }, { t: 2.5, zoom: 1.02 }], focus: [360, 600], entryAmp: 140 },
  // entrada CALMA (o ref t=55=0,84: o "o melhor de tudo" entra suave — entryAmp 160
  // caía inteiro na janela t=55 e estourava 573%)
  B15: { keys: [{ t: 0, zoom: 1.0 }, { t: 1.2, zoom: 1.1 }, { t: 2.2, zoom: 1.0 }, { t: 4.23, zoom: 1.07 }], focus: [360, 700], entryAmp: 50 },
  // clique → morf de cor → gráfico (pico de 6,4 no ref)
  B16: { keys: [{ t: 0, zoom: 1.03 }, { t: 1.1, zoom: 1.06 }, { t: 1.5, zoom: 1.0 }, { t: 2.47, zoom: 1.0 }], focus: [360, 620], entryAmp: 150 },
  B17: { keys: [{ t: 0, zoom: 1.06 }, { t: 2.7, zoom: 1.0 }], focus: [360, 600], entryAmp: 150 },
  // o snap de 1,9x em lt 3,0 estourava t=68 (294% do ref) — o shake do trema
  // assume o pico de 69; a câmera fica quieta.
  B18: { keys: [{ t: 0, zoom: 1.0 }, { t: 2.2, zoom: 1.1 }, { t: 3.0, zoom: 1.04 }, { t: 4.8, zoom: 1.06 }], focus: [360, 620], entryAmp: 180 },
  B19: { keys: [{ t: 0, zoom: 1.09 }, { t: 2.4, zoom: 1.0 }], focus: [360, 640], entryAmp: 180 },
  B20: { keys: [{ t: 0, zoom: 1.0 }, { t: 1.9, zoom: 1.15 }], focus: [360, 620], entryAmp: 160 },
  B21: { keys: [{ t: 0, zoom: 1.06 }, { t: 2.35, zoom: 1.0 }], focus: [360, 640], entryAmp: 60 },
  B22: { keys: [{ t: 0, zoom: 1.0 }, { t: 1.5, zoom: 1.11 }, { t: 2.6, zoom: 0.98 }, { t: 4.76, zoom: 1.07 }], focus: [360, 660], entryAmp: 130 },
};
const NO_MELT = new Set(["B22", "B3", "B8", "B13", "B14", "B19", "B20", "B2"]);
// B3: o ref mantém o creme INTACTO até ~12,4 e corta SECO (1 frame de troca total
// = 230/30 ≈ 7,7 — é daí que vem o pico de 8,4). Derreter cedo estourava o desvio
// de conteúdo (212 nos frames 12,1–12,4) e t=11. B8/B14/B19/B20: cortes calmos no
// ref (B14→B15 vira fundo escuro com brilho, sem derretimento triplicando o texto).
// "Hard cut é o default; dissolve só quando motivado" (beat-sync-editing nas fontes).
const MELT_DUR = 0.16;
// blocos que entram a seco no ref (a cena seguinte já está lá no primeiro frame)
const CUT_IN = new Set(["B17", "B21"]);

// ---------------------------------------------------------------- retiming
// Beats que precisavam de mais tela: cada bloco esticado empurra todos os
// seguintes (a duração de cada bloco é lida depois disto).
const ESTICA = [
  { bloco: "B2", extra: 3.70 },   // 4 arquivos, clique no CapCut e arrasto até a lixeira
  { bloco: "B5", extra: 2.40 },   // órbita + timeline andando com o mouse no playhead
  { bloco: "B6", extra: 1.10 },   // keyframe puxado para cima, elástico, tracejado original
  { bloco: "B7", extra: 1.00 },   // chaves sanfona apertando o texto
  { bloco: "B8", extra: 1.20 },   // grade 3x3 andando e caindo ao centro
  { bloco: "B9", extra: 1.80 },   // <html> voando e pousando no card de código
];
for (const { bloco, extra } of ESTICA) {
  const b = B.find((x) => x.nome === bloco);
  if (!b) continue;
  const fimAntigo = b.t1;
  for (const o of B) if (o !== b && o.t0 >= fimAntigo) { o.t0 += extra; o.t1 += extra; }
  b.t1 = fimAntigo + extra;
}
DUR = B[B.length - 1].t1;

for (const b of B) {
  const raw = b.draw;
  const dur = b.t1 - b.t0;
  const rig = RIG[b.nome] || {};
  const tGlobal = b.t0;
  b.draw = (g, lt) => {
    camShot(g, lt, dur, rig, (gg) => {
      // cena com deslocamento vertical de entrada (pancada do corte)
      const cena = (x, off, al) => {
        if (al <= 0.001) return;
        x.save(); x.globalAlpha *= al; x.translate(0, off); raw(x, lt); x.restore();
      };
      // wipe da BOLA (ref: uma bola escura nasce no ponto final de "escrito." e vai
      // tomando a tela até a próxima cena) — aceleração inCubic
      if (b.nome === "B3" && lt > dur - 0.5) {
        raw(gg, lt);
        const u = clamp((lt - (dur - 0.45)) / 0.45, 0, 1);
        circle(gg, 636, 742, 24 + 1500 * u * u);
        gg.fillStyle = "#0b0b0e"; gg.fill();
        return;
      }
      const uMelt = NO_MELT.has(b.nome) ? 0 : clamp((lt - (dur - MELT_DUR)) / MELT_DUR, 0, 1);
      if (uMelt > 0.001) {
        // saída: ghosts que sobem + cópia principal espremendo e caindo
        for (let i = 4; i >= 1; i--) {
          const f = i / 4;
          cena(gg, -f * (18 + 66 * uMelt), uMelt * (1 - f) * 0.5);
        }
        gg.save();
        gg.globalAlpha *= 1 - 0.5 * uMelt;
        gg.translate(360, 640);
        gg.scale(1 + 0.05 * uMelt, 1 - 0.22 * uMelt);
        gg.translate(-360 + uMelt * 26, -640 - uMelt * 52);
        raw(gg, lt);
        gg.restore();
        gg.save();
        gg.globalAlpha *= 0.45 * uMelt;
        gg.fillStyle = "#050506";
        gg.fillRect(-80, -80, REF_W + 160, REF_H + 160);
        gg.restore();
        return;
      }
      const uIn = CUT_IN.has(b.nome) ? 1 : clamp(lt / 0.18, 0, 1);
      if (uIn < 0.999) {
        const off = (1 - M.outCubic(uIn)) * (rig.entryAmp ?? 140) * (b.nome.charCodeAt(1) % 2 ? -1 : 1);
        for (let i = 3; i >= 1; i--) cena(gg, off * (1 + i * 0.55), 0.18 * (1 - i / 4.2));
        cena(gg, off, 1);
        return;
      }
      raw(gg, lt);
    });
    // piso de movimento: grão (o ref tem ~0,3 de diff/frame em fundo chapado)
    grain(g, tGlobal + lt, { alpha: rig.grain ?? 0.13, seed: b.nome.charCodeAt(2) || 1 });
  };
}

export const BLOCOS = B;
export function blocoEm(t) {
  return B.find((b) => t >= b.t0 && t < b.t1) || B[B.length - 1];
}
