# Infra & utilidades de mídia

**12 skills** · [← voltar ao índice](../README.md)

---

## ffmpeg

**O que cria:** operações FFmpeg p/ produção de vídeo (conversão, resize, compress, speed, concat).

**Chaves técnicas:** GIF→MP4 (faststart, yuv420p, dimensões pares), scale/pad/crop (force_original_aspect_ratio), tabela CRF (18 master→28 draft), speed via setpts/atempo + chaining atempo p/ >2x, concat demuxer, fade/afade, normalização de screen recording (fps=30), recorte por -ss/-t com re-encode.

**Origem:** OpenMontage · [https://github.com/calesthio/OpenMontage](https://github.com/calesthio/OpenMontage)

**Também em:** OpenMontage (https://github.com/calesthio/OpenMontage) — OpenMontage/.agents/skills/ffmpeg/SKILL.md · OpenMontage (https://github.com/calesthio/OpenMontage) — OpenMontage/.claude/skills/ffmpeg/SKILL.md · claude-code-video-toolkit (https://github.com/digitalsamba/claude-code-video-toolkit) — claude-code-video-toolkit/.claude/skills/ffmpeg/SKILL.md

**Como instalar:** Copie a pasta `skills/infra-midia/ffmpeg/` deste repo para `~/.claude/skills/` (ou `.agents/skills/`, conforme seu agente). Corpo de origem: https://github.com/calesthio/OpenMontage.

**Pasta no repo:** `skills/infra-midia/ffmpeg/`

---

## media-use

**O que cria:** resolve/cria qualquer mídia p/ HyperFrames: música, SFX, imagens, logos, VO, avatar, transcript, cutout, grades (HeyGen ou ferramentas locais gratuitas).

**Chaves técnicas:** media-use resolve --type/--intent com ledger; HeyGen (catálogo 10k músicas, voice clone, lipsync, ai-clipping) vs free local (MusicGen, Kokoro TTS, Parakeet/whisper transcribe, remove-background, media-treatment grades/LUTs); mixing (fades, ducking, buses); regra "offer once, never add silently".

**Origem:** hyperframes

**Também em:** OpenMontage (https://github.com/calesthio/OpenMontage) — OpenMontage/.agents/skills/media-use/SKILL.md

**Como instalar:** Copie a pasta `skills/infra-midia/media-use/` deste repo para `~/.claude/skills/` (ou `.agents/skills/`, conforme seu agente). Corpo de origem: `editor-chefe/skills/hyperframes`.

**Pasta no repo:** `skills/infra-midia/media-use/`

---

## playwright-recording

**O que cria:** Grava interações do browser como vídeo (Playwright recordVideo) para virar footage de demos.

**Chaves técnicas:** recordVideo por context com viewport/size, slowMo p/ desacelerar ações, padrões de gravação (form submit, navegação multipágina, scroll suave, login flow), cursor fake via CSS injetado (.playwright-cursor com estado de clique), viewport mobile 390x844.

**Origem:** OpenMontage · [https://github.com/calesthio/OpenMontage](https://github.com/calesthio/OpenMontage)

**Também em:** OpenMontage (https://github.com/calesthio/OpenMontage) — OpenMontage/.agents/skills/playwright-recording/SKILL.md · OpenMontage (https://github.com/calesthio/OpenMontage) — OpenMontage/.claude/skills/playwright-recording/SKILL.md · claude-code-video-toolkit (https://github.com/digitalsamba/claude-code-video-toolkit) — claude-code-video-toolkit/.claude/skills/playwright-recording/SKILL.md

**Como instalar:** Copie a pasta `skills/infra-midia/playwright-recording/` deste repo para `~/.claude/skills/` (ou `.agents/skills/`, conforme seu agente). Corpo de origem: https://github.com/calesthio/OpenMontage.

**Pasta no repo:** `skills/infra-midia/playwright-recording/`

---

## video-download

**O que cria:** Baixa vídeo/áudio/legendas de YouTube e +1000 sites com yt-dlp direto, sem API key.

**Chaves técnicas:** -f "bestvideo[height<=N]+bestaudio" com --merge-output-format mp4, -x --audio-format mp3, --write-subs --skip-download, --dump-json (metadados sem download), -F lista de formatos, template -o %(title)s.

**Origem:** OpenMontage · [https://github.com/calesthio/OpenMontage](https://github.com/calesthio/OpenMontage)

**Também em:** OpenMontage (https://github.com/calesthio/OpenMontage) — OpenMontage/.agents/skills/video-download/SKILL.md · OpenMontage (https://github.com/calesthio/OpenMontage) — OpenMontage/.claude/skills/video-download/SKILL.md

**Como instalar:** Copie a pasta `skills/infra-midia/video-download/` deste repo para `~/.claude/skills/` (ou `.agents/skills/`, conforme seu agente). Corpo de origem: https://github.com/calesthio/OpenMontage.

**Pasta no repo:** `skills/infra-midia/video-download/`

---

## video-edit

**O que cria:** Edição local com ffmpeg — trim, concat, resize, speed, overlay, compress e conversão.

**Chaves técnicas:** trim -ss/-to com -c copy, concat demuxer (list.txt), scale+pad 1080x1920 TikTok/IG/YouTube, speed setpts+atempo, extrair/substituir áudio, filter_complex overlay de logo (W-w-10:10), CRF 23, presets por plataforma.

**Origem:** OpenMontage · [https://github.com/calesthio/OpenMontage](https://github.com/calesthio/OpenMontage)

**Também em:** OpenMontage (https://github.com/calesthio/OpenMontage) — OpenMontage/.agents/skills/video-edit/SKILL.md · OpenMontage (https://github.com/calesthio/OpenMontage) — OpenMontage/.claude/skills/video-edit/SKILL.md

**Como instalar:** Copie a pasta `skills/infra-midia/video-edit/` deste repo para `~/.claude/skills/` (ou `.agents/skills/`, conforme seu agente). Corpo de origem: https://github.com/calesthio/OpenMontage.

**Pasta no repo:** `skills/infra-midia/video-edit/`

---

## video-understand

**O que cria:** Entende vídeo localmente com extração de frames (ffmpeg) + transcrição Whisper offline.

**Chaves técnicas:** understand_video.py com modos scene (select='gt(scene,0.3)'), keyframe (I-frames), interval; --max-frames, --whisper-model tiny..large, JSON com frames+transcript p/ inspeção visual via Read.

**Origem:** OpenMontage · [https://github.com/calesthio/OpenMontage](https://github.com/calesthio/OpenMontage)

**Também em:** OpenMontage (https://github.com/calesthio/OpenMontage) — OpenMontage/.agents/skills/video-understand/SKILL.md · OpenMontage (https://github.com/calesthio/OpenMontage) — OpenMontage/.claude/skills/video-understand/SKILL.md

**Como instalar:** Copie a pasta `skills/infra-midia/video-understand/` deste repo para `~/.claude/skills/` (ou `.agents/skills/`, conforme seu agente). Corpo de origem: https://github.com/calesthio/OpenMontage.

**Pasta no repo:** `skills/infra-midia/video-understand/`

---

## moviepy

**O que cria:** composição Python (moviepy 2.x) p/ sobrepor texto determinístico sobre vídeo IA e montar spots curtos sem Remotion.

**Chaves técnicas:** texto PIL→ImageClip com cache por hash (workaround TextClip que corta ascendentes); timeline ancorada no áudio (timestamps absolutos por cena); lower third com barra de contraste; tint overlay; duck de música MultiplyVolume; gotchas 2.x (with_start, ColorClip RGB)

**Origem:** claude-code-video-toolkit · [https://github.com/digitalsamba/claude-code-video-toolkit](https://github.com/digitalsamba/claude-code-video-toolkit)

**Como instalar:** Copie a pasta `skills/infra-midia/moviepy/` deste repo para `~/.claude/skills/` (ou `.agents/skills/`, conforme seu agente). Corpo de origem: https://github.com/digitalsamba/claude-code-video-toolkit.

**Pasta no repo:** `skills/infra-midia/moviepy/`

---

## runpod

**O que cria:** setup e gestão de endpoints GPU serverless RunPod p/ os 5 modelos do toolkit (edit, upscale, dewatermark, sadtalker, tts).

**Chaves técnicas:** template+endpoint por docker image; workersMin/Max scale-to-zero; transfer Cloudflare R2; GraphQL saveEndpoint; gpuIds fallback multi-GPU; cold/warm start; timeout de fila 5min

**Origem:** claude-code-video-toolkit · [https://github.com/digitalsamba/claude-code-video-toolkit](https://github.com/digitalsamba/claude-code-video-toolkit)

**Como instalar:** Copie a pasta `skills/infra-midia/runpod/` deste repo para `~/.claude/skills/` (ou `.agents/skills/`, conforme seu agente). Corpo de origem: https://github.com/digitalsamba/claude-code-video-toolkit.

**Pasta no repo:** `skills/infra-midia/runpod/`

---

## cut-video

**O que cria:** encurta agressivamente gravação longa removendo silêncios, muletillas, falsos começos e retakes com precisão de forced aligner.

**Chaves técnicas:** MFA word boundaries 10-20ms (proxy 1080p primeiro); gap table agressiva (0.25-1s→0.1s); threshold relativo ao noise floor (guard S−F<8dB); retakes full-line fuzzy 4-gram 60s (keep last); proteger risadas por RMS vs floor; ground-truth windows Step 2.5; cross-ASR verification; stretched-word smoke alarm

**Origem:** cut-video

**Como instalar:** Copie a pasta `skills/infra-midia/cut-video/` deste repo para `~/.claude/skills/` (ou `.agents/skills/`, conforme seu agente). Corpo de origem: `editor-chefe/skills/cut-video`.

**Pasta no repo:** `skills/infra-midia/cut-video/`

---

## assets

**O que cria:** busca/download de stock assets nos sites do dono via browser-harness, com registro de licenças.

**Chaves técnicas:** CDP Browser.setDownloadBehavior para pasta do projeto, assets/SOURCES.md (site/URL/licença), recolour/crop/key, assets/found

**Origem:** mortiflix-oss · [https://github.com/GTKottman/mortiflix-oss](https://github.com/GTKottman/mortiflix-oss)

**Como instalar:** Copie a pasta `skills/infra-midia/assets/` deste repo para `~/.claude/skills/` (ou `.agents/skills/`, conforme seu agente). Corpo de origem: https://github.com/GTKottman/mortiflix-oss.

**Pasta no repo:** `skills/infra-midia/assets/`

---

## final-pass

**O que cria:** QC de vídeo renderizado — checagens automáticas + frame sheet + escuta antes de entregar.

**Chaves técnicas:** qc.mjs (--size/--fps/--duration ±5%, LUFS -14, true peak -1, --end-hold, --allow-black), frame sheet PNG, extração de 3 frames full-size, two-pass loudnorm

**Origem:** mortiflix-oss · [https://github.com/GTKottman/mortiflix-oss](https://github.com/GTKottman/mortiflix-oss)

**Como instalar:** Copie a pasta `skills/infra-midia/final-pass/` deste repo para `~/.claude/skills/` (ou `.agents/skills/`, conforme seu agente). Corpo de origem: https://github.com/GTKottman/mortiflix-oss.

**Pasta no repo:** `skills/infra-midia/final-pass/`

---

## reel-export

**O que cria:** converte vídeo horizontal/square em Reel 1080x1920 que sobe limpo no Instagram/TikTok.

**Chaves técnicas:** safe zone y360-1420 + direita 120px, overlay.png transparente p/ headline/logos, encode ffmpeg (bt709, yuv420p, color_range tv, crf 18, faststart), AAC silencioso, verificação ffprobe, logo em tile escuro

**Origem:** motion-graphics-skills · [https://github.com/charlie947/motion-graphics-skills](https://github.com/charlie947/motion-graphics-skills)

**Como instalar:** Copie a pasta `skills/infra-midia/reel-export/` deste repo para `~/.claude/skills/` (ou `.agents/skills/`, conforme seu agente). Corpo de origem: https://github.com/charlie947/motion-graphics-skills.

**Pasta no repo:** `skills/infra-midia/reel-export/`

