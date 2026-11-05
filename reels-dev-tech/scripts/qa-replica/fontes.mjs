import { createCanvas, GlobalFonts } from "@napi-rs/canvas";
import fs from "node:fs";

const reg = (p, n) => { try { GlobalFonts.registerFromPath(p, n); return true; } catch (e) { return false; } };
reg("fonts/Montserrat-Black.ttf", "MBlack");
reg("fonts/Montserrat-ExtraBold.ttf", "MXBold");
reg("_replica/fonts/ArchivoBlack.ttf", "ArchivoBlack");
reg("_replica/fonts/InterTight-var.ttf", "InterTight");

const TEXT = "EDITADO";
const cands = [
  ["MBlack", "900 100px MBlack"],
  ["MXBold", "800 100px MXBold"],
  ["ArchivoBlack", "100px ArchivoBlack"],
  ["InterTight", "900 100px InterTight"],
];
const c = createCanvas(1400, 900);
const g = c.getContext("2d");
g.fillStyle = "#08080a"; g.fillRect(0, 0, c.width, c.height);
let y = 60;
const rep = [];
for (const [name, spec] of cands) {
  g.font = spec;
  const m = g.measureText(TEXT);
  const cap = m.actualBoundingBoxAscent;
  const size = (100 * 70) / cap;
  const spec2 = spec.replace("100px", size.toFixed(2) + "px");
  g.font = spec2;
  const m2 = g.measureText(TEXT);
  g.fillStyle = "#eef0ea";
  g.fillText(TEXT, 60, y + 70);
  g.fillStyle = "#00ff88"; g.font = "16px MXBold";
  g.fillText(`${name} w=${m2.width.toFixed(0)} (alvo 550)`, 60, y + 92);
  rep.push({ name, width: +m2.width.toFixed(0), size: +size.toFixed(1) });
  y += 200;
}
fs.writeFileSync("_replica/analise/fontes.png", c.toBuffer("image/png"));
console.log(JSON.stringify(rep, null, 1));
