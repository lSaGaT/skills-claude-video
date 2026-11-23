# Explicativos, dados & matemática

**19 skills** · [← voltar ao índice](../README.md)

---

## beautiful-mermaid

**O que cria:** Renderiza diagramas Mermaid em SVG e PNG 4K com temas prontos.

**Chaves técnicas:** 13 temas (tokyo-night, dracula, nord...), render.ts → SVG, create-html.ts wrapper, screenshot agent-browser em viewport 3840x2160, sintaxe de edge label com pipe, limpeza de intermediários.

**Origem:** OpenMontage · [https://github.com/calesthio/OpenMontage](https://github.com/calesthio/OpenMontage)

**Também em:** OpenMontage (https://github.com/calesthio/OpenMontage) — OpenMontage/.agents/skills/beautiful-mermaid/SKILL.md · OpenMontage (https://github.com/calesthio/OpenMontage) — OpenMontage/.claude/skills/beautiful-mermaid/SKILL.md

**Como instalar:** `git clone https://github.com/calesthio/OpenMontage` → copie `<repo>/.agents/skills/beautiful-mermaid/` para `~/.claude/skills/`

---

## d3-viz

**O que cria:** Visualizações de dados customizadas com d3.js — SVG, scales, axes e transitions coreografadas.

**Chaves técnicas:** scaleLinear/scaleBand + axes; join de dados; transitions coreografadas; force-directed e projeções geográficas; ResizeObserver responsivo; patterns A (DOM imperativo) e B (declarativo)

**Origem:** OpenMontage · [https://github.com/calesthio/OpenMontage](https://github.com/calesthio/OpenMontage)

**Também em:** OpenMontage (https://github.com/calesthio/OpenMontage) — OpenMontage/.agents/skills/d3-viz/SKILL.md · OpenMontage (https://github.com/calesthio/OpenMontage) — OpenMontage/.claude/skills/d3-viz/SKILL.md

**Como instalar:** `git clone https://github.com/calesthio/OpenMontage` → copie `<repo>/.agents/skills/d3-viz/` para `~/.claude/skills/`

---

## manim-composer

**O que cria:** planeja (antes de codar) vídeos de explicação matemática em scenes.md: pesquisa, perguntas ao usuário, arco narrativo e specs por cena.

**Chaves técnicas:** scenes.md (hook, narrative arc, por cena: duração/propósito/elementos/animações/câmera/narração, paleta primária-secundária-accent, ordem de implementação), pesquisa do "aha moment" e misconceptions, princípios 3b1b (progressive revelation, transformar em vez de substituir, pause for insight, variar ritmo), referências narrative-patterns/visual-techniques/scene-examples

**Origem:** manim_skill

**Também em:** OpenMontage (https://github.com/calesthio/OpenMontage) — OpenMontage/.agents/skills/manim-composer/SKILL.md · OpenMontage (https://github.com/calesthio/OpenMontage) — OpenMontage/.claude/skills/manim-composer/SKILL.md

**Como instalar:** Coleção local em `editor-chefe/skills/manim_skill/` (sem remote) — copie `skills/manim-composer/` para `~/.claude/skills/`

---

## manimce-best-practices

**O que cria:** boas práticas do Manim Community Edition (Python) — Scene, animações, LaTeX, 3D, câmera e CLI.

**Chaves técnicas:** Create/Write/FadeIn/DrawBorderThenFill, Transform/ReplacementTransform, AnimationGroup/LaggedStart/Succession, MathTex colorido, rate functions/easing, updaters/ValueTracker, MovingCameraScene zoom/pan, render -qk 4K, --format gif

**Origem:** manim_skill

**Também em:** OpenMontage (https://github.com/calesthio/OpenMontage) — OpenMontage/.agents/skills/manimce-best-practices/SKILL.md · OpenMontage (https://github.com/calesthio/OpenMontage) — OpenMontage/.claude/skills/manimce-best-practices/SKILL.md

**Como instalar:** Coleção local em `editor-chefe/skills/manim_skill/` (sem remote) — copie `skills/manimce-best-practices/` para `~/.claude/skills/`

---

## manimgl-best-practices

**O que cria:** Melhores práticas do ManimGL (3b1b) — InteractiveScene, self.frame e desenvolvimento interativo.

**Chaves técnicas:** ShowCreation; Tex com t2c (tex_to_color_map); frame.reorient(phi,theta,gamma); fix_in_frame(); checkpoint_paste interativo com skip/record; set_backstroke p/ legibilidade de texto

**Origem:** manim_skill

**Também em:** OpenMontage (https://github.com/calesthio/OpenMontage) — OpenMontage/.agents/skills/manimgl-best-practices/SKILL.md · OpenMontage (https://github.com/calesthio/OpenMontage) — OpenMontage/.claude/skills/manimgl-best-practices/SKILL.md

**Como instalar:** Coleção local em `editor-chefe/skills/manim_skill/` (sem remote) — copie `skills/manimgl-best-practices/` para `~/.claude/skills/`

---

## animated-infographic

**O que cria:** infográfico desenhado (ícones+números+conectores) animado em cascata com hierarquia de revelação.

**Chaves técnicas:** revelação por tiers título→ícone pop (spring overshoot)→counter easeOut tabular-nums→label→connector draw-on; stagger 6-10 frames 1 curva; pictogram fill por máscara; hold final 2-3s; budgets por beat (0.8-1.2s título, 1.2-2s item); frame estático desenhado antes das keyframes

**Origem:** data-animation-skills

**Como instalar:** Coleção local em `editor-chefe/skills/data-animation-skills/` (sem remote) — copie `skills/animated-infographic/` para `~/.claude/skills/`

---

## chart-animation

**O que cria:** anima gráficos de dados (bar chart race, linhas, counters) com mapping data→pixels por frame puro.

**Chaves técnicas:** scaleLinear/scaleBand + interpolate frame; easeOutCubic no valor; rank interpolado glide no bar race (stable keys); Intl.NumberFormat+tabular-nums; pacing intro 1-1.5s/row 0.3-0.6s/final 2-3s; callout no inflection; template×data batch por CSV

**Origem:** data-animation-skills

**Como instalar:** Coleção local em `editor-chefe/skills/data-animation-skills/` (sem remote) — copie `skills/chart-animation/` para `~/.claude/skills/`

---

## presentation-video

**O que cria:** transforma deck/outline em vídeo narrado auto-avançante com slides reconstruídos em motion graphics.

**Chaves técnicas:** narração controla o relógio (getAudioDurationInSeconds+handle 0.4s); espinha tensão→resolução (problema/insight/solução/prova/ask); build reveals fade+rise 0.25-0.5s stagger 0.15-0.4s; TransitionSeries fade (push só em divisores); type ≥28px/contraste 4.5:1/centro 90%; theme object

**Origem:** data-animation-skills

**Como instalar:** Coleção local em `editor-chefe/skills/data-animation-skills/` (sem remote) — copie `skills/presentation-video/` para `~/.claude/skills/`

---

## diagram-animation

**O que cria:** anima diagramas e dados com progressive disclosure (nós→arestas→labels) em SVG/GSAP/Framer/D3/Remotion.

**Chaves técnicas:** node scale back.out(1.5) stagger; edge stroke-dashoffset (pathLength=1); flowing dash + traveling dot offset-path; bar grow scaleY baseline; line draw-on; count-up easeOutCubic; highlight ativo + dim contexto; hold 0.5-1.5s; seek harness ?t=N

**Origem:** explainer-video-skills · [https://github.com/iart-ai/explainer-video-skills](https://github.com/iart-ai/explainer-video-skills)

**Como instalar:** `git clone https://github.com/iart-ai/explainer-video-skills` → copie `<repo>/skills/diagram-animation/` para `~/.claude/skills/`

---

## explainer-video (iart-ai)

**O que cria:** pipeline completo 30-90s: roteiro→storyboard→cenas→VO/captions sync→edição→polish com arco problema→solução→como→payoff.

**Chaves técnicas:** fórmula de roteiro (problema 20%/solução 15%/como 45%/payoff 20%); VO ~2.3 w/s +0.4s folga; 1 analogia só; kinetic keyword pop; count-up; captions ≤2 linhas 42 chars; sistema de estilo único (type/color/easing); per-scene Audio em Sequence; calculateMetadata

**Origem:** explainer-video-skills · [https://github.com/iart-ai/explainer-video-skills](https://github.com/iart-ai/explainer-video-skills)

**Como instalar:** `git clone https://github.com/iart-ai/explainer-video-skills` → copie `<repo>/skills/explainer-video/` para `~/.claude/skills/`

---

## whiteboard-animation

**O que cria:** animação whiteboard/VideoScribe: SVG draw-on stroke a stroke com mão-marcador seguindo a ponta.

**Chaves técnicas:** stroke-dashoffset len→0 + pathLength=1; getPointAtLength(len*k) p/ nib da mão; ordem de desenho = narração; multi-stroke stagger + hop da mão; fill após outline; erase/wipe (clip-path, reverse-draw); handwriting per-glyph; pacing ~2.3 w/s

**Origem:** explainer-video-skills · [https://github.com/iart-ai/explainer-video-skills](https://github.com/iart-ai/explainer-video-skills)

**Como instalar:** `git clone https://github.com/iart-ai/explainer-video-skills` → copie `<repo>/skills/whiteboard-animation/` para `~/.claude/skills/`

---

## wrapped-video

**O que cria:** gera vídeos estilo Spotify Wrapped: uma tabela de dados × um template Remotion 9:16 → muitos MP4s personalizados em lote.

**Chaves técnicas:** Wrapped scene grammar (intro, big-number reveal, top-X list staggered, superlativo/persona, comparação percentil, heatmap temporal, outro share card); contador big-number com useCurrentFrame+spring+tabular-nums; crescendo de stats (menor→maior); share card parado ≥2s; safe-area 9:16 (centro 80%, limpar top 12%/bottom 18%); batch renderMedia por linha validada por zod schema; stills antes do lote.

**Origem:** explainer-video-skills · [https://github.com/iart-ai/explainer-video-skills](https://github.com/iart-ai/explainer-video-skills)

**Como instalar:** `git clone https://github.com/iart-ai/explainer-video-skills` → copie `<repo>/skills/wrapped-video/` para `~/.claude/skills/`

---

## explainroo

**O que cria:** monta MP4 explicativo com voz local (sem API): script + scenes.js desenhado em JS, Chrome renderiza frames, ferramenta sincroniza palavra falada com imagem.

**Chaves técnicas:** pipeline explainroo init (tema paper), Scene API própria, timing por palavra dita, música+SFX automáticos, verify video; requer Node 20.11+/ffmpeg/Chrome.

**Origem:** explainroo

**Como instalar:** Coleção local em `editor-chefe/skills/explainroo/` (sem remote) — copie `skills/explainroo/` para `~/.claude/skills/`

---

## hand-drawn-explainer-video-nikola

**O que cria:** cria vídeos de explicação desenhados à mão (whiteboard stroke-by-stroke ou animação programática SVG/HTML/GSAP) com dublagem e legendas.

**Chaves técnicas:** duas rotas: stroke-story (ink persistente por pincelada, vendor srt-whiteboard-animation) e program animation; estilos Q版 natural e "小黑" (Xiaohei); estrutura single-scene / multi-acto / dupla ilha semântica esquerda-direita; timing de áudio real (forced alignment); texto determinístico em pós (datas/logos/números fora do modelo de imagem); verificação de cena representante antes do lote.

**Origem:** hand-drawn-explainer-video-nikola

**Como instalar:** Coleção local em `editor-chefe/skills/hand-drawn-explainer-video-nikola/` (sem remote) — copie `SKILL.md/` para `~/.claude/skills/`

---

## manim

**O que cria:** animações matemáticas com Manim CE (estilo 3Blue1Brown): equações, gráficos, provas geométricas → MP4/GIF determinístico.

**Chaves técnicas:** Scenes/Mobjects/Animations; Write, TransformMatchingTex (morph term a term), .animate chains, rate_func (smooth/rush_into/there_and_back), LaggedStart lag_ratio; Axes+plot+c2p, ValueTracker+always_redraw (dot na curva, contadores); ThreeDScene/MovingCameraScene; fluxo -sql -n a,b (stills) → -qh (MP4); gotchas LaTeX raw strings, ReplacementTransform vs Transform.

**Origem:** manim-skills · [https://github.com/iart-ai/manim-skills](https://github.com/iart-ai/manim-skills)

**Como instalar:** `git clone https://github.com/iart-ai/manim-skills` → copie `<repo>/skills/manim/` para `~/.claude/skills/`

---

## map-animation

**O que cria:** mapas animados estilo Vox — Earth Studio→AE e vetores GeoJSON/SVG em Remotion/D3, com stutter 12fps.

**Chaves técnicas:** quantização 12fps (posterizeTime/STEP), pin drop com spring overshoot, route draw-on (stroke-dashoffset + pathLength=1), region highlight focus+context, label callout com leader-line, d3.geoMercator projection, beats data-driven array, traveling dot, d3.geoInterpolate

**Origem:** map-animation-skills

**Como instalar:** Coleção local em `editor-chefe/skills/map-animation-skills/` (sem remote) — copie `skills/map-animation/` para `~/.claude/skills/`

---

## animated-chart

**O que cria:** gráfico animado em loop p/ LinkedIn/newsletter em código, com valores exatos preservados.

**Chaves técnicas:** 4 estados start/change/hold/return, loop sem salto, window.seek, count-up, bars→line, label "Illustrative data", QA por screenshots 0/1/2/4/7s, ffmpeg MP4+GIF

**Origem:** motion-graphics-skills · [https://github.com/charlie947/motion-graphics-skills](https://github.com/charlie947/motion-graphics-skills)

**Como instalar:** `git clone https://github.com/charlie947/motion-graphics-skills` → copie `<repo>/skills/animated-chart/` para `~/.claude/skills/`

---

## vox-explainer

**O que cria:** explainer documental Vox 30-60s em código — torn paper, halftone, tipo condensada, motion on twos.

**Chaves técnicas:** torn paper cards, halftone dots, film grain, color fringing nas edges, vignette, animação on twos (hold 2 frames @24fps), shot types (kinetic statement, paper cards, before/after, label call-out, counter, grid), fatos com fonte

**Origem:** motion-graphics-skills · [https://github.com/charlie947/motion-graphics-skills](https://github.com/charlie947/motion-graphics-skills)

**Como instalar:** `git clone https://github.com/charlie947/motion-graphics-skills` → copie `<repo>/skills/vox-explainer/` para `~/.claude/skills/`

---

## vox-director

**O que cria:** vídeo Vox paper-collage end-to-end (Atlas Cloud + ffmpeg): beats, keyframes IA, motion, VO, música, captions.

**Chaves técnicas:** beats.json com arc narrativo (timeline/pas/bab/how_it_works/man_in_hole); 2 shots por beat (wide+detail) com corte visual a cada 4-6s, shot ≤7s; camera_move {push_in, pan, orbit, dolly_zoom, whip}; element_motion rico (hero element voando 1x/beat chave); theme presets (american-retro, swiss-modern, punk-zine, soviet-constructivist...); style bake-off; aspect routing com confirmação; A-roll/C-roll/host modes

**Origem:** vox-director

**Como instalar:** Coleção local em `editor-chefe/skills/vox-director/` (sem remote) — copie `SKILL.md/` para `~/.claude/skills/`

