# HyperFrames & Remotion (HTML/React → vídeo)

**37 skills** · [← voltar ao índice](../README.md)

---

## hyperframes-animation

**O que cria:** Todo o conhecimento de animação do HyperFrames — regras atômicas, blueprints, transições e 7 adapters de runtime.

**Chaves técnicas:** rules-index (compor 2-4 regras atômicas), blueprints multi-fase (brand-reveal, social-proof), transições CSS entre clipes (transitions/catalog), adapters GSAP/Lottie/Three.js/Anime.js/CSS/WAAPI/TypeGPU, 24 efeitos de texto nomeados (animate-text), animation-map.mjs (auditoria de dead zones/stagger), layout constants pré-calculados (nunca getBoundingClientRect em tween time)

**Origem:** OpenMontage · [https://github.com/calesthio/OpenMontage](https://github.com/calesthio/OpenMontage)

**Como instalar:** Copie a pasta `skills/render-codigo/hyperframes-animation/` deste repo para `~/.claude/skills/` (ou `.agents/skills/`, conforme seu agente). Corpo de origem: https://github.com/calesthio/OpenMontage.

**Pasta no repo:** `skills/render-codigo/hyperframes-animation/`

---

## hyperframes-cli

**O que cria:** referência da CLI HyperFrames por tarefa: scaffold, check, snapshot, timeline, render local/cloud, histórico.

**Chaves técnicas:** lint (composition-id, overlap de tracks), validate (console errors + contraste WCAG), inspect (texto transbordando + verificação de motion via *.motion.json), snapshot --at/--frames (smoke test de sub-comps), render --docker --strict, lambda deploy/render/destroy, pós-render [ -s ] + ffprobe

**Origem:** hyperframes

**Também em:** OpenMontage (https://github.com/calesthio/OpenMontage) — OpenMontage/.agents/skills/hyperframes-cli/SKILL.md

**Como instalar:** Copie a pasta `skills/render-codigo/hyperframes-cli/` deste repo para `~/.claude/skills/` (ou `.agents/skills/`, conforme seu agente). Corpo de origem: `editor-chefe/skills/hyperframes`.

**Pasta no repo:** `skills/render-codigo/hyperframes-cli/`

---

## hyperframes-core

**O que cria:** Contrato técnico de composição HyperFrames (HTML→vídeo) — data-*, clips, tracks, sub-composições, determinismo.

**Chaves técnicas:** data-composition-id/start/duration/track-index, class="clip", sub-comps via <template> + data-composition-src, uma timeline paused em window.__timelines, regras de determinismo (sem Math.random/repeat:-1/display/gsap.set em cenas futuras), allowlist de propriedades animáveis, ids únicos (id duplicado de <video> renderiza blank), fundo full-bleed em child e não no root

**Origem:** OpenMontage · [https://github.com/calesthio/OpenMontage](https://github.com/calesthio/OpenMontage)

**Como instalar:** Copie a pasta `skills/render-codigo/hyperframes-core/` deste repo para `~/.claude/skills/` (ou `.agents/skills/`, conforme seu agente). Corpo de origem: https://github.com/calesthio/OpenMontage.

**Pasta no repo:** `skills/render-codigo/hyperframes-core/`

---

## hyperframes-registry

**O que cria:** catálogo de ~450 blocos/componentes HyperFrames instaláveis como código editável (transições, overlays, títulos, captions, charts, 3D).

**Chaves técnicas:** catalog --query em inglês (tier words / --on-device semântico ~33MB); add <name> com snippet de montagem; blocos ex.: beat-freeze-cut, chromatic-radial-split, camcorder-hud, lt-clean-bar, ai-chat-reveal, bar-chart-race, camera-shake, before-after-wipe, grain-overlay, caption-clip-wipe; wiring block (data-composition-src) vs component (copiar markup); variáveis via --vars.

**Origem:** hyperframes

**Também em:** OpenMontage (https://github.com/calesthio/OpenMontage) — OpenMontage/.agents/skills/hyperframes-registry/SKILL.md

**Como instalar:** Copie a pasta `skills/render-codigo/hyperframes-registry/` deste repo para `~/.claude/skills/` (ou `.agents/skills/`, conforme seu agente). Corpo de origem: `editor-chefe/skills/hyperframes`.

**Pasta no repo:** `skills/render-codigo/hyperframes-registry/`

---

## hyperframes

**O que cria:** contrato central do HyperFrames (HTML → vídeo por seek frame a frame): clips, timelines pausadas, work loop e tipos de filme.

**Chaves técnicas:** contract: class="clip" + data-start/duration, root data-duration, window.__timelines[id], sem Date.now/random/repeat:-1, nunca tween display/autoAlpha no .clip, mídia nunca seekada, fonts @font-face, grades via media-treatment (nunca CSS filter), safe 90%/80%; storylines → SPEC.md com adjetivos como números; snapshot --review → REVIEW.md.

**Origem:** hyperframes

**Também em:** OpenMontage (https://github.com/calesthio/OpenMontage) — OpenMontage/.agents/skills/hyperframes/SKILL.md

**Como instalar:** Copie a pasta `skills/render-codigo/hyperframes/` deste repo para `~/.claude/skills/` (ou `.agents/skills/`, conforme seu agente). Corpo de origem: `editor-chefe/skills/hyperframes`.

**Pasta no repo:** `skills/render-codigo/hyperframes/`

---

## remotion-best-practices

**O que cria:** router das skills Remotion — criação de projeto, Studio, render, captions, docs e upgrade.

**Chaves técnicas:** rules: subtitles, ffmpeg, audio-visualization, sound-effects, 3d, animations, assets, audio, calculate-metadata, charts, compositions, extract-frames, fonts, gifs, light-leaks, lottie, measuring-text, sequencing, tailwind, text-animations, timing (easing/spring), transitions, transparent-videos, trimming, videos, parameters (Zod), maps (Mapbox), voiceover (ElevenLabs).

**Origem:** remotion-skills

**Também em:** OpenMontage (https://github.com/calesthio/OpenMontage) — OpenMontage/.agents/skills/remotion-best-practices/SKILL.md · OpenMontage (https://github.com/calesthio/OpenMontage) — OpenMontage/.claude/skills/remotion-best-practices/SKILL.md

**Como instalar:** Copie a pasta `skills/render-codigo/remotion-best-practices/` deste repo para `~/.claude/skills/` (ou `.agents/skills/`, conforme seu agente). Corpo de origem: `editor-chefe/skills/remotion-skills`.

**Pasta no repo:** `skills/render-codigo/remotion-best-practices/`

---

## remotion-to-hyperframes

**O que cria:** porta código Remotion (e Motion Canvas/Lottie/Three/p5/Manim/AE/Blender) para HyperFrames com verificação frame a frame contra o original.

**Chaves técnicas:** 3 níveis (native HTML+GSAP, hosted driver com adapters Lottie/Three/anime/WAAPI, media clip); lint_source.py bloqueia useState/useEffect/MUI; api-map por API Remotion; snapshot --against + SSIM render_diff.sh + frame_strip; TRANSLATION_NOTES.md.

**Origem:** hyperframes

**Também em:** OpenMontage (https://github.com/calesthio/OpenMontage) — OpenMontage/.agents/skills/remotion-to-hyperframes/SKILL.md

**Como instalar:** Copie a pasta `skills/render-codigo/remotion-to-hyperframes/` deste repo para `~/.claude/skills/` (ou `.agents/skills/`, conforme seu agente). Corpo de origem: `editor-chefe/skills/hyperframes`.

**Pasta no repo:** `skills/render-codigo/remotion-to-hyperframes/`

---

## remotion-official

**O que cria:** router das skills oficiais Remotion: criar projeto, markup, mapas, multimídia, studio, render, captions, SaaS, docs.

**Chaves técnicas:** preview-first no remotion studio (não render por padrão); npx remotion render; TransitionSeries; calculateMetadata; Studio WebMCP; caption/captions REFERENCE

**Origem:** claude-code-video-toolkit · [https://github.com/digitalsamba/claude-code-video-toolkit](https://github.com/digitalsamba/claude-code-video-toolkit)

**Como instalar:** Copie a pasta `skills/render-codigo/remotion-official/` deste repo para `~/.claude/skills/` (ou `.agents/skills/`, conforme seu agente). Corpo de origem: https://github.com/digitalsamba/claude-code-video-toolkit.

**Pasta no repo:** `skills/render-codigo/remotion-official/`

---

## vidtsx-2d-generator

**O que cria:** gera componentes TSX Remotion 2D prontos p/ render com regras duras anti-crash.

**Chaves técnicas:** só frame-based (ban useState/useEffect/CSS anim); interpolate monotônico estrito + clamp; Easing.bezier nomeado (wrappers crasham); chroma-js namespace import; evolvePath (makeCircle etc. não existem); preset vertical 1080×1920; safe zones top 10%/bottom 15%; seededRandom module-level; stagger; still-check antes de "done"

**Origem:** claude-faceless-shorts-creator

**Como instalar:** Copie a pasta `skills/render-codigo/vidtsx-2d-generator/` deste repo para `~/.claude/skills/` (ou `.agents/skills/`, conforme seu agente). Corpo de origem: `editor-chefe/skills/claude-faceless-shorts-creator`.

**Pasta no repo:** `skills/render-codigo/vidtsx-2d-generator/`

---

## hyperframes-motion-director

**O que cria:** dirige filmes de motion com HyperFrames: brief → confirmação → assets → composição → snapshots → render, com house style preto-cinematográfico e regra de promo premium.

**Chaves técnicas:** princípio do frame estático forte como gate; premium product promo rule (biblioteca de componentes com slots de conteúdo, estado e ação obrigatória — comando, output card, stat block, chips; copy ladder dor→mecanismo→prova→confiança→CTA); source-driven visual system (cada componente mapeia frase da fonte); ASSET_MANIFEST.json; cutout contract (crop transparente, teste em sheet claro/escuro); ancoragem de conectores (start/end anchor + deletion test).

**Origem:** hyperframes-motion-director

**Como instalar:** Copie a pasta `skills/render-codigo/hyperframes-motion-director/` deste repo para `~/.claude/skills/` (ou `.agents/skills/`, conforme seu agente). Corpo de origem: `editor-chefe/skills/hyperframes-motion-director`.

**Pasta no repo:** `skills/render-codigo/hyperframes-motion-director/`

---

## captions-overlay

**O que cria:** doutrina de legenda como overlay: modelo drop/rail/embed e lei de que legenda NÃO é banda reservada.

**Chaves técnicas:** drop (filler não mostrado), rail (lower-third verbatim na frente, palavra-ênfase com highlight), embed (palavra grande atrás do sujeito com matte occlusion, ≤1 por beat, espaçadas); overlay law: composição centrada no y=H/2 verdadeiro, nada de banda morta, cortesia de ~80px inferior p/ texto crítico.

**Origem:** hyperframes

**Também em:** 

**Como instalar:** Copie a pasta `skills/render-codigo/captions-overlay/` deste repo para `~/.claude/skills/` (ou `.agents/skills/`, conforme seu agente). Corpo de origem: `editor-chefe/skills/hyperframes`.

**Pasta no repo:** `skills/render-codigo/captions-overlay/`

---

## changelog-video

**O que cria:** converte changelog .md em vídeo de marca ~45-60s quadrado com VO fixo (Annie/HeyGen), fundo animado e mock-UI.

**Chaves técnicas:** prime directive "visualize don't list" (registry ui-recreate/ui-analog/terminal/checklist); scaffold de marca copiado verbatim (fonts, bg-pattern MP4 com eq/drawbox, glass cards); roteiro em duas camadas spoken/display + lexicon fonético; vo-words.json como relógio do filme; fallback whisper forced-alignment; caption rail top:990 com gate de presença em frames; gates: check caption-zone, seam-gate verify.

**Origem:** hyperframes

**Também em:** 

**Como instalar:** Copie a pasta `skills/render-codigo/changelog-video/` deste repo para `~/.claude/skills/` (ou `.agents/skills/`, conforme seu agente). Corpo de origem: `editor-chefe/skills/hyperframes`.

**Pasta no repo:** `skills/render-codigo/changelog-video/`

---

## cut-the-curve

**O que cria:** catálogo de 5 seams velocity-matched + 2 técnicas in-scene para transições que mantêm momento entre cenas.

**Chaves técnicas:** zoom-through (1→1.2 / 0.75→1, blur 10px texto/18-20px full-frame, opacity tween linear separado); inverse zoom-through (chegada oversized 1.25→1, regra de sinal de escala); cut-the-curve default (viagem parcial ~12%≈230px, eases espelhados power4.in/out, fade termina ~25-30% da viagem, ignite a 0.35); waterfall cut palavra-a-palavra (stagger +0.022s, gaps ×0.84); rack-focus blur-cut (swap no pico do blur, ≤1/8s); waterfall entry (overlap ±2 frames, pesos ancorado/normal/leve 60-80/40-50/30-48px); nudge curve 10/65/25 three-phase slide.

**Origem:** hyperframes

**Também em:** 

**Como instalar:** Copie a pasta `skills/render-codigo/cut-the-curve/` deste repo para `~/.claude/skills/` (ou `.agents/skills/`, conforme seu agente). Corpo de origem: `editor-chefe/skills/hyperframes`.

**Pasta no repo:** `skills/render-codigo/cut-the-curve/`

---

## motion-doctrine

**O que cria:** lei de motion de gateway: filme multi-cena como UMA câmera contínua — vector law, current, carriers, motion causal, seam gate.

**Chaves técnicas:** vector law (mesmo eixo/direção/velocidade, corte mid-motion dos dois lados, sinal de escala em Z); "the current" (UMA direção dominante, vetores reservados com significado); ledger.json antes de animar + seam-stamp/seam-gate verify; carriers (cursor, container docking); motion causal (efeito no mesmo frame da causa); ban de idle wobble (5 rotas: staged reveals, camera com intent, UI life, sequências, cursor-led); stillness-before-climax 0.3-0.75s; proibidos bounce.out/elastic.out; back.out(1.4-1.7) ok.

**Origem:** hyperframes

**Também em:** 

**Como instalar:** Copie a pasta `skills/render-codigo/motion-doctrine/` deste repo para `~/.claude/skills/` (ou `.agents/skills/`, conforme seu agente). Corpo de origem: `editor-chefe/skills/hyperframes`.

**Pasta no repo:** `skills/render-codigo/motion-doctrine/`

---

## oversized-cursor

**O que cria:** técnica do cursor macOS gigante como protagonista que carrega o olho, clica e acende o próximo beat.

**Chaves técnicas:** 7cqw full-frame (4.6-5.5cqw em mock), entrada off-screen (top 115%) power3.out, nunca fade-in; tip targeting com transformOrigin 21% 14%; click assimétrico 0.84/1.0 (1:2) + reação paralela do alvo (scale 0.94); "click ignites the next beat" same-frame; drift aside durante beats alheios; exit físico off-frame ou handoff cut-the-curve (cursor viaja 1/3 do caminho antes do corte); brand-motif cursor (ex. multiplayer Figma).

**Origem:** hyperframes

**Também em:** 

**Como instalar:** Copie a pasta `skills/render-codigo/oversized-cursor/` deste repo para `~/.claude/skills/` (ou `.agents/skills/`, conforme seu agente). Corpo de origem: `editor-chefe/skills/hyperframes`.

**Pasta no repo:** `skills/render-codigo/oversized-cursor/`

---

## seam-craft

**O que cria:** doutrina de render-correctness para seams: pré-requisitos que impedem flash branco e erros de composição no timeline master.

**Chaves técnicas:** stage ground opaco (#root background var(--canvas-deep)) contra white-flash quando soma de opacity <1 no corte; injector: data-duration estendido segurando frame final, data-start puxado para overlap, ping-pong de data-track-index 0/1, template GSAP estampado com tokens __OLD__/__NEW__/__T__/__DX__.

**Origem:** hyperframes

**Também em:** 

**Como instalar:** Copie a pasta `skills/render-codigo/seam-craft/` deste repo para `~/.claude/skills/` (ou `.agents/skills/`, conforme seu agente). Corpo de origem: `editor-chefe/skills/hyperframes`.

**Pasta no repo:** `skills/render-codigo/seam-craft/`

---

## canopy-part-title

**O que cria:** block HyperFrames 1920×1080 12s: dossel de folhas varre o frame e se abre revelando duas headlines (three.js + BokehPass).

**Chaves técnicas:** leaf sweep com DOF, folhas retidas com breeze, auto-fit de headline, 11 variáveis, seek-safety via hf-seek + PRNG seedado.

**Origem:** hyperframes

**Como instalar:** Copie a pasta `skills/render-codigo/canopy-part-title/` deste repo para `~/.claude/skills/` (ou `.agents/skills/`, conforme seu agente). Corpo de origem: `editor-chefe/skills/hyperframes`.

**Pasta no repo:** `skills/render-codigo/canopy-part-title/`

---

## code-slice-hero

**O que cria:** block 8s: headline em grid de tiles quadrados que flipam célula a célula sob campo de profundidade gaussiano de um cursor varrendo.

**Chaves técnicas:** tile flip seletivo nas silhuetas das duas headlines, cursor com radius/falloff/tilt variáveis, WebGL 2 instanciado (draw único + shadow batch), bounce elástico no flip, sombra projetada.

**Origem:** hyperframes

**Como instalar:** Copie a pasta `skills/render-codigo/code-slice-hero/` deste repo para `~/.claude/skills/` (ou `.agents/skills/`, conforme seu agente). Corpo de origem: `editor-chefe/skills/hyperframes`.

**Pasta no repo:** `skills/render-codigo/code-slice-hero/`

---

## cuboid-carousel

**O que cria:** block 3D 6.7s: corrente de cubos chanfrados carrega cards em onda viajante com hold hero e saída (three.js).

**Chaves técnicas:** cubos com bevel/rotação staggered, spacing anti-overlap por half-extent, hero card com escala e luz própria, rig de luzes (ambient/top/bottom/key) e sombras 2048, camera dolly com settle + handheld, 40 variáveis, cards via JSON.

**Origem:** hyperframes

**Como instalar:** Copie a pasta `skills/render-codigo/cuboid-carousel/` deste repo para `~/.claude/skills/` (ou `.agents/skills/`, conforme seu agente). Corpo de origem: `editor-chefe/skills/hyperframes`.

**Pasta no repo:** `skills/render-codigo/cuboid-carousel/`

---

## frost-sequence-camera-orbit

**O que cria:** block 22.5s: logo de gelo quebra, se recompõe em dois textos com câmera orbitando (216 variáveis, shader de gelo).

**Chaves técnicas:** material de gelo (transmission, IOR, frost, cracks, dispersion), quebra por slices + ejeção com turbulence/drag, re-montagem com spring + wave spread, orbit camera com passes frontais, bloom/vignette/ACES.

**Origem:** hyperframes

**Como instalar:** Copie a pasta `skills/render-codigo/frost-sequence-camera-orbit/` deste repo para `~/.claude/skills/` (ou `.agents/skills/`, conforme seu agente). Corpo de origem: `editor-chefe/skills/hyperframes`.

**Pasta no repo:** `skills/render-codigo/frost-sequence-camera-orbit/`

---

## glass-shard-title

**O que cria:** block 12.16s: cacos de vidro Voronoi voam e se encaixam como silhueta do headline, depois saem pela câmera.

**Chaves técnicas:** clip Sutherland–Hodgman de blob jitterado contra células Voronoi, fog por fragmento, z-flight desacoplado do ease, HDR/matcap, 19 variáveis.

**Origem:** hyperframes

**Como instalar:** Copie a pasta `skills/render-codigo/glass-shard-title/` deste repo para `~/.claude/skills/` (ou `.agents/skills/`, conforme seu agente). Corpo de origem: `editor-chefe/skills/hyperframes`.

**Pasta no repo:** `skills/render-codigo/glass-shard-title/`

---

## orbit-card

**O que cria:** block 10s: card de feature com recorte circular orbita esfera de pontos com câmera exportada de rig Blender.

**Chaves técnicas:** entrada direita → hold com bob e depth drift → volta orbital completa smoothstep → saída esquerda; F-curves do Blender interpoladas; título/descrição/accent/graus de órbita variáveis.

**Origem:** hyperframes

**Como instalar:** Copie a pasta `skills/render-codigo/orbit-card/` deste repo para `~/.claude/skills/` (ou `.agents/skills/`, conforme seu agente). Corpo de origem: `editor-chefe/skills/hyperframes`.

**Pasta no repo:** `skills/render-codigo/orbit-card/`

---

## wireframe-portal-title

**O que cria:** block 8s: portal wireframe explode, título 3D extrudado atravessa e troca letras por frase segunda.

**Chaves técnicas:** letterforms extrudados de TTF com polygon offsetting (Clipper), burst com chaos variável, swap de letras com auto-size e settle glitch, depth fog.

**Origem:** hyperframes

**Como instalar:** Copie a pasta `skills/render-codigo/wireframe-portal-title/` deste repo para `~/.claude/skills/` (ou `.agents/skills/`, conforme seu agente). Corpo de origem: `editor-chefe/skills/hyperframes`.

**Pasta no repo:** `skills/render-codigo/wireframe-portal-title/`

---

## slideshow

**O que cria:** monta deck HyperFrames para apresentação ao vivo (não MP4) com fragment reveals, hotspots e presenter mode.

**Chaves técnicas:** island JSON slides/fragments/hotspots/slideSequences; navegação por seek (cada hold deve ser frame válido); branch slides; texto ≥40px; hyperframes present; nunca render p/ MP4.

**Origem:** hyperframes

**Como instalar:** Copie a pasta `skills/render-codigo/slideshow/` deste repo para `~/.claude/skills/` (ou `.agents/skills/`, conforme seu agente). Corpo de origem: `editor-chefe/skills/hyperframes`.

**Pasta no repo:** `skills/render-codigo/slideshow/`

---

## remotion-motion

**O que cria:** projeto Remotion (React) do estúdio — setup, scenes por beat, timing da voz, render em fila.

**Chaves técnicas:** setup.mjs template compartilhado, src/video.ts (9:16 1080x1920), voice/timing.json→frames em timing.ts, spring/interpolate com clamp, <Sequence>, remotion still p/ style frames, mfx render queue

**Origem:** mortiflix-oss · [https://github.com/GTKottman/mortiflix-oss](https://github.com/GTKottman/mortiflix-oss)

**Como instalar:** Copie a pasta `skills/render-codigo/remotion-motion/` deste repo para `~/.claude/skills/` (ou `.agents/skills/`, conforme seu agente). Corpo de origem: https://github.com/GTKottman/mortiflix-oss.

**Pasta no repo:** `skills/render-codigo/remotion-motion/`

---

## remotion-video

**O que cria:** vídeo programático em Remotion — compose React, interp/spring, Sequence/Series e render CLI.

**Chaves técnicas:** useCurrentFrame/interpolate clamp/spring, <Sequence>/<Series>, zod schema + calculateMetadata, beat sync detectado offline, loop remotion still→verificar→encode, batch @remotion/renderer, random(seed)

**Origem:** motion-design-skills · [https://github.com/iart-ai/motion-design-skills](https://github.com/iart-ai/motion-design-skills)

**Como instalar:** Copie a pasta `skills/render-codigo/remotion-video/` deste repo para `~/.claude/skills/` (ou `.agents/skills/`, conforme seu agente). Corpo de origem: https://github.com/iart-ai/motion-design-skills.

**Pasta no repo:** `skills/render-codigo/remotion-video/`

---

## remotion-captions

**O que cria:** transcrever, exibir e animar legendas em Remotion via tipo Caption em JSON.

**Chaves técnicas:** tipo Caption (text/startMs/endMs/timestampMs), transcribe-captions.md, display-captions.md, import-srt-captions.md

**Origem:** remotion-skills

**Como instalar:** Copie a pasta `skills/render-codigo/remotion-captions/` deste repo para `~/.claude/skills/` (ou `.agents/skills/`, conforme seu agente). Corpo de origem: `editor-chefe/skills/remotion-skills`.

**Pasta no repo:** `skills/render-codigo/remotion-captions/`

---

## remotion-create

**O que cria:** cria projeto Remotion novo (scaffold create-video) e abre Studio antes de construir a composição.

**Chaves técnicas:** npx create-video@latest --yes --blank --no-tailwind; <Composition>/<Still>; timeline de clips (1 clip = 1 JSX); multi-scene videos; Markup interativo p/ edição no Studio; refs video-layout.md / tailwind.md

**Origem:** remotion-skills

**Como instalar:** Copie a pasta `skills/render-codigo/remotion-create/` deste repo para `~/.claude/skills/` (ou `.agents/skills/`, conforme seu agente). Corpo de origem: `editor-chefe/skills/remotion-skills`.

**Pasta no repo:** `skills/render-codigo/remotion-create/`

---

## remotion-docs

**O que cria:** ensina a buscar e ler docs Remotion via Algolia e páginas .md.

**Chaves técnicas:** POST Algolia (index remotion, apiKey embutida); URL da doc + sufixo .md = markdown; workflow search→fetch→implement

**Origem:** remotion-skills

**Como instalar:** Copie a pasta `skills/render-codigo/remotion-docs/` deste repo para `~/.claude/skills/` (ou `.agents/skills/`, conforme seu agente). Corpo de origem: `editor-chefe/skills/remotion-skills`.

**Pasta no repo:** `skills/render-codigo/remotion-docs/`

---

## remotion-interactivity

**O que cria:** estrutura markup Remotion p/ selecionar/animar elementos no Studio (schemas e Interactive.*).

**Chaves técnicas:** Interactive.Div/Svg/Path; tipos de schema (color, number, svg-path, uv-coordinate); fragmentos textSchema/backgroundSchema; interpolate()/interpolatePaths() inline com Easing.spring p/ morph de paths; refs timeline-structure.md

**Origem:** remotion-skills

**Como instalar:** Copie a pasta `skills/render-codigo/remotion-interactivity/` deste repo para `~/.claude/skills/` (ou `.agents/skills/`, conforme seu agente). Corpo de origem: `editor-chefe/skills/remotion-skills`.

**Pasta no repo:** `skills/render-codigo/remotion-interactivity/`

---

## remotion-maps

**O que cria:** animação de mapas no Remotion com 5 técnicas autocontidas.

**Chaves técnicas:** static-map (satélite em <Img> + animação por cima); Mapbox (globe 3D, prédios); MapLibre (sem key); MapTiler (anotações sobre fronteiras/rios); Cesium (flythrough de terreno); cada técnica tem TECHNIQUE.md próprio

**Origem:** remotion-skills

**Como instalar:** Copie a pasta `skills/render-codigo/remotion-maps/` deste repo para `~/.claude/skills/` (ou `.agents/skills/`, conforme seu agente). Corpo de origem: `editor-chefe/skills/remotion-skills`.

**Pasta no repo:** `skills/render-codigo/remotion-maps/`

---

## remotion-markup

**O que cria:** best practices de markup/anim Remotion: frame-driven, media, efeitos built-in.

**Chaves técnicas:** useCurrentFrame + interpolate() inline; Easing.bezier/spring; output 'perceptual-scale'; @remotion/effects: vignette, zoomBlur, glow, lightLeak, shine, chromaticAberration, halftone, scanlines, pixelate, duotone, motion blur (HtmlInCanvas); transitions.md; voiceover.md (ElevenLabs); audio-visualization.md; text-highlights.md

**Origem:** remotion-skills

**Como instalar:** Copie a pasta `skills/render-codigo/remotion-markup/` deste repo para `~/.claude/skills/` (ou `.agents/skills/`, conforme seu agente). Corpo de origem: `editor-chefe/skills/remotion-skills`.

**Pasta no repo:** `skills/render-codigo/remotion-markup/`

---

## remotion-multimedia

**O que cria:** uso da lib Mediabunny p/ ler metadados de áudio/vídeo no browser.

**Chaves técnicas:** get-audio-duration.md, get-video-duration.md, get-video-dimensions.md (Mediabunny)

**Origem:** remotion-skills

**Como instalar:** Copie a pasta `skills/render-codigo/remotion-multimedia/` deste repo para `~/.claude/skills/` (ou `.agents/skills/`, conforme seu agente). Corpo de origem: `editor-chefe/skills/remotion-skills`.

**Pasta no repo:** `skills/render-codigo/remotion-multimedia/`

---

## remotion-render

**O que cria:** exporta vídeo/stills do Remotion via CLI.

**Chaves técnicas:** npx remotion render; remotion still; render --frames=0,30,90 --image-format=png; transparent-videos.md (vídeo com alpha)

**Origem:** remotion-skills

**Como instalar:** Copie a pasta `skills/render-codigo/remotion-render/` deste repo para `~/.claude/skills/` (ou `.agents/skills/`, conforme seu agente). Corpo de origem: `editor-chefe/skills/remotion-skills`.

**Pasta no repo:** `skills/render-codigo/remotion-render/`

---

## remotion-saas

**O que cria:** construir app/SaaS com Remotion (preview embutido e render server-side).

**Chaves técnicas:** <Player> React; templates SaaS (framework.md); render Lambda/Vercel/Node/Cloudflare; integração Vue/Angular/Svelte

**Origem:** remotion-skills

**Como instalar:** Copie a pasta `skills/render-codigo/remotion-saas/` deste repo para `~/.claude/skills/` (ou `.agents/skills/`, conforme seu agente). Corpo de origem: `editor-chefe/skills/remotion-skills`.

**Pasta no repo:** `skills/render-codigo/remotion-saas/`

---

## remotion-studio

**O que cria:** abre preview Remotion Studio durante o desenvolvimento do vídeo.

**Chaves técnicas:** npx remotion studio (--no-open p/ browser in-app); flags --log/--port/--force-new; URL impressa e processo long-running

**Origem:** remotion-skills

**Como instalar:** Copie a pasta `skills/render-codigo/remotion-studio/` deste repo para `~/.claude/skills/` (ou `.agents/skills/`, conforme seu agente). Corpo de origem: `editor-chefe/skills/remotion-skills`.

**Pasta no repo:** `skills/render-codigo/remotion-studio/`

---

## remotion-upgrade

**O que cria:** atualiza Remotion e pacotes auxiliares de um projeto.

**Chaves técnicas:** npx remotion upgrade; npm view remotion version; alinhar zod/mediabunny com @remotion/studio deps; npx skills update (12 skills remotion); checagem npx remotion versions

**Origem:** remotion-skills

**Como instalar:** Copie a pasta `skills/render-codigo/remotion-upgrade/` deste repo para `~/.claude/skills/` (ou `.agents/skills/`, conforme seu agente). Corpo de origem: `editor-chefe/skills/remotion-skills`.

**Pasta no repo:** `skills/render-codigo/remotion-upgrade/`

