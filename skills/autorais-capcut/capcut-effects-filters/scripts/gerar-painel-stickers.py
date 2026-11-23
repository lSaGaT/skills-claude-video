# gerar-painel-stickers.py — painel de stickers estilo CapCut, v2:
# - busca FUNCIONAL: por palavra (todas as palavras), sem acento, inclui id e categoria;
#   a busca ignora o grupo ativo (mostra todos os matches)
# - tudo acessível: sem toggle escondendo massa — cards sem preview recebem badge
# - sidebar: categorias de ADESIVOS no topo (com preview real), "Estilos de texto
#   (idiomas)" embaixo, "Todos"
import json
import sys
import io
import unicodedata
from collections import Counter
from pathlib import Path

sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding="utf-8", errors="replace")
SKILL = Path(r"C:\Users\Conectare\Downloads\video\.agents\skills\capcut-effects-filters\evidence\catalogo-visual")

data = json.loads((SKILL / "catalogo-completo.json").read_text(encoding="utf-8"))
por_id = {r["id"]: r for r in data["recursos"]}

ADESIVO_CATS = {"Populares", "NOVO", "Clássico", "Retrô", "Exitos", "Florescer",
                "Meme de animal", "Free Fire", "B.Duck", "Black Friday",
                "Tempero de abóbora", "Nailoong", "Ícones", "Formas", "Adesivos"}

itens = []
for f in sorted((SKILL / "stickers").glob("*.webp")):
    eid = f.stem.split("_")[0]
    r = por_id.get(eid, {})
    cat = r.get("categoria_nome") or "Outros"
    png = f.with_suffix(".png")
    tem_png = png.exists() and png.stat().st_size > 1500
    itens.append({
        "id": eid,
        "titulo": r.get("titulo") or f.stem,
        "cat": cat,
        "img": f"stickers/{png.name}" if tem_png else f"stickers/{f.name}",
        "preview": f.stat().st_size >= 3000 or tem_png,
        "eh_adesivo": cat in ADESIVO_CATS or (cat == "Outros" and f.stat().st_size >= 3000),
    })

sem_acento = lambda s: "".join(c for c in unicodedata.normalize("NFD", (s or "").lower()) if unicodedata.category(c) != "Mn")
for i in itens:
    i["chave"] = sem_acento(i["titulo"] + " " + i["cat"] + " " + i["id"])

adesivos = [i for i in itens if i["eh_adesivo"]]
estilos = [i for i in itens if not i["eh_adesivo"]]
cnt_a = Counter(i["cat"] for i in adesivos)
cnt_e = Counter(i["cat"] for i in estilos)

def sidebar(cnt, titulo, cls):
    rows = "".join(
        f'<div class="cat" data-grupo="{cls}" data-cat="{c}">{c} <span>{cnt[c]}</span></div>'
        for c in sorted(cnt, key=lambda c: (-cnt[c], c)))
    return f'<div class="grupo">{titulo}</div>{rows}'

cards = "".join(
    f'<div class="card" data-chave="{i["chave"]}" data-grupo="{"a" if i["eh_adesivo"] else "e"}"'
    f' data-cat="{i["cat"]}" title="{i["titulo"]} · id {i["id"]}">'
    f'<img src="{i["img"]}" loading="lazy">'
    + ('' if i["preview"] else '<div class="sem">sem preview</div>')
    + f'<div class="id">{i["id"]}</div></div>'
    for i in itens
)

html = """<!doctype html><html><head><meta charset="utf-8"><title>Stickers — painel CapCut</title>
<style>
*{box-sizing:border-box} body{margin:0;background:#17171c;color:#e8e8ea;font-family:'Segoe UI',Arial,sans-serif;display:flex;height:100vh}
.side{width:230px;background:#1e1e24;border-right:1px solid #2a2a32;padding:12px 8px;overflow-y:auto;flex-shrink:0}
.busca{width:100%;background:#2a2a32;border:1px solid #3a3a44;border-radius:8px;color:#e8e8ea;padding:8px 10px;font-size:13px;margin-bottom:10px;outline:none}
.grupo{font-size:10px;text-transform:uppercase;color:#6a6a75;padding:10px 12px 4px;letter-spacing:.08em}
.cat{padding:7px 12px;border-radius:8px;font-size:13px;cursor:pointer;color:#c9c9cf;display:flex;justify-content:space-between}
.cat span{color:#6a6a75;font-size:11px}
.cat:hover{background:#2a2a32}
.cat.ativa{color:#3ec6ff;background:#2a2a32}
.main{flex:1;padding:16px 20px;overflow-y:auto}
.barra{display:flex;align-items:center;gap:14px;margin-bottom:12px;flex-wrap:wrap}
.barra h1{font-size:16px;margin:0;color:#fff}
.barra .info{color:#6a6a75;font-size:12px}
.grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(120px,1fr));gap:10px}
.card{background:#26262e;border-radius:10px;overflow:hidden;position:relative;cursor:pointer}
.card img{width:100%;aspect-ratio:1/1;object-fit:cover;display:block;background:#1e1e24}
.card .sem{position:absolute;top:6px;left:6px;font-size:9px;background:#3a3a44cc;color:#c9c9cf;padding:2px 6px;border-radius:6px}
.card .id{position:absolute;left:0;right:0;bottom:0;font-size:8px;color:#9a9aa5;background:linear-gradient(transparent,rgba(0,0,0,.85));padding:14px 6px 4px;opacity:0;transition:.15s}
.card:hover .id{opacity:1}
.card.esconde{display:none}
</style></head><body>
<div class="side">
  <input class="busca" id="busca" placeholder="Pesquisar sticker (nome ou id)">
  <div class="cat ativa" data-grupo="t" data-cat="__todos">Todos <span>__TOTAL__</span></div>
  __SIDEBAR__
</div>
<div class="main">
  <div class="barra">
    <h1>Stickers</h1>
    <span class="info">__N_ADES__ adesivos · __N_ESTILOS__ estilos de texto · clique copia o id</span>
  </div>
  <div class="grid" id="grid">__CARDS__</div>
</div>
<script>
let cat="__todos", grupo="t", busca="";
const cards=[...document.querySelectorAll(".card")];
function aplica(){
  const termos=busca.split(/\\s+/).filter(Boolean);
  for(const c of cards){
    const okCat=cat==="__todos"||c.dataset.cat===cat;
    const okGrupo=grupo==="t"||c.dataset.grupo===grupo;
    const okBusca=!termos.length||termos.every(t=>c.dataset.chave.includes(t));
    c.classList.toggle("esconde",!(okCat&&okGrupo&&okBusca));
  }
}
document.querySelectorAll(".cat").forEach(el=>el.onclick=()=>{
  document.querySelectorAll(".cat").forEach(x=>x.classList.remove("ativa"));
  el.classList.add("ativa");cat=el.dataset.cat;grupo=el.dataset.grupo;aplica();});
document.getElementById("busca").oninput=e=>{busca=e.target.value;aplica();};
cards.forEach(c=>c.onclick=()=>{navigator.clipboard&&navigator.clipboard.writeText(c.querySelector(".id").textContent);const i=c.querySelector(".id");i.style.color="#3ec6ff";setTimeout(()=>i.style.color="",600);});
</script></body></html>"""
html = (html
        .replace("__SIDEBAR__", sidebar(cnt_a, "Adesivos", "a") + sidebar(cnt_e, "Estilos de texto (idiomas)", "e"))
        .replace("__CARDS__", cards)
        .replace("__TOTAL__", str(len(itens)))
        .replace("__N_ADES__", str(len(adesivos)))
        .replace("__N_ESTILOS__", str(len(estilos))))
(SKILL / "stickers.html").write_text(html, encoding="utf-8")
print(f"stickers.html v2: {len(itens)} cards ({len(adesivos)} adesivos + {len(estilos)} estilos de texto)")
print(f"adesivos por cat: {dict(cnt_a.most_common(10))}")
