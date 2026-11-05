// movimento.mjs — perfil de movimento: |frame(n) - frame(n-1)| médio, 30 fps
// Detecta "zonas mortas" (vídeo parado) e compara REF x NOSSO.
// uso: node _replica/analise/movimento.mjs
import fs from "node:fs";
import path from "node:path";
import { spawn } from "node:child_process";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const FF = require("ffmpeg-static");
const W = 180, H = 320, FPS = 30;

function perfil(video) {
  return new Promise((res) => {
    const ff = spawn(FF, [
      "-v", "error", "-i", video,
      "-vf", `fps=${FPS},scale=${W}:${H},format=gray`,
      "-f", "rawvideo", "-",
    ]);
    const sz = W * H;
    let prev = null, buf = Buffer.alloc(0), n = 0;
    const out = [];
    ff.stdout.on("data", (d) => {
      buf = Buffer.concat([buf, d]);
      while (buf.length >= sz) {
        const f = buf.subarray(0, sz);
        buf = buf.subarray(sz);
        let s = 0;
        if (prev) for (let i = 0; i < sz; i++) s += Math.abs(f[i] - prev[i]);
        out.push(prev ? s / sz : 0);
        prev = Buffer.from(f);
        n++;
      }
    });
    ff.on("close", () => res(out));
  });
}

const REF = "_replica/ref/ref.mp4";
const OUR = "_replica/replica-final.mp4";
const r = await perfil(REF);
const o = await perfil(OUR);

const media = (a, from, to) => {
  const s = a.slice(Math.round(from * FPS), Math.round(to * FPS));
  return s.length ? s.reduce((x, y) => x + y, 0) / s.length : 0;
};

// janelas de 1 s
const linhas = [];
for (let t = 0; t < 81; t++) {
  linhas.push({ t, ref: +media(r, t, t + 1).toFixed(2), our: +media(o, t, t + 1).toFixed(2) });
}
fs.writeFileSync("_replica/analise/movimento.json", JSON.stringify(linhas, null, 0));

const fmt = (v) => String(v).padStart(5) + " " + "#".repeat(Math.min(40, Math.round(v * 1.4)));
console.log(" t   REF   | NOSSO     (barras = movimento médio por segundo)");
for (const l of linhas) {
  const ratio = l.ref > 0.5 ? (l.our / l.ref) : NaN;
  console.log(
    String(l.t).padStart(2) + " " + fmt(l.ref) + " | " + fmt(l.our) +
      (Number.isFinite(ratio) ? `  ${(ratio * 100).toFixed(0)}%` : "")
  );
}
const mr = media(r, 0, 81.4), mo = media(o, 0, 81.4);
console.log(`\nMÉDIA GERAL  ref=${mr.toFixed(2)}  nosso=${mo.toFixed(2)}  -> ${(mo / mr * 100).toFixed(0)}% do movimento do ref`);
// zonas mortas: segundos com < 30% do movimento típico do próprio vídeo
const mortas = linhas.filter((l) => l.our < mr * 0.3).map((l) => l.t);
console.log("segundos MORTO no nosso (<30% da média do ref):", mortas.join(","));
