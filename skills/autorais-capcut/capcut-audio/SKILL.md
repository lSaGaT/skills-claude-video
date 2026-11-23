---
name: capcut-audio
description: Áudio em projetos CapCut por draft JSON — adicionar música/SFX, volume, fade in/out, múltiplas tracks de áudio. Use quando o pedido envolver trilha sonora, volume ou fades de um projeto CapCut. Efeitos de áudio de biblioteca e TTS requerem ids de catálogo ou o app aberto (ver limitações).
---
> **Uso global (qualquer pasta):** os caminhos absolutos funcionam de qualquer
> diretório — `python "C:\Users\Conectare\.claude\skills\capcut-audio\scripts\<modulo>.py" ...`.
> Módulos disponíveis nesta skill: draft_io.py timeline_ops.py.
> Para importar como biblioteca, antes faça `sys.path.insert(0, r"C:\Users\Conectare\.claude\skills\capcut-audio\scripts")`.


# CapCut Audio

## Adicionar áudio

```python
from timeline_ops import add_media
seg = add_media(draft, r"C:\audio\musica.mp3", kind="audio", volume=0.4)
seg = add_media(draft, sfx_path, kind="audio", start=us(10.0),
                trim=(us(2.0), us(1.5)))   # fatia do SFX: (start_origem, duracao)
```

Material entra em `materials.audios[]` (`type: "music"` para arquivo local).
`has_audio` dos vídeos é preservado — um clipe de vídeo com áudio nativo não
precisa de track de áudio separada (o app toca o embutido; separar fala/música
usa `vocal_separations[]`, escrito pelo app).

## Volume e fades

```python
from timeline_ops import set_volume, set_fade
set_volume(draft, seg_id, 0.35)
set_fade(draft, seg_id, fade_in=us(1.0), fade_out=us(1.5))  # microssegundos
```

`set_fade` cria/atualiza o companion `audio_fades[]` ligado ao segmento via
`extra_material_refs` (padrão do app). `fade_type: 0` = linear.

## Múltiplas tracks

`add_media(..., track_name="BGM")` nomeia a track; chamadas seguintes reutilizam
a track existente de mesmo tipo/ordem. Z-order entre tracks de áudio segue a
ordem no array `tracks[]` (reindexado se `track_index` for passado).

## Efeitos de áudio de biblioteca (limitado)

Efeitos de cena de áudio (reverb, echo, "personagem" etc.) existem como
`video_effects` com `apply_target_type` de áudio — **mas os ids são de catálogo
remoto/local** (`User Data\Cache\effect\<id>\`). Ainda sem catálogo verificado
do 9.7: só use ids lidos de um draft real criado no app. O formato é o mesmo de
`add_scene_effect` (skill capcut-effects-filters).

## TTS (texto→fala) — não automatizável por draft

TTS do CapCut (`speechsdk.dll`, `Resources\tts\`, voz local/nuvem) roda no app e
gera um **material de áudio** com `type` específico + `tts` payload. Geração por
draft JSON requer os payloads exatos (ground truth pendente). Alternativa hoje:
gere áudio fora (stt/tts externos) e adicione como música local.

## Beat/marcações

`materials.beats[]` guarda detecção de ritmo feita pelo app — geração manual
pendente de ground truth. Edição por beat hoje: leia `beats[]` de um projeto
criado no app e alinhe cortes nesses timestamps.
