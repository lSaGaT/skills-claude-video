// colar.mjs — REF em cima, NOSSO embaixo, nos tempos pedidos
// uso: node _replica/analise/colar.mjs 33.5,43.8,55.5 --out _replica/teste/colados
import fs from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { createRequire } from "node:module";
import { createCanvas, loadImage } from "@napi-rs/canvas";

const require = createRequire(import.meta.url);
const FF = require("ffmpeg-static");
const args = process.argv.slice(2);
const times = (args[0] || "").split(",").map(Number);
const oi = args.indexOf("--out");
const outDir = oi >= 0 ? args[oi + 1] : "_replica/teste/colados";
fs.mkdirSync(outDir, { recursive: true });

const TW = 300, TH = 533, L = 18;
const files = fs.readdirSync("_replica/teste").filter((f) => f.endsWith(".png") && /^t\d/.test(f));
const cv = createCanvas(times.length * (TW + 4), TH * 2 + L * 2 + 4);
const g = cv.getContext("2d");
g.fillStyle = "#000"; g.fillRect(0, 0, cv.width, cv.height);
g.font = "bold 13px sans-serif";

for (let i = 0; i < times.length; i++) {
  const t = times[i];
  const x = i * (TW + 4);
  const rf = path.join(outDir, `_r${t}.jpg`);
  spawnSync(FF, ["-y", "-loglevel", "error", "-ss", String(t), "-i", "_replica/ref/ref.mp4", "-frames:v", "1", "-vf", `scale=${TW}:${TH}`, rf]);
  if (fs.existsSync(rf)) g.drawImage(await loadImage(rf), x, L);
  g.fillStyle = "#3f6"; g.fillText(`REF ${t}`, x + 5, 13);
  const hit = files.find((f) => Math.abs(parseFloat(f.slice(1)) - t) < 0.02);
  if (hit) g.drawImage(await loadImage(path.join("_replica/teste", hit)), x, TH + L * 2, TW, TH);
  else { g.fillStyle = "#f33"; g.fillText("sem still", x + 5, TH + L * 2 + 20); }
  g.fillStyle = "#6af"; g.fillText(`NOSSO ${t}`, x + 5, TH + L * 2 - 5);
}
const f = path.join(outDir, "colados.jpg");
fs.writeFileSync(f, cv.toBuffer("image/jpeg", 90));
console.log(f);
