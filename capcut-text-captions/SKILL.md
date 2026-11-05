---
name: capcut-text-captions
description: Trabalhar texto e legendas em projetos CapCut por draft JSON — adicionar segmentos de texto estilizado, estilos por trecho (bold/cor/tamanho) com ranges UTF-16 corretos, importar SRT como legendas. Use quando o pedido envolver texto, títulos, legendas ou SRT em projeto CapCut. Auto-caption/OCR ainda requer o app aberto (não automatizável por draft JSON).
---
> **Uso global (qualquer pasta):** os caminhos absolutos funcionam de qualquer
> diretório — `python "C:\Users\Conectare\.claude\skills\capcut-text-captions\scripts\<modulo>.py" ...`.
> Módulos disponíveis nesta skill: draft_io.py timeline_ops.py text_ops.py.
> Para importar como biblioteca, antes faça `sys.path.insert(0, r"C:\Users\Conectare\.claude\skills\capcut-text-captions\scripts")`.


# CapCut Text & Captions

Texto no CapCut é a **armadilha nº 1 do formato**: o conteúdo vive em
`materials.texts[].content` — uma *string* JSON-in-JSON — e os `styles[].range`
são **byte offsets UTF-16-LE**, não posições de caracteres. "Olá" tem 3 chars /
6 bytes; um emoji tem 1 char / 4 bytes. Hand-edit errado = texto some na tela.

## Adicionar texto

```python
from timeline_ops import add_text
seg = add_text(draft, "Título principal", us(0.5), us(3.0),
               font_size=10, color="#FFFFFF", align=1)  # 0=esq 1=centro 2=dir
```

O material recebe os campos padrão do app (borda, sombra, fundo, letter/line
spacing…); o segmento entra na track `text` com `render_index` 14000.

## Estilos por trecho (ranges corretos automaticamente)

```python
from text_ops import set_text_styles
set_text_styles(draft, seg_id, [
    {"start_char": 0, "end_char": 19, "bold": True, "color": [1.0, 0.84, 0.31]},
    {"start_char": 19, "end_char": 22, "bold": False},
])
```

Os helpers convertem char → byte UTF-16 (`.encode("utf-16-le")`) por você.
Cores de `fill` são RGB floats 0–1; cores hex do material (`text_color`) são
`#RRGGBB(AA)`.

## Importar SRT

```python
from text_ops import import_srt
segs = import_srt(draft, r"C:\legenda.srt", font_size=8.0, start_offset=us(0.5))
```

Cada bloco vira um segmento de texto na track `text` com o timing do SRT
(+offset). Multi-linha do bloco é preservada com `\n` no content.

## Edição direta do content (quando necessário)

```python
import json
mat = next(m for m in draft["materials"]["texts"] if m["id"] == material_id)
c = json.loads(mat["content"])
c["text"] = "novo texto"
mat["content"] = json.dumps(c, ensure_ascii=False)
```

⚠️ Ao trocar o texto, **reescreva os `styles[].range`** para caberem nos novos
byte offsets — use `set_text_styles` para não quebrar.

## Fontes

`materials.texts[].font_name` referencia fontes do sistema ou da biblioteca do
CapCut (`User Data\Resources\Font\`, `customFont\`). Fontes da nuvem usam
`font_id`/`resource_id` — sem ground truth do draft real, prefira fontes de
sistema pelo nome.

## O que NÃO dá para fazer por draft JSON

- **Auto-caption / reconhecimento de fala**: roda no app com modelos locais
  (`Resources\AlgorithmModel`, matting em `Cache\effect\...`) e serviços — gere
  legendas fora (stt) e importe via SRT.
- **Efeitos de texto de biblioteca** (bubbles/fancy text): dependem de ids de
  catálogo; ainda sem catálogo local verificado (iterar com draft real).

## Validação

`draft_io.validate_draft` verifica JSON válido dos contents e ranges dentro do
texto em UTF-16 bytes — rode após qualquer edição de texto.
