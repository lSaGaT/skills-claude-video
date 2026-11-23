# baixar-pacotes-fontes.py — Fase A: baixa os pacotes (zip) dos estilos de texto sem
# preview e extrai os TTFs. Saída: fontes/<id>.ttf + fontes-manifesto.json
# (id → {titulo, cat, ttf}). Retriável: pula o que já baixou.
import json
import sys
import io
import zipfile
import time
from concurrent.futures import ThreadPoolExecutor, as_completed
from pathlib import Path
from urllib.request import Request, urlopen

sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding="utf-8", errors="replace")
SKILL = Path(r"C:\Users\Conectare\Downloads\video\.agents\skills\capcut-effects-filters\evidence\catalogo-visual")
FONTES = SKILL / "fontes"
FONTES.mkdir(exist_ok=True)
UA = {"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/131.0"}

data = json.loads((SKILL / "catalogo-completo.json").read_text(encoding="utf-8"))
por_id = {r["id"]: r for r in data["recursos"]}

alvos = []
for f in (SKILL / "stickers").glob("*.webp"):
    if f.stat().st_size >= 3000:
        continue
    eid = f.stem.split("_")[0]
    r = por_id.get(eid, {})
    urls = r.get("item_urls") or []
    if urls:
        alvos.append({"id": eid, "titulo": r.get("titulo") or "", "cat": r.get("categoria_nome") or "", "url": urls[0]})
print(f"pacotes a baixar: {len(alvos)}")

def baixa(a):
    ttf = FONTES / f"{a['id']}.ttf"
    if ttf.exists() and ttf.stat().st_size > 5000:
        return (a["id"], "cache")
    for tentativa in range(3):
        try:
            req = Request(a["url"], headers=UA)
            buf = urlopen(req, timeout=30).read()
            if buf[:2] != b"PK":
                return (a["id"], f"nao-zip {buf[:3]!r}")
            zf = zipfile.ZipFile(io.BytesIO(buf))
            ttfs = [n for n in zf.namelist() if n.lower().endswith((".ttf", ".otf")) and "__MACOSX" not in n]
            if not ttfs:
                return (a["id"], "sem-fonte")
            ttf.write_bytes(zf.read(ttfs[0]))
            return (a["id"], "ok")
        except Exception as e:
            if tentativa == 2:
                return (a["id"], f"erro {str(e)[:40]}")
            time.sleep(1.2)

ok = falha = 0
with ThreadPoolExecutor(max_workers=8) as ex:
    for eid, status in as_completed({ex.submit(baixa, a): a for a in alvos}):
        if status in ("ok", "cache"):
            ok += 1
        else:
            falha += 1
            if falha <= 8:
                print("  falha:", eid, status)
print(f"fontes extraídas: {ok} · falhas: {falha}")

manifesto = []
for a in alvos:
    ttf = FONTES / f"{a['id']}.ttf"
    if ttf.exists():
        manifesto.append({"id": a["id"], "titulo": a["titulo"], "cat": a["cat"], "ttf": str(ttf)})
(SKILL / "fontes-manifesto.json").write_text(json.dumps(manifesto, ensure_ascii=False), encoding="utf-8")
print(f"fontes-manifesto.json: {len(manifesto)} fontes")
