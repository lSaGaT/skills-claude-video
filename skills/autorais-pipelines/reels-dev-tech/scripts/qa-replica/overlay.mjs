// overlay de calibração: referência no vermelho, nosso render no ciano.
// alinhado = branco; diferença = franja vermelha/ciano.
import fs from "node:fs";
import { execFileSync } from "node:child_process";
import { createCanvas, loadImage } from "@napi-rs/canvas";

const FF = "node_modules/ffmpeg-static/ffmpeg.exe";
const [tArg, xArg, yArg, wArg, hArg] = process.argv.slice(2);
const t = parseFloat(tArg);
const crop = `crop=${wArg}:${hArg}:${xArg}:${yArg}`;
const escala = 2;

const refPng = `_replica/cmp/ov_ref_${t}.png`;
execFileSync(FF, ["-hide_banner", "-loglevel", "error", "-ss", String(t), "-i", "_replica/ref/ref.mp4",
  "-frames:v", "1", "-vf", `${crop},scale=${wArg * escala}:${hArg * escala}`, "-y", refPng]);

const stills = fs.readdirSync("_replica/stills").filter((f) => f.startsWith(`t${t.toFixed(2)}_`));
if (!stills.length) { console.log("sem still", t); process.exit(1); }
const ourPng = `_replica/cmp/ov_our_${t}.png`;
execFileSync(FF, ["-hide_banner", "-loglevel", "error", "-i", `_replica/stills/${stills[0]}`,
  "-vf", `scale=720:1280,${crop},scale=${wArg * escala}:${hArg * escala}`, "-y", ourPng]);

const a = await loadImage(refPng), b = await loadImage(ourPng);
const W = a.width, H = a.height;
const c = createCanvas(W, H);
const g = c.getContext("2d");
g.drawImage(a, 0, 0); g.drawImage(b, 0, 0);
const da = g.getImageData(0, 0, W, H);
const pa = da.data;
for (let i = 0; i < pa.length; i += 4) {
  const ref = pa[i];        // canal R da referência (o nosso está por cima, mas usamos a média)
  const ours = (pa[i + 1] + pa[i + 2]) / 2;
  pa[i] = ref;              // R = referência
  pa[i + 1] = ours;         // G
  pa[i + 2] = ours;         // B
}
// recomputa usando as duas fontes separadas (mais correto)
const cb = createCanvas(W, H); const gb = cb.getContext("2d"); gb.drawImage(b, 0, 0);
const db = gb.getImageData(0, 0, W, H).data;
const ca = createCanvas(W, H); const ga = ca.getContext("2d"); ga.drawImage(a, 0, 0);
const daa = ga.getImageData(0, 0, W, H).data;
for (let i = 0; i < pa.length; i += 4) {
  const lumR = (daa[i] + daa[i + 1] + daa[i + 2]) / 3;
  const lumO = (db[i] + db[i + 1] + db[i + 2]) / 3;
  pa[i] = lumR;
  pa[i + 1] = lumO;
  pa[i + 2] = lumO;
  pa[i + 3] = 255;
}
g.putImageData(da, 0, 0);
const out = `_replica/cmp/ov_${t}.png`;
fs.writeFileSync(out, c.toBuffer("image/png"));
console.log(out, W, H);
