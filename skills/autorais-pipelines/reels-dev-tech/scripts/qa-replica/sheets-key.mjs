import fs from "node:fs";
import { execFileSync } from "node:child_process";
import { createCanvas, GlobalFonts, loadImage } from "@napi-rs/canvas";

const FF = "node_modules/ffmpeg-static/ffmpeg.exe";
const groups = JSON.parse(fs.readFileSync("_replica/analise/grupos.json", "utf8"));
const outDir = "_replica/key";
fs.mkdirSync(outDir, { recursive: true });

const TW = 360, TH = 640, COLS = 4, ROWS = 3, PER = COLS * ROWS;
const LBL = 22;
GlobalFonts.registerFromPath("fonts/Montserrat-Bold.ttf", "MB");

const items = groups.map((g, i) => {
  const t = g.endT;
  const f = `${outDir}/k${String(i).padStart(3, "0")}.jpg`;
  if (!fs.existsSync(f)) {
    execFileSync(FF, ["-hide_banner", "-loglevel", "error", "-ss", String(t), "-i", "_replica/ref/ref.mp4",
      "-frames:v", "1", "-vf", `scale=${TW}:${TH}`, "-q:v", "3", "-y", f]);
  }
  return { f, t, i, from: g.startT };
});

let n = 0;
for (let s = 0; s * PER < items.length; s++) {
  const chunk = items.slice(s * PER, (s + 1) * PER);
  const c = createCanvas(TW * COLS + 4 * (COLS + 1), (TH + LBL + 4) * ROWS + 4);
  const g2 = c.getContext("2d");
  g2.fillStyle = "#202020"; g2.fillRect(0, 0, c.width, c.height);
  for (let i = 0; i < chunk.length; i++) {
    const col = i % COLS, row = Math.floor(i / COLS);
    const x = 4 + col * (TW + 4), y = 4 + row * (TH + LBL + 4);
    const img = await loadImage(chunk[i].f);
    g2.drawImage(img, x, y);
    g2.fillStyle = "#00ff88";
    g2.font = "18px MB";
    g2.fillText(`#${chunk[i].i}  ${chunk[i].t.toFixed(2)}s`, x + 4, y + TH + 17);
  }
  fs.writeFileSync(`_replica/key/sheet${s}.jpg`, c.toBuffer("image/jpeg", 78));
  n++;
  console.log("sheet", s, chunk.length);
}
console.log("sheets", n, "itens", items.length);
