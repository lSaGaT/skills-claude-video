// compara lado a lado: quadro do vídeo de referência x still do nosso render
import fs from "node:fs";
import { execFileSync } from "node:child_process";
import { createCanvas, loadImage } from "@napi-rs/canvas";

const FF = "node_modules/ffmpeg-static/ffmpeg.exe";
const tempos = process.argv.slice(2).map(Number);
const W = 500, H = Math.round((W / 9) * 16);
fs.mkdirSync("_replica/cmp", { recursive: true });

for (const t of tempos) {
  const refPng = `_replica/cmp/ref_${t}.png`;
  if (!fs.existsSync(refPng)) {
    execFileSync(FF, ["-hide_banner", "-loglevel", "error", "-ss", String(t), "-i", "_replica/ref/ref.mp4",
      "-frames:v", "1", "-vf", `scale=${W}:${H}`, "-y", refPng]);
  }
  const stills = fs.readdirSync("_replica/stills").filter((f) => f.startsWith(`t${t.toFixed(2)}_`));
  if (!stills.length) { console.log("sem still para", t); continue; }
  const ours = `_replica/stills/${stills[0]}`;
  const c = createCanvas(W * 2 + 24, H + 34);
  const g = c.getContext("2d");
  g.fillStyle = "#151515"; g.fillRect(0, 0, c.width, c.height);
  g.drawImage(await loadImage(refPng), 8, 26, W, H);
  g.drawImage(await loadImage(ours), W + 16, 26, W, H);
  g.fillStyle = "#00ff88"; g.font = "16px sans-serif";
  g.fillText(`REFERÊNCIA ${t}s`, 10, 18);
  g.fillText(`NOSSO ${t}s`, W + 18, 18);
  const out = `_replica/cmp/cmp_${t}.jpg`;
  fs.writeFileSync(out, c.toBuffer("image/jpeg", 86));
  console.log(out);
}
