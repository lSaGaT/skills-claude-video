# Formatos sociais — TikTok, Reels, Shorts & ads

**29 skills** · [← voltar ao índice](../README.md)

---

## ad-creative-video

**O que cria:** Template de ad motion-graphics data-driven com produção em lote de variantes p/ A/B via CSV (Remotion).

**Chaves técnicas:** anatomia 15-30s (hook 0-3s → context → payoff → proof → CTA), taxonomia de hooks (problem-first, pattern interrupt, curiosity gap, immediate benefit, direct callout), message-match hook↔CTA, 1 template × CSV = N renders (--props por row), safe zones 9:16 (top 14%, bottom 20-35%, laterais 6%), multi-aspect via --props-merge aspect, verify loop com remotion still + scripts contact-sheet.sh/probe-mp4.sh, brand-lock por theme object.

**Origem:** ad-video-skills · [https://github.com/iart-ai/ad-video-skills](https://github.com/iart-ai/ad-video-skills)

**Como instalar:** `git clone https://github.com/iart-ai/ad-video-skills` → copie `<repo>/skills/ad-creative-video/` para `~/.claude/skills/`

---

## launch-video (ad-skills · iart-ai)

**O que cria:** Filme de lançamento 15-60s com arc hook→tease→reveal→montagem→endcard, cortado na batida da música.

**Chaves técnicas:** sound design leads picture (track travado antes do corte), reveal sincronizado no drop (snap + micro-overshoot scale 1.18→1.0 + white flash), montagem cinética (1 benefício/shot 0.6-1.0s, hard cuts em transients, keyword pop cubic-bezier(.22,1,.36,1)), endcard logo+tagline+CTA ≥2s, multi-aspect com center safe zone, verify remotion still por aspect.

**Origem:** ad-video-skills · [https://github.com/iart-ai/ad-video-skills](https://github.com/iart-ai/ad-video-skills)

**Como instalar:** `git clone https://github.com/iart-ai/ad-video-skills` → copie `<repo>/skills/launch-video/` para `~/.claude/skills/`

---

## testimonial-video

**O que cria:** Anima depoimentos em card tipográfico com estrelas e autor, um template para N reviews via props.

**Chaves técnicas:** staggered line reveal (spring damping 200, stagger 6-10 frames, rise 14px), kinetic emphasis (highlight sweep linear-gradient em 1 frase após a linha assentar), star rating fracionário por wipe de largura rating/max, author block slide-up final, quote verbatim, batch reviews/*.json, multi-aspect, aria-label real.

**Origem:** ad-video-skills · [https://github.com/iart-ai/ad-video-skills](https://github.com/iart-ai/ad-video-skills)

**Como instalar:** `git clone https://github.com/iart-ai/ad-video-skills` → copie `<repo>/skills/testimonial-video/` para `~/.claude/skills/`

---

## vlog-auto-edit

**O que cria:** Workflow chinês de auto-edição de vlog de viagem: ffmpeg + Whisper/FunASR + API de visão, em 7 fases.

**Chaves técnicas:** análise 3D por clipe (ASR + visão GLM-4.6V-Flash/GPT-4o: tipo de plano/decupagem/atmosfera), ritmos validados (3-4s por plano, receita 40% comida/30% paisagem/15% pessoas/15% dia a dia, 60-65% planos próximos), estrutura 3 atos 25/50/25, Walter Murch (emoção 51%), title card via drawtext ou Pillow PNG overlay, Whisper vs FunASR paraformer-zh (timestamps por caractere agregados por pontuação), scenedetect, yt-dlp p/ estudo de referências.

**Origem:** ai-video-editing-skill

**Como instalar:** Coleção local em `editor-chefe/skills/ai-video-editing-skill/` (sem remote) — copie `SKILL.md/` para `~/.claude/skills/`

---

## book-video-factory

**O que cria:** Fábrica audível de vídeos de resenha de livro (3:4 bilíngue ou 9:16 VOX paper-collage) com gates de direitos, custo e aprovação.

**Chaves técnicas:** style profiles book-editorial-bilingual-v2 / paper-collage-explainer-v1 (beats visuais 4-8s), lanes gemini-api (gemini-omni-flash-preview, veo-3.1) vs google-flow manual, picture lock 720x1280 H.264 30fps, gates hash-bound (source_audit, gate_1_metaphor, bgm_review, publish), títulos pixel-measured max 2 linhas fail-closed, run_cost.py ledger append-only, handoff ChatCut sem sobrescrever master.

**Origem:** book-video-factory

**Como instalar:** Coleção local em `editor-chefe/skills/book-video-factory/` (sem remote) — copie `skills/book-video-factory/` para `~/.claude/skills/`

---

## make-ai-short

**O que cria:** short vertical 1080×1920 end-to-end com personagem travado animado por modelo de vídeo (Seedance/fal) + VO ElevenLabs + captions word-synced no Remotion.

**Chaves técnicas:** character.json lock (nunca gerar personagem 2x); frame-0 extraído como loop target + end_image_url no shot final (LoopSettle); custo declarado antes de gerar; QA por strip start/mid/end; SFX em gaps do VO −7-8dB

**Origem:** claude-faceless-shorts-creator

**Como instalar:** Coleção local em `editor-chefe/skills/claude-faceless-shorts-creator/` (sem remote) — copie `.claude/skills/make-ai-short/` para `~/.claude/skills/`

---

## make-short

**O que cria:** short 100% TSX (Remotion) 1080×1920 ~40s: beats.json, cenas sobre canvas persistente, QA por frames, voz ElevenLabs word-exact, SFX, música.

**Chaves técnicas:** gramática HOOK(0-3.4s frame-0 composto)→SETUP→QUIZ→REVEAL→TWIST→LOOP (último frame = frame 0); Captions+ProgressBar no root; frames locais em Sequence (global_s*fps−from); 2.7 wps; gen_voice com word times reais + vo.gen.ts; SAFE areas (bottom 340px/right 160px); mux ffmpeg

**Origem:** claude-faceless-shorts-creator

**Como instalar:** Coleção local em `editor-chefe/skills/claude-faceless-shorts-creator/` (sem remote) — copie `.claude/skills/make-short/` para `~/.claude/skills/`

---

## make-vox

**O que cria:** shorts estilo Vox em colagem de camadas (paper, cutouts, chips, rotas) coreografadas com câmera virtual CollageBoard.

**Chaves técnicas:** cena = 2-6 layers nomeadas; cam keys globais + entradas locais; parallax por profundidade (bg −0.06, fg 0.08-0.15); cutout rembg (white-key falha em sombra); HTML→PNG Playwright omitBackground; SVG arrows in-TSX; regra de contraste SerifStatement backing; idle drift

**Origem:** claude-faceless-shorts-creator

**Como instalar:** Coleção local em `editor-chefe/skills/claude-faceless-shorts-creator/` (sem remote) — copie `.claude/skills/make-vox/` para `~/.claude/skills/`

---

## photo-slideshow

**O que cria:** slideshow de fotos com Ken Burns variado seeded, transições, sync de batida da música e manifest de pasta.

**Chaves técnicas:** Ken Burns mulberry32 por índice (zoom 1.0→1.12, pan L/R/diag, easeInOutSine, scale inicial ≥1.05); blurred-pad p/ aspect misto; beat onset librosa→beats.json; crossfade 0.4-0.6s; legendas/datas lower-third; intro/outro cards

**Origem:** ecommerce-video-skills · [https://github.com/iart-ai/ecommerce-video-skills](https://github.com/iart-ai/ecommerce-video-skills)

**Como instalar:** `git clone https://github.com/iart-ai/ecommerce-video-skills` → copie `<repo>/skills/photo-slideshow/` para `~/.claude/skills/`

---

## product-demo-video

**O que cria:** transforma screenshots estáticos em demo animada: frame de browser/phone, cursor com ripple, zoom para região focal, callouts e captions.

**Chaves técnicas:** cursor smoothstep + click ripple spring no mesmo frame do estado; zoom ≤2x easeOutCubic transform-origin no alvo; spotlight hole box-shadow 9999px; BrowserFrame/phone com notch + URL real; transições push/cross-zoom/crossfade/match-cut; captura 2x DPR; demo loop settle→travel→click→zoom; 1 movimento por vez

**Origem:** ecommerce-video-skills · [https://github.com/iart-ai/ecommerce-video-skills](https://github.com/iart-ai/ecommerce-video-skills)

**Como instalar:** `git clone https://github.com/iart-ai/ecommerce-video-skills` → copie `<repo>/skills/product-demo-video/` para `~/.claude/skills/`

---

## promo-video

**O que cria:** spot de promoção de 6-15s (reveal de desconto, was→now com strike-through, código, urgência, CTA) com template×data.

**Chaves técnicas:** arco hook→desconto→was→now→produto→código→CTA com budgets; strike-through L→R 0.4s antes do count-down spring + landing pop; % off derivado de was/now; Intl+tabular-nums; code chip mono; countdown por deadline real; spring damping~12; 1 cor de accent de savings

**Origem:** ecommerce-video-skills · [https://github.com/iart-ai/ecommerce-video-skills](https://github.com/iart-ai/ecommerce-video-skills)

**Como instalar:** `git clone https://github.com/iart-ai/ecommerce-video-skills` → copie `<repo>/skills/promo-video/` para `~/.claude/skills/`

---

## newsletter-promo

**O que cria:** promo 12-20s de newsletter — hook em pergunta, 3 proof frames reais, endcard com nome e link.

**Chaves técnicas:** estrutura 0-3s hook / 3-11s provas 2.5s cada com push-in + label 3-5 palavras / 11-15s endcard hold, banned list, export 1080x1350 e 1080x1920

**Origem:** motion-graphics-skills · [https://github.com/charlie947/motion-graphics-skills](https://github.com/charlie947/motion-graphics-skills)

**Como instalar:** `git clone https://github.com/charlie947/motion-graphics-skills` → copie `<repo>/skills/newsletter-promo/` para `~/.claude/skills/`

---

## talking-head

**O que cria:** gera filme talking-head (fal MiniMax H3) a partir de fotos+voz ElevenLabs ou vídeo próprio, com motion graphics canvas.

**Chaves técnicas:** prepare-person --video (extrai frames + voice.wav); plan.json com cenas talking/motion; draw(ctx, scene, time) canvas 2D por frame; scene.words timings medidos; registerFont() p/ glifos locais; render local ffmpeg; speech.vtt; verificação de lip-sync por transcrição

**Origem:** talking-head-skills · [https://github.com/iart-ai/talking-head-skills](https://github.com/iart-ai/talking-head-skills)

**Como instalar:** `git clone https://github.com/iart-ai/talking-head-skills` → copie `<repo>/skills/talking-head/` para `~/.claude/skills/`

---

## text-message-animation

**O que cria:** vídeo de conversa iMessage/WhatsApp falsa 9:16 com bolhas que aparecem em ritmo de chat.

**Chaves técnicas:** bolhas spring pop (translateY 24→0 + scale 0.85→1); typing indicator 3 dots em sine frame-driven; timeline cursor ms→frames (delayMs/typingMs); read receipts/timestamps/tapbacks com overshoot; auto-scroll spring p/ manter bolha nova no terço inferior; pop/ding por mensagem em <Sequence>; safe-area 9:16 (top 120px, header 150px, bottom 360px); calculateMetadata p/ duração; CSV → batch

**Origem:** text-message-video-skills · [https://github.com/iart-ai/text-message-video-skills](https://github.com/iart-ai/text-message-video-skills)

**Como instalar:** `git clone https://github.com/iart-ai/text-message-video-skills` → copie `<repo>/skills/text-message-animation/` para `~/.claude/skills/`

---

## kinetic-caption-video

**O que cria:** legendas cinéticas palavra-a-palavra com ênfase semântica e zonas de posição/profundidade.

**Chaves técnicas:** transcribe word-level + group_transcript; tratamentos impact/stacked/marker/minimal; zonas bottom/top/mid/depth; depth captions atrás do presenter cutout (z=7/8/9/14); 1 grupo visível por vez; QA contact sheet

**Origem:** tiktok-ig-shorts

**Como instalar:** Coleção local em `editor-chefe/skills/tiktok-ig-shorts/` (sem remote) — copie `skills/kinetic-caption-video/` para `~/.claude/skills/`

---

## popout-talking-head-video

**O que cria:** composição pop-out: presenter sai da moldura PiP com camada transparente sincronizada.

**Chaves técnicas:** hyperframes remove-background → WebM alpha; 3 camadas (PiP clipado + gráficos + cutout); text-behind-person; sync de data-start/object-fit/transform; QA de matte chatter/halos/drift

**Origem:** tiktok-ig-shorts

**Como instalar:** Coleção local em `editor-chefe/skills/tiktok-ig-shorts/` (sem remote) — copie `skills/popout-talking-head-video/` para `~/.claude/skills/`

---

## social-talking-head-video

**O que cria:** empacota footage speech-led em edit social 9:16 com PiP, B-roll, captions e SFX.

**Chaves técnicas:** intake gate; PiP borderless 48-72px insets; dominante visual muda a cada 2-4s; captions impact/stacked/neon/marker/minimal (2-4 estilos por vídeo); scrolling webpage capture determinístico; SFX calibrados (whoosh 0.30-0.40, pop 0.35-0.45); safe zone y>=320; motion.json sidecar + snapshots QA

**Origem:** tiktok-ig-shorts

**Como instalar:** Coleção local em `editor-chefe/skills/tiktok-ig-shorts/` (sem remote) — copie `skills/social-talking-head-video/` para `~/.claude/skills/`

---

## caption-animation

**O que cria:** legendas karaoke palavra-a-palavra com timestamps reais de Whisper.

**Chaves técnicas:** Whisper word timestamps (não split uniforme); createTikTokStyleCaptions() 1-4 palavras/página; spring pop 0.6→1 com overshoot por palavra; active word highlight cor única (#FFE45E); bold sans 56-80px, stroke 2-6px + shadow; centro 62-70% da altura; burn-in MP4 + sidecar SRT/VTT; verify loop com remotion still

**Origem:** tiktok-video-skills · [https://github.com/iart-ai/tiktok-video-skills](https://github.com/iart-ai/tiktok-video-skills)

**Como instalar:** `git clone https://github.com/iart-ai/tiktok-video-skills` → copie `<repo>/skills/caption-animation/` para `~/.claude/skills/`

---

## countdown-video

**O que cria:** countdown frame-accurate derivado do frame (sem drift).

**Chaves técnicas:** remaining = ceil(duration - frame/fps); tabular-nums; formatMMSS/DHMS; digit roll odômetro (strip 0-9 translada); flip-card; background loop frame % loopFrames; durationInFrames prop

**Origem:** tiktok-video-skills · [https://github.com/iart-ai/tiktok-video-skills](https://github.com/iart-ai/tiktok-video-skills)

**Como instalar:** `git clone https://github.com/iart-ai/tiktok-video-skills` → copie `<repo>/skills/countdown-video/` para `~/.claude/skills/`

---

## lower-thirds (TikTok/Reels · iart-ai)

**O que cria:** lower thirds animados (nome/cargo) com revelação, dwell e safe-area.

**Chaves técnicas:** slide+fade, wipe bar (scaleX), mask reveal (clip-path inset); stagger bar→name→role 3-6f; hold 3-5s; exit 2/3 do enter; ease-out cubic-bezier(.22,1,.36,1); hierarchy ≥1.6x; brand lock em theme object; roster batch por --props

**Origem:** tiktok-video-skills · [https://github.com/iart-ai/tiktok-video-skills](https://github.com/iart-ai/tiktok-video-skills)

**Como instalar:** `git clone https://github.com/iart-ai/tiktok-video-skills` → copie `<repo>/skills/lower-thirds/` para `~/.claude/skills/`

---

## short-form-video

**O que cria:** gramática de retenção de vertical 9:16: hook, pattern interrupts, loop e safe areas.

**Chaves técnicas:** hook em texto no frame 1 (85% muted); loop aberto ≤3s; punch-in zoom spring 1→1.12; interrupt a cada 2-4s com cortes desiguais; loop seam (último frame = primeiro); sentence loop; safe box central 900×1400 (top 120/bottom 320/right 120px); retention arc hook→setup→body→payoff

**Origem:** tiktok-video-skills · [https://github.com/iart-ai/tiktok-video-skills](https://github.com/iart-ai/tiktok-video-skills)

**Como instalar:** `git clone https://github.com/iart-ai/tiktok-video-skills` → copie `<repo>/skills/short-form-video/` para `~/.claude/skills/`

---

## video-assemble

**O que cria:** síntese final de recap: mix de narração com ducking, legendas SRT/ASS e loudnorm.

**Chaves técnicas:** ducking por envelope fixo com anchors de fim de frase (max 3s hold); SRT→ASS burn via libass; loudnorm two-pass + true-peak limiter 4x oversampling; timeline.json multi-track; export draft 剪映 (jianying); H.264 4:2:0 +faststart com tags BT.709

**Origem:** video-recap-skills · [https://github.com/zenstory-ai/video-recap-skills](https://github.com/zenstory-ai/video-recap-skills)

**Como instalar:** `git clone https://github.com/zenstory-ai/video-recap-skills` → copie `<repo>/skills/video-assemble/` para `~/.claude/skills/`

---

## video-cut

**O que cria:** corta vídeo longo conforme clip_plan com alinhamento à grade de frames e gating de segurança.

**Chaves técnicas:** boundary snap a fim de frase/pausa (nearest_safe); frame-grid alignment (evita concat VFR); scene-cut snap (scdet threshold 0.4, margem 0.5s); required_evidence nodes; --review-shots召回 curtos

**Origem:** video-recap-skills · [https://github.com/zenstory-ai/video-recap-skills](https://github.com/zenstory-ai/video-recap-skills)

**Como instalar:** `git clone https://github.com/zenstory-ai/video-recap-skills` → copie `<repo>/skills/video-cut/` para `~/.claude/skills/`

---

## video-recap

**O que cria:** orquestrador de 5 skills que produz recap narrado (entender→script→cortar→dublar→montar).

**Chaves técnicas:** cadeia video-understanding→script→cut→voiceover→assemble via work_dir JSONs; MiMo ASR/VLM/TTS; modos full/cut/dub; dub com voiceclone (+--confirm-voice-rights); final_qc gate; recurso biblioteca de estilos

**Origem:** video-recap-skills · [https://github.com/zenstory-ai/video-recap-skills](https://github.com/zenstory-ai/video-recap-skills)

**Como instalar:** `git clone https://github.com/zenstory-ai/video-recap-skills` → copie `<repo>/skills/video-recap/` para `~/.claude/skills/`

---

## video-script

**O que cria:** planeja direção/cortes e escreve narração com timestamps validadas.

**Chaves técnicas:** recap_story_plan.json (POV, beats por "mudança"); visual_audio_board (audio_owner, narration_job); modos CREATE/DIRECTED/REVISION; review.py semântico anti-hallucination; narration_job enum; contrafactuais (7 self-checks)

**Origem:** video-recap-skills · [https://github.com/zenstory-ai/video-recap-skills](https://github.com/zenstory-ai/video-recap-skills)

**Como instalar:** `git clone https://github.com/zenstory-ai/video-recap-skills` → copie `<repo>/skills/video-script/` para `~/.claude/skills/`

---

## video-understanding

**O que cria:** analisa vídeo em índice estruturado (cenas, ASR, VLM, silêncios, timeline).

**Chaves técnicas:** scenes.json (scdet); asr_result.json (mimo-v2.5-asr); vlm_analysis.json frame_facts; silence_periods; speech_boundary_anchors; storyboard contact sheets; timeline_fusion.json; agent_narration_brief.md

**Origem:** video-recap-skills · [https://github.com/zenstory-ai/video-recap-skills](https://github.com/zenstory-ai/video-recap-skills)

**Como instalar:** `git clone https://github.com/zenstory-ai/video-recap-skills` → copie `<repo>/skills/video-understanding/` para `~/.claude/skills/`

---

## video-voiceover

**O que cria:** TTS por segmentos a partir de narration.json com cache e adaptação de velocidade.

**Chaves técnicas:** MiMo TTS / Fish Audio / IndexTTS; cache por conteúdo (não re-sintetiza trecho igual); rate adaptation em janela temporal (2.5字/s floor); detecção de TTS幻读 (hallucinated speech) por limite de duração; voiceclone --voice-ref 30s WAV; preserve-approved-text

**Origem:** video-recap-skills · [https://github.com/zenstory-ai/video-recap-skills](https://github.com/zenstory-ai/video-recap-skills)

**Como instalar:** `git clone https://github.com/zenstory-ai/video-recap-skills` → copie `<repo>/skills/video-voiceover/` para `~/.claude/skills/`

---

## audiogram

**O que cria:** vídeo de waveform/audiogram com captions sincronizadas e layout social.

**Chaves técnicas:** visualizeAudio()/useAudioData() frame-driven (nunca AnalyserNode ao vivo); bars mirrored power-of-two; oscilloscope visualizeAudioWaveform(); layout 5 camadas (bg, cover+title, wave, captions, progress bar); trim ≤90s / useWindowedAudioData; 1:1 e 9:16 de uma composição

**Origem:** youtube-video-skills · [https://github.com/iart-ai/youtube-video-skills](https://github.com/iart-ai/youtube-video-skills)

**Como instalar:** `git clone https://github.com/iart-ai/youtube-video-skills` → copie `<repo>/skills/audiogram/` para `~/.claude/skills/`

---

## youtube-intro-outro

**O que cria:** intro 3-5s (logo sting) e outro/end screen ≥20s p/ YouTube com zonas de elementos.

**Chaves técnicas:** sting windup→impact→settle (3 beats ~3.5s); spring 1.18→1 snap + white flash decaindo 6 frames; IMPACT = round(0.8*fps) sincronizado ao pico do áudio; end-screen: direito 2/3 vazio p/ cards YouTube, marca no terço esquerdo; brand prop p/ re-skin batch

**Origem:** youtube-video-skills · [https://github.com/iart-ai/youtube-video-skills](https://github.com/iart-ai/youtube-video-skills)

**Como instalar:** `git clone https://github.com/iart-ai/youtube-video-skills` → copie `<repo>/skills/youtube-intro-outro/` para `~/.claude/skills/`

