# gerar-galerias.py — galerias HTML navegáveis do catálogo visual (imagem + id + nome + dados)
# Entrada: catalogo/catalogo-completo.json + catalogo/<grupo>/*.webp
# Saída:   catalogo/<grupo>.html (dark theme da casa) + catalogo/INDICE.html
import json
import re
import sys
import io
from pathlib import Path

sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding="utf-8", errors="replace")
RAIZ = Path(r"C:\Users\Conectare\Downloads\video\.agents\skills\capcut-effects-filters\evidence")
CAT = RAIZ / "catalogo-visual"

data = json.loads((CAT / "catalogo-completo.json").read_text(encoding="utf-8"))
por_id = {r["id"]: r for r in data["recursos"]}
GRUPOS = ["legendas", "stickers", "efeitos", "animacoes-entrada", "animacoes-saida", "animacoes-combinacao", "animacoes-loop"]
TITULOS = {
    "legendas": "MODELOS DE LEGENDA (painel Legenda)",
    "stickers": "STICKERS",
    "efeitos": "EFEITOS DE CENA + FILTROS",
    "animacoes-entrada": "ANIMAÇÕES — ENTRADA",
    "animacoes-saida": "ANIMAÇÕES — SAÍDA",
    "animacoes-combinacao": "ANIMAÇÕES — COMBINAÇÃO (estilo transição)",
    "animacoes-loop": "ANIMAÇÕES — LOOP",
}

CSS = """body{background:#0b0e22;color:#fff;font-family:Arial,Helvetica,sans-serif;margin:0;padding:24px}
h1{color:#ffd400;font-size:22px} .sub{color:#b9b6d8;font-size:13px;margin-bottom:18px}
.grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(150px,1fr));gap:12px}
.card{background:#0c0f24;border:1px solid #2a2f55;border-radius:10px;overflow:hidden}
.card img{width:100%;height:150px;object-fit:cover;background:#141838;display:block}
.card .t{padding:8px;font-size:11px;line-height:1.3}
.card .id{color:#7b5cff;font-size:9px;word-break:break-all}
.card .cat{color:#ff4fa3;font-size:9px}
a{color:#3f7dff;text-decoration:none} nav{margin-bottom:16px;font-size:13px} nav a{margin-right:12px}"""

def esc(s):
    return (s or "").replace("&", "&amp;").replace("<", "&lt;").replace(">", "&gt;")

def pasta_de(grupo):
    return (Path(r"C:\Users\Conectare\Downloads\video\.agents\skills\capcut-text-captions\evidence\catalogo-visual") / grupo) if grupo == "legendas" else (CAT / grupo)

def galeria(grupo):
    pasta = pasta_de(grupo)
    imgs = sorted(pasta.glob("*.webp"))
    cards = []
    for img in imgs:
        eid = img.stem.split("_")[0]
        r = por_id.get(eid, {})
        tpl = ""
        if grupo == "legendas" and r.get("tem_subtitle_template"):
            nome_tpl = re.sub(r"[^\w\-]", "_", r["titulo"] or "sem_nome")[:50]
            tpl = f'<div class="cat"><a href="legendas/templates/{eid}_{esc(nome_tpl)}.json">template JSON</a></div>'
        cat = esc(r.get("categoria_nome") or "")
        tp = f"type {r.get('effect_type')}" if r.get("effect_type") is not None else ""
        cards.append(
            prefixo = '../../capcut-text-captions/evidence/catalogo-visual/' if grupo == 'legendas' else ''
        f'<div class="card"><img src="{prefixo}{grupo}/{img.name}" loading="lazy">'
            f'<div class="t"><b>{esc(r.get("titulo") or img.stem)}</b><br>'
            f'<span class="cat">{cat} {tp}</span><br>'
            f'<span class="id">{eid}</span>{tpl}</div></div>'
        )
    html = f"""<!doctype html><html><head><meta charset="utf-8"><title>{TITULOS[grupo]}</title>
<style>{CSS}</style></head><body>
<h1>{TITULOS[grupo]}</h1>
<div class="sub">{len(imgs)} modelos com imagem · catálogo REA do painel do CapCut (06/11/2026) · ids prontos p/ aplicar no draft</div>
<div class="grid">{''.join(cards)}</div></body></html>"""
    (pasta_de(grupo).parent / f"{grupo}.html").write_text(html, encoding="utf-8")
    return len(imgs)

nav_links = " ".join(f'<a href="{g}.html">{TITULOS[g].split(" — ")[-1].split(" (")[0]}</a>' for g in GRUPOS)
contagens = {}
for g in GRUPOS:
    contagens[g] = galeria(g)
    print(f"{g}.html: {contagens[g]} cards")

indice = f"""<!doctype html><html><head><meta charset="utf-8"><title>CATÁLOGO CAPCUT — REA</title>
<style>{CSS}</style></head><body><h1>CATÁLOGO VISUAL DO CAPCUT (REA)</h1>
<div class="sub">Extraído do painel de recursos do app em 06/11/2026 — cada modelo com imagem de referência.</div>
<nav>{nav_links}</nav>
<ul>{''.join(f'<li><a href="{g}.html">{TITULOS[g]}</a> — {contagens[g]} modelos</li>' for g in GRUPOS)}</ul>
<p class="sub">Definições estruturais dos modelos de legenda: <a href="legendas/templates/">legendas/templates/</a> · catálogo bruto: catalogo-completo.json</p>
</body></html>"""
(CAT / "INDICE.html").write_text(indice, encoding="utf-8")
print("INDICE.html ok")
