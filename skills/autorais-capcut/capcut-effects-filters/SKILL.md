---
name: capcut-effects-filters
description: Efeitos visuais em projetos CapCut por draft JSON — transições entre clipes, efeitos de cena, filtros de cor, animações de entrada/saída/loop e ajustes de cor (brilho/contraste/saturação). Use quando o pedido envolver efeitos ou transições em projeto CapCut. Ids de biblioteca do CapCut devem vir de um draft real criado no app ou do catálogo local Cache\effect.
---
> **Uso global (qualquer pasta):** os caminhos absolutos funcionam de qualquer
> diretório — `python "C:\Users\Conectare\.claude\skills\capcut-effects-filters\scripts\<modulo>.py" ...`.
> Módulos disponíveis nesta skill: draft_io.py timeline_ops.py effect_ops.py catalog_local.py.
> Para importar como biblioteca, antes faça `sys.path.insert(0, r"C:\Users\Conectare\.claude\skills\capcut-effects-filters\scripts")`.


# CapCut Effects & Filters

Módulo `scripts/effect_ops.py` (imports de `timeline_ops._find_segment` — rodar
do diretório `scripts/`).

## Onde cada coisa vive no draft

| Recurso | Track | Material | Ligação |
|---|---|---|---|
| Transição | (entre segmentos) | `materials.transitions[]` | `extra_material_refs` do segmento **da direita** do corte |
| Efeito de cena | `type: "effect"` | `materials.video_effects[]` (`type: "video_effect"`) | `material_id` do segmento na track effect |
| Filtro | `type: "filter"` | **`materials.effects[]`** (`type: "filter"`) | `material_id` do segmento na track filter |
| Animação | (companion) | `materials.material_animations[]` | `extra_material_refs` do segmento |
| Ajuste de cor | (companion) | `color_adjustments[]` (experimental, sem sample real) | `extra_material_refs` do segmento |

**Ground truth 9.7** (draft "1104"): filtros (color grade) ficam em
`materials.effects[]` — a categoria `video_effects[]` é dos efeitos de cena.
Ids reais são **numéricos** ("7426269857357763089") com `path` para
`Cache\effect\<id>\<md5>`.

## Catálogo local de recursos (use NOMES, não ids decorados)

Os ids de efeito/filtro/animação/sticker são **numéricos**. O script
`catalog_local.py` funde os recursos aplicados nos seus drafts locais + os
bundles em `Cache\effect` num catálogo pesquisável
(`evidence\local-catalog.json`, ~213 itens):

```bash
python scripts/catalog_local.py build            # (re)constroi
python scripts/catalog_local.py search sangue --kind animation
python scripts/catalog_local.py search pet --kind sticker
python scripts/catalog_local.py search "Verde floresta" --kind filter
```

```python
from catalog_local import search
f = search("Verde floresta", kind="filter")[0]   # {'resource_id': '7701534427658063156', 'name': ...}
```

## Transição

```python
from effect_ops import add_transition
add_transition(draft, right_seg_id, transition_id, duration_us=us(0.5))
```

A transição pertence ao segmento à **direita do corte** (padrão do app).
⚠️ Único recurso SEM amostra real do 9.7 ainda — o `transition_id` segue o
formato público; valide num projeto onde você aplicar uma transição.

## Stickers (shape real 9.7)

```python
from effect_ops import add_sticker
stk = search("Pet Meme", kind="sticker")[0]
add_sticker(draft, stk["resource_id"], stk["name"], us(0.0), us(3.0),
            scale=0.8, y=0.6)
```

Track `sticker`, `render_index: 14000`, `source_timerange: null` (observado
real). Precisa do bundle já baixado (o sticker abre se `Cache\artistEffect\<id>`
existir; use ids do catálogo local, que só lista recursos já presentes).

## Animações — entrada / saída / combinação (shape real 9.7)

```python
from effect_ops import add_animation
anim = search("assombrado", kind="animation")[0]
add_animation(draft, seg_id, "in", anim["resource_id"], anim["name"],
              duration_us=us(2.0))
add_animation(draft, seg_id, "out", anim_out["resource_id"], anim_out["name"],
              duration_us=us(1.0))
add_animation(draft, seg_id, "combo", combo_id, combo_name, duration_us=us(3.0))
```

Material `material_animations[]` (`type: "sticker_animation"`, um por segmento,
`multi_language_current: "none"`) com entradas `{id: <resource_id>, type:
"in"|"out"|"combo", start (relativo ao segmento; "out" = dur_seg - dur_anim),
duration, path, resource_id, name, panel:"video", material_type:"video",...}`.
Uma animação por tipo (substitui a anterior do mesmo tipo).

## Remover plano de fundo (matting) — parcial

```python
from effect_ops import set_matting
set_matting(draft, seg_id, enable=True, feather=0.1, expansion=0.05, reverse=False)
```

Escreve o objeto `matting` **do material de vídeo** (shape real do 9.7: `flag`,
`path`, `strokes`, `feather`, `expansion`, `reverse`, `mask_video_path`...).
**A segmentação IA do sujeito roda dentro do app** (modelo local + OpenVINO);
por arquivo, escrevemos a estrutura/parâmetros e o app recalcula a máscara ao
abrir. Fundos VERDES/azuis: use `add_chroma` (chroma key) — formato público,
experimental no 9.7.

## Ajustes de cor

```python
from effect_ops import add_adjust
add_adjust(draft, seg_id, brightness=0.1, contrast=0.0, saturation=0.15,
           temperature=0.0, hue=0.0)
```

Valores normalizados (-1..1) — iguais aos sliders do app. Os presets de ajuste
locais do CapCut ficam em `User Data\Resources\DefaultAdjustBundle\` (39 bundles
catalogados em `evidence\catalogs\effect-bundles.md` — formato `config.json`
com grafo `effect.Link`, Lua + `.material`/`.xshader`).

## Ids de biblioteca — de onde tirar

1. **Catálogo local** (`catalog_local.py search`) — funde recursos dos seus
   drafts + bundles do cache; resolve por nome.
2. **Draft real**: aplique o recurso no app, salve, leia o id do
   `draft_content.json` (observação direta, 100% confiável).
3. Bundles: `User Data\Cache\effect\<id>\<md5>\config.json` (nome técnico) e
   `Cache\artistEffect\<id>\<md5>\` (stickers, sem nome — só via drafts).
4. Features/ids AI: `User Data\Config\getCfg` → `block_config`
   (`evidence\catalogs\feature-ids.md`).

Regra: **nunca invente id** — só use ids presentes no catálogo local ou lidos
de um draft real.

⚠️ Id inválido → o app geralmente mostra o item como faltando (não quebra o
projeto), mas evite inventar ids.
