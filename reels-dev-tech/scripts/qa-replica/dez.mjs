// dez.mjs — captura a CADA 0,1 s (10 fps, "slow motion" do usuário): 814 quadros de
// cada vídeo, nenhum pulado, montados em folhas de 10 quadros/s — REF em cima, NOSSO embaixo.
// É a versão fina das folhas de 0,5 s: o meio segundo escondia a cadência real.
// uso: node _replica/analise/dez.mjs [segundo inicial] [segundo final]
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
const FR = path.join(ROOT, "_replica/dez/ref");
const FO = path.join(ROOT, "_replica/dez/our");
const OUT = path.join(ROOT, "_replica/dez/folhas");
const TW = 168, TH = 299, PAD = 2, LABEL = 16;

const A = Number(process.argv[2] ?? 0), B = Number(process.argv[3] ?? 81.4);

// 1) extrai TODOS os quadros a 10 fps uma única vez por vídeo
function extrair(video, dir, tag) {
  fs.mkdirSync(dir, { recursive: true });
  const marca = path.join(dir, ".ok");
  if (fs.existsSync(marca)) return;
  console.log(`extraindo 10fps: ${tag}...`);
  spawnSync(FF, ["-y", "-loglevel", "error", "-i", video, "-vf", "fps=10,scale=" + TW + ":" + TH, "-q:v", "3", path.join(dir, "q_%04d.jpg")], { stdio: "ignore" });
  fs.writeFileSync(marca, "ok");
}
extrair(REF, FR, "ref");
extrair(OUR, FO, "our");

// 2) monta folhas de 10 quadros (1 s por folha) no intervalo pedido
fs.mkdirSync(OUT, { recursive: true });
const S0 = Math.floor(A), S1 = Math.ceil(B);
const q = (dir, s, k) => path.join(dir, `q_${String(s * 10 + k + 1).padStart(4, "0")}.jpg`);
for (let s = S0; s < S1; s++) {
  const cv = createCanvas(10 * (TW + PAD) + PAD, LABEL * 2 + 2 * (TH + PAD) + PAD);
  const g = cv.getContext("2d");
  g.fillStyle = "#000"; g.fillRect(0, 0, cv.width, cv.height);
  g.font = "bold 12px sans-serif";
  g.fillStyle = "#3f6"; g.fillText(`REF  ${s}s -> ${s + 1}s  (0,1 s por quadro)`, 4, 12);
  g.fillStyle = "#6af"; g.fillText(`NOSSO`, 4, LABEL + TH + PAD + 12);
  for (let k = 0; k < 10; k++) {
    const x = PAD + k * (TW + PAD);
    const fr = q(FR, s, k), fo = q(FO, s, k);
    if (fs.existsSync(fr)) g.drawImage(await loadImage(fr), x, LABEL);
    if (fs.existsSync(fo)) g.drawImage(await loadImage(fo), x, LABEL * 2 + TH + PAD);
    g.fillStyle = "#fff"; g.font = "10px sans-serif";
    g.fillText(`${s},${k}`, x + 4, LABEL + TH - 4);
  }
  const f = path.join(OUT, `d${String(s).padStart(2, "0")}.jpg`);
  fs.writeFileSync(f, cv.toBuffer("image/jpeg", 86));
}
console.log(`folhas 0,1s: ${OUT} (d${String(S0).padStart(2, "0")}.jpg .. d${String(S1 - 1).padStart(2, "0")}.jpg)`);
