// sheets-cmp.mjs — folhas de contato REF x NOSSO, 8 quadros de 0,5s por folha
// uso: node _replica/analise/sheets-cmp.mjs
import fs from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { createRequire } from "node:module";
import { createCanvas, loadImage } from "@napi-rs/canvas";

const require = createRequire(import.meta.url);
const FF = require("ffmpeg-static");
const ROOT = path.resolve(".");
const REF = path.join(ROOT, "_replica/ref/ref.mp4");
const OUR = path.join(ROOT, "_replica/replica-final.mp4");
const TMP = path.join(ROOT, "_replica/_tmpcmp");
const OUT = path.join(ROOT, "_replica/folhas");
fs.mkdirSync(TMP, { recursive: true });
fs.mkdirSync(OUT, { recursive: true });

const STEP = 0.5, PER = 8, TILE_W = 168, TILE_H = 299, PAD = 2, LABEL = 16;

function grab(video, t, tag) {
  const f = path.join(TMP, `${tag}_${t.toFixed(2)}.png`);
  if (!fs.existsSync(f)) {
    spawnSync(FF, ["-y", "-loglevel", "error", "-ss", String(t), "-i", video, "-frames:v", "1", "-vf", `scale=${TILE_W}:${TILE_H}`, f]);
  }
  return f;
}

const DUR = 81.41;
const nFolhas = Math.ceil(DUR / (STEP * PER));
for (let s = 0; s < nFolhas; s++) {
  const t0 = s * STEP * PER;
  const cv = createCanvas(PER * (TILE_W + PAD) + PAD, LABEL * 2 + 2 * (TILE_H + PAD) + PAD);
  const g = cv.getContext("2d");
  g.fillStyle = "#000"; g.fillRect(0, 0, cv.width, cv.height);
  g.font = "bold 12px sans-serif";
  g.fillStyle = "#3f6"; g.fillText(`REF  ${t0.toFixed(1)}s -> ${(t0 + STEP * PER).toFixed(1)}s`, 4, 12);
  g.fillStyle = "#6af"; g.fillText(`NOSSO`, 4, LABEL + TILE_H + PAD + 12);
  for (let k = 0; k < PER; k++) {
    const t = t0 + k * STEP;
    if (t > DUR) break;
    const x = PAD + k * (TILE_W + PAD);
    const a = grab(REF, t, "ref");
    const b = grab(OUR, t, "our");
    if (fs.existsSync(a)) { const im = await loadImage(a); g.drawImage(im, x, LABEL); }
    g.fillStyle = "#fff"; g.font = "11px sans-serif"; g.fillText(t.toFixed(1), x + 4, LABEL + TILE_H - 4);
    if (fs.existsSync(b)) { const im = await loadImage(b); g.drawImage(im, x, LABEL * 2 + TILE_H + PAD); }
  }
  const f = path.join(OUT, `f${String(s + 1).padStart(2, "0")}_${t0.toFixed(1)}s.jpg`);
  fs.writeFileSync(f, cv.toBuffer("image/jpeg", 88));
  console.log(f);
}
fs.rmSync(TMP, { recursive: true, force: true });
