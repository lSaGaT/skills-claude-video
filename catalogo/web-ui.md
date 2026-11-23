# Web, UI & GSAP

**25 skills** · [← voltar ao índice](../README.md)

---

## framer-motion

**O que cria:** implementa os 12 princípios Disney com Framer Motion em React.

**Chaves técnicas:** squash/stretch (keyframes scaleX/scaleY), anticipation (pré-recuo), staging (blur bg + hero), follow through com delays escalonados, slow in/out cubic-bezier [0.42,0,0.58,1], arcos, secondary action whileHover/whileTap, timing presets (fast 0.15/normal 0.3/slow 0.6/spring), exaggeration com spring low damping (overshoot), staggerChildren, AnimatePresence.

**Origem:** OpenMontage · [https://github.com/calesthio/OpenMontage](https://github.com/calesthio/OpenMontage)

**Também em:** OpenMontage (https://github.com/calesthio/OpenMontage) — OpenMontage/.agents/skills/framer-motion/SKILL.md · OpenMontage (https://github.com/calesthio/OpenMontage) — OpenMontage/.claude/skills/framer-motion/SKILL.md

**Como instalar:** `git clone https://github.com/calesthio/OpenMontage` → copie `<repo>/.agents/skills/framer-motion/` para `~/.claude/skills/`

---

## gsap-core

**O que cria:** API core do GSAP — tweens, eases, stagger, transforms, autoAlpha, matchMedia.

**Chaves técnicas:** gsap.to/from/fromTo/set, eases power/back/elastic/bounce/circ/expo + CustomEase (cubic-bezier e path), stagger (amount, from center/edges/random), transform aliases x/y/scale/rotation/xPercent/yPercent, autoAlpha, svgOrigin, rotação direcional _short/_cw/_ccw, clearProps, valores relativos +=/-=, function-based values, gsap.matchMedia

**Origem:** OpenMontage · [https://github.com/calesthio/OpenMontage](https://github.com/calesthio/OpenMontage)

**Como instalar:** `git clone https://github.com/calesthio/OpenMontage` → copie `<repo>/.agents/skills/gsap-core/` para `~/.claude/skills/`

---

## gsap-frameworks

**O que cria:** Padrões GSAP em Vue/Svelte — ciclo de vida, escopo de seletores, cleanup.

**Chaves técnicas:** gsap.context(scope) + ctx.revert() em onMounted/onUnmounted, bind:this, scoping de seletores no root do componente, ScrollTrigger.refresh após layout

**Origem:** OpenMontage · [https://github.com/calesthio/OpenMontage](https://github.com/calesthio/OpenMontage)

**Como instalar:** `git clone https://github.com/calesthio/OpenMontage` → copie `<repo>/.agents/skills/gsap-frameworks/` para `~/.claude/skills/`

---

## gsap-performance

**O que cria:** Otimiza animações GSAP para 60fps — só transforms/opacity, batching, quickTo.

**Chaves técnicas:** gsap.quickTo() para mouse-follower (x/y reusando um tween, ease power3), animar só transform/opacity, will-change, batch reads/writes anti-layout-thrashing, stagger em vez de vários tweens, matar tweens off-screen, debounce de ScrollTrigger.refresh

**Origem:** OpenMontage · [https://github.com/calesthio/OpenMontage](https://github.com/calesthio/OpenMontage)

**Como instalar:** `git clone https://github.com/calesthio/OpenMontage` → copie `<repo>/.agents/skills/gsap-performance/` para `~/.claude/skills/`

---

## gsap-plugins

**O que cria:** Plugins GSAP — SplitText, ScrambleText, DrawSVG, Flip, Draggable, Observer etc.

**Chaves técnicas:** SplitText (chars/words/lines, mask reveal, autoSplit+onSplit), ScrambleTextPlugin (glitch de texto), DrawSVG (stroke-dashoffset "0% 100%"), MorphSVG, MotionPath, Flip (FLIP: getState/from), Draggable+InertiaPlugin, Observer (swipe), ScrollToPlugin/ScrollSmoother, CustomWiggle/CustomBounce, GSDevTools

**Origem:** OpenMontage · [https://github.com/calesthio/OpenMontage](https://github.com/calesthio/OpenMontage)

**Como instalar:** `git clone https://github.com/calesthio/OpenMontage` → copie `<repo>/.agents/skills/gsap-plugins/` para `~/.claude/skills/`

---

## gsap-react

**O que cria:** GSAP em React via useGSAP — escopo, contextSafe, cleanup e SSR.

**Chaves técnicas:** useGSAP() com scope+contextSafe, gsap.context()+ctx.revert() em useEffect, revertOnUpdate, registro único de plugins, sem GSAP durante SSR

**Origem:** OpenMontage · [https://github.com/calesthio/OpenMontage](https://github.com/calesthio/OpenMontage)

**Como instalar:** `git clone https://github.com/calesthio/OpenMontage` → copie `<repo>/.agents/skills/gsap-react/` para `~/.claude/skills/`

---

## gsap-scrolltrigger

**O que cria:** Animação ligada a scroll — pin, scrub, batch, scroll horizontal fake.

**Chaves técnicas:** scrub (true/número), pin+pinSpacing, toggleActions, ScrollTrigger.batch (stagger de onEnter), containerAnimation (ease none obrigatório), snap, scrollerProxy, markers

**Origem:** OpenMontage · [https://github.com/calesthio/OpenMontage](https://github.com/calesthio/OpenMontage)

**Como instalar:** `git clone https://github.com/calesthio/OpenMontage` → copie `<repo>/.agents/skills/gsap-scrolltrigger/` para `~/.claude/skills/`

---

## gsap-timeline

**O que cria:** Sequenciamento GSAP — timelines, position parameter, labels, nesting.

**Chaves técnicas:** gsap.timeline, position param ("+=0.5", "<", "<0.2", ">"), addLabel/tweenFromTo, nesting de timelines, defaults herdados, playback control (progress/reverse/restart/kill)

**Origem:** OpenMontage · [https://github.com/calesthio/OpenMontage](https://github.com/calesthio/OpenMontage)

**Como instalar:** `git clone https://github.com/calesthio/OpenMontage` → copie `<repo>/.agents/skills/gsap-timeline/` para `~/.claude/skills/`

---

## gsap-utils

**O que cria:** Utilitários GSAP — clamp, mapRange, random, snap, distribute, cores.

**Chaves técnicas:** clamp/normalize/mapRange/interpolate (incl. cores e objetos), random com snap + string "random(-100,100,5)", snap, shuffle, distribute (from center/edges/grid + ease), splitColor, pipe, wrap, selector(scope), toArray

**Origem:** OpenMontage · [https://github.com/calesthio/OpenMontage](https://github.com/calesthio/OpenMontage)

**Como instalar:** `git clone https://github.com/calesthio/OpenMontage` → copie `<repo>/.agents/skills/gsap-utils/` para `~/.claude/skills/`

---

## lottie-bodymovin

**O que cria:** Implementa os 12 princípios Disney usando Lottie (Bodymovin) exportado do After Effects.

**Chaves técnicas:** squash&stretch (expressão de scale inversa), anticipation em segmentos (playSegments), follow-through com keyframes offset 2-4f + parenting valueAtTime, overshoot expression (amp/freq/decay), setSpeed/goToAndStop/setDirection, arcos via motion paths Bezier, staging em layers, lottie-interactivity

**Origem:** OpenMontage · [https://github.com/calesthio/OpenMontage](https://github.com/calesthio/OpenMontage)

**Também em:** OpenMontage (https://github.com/calesthio/OpenMontage) — OpenMontage/.agents/skills/lottie-bodymovin/SKILL.md · OpenMontage (https://github.com/calesthio/OpenMontage) — OpenMontage/.claude/skills/lottie-bodymovin/SKILL.md

**Como instalar:** `git clone https://github.com/calesthio/OpenMontage` → copie `<repo>/.agents/skills/lottie-bodymovin/` para `~/.claude/skills/`

---

## tailwind-design-system

**O que cria:** Design systems com Tailwind CSS v4 — tokens @theme, componentes CVA, dark mode, responsividade.

**Chaves técnicas:** @theme com tokens OKLCH, @custom-variant dark, @keyframes dentro de @theme (--animate-*), @starting-style p/ entry animations, CVA (Class Variance Authority), hierarquia brand→semantic→component tokens, migração v3→v4.

**Origem:** OpenMontage · [https://github.com/calesthio/OpenMontage](https://github.com/calesthio/OpenMontage)

**Também em:** OpenMontage (https://github.com/calesthio/OpenMontage) — OpenMontage/.agents/skills/tailwind-design-system/SKILL.md · OpenMontage (https://github.com/calesthio/OpenMontage) — OpenMontage/.claude/skills/tailwind-design-system/SKILL.md

**Como instalar:** `git clone https://github.com/calesthio/OpenMontage` → copie `<repo>/.agents/skills/tailwind-design-system/` para `~/.claude/skills/`

---

## vercel-composition-patterns

**O que cria:** Padrões de composição React (compound components, context providers, React 19) em regras por arquivo.

**Chaves técnicas:** regras architecture-avoid-boolean-props, architecture-compound-components, state-decouple-implementation, state-context-interface, state-lift-state, patterns-explicit-variants, patterns-children-over-render-props, react19-no-forwardref (use() no lugar de useContext()).

**Origem:** OpenMontage · [https://github.com/calesthio/OpenMontage](https://github.com/calesthio/OpenMontage)

**Também em:** OpenMontage (https://github.com/calesthio/OpenMontage) — OpenMontage/.agents/skills/vercel-composition-patterns/SKILL.md · OpenMontage (https://github.com/calesthio/OpenMontage) — OpenMontage/.claude/skills/vercel-composition-patterns/SKILL.md

**Como instalar:** `git clone https://github.com/calesthio/OpenMontage` → copie `<repo>/.agents/skills/vercel-composition-patterns/` para `~/.claude/skills/`

---

## vercel-react-best-practices

**O que cria:** Guia de performance React/Next.js da Vercel: 65 regras priorizadas em 8 categorias.

**Chaves técnicas:** async-parallel (Promise.all), bundle-dynamic-imports/barrel-imports, server-parallel-fetching, rerender-memo/useDeferredValue/startTransition/functional-setstate, rendering-content-visibility, js-set-map-lookups/early-exit, advanced-use-latest.

**Origem:** OpenMontage · [https://github.com/calesthio/OpenMontage](https://github.com/calesthio/OpenMontage)

**Também em:** OpenMontage (https://github.com/calesthio/OpenMontage) — OpenMontage/.agents/skills/vercel-react-best-practices/SKILL.md · OpenMontage (https://github.com/calesthio/OpenMontage) — OpenMontage/.claude/skills/vercel-react-best-practices/SKILL.md

**Como instalar:** `git clone https://github.com/calesthio/OpenMontage` → copie `<repo>/.agents/skills/vercel-react-best-practices/` para `~/.claude/skills/`

---

## web-design-guidelines

**O que cria:** Audita código de UI contra Web Interface Guidelines da Vercel (acessibilidade e UX).

**Chaves técnicas:** fetch do command.md atualizado antes de cada review, revisão por todas as regras, saída no formato file:line, foco acessibilidade/UX.

**Origem:** OpenMontage · [https://github.com/calesthio/OpenMontage](https://github.com/calesthio/OpenMontage)

**Também em:** OpenMontage (https://github.com/calesthio/OpenMontage) — OpenMontage/.agents/skills/web-design-guidelines/SKILL.md · OpenMontage (https://github.com/calesthio/OpenMontage) — OpenMontage/.claude/skills/web-design-guidelines/SKILL.md

**Como instalar:** `git clone https://github.com/calesthio/OpenMontage` → copie `<repo>/.agents/skills/web-design-guidelines/` para `~/.claude/skills/`

---

## frontend-design

**O que cria:** guia de design frontend anti-genérico: direção estética ousada, tipografia, cor, motion e composição.

**Chaves técnicas:** escolha de tone extremo; tipografia display+body distinta; CSS variables; staggered reveals com animation-delay; gradient mesh/noise/grain; assimetria/grid-breaking; ban Inter/purple-gradient

**Origem:** claude-code-video-toolkit · [https://github.com/digitalsamba/claude-code-video-toolkit](https://github.com/digitalsamba/claude-code-video-toolkit)

**Como instalar:** `git clone https://github.com/digitalsamba/claude-code-video-toolkit` → copie `<repo>/.claude/skills/frontend-design/` para `~/.claude/skills/`

---

## figma

**O que cria:** importa Figma para HyperFrames: assets/tokens/componentes com geometria exata e frames de storyboard animados como estados.

**Chaves técnicas:** figma asset (SVG/PNG 2x, --entity p/ marca), figma tokens (cores/tipografia → data-composition-variables, fill vira var(--slug)), figma component (frame → HTML editável), motion via connector (motionToGsap + verify 15dB SSIM-like), storyboard: frames são KEYFRAMES não slides (tween entre estados, rebuild UI como DOM vivo), batches ≤4 frames; cache .media/, nunca deixar URL do Figma no comp.

**Origem:** hyperframes

**Como instalar:** Coleção local em `editor-chefe/skills/hyperframes/` (sem remote) — copie `skills/figma/` para `~/.claude/skills/`

---

## 60fps-animation

**O que cria:** animação web performática: animar só transform/opacity (compositor-only).

**Chaves técnicas:** mapping width→scaleX, top→translate; FLIP (First/Last/Invert/Play); box-shadow via pseudo-element opacity; height auto via grid 0fr→1fr; will-change jit; batch reads/writes anti-thrashing; DevTools sem bands Layout/Paint

**Origem:** web-animation-skills · [https://github.com/iart-ai/web-animation-skills](https://github.com/iart-ai/web-animation-skills)

**Como instalar:** `git clone https://github.com/iart-ai/web-animation-skills` → copie `<repo>/skills/60fps-animation/` para `~/.claude/skills/`

---

## accessible-animation

**O que cria:** prefers-reduced-motion em 3 tiers (remover/suavizar/manter).

**Chaves técnicas:** global net 0.01ms (não 0s); matchMedia gating p/ GSAP/Lenis/Framer; useReducedMotion hook; (prefers-reduced-motion: no-preference) opt-in; WCAG 2.3.3/C39/2.2.2 pause control

**Origem:** web-animation-skills · [https://github.com/iart-ai/web-animation-skills](https://github.com/iart-ai/web-animation-skills)

**Como instalar:** `git clone https://github.com/iart-ai/web-animation-skills` → copie `<repo>/skills/accessible-animation/` para `~/.claude/skills/`

---

## ascii-animation

**O que cria:** animação ASCII via brightness ramp (web, terminal, overlay 3D).

**Chaves técnicas:** ramp ' .:-=+*#%@' / 70-níveis Bourke; luminância sRGB 0.2126/0.7152/0.0722; correção de aspect 0.5; <pre> vs canvas fillText; Three.js AsciiEffect; loop ANSI 12-24fps

**Origem:** web-animation-skills · [https://github.com/iart-ai/web-animation-skills](https://github.com/iart-ai/web-animation-skills)

**Como instalar:** `git clone https://github.com/iart-ai/web-animation-skills` → copie `<repo>/skills/ascii-animation/` para `~/.claude/skills/`

---

## glassmorphism

**O que cria:** vidro fosco/liquid glass em CSS com motion e fallbacks.

**Chaves técnicas:** backdrop-filter blur(8-40px)+saturate; alpha bg 0.08-0.18; edge highlight border + inset shadows; feTurbulence grain anti-banding; specular sweep; liquid feDisplacementMap; reduced-transparency fallback

**Origem:** web-animation-skills · [https://github.com/iart-ai/web-animation-skills](https://github.com/iart-ai/web-animation-skills)

**Como instalar:** `git clone https://github.com/iart-ai/web-animation-skills` → copie `<repo>/skills/glassmorphism/` para `~/.claude/skills/`

---

## gsap-web

**O que cria:** GSAP para web: timelines, ScrollTrigger, SplitText, Flip, Lenis.

**Chaves técnicas:** posicionamento relativo ("<", "-=0.3", labels); scrub/pin ScrollTrigger; SplitText stagger por lines/words; Flip.getState/from; gsap.quickTo; sync Lenis (ticker raf*1000, lagSmoothing(0)); easings power3.out, back.out(1.7); ?t=N seek harness

**Origem:** web-animation-skills · [https://github.com/iart-ai/web-animation-skills](https://github.com/iart-ai/web-animation-skills)

**Como instalar:** `git clone https://github.com/iart-ai/web-animation-skills` → copie `<repo>/skills/gsap-web/` para `~/.claude/skills/`

---

## lottie-animation

**O que cria:** integra e exporta animações Lottie (AE→web/mobile).

**Chaves técnicas:** dotLottie runtime (canvas+WASM); play/pause/setFrame/setSegment/setTheme; scroll-driven setFrame(p*total); lottie-interactivity declarativo; runtime theming; checklist AE Bodymovin

**Origem:** web-animation-skills · [https://github.com/iart-ai/web-animation-skills](https://github.com/iart-ai/web-animation-skills)

**Como instalar:** `git clone https://github.com/iart-ai/web-animation-skills` → copie `<repo>/skills/lottie-animation/` para `~/.claude/skills/`

---

## micro-interaction

**O que cria:** microinterações de UI (hover/toast/layout) com Framer Motion e CSS moderno.

**Chaves técnicas:** whileTap scale 0.96 spring 400/30; AnimatePresence mode="popLayout"; layout/layoutId magic move; @starting-style + transition-behavior: allow-discrete; band 100-250ms; assimétrico ease-out enter / ease-in exit

**Origem:** web-animation-skills · [https://github.com/iart-ai/web-animation-skills](https://github.com/iart-ai/web-animation-skills)

**Como instalar:** `git clone https://github.com/iart-ai/web-animation-skills` → copie `<repo>/skills/micro-interaction/` para `~/.claude/skills/`

---

## page-transition-animation

**O que cria:** transições de página/route em Next.js (FrozenRouter e View Transitions API).

**Chaves técnicas:** template.tsx + AnimatePresence keyed por pathname; FrozenRouter (snapshot LayoutRouterContext); document.startViewTransition; ::view-transition-old/new; next-view-transitions; checklist de debug do exit

**Origem:** web-animation-skills · [https://github.com/iart-ai/web-animation-skills](https://github.com/iart-ai/web-animation-skills)

**Como instalar:** `git clone https://github.com/iart-ai/web-animation-skills` → copie `<repo>/skills/page-transition-animation/` para `~/.claude/skills/`

---

## svg-animation

**O que cria:** animação SVG: draw-on de traço, morph de paths, motion path, gradientes/filtros.

**Chaves técnicas:** stroke-dashoffset draw-on (pathLength="1" normaliza); GSAP MorphSVG/Flubber p/ morph; MotionPath autoRotate / SMIL animateMotion / CSS offset-path; sheen via animateTransform em gradientTransform; SVGO config p/ animação

**Origem:** web-animation-skills · [https://github.com/iart-ai/web-animation-skills](https://github.com/iart-ai/web-animation-skills)

**Como instalar:** `git clone https://github.com/iart-ai/web-animation-skills` → copie `<repo>/skills/svg-animation/` para `~/.claude/skills/`

