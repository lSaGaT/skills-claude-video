---
name: capcut-timeline-editing
description: Editar a timeline de um projeto CapCut por draft JSON — adicionar mídia (vídeo/imagem/áudio), cortar/splitar segmentos, trim, mover, velocidade, transform (escala/posição/rotação/alpha/flip) e volume. Use quando o pedido envolver montar ou ajustar a sequência de clipes de um projeto CapCut sem abrir a interface. Requer a skill capcut-draft-core para I/O base.
---
> **Uso global (qualquer pasta):** os caminhos absolutos funcionam de qualquer
> diretório — `python "C:\Users\Conectare\.claude\skills\capcut-timeline-editing\scripts\<modulo>.py" ...`.
> Módulos disponíveis nesta skill: draft_io.py timeline_ops.py.
> Para importar como biblioteca, antes faça `sys.path.insert(0, r"C:\Users\Conectare\.claude\skills\capcut-timeline-editing\scripts")`.


# CapCut Timeline Editing

Operações de timeline sobre `draft_content.json` com `scripts/timeline_ops.py`
(da skill capcut-draft-core). Todas as durações/posições em **microssegundos**.

## Adicionar mídia

```python
from timeline_ops import add_media
seg = add_media(draft, r"C:\clips\video1.mp4", kind="video")          # fim da track
seg = add_media(draft, r"C:\clips\musica.mp3", kind="audio", volume=0.5)
add_media(draft, path, kind="video", start=us(3.0))                   # posição explícita
add_media(draft, path, kind="video", trim=(us(1.0), us(2.5)))         # (source_start, dur)
```

- `kind="video"` cobre vídeos E imagens (material `type: "photo"` para imagens).
- A duração real é obtida via `probe_media()` (usa o **ffprobe embutido do CapCut**,
  `Apps\9.7.0.4153\ffprobe.exe`; fallback para `ffprobe` do PATH).
- A track é criada se não existir; segmentos são ordenados por `start`.
- Cada segmento ganha um companion `speeds` (velocidade 1.0) — padrão do app.

## Cortar (split), trim, mover, apagar

```python
from timeline_ops import split_segment, trim_segment, move_segment, delete_segment
left, right = split_segment(draft, seg_id, at_us=us(4.0))   # 1:1 com speed atual
trim_segment(draft, seg_id, new_start=us(1.0), new_end=us(6.5))
move_segment(draft, seg_id, us(10.0))
delete_segment(draft, seg_id)   # remove material primário + companions órfãos
```

- `split_segment` divide `source_timerange` proporcionalmente à velocidade atual e
  mantém companions compartilhados nos dois lados (igual ao comportamento do app).
- `trim` ajusta `source_timerange` na mesma proporção do deslocamento de target.

## Velocidade

```python
from timeline_ops import set_speed
set_speed(draft, seg_id, 2.0)   # 2x → target_timerange.duration encurta
```

Atualiza o companion `speeds` E `segment.speed`, recalcula `target_timerange`
(mesma fatia de origem) e a `duration` total do draft. Velocidade por curva
(curve speed) ainda não implementada — pendente ground truth do draft real.

## Transform (posição/escala/rotação/alpha/flip)

```python
from timeline_ops import set_transform
set_transform(draft, seg_id, scale=0.9, y=0.05)          # zoom out + desce levemente
set_transform(draft, seg_id, flip_h=True, rotation=45.0, alpha=0.8)
```

Escala/transform do `clip` usam o espaço do app (x/y normalizados; 0 = centro).
Y negativo sobe o clipe na tela (usado nos textos do draft demo).

## Volume

```python
from timeline_ops import set_volume
set_volume(draft, seg_id, 0.4)
```

## CLI rápido (para testes pontuais)

```bash
python scripts/timeline_ops.py add-text <draft_dir> "Ola" --start 0 --duration 3
python scripts/timeline_ops.py add-media <draft_dir> video.mp4 --kind video
python scripts/timeline_ops.py split <draft_dir> <seg_id> --at 2.5
python scripts/timeline_ops.py speed <draft_dir> <seg_id> --value 2.0
python scripts/timeline_ops.py info <draft_dir>
```

## Cuidados

- Segmento não pode ser dividido fora do seu intervalo (`ValueError`).
- `render_index` controla sobreposição entre tracks do mesmo nível — padrões
  seguem o app (texto usa 14000 no demo; confirme num draft real).
- Sempre `validate_draft` após operações e abra no CapCut para conferir.
