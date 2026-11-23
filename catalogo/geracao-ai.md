# Geração AI — vídeo, avatar & imagem

**24 skills** · [← voltar ao índice](../README.md)

---

## ai-video-gen

**O que cria:** gera vídeos AI multi-gateway (fal.ai, HeyGen, Kling oficial, Gemini Omni Flash).

**Chaves técnicas:** video_selector (disponibilidade, custo, fallback, bias p/ Seedance 2.0), Seedance 2.0 (áudio nativo sync, multi-shot, câmera diretor, lip-sync de diálogo citado), Gemini Omni Flash p/ edição iterativa conversacional de clipe, reference_image_url/tail_image_url, aspect 9:16.

**Origem:** OpenMontage · [https://github.com/calesthio/OpenMontage](https://github.com/calesthio/OpenMontage)

**Também em:** OpenMontage (https://github.com/calesthio/OpenMontage) — OpenMontage/.agents/skills/ai-video-gen/SKILL.md · OpenMontage (https://github.com/calesthio/OpenMontage) — OpenMontage/.claude/skills/ai-video-gen/SKILL.md

**Como instalar:** `git clone https://github.com/calesthio/OpenMontage` → copie `<repo>/.agents/skills/ai-video-gen/` para `~/.claude/skills/`

---

## atlas-cloud

**O que cria:** gateway Atlas Cloud p/ imagem e vídeo (Seedance 2.5/2.0, Gemini Omni Flash, MiniMax H3, Seedream 5.0, GPT Image 2, Nano Banana 2).

**Chaves técnicas:** image_selector/video_selector, rotas text/image/reference-to-video (Seedance 2.5: até 30 imagens/10 vídeos/10 áudios de referência, 4-30s), edição de imagem com até 14 imagens, preflight de custo + provenance (prediction id, custos).

**Origem:** OpenMontage · [https://github.com/calesthio/OpenMontage](https://github.com/calesthio/OpenMontage)

**Como instalar:** `git clone https://github.com/calesthio/OpenMontage` → copie `<repo>/.agents/skills/atlas-cloud/` para `~/.claude/skills/`

---

## avatar-video

**O que cria:** Vídeos com avatar AI HeyGen com controle exato de avatar, voz, cenas e backgrounds.

**Chaves técnicas:** /v2/video/generate multi-cena (avatar/voz/background por cena), WebM transparente p/ composição, talking photos, text overlays com fonte/posição, captions automáticas, integração Remotion, test mode com watermark.

**Origem:** OpenMontage · [https://github.com/calesthio/OpenMontage](https://github.com/calesthio/OpenMontage)

**Também em:** OpenMontage (https://github.com/calesthio/OpenMontage) — OpenMontage/.agents/skills/avatar-video/SKILL.md · OpenMontage (https://github.com/calesthio/OpenMontage) — OpenMontage/.claude/skills/avatar-video/SKILL.md

**Como instalar:** `git clone https://github.com/calesthio/OpenMontage` → copie `<repo>/.agents/skills/avatar-video/` para `~/.claude/skills/`

---

## bfl-api

**O que cria:** guia de integração da API BFL FLUX (endpoints, polling, webhooks, rate limit, preços).

**Chaves técnicas:** submit + polling_url, URLs de resultado expiram em 10min (baixar já), multi-reference I2I até 8 imagens ("subject from image 1 in environment from image 2"), preço por megapixel, endpoints regionais EU/US.

**Origem:** OpenMontage · [https://github.com/calesthio/OpenMontage](https://github.com/calesthio/OpenMontage)

**Também em:** OpenMontage (https://github.com/calesthio/OpenMontage) — OpenMontage/.agents/skills/bfl-api/SKILL.md · OpenMontage (https://github.com/calesthio/OpenMontage) — OpenMontage/.claude/skills/bfl-api/SKILL.md

**Como instalar:** `git clone https://github.com/calesthio/OpenMontage` → copie `<repo>/.agents/skills/bfl-api/` para `~/.claude/skills/`

---

## comfyui

**O que cria:** operação de workflows ComfyUI no OpenMontage (imagem/vídeo/música, workflows custom, LoRAs).

**Chaves técnicas:** server contract (POST /prompt, GET /history, websocket + resume_prompt_id), output_node (SaveImage/VHS_VideoCombine), trap do EmptyLatentImage vs video latent (MP4 stroba), ACE-Step v1 3.5B nativo com tags [verse]/[chorus], missing_models payload, workflows low-VRAM (Wan 2.1 1.3B, LTXV FP8, GGUF).

**Origem:** OpenMontage · [https://github.com/calesthio/OpenMontage](https://github.com/calesthio/OpenMontage)

**Como instalar:** `git clone https://github.com/calesthio/OpenMontage` → copie `<repo>/.agents/skills/comfyui/` para `~/.claude/skills/`

---

## create-video

**O que cria:** Gera vídeo completo a partir de um prompt via HeyGen Video Agent (roteiro, avatar, visual e VO automáticos).

**Chaves técnicas:** POST /v1/video_agent/generate; prompt-optimizer com cenas/timing/estilos; 20 visual styles nomeados; config duration_sec/orientation/avatar_id; upload de referências de marca

**Origem:** OpenMontage · [https://github.com/calesthio/OpenMontage](https://github.com/calesthio/OpenMontage)

**Também em:** OpenMontage (https://github.com/calesthio/OpenMontage) — OpenMontage/.agents/skills/create-video/SKILL.md · OpenMontage (https://github.com/calesthio/OpenMontage) — OpenMontage/.claude/skills/create-video/SKILL.md

**Como instalar:** `git clone https://github.com/calesthio/OpenMontage` → copie `<repo>/.agents/skills/create-video/` para `~/.claude/skills/`

---

## dashscope

**O que cria:** integração DashScope Alibaba (qwen-image-2.0-pro, qwen3-tts-flash, qwen3-asr-flash-filetrans).

**Chaves técnicas:** endpoints nativos (não OpenAI-compatible), size "1024*1024" com asterisco, ASR async com word-level timestamps normalizados p/ segundos, TTS voz Cherry, prompt_extend reescreve prompt (desativar p/ aderência literal), legendas agrupadas por semântica.

**Origem:** OpenMontage · [https://github.com/calesthio/OpenMontage](https://github.com/calesthio/OpenMontage)

**Como instalar:** `git clone https://github.com/calesthio/OpenMontage` → copie `<repo>/.agents/skills/dashscope/` para `~/.claude/skills/`

---

## faceswap

**O que cria:** troca de rosto em vídeo via HeyGen FaceswapNode.

**Chaves técnicas:** workflow_type FaceswapNode (source_image_url + target_video_url), polling a cada 10s, encadeamento com AvatarInferenceNode.

**Origem:** OpenMontage · [https://github.com/calesthio/OpenMontage](https://github.com/calesthio/OpenMontage)

**Também em:** OpenMontage (https://github.com/calesthio/OpenMontage) — OpenMontage/.agents/skills/faceswap/SKILL.md · OpenMontage (https://github.com/calesthio/OpenMontage) — OpenMontage/.claude/skills/faceswap/SKILL.md

**Como instalar:** `git clone https://github.com/calesthio/OpenMontage` → copie `<repo>/.agents/skills/faceswap/` para `~/.claude/skills/`

---

## flux-best-practices

**O que cria:** guia de prompting p/ modelos FLUX.2/FLUX.1 (T2I, I2I, JSON, hex, tipografia).

**Chaves técnicas:** fórmula [Subject]+[Action]+[Style]+[Context]+[Lighting]+[Camera], sem negative prompts (descrever o que quer), texto com aspas duplas, hex #RRGGBB + descrição de cor, seleção por modelo (flex p/ tipografia, max p/ qualidade), rules/ (t2i-prompting, i2i, json-structured, hex-color, typography, multi-reference).

**Origem:** OpenMontage · [https://github.com/calesthio/OpenMontage](https://github.com/calesthio/OpenMontage)

**Também em:** OpenMontage (https://github.com/calesthio/OpenMontage) — OpenMontage/.agents/skills/flux-best-practices/SKILL.md · OpenMontage (https://github.com/calesthio/OpenMontage) — OpenMontage/.claude/skills/flux-best-practices/SKILL.md

**Como instalar:** `git clone https://github.com/calesthio/OpenMontage` → copie `<repo>/.agents/skills/flux-best-practices/` para `~/.claude/skills/`

---

## gemini-omni

**O que cria:** Gera e edita conversacionalmente clipes 3-10s 720p com Gemini Omni Flash (áudio sintetizado, texto na tela, edição por interação).

**Chaves técnicas:** edição stateful via previous_interaction_id (prompt-só-o-delta + "Keep everything else the same"), timecode beats [0-3s]/[3-6s], tags <FIRST_FRAME>/<IMAGE_REF_N> p/ referências, texto renderizado palavra-a-palavra temporizado, edição de vídeo enviado (input_video_path), meta-prompt de micro-detalhe

**Origem:** OpenMontage · [https://github.com/calesthio/OpenMontage](https://github.com/calesthio/OpenMontage)

**Como instalar:** `git clone https://github.com/calesthio/OpenMontage` → copie `<repo>/.agents/skills/gemini-omni/` para `~/.claude/skills/`

---

## grok-media

**O que cria:** Gera/edita imagens e vídeos curtos via API xAI Grok Imagine (T2V, I2V, reference-to-video).

**Chaves técnicas:** image edit e multi-image compositing (POST /images/edits), reference-to-video com placeholders <IMAGE_1> (product placement, wardrobe transfer, consistência de personagem), polling /videos/{request_id}, 480p/720p, camera language (push-in, whip pan)

**Origem:** OpenMontage · [https://github.com/calesthio/OpenMontage](https://github.com/calesthio/OpenMontage)

**Como instalar:** `git clone https://github.com/calesthio/OpenMontage` → copie `<repo>/.agents/skills/grok-media/` para `~/.claude/skills/`

---

## heygen (API · OpenMontage, deprecated)

**O que cria:** [DEPRECATED] API HeyGen de vídeo com avatares (unifica create-video e avatar-video).

**Chaves técnicas:** Video Agent generate (prompt com scenes/timing/visual styles), v2 multi-cena (avatar_id, voice_id, timing por cena), polling /v2/videos, WebM transparente p/ compositing, captions/text-overlays, templates, integração Remotion

**Origem:** OpenMontage · [https://github.com/calesthio/OpenMontage](https://github.com/calesthio/OpenMontage)

**Também em:** OpenMontage (https://github.com/calesthio/OpenMontage) — OpenMontage/.agents/skills/heygen/SKILL.md · OpenMontage (https://github.com/calesthio/OpenMontage) — OpenMontage/.claude/skills/heygen/SKILL.md

**Como instalar:** `git clone https://github.com/calesthio/OpenMontage` → copie `<repo>/.agents/skills/heygen/` para `~/.claude/skills/`

---

## kling-official

**O que cria:** Guia da API oficial Kling (vídeo, imagem, TTS, avatar, lip-sync) para os providers OpenMontage.

**Chaves técnicas:** task protocols classic vs turbo (parsers separados), Omni references (image_list first_frame/end_frame, multi_prompt, element_list), lip-sync 2 etapas (identify-face→advanced-lip-sync), mapa de erros/retry, cost governance, aspect_ratio só onde suportado

**Origem:** OpenMontage · [https://github.com/calesthio/OpenMontage](https://github.com/calesthio/OpenMontage)

**Como instalar:** `git clone https://github.com/calesthio/OpenMontage` → copie `<repo>/.agents/skills/kling-official/` para `~/.claude/skills/`

---

## ltx2

**O que cria:** Gera clipes ~5s (máx 8s) com LTX-2.3 22B em Modal — text-to-video e image-to-video.

**Chaves técnicas:** frame counts válidos (n-1)%8==0, resolução 9:16 576x1024, prompting cinematográfico (camera/lighting/motion/style/negative), animate slide/portrait, combos flux2→ltx2 e ltx2→upscale/Remotion/ffmpeg, seed reprodutível, limitação de texto na tela

**Origem:** OpenMontage · [https://github.com/calesthio/OpenMontage](https://github.com/calesthio/OpenMontage)

**Também em:** OpenMontage (https://github.com/calesthio/OpenMontage) — OpenMontage/.agents/skills/ltx2/SKILL.md · OpenMontage (https://github.com/calesthio/OpenMontage) — OpenMontage/.claude/skills/ltx2/SKILL.md · claude-code-video-toolkit (https://github.com/digitalsamba/claude-code-video-toolkit) — claude-code-video-toolkit/.claude/skills/ltx2/SKILL.md

**Como instalar:** `git clone https://github.com/calesthio/OpenMontage` → copie `<repo>/.agents/skills/ltx2/` para `~/.claude/skills/`

---

## minimax-h3

**O que cria:** Gera vídeo 4-15s 2K com MiniMax H3 (Hailuo 3.0) via 5 rotas (API oficial, fal, Runway, ComfyUI hosted/local).

**Chaves técnicas:** T2V/I2V/first-last-frame/reference-to-video (imagens+vídeos+áudio combinados), prompt subject+action+camera path+environment+lighting+audio intent, 2K, áudio nativo

**Origem:** OpenMontage · [https://github.com/calesthio/OpenMontage](https://github.com/calesthio/OpenMontage)

**Como instalar:** `git clone https://github.com/calesthio/OpenMontage` → copie `<repo>/.agents/skills/minimax-h3/` para `~/.claude/skills/`

---

## provider-model-refresh

**O que cria:** Catálogo set/2026 de adapters de imagem/vídeo/TTS/avatar com contratos exatos de modelo e host.

**Chaves técnicas:** GPT Image 2.5 Flare/Sunburst (edit com mask, alpha PNG/WebP), Gemini 3 Pro Image (até 14 refs, 1K/2K/4K), Ideogram 4.5 precise_edit (preserva pixels não afetados, dry_run p/ preço), Wan 3.0/LTX-2.5/H3 Max vídeo, Eleven v4/v4 Turbo, Gemini 3.8 TTS com speech annotations, Lyria 3.5, Sonic 3.6, Inworld TTS-2, Qwen Image 2.1, HeyGen Avatar V, resume_job em timeout

**Origem:** OpenMontage · [https://github.com/calesthio/OpenMontage](https://github.com/calesthio/OpenMontage)

**Como instalar:** `git clone https://github.com/calesthio/OpenMontage` → copie `<repo>/.agents/skills/provider-model-refresh/` para `~/.claude/skills/`

---

## remotion

**O que cria:** Extensões Remotion do toolkit — componentes compartilhados e biblioteca de transições custom.

**Chaves técnicas:** transições glitch (intensity/slices/rgbShift), rgbSplit, zoomBlur, lightLeak (temperature/direction), clockWipe (startAngle/segments), pixelate, checkerboard (9 patterns: diagonal/spiral/center-out/corners-in...), componentes AnimatedBackground/SlideTransition/Vignette/LogoWatermark/SplitScreen/NarratorPiP/PointingHand/Envelope, tabela de duração (quick cut 15-20f, standard 30-45f), 150 wpm, 30fps, extrapolateRight clamp, OffthreadVideo

**Origem:** claude-code-video-toolkit · [https://github.com/digitalsamba/claude-code-video-toolkit](https://github.com/digitalsamba/claude-code-video-toolkit)

**Também em:** OpenMontage (https://github.com/calesthio/OpenMontage) — OpenMontage/.agents/skills/remotion/SKILL.md · OpenMontage (https://github.com/calesthio/OpenMontage) — OpenMontage/.claude/skills/remotion/SKILL.md · claude-code-video-toolkit (https://github.com/digitalsamba/claude-code-video-toolkit) — claude-code-video-toolkit/.claude/skills/remotion/SKILL.md

**Como instalar:** `git clone https://github.com/digitalsamba/claude-code-video-toolkit` → copie `<repo>/.claude/skills/remotion/` para `~/.claude/skills/`

---

## seedance-2-0

**O que cria:** Gera clipes cinematográficos 4-15s com áudio sincronizado via Seedance 2.0 (ByteDance), modelo premium default do OpenMontage.

**Chaves técnicas:** Higgsfield prompt methodology (opener de shot-structure verbatim), multi-shot num prompt (Shot 1/2/3, ritmo 2.5s/shot), lip-sync por diálogo entre aspas (≤6 palavras/linha), reference-to-video 9img+3vid+3audio com [identity_lock] e anti-drift phrases, RAMPS TO SLOW MOTION/SNAPS BACK REAL TIME, VFX inline em brackets, negações de câmera (no cuts/no zoom), 9:16 p/ Reels

**Origem:** OpenMontage · [https://github.com/calesthio/OpenMontage](https://github.com/calesthio/OpenMontage)

**Como instalar:** `git clone https://github.com/calesthio/OpenMontage` → copie `<repo>/.agents/skills/seedance-2-0/` para `~/.claude/skills/`

---

## seedance-2-5

**O que cria:** Gera vídeo 4-30s 480p/720p via Seedance 2.5 com até 30 refs de imagem/10 vídeo/10 áudio.

**Chaves técnicas:** prompt contract por seções (GLOBAL STYLE→SCENE→CHARACTERS→LOCATION→FIRST FRAME AND BLOCKING→Shots com Hard cut→OPTICS→PHYSICS→LIGHTING→AUDIO), named locks (LENS LOCK, COUNT LOCK, STILLNESS LOCK, SCREEN DIRECTION, POSITIVE LOCKS), state monotonicity (estados só avançam), event tracks timestamped, character-sheet 3 placas (face só no close-up, smiling/neutral), voice como conditioning sentence verbatim, regra dos 10, single-element edit com "keep unchanged"

**Origem:** OpenMontage · [https://github.com/calesthio/OpenMontage](https://github.com/calesthio/OpenMontage)

**Como instalar:** `git clone https://github.com/calesthio/OpenMontage` → copie `<repo>/.agents/skills/seedance-2-5/` para `~/.claude/skills/`

---

## video-toolkit

**O que cria:** guia de setup/orquestração do claude-code-video-toolkit: endpoints Modal/RunPod, templates de projeto, pipeline brief→VO→assets→render.

**Chaves técnicas:** templates product-demo/sprint-review com scenes (title/problem/solution/demo/feature/stats/cta), qwen3_tts (9 speakers, 8 tones, voice clone via ref-audio/ref-text), flux2.py presets de imagem, music_gen presets (corporate-bg/upbeat-tech/cta/lofi), regra duração = word_count/2.5+2, verify_setup.py, deploy modal por ferramenta.

**Origem:** claude-code-video-toolkit · [https://github.com/digitalsamba/claude-code-video-toolkit](https://github.com/digitalsamba/claude-code-video-toolkit)

**Também em:** OpenMontage (https://github.com/calesthio/OpenMontage) — OpenMontage/.agents/skills/video-toolkit/SKILL.md · OpenMontage (https://github.com/calesthio/OpenMontage) — OpenMontage/.claude/skills/video_toolkit/SKILL.md · claude-code-video-toolkit (https://github.com/digitalsamba/claude-code-video-toolkit) — claude-code-video-toolkit/skills/openclaw-video-toolkit/SKILL.md

**Como instalar:** `git clone https://github.com/digitalsamba/claude-code-video-toolkit` → copie `<repo>/skills/openclaw-video-toolkit/` para `~/.claude/skills/`

---

## video-translate

**O que cria:** Tradução/dublagem de vídeos existentes com lip-sync via HeyGen /v2/video_translate.

**Chaves técnicas:** output_language (inclui pt-BR), translate_audio_only, speaker_num, v4: output_languages múltiplos, vocabulary p/ preservar termos, srt_key/srt_role, enable_video_stretching, poll de status + download.

**Origem:** OpenMontage · [https://github.com/calesthio/OpenMontage](https://github.com/calesthio/OpenMontage)

**Também em:** OpenMontage (https://github.com/calesthio/OpenMontage) — OpenMontage/.agents/skills/video-translate/SKILL.md · OpenMontage (https://github.com/calesthio/OpenMontage) — OpenMontage/.claude/skills/video-translate/SKILL.md

**Como instalar:** `git clone https://github.com/calesthio/OpenMontage` → copie `<repo>/.agents/skills/video-translate/` para `~/.claude/skills/`

---

## ideogram4

**O que cria:** gera imagens com texto legível em cena (cards, thumbs, CTAs) via Ideogram 4 com caption JSON estruturada.

**Chaves técnicas:** caption JSON high_level/compositional + color_palette hex de marca; bounding boxes; key-order estrito; texto multilinha legível; 9:16 1440x2560; tiers TURBO/QUALITY; 4.5 opt-in

**Origem:** claude-code-video-toolkit · [https://github.com/digitalsamba/claude-code-video-toolkit](https://github.com/digitalsamba/claude-code-video-toolkit)

**Como instalar:** `git clone https://github.com/digitalsamba/claude-code-video-toolkit` → copie `<repo>/.claude/skills/ideogram4/` para `~/.claude/skills/`

---

## qwen-edit

**O que cria:** edição de imagem por prompt (Qwen-Image-Edit): preservar identidade, reframe, roupa, pose, cutout RGBA.

**Chaves técnicas:** prompt RGBA transparency p/ cutout; edição local por círculo/máscara; multi-imagem até 10 refs com identity anchors (guidance 2.0); reframe; negative prompt

**Origem:** claude-code-video-toolkit · [https://github.com/digitalsamba/claude-code-video-toolkit](https://github.com/digitalsamba/claude-code-video-toolkit)

**Como instalar:** `git clone https://github.com/digitalsamba/claude-code-video-toolkit` → copie `<repo>/.claude/skills/qwen-edit/` para `~/.claude/skills/`

---

## generative-illustration-skills

**O que cria:** combina ilustrações geradas por IA (sprites isolados) com motion em código em canvas determinístico → MP4.

**Chaves técnicas:** regra "gerar elementos pequenos independentes, nunca animar ilustração única"; Recraft v4.1 SVG p/ vetores + strip de fundo por bbox; seek harness determinístico (window.__seek(t), sem rAF); sprites com pivot de motion; grain overlay com noise seedado; craft: causalidade, ritmo resolve→pausa→reflexo, spotlight do herói, easing nunca linear; trilha Lyria; contact sheet de verificação.

**Origem:** generative-illustration-skills · [https://github.com/iart-ai/generative-illustration-skills](https://github.com/iart-ai/generative-illustration-skills)

**Como instalar:** `git clone https://github.com/iart-ai/generative-illustration-skills` → copie `<repo>/skills/generative-illustration/` para `~/.claude/skills/`

