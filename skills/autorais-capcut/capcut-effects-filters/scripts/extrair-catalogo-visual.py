# extrair-catalogo-visual.py — REA do painel do CapCut: extrai 100% dos recursos
# (legendas, stickers, efeitos, animações entrada/saída/combinação) com cover images
# e definições de template. Fonte: http_cache do rp.db (ressdk_db). Saída:
#   catalogo/catalogo-completo.json   (todos os campos)
#   catalogo/<grupo>/<id>_<titulo>.webp  (imagem de referência de cada modelo)
#   catalogo/legendas/templates/*.json   (subtitle_template — como o modelo trabalha)
#   catalogo/<grupo>.html                (galeria navegável com imagem+id+nome)
import sqlite3
import json
import re
import sys
import io
import hashlib
from concurrent.futures import ThreadPoolExecutor, as_completed
from pathlib import Path
from urllib.request import Request, urlopen

sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding="utf-8", errors="replace")

RAIZ = Path(r"C:\Users\Conectare\Downloads\video\.agents\skills\capcut-effects-filters\evidence")
DB = Path(r"C:\Users\Conectare\AppData\Local\Temp\rea-capcut\rp.db")
CAT = RAIZ / "catalogo-visual"
UA = {"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/131.0"}

# grupos pedidos pelo cliente: nome → (categoria(s) do painel, effect_types)
GRUPOS = {
    "legendas":   {"categorias": {"25205"}, "tipos": None},
    "stickers":   {"categorias": None, "tipos": {2, 10}},
    "efeitos":    {"categorias": None, "tipos": {7, 12}},
    "animacoes-entrada":    {"categorias": {"7037", "7026"}, "tipos": None},
    "animacoes-saida":      {"categorias": {"7027"}, "tipos": None},
    "animacoes-combinacao": {"categorias": {"7039"}, "tipos": None},
    "animacoes-loop":       {"categorias": {"7028"}, "tipos": None},
}

con = sqlite3.connect(str(DB))
rows = con.execute("SELECT url, response_body FROM http_cache").fetchall()
recursos = {}   # id → registro completo
categorias_nomes = {}
for url, body in rows:
    try:
        j = json.loads(body)
    except Exception:
        continue
    data = j.get("data") or {}
    for c in data.get("categories") or []:
        cid = str(c.get("category_id") or c.get("id") or "")
        categorias_nomes[cid] = c.get("category_name") or c.get("name") or ""
    fontes = []
    cr = data.get("category_resources")
    if isinstance(cr, dict):
        for cid, bloco in cr.items():
            for e in bloco.get("effect_item_list") or []:
                fontes.append((str(cid), e))
    if isinstance(data.get("effect_item_list"), list):
        for e in data["effect_item_list"]:
            fontes.append(("", e))
    for cid, e in fontes:
        a = e.get("common_attr") or {}
        eid = str(a.get("effect_id") or a.get("id") or "")
        if not eid or eid in recursos:
            continue
        cover = a.get("cover_url") or {}
        recursos[eid] = {
            "id": eid,
            "titulo": a.get("title") or "",
            "effect_type": a.get("effect_type"),
            "categoria_id": cid,
            "categoria_nome": categorias_nomes.get(cid, ""),
            "cover": {k: v for k, v in cover.items() if isinstance(v, str)},
            "item_urls": a.get("item_urls") or [],
            "download_info": a.get("download_info") or {},
            "tem_subtitle_template": bool(e.get("subtitle_template")),
            "subtitle_template": e.get("subtitle_template") or None,
            "tem_template": bool(e.get("template")),
            "template": e.get("template") or None,
            "author": (e.get("author") or {}).get("name", "") if isinstance(e.get("author"), dict) else "",
        }

print(f"total de recursos únicos no cache: {len(recursos)}")

# separa por grupo
grupos_idx = {g: [] for g in GRUPOS}
for r in recursos.values():
    for g, spec in GRUPOS.items():
        if spec["categorias"] and r["categoria_id"] in spec["categorias"]:
            grupos_idx[g].append(r)
        elif spec["tipos"] and r["effect_type"] in spec["tipos"]:
            grupos_idx[g].append(r)

resumo = {}
for g, itens in grupos_idx.items():
    resumo[g] = len(itens)
    (CAT / g).mkdir(parents=True, exist_ok=True)
    print(f"{g}: {len(itens)} modelos")

# salva catálogo completo (com templates de legenda inteiros)
CAT.mkdir(exist_ok=True)
(CAT / "catalogo-completo.json").write_text(
    json.dumps({"grupos": resumo, "recursos": list(recursos.values())},
               ensure_ascii=False), encoding="utf-8")
# templates de legenda em arquivos próprios
tdir = CAT / "legendas" / "templates"
tdir.mkdir(parents=True, exist_ok=True)
n_tpl = 0
for r in grupos_idx["legendas"]:
    if r["subtitle_template"]:
        safe = re.sub(r"[^\w\-]", "_", r["titulo"])[:50] or "sem_nome"
        (tdir / f"{r['id']}_{safe}.json").write_text(
            json.dumps(r["subtitle_template"], ensure_ascii=False, indent=1), encoding="utf-8")
        n_tpl += 1
print(f"subtitle_templates de legendas salvos: {n_tpl}")

# baixa covers (webp) por grupo
def baixa(r):
    url = r["cover"].get("origin") or r["cover"].get("large") or r["cover"].get("small") or r["cover"].get("medium")
    if not url:
        return (r["id"], None, "sem url")
    safe = re.sub(r"[^\w\-]", "_", r["titulo"])[:48] or "sem_nome"
    dest = CAT / next(g for g, itens in grupos_idx.items() if r in itens) / f"{r['id']}_{safe}.webp"
    if dest.exists() and dest.stat().st_size > 1000:
        return (r["id"], str(dest), "cache")
    try:
        req = Request(url, headers=UA)
        buf = urlopen(req, timeout=20).read()
        if len(buf) < 500:
            return (r["id"], None, f"pequeno {len(buf)}B")
        dest.write_bytes(buf)
        return (r["id"], str(dest), f"ok {len(buf)//1024}KB")
    except Exception as e:
        return (r["id"], None, str(e)[:40])

total_imgs = 0
falhas = 0
for g, itens in grupos_idx.items():
    ok_g = 0
    with ThreadPoolExecutor(max_workers=10) as ex:
        futs = [ex.submit(baixa, r) for r in itens]
        for f in as_completed(futs):
            _, dest, status = f.result()
            if dest:
                ok_g += 1
            else:
                falhas += 1
    total_imgs += ok_g
    print(f"{g}: imagens {ok_g}/{len(itens)}")
print(f"TOTAL imagens: {total_imgs} · falhas: {falhas}")

# legendas moram na skill capcut-text-captions (casa das legendas)
import shutil
outra = Path(r"C:\Users\Conectare\Downloads\video\.agents\skills\capcut-text-captions\evidence\catalogo-visual")
outra.mkdir(parents=True, exist_ok=True)
if (CAT / "legendas").exists():
    if (outra / "legendas").exists():
        shutil.rmtree(outra / "legendas")
    shutil.move(str(CAT / "legendas"), str(outra / "legendas"))
if (CAT / "legendas.html").exists():
    shutil.move(str(CAT / "legendas.html"), str(outra / "legendas.html"))
print("legendas -> capcut-text-captions/evidence/catalogo-visual/")
