// mede caixa de tinta (bbox do que foi desenhado) em quadros de referência e em strings nossas
import { execFileSync } from "node:child_process";
import fs from "node:fs";
import { createCanvas, loadImage } from "@napi-rs/canvas";
import { registerFonts } from "../../.agents/skills/reels-dev-tech/scripts/lib/kit.mjs";

const FF = "node_modules/ffmpeg-static/ffmpeg.exe";

function bbox(img, x0, y0, w, h, dark = true, thr = 60) {
  const c = createCanvas(img.width, img.height);
  const g = c.getContext("2d");
  g.drawImage(img, 0, 0);
  const d = g.getImageData(x0, y0, w, h).data;
  let minx = 1e9, maxx = -1, miny = 1e9, maxy = -1;
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const i = (y * w + x) * 4;
      const lum = (d[i] + d[i + 1] + d[i + 2]) / 3;
      const hit = dark ? lum > thr : lum < thr;
      if (hit) {
        if (x < minx) minx = x; if (x > maxx) maxx = x;
        if (y < miny) miny = y; if (y > maxy) maxy = y;
      }
    }
  }
  if (maxx < 0) return null;
  return { x: x0 + minx, y: y0 + miny, w: maxx - minx + 1, h: maxy - miny + 1 };
}

const alvos = [
  [1.30, "ESSE", 0, 290, 500, 120, true],
  [1.30, "VÍDEO", 0, 460, 620, 140, true],
  [1.30, "que", 0, 660, 240, 80, true],
  [3.50, "ele nao foi", 0, 350, 420, 70, true],
  [3.50, "EDITADO", 0, 435, 700, 120, true],
  [11.90, "Ele foi", 250, 425, 240, 70, false],
  [11.90, "escrito.", 50, 480, 620, 190, false],
  [21.40, "nao abre", 150, 170, 420, 110, true],
  [17.10, "mas nao do", 100, 170, 520, 110, true],
];
registerFonts();
const c = createCanvas(1400, 300);
const g = c.getContext("2d");
function inkMedida(txt, font, size) {
  g.setTransform(1, 0, 0, 1, 0, 0);
  g.fillStyle = "#000"; g.fillRect(0, 0, 1400, 300);
  g.font = `${size}px ${font}`; g.fillStyle = "#fff";
  g.textBaseline = "alphabetic";
  g.fillText(txt, 40, 220);
  return bbox(c, 0, 0, 1400, 300, true, 60);
}

console.log("== REFERÊNCIA (720x1280) ==");
for (const [t, rot, x, y, w, h, dark] of alvos) {
  const f = `_replica/full/f${t.toFixed(2)}.jpg`;
  const img = await loadImage(f);
  const b = bbox(img, x, y, w, h, dark, dark ? 70 : 120);
  console.log(rot.padEnd(12), JSON.stringify(b), b ? `dur=${b.h} larg=${b.w} ratio=${(b.w / b.h).toFixed(3)}` : "");
}

console.log("== NOSSAS FONTES @100px ==");
for (const [rot, font, txt] of [["ESSE", "AB", "ESSE"], ["VÍDEO", "AB", "VÍDEO"], ["EDITADO", "AB", "EDITADO"],
["ele nao foi", "MXB", "ele não foi"], ["Ele foi", "MXB", "Ele foi"], ["escrito.", "ISI", "escrito."],
["nao abre", "AB", "não abre"], ["mas nao do", "AB", "mas não do"], ["que", "MXB", "que"]]) {
  const b = inkMedida(txt, font, 100);
  console.log(rot.padEnd(12), font, JSON.stringify(b), `dur=${b.h} larg=${b.w} ratio=${(b.w / b.h).toFixed(3)}`);
}
