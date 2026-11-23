# Craft, direção & negócio de motion

**26 skills** · [← voltar ao índice](../README.md)

---

## hyperframes-creative

**O que cria:** Direção criativa não-animada do HyperFrames — spec de design, paletas, tipografia, narração, beats.

**Chaves técnicas:** house-style.md ("interpretar prompt gerando conteúdo real", lazy-defaults, receita de layers bg/fg), video-composition.md (densidade "produced, not generated": data bars, registration marks, monospace readouts, 8-10 elementos/cena), beat-direction (ritmo e timing de transições), frame-presets, visual-styles, palettes, data-in-motion, narration (pacing, aberturas, pronúncia de números), audio-reactive (bandas pré-extraídas), design-adherence, contrast-report.mjs

**Origem:** OpenMontage · [https://github.com/calesthio/OpenMontage](https://github.com/calesthio/OpenMontage)

**Como instalar:** `git clone https://github.com/calesthio/OpenMontage` → copie `<repo>/.agents/skills/hyperframes-creative/` para `~/.claude/skills/`

---

## visual-style

**O que cria:** Cria, extrai e aplica sistemas de design portáveis em arquivos visual-style.md (cores, tipografia, motion, mood).

**Chaves técnicas:** modos Create/Extract/Apply/Gallery, campo central style_prompt_full, extractors de website/vídeo/PDF, connectors HeyGen/HTML slides/paper.design/Figma, galeria pré-pronta (Swiss Müller-Brockmann, Neville Brody, Saul Bass, Game Boy), templates minimal/full + spec.

**Origem:** OpenMontage · [https://github.com/calesthio/OpenMontage](https://github.com/calesthio/OpenMontage)

**Também em:** OpenMontage (https://github.com/calesthio/OpenMontage) — OpenMontage/.agents/skills/visual-style/SKILL.md · OpenMontage (https://github.com/calesthio/OpenMontage) — OpenMontage/.claude/skills/visual-style/SKILL.md

**Como instalar:** `git clone https://github.com/calesthio/OpenMontage` → copie `<repo>/.agents/skills/visual-style/` para `~/.claude/skills/`

---

## talking-head-b-roll

**O que cria:** Adiciona b-roll/motion graphics sobre talking-head sem cortar o vídeo: transcreve, planeja tratamentos A/B/C e renderiza camada com alpha.

**Chaves técnicas:** transcrição com word timings (whisper.cpp ou ELEVENLABS_API_KEY), 3 tratamentos (A speaker / B overlay transparente / C cover opaco), timing por elemento (lead de 6 frames vs sync s.audioNow vs reveal gated na palavra), SCENES {from,to,kind,draw(t,s)}, FACE box p/ overlays fora do rosto, regras de ritmo (A≤8s, C 3-8s, abrir/fechar no speaker), render.mjs film.mp4 + b-roll ProRes 4444 alpha / VP9 alpha, --check + contact sheet.

**Origem:** b-roll-skills · [https://github.com/iart-ai/b-roll-skills](https://github.com/iart-ai/b-roll-skills)

**Como instalar:** `git clone https://github.com/iart-ai/b-roll-skills` → copie `<repo>/skills/talking-head-b-roll/` para `~/.claude/skills/`

---

## beat-sync-edit

**O que cria:** Pipeline determinístico de edição no ritmo da música (beatmap→tags→EDL→render) com efeitos ffmpeg em timestamps de beat.

**Chaves técnicas:** beat_map.py (beats/energy/peaks/valleys), clip_tag.py (cenas+motion tags), plan_edit.py (--beat-stride, --lead, --pin, --segment), render_edit.py (--overunder), vertical_style.py (9:16 squeeze+grade), flash_montage.py (seq.json com zoom/cx/cy/stretch/sway, dur múltiplo de beat), cookbook ffmpeg: white/black flash fade 0.07s, punch-in scale/crop 1.15, stretch hit 1.25, hue animado mod(t*180,360), rgbashift RGB split, speed ramp setpts+minterpolate, shake crop sin/cos, strobo negate, dreamy glow gblur+screen, grades colorbalance; regras: flashes só em peaks, 1 efeito assinatura + 1 grade.

**Origem:** beat-synced-edit

**Como instalar:** Coleção local em `editor-chefe/skills/beat-synced-edit/` (sem remote) — copie `.claude/skills/beat-sync-edit/` para `~/.claude/skills/`

---

## brand-motion-guidelines

**O que cria:** documenta um sistema de motion de marca (estilo Slack/IBM): princípios, tokens de duração/easing, biblioteca de movimentos, regras de logo.

**Chaves técnicas:** tokens duration-instant/fast/base/slow/slower (100-600ms); easing decelerate p/ entrada, accelerate p/ saída, emphasized p/ brand moment; biblioteca fade/scale+fade/slide-up/modal/list stagger 30-50ms; regra "saída mais curta que entrada"; do/don't concretos.

**Origem:** freelance-motion-skills · [https://github.com/iart-ai/freelance-motion-skills](https://github.com/iart-ai/freelance-motion-skills)

**Como instalar:** `git clone https://github.com/iart-ai/freelance-motion-skills` → copie `<repo>/skills/brand-motion-guidelines/` para `~/.claude/skills/`

---

## client-revisions

**O que cria:** controla rodadas de revisão e scope creep: linguagem de SOW com cap de rodadas, feedback consolidado e e-mail de change order.

**Chaves técnicas:** distinção revisão×novo pedido; templates de e-mail (consolidated feedback, change order); tradutor de notas vagas ("make it pop" → escolhas + timestamp); cap de 2 rodadas com day rate extra.

**Origem:** freelance-motion-skills · [https://github.com/iart-ai/freelance-motion-skills](https://github.com/iart-ai/freelance-motion-skills)

**Como instalar:** `git clone https://github.com/iart-ai/freelance-motion-skills` → copie `<repo>/skills/client-revisions/` para `~/.claude/skills/`

---

## creative-brief

**O que cria:** transforma pedido vago de cliente em brief assinável com 11 dimensões interrogadas e perguntas prontas por lacuna.

**Chaves técnicas:** 11 dimensões (goal mensurável, audiência, UMA mensagem-core, tom com "but not", mandatories/super/endcard, deliverables contados, placements exatos, refs com "take", timeline reversa, budget, métrica 30 dias); vague-translator; flags [ASSUMPTION]; bloco de sign-off.

**Origem:** freelance-motion-skills · [https://github.com/iart-ai/freelance-motion-skills](https://github.com/iart-ai/freelance-motion-skills)

**Como instalar:** `git clone https://github.com/iart-ai/freelance-motion-skills` → copie `<repo>/skills/creative-brief/` para `~/.claude/skills/`

---

## motion-pricing

**O que cria:** precifica projeto de motion: modelo de preço, matemática do day rate, drivers de custo e quote itemizado.

**Chaves técnicas:** modelos day rate/fixed/per-finished-minute/value-based; fórmula day rate (receita ÷ ~130 dias faturáveis); drivers (duração, complexidade, assets por linha, rodadas, rush +25-50%, usage uplift +25-200%); ranges 2026; cross-check por minuto finalizado.

**Origem:** freelance-motion-skills · [https://github.com/iart-ai/freelance-motion-skills](https://github.com/iart-ai/freelance-motion-skills)

**Como instalar:** `git clone https://github.com/iart-ai/freelance-motion-skills` → copie `<repo>/skills/motion-pricing/` para `~/.claude/skills/`

---

## video-delivery-specs

**O que cria:** especifica entrega por plataforma (Reels/TikTok/YouTube/broadcast), safe areas, legendas e QC de handover.

**Chaves técnicas:** specs 9:16 1080×1920 H.264 8-12Mbps; 4:5 feed; zonas de UI (top ~250px, bottom ~250-400px, coluna direita ~120px TikTok); legenda queimada obrigatória p/ social, .srt sidecar p/ YouTube; master 16:9 com "spine 1:1" e re-layout (não crop) p/ 9:16; bitrate 4K 35-45Mbps; checklist QC (primeiro/último frame limpo, loudness).

**Origem:** freelance-motion-skills · [https://github.com/iart-ai/freelance-motion-skills](https://github.com/iart-ai/freelance-motion-skills)

**Como instalar:** `git clone https://github.com/iart-ai/freelance-motion-skills` → copie `<repo>/skills/video-delivery-specs/` para `~/.claude/skills/`

---

## kinetic-typography

**O que cria:** anima tipografia (headlines, lyrics/captions, variable font) com receitas em CSS/GSAP/Framer/Remotion e timing correto.

**Chaves técnicas:** granularidade line/word/char com stagger 60-100/40-70/20-40ms; 4 reveals workhorse: mask reveal (overflow:hidden + translateY 110%→0), blur-in 12px→0, clip-path wipe inset, char stagger; easeOutExpo cubic-bezier(0.16,1,0.3,1); reveal total ≤800ms; variable font via font-variation-settings ("wght" 200→800); text on path SVG textPath + startOffset; stroke draw-on dashoffset; freeze harness ?t=N + aria-label p/ split; verificação de glyph clip/FOUC.

**Origem:** kinetic-typography-skills · [https://github.com/iart-ai/kinetic-typography-skills](https://github.com/iart-ai/kinetic-typography-skills)

**Como instalar:** `git clone https://github.com/iart-ai/kinetic-typography-skills` → copie `<repo>/skills/kinetic-typography/` para `~/.claude/skills/`

---

## lower-thirds (broadcast · iart-ai)

**O que cria:** lower thirds/overlays broadcast desenhados por frame em canvas e renderizados com alpha (WebM VP9, ProRes 4444, MP4 chroma).

**Chaves técnicas:** CARDS por pessoa com fit() anti-overflow; backing próprio p/ legibilidade sobre qualquer footage; title-safe 6%; build-in/hold imóvel/build-out com LEAD/TAIL (primeiro e último frame vazios); render.mjs --check (fonts, alpha, title-safe), sheets in/out, --ground '#00ff00'; nome ~50-80px @1080p; fontes com lining numerals p/ dígitos.

**Origem:** lower-thirds-skills · [https://github.com/iart-ai/lower-thirds-skills](https://github.com/iart-ai/lower-thirds-skills)

**Como instalar:** `git clone https://github.com/iart-ai/lower-thirds-skills` → copie `<repo>/skills/lower-thirds/` para `~/.claude/skills/`

---

## motion-design (Mortiflix)

**O que cria:** craft de motion design do estúdio — style frames, layout, timing, easing, transições e som.

**Chaves técnicas:** design/LOOK.md (palette 1+accent, escala tipográfica 1.25×, headline ≥5% da altura), read time words/3+1s, spring damping 200, stagger 2-4 frames, match cut, música -18dB sob voz, -14 LUFS/TP -1

**Origem:** mortiflix-oss · [https://github.com/GTKottman/mortiflix-oss](https://github.com/GTKottman/mortiflix-oss)

**Como instalar:** `git clone https://github.com/GTKottman/mortiflix-oss` → copie `<repo>/pipelines/_shared/skills/motion-design/` para `~/.claude/skills/`

---

## transition-board

**O que cria:** desenha cada corte antes do animatic — carrier por corte, biblioteca de 50 transições Remotion, board com in-betweens.

**Chaves técnicas:** remotion-transitions 9 famílias, TransitionSeries/linearTiming, regra "screen never goes blank", board.mjs list/use/check/panels, carrier 3D RGBA (PNG sequence), strips 10%→90%, liquid-fill etc.

**Origem:** mortiflix-oss · [https://github.com/GTKottman/mortiflix-oss](https://github.com/GTKottman/mortiflix-oss)

**Como instalar:** `git clone https://github.com/GTKottman/mortiflix-oss` → copie `<repo>/pipelines/_shared/skills/transition-board/` para `~/.claude/skills/`

---

## after-effects

**O que cria:** hub After Effects — expressões/rigging, receitas de export, triagem de performance e higiene de projeto.

**Chaves técnicas:** wiggle/loopOut/inertial bounce, seedRandom, valueAtTime echo, rig slider/null, MOGRT, ProRes 4444 alpha, H.264 via AME VBR 2-pass, Multi-Frame Rendering, Collect Files, ExtendScript matchName

**Origem:** motion-design-skills · [https://github.com/iart-ai/motion-design-skills](https://github.com/iart-ai/motion-design-skills)

**Como instalar:** `git clone https://github.com/iart-ai/motion-design-skills` → copie `<repo>/skills/after-effects/` para `~/.claude/skills/`

---

## animation-principles

**O que cria:** fundamentos agnósticos de movimento — timing, easing, stagger, peso e beat-sync com números concretos.

**Chaves técnicas:** cubic-bezier (enter 0.16,1,0.3,1; overshoot 0.34,1.56,0.64,1), durações por elemento (100-800ms), regra 1/3 (distância/simultaneidade), stagger 40-80ms cap 700ms, anticipation 60-120ms, follow-through, spring stiffness300/damping30, Graph Editor influence 80-90%

**Origem:** motion-design-skills · [https://github.com/iart-ai/motion-design-skills](https://github.com/iart-ai/motion-design-skills)

**Como instalar:** `git clone https://github.com/iart-ai/motion-design-skills` → copie `<repo>/skills/animation-principles/` para `~/.claude/skills/`

---

## beat-sync-editing

**O que cria:** cortes e ritmo — BPM→frames, cut on action, J/L-cut, speed ramps e arco de pacing.

**Chaves técnicas:** frames_per_beat=(60/BPM)*fps, eighth-grid, match cut, J-cut (áudio 4-12f antes), L-cut, speed ramp 100%→25%→100%, arco Establish→Develop→Climax→Resolve, tabela Motion Personality, round cumulativo anti-drift

**Origem:** motion-design-skills · [https://github.com/iart-ai/motion-design-skills](https://github.com/iart-ai/motion-design-skills)

**Como instalar:** `git clone https://github.com/iart-ai/motion-design-skills` → copie `<repo>/skills/beat-sync-editing/` para `~/.claude/skills/`

---

## color-motion

**O que cria:** paleta e cor em motion — OKLCH, gradientes premium, grade por ordem e color management de render.

**Chaves técnicas:** interpolação OKLCH (nunca sRGB), mesh gradient + grain 3-5%, @property transition, grade teal/orange, working space Rec.709 Gamma 2.4, tag Rec.709 no Output Module, QuickTime gamma bug, test-patch 128, ffprobe bt709

**Origem:** motion-design-skills · [https://github.com/iart-ai/motion-design-skills](https://github.com/iart-ai/motion-design-skills)

**Como instalar:** `git clone https://github.com/iart-ai/motion-design-skills` → copie `<repo>/skills/color-motion/` para `~/.claude/skills/`

---

## logo-animation

**O que cria:** animação de logo — draw-on, build-on, morph, sound-logo sync, entregas web/Lottie/vídeo.

**Chaves técnicas:** stroke-dashoffset + pathLength=1, mask wipe clipPath, GSAP back.out com stagger, MorphSVG, idle loop, settle no pico do áudio, overshoot scale 1.04→1.00, clearspace, reveal ≤2.5s

**Origem:** motion-design-skills · [https://github.com/iart-ai/motion-design-skills](https://github.com/iart-ai/motion-design-skills)

**Como instalar:** `git clone https://github.com/iart-ai/motion-design-skills` → copie `<repo>/skills/logo-animation/` para `~/.claude/skills/`

---

## motion-art-direction

**O que cria:** direção de arte de motion — motion language spec, personalidade de movimento, hierarquia e restraint.

**Chaves técnicas:** matriz calma↔cinético × soft↔sharp, personalidades Playful/Premium/Corporate/Energetic com eases e durações, spec table (easing family, timing unit, transition family, stagger rhythm, hold discipline), hierarquia Hero/Support/Texture, regra 1 hero por frame

**Origem:** motion-design-skills · [https://github.com/iart-ai/motion-design-skills](https://github.com/iart-ai/motion-design-skills)

**Como instalar:** `git clone https://github.com/iart-ai/motion-design-skills` → copie `<repo>/skills/motion-art-direction/` para `~/.claude/skills/`

---

## shot-composition

**O que cria:** composição de quadro — grids, safe areas, hierarquia de foco, camadas bg/mid/fg e câmera.

**Chaves técnicas:** grid 12 colunas/baseline 8px, rule of thirds power points, hierarquia size>contrast>color>position, parallax 0.2x/0.6x/1.2x, um movimento de câmera por beat, safe areas 9:16 (top 12%/bottom 18%/sides 6%), restack em vez de crop

**Origem:** motion-design-skills · [https://github.com/iart-ai/motion-design-skills](https://github.com/iart-ai/motion-design-skills)

**Como instalar:** `git clone https://github.com/iart-ai/motion-design-skills` → copie `<repo>/skills/shot-composition/` para `~/.claude/skills/`

---

## brand-intake

**O que cria:** entrevista que vira brand.md + MOTION.md (cores, tipo, timing, regras) + regra de leitura no CLAUDE.md.

**Chaves técnicas:** 2 batches de perguntas, MOTION.md 7 seções (cores/tipos/timing/movimento/textura/5 nevers/exemplo), regra "read MOTION.md before animating", hex digitado > amostrado, ASK ME

**Origem:** motion-graphics-skills · [https://github.com/charlie947/motion-graphics-skills](https://github.com/charlie947/motion-graphics-skills)

**Como instalar:** `git clone https://github.com/charlie947/motion-graphics-skills` → copie `<repo>/skills/brand-intake/` para `~/.claude/skills/`

---

## motion-brief-writer

**O que cria:** transforma ideia vaga em build brief preciso (≤5 perguntas, números reais, marca separada de sample).

**Chaves técnicas:** checklist essenciais (palavras/números exatos, size, length, brand), 4 estados com timings, separação resultado/target/sample, "Illustrative data", build prompt em code block

**Origem:** motion-graphics-skills · [https://github.com/charlie947/motion-graphics-skills](https://github.com/charlie947/motion-graphics-skills)

**Como instalar:** `git clone https://github.com/charlie947/motion-graphics-skills` → copie `<repo>/skills/motion-brief-writer/` para `~/.claude/skills/`

---

## motion-prompt-writer

**O que cria:** escreve prompt de motion gráfico em 8 partes fixas (bar/format/regra/look/motion/never/finish/scene).

**Chaves técnicas:** estrutura 8 partes, hero 60-70% do frame, spring com settle, hold ≥1.2s, ≤5 palavras na tela, Apple-style default, stills a cada 1s a 200px

**Origem:** motion-graphics-skills · [https://github.com/charlie947/motion-graphics-skills](https://github.com/charlie947/motion-graphics-skills)

**Como instalar:** `git clone https://github.com/charlie947/motion-graphics-skills` → copie `<repo>/skills/motion-prompt-writer/` para `~/.claude/skills/`

---

## reference-to-motion

**O que cria:** decompõe referências (moves/look) em prompt de motion com timings por cena, sem copiar marca.

**Chaves técnicas:** breakdown 5 linhas (pace/change/type/cor/ideia), regra "copiar movimento, nunca logo/copy/cores", Look line com hex, cena por linha com segundos que somam a duração

**Origem:** motion-graphics-skills · [https://github.com/charlie947/motion-graphics-skills](https://github.com/charlie947/motion-graphics-skills)

**Como instalar:** `git clone https://github.com/charlie947/motion-graphics-skills` → copie `<repo>/skills/reference-to-motion/` para `~/.claude/skills/`

---

## anthropic-talking-head-style

**O que cria:** aplica direção de arte editorial quente (Anthropic-like) a edit de talking-head social.

**Chaves técnicas:** tokens ivory/charcoal/terracotta/editorial-blue; Poppins display + Lora copy; flat cards, outline sólido 2px, offset print shadows; dotted paper grain; alternância light/dark; mask reveals, slides rápidos, scale pops; hard cuts

**Origem:** tiktok-ig-shorts

**Como instalar:** Coleção local em `editor-chefe/skills/tiktok-ig-shorts/` (sem remote) — copie `skills/anthropic-talking-head-style/` para `~/.claude/skills/`

---

## video-reference

**O que cria:** destrincha um vídeo pronto em referência de produção reutilizável (medições + métodos).

**Chaves técnicas:** measure scdet + loudness/LRA/true-peak; frames --review/--longest p/ validar cortes; labels audio_spans/sections/subtitles; regras R1-R8 de separação fato/método; export production_reference.json com targets medidos

**Origem:** video-recap-skills · [https://github.com/zenstory-ai/video-recap-skills](https://github.com/zenstory-ai/video-recap-skills)

**Como instalar:** `git clone https://github.com/zenstory-ai/video-recap-skills` → copie `<repo>/skills/video-reference/` para `~/.claude/skills/`

