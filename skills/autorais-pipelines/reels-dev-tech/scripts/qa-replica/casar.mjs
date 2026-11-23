// casar.mjs — CASAMENTO FRAME A FRAME: nosso[i] × ref[i] no MESMO instante.
// Diferente do movimento.mjs (que mede |frame(n)-frame(n-1)| = vida), aqui cada
// quadro do nosso é comparado com o quadro do ref no mesmo t: desvio de conteúdo,
// dessincronia e prova visual dos piores segundos. Nenhum frame é pulado.
//
// uso:  node _replica/analise/casar.mjs [nosso.mp4]          (default _replica/replica-final.mp4)
//       node _replica/analise/casar.mjs trecho.mp4 --off 49  (trecho que começa no s 49 do ref)
import fs from "node:fs";
import path from "node:path";
import { spawn } from "node:child_process";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const FF = require("ffmpeg-static");
const W = 180, H = 320;

const args = process.argv.slice(2);
const OUR = args.find((a) => !a.startsWith("--")) || "_replica/replica-final.mp4";
const OFF = Number(args[args.indexOf("--off") + 1] || 0); // nosso t=0 == ref t=OFF

// decodifica TODOS os frames (30 fps, gray) — sem amostragem
function frames(video) {
  return new Promise((res, rej) => {
    const ff = spawn(FF, ["-v", "error", "-i", video, "-vf", `fps=30,scale=${W}:${H},format=gray`, "-f", "rawvideo", "-"]);
    const chunks = [];
    ff.stdout.on("data", (d) => chunks.push(d));
    ff.on("error", rej);
    ff.on("close", (code) => {
      const buf = Buffer.concat(chunks);
      const sz = W * H, n = Math.floor(buf.length / sz);
      const out = [];
      for (let i = 0; i < n; i++) out.push(buf.subarray(i * sz, (i + 1) * sz));
      code === 0 ? res(out) : rej(new Error("ffmpeg exit " + code));
    });
  });
}

const ref = await frames("_replica/ref/ref.mp4");
const our = await frames(OUR);
const n = Math.min(ref.length, our.length);
const sz = W * H;

// diff absoluto por frame (mesmo t) + função de diff entre índices arbitrários
const D = new Float32Array(n);
const diffAt = (i, j) => {
  const a = ref[i], b = our[j];
  let s = 0;
  for (let k = 0; k < sz; k++) s += Math.abs(a[k] - b[k]);
  return s / sz;
};
for (let i = 0; i < n; i++) D[i] = diffAt(i, i);

// ---- dessincronia: qual deslocamento de frames minimiza o diff? (±15 frames = ±0,5 s)
let bestOff = 0, bestCost = Infinity;
const probeFrom = Math.floor(OFF * 30) + 60, probeTo = Math.min(n, Math.floor((OFF + 70) * 30));
for (let o = -15; o <= 15; o++) {
  let s = 0, c = 0;
  for (let i = probeFrom; i < probeTo; i += 3) { s += diffAt(i, i - o); c++; } // 1/3 dos frames basta
  const cost = s / c;
  if (cost < bestCost) { bestCost = cost; bestOff = o; }
}

// ---- resumo por segundo (janelas [t, t+1) do ref, com o offset do trecho aplicado)
const porSeg = [];
for (let t = Math.floor(OFF); t < Math.floor(OFF + n / 30) && t < 81; t++) {
  const a = Math.round((t - OFF) * 30), b = Math.round((t + 1 - OFF) * 30);
  const seg = D.slice(a, b);
  if (!seg.length) continue;
  porSeg.push({ t, media: +(seg.reduce((x, y) => x + y, 0) / seg.length).toFixed(2) });
}

// ---- piores frames e piores segundos
const idxPior = [...D.keys()].sort((a, b) => D[b] - D[a]).slice(0, 40);
const segPior = [...porSeg].sort((a, b) => b.media - a.media).slice(0, 8);
const global = +(D.reduce((x, y) => x + y, 0) / n).toFixed(2);

console.log(`CASAMENTO FRAME A FRAME  (frames: ref=${ref.length} nosso=${our.length} casados=${n})`);
console.log(`desvio médio global: ${global}  (0 = cópia perfeita; ref×ref com codec diferente daria ~2-4)`);
console.log(`DESSINCRONIA: nosso está ${bestOff === 0 ? "ALINHADO" : bestOff > 0 ? `ATRASADO ${bestOff} frames (${(bestOff / 30).toFixed(2)}s)` : `ADIANTADO ${-bestOff} frames (${(-bestOff / 30).toFixed(2)}s)`} — custo ${bestCost.toFixed(1)} vs ${global} sem correção`);
console.log("\n piores SEGUNDOS (conteúdo diferente do ref no mesmo t):");
for (const s of segPior) console.log(`  t=${String(s.t).padStart(2)}  desvio ${String(s.media).padStart(5)}  ${"#".repeat(Math.min(40, Math.round(s.media)))}`);
console.log("\n piores FRAMES:");
for (const i of idxPior.slice(0, 15)) console.log(`  frame ${String(i).padStart(4)}  t=${(OFF + i / 30).toFixed(2)}s  desvio ${D[i].toFixed(1)}`);

fs.writeFileSync("_replica/analise/casamento.json", JSON.stringify({
  nosso: OUR, offsetRef: OFF, global, dessincroniaFrames: bestOff, custoCorrigido: +bestCost.toFixed(2),
  porSegundo: porSeg, pioresFrames: idxPior.slice(0, 40).map((i) => ({ i, t: +(OFF + i / 30).toFixed(3), d: +D[i].toFixed(1) })),
}, null, 1));

// ---- prova visual: para os 5 piores segundos, tira com 8 pares de quadros (0,125 s)
try {
  const { createCanvas, loadImage } = require("@napi-rs/canvas");
  const dir = "_replica/casamento";
  fs.mkdirSync(dir, { recursive: true });
  const grab = (video, t, w) => new Promise((res) => {
    const ff = spawn(FF, ["-v", "error", "-ss", String(t), "-i", video, "-frames:v", "1", "-vf", `scale=${w}:-2`, "-f", "image2pipe", "-vcodec", "png", "-"]);
    const c = [];
    ff.stdout.on("data", (d) => c.push(d));
    ff.on("close", () => res(Buffer.concat(c)));
  });
  for (const s of segPior.slice(0, 5)) {
    const PW = 200, PH = 356;
    const cv = createCanvas(PW * 2 + 12, (PH + 6) * 8 + 6);
    const g = cv.getContext("2d");
    g.fillStyle = "#101012"; g.fillRect(0, 0, cv.width, cv.height);
    for (let k = 0; k < 8; k++) {
      const t = s.t - OFF + k / 8 + 0.02; // t no nosso
      const tr = s.t + k / 8 + 0.02;      // t no ref
      const [rp, op] = await Promise.all([grab("_replica/ref/ref.mp4", tr, PW), grab(OUR, t, PW)]);
      const x = 4, y = 4 + k * (PH + 6);
      // loadImage (async): Image.src= so preenche o cabeçalho — pixels chegam depois
      const [ri, oi] = await Promise.all([loadImage(rp), loadImage(op)]);
      g.drawImage(ri, x, y, PW, PH);
      g.drawImage(oi, x + PW + 4, y, PW, PH);
      g.fillStyle = "#e8603a"; g.font = "600 14px sans-serif";
      g.fillText(`${tr.toFixed(3)}s  REF | NOSSO  desvio ${D[Math.round((s.t - OFF) * 30) + k * 4].toFixed(0)}`, x + 6, y + 18);
    }
    const out = path.join(dir, `pior_t${String(s.t).padStart(2, "0")}.jpg`);
    fs.writeFileSync(out, cv.toBuffer("image/jpeg", 82));
    console.log(`prova visual: ${out}`);
  }
} catch (e) {
  console.log("(prova visual pulada:", e.message + ")");
}
