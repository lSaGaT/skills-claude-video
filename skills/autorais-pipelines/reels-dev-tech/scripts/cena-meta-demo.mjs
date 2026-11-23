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
  popIn, typing, draftText, rgbSplitText, cursorArc, ripple, strikeIn, iris, counterKf, hash01, EASE, noShadow,
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
      // card do CAPCUT sendo carregado (o usuário: pegar o CARD, não um ícone
      // de caveira) — miniatura fiel do card do Finder: navy, selo EXE, nome
      g.save();
      g.translate(px, py); g.rotate(-0.06 + 0.12 * d);
      shadow(g, "rgba(0,0,0,.5)", 16, 0, 5);
      rr(g, -74, -46, 148, 92, 10); g.fillStyle = "#1b2a52"; g.fill();
      noShadow(g);
      rr(g, -74, -46, 148, 92, 10); g.strokeStyle = C.blueDeep; g.lineWidth = 2; g.stroke();
      // selo EXE + nome do arquivo (2 linhas, como no Finder)
      rr(g, -64, -14, 30, 17, 4); g.fillStyle = "#e0552a"; g.fill();
      textT(g, "EXE", -49, -1.5, { size: 10, font: "MB", color: "#fff", align: "center" });
      textT(g, "CapCut_PRO", -26, -12, { size: 14, font: "MSemi", color: C.white });
      textT(g, "crackeado (2).exe", -26, 8, { size: 14, font: "MSemi", color: "#b9c2e8" });
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
  // batida 3 (ref 17,0-20,67 + estica): card de timeline GRANDE com ENTRADA 3D —
  // nasce DE LADO numa diagonal perpendicular e se assenta na forma correta
  // (sem pressa); depois o RISCO LARANJA vem devagar, parando keyframe a
  // keyframe: cada ponto passado fica BRANCO e o mouse CLICA (pedidos do usuário)
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
  // ENTRADA 3D: card nasce rotacionado ~52° (deitado na diagonal), com
  // cisalhamento perpendicular e menor, vindo da direita; assenta em 1,25 s
  // com suavização longa — "coisa natural", sem pancada
  const e3d = M.smooth(clamp(t / 1.25, 0, 1));
  const rot3 = lerp(-0.92, -0.025, e3d);
  const sh3 = lerp(0.46, 0.05, e3d);
  const sc3 = lerp(0.8, 1, e3d);
  const dx3 = lerp(215, 0, e3d);
  const varre0 = 1.55, moveT = 0.30, dwellT = 0.24;   // parada em cada keyframe
  if (e3d > 0.005) {
    g.save(); g.globalAlpha = clamp(e3d * 2.4, 0, 1);
    g.translate(360 + dx3, 655); g.rotate(rot3); g.transform(1, 0, -sh3, 1, 0, 0);
    g.scale(sc3, sc3); g.translate(-360, -655);
    timelineAntiga(g, 48, 405, 624, 500, {
      rot: 0,
      profundidade: 0,
      segmentado: { t, varre0, moveT, dwellT },
      pegador: t > varre0 - 0.1 ? { alpha: enter(t, varre0 - 0.1, 0.18) } : null,
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
  // ENTRADA GRANDE E CALMA (pedidos do usuário): a grade nasce maior que a
  // tela — estourando embaixo e nas laterais — os cards aparecem um a um SEM
  // pressa, e o conjunto desce devagar até o centro, onde fica quase estourando
  // as laterais (margem fina). Sem corridas, sem elástico.
  const sobe = M.smooth(clamp((lt - 2.3) / 1.5, 0, 1));   // vai pro centro
  const k = lerp(1.72, 1.30, sobe);                       // cards GRANDES
  const dy = lerp(160, 0, sobe);                          // nasce estourando embaixo
  gridCards(g, {
    t: lt, dx: 0, dy, sc: 1, k,
    rot: lerp(-0.10, -0.055, M.smooth(clamp(lt / 1.9, 0, 1))),
    shear: lerp(0.24, 0.14, M.smooth(clamp(lt / 1.9, 0, 1))),
    marca: MARCA, mote: MOTE, stagger: 0.14,
  });
  if (lt < 2.2) cursor(g, 600, 1090, { label: AGENTE, alpha: enter(lt, 0.2, 0.3) });
  // "são feitas" digitando por cima, quando a grade já assentou no centro
  if (lt >= 4.1) {
    const t = lt - 4.1;
    typeStep(g, [[0.02, "são feitas"], [0.34, "são feitas em"]], t,
      { size: 56, font: "AB", color: C.white, align: "center", x: 360, y: 128, tracking: -2, novo: "#8a8890" });
  }
});

// ================================================================== 9) como quem de fato escreve um site
add(34.20, 38.40, "B9", (g, lt) => {
  bg(g, lt, { gx: 360, gy: 640, glowA: 0.09, gr: 560 });
  // === beat 1: "são feitas em" → "<html>" DIGITADO como código (pedido do
  // usuário) → voa para o card de código → linha 1 digita → o RESTO COLA de
  // uma vez (efeito copia e cola, com seleção azul) → card sai voando.
  if (lt < 3.7) {
    const WX = 56, WY = 470, WW = 608, WH = 430;
    // a grade 3x3 do B8 ainda está ali e vai SUMINDO encolhendo pra cima —
    // o corte entre os blocos não pode aparecer
    if (lt < 0.5) {
      const gf = clamp(lt / 0.45, 0, 1);
      g.save(); g.globalAlpha *= 1 - gf;
      gridCards(g, { t: 9, sc: lerp(1, 0.6, gf), dy: lerp(0, -170, gf), k: 1.30, rot: -0.055, shear: 0.14, marca: MARCA, mote: MOTE });
      g.restore();
    }
    const wIn = enter(lt, 1.12, 0.3);
    // texto de cima (veio do B8, mesmas coordenadas: sem corte visível)
    textT(g, "são feitas em", 360, 128, { size: 56, font: "AB", color: C.white, align: "center", tracking: -2 });

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
      const T_TIPO1 = 1.62, T_COLA = 2.18;   // linha 1 digita; resto COLA junto
      for (let i = 0; i < linhas.length; i++) {
        const ly = WY + 92 + i * 46;
        textT(g, String(i + 1), WX + 30, ly, { size: 20, font: "Mono", color: "#6d6d76" });
        if (i === 0) {
          // linha 1: digita letra a letra (começa no pouso do <html>)
          typing(g, linhas[0][0], WX + 64, ly, { size: 20, font: "Mono", color: linhas[0][1], t: lt, t0: T_TIPO1, ms: 55, solid: 0.1, caret: true, caretCor: ORANGE });
        } else if (lt >= T_COLA) {
          // linhas 2-5: COLADAS de uma vez — nascem com seleção azul que apaga
          const uCola = clamp((lt - T_COLA) / 0.34, 0, 1);
          textT(g, linhas[i][0], WX + 64, ly, { size: 20, font: "Mono", color: linhas[i][1] });
          if (uCola < 1) {
            g.save(); g.globalAlpha = (1 - uCola) * 0.55;
            const wl = measureT(g, linhas[i][0], { size: 20, font: "Mono" });
            rr(g, WX + 60, ly - 18, wl + 8, 26, 3); g.fillStyle = "#3b6ff0"; g.fill();
            g.restore();
          }
        }
      }
      // caret colado: piscando no fim da última linha colada
      if (lt >= T_COLA && Math.floor(lt * 3.2) % 2 === 0) {
        const ui = linhas.length - 1, txt = linhas[ui][0];
        const wx2 = WX + 64 + measureT(g, txt, { size: 20, font: "Mono" });
        g.fillStyle = ORANGE; g.fillRect(wx2 + 2, WY + 92 + ui * 46 - 19, 11, 26);
        // chip "⌘V" colado no caret nos primeiros instantes da colagem
        const uV = clamp((lt - T_COLA) / 0.55, 0, 1);
        if (uV < 1) {
          g.save(); g.globalAlpha = (1 - uV);
          rr(g, wx2 + 20, WY + 92 + ui * 46 - 24, 78, 30, 7); g.fillStyle = "#2a2a32"; g.fill();
          g.strokeStyle = "rgba(255,255,255,.16)"; g.lineWidth = 1.4; g.stroke();
          textT(g, "Ctrl+V", wx2 + 59, WY + 92 + ui * 46 - 3, { size: 15, font: "MSemi", color: "#e8e8ee", align: "center" });
          g.restore();
        }
      }
      g.restore();
    }
    // pílula de status: "Linha 01" digitando → "colado ⌘V" depois da colagem
    if (lt > 1.6) {
      const lb = enter(lt, 1.6, 0.22) * (1 - sair);
      const lbl = lt < 2.18 ? "Linha 01" : "colado!";
      g.save(); g.globalAlpha = lb;
      g.font = "700 22px MB";
      const bw2 = g.measureText(lbl).width + 44;
      rr(g, 360 - bw2 / 2, WY + WH + 24, bw2, 44, 22); g.fillStyle = ORANGE; g.fill();
      textT(g, lbl, 360, WY + WH + 54, { size: 22, font: "MB", color: "#fff", align: "center" });
      g.restore();
    }
    // "<html>" grande DIGITADO (não pop): < e > azuis, html laranja, caret
    // — só depois de completo ele VOa para a linha 1 do card
    const CHS = [["<", "#4d7fe0"], ["h", "#e8603a"], ["t", "#e8603a"], ["m", "#e8603a"], ["l", "#e8603a"], [">", "#4d7fe0"]];
    const T_DIG = 0.10, MS_DIG = 135;
    const nH = lt < T_DIG ? 0 : clamp(Math.floor((lt - T_DIG) / (MS_DIG / 1000)) + 1, 0, CHS.length);
    const voo = clamp((lt - 1.02) / 0.5, 0, 1);
    const eVoo = voo * voo * voo;                     // acelera ao cair
    const hx = lerp(360, WX + 108, eVoo), hy = lerp(700, WY + 86, eVoo);
    const hs = lerp(1, 0.14, eVoo);
    if (nH > 0 && lt < 1.49) {
      g.save();
      g.globalAlpha = 1 - clamp((voo - 0.75) / 0.25, 0, 1) * 0.85;
      g.translate(hx, hy); g.scale(hs, hs);
      // rastro do voo (fantasmas)
      if (voo > 0.04 && voo < 0.99) {
        for (const [ox, al] of [[0.16, 0.3], [0.32, 0.15]]) {
          g.save(); g.globalAlpha *= al; g.translate(-ox * 260, ox * 120);
          desenhaHtml(g, CHS.length, 0, 0, 150, CHS);
          g.restore();
        }
      }
      desenhaHtml(g, nH, 0, 0, 150, CHS, lt >= T_DIG && nH < CHS.length && Math.floor(lt * 3) % 2 === 0);
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
  // === beat 2: "como quem de fato escreve um site" + navegador com a SEQUÊNCIA
  // pedida pelo usuário: conteúdo entra → mouse FECHA a janela → REABRE →
  // device mode do Chrome: a página se re-rende quando a largura muda.
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
  // coreografia da janela: fecha em 1,25 (0,16 s) · reabre em 1,75 (0,24 s)
  const FECHA = 1.25, ABRE = 1.75;
  const uFecha = t >= FECHA ? clamp((t - FECHA) / 0.16, 0, 1) : 0;
  const uAbre = t >= ABRE ? clamp((t - ABRE) / 0.24, 0, 1) : 0;
  const fechada = uFecha >= 1 && uAbre <= 0;
  // device mode: 3 larguras com badge atualizando (o ref: "automatically re-rendering")
  const T_DM = 2.3;
  const dm = t >= T_DM ? clamp((t - T_DM) / 1.2, 0, 1) : 0;
  const wDM = dm <= 0 ? 508
    : dm < 0.38 ? lerp(508, 400, M.smooth(dm / 0.38))
    : dm < 0.66 ? lerp(400, 470, M.smooth((dm - 0.38) / 0.28))
    : lerp(470, 508, M.smooth((dm - 0.66) / 0.34));
  const badgeDM = dm <= 0 ? "755 × 860"
    : dm < 0.38 ? "430 × 860" : dm < 0.66 ? "768 × 860" : "755 × 860";
  // uma varrida de repaint por mudança de largura (device mode redesenha a página)
  const repaint = dm <= 0 ? 0 : dm < 0.38 ? dm / 0.38 : dm < 0.66 ? (dm - 0.38) / 0.28 : (dm - 0.66) / 0.34;
  if (!fechada) {
    // abre/fecha: fechando encolhe até 6%; reabrindo nasce do zero com pop e
    // VOLTA para 1 (antes a escala de fechar ficava presa e a janela não voltava)
    let escJ = 1, alJ = 1;
    if (uFecha > 0 && uAbre <= 0) { escJ = 1 - uFecha * 0.94; alJ = 1 - uFecha; }
    else if (uAbre > 0) { escJ = lerp(0.06, 1, easeOutBack(uAbre, 1.4)); alJ = clamp(uAbre * 1.6, 0, 1); }
    const W0 = 508, H = 580, Y = 400;
    // depois de reaberta, a largura ANIMA até o tamanho do device mode
    const wWin = uAbre > 0 ? lerp(W0, wDM, M.smooth(clamp((t - ABRE) / 0.5, 0, 1))) : W0;
    const xWin = 360 - wWin / 2;
    const xFec = 360 - W0 / 2;
    g.save(); g.globalAlpha = enter(t, 0.02, 0.28) * alJ;
    g.translate(360, Y + H / 2); g.scale(escJ, escJ); g.translate(-360, -(Y + H / 2));
    browserWindow(g, xWin, Y, wWin, H, {
      url: "motion.html", focus: "#2a2a30",
      badge: t > 0.5 ? badgeDM : null,
      caret: t > 0.45, // site BRANCO e vazio primeiro; conteúdo logo depois
      repaint: uAbre >= 1 ? repaint : 0,
    });
    g.restore();
    // clique no botão vermelho (fechar) com anel
    if (uFecha > 0 && uFecha < 1) {
      g.save(); g.globalAlpha = 1 - uFecha;
      circle(g, xFec + 16, Y + 20, 10 + 26 * easeOut(uFecha));
      g.strokeStyle = "#f26462"; g.lineWidth = 2.6; g.stroke();
      g.restore();
    }
  }
  // mouse: vai até o vermelho e fecha; depois volta e acompanha o device mode
  const cx0 = lerp(560, 134, seg(t, 0.62, 1.18));
  const cy0 = lerp(980, 424, seg(t, 0.62, 1.18));
  if (t > 0.55 && t < FECHA + 0.14) {
    cursor(g, cx0, cy0, { label: t < FECHA ? AGENTE : null, alpha: clamp((FECHA + 0.14 - t) / 0.14, 0, 1) * clamp((t - 0.55) / 0.15, 0, 1) });
  } else if (uAbre > 0.6 && t < T_DM) {
    cursor(g, lerp(430, 620, seg(t, ABRE, T_DM)), lerp(430, 1004, seg(t, ABRE, T_DM)), { label: null });
  } else if (t >= T_DM) {
    cursor(g, 620, 1004, { label: null });
  }
});

// "<html>" grande desenhado como CÓDIGO SENDO ESCRITO: < e > azuis, html
// laranja, caractere a caractere, com caret piscando enquanto digita
function desenhaHtml(g, nVis, x, y, size, CHS, caret = false) {
  g.font = `${size}px AB`;
  const widths = CHS.map(([c]) => g.measureText(c).width);
  const total = widths.reduce((a, b) => a + b, 0) - size * 0.25;
  let cx = x - total / 2;
  for (let i = 0; i < nVis; i++) {
    const [c, cor] = CHS[i];
    textT(g, c, cx, y, { size, font: "AB", color: cor, tracking: -size * 0.025 });
    cx += widths[i] - size * 0.025;
  }
  if (caret) {
    // caret acompanha o último caractere digitado
    const wx = x - total / 2 + widths.slice(0, nVis).reduce((a, b) => a + b - size * 0.025, 0) + 10;
    g.fillStyle = ORANGE; g.fillRect(wx, y - size * 0.72, size * 0.07, size * 0.86);
  }
}

// ================================================================== 10) frame por frame
// ROLO DE FOTO VAZIO (pedido do usuário, olhando o ref): a parte de baixo começa
// VAZIA; os prints do card CAEM um a um e FIXAM nos slots do rolo; quando o rolo
// está cheio, TODAS elas voltam para cima remontando a mini cena.
// ================================================================== 10) frame por frame
// Frame a frame com o ref (38,4-42,0): banda de rolo VAZIA e LIMPA no rodapé
// (sem slots delineados); prints são MINICARDS SEM BORDA BRANCA que caem com
// rastro e FIXAM como células ao longo da banda; o PONTO do card PULA de
// posição (o card "reproduz" quadro a quadro); no fim TODAS as prints voltam
// para o card — a banda só apaga (não sobe).
// ================================================================== 10) frame por frame
// REFEITO QUADRO A QUADRO sobre o ref (39,0-42,0, 90 frames lidos 1 a 1):
// 1) card no centro com brackets, contador e o PONTO animando (sobe/desce em ciclo);
// 2) headline em PALAVRAS que nascem CINZA e viram brancas (frame → por → frame);
// 3) banda pontilhada materializa VAZIA;
// 4) as prints são FEITAS UMA DE CADA VEZ: uma cópia DESLIZA PARA FORA por trás
//    do card, à direita (cinza revelando conteúdo), desprende, CAI girando com
//    rastro e pousa na banda à esquerda, deslizando devagar; pilha cresce no canto;
// 5) contador SCRUBBA (salta: 0001→0038→0031→0002→0126→1329→2333→2562…), não conta;
// 6) NO FIM: "e depois" (cinza→branco) e o CARD SE DISSOLVE deixando na banda uma
//    FILEIRA DE QUADROS EM PÉ — NÃO existe volta das prints para o card.
add(38.40, 41.95, "B10", (g, lt) => {
  bg(g, lt, { gx: 360, gy: 560, glowA: 0.10, gr: 560, dots: 0.045 });
  // ---- escalas do ref (3,55 s) para o nosso 4,75 s
  const kT = 1.34;
  const tHead1 = 0.43 * kT;        // "frame"
  const tBanda = 0.27 * kT;        // banda materializa
  const tHead2 = 1.67 * kT;        // "por"
  const tHead3 = 2.07 * kT;        // "frame" (final)
  const tDepois = 2.80 * kT;       // "e depois"
  const T_FIM = 4.02;              // card começa a se dissolver (ref 41,4)

  // ---- card: ponto animando (sobe rápido, segura no alto, desce) — ciclo ~1,5 s
  const cIn = enter(lt, 0.05, 0.26);
  const someFim = 1 - clamp((lt - T_FIM) / 0.35, 0, 1);   // dissolve no fim
  const yDotF = 0.26 + 0.29 * (0.5 + 0.5 * Math.sin((lt / 1.5) * Math.PI * 2 - Math.PI / 2));
  phoneCard(g, 235, 320, 250, 400, { marca: MARCA, mote: MOTE, glow: true, alpha: cIn * someFim, r: 26, dot: false });
  if (cIn > 0.3 && someFim > 0.01) {
    g.save(); g.globalAlpha *= cIn * someFim;
    circle(g, 235 + 250 * 0.62, 320 + 400 * yDotF, 26);
    g.fillStyle = C.orange2; g.fill();
    g.restore();
  }
  const brIn = enter(lt, 0.02, 0.2) * someFim;
  if (brIn > 0.01) brackets(g, 213, 295, 294, 450, { a: brIn });
  const miniIn = enter(lt, 0.25, 0.24) * someFim;
  if (miniIn > 0.01) phoneCard(g, 78, 800, 100, 158, { marca: MARCA, mote: null, glow: true, alpha: miniIn, r: 12 });

  // ---- contador SCRUBBA (sequência medida no ref, determinística)
  const SCRUB = [1, 6, 8, 30, 38, 38, 31, 31, 31, 31, 2, 1, 29, 126, 145, 193, 365, 363, 538, 832, 852, 958, 1329, 1652, 2333, 2562, 2562, 2, 2562];
  const chipIn = enter(lt, 0.73 * kT, 0.2) * someFim;
  if (chipIn > 0.01) {
    const idxS = clamp(Math.floor((lt - 0.73 * kT) * 7), 0, SCRUB.length - 1);
    const f = SCRUB[idxS];
    g.save(); g.globalAlpha = chipIn;
    g.font = "500 19px Mono";
    const lbl = `frame  ${String(f).padStart(4, "0")}  /  2562`;
    const w = g.measureText(lbl).width + 62;
    rr(g, 360 - w / 2, 855, w, 40, 20); g.fillStyle = "#1b1b20"; g.fill();
    circle(g, 360 - w / 2 + 22, 875, 6); g.fillStyle = "#e5484d"; g.fill();
    textT(g, lbl, 360 - w / 2 + 38, 882, { size: 19, font: "Mono", color: "#dcdce2" });
    g.restore();
  }

  // ---- headline em palavras cinza→branco (o ref materializa cada palavra em cinza)
  const palavra = (txt, x0, y0, size, t0w) => {
    const a = enter(lt, t0w, 0.2);
    if (a <= 0.01) return;
    const cinza = clamp((lt - t0w) / 0.28, 0, 1);
    const cor = cinza >= 1 ? C.white : `rgb(${Math.round(106 + (246 - 106) * cinza)},${Math.round(106 + (247 - 106) * cinza)},${Math.round(112 + (242 - 112) * cinza)})`;
    textT(g, txt, x0, y0, { size, font: "AB", color: cor, tracking: -2 });
  };
  if (lt > tDepois) {
    // "e depois" SUBSTITUI o headline (o ref troca a frase antes do corte)
    palavra("e depois", 75, 250, 62, tDepois);
  } else if (lt > tHead1 - 0.4) {
    palavra("frame", 75, 250, 62, tHead1);
    if (lt > tHead2 - 0.25) {
      const w1 = measureT(g, "frame ", { size: 62, font: "AB", tracking: -2 });
      palavra("por", 75 + w1, 250, 62, tHead2);
    }
    if (lt > tHead3 - 0.25) {
      const w1 = measureT(g, "frame ", { size: 62, font: "AB", tracking: -2 });
      const w2 = measureT(g, "por ", { size: 62, font: "AB", tracking: -2 });
      palavra("frame", 75 + w1 + w2, 250, 62, tHead3);
    }
  }

  // ---- BANDA: materializa VAZIA (pontilhado) — sem slots delineados
  const ROLO_Y = 1010, ROLO_H = 190, N_IMP = 3;
  const bandaIn = enter(lt, tBanda, 0.3);
  if (bandaIn > 0.01) {
    g.save(); g.globalAlpha = bandaIn;
    g.fillStyle = "rgba(255,255,255,.03)"; g.fillRect(0, ROLO_Y, REF_W, ROLO_H);
    g.save();
    g.strokeStyle = "rgba(255,255,255,.22)"; g.lineWidth = 3; g.setLineDash([7, 7]);
    for (const yy of [ROLO_Y + 6, ROLO_Y + ROLO_H - 6]) { g.beginPath(); g.moveTo(0, yy); g.lineTo(REF_W, yy); g.stroke(); }
    g.restore();
    g.restore();
  }

  // ---- CICLO DE PRINT (uma de cada vez): cópia desliza PARA FORA pela direita
  // (cinza revelando), desprende, cai girando com rastro, pousa à esquerda e
  // desliza devagar; 3 ciclos no bloco
  const CYC = N_IMP, CICLO = 1.15, T1 = 1.45;   // início do 1º ciclo
  for (let c = 0; c < CYC; c++) {
    const t0c = T1 + c * CICLO;
    if (lt < t0c) continue;
    const uSai = clamp((lt - t0c) / 0.35, 0, 1);        // desliza para fora (direita)
    const uCai = clamp((lt - t0c - 0.35) / 0.40, 0, 1); // desprende e cai
    const pousou = uCai >= 1;
    const landT = t0c + 0.75;
    // 1) cópia deslizando para fora por trás (à direita do card), em tamanho cheio
    if (uSai > 0 && uCai <= 0) {
      const dx = lerp(0, 92, M.smooth(uSai));
      g.save(); g.globalAlpha *= 0.9;
      g.translate(235 + dx, 320);
      // a cópia nasce CINZA e revela conteúdo
      const gray = clamp(uSai * 1.6, 0, 1);
      rr(g, 0, 0, 250, 400, 26); g.fillStyle = ("rgb(" + [138,138,146].map((v,i)=>Math.round(v+(25-v)*gray)).join(",") + ")"); g.fill();
      g.strokeStyle = "rgba(255,255,255,.14)"; g.lineWidth = 2; g.stroke();
      const yd = 0.26 + 0.29 * (0.5 + 0.5 * Math.sin(((lt - t0c) / 1.5) * Math.PI * 2));
      circle(g, 250 * 0.62, 400 * yd, 26); g.fillStyle = C.orange2; g.fill();
      textT(g, "MOTION", 250 * 0.16, 400 * 0.70, { size: Math.round(250 * 0.155), font: "AB", color: C.white, tracking: -2 });
      g.restore();
    }
    // 2) desprendendo e caindo (gira, encolhe, rastro branco = texto borrado)
    if (uCai > 0 && !pousou) {
      const e = uCai * uCai;
      const px = lerp(235 + 92, 60, e), py = lerp(320 + 120, ROLO_Y + 55, e);
      const rot = lerp(0.06, 0.30, e), sc = lerp(1, 0.42, e);
      for (const [gf, ga] of [[0.28, 0.26]]) {
        const ug = clamp(uCai - gf * 0.4, 0, 1);
        if (ug <= 0) continue;
        const eg = ug * ug;
        g.save(); g.globalAlpha *= ga;
        g.translate(lerp(327, 60, eg), lerp(440, ROLO_Y + 55, eg * eg));
        g.rotate(lerp(0.06, 0.30, eg)); g.scale(lerp(1, 0.42, eg), lerp(1, 0.42, eg));
        phoneCard(g, -125, -200, 250, 400, { marca: MARCA, mote: null, glow: false, alpha: 1, r: 26, dot: false });
        circle(g, 0, -60, 26); g.fillStyle = C.orange2; g.fill();
        g.restore();
      }
      g.save();
      g.translate(px, py); g.rotate(rot); g.scale(sc, sc);
      phoneCard(g, -125, -200, 250, 400, { marca: MARCA, mote: null, glow: false, alpha: 1, r: 26, dot: false });
      circle(g, 0, -60, 26); g.fillStyle = C.orange2; g.fill();
      g.restore();
    }
    // 3) pousada: desliza devagar para a direita pela banda (quadros avançando)
    if (pousou) {
      const idade = lt - landT;
      const x = 50 + idade * 55;
      const rowA = 1 - enter(lt, T_FIM - 0.35, 0.18);
      if (x < REF_W - 60 && rowA > 0.02) {
        g.save(); g.globalAlpha *= someFim * rowA;
        phoneCard(g, x, ROLO_Y + 40, 72, 110, { marca: MARCA, mote: null, glow: false, alpha: 1, r: 6 });
        g.restore();
      }
    }
  }
  // card por cima de tudo (a cópia deslizante fica ATRÁS, espiando à direita)
  if (cIn > 0.01 && someFim > 0.01) {
    phoneCard(g, 235, 320, 250, 400, { marca: MARCA, mote: MOTE, glow: true, alpha: cIn * someFim, r: 26, dot: false });
    if (someFim > 0.01) {
      g.save(); g.globalAlpha *= cIn * someFim;
      circle(g, 235 + 250 * 0.62, 320 + 400 * yDotF, 26);
      g.fillStyle = C.orange2; g.fill();
      g.restore();
    }
  }

  // pilha no canto inferior esquerdo (as cópias acumulando, ref 40,7-41,2)
  const pilhaIn = enter(lt, 2.60, 0.3) * (1 - enter(lt, T_FIM - 0.35, 0.18));
  if (pilhaIn > 0.01) {
    for (let p = 0; p < 3; p++) {
      const a = pilhaIn * (1 - p * 0.22);
      if (a <= 0.02) continue;
      g.save(); g.globalAlpha *= a;
      g.translate(36 + p * 7, 826 - p * 5); g.rotate(-0.06 + p * 0.05);
      phoneCard(g, -36, -58, 72, 116, { marca: MARCA, mote: null, glow: false, alpha: 1, r: 6 });
      g.restore();
    }
  }

  // ---- FINAL (ref 41,4-41,95): card some e a FilaIRA de quadros EM PÉ fica
  if (lt > T_FIM - 0.35) {
    const row = enter(lt, T_FIM - 0.1, 0.35);
    for (let i = 0; i < 8; i++) {
      const x = 45 + i * 90;
      g.save(); g.globalAlpha *= row;
      phoneCard(g, x, ROLO_Y + 40, 72, 110, { marca: MARCA, mote: null, glow: false, alpha: 1, r: 6 });
      g.restore();
    }
  }
});

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
  const zz = lt > 5.0 ? Math.exp(2.0 * (lt - 5.0)) : 1;
  g.save();
  if (zz > 1.001) { g.translate(360, 640); g.scale(zz, zz); g.translate(-360, -640); }
  const W = (tt, w, extra = {}) => ({ t: tt, w, ...extra });
  const palavras = [
    W(0.05, "O texto"), W(0.5, "que você tá"), W(1.05, "lendo agora foi"),
    W(1.85, "animado por uma"), W(2.35, "IA", { box: ORANGE }),
    W(2.8, "que tá falando sobre"), W(3.75, "ela mesma,", { cor: "#e8603a" }),
    W(4.3, "animando", { cor: "#e8603a" }), W(4.75, "o texto que você tá"), W(5.2, "lendo agora."),
  ];
  // o ref mostra o texto CENTRALIZADO na tela (pedido do usuário: estava
  // estourando em cima). O kineticLine ancora o y na BASE do bloco — medimos
  // o wrap (mesma regra de quebra dele) e centramos o conjunto no 640.
  const sizeT = 40, lhT = sizeT * 1.36;
  let curW = 0, nLinT = 1;
  for (const p of palavras) {
    const w = measureT(g, p.w, { size: sizeT, font: "MXB" }) + sizeT * 0.28;
    if (curW + w > 620) { nLinT++; curW = 0; }
    curW += w;
  }
  const totalHT = nLinT * lhT;
  const yTexto = 640 + totalHT / 2 - lhT * 0.2;   // base do bloco para centro ≈ 640
  kineticLine(g, palavras, lt, { x: 360, y: yTexto, size: sizeT, font: "MXB", maxW: 620, lineH: 1.36, dim: false, riseY: 8, align: "center" });
  // topo visual do bloco (anotação e miniatura ancoradas nele)
  const topoBloco = yTexto - totalHT + lhT * 0.8 - sizeT * 0.72;
  // anotação "(ela mesma)" apontando para os termos laranjas do fim do texto
  const an = enter(lt, 5.1, 0.3);
  if (an > 0.01) {
    g.save(); g.globalAlpha *= an;
    g.strokeStyle = "#f0a13c"; g.lineWidth = 2;
    g.beginPath(); g.ellipse(300, topoBloco - 108, 148, 44, -0.06, 0, Math.PI * 2); g.stroke();
    textT(g, "(ela mesma)", 310, topoBloco - 34, { size: 19, font: "ISI", color: "#c9a06a", align: "center" });
    g.restore();
    cursor(g, 340, topoBloco - 24, { label: AGENTE, scale: 0.8 });
  }
  // cartãozinho com a miniatura do próprio bloco (abaixo do texto centralizado)
  const mc = enter(lt, 5.5, 0.3);
  if (mc > 0.01) {
    const cy0 = topoBloco + totalHT + 34 + (1 - mc) * 20;
    g.save(); g.globalAlpha *= mc;
    rr(g, 270, cy0, 200, 340, 18); g.fillStyle = "#141418"; g.fill();
    g.strokeStyle = "rgba(255,255,255,.12)"; g.lineWidth = 2; g.stroke();
    textT(g, "O texto que você tá", 292, cy0 + 66, { size: 12, font: "MXB", color: C.white });
    textT(g, "lendo agora foi", 292, cy0 + 86, { size: 12, font: "MXB", color: C.white });
    textT(g, "animado por uma", 292, cy0 + 106, { size: 12, font: "MXB", color: C.white });
    g.fillStyle = ORANGE; g.fillRect(398, cy0 + 97, 14, 12);
    textT(g, "que tá falando sobre", 292, cy0 + 126, { size: 12, font: "MXB", color: C.white });
    textT(g, "ela mesma, animando o", 292, cy0 + 146, { size: 12, font: "MXB", color: "#e8603a" });
    textT(g, "texto que você tá", 292, cy0 + 166, { size: 12, font: "MXB", color: C.white });
    textT(g, "lendo agora.", 292, cy0 + 186, { size: 12, font: "MXB", color: C.white });
    rr(g, 320, cy0 + 266, 120, 40, 6); g.fillStyle = "#22222a"; g.fill();
    textT(g, "00:12:04", 334, cy0 + 292, { size: 11, font: "Mono", color: "#9a9aa4" });
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
    // o TEXTO do bloco anterior continua na tela enquanto o telefone cresce
    // (o ref mantém a frase visível até ser engolida pelo zoom — antes ela
    // sumia no corte e a cena abria vazia)
    if (lt < 0.85) {
      const aTxt = 1 - M.smooth(clamp((lt - 0.55) / 0.3, 0, 1));
      const palavras = [
        { t: 0, w: "O texto" }, { t: 0, w: "que você tá" }, { t: 0, w: "lendo agora foi" },
        { t: 0, w: "animado por uma" }, { t: 0, w: "IA", box: ORANGE },
        { t: 0, w: "que tá falando sobre" }, { t: 0, w: "ela mesma,", cor: "#e8603a" },
        { t: 0, w: "animando", cor: "#e8603a" }, { t: 0, w: "o texto que você tá" }, { t: 0, w: "lendo agora." },
      ];
      const sizeT = 40, lhT = sizeT * 1.36;
      let curW = 0, nLinT = 1;
      for (const p of palavras) {
        const w = measureT(g, p.w, { size: sizeT, font: "MXB" }) + sizeT * 0.28;
        if (curW + w > 620) { nLinT++; curW = 0; }
        curW += w;
      }
      g.save(); g.globalAlpha *= aTxt;
      // texto ACIMA do telefone (o ref: frase no alto, telefone crescendo embaixo)
      kineticLine(g, palavras, 9, { x: 360, y: 400 + (nLinT * lhT) / 2 - lhT * 0.2, size: sizeT, font: "MXB", maxW: 620, lineH: 1.36, dim: false, riseY: 0, align: "center" });
      g.restore();
    }
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
    // ao contrário, os fills escuros dos fantasmas cobrem o texto e matam o
    // contraste (alpha menor: o motion blur não pode virar pasta)
    g.globalAlpha = 0.14; desenhaRec(lt - 2 / 15);
    g.globalAlpha = 0.30; desenhaRec(lt - 1 / 15);
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
    // estrelinha ✦ que brilha no topo-esquerda (ref 55,8-56,1) e o texto GRANDE
    // na ESQUERDA embaixo dela (antes: texto pequeno centrado + card colado no
    // canto = "tudo embolado" — o ref alinha à esquerda e usa a tela)
    const su2 = clamp((lt - 0.02) / 0.55, 0, 1);
    sparkle(g, 132, 268, Math.sin(su2 * Math.PI) * 24);
    typeStep(g, [[0.45, "o melhor"], [1.4, "o melhor de"], [1.72, "o melhor de tudo"]], lt,
      { size: 46, font: "AB", color: C.white, x: 90, y: 380, tracking: -2, novo: "#e8603a" });
    const a3 = enter(lt, 1.75, 0.2);
    if (a3 > 0.01) {
      g.save(); g.globalAlpha = a3;
      textT(g, "muito", 360, 742, { size: 34, font: "MB", color: "#9a989f", align: "center" });
      g.restore();
    }
    const al = enter(lt, 2.15, 0.3);
    if (al > 0.01) {
      g.save(); g.globalAlpha = al * 0.9;
      textT(g, "leve", 360, 852, { size: 76, font: "ISI", color: "#cfcdc4", align: "center", tracking: -2 });
      g.restore();
    }
    return;
  }
  const t = lt - 2.5;
  const a1 = enter(t, 0.0, 0.2), a2 = enter(t, 0.25, 0.2);
  g.save(); g.globalAlpha = a1;
  textT(g, "muito fácil", 360, 470, { size: 38, font: "MB", color: "#9a989f", align: "center" });
  g.restore();
  if (a2 > 0.01) {
    g.save(); g.globalAlpha = a2;
    textT(g, "de", 360, 600, { size: 60, font: "MB", color: C.white, align: "center", tracking: -1.4 });
    g.restore();
    const blink = Math.floor(lt * 3) % 2 === 0;
    if (blink) { g.fillStyle = "#2a2a30"; g.fillRect(392, 560, 2.5, 46); }
  }
  const a3 = enter(t, 0.45, 0.18);
  if (a3 > 0.01) {
    g.save(); g.globalAlpha = a3;
    textT(g, "de alterar", 360, 600, { size: 60, font: "MB", color: C.white, align: "center", tracking: -1.4 });
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
  // APROVEITAMENTO DE TELA (ref: texto grande no topo-esquerda e "trema" GIGANTE
  // embaixo — antes era texto miúdo centrado no topo com a tela vazia)
  kineticLine(g, [
    { t: 0.05, w: "e" }, { t: 1.0, w: "se quiser que" },
    { t: 1.5, w: "uma determinada" }, { t: 1.75, w: "palavra" },
    { t: 2.35, w: "aqui" },
  ], lt, { x: 90, y: 400, size: 42, font: "MXB", maxW: 560, align: "left", lineH: 1.32, riseY: 6, janela: 0.6 });
  // t=67–68 estava a 294%/207% do ref (entrada nervosa demais) — entrada calma.
  const a = enter(lt, 2.55, 0.18);
  if (a > 0.01) {
    g.save(); g.globalAlpha = a;
    selectionText(g, 96, 700, "trema", { size: 130, t: lt,
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
      tremendoTexto(g, "ela vai", 230, 930, lt, { size: 44, font: "MB", color: "#9a989f", amp: 18, freq: 12 });
      tremendoTexto(g, "tremer.", 430, 944, lt, { size: 64, font: "ISI", color: "#8b6cf6", amp: 22, freq: 12 });
    } else {
      const w1 = measureT(g, "ela vai ", { size: 44, font: "MB" });
      const w2 = measureT(g, "tremer.", { size: 64, font: "ISI" });
      const x0 = 360 - (w1 + w2) / 2;
      textT(g, "ela vai ", x0, 930, { size: 44, font: "MB", color: "#9a989f" });
      textT(g, "tremer.", x0 + w1, 944, { size: 64, font: "ISI", color: "#8b6cf6" });
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
  bg(g, lt, { glow: "#6a49ec", glowA: 0.2, gx: 360, gy: 620, gr: 640 });
  // APROVEITAMENTO DE TELA (ref: headline no topo, marca grande no centro e o
  // painel de comentários ocupando a metade de baixo — antes tudo estava socado
  // pra baixo com um vão enorme em cima)
  const a1 = enter(lt, 0.05, 0.2);
  g.save(); g.globalAlpha *= a1 * (1 - enter(lt, 0.45, 0.15));
  textT(g, "quer", 360, 268, { size: 34, font: "MB", color: "#9a989f", align: "center" });
  g.restore();
  const a2 = enter(lt, 0.5, 0.16);
  if (a2 > 0.01) {
    g.save(); g.globalAlpha = a2;
    textT(g, "quer saber mais?", 360, 268, { size: 34, font: "MB", color: "#9a989f", align: "center" });
    g.restore();
  }
  const a3 = enter(lt, 0.75, 0.18);
  if (a3 > 0.01) {
    g.save(); g.globalAlpha = a3;
    textT(g, "comenta", 360, 356, { size: 62, font: "AB", color: C.white, align: "center", tracking: -2 });
    g.restore();
  }
  const a4 = enter(lt, 1.35, 0.24);
  if (a4 > 0.01) {
    const s = easeOutBack(a4, 1.1);
    g.save();
    g.translate(360, 570); g.scale(lerp(0.92, 1, s), lerp(0.92, 1, s));
    textT(g, "NODO", 0, -42, { size: 122, font: "AB", color: "#8b6cf6", align: "center", tracking: -6 });
    textT(g, "PRIME", 0, 92, { size: 122, font: "AB", color: "#8b6cf6", align: "center", tracking: -6 });
    g.restore();
  }
  const pIn = enter(lt, 0.9, 0.3);
  if (pIn > 0.01) {
    const cp = commentsPanel(g, 58, 716 + (1 - pIn) * 20, 604, 356, {
      texto: lt > 3.0 ? "NODO PRIME" : "",
      coracao: lt > 3.4 ? 1 : 0,
    });
    if (lt > 1.7) cursor(g, 560, 880, { label: AGENTE, scale: 0.95 });
  }
  typeStep(g, [[3.1, "que eu te mostro"], [3.7, "que eu te mostro como fiz."]], lt,
    { size: 34, font: "ISI", color: "#d8d7d0", align: "center", x: 360, y: 1152, novo: "#e8a13c" });
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
  B8:  { keys: [{ t: 0, zoom: 1.0 }, { t: 2.0, zoom: 1.04 }, { t: 3.8, zoom: 1.0 }, { t: 5.6, zoom: 1.03 }], focus: [360, 640], entryAmp: 90 },
  B9:  { keys: [{ t: 0, zoom: 1.0 }, { t: 0.45, zoom: 1.03 }, { t: 1.0, zoom: 1.16 }, { t: 1.35, zoom: 1.02 }, { t: 3.4, zoom: 1.0 }, { t: 4.2, zoom: 1.05 }, { t: 5.9, zoom: 1.08 }], focus: [360, 620], entryAmp: 150 },
  B10: { keys: [{ t: 0, zoom: 1.0 }, { t: 2.6, zoom: 1.10 }, { t: 4.4, zoom: 1.03 }], focus: [360, 560], entryAmp: 110 },
  B11: { keys: [{ t: 0, zoom: 1.06 }, { t: 2.0, zoom: 1.0 }], focus: [360, 620], entryAmp: 150 },
  B12: { keys: [{ t: 0, zoom: 1.0 }, { t: 4.2, zoom: 1.04 }, { t: 5.25, zoom: 1.06 }], focus: [360, 640], entryAmp: 90 },
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
  { bloco: "B10", extra: 1.20 }, // print → rolo de filme → subida remontando a mini cena
  { bloco: "B2", extra: 4.20 },   // 4 arquivos, clique no CapCut e arrasto até a lixeira
  { bloco: "B5", extra: 3.60 },   // órbita + entrada 3D + varredura parando em cada keyframe
  { bloco: "B6", extra: 1.10 },   // keyframe puxado para cima, elástico, tracejado original
  { bloco: "B7", extra: 1.00 },   // chaves sanfona apertando o texto
  { bloco: "B8", extra: 2.60 },   // grade GRANDE nascendo estourada e assentando no centro
  { bloco: "B9", extra: 3.00 },   // <html> digitado + colagem + fechar/abrir + device mode
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
