# Suíte CapCut — autorais da casa

**8 skills** · [← voltar ao índice](../README.md)

---

## capcut-agent-ipc 🏠

**O que cria:** Controla o CapCut Desktop aberto via IPC nativo (lyra-cli-ipc) — canvas nodes, timeline add-draft, shadow drafts.

**Chaves técnicas:** named pipe vevcreator-lyra-cli-v1-capcut; canvas node create/update/transform/move/duplicate com CAS (--expected-revision); timeline add-draft (append/at+ripple/overwrite, --request-id idempotente); draft shadow create/list/duplicate/import; dry-run antes de escrever; exit code 2 = sem sessão; códigos *_revision_conflict/timeline_cli_busy/outcomeUnknown.

**Origem:** casa (autoral — nascida em produção real)

**Como instalar:** Copie a pasta `capcut-agent-ipc/` deste repo para `~/.claude/skills/` (corpo completo).

---

## capcut-audio 🏠

**O que cria:** Áudio em drafts CapCut por JSON — música/SFX, volume, fades e múltiplas tracks.

**Chaves técnicas:** add_media kind=audio (materials.audios type:music) com trim (start_origem, duração); set_volume; set_fade via companion audio_fades[] (fade_type 0 linear); track_name para multi-track; materials.beats[] p/ alinhar cortes; TTS do CapCut não automatizável por draft.

**Origem:** casa (autoral — nascida em produção real)

**Como instalar:** Copie a pasta `capcut-audio/` deste repo para `~/.claude/skills/` (corpo completo).

---

## capcut-browser 🏠

**O que cria:** Opera o browser gerenciado do agente do CapCut — abrir URL, snapshot acessível, clicar/preencher/rolar.

**Chaves técnicas:** ações open/goto/snapshot/find/type/press/click/check/fill/select/mousewheel; ciclo observação→refs→pageId/snapshotId; stale_snapshot→snapshot novo; command_conflict/outcomeUnknown=nunca repetir; network_permission_required/authentication_required exigem parada.

**Origem:** casa (autoral — nascida em produção real)

**Como instalar:** Copie a pasta `capcut-browser/` deste repo para `~/.claude/skills/` (corpo completo).

---

## capcut-draft-core 🏠

**O que cria:** Ler/validar/criar/editar projetos CapCut (draft_content.json) programaticamente em Python.

**Chaves técnicas:** tempos em microssegundos inteiros; z-stack pela ordem de tracks[]; extra_material_refs (speeds/masks/transitions/audio_fades/material_animations/canvases); texto JSON-in-JSON com styles[].range em bytes UTF-16-LE; common_mask[] (singular) no 9.7; draft_io info/validate/backup/init; new_draft 1080x1920 com backup automático.

**Origem:** casa (autoral — nascida em produção real)

**Como instalar:** Copie a pasta `capcut-draft-core/` deste repo para `~/.claude/skills/` (corpo completo).

---

## capcut-effects-filters 🏠

**O que cria:** Efeitos visuais em drafts CapCut — transições, efeitos de cena, filtros, animações in/out/combo, cor e matting.

**Chaves técnicas:** add_transition (segmento à direita do corte); add_animation in/out/combo (material_animations[]); add_sticker (Cache\artistEffect); set_matting (feather/expansion/reverse); add_chroma; add_adjust (brightness/contrast/saturation/temperature/hue -1..1); catalog_local.py search (~213 itens, resolve ids numéricos por nome); regra: nunca inventar id.

**Origem:** casa (autoral — nascida em produção real)

**Como instalar:** Copie a pasta `capcut-effects-filters/` deste repo para `~/.claude/skills/` (corpo completo).

---

## capcut-media-export 🏠

**O que cria:** Probe de mídia e exportação do CapCut 9.7 — ffmpeg/ffprobe embutidos + automação de export por loop de visão.

**Chaves técnicas:** probe_media (ffprobe embutido); export_ui.py state/shot/export-editor/click/wait-file (máquina de estados do diálogo de export); paywall Pro → strip_pro.py numa cópia do draft; render só existe após o export; composição ffmpeg 100% local a partir do draft; vesdk.ini (crf 17, preset 4).

**Origem:** casa (autoral — nascida em produção real)

**Como instalar:** Copie a pasta `capcut-media-export/` deste repo para `~/.claude/skills/` (corpo completo).

---

## capcut-text-captions 🏠

**O que cria:** Texto e legendas em drafts CapCut — segmentos estilizados, estilos por trecho e importação de SRT.

**Chaves técnicas:** add_text (track text, render_index 14000, borda/sombra/fundo padrão); set_text_styles com conversão char→byte UTF-16-LE automática; import_srt (timing + offset, multi-linha preservada); cores fill RGB float 0-1 e hex #RRGGBB(AA); validação de ranges UTF-16 no validate_draft.

**Origem:** casa (autoral — nascida em produção real)

**Como instalar:** Copie a pasta `capcut-text-captions/` deste repo para `~/.claude/skills/` (corpo completo).

---

## capcut-timeline-editing 🏠

**O que cria:** Editar timeline de draft CapCut por JSON — mídia, split, trim, velocidade, transform e volume.

**Chaves técnicas:** add_media (vídeo/foto/áudio, trim source_timerange, probe_media p/ duração real); split_segment proporcional à speed mantendo companions; trim_segment; set_speed (recalcula target_timerange e duration); set_transform (scale/x/y/rotation/alpha/flip, x/y normalizados, 0=centro); delete_segment com limpeza de companions órfãos.

**Origem:** casa (autoral — nascida em produção real)

**Como instalar:** Copie a pasta `capcut-timeline-editing/` deste repo para `~/.claude/skills/` (corpo completo).

