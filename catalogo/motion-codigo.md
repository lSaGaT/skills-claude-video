# Motion graphics & animação em código

**26 skills** · [← voltar ao índice](../README.md)

---

## canvas-procedural-animation

**O que cria:** animações procedurais p5.js/canvas (partículas, clima, squash/stretch, walk cycles).

**Chaves técnicas:** estado determinístico por tempo/frame (millis), overlays de chuva/neve/folhas/partículas ambientais, squash/stretch procedural, walk cycles, regex p5 setup/draw em canvas 1920x1080.

**Origem:** OpenMontage · [https://github.com/calesthio/OpenMontage](https://github.com/calesthio/OpenMontage)

**Como instalar:** Copie a pasta `skills/motion-codigo/canvas-procedural-animation/` deste repo para `~/.claude/skills/` (ou `.agents/skills/`, conforme seu agente). Corpo de origem: https://github.com/calesthio/OpenMontage.

**Pasta no repo:** `skills/motion-codigo/canvas-procedural-animation/`

---

## character-animation-qa

**O que cria:** QA de animação de personagem (schema, preview Playwright, sampling de frames, ffprobe).

**Chaves técnicas:** 6 camadas de revisão (schema→assets→browser preview→comparação de frames amostrados→ffprobe MP4→revisão visual), Playwright screenshot, veredicto pass/revise/fail, checagem de membros destacados/texto quebrado.

**Origem:** OpenMontage · [https://github.com/calesthio/OpenMontage](https://github.com/calesthio/OpenMontage)

**Como instalar:** Copie a pasta `skills/motion-codigo/character-animation-qa/` deste repo para `~/.claude/skills/` (ou `.agents/skills/`, conforme seu agente). Corpo de origem: https://github.com/calesthio/OpenMontage.

**Pasta no repo:** `skills/motion-codigo/character-animation-qa/`

---

## character-rigging

**O que cria:** rigs 2D data-driven p/ animação local (partes, pivots, layers, constraints).

**Chaves técnicas:** rig_plan JSON (parts com kind/layer/parent, joints com pivot+faixa de rotação), pivots no espaço SVG (GSAP svgOrigin), bocas e olhos como assets separados, Remotion frame-driven determinístico.

**Origem:** OpenMontage · [https://github.com/calesthio/OpenMontage](https://github.com/calesthio/OpenMontage)

**Como instalar:** Copie a pasta `skills/motion-codigo/character-rigging/` deste repo para `~/.claude/skills/` (ou `.agents/skills/`, conforme seu agente). Corpo de origem: https://github.com/calesthio/OpenMontage.

**Pasta no repo:** `skills/motion-codigo/character-rigging/`

---

## motion-graphics

**O que cria:** Workflow HyperFrames para motion graph curto design-led — kinetic-type, stat, charts, logo-reveal, lower-thirds e categorias search-driven.

**Chaves técnicas:** categorias form (kinetic-type, stat com apple-money-count/counting-dynamic-scale/stat-bars-and-fills, charts via data-chart, logo-reveal via svg-path-draw, lower-thirds), asset-first (buscar antes de desenhar), asset-fusion RWA (geometria do asset vira o chart), pipeline plan→source→design→build→render→verify com shot-plan.json, render --format webm/mov para overlay transparente

**Origem:** OpenMontage · [https://github.com/calesthio/OpenMontage](https://github.com/calesthio/OpenMontage)

**Como instalar:** Copie a pasta `skills/motion-codigo/motion-graphics/` deste repo para `~/.claude/skills/` (ou `.agents/skills/`, conforme seu agente). Corpo de origem: https://github.com/calesthio/OpenMontage.

**Pasta no repo:** `skills/motion-codigo/motion-graphics/`

---

## music-to-video

**O que cria:** Workflow beat-synced: uma trilha → vídeo com frames cortados no beat grid (lyric video, kinetic promo).

**Chaves técnicas:** analyze-beatgrid.py único (audiomap.json: energy phases, onsets, rolls, silences, hard_stops, key_moments, frases, bpm), 1 frame = 1 arquivo de composição, pacing beat_cut vs phrase_flow, catálogo de templates + motion primitives L0, assemble-index.mjs (hard cuts sem gaps), STORYBOARD.md + frame.md preset de marca, portrait 1080x1920

**Origem:** OpenMontage · [https://github.com/calesthio/OpenMontage](https://github.com/calesthio/OpenMontage)

**Como instalar:** Copie a pasta `skills/motion-codigo/music-to-video/` deste repo para `~/.claude/skills/` (ou `.agents/skills/`, conforme seu agente). Corpo de origem: https://github.com/calesthio/OpenMontage.

**Pasta no repo:** `skills/motion-codigo/music-to-video/`

---

## pose-library-design

**O que cria:** Projeta bibliotecas de poses 2D reutilizáveis (ações, ciclos, expressões) para animação data-driven.

**Chaves técnicas:** categorias de poses (neutral/attention/emotion/action/mouth), padrão de atuação anticipation→action→hold→settle, JSON de pose (só partes alteradas, hold_frames, transition back.out), ciclos de walk com contact+passing, checklist (holds longos o bastante, partes conectadas nos pivôs)

**Origem:** OpenMontage · [https://github.com/calesthio/OpenMontage](https://github.com/calesthio/OpenMontage)

**Como instalar:** Copie a pasta `skills/motion-codigo/pose-library-design/` deste repo para `~/.claude/skills/` (ou `.agents/skills/`, conforme seu agente). Corpo de origem: https://github.com/calesthio/OpenMontage.

**Pasta no repo:** `skills/motion-codigo/pose-library-design/`

---

## svg-character-animation

**O que cria:** Anima rigs de personagem feitos em partes SVG com GSAP, CSS, Remotion e HyperFrames.

**Chaves técnicas:** gsap.set svgOrigin para pivôs estáveis, timeline multi-partia com defaults power2.inOut, padrão Remotion (timeline.progress(frame/duration) em timeline pausada), padrão HyperFrames determinístico, checklist (partes conectadas nos pivôs, blinks/gaze/boca separados, holds legíveis, deltas por frame)

**Origem:** OpenMontage · [https://github.com/calesthio/OpenMontage](https://github.com/calesthio/OpenMontage)

**Como instalar:** Copie a pasta `skills/motion-codigo/svg-character-animation/` deste repo para `~/.claude/skills/` (ou `.agents/skills/`, conforme seu agente). Corpo de origem: https://github.com/calesthio/OpenMontage.

**Pasta no repo:** `skills/motion-codigo/svg-character-animation/`

---

## synthetic-screen-recording

**O que cria:** Ensina a sintetizar screen recordings falsos (TerminalScene Remotion) em vez de capturar o desktop real.

**Chaves técnicas:** TerminalScene (steps cmd/out/pause/pill, typeSpeed 0.035s/char, holdSeconds ≥0.3, auto-scroll 18 linhas, cursor piscando), regra "pace with narration, never ahead" (pausa inicial ≥2s, comando aterrissa na fala, trace de soma de durações), ProviderChip (badge rotativo de providers), generalização para fake UI (chat, PR diff, Slack, VS Code), heurística sintetizar vs capturar

**Origem:** OpenMontage · [https://github.com/calesthio/OpenMontage](https://github.com/calesthio/OpenMontage)

**Como instalar:** Copie a pasta `skills/motion-codigo/synthetic-screen-recording/` deste repo para `~/.claude/skills/` (ou `.agents/skills/`, conforme seu agente). Corpo de origem: https://github.com/calesthio/OpenMontage.

**Pasta no repo:** `skills/motion-codigo/synthetic-screen-recording/`

---

## website-to-video

**O que cria:** Captura um site e produz vídeo HyperFrames por beats, com gates de validação em 7 passos.

**Chaves técnicas:** captura headless Chrome; DESIGN.md de marca; storyboard conceito→arc→beats; TTS HeyGen/ElevenLabs/Kokoro + transcript.json; hyperframes lint/validate/snapshot por beat; 13 técnicas de animação primitivas; formatos 1080x1920

**Origem:** OpenMontage · [https://github.com/calesthio/OpenMontage](https://github.com/calesthio/OpenMontage)

**Como instalar:** Copie a pasta `skills/motion-codigo/website-to-video/` deste repo para `~/.claude/skills/` (ou `.agents/skills/`, conforme seu agente). Corpo de origem: https://github.com/calesthio/OpenMontage.

**Pasta no repo:** `skills/motion-codigo/website-to-video/`

---

## adu-motion-video

**O que cria:** Pacote chinês de re-animação: adapta packs de motion completos (11 estilos) a nova narração/copy e exporta MP4 60fps editável.

**Chaves técnicas:** pipeline.py macro-plan→macro-build→macro-rematch com brief.json semântico (entrada Windows python), estilos/groups: stage/editorial/kinetic-performance, paper-balance, paper-ball aggregation, dark-3D multi-screen showcase (anim4-showcase-macro), vivid-sticker, vibrant-color (portrait-only), face tracking (macOS Vision/OpenCV, fallback fixed cx/cy), SFX seeds isolados da música, binding music:{mode:"track",path,offset}, TPL leves, handdrawn continuation, verificação de rhythm/repetição no report.

**Origem:** adu-motion-video

**Como instalar:** Copie a pasta `skills/motion-codigo/adu-motion-video/` deste repo para `~/.claude/skills/` (ou `.agents/skills/`, conforme seu agente). Corpo de origem: `editor-chefe/skills/adu-motion-video`.

**Pasta no repo:** `skills/motion-codigo/adu-motion-video/`

---

## synthetic-ui-demo

**O que cria:** demos de produto sem screen-recording: reconstrói telas do app em React estático e as anima com cursor e câmera scriptados.

**Chaves técnicas:** Stage (chrome+camera+cursor), camera keyframes {f,z,x,y} clamped; cursorAt/near hover; typed() por frame; alvos de clique como constantes rect (SAVE_BTN={x,y,w,h}); contact sheet de stills p/ validar clique; voice-first + header de timings; UI só função de frame

**Origem:** claude-code-video-toolkit · [https://github.com/digitalsamba/claude-code-video-toolkit](https://github.com/digitalsamba/claude-code-video-toolkit)

**Como instalar:** Copie a pasta `skills/motion-codigo/synthetic-ui-demo/` deste repo para `~/.claude/skills/` (ou `.agents/skills/`, conforme seu agente). Corpo de origem: https://github.com/digitalsamba/claude-code-video-toolkit.

**Pasta no repo:** `skills/motion-codigo/synthetic-ui-demo/`

---

## motion-design (claude-motion-design)

**O que cria:** pipeline 100% código (HTML seek(t) → Playwright frame a frame → ffmpeg) p/ filmes de motion design, com crítica, música/SFX e remake frame-locked.

**Chaves técnicas:** engine seek(t) determinística (sem CSS transitions); springs fechadas step(tau,f,z) damping≥0.72; câmera log-zoom + beat punches +0.012; masked text rise word-stagger 55ms; floods circulares (hypot 4 cantos ×1.05, 0.3-0.35s); tmix subframes shutter 0.5 + supersample 2x; pop-scan/loop seam posição+velocidade; drops de música por energia + loudnorm −14 LUFS; critique loop contact sheets nota 8+; cut seams no pico de velocidade; anti-"AI motion" (1 coisa se move por vez)

**Origem:** claude-motion-design

**Como instalar:** Copie a pasta `skills/motion-codigo/motion-design/` deste repo para `~/.claude/skills/` (ou `.agents/skills/`, conforme seu agente). Corpo de origem: `editor-chefe/skills/claude-motion-design`.

**Pasta no repo:** `skills/motion-codigo/motion-design/`

---

## dashi-animationstyle

**O que cria:** transforma narração de 15-60s em animação de estilo de desenho (7 presets) 100% HTML/Canvas + Chrome headless frame a frame.

**Chaves técnicas:** 7 estilos (fluxograma flat, anotações à mão, jornal retrô, recorte de papel, colagem surreal, cartoon 3D, tech fundo preto); timeline window.TL com tempos por caractere; marks/keywords com timing por palavra; 2 palavras com cor fixa A/B + ênfase na legenda por correspondência exata; mudança lista entrada→ação→ação secundária→saída (novo a cada 2-3s); ≥3 transições em rotação (glitch/wipe/iris/sweep/pan); 480px legibilidade check; verificação de riqueza diff 2.5s; resetCtx por frame; determinismo check

**Origem:** dashi-animationstyle

**Como instalar:** Copie a pasta `skills/motion-codigo/dashi-animationstyle/` deste repo para `~/.claude/skills/` (ou `.agents/skills/`, conforme seu agente). Corpo de origem: `editor-chefe/skills/dashi-animationstyle`.

**Pasta no repo:** `skills/motion-codigo/dashi-animationstyle/`

---

## isometric-animation

**O que cria:** cenas isométricas 2.5D (CSS 3D/SVG/Three Orthographic): blocos extrudados, camadas empilhadas, exploded views, drift de câmera.

**Chaves técnicas:** true iso rotateX(60)rotateZ(45) eixos ±30°; 2:1 dimetric 26.57°; per-face shading top/médio/escuro; build bottom-up back.out stagger 0.12-0.15s; explode/assemble via translateZ; OrthographicCamera (10,10,10); parallax por --z; sem perspective

**Origem:** explainer-video-skills · [https://github.com/iart-ai/explainer-video-skills](https://github.com/iart-ai/explainer-video-skills)

**Como instalar:** Copie a pasta `skills/motion-codigo/isometric-animation/` deste repo para `~/.claude/skills/` (ou `.agents/skills/`, conforme seu agente). Corpo de origem: https://github.com/iart-ai/explainer-video-skills.

**Pasta no repo:** `skills/motion-codigo/isometric-animation/`

---

## guizang-product-video-skill

**O que cria:** produz promo de produto de software com componentes reais do produto, GSAP/Three.js, trilha própria e SFX, com direção dedicada antes do código.

**Chaves técnicas:** DIRECTION.md (3 direções +手法 derivados do produto, plano de plano por segundo); componentes reais montados em browser com fixture; estilo repo/default/hybrid; primeira ~5-10 frames = imagem completa p/ thumbnail; budget 45-60s; 2fps contact sheet + 10fps strips de transição; check_delivery.py; fx-lab (streamline field, particle convergence, glow horizon, slice, orbit); mixing com sfx_landmarks.

**Origem:** guizang-product-video-skill

**Como instalar:** Copie a pasta `skills/motion-codigo/guizang-product-video-skill/` deste repo para `~/.claude/skills/` (ou `.agents/skills/`, conforme seu agente). Corpo de origem: `editor-chefe/skills/guizang-product-video-skill`.

**Pasta no repo:** `skills/motion-codigo/guizang-product-video-skill/`

---

## javascript-animation

**O que cria:** filme curto onde todo frame é desenhado em código num único HTML canvas determinístico → MP4, com self-check completo.

**Chaves técnicas:** storyboard como dados (BPM, SECTIONS, SHOTS, EVENTS lidos por cena/câmera/trilha — sync por construção); withCamera por shot; claim()/placeFree() anti-colisão de texto; wobble "boil" com seed trocado a cada 4 frames (~7.5Hz = desenhado à mão, não jitter); formas arredondadas, draw order back-to-front; scripts render.mjs (contact sheet 1fps/stills/MP4+SCORE), asset-audit (prova zero-asset), layout-check, sync-check; QC 2 passes (conformidade de storyboard + diretor).

**Origem:** javascript-animation-skills · [https://github.com/iart-ai/javascript-animation-skills](https://github.com/iart-ai/javascript-animation-skills)

**Como instalar:** Copie a pasta `skills/motion-codigo/javascript-animation/` deste repo para `~/.claude/skills/` (ou `.agents/skills/`, conforme seu agente). Corpo de origem: https://github.com/iart-ai/javascript-animation-skills.

**Pasta no repo:** `skills/motion-codigo/javascript-animation/`

---

## motion-background

**O que cria:** fundos animados sutis — CSS mesh, shader GLSL aurora, partículas constelação, loops seamless.

**Chaves técnicas:** mesh radial-gradient keyframes idênticos 0/100%, fbm value noise (Three.js full-screen quad), canvas constellation com linhas por distância, loop por fase senoidal, scrim, prefers-reduced-motion

**Origem:** motion-design-skills · [https://github.com/iart-ai/motion-design-skills](https://github.com/iart-ai/motion-design-skills)

**Como instalar:** Copie a pasta `skills/motion-codigo/motion-background/` deste repo para `~/.claude/skills/` (ou `.agents/skills/`, conforme seu agente). Corpo de origem: https://github.com/iart-ai/motion-design-skills.

**Pasta no repo:** `skills/motion-codigo/motion-background/`

---

## apple-launch-film

**O que cria:** film de lançamento estilo Apple/Mac em código — notch que vira widgets, wallpapers, uma caption por cena.

**Chaves técnicas:** notch com springs por eixo, wallpaper gradiente por cena, caption com última palavra tinted, "hello" script, springs não tweens, comparação frame a frame com referência, HyperFrames export

**Origem:** motion-graphics-skills · [https://github.com/charlie947/motion-graphics-skills](https://github.com/charlie947/motion-graphics-skills)

**Como instalar:** Copie a pasta `skills/motion-codigo/apple-launch-film/` deste repo para `~/.claude/skills/` (ou `.agents/skills/`, conforme seu agente). Corpo de origem: https://github.com/charlie947/motion-graphics-skills.

**Pasta no repo:** `skills/motion-codigo/apple-launch-film/`

---

## launch-video (motion-graphics · charlie947)

**O que cria:** vídeo de lançamento 30-45s em código — uma frase dividida em beats, prova real, número e CTA.

**Chaves técnicas:** beat sheet 7 beats (hook/proof/produto funcionando/quality/how/count-up/CTA), glass UI, prompt typed live, banned list (typewriter/glow/bounce), 10s em 2-3 estilos antes do resto, window.seek

**Origem:** motion-graphics-skills · [https://github.com/charlie947/motion-graphics-skills](https://github.com/charlie947/motion-graphics-skills)

**Como instalar:** Copie a pasta `skills/motion-codigo/launch-video/` deste repo para `~/.claude/skills/` (ou `.agents/skills/`, conforme seu agente). Corpo de origem: https://github.com/charlie947/motion-graphics-skills.

**Pasta no repo:** `skills/motion-codigo/launch-video/`

---

## loop-cover

**O que cria:** capa GIF em loop seamless 896x640 — só um elemento nomeado se move, seam medido.

**Chaves técnicas:** máscara por cor + edge soft, rotação do loop (frame 1 = imagem completa via offset), palettegen/paletteuse dither=none, medida de seam python, excursion alvo, eq eval=frame

**Origem:** motion-graphics-skills · [https://github.com/charlie947/motion-graphics-skills](https://github.com/charlie947/motion-graphics-skills)

**Como instalar:** Copie a pasta `skills/motion-codigo/loop-cover/` deste repo para `~/.claude/skills/` (ou `.agents/skills/`, conforme seu agente). Corpo de origem: https://github.com/charlie947/motion-graphics-skills.

**Pasta no repo:** `skills/motion-codigo/loop-cover/`

---

## milestone-reveal

**O que cria:** clip 12s de marco — milhares de partículas convergem no número real, linha e label, loop sem salto.

**Chaves técnicas:** ~3200 partículas com seed fixo, sampling de pixels do número em offscreen canvas, pull com ease gravidade staggered, linha accent desenhando, willReadFrequently:true, seam 0 medido, HyperFrames export

**Origem:** motion-graphics-skills · [https://github.com/charlie947/motion-graphics-skills](https://github.com/charlie947/motion-graphics-skills)

**Como instalar:** Copie a pasta `skills/motion-codigo/milestone-reveal/` deste repo para `~/.claude/skills/` (ou `.agents/skills/`, conforme seu agente). Corpo de origem: https://github.com/charlie947/motion-graphics-skills.

**Pasta no repo:** `skills/motion-codigo/milestone-reveal/`

---

## model-showdown

**O que cria:** comparação justa de 3 modelos de IA no mesmo brief, empilhados num vídeo 16:9 e num reel vertical.

**Chaves técnicas:** fair-test (first try, mesmo renderer/settings), overlay.png transparente 1080x1920, stack ffmpeg de 3 painéis com crop/setsar, tags bt709/yuv420p, safe zones, labels em tile escuro

**Origem:** motion-graphics-skills · [https://github.com/charlie947/motion-graphics-skills](https://github.com/charlie947/motion-graphics-skills)

**Como instalar:** Copie a pasta `skills/motion-codigo/model-showdown/` deste repo para `~/.claude/skills/` (ou `.agents/skills/`, conforme seu agente). Corpo de origem: https://github.com/charlie947/motion-graphics-skills.

**Pasta no repo:** `skills/motion-codigo/model-showdown/`

---

## motion-effects

**O que cria:** 16 efeitos premium receitados (UI, dados, tipo, sistemas) como loop HTML 8s com window.seek.

**Chaves técnicas:** button→player, search→results, card→workspace, tabs→panels, chart morph, dashboard zoom, spring stack, magnetic dock, masked type, elastic type, text→layout, image reveal, perspective shift, glass focus, flowing paths, particle logo; ghost do estado inicial, stagger por beat, hold vivo

**Origem:** motion-graphics-skills · [https://github.com/charlie947/motion-graphics-skills](https://github.com/charlie947/motion-graphics-skills)

**Como instalar:** Copie a pasta `skills/motion-codigo/motion-effects/` deste repo para `~/.claude/skills/` (ou `.agents/skills/`, conforme seu agente). Corpo de origem: https://github.com/charlie947/motion-graphics-skills.

**Pasta no repo:** `skills/motion-codigo/motion-effects/`

---

## business-motion-film

**O que cria:** pipeline de comercial premium para negócio real — storyboard, componentes isolados, Gauntlet de críticos, áudio por último.

**Chaves técnicas:** storyboard 12-15 composições com transição nomeada, lead subject 60-85% do frame, AI still→image-to-video com brief de produção, component-lab + Gauntlet por componente, projected-overlays de anchors 3D, frozen-time.sh, loudness.sh, backtime-music.py, solve-sfx-gains.py, regras de verdade (nunca inventar claim)

**Origem:** motion-video-kit

**Como instalar:** Copie a pasta `skills/motion-codigo/business-motion-film/` deste repo para `~/.claude/skills/` (ou `.agents/skills/`, conforme seu agente). Corpo de origem: `editor-chefe/skills/motion-video-kit`.

**Pasta no repo:** `skills/motion-codigo/business-motion-film/`

---

## motionmaxxing

**O que cria:** direção+build de films de motion com craft laws medidas de 53 recreações profissionais e gates por script.

**Chaves técnicas:** brand capture por URL (brand.mjs/fetch_logo), 12 "never ship" (HUD chrome, deck layout, stat wall, slogan copy, house style default), craft laws (cut on motion, land decelerates/leave accelerates, arrival de ~3.5x, no dead frame, um accent), gates G0-G5 (look.py/lint.mjs), voice.py ElevenLabs VO/SFX/music, mix.py, palavras 0-2f antes do áudio

**Origem:** motionmaxxing

**Como instalar:** Copie a pasta `skills/motion-codigo/motionmaxxing/` deste repo para `~/.claude/skills/` (ou `.agents/skills/`, conforme seu agente). Corpo de origem: `editor-chefe/skills/motionmaxxing`.

**Pasta no repo:** `skills/motion-codigo/motionmaxxing/`

---

## onetake

**O que cria:** composição HTML de film de produto com move library medida, motion blur real por shutter e oracle de ritmo/continuidade.

**Chaves técnicas:** analyze_ref (energy map, t80, smear), 3 conceitos centrais, carry em cada fronteira (morphRect, iris, zoomThrough, gather→seal), OM.camera que persegue o sujeito, shutter 180° multi-seek, 39 moves (curvas por t80), UI reconstruída de screenshots + timeWarp i18n, mão desenhada do path gravado, sfx palette 1 sala (-8dBFS), verify_promo (rhythm/burst/continuity/curves/framing), draft 1080p30→final 4K60

**Origem:** onetake

**Como instalar:** Copie a pasta `skills/motion-codigo/onetake/` deste repo para `~/.claude/skills/` (ou `.agents/skills/`, conforme seu agente). Corpo de origem: `editor-chefe/skills/onetake`.

**Pasta no repo:** `skills/motion-codigo/onetake/` *(assets pesados ficaram de fora — pegue na origem)*

