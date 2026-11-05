// render-meta-demo.mjs — renderiza o reel "meta-demo" (tipografia cinética + UI falsa)
// uso:
//   node render-meta-demo.mjs --stills 1.3,3.5,8.1
//   node render-meta-demo.mjs --out _replica/nodo-prime-reel.mp4
//   node render-meta-demo.mjs --from 30 --to 40 --out trecho.mp4
import fs from "node:fs";
import path from "node:path";
import { spawn } from "node:child_process";
import { createRequire } from "node:module";
import { createCanvas } from "@napi-rs/canvas";
import { registerFonts, REF_W, REF_H, OUT_W, OUT_H, S, FPS } from "./lib/kit.mjs";
import { BLOCOS, blocoEm, DUR } from "./cena-meta-demo.mjs";

const require = createRequire(import.meta.url);
const FF = (() => {
  try { return require("ffmpeg-static"); } catch { return "ffmpeg"; }
})();

const args = process.argv.slice(2);
const arg = (k, def = null) => {
  const i = args.indexOf(k);
  return i >= 0 ? args[i + 1] : def;
};
const has = (k) => args.includes(k);

registerFonts();

const canvas = createCanvas(OUT_W, OUT_H);
const ctx = canvas.getContext("2d");

function frame(t) {
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.globalAlpha = 1;
  ctx.clearRect(0, 0, OUT_W, OUT_H);
  ctx.save();
  ctx.scale(S, S);
  const b = blocoEm(t);
  b.draw(ctx, t - b.t0);
  ctx.restore();
  return b.nome;
}

const stills = arg("--stills");
if (stills) {
  const dir = arg("--dir", "_replica/stills");
  fs.mkdirSync(dir, { recursive: true });
  for (const s of stills.split(",")) {
    const t = parseFloat(s);
    const nome = frame(t);
    const f = path.join(dir, `t${t.toFixed(2)}_${nome}.png`);
    fs.writeFileSync(f, canvas.toBuffer("image/png"));
    console.log("still", t, nome, f);
  }
  process.exit(0);
}

const out = arg("--out", "_replica/meta-demo.mp4");
const from = parseFloat(arg("--from", "0"));
const to = parseFloat(arg("--to", String(DUR)));
const fps = parseInt(arg("--fps", String(FPS)), 10);
const n0 = Math.round(from * fps), n1 = Math.round(to * fps);
const total = n1 - n0;

fs.mkdirSync(path.dirname(out), { recursive: true });
const ff = spawn(FF, [
  "-y", "-hide_banner", "-loglevel", "error",
  "-f", "rawvideo", "-pix_fmt", "rgba", "-s", `${OUT_W}x${OUT_H}`, "-r", String(fps), "-i", "-",
  "-c:v", "libx264", "-preset", "medium", "-crf", "18", "-pix_fmt", "yuv420p",
  "-movflags", "+faststart", out,
], { stdio: ["pipe", "inherit", "inherit"] });

const t0 = Date.now();
let i = n0;
function step() {
  while (i < n1) {
    frame(i / fps);
    const buf = ctx.getImageData(0, 0, OUT_W, OUT_H).data;
    const ok = ff.stdin.write(Buffer.from(buf.buffer, buf.byteOffset, buf.byteLength));
    i++;
    if ((i - n0) % 60 === 0) {
      const pct = (((i - n0) / total) * 100).toFixed(0);
      const el = (Date.now() - t0) / 1000;
      process.stdout.write(`\r${pct}%  ${((i - n0) / fps).toFixed(1)}s  (${el.toFixed(0)}s decorridos)   `);
    }
    if (!ok) { ff.stdin.once("drain", step); return; }
  }
  ff.stdin.end();
}
ff.on("close", (code) => {
  console.log(`\nfim: ${out} (${((Date.now() - t0) / 1000).toFixed(1)}s, code ${code})`);
});
step();
