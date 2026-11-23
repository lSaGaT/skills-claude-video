# Ofícios & pipelines — autorais da casa

**10 skills** · [← voltar ao índice](../README.md)

---

## cel_iphone_html 🏠

**O que cria:** Réplica fiel de iPhone em HTML/three.js a partir de GLB de teardown — geometria extraída é a fonte da verdade.

**Chaves técnicas:** extrair_geometria_glb.py (POSITION 1µm/NORMAL/UV/COLOR_0 AO baked em 43 malhas); tabela MATS: transmission 1 + tint quase branca, emissive HDR clampado (~3.0 tela) com ACESFilmic/exposure 1.4, RepeatWrapping p/ UV com tiling baked, RENDER_ORDER de transparentes com depthWrite false, vertexColors p/ AO, anisotropy 0.77 em parafusos, iridescence 0.2 nas lentes; 6 câmeras de verificação bloco a bloco; fallback procedural em references/partes/.

**Origem:** casa (autoral — nascida em produção real)

**Como instalar:** Copie a pasta `skills/autorais-pipelines/cel_iphone_html/` deste repo para `~/.claude/skills/` (ou `.agents/skills/`, conforme seu agente).

**Pasta no repo:** `skills/autorais-pipelines/cel_iphone_html/`

---

## reverse-engineer-anything 🏠

**O que cria:** Engenharia reversa de alvos shipped (nativo, Electron/ASAR, APK, firmware, capturas de rede) via MCP REA (207 ferramentas).

**Chaves técnicas:** analyze_javascript_application (JS/Electron/ASAR); open_binary + inspect_artifact (ZIP/APK/IPA/MSIX/DMG); inspect_web_network_capture (HAR/SAZ/qlog); inspect_android_package; inspect_managed_artifact (.NET); providers Ghidra/IDA/Kuna; doctor/setup npx rea-agents (rea-agents@6.7.0); CLI fallback analyze-javascript-application.

**Origem:** casa (autoral — nascida em produção real)

**Como instalar:** Copie a pasta `skills/autorais-pipelines/reverse-engineer-anything/` deste repo para `~/.claude/skills/` (ou `.agents/skills/`, conforme seu agente).

**Pasta no repo:** `skills/autorais-pipelines/reverse-engineer-anything/`

---

## heygen-avatar 🏠

**O que cria:** Cria avatar HeyGen persistente (rosto + voz) por prompt ou foto, salvo em AVATAR-<NOME>.md.

**Chaves técnicas:** criação prompt-based (Mode 1 novo personagem / Mode 2 novo look via avatar_group_id); digital twin por foto (upload asset); voice design/list por língua; look_ids efêmeros resolvidos do group_id; AVATAR file (Appearance/Voice/HeyGen sections) + symlinks AVATAR-AGENT/AVATAR-USER.

**Origem:** casa (autoral — nascida em produção real)

**Como instalar:** Copie a pasta `skills/autorais-pipelines/heygen-avatar/` deste repo para `~/.claude/skills/` (ou `.agents/skills/`, conforme seu agente).

**Pasta no repo:** `skills/autorais-pipelines/heygen-avatar/`

---

## heygen-translate 🏠

**O que cria:** Traduz/dubla vídeo existente em 175+ línguas com voice cloning e lip-sync.

**Chaves técnicas:** create_video_translation (mode precision, enable_speech_enhancement, enable_caption, enable_dynamic_duration, keep_the_same_format, speaker_num); perfis talking-head/podcast/music/multi-speaker/corporate; fluxo proofreads (SRT extraído → editado → generate final); polling 30s/60s; asset upload ≤32MB.

**Origem:** casa (autoral — nascida em produção real)

**Como instalar:** Copie a pasta `skills/autorais-pipelines/heygen-translate/` deste repo para `~/.claude/skills/` (ou `.agents/skills/`, conforme seu agente).

**Pasta no repo:** `skills/autorais-pipelines/heygen-translate/`

---

## heygen-video 🏠

**O que cria:** Gera vídeo de apresentador HeyGen via pipeline v3 Video Agent (Frame Check, prompt craft, avatar/voz).

**Chaves técnicas:** Frame Check de aspect ratio; avatar readiness gate (list_avatar_looks, preview_image_url non-null); estilo por style_id (tags cinematic/retro-tech/print...) ou style blocks por mood (Swiss Pulse, Data Drift, Red Wire, Velvet Standard...); assets Path A contextualiza / Path B anexa; voice filter por language + voice_settings.locale; log heygen-video-log.jsonl.

**Origem:** casa (autoral — nascida em produção real)

**Como instalar:** Copie a pasta `skills/autorais-pipelines/heygen-video/` deste repo para `~/.claude/skills/` (ou `.agents/skills/`, conforme seu agente).

**Pasta no repo:** `skills/autorais-pipelines/heygen-video/`

---

## heygen (NanoClaw · casa) 🏠

**O que cria:** Receita container NanoClaw para vídeo com avatar HeyGen via CLI (avatar→voz→script→create→poll→download).

**Chaves técnicas:** heygen avatar list/looks list (group_id vs look id); voice list por língua; script 150 palavras/min (30s≈75 palavras, sem stage directions); video-agent create --wait --timeout 10m (45m p/ >60s); estados thinking/generating/completed; video download; heygen feedback --rating.

**Origem:** casa (autoral — nascida em produção real)

**Como instalar:** Copie a pasta `skills/autorais-pipelines/heygen-nanoclaw/` deste repo para `~/.claude/skills/` (ou `.agents/skills/`, conforme seu agente).

**Pasta no repo:** `skills/autorais-pipelines/heygen-nanoclaw/`

---

## reels-dev-tech 🏠

**O que cria:** produz Reels 9:16 dev/tech PT-BR (padrão devjuniors7) — README scroll, moldura neon, legenda cinética, 25-35 beats de 1s.

**Chaves técnicas:** regra 25-35 beats vs 6 cenas, capturar-readme.mjs, render-readme-scroll.mjs (canvas+ffmpeg), roteiro (dor→nome→promessa→provas→ressalva→fecho), TTS fonético ("Grôk"/"Uísper X"), moldura neon magenta→roxo→azul, destaque #ffd400, legenda caixa alta peso 800 acento #ffd84d, scrim, trilha -22/-26dB, -14 LUFS, QA checklist

**Origem:** casa (autoral — nascida em produção real)

**Também em:** reels-dev-tech — reels-dev-tech/SKILL.md

**Como instalar:** Copie a pasta `skills/autorais-pipelines/reels-dev-tech/` deste repo para `~/.claude/skills/` (ou `.agents/skills/`, conforme seu agente).

**Pasta no repo:** `skills/autorais-pipelines/reels-dev-tech/`

---

## video-campanha-politica 🏠

**O que cria:** pipeline PT-BR completo de Reels 9:16 narrado: roteiro em beats → ElevenLabs → canvas/ffmpeg → QA.

**Chaves técnicas:** 1 fala = 1 beat (3-7s, máx 11s); números por extenso p/ TTS; beatmap JSON fonte única de tempos; carimbos de manchete overlay sobre vídeo mudo escurecido; mapa de dados canvas (projeção CY=centro-((LAT0+LAT1)/2)*K); render em PARTES com skip-if-exists; fitSize auto-ajuste de largura; Ken Burns + gradiente por ato; folha de contato fps=1/8.4 tile 4x6; volumedetect QA de áudio; pitfalls ffmpeg (colorbalance bs/bm/rs/rm, labels [a1][a2], tpad, rgba, fade st/d, amix anullsrc leito de silêncio)

**Origem:** casa (autoral — nascida em produção real)

**Também em:** video-campanha-politica — video-campanha-politica/SKILL.md

**Como instalar:** Copie a pasta `skills/autorais-pipelines/video-campanha-politica/` deste repo para `~/.claude/skills/` (ou `.agents/skills/`, conforme seu agente).

**Pasta no repo:** `skills/autorais-pipelines/video-campanha-politica/`

---

## text-to-speech (ElevenLabs · casa) 🏠

**O que cria:** TTS ElevenLabs — texto→fala em 90+ línguas com modelos, vozes, settings e efeitos de áudio.

**Chaves técnicas:** modelos eleven_v4 (default, audio tags [whispers]/[laughs]/[sarcastic]), v4_turbo ~100ms (WebSocket Text to Dialogue), flash_v2_5 ~75ms, multilingual_v2; voice_settings stability/similarity_boost (v4 não tem style/speed nem SSML); language_code ISO 639-1; apply_text_normalization on/off; audio_effects (filter_preset phone/old_radio, environment hall, distance, pan, background_noise cafe/keyboard); request stitching (previous_text/next_text); formatos mp3_44100_128 a pcm_48000; streaming.

**Origem:** casa (autoral — nascida em produção real)

**Como instalar:** Copie a pasta `skills/autorais-pipelines/text-to-speech/` deste repo para `~/.claude/skills/` (ou `.agents/skills/`, conforme seu agente).

**Pasta no repo:** `skills/autorais-pipelines/text-to-speech/`

---

## watch 🏠

**O que cria:** assiste vídeo (URL/local): frames auto-escala + transcrição (captions/WhisperX/Groq/OpenAI) ou Gemini, e responde perguntas sobre o conteúdo.

**Chaves técnicas:** seleção scene-aware de frames com dedup; cue frames --timestamps; --start/--end; whisper word timings; engines gemini vs local; --detail balanced

**Origem:** claude-video · [https://github.com/bradautomates/claude-video](https://github.com/bradautomates/claude-video)

**Como instalar:** Copie a pasta `skills/autorais-pipelines/watch/` deste repo para `~/.claude/skills/` (ou `.agents/skills/`, conforme seu agente). Corpo de origem: https://github.com/bradautomates/claude-video.

**Pasta no repo:** `skills/autorais-pipelines/watch/`

