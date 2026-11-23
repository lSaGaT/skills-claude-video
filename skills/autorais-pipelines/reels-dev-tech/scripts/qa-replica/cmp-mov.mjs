// cmp-mov.mjs — compara perfil de movimento entre dois vídeos
// uso: node _replica/analise/cmp-mov.mjs <nosso.mp4> [de] [ate] [offset]
//   offset: nosso.mp4 começa no segundo `offset` do ref (para validar trechos isolados)
import { spawn } from "node:child_process";
import { createRequire } from "node:module";
const require = createRequire(import.meta.url);
const FF = require("ffmpeg-static");
const W = 180, H = 320, FPS = 30;

function perfil(video) {
  return new Promise((res) => {
    const ff = spawn(FF, ["-v", "error", "-i", video, "-vf", `fps=${FPS},scale=${W}:${H},format=gray`, "-f", "rawvideo", "-"]);
    const sz = W * H;
    let prev = null, buf = Buffer.alloc(0);
    const out = [];
    ff.stdout.on("data", (d) => {
      buf = Buffer.concat([buf, d]);
      while (buf.length >= sz) {
        const f = buf.subarray(0, sz); buf = buf.subarray(sz);
        let s = 0;
        if (prev) for (let i = 0; i < sz; i++) s += Math.abs(f[i] - prev[i]);
        out.push(prev ? s / sz : 0);
        prev = Buffer.from(f);
      }
    });
    ff.on("close", () => res(out));
  });
}
const [our, de = "0", ate = "81.4", offS = "0"] = process.argv.slice(2);
const A = +de, B = +ate, OFF = +offS;
const r = await perfil("_replica/ref/ref.mp4");
const o = await perfil(our);
const med = (a, f, t) => { const s = a.slice(Math.round(f * FPS), Math.round(t * FPS)); return s.length ? s.reduce((x, y) => x + y, 0) / s.length : 0; };
console.log("   t   ref   nosso   %   barras(ref/nosso)");
for (let t = Math.floor(A); t < Math.min(B, 81); t++) {
  const a = med(r, t, t + 1), b = med(o, t - OFF, t + 1 - OFF);
  console.log(String(t).padStart(4), a.toFixed(2).padStart(5), b.toFixed(2).padStart(6), ((b / (a || 1)) * 100).toFixed(0).padStart(4) + "%  " + "#".repeat(Math.min(28, Math.round(a * 1.2))) + " | " + "#".repeat(Math.min(28, Math.round(b * 1.2))));
}
console.log(`MÉDIA ${med(r, A, B).toFixed(2)} vs ${med(o, A - OFF, B - OFF).toFixed(2)}`);
