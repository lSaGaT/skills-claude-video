import { spawn } from "node:child_process";
import fs from "node:fs";

const FF = "node_modules/ffmpeg-static/ffmpeg.exe";
const W = 180, H = 320, SZ = W * H, FPS = 30;

const p = spawn(FF, ["-hide_banner", "-loglevel", "error", "-i", "_replica/ref/ref.mp4",
  "-vf", `fps=${FPS},scale=${W}:${H},format=gray`, "-f", "rawvideo", "-"]);
const ch = p.stdout;

let prev = null, idx = 0, buf = Buffer.alloc(0);
const events = [];
const acc = (y0, y1, cur, pv, thr = 12) => {
  // fração de pixels que mudaram numa faixa vertical
  let n = 0, tot = 0;
  for (let y = y0; y < y1; y++) {
    for (let x = 0; x < W; x++) {
      const i = y * W + x; tot++;
      if (Math.abs(cur[i] - pv[i]) > thr) n++;
    }
  }
  return n / tot;
};
// faixas: 0-0.35 topo legenda, 0.35-0.62 meio, 0.62-1 base
const BANDS = [[0, 112], [112, 198], [198, 320]];

ch.on("data", (d) => {
  buf = Buffer.concat([buf, d]);
  while (buf.length >= SZ) {
    const cur = buf.subarray(0, SZ); buf = buf.subarray(SZ);
    if (prev) {
      let sum = 0;
      for (let i = 0; i < SZ; i++) sum += Math.abs(cur[i] - prev[i]);
      const md = sum / SZ;
      if (md > 1.2) events.push({ f: idx, t: +(idx / FPS).toFixed(3), md: +md.toFixed(2), bands: BANDS.map(([a, b]) => +acc(a, b, cur, prev).toFixed(3)) });
    }
    prev = Buffer.from(cur); idx++;
  }
});
p.on("close", () => {
  fs.writeFileSync("_replica/analise/diff.json", JSON.stringify({ frames: idx, events }, null, 0));
  console.log("frames", idx, "eventos", events.length);
  // agrupa eventos contíguos
  const groups = []; let g = null;
  for (const e of events) {
    if (g && e.f - g.endF <= 2) { g.endF = e.f; g.endT = e.t; g.peak = Math.max(g.peak, e.md); g.n++; }
    else { g = { startF: e.f, endF: e.f, startT: e.t, endT: e.t, peak: e.md, n: 1 }; groups.push(g); }
  }
  console.log("grupos", groups.length);
  fs.writeFileSync("_replica/analise/grupos.json", JSON.stringify(groups, null, 0));
  console.log(groups.map((g) => `${g.startT}-${g.endT}(pk${g.peak})`).join(" | "));
});
