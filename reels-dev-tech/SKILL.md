---
name: reels-dev-tech
description: Produz Reels 9:16 de conteúdo dev/tech no padrão "tech explainer PT-BR" — captura de repositório GitHub dentro de janela falsa com moldura neon, scroll em saltos, caixas de destaque amarelas e legenda cinética de 1 linha por segundo; e também as variantes motion editorial, dashboard de feature, footage com overlay de UI e slide estático 4:5. Use quando o usuário pedir "reel de repositório", "reel de GitHub", "vídeo de README", "reel tech/dev em PT-BR", "vídeo estilo devjuniors7", "legenda cinética com destaque amarelo", "motion editorial de lançamento" ou pedir para transformar um projeto open source, skill ou release em Reel.
---

# Reels dev/tech — engenharia reversa e produção

Gramática extraída de 23 reels reais (@devjuniors7, out/2026), medida quadro a quadro:
`references/estudo-23-reels.md` traz as fichas, as durações e os arquivos de evidência.

## Regra soberana

**Não é um vídeo de 30 s com 6 cenas. É um vídeo de 30 s com 25–35 beats visuais** —
um fato, uma linha de legenda e um gesto de câmera (scroll, destaque, corte) por beat.
Quem entrega 6 cenas de 5 s entrega 4/10; quem entrega 30 beats de 1 s entrega 8/10.

## Escolha da gramática (antes de escrever qualquer linha)

| ativo que você tem | gramática | referência |
|---|---|---|
| README/repo real para mostrar | **A — README Scroll** (dominante) | `references/formato-a-readme-scroll.md` |
| lançamento, lista de produtos, dado, oferta | **B — Motion editorial** | `references/formato-b-motion-editorial.md` |
| feature longa (60–110 s), produto com UI real | **C — Dashboard de feature** | `references/formato-c-d-e-dashboard-footage-slide.md` |
| footage (banco/IA) e quer economizar | **D — Footage + overlay** | idem |
| carrossel / volume alto | **E — Slide estático 4:5** | idem |
| venda de produto/skill | **B + copy de VSL** | `formato-b` |
| fundo denso de cards/telinhas em loop (abertura estilo portfólio) | **Parede de telinhas** | `references/parede-telinhas-loop.md` |
| headline + conteúdo + legenda empilhados no 9:16 (título sobre título, vão) | **Hierarquia vertical** | `references/hierarquia-vertical.md` |
| replicar um vídeo específico quadro a quadro (engenharia reversa fina) | **Calibragem de réplica** | `references/replica-calibragem.md` |
| fazer QUALQUER cena "mover de verdade" (anti copiado-e-colado) | **MOV — física do movimento** | `references/mov-fisica-do-movimento.md` |
| provar com número que o vídeo não está morto | **MOV — perfil de movimento** | `references/mov-perfil-de-movimento.md` |
| fundo chapado que parece filmado (grão, glow, vinheta) | **MOV — grão e atmosfera** | `references/mov-grao-e-atmosfera.md` |
| câmera viva (push, drift, zoom de evidência, whip) | **MOV — câmera** | `references/mov-camera-viva.md` |
| texto digitado, passos cumulativos, caret, hierarquia | **MOV — texto & typing** | `references/mov-texto-e-typing.md` |
| cursor com arco, antecipação, clique e ripple (causa→efeito) | **MOV — cursor & clique** | `references/mov-cursor-e-clique.md` |
| anatomia de beat: rascunho→pouso→vida→derrete + transições | **MOV — beats & transições** | `references/mov-beats-transicoes.md` |
| micro-interação de UI-mock (janelas, hover, ripple, charts, waveform) | **MOV — UI-mock vivo** | `references/mov-ui-mock-viva.md` |
| cinética de display (MOTION, 99%, glitch RGB, orbita shapes) | **MOV — cinético display** | `references/mov-cinetico-display.md` |
| mapa de tempo do vídeo de referência (tecnica por janela) | **MOV — mapa de tempo** | `references/mov-referencia-mapa-tempo.md` |

Se o pedido não disser, escolha A quando existir repositório público; B quando o conteúdo for anúncio ou comparação.

## Início rápido (formato A, já validado)

```bash
# 1. captura o README (PNG alto + coordenadas dos elementos)
node .agents/skills/reels-dev-tech/scripts/capturar-readme.mjs \
  https://github.com/usuario/repo --out meu-reel --width 1080

# 2. escreva meu-reel/cena.json (schema em references/formato-a-readme-scroll.md)

# 3. confira quadros-chave sem renderizar o vídeo inteiro
node .agents/skills/reels-dev-tech/scripts/render-readme-scroll.mjs \
  meu-reel/cena.json --stills 1.0,3.5,8.0

# 4. renderiza o vídeo (1080x1920, 30 fps, H.264)
node .agents/skills/reels-dev-tech/scripts/render-readme-scroll.mjs meu-reel/cena.json
```

Exemplo rodado e verificado em `_estudo-reels/demo/` (cena.json + page.png + `demo-readme-scroll.mp4`, 12,4 s).
Os scripts usam `@napi-rs/canvas`, `puppeteer-core`, `ffmpeg-static` e as fontes `fonts/Montserrat-*.ttf` da raiz do projeto.

## Pipeline (5 fases, nesta ordem)

### 1. Roteiro em beats
Um beat = 1 fato = 1 linha de legenda = 2–5 s de fala.
Estrutura validada: **dor/contradição → nome → promessa → 3–8 provas (cada uma 1 beat) → ressalva (1 beat) → compatibilidade → fecho com link**.
Regras:
- gancho nunca começa pelo nome do projeto;
- todo número é concreto ("45 mil estrelas em 11 dias", "3.205 testes");
- ressalva (alfa, licença, uso autorizado, sem afiliação) tem beat próprio — nunca escondida na mesma linha da promessa;
- 8–18 palavras por fala; nada de subordinada longa;
- fecho falado obrigatório: "link fixado no primeiro comentário" (2,5–3,5 s na tela).

Salve `roteiro.json` no formato de `assets/exemplo-roteiro.json`.

### 2. Fala e TTS
Leia `references/audio-e-narracao.md`. Regra crítica: **escreva termos técnicos foneticamente**
(Grok → "Grôk", nmap → "ên-map", WhisperX → "Uísper X", anidoodle → "ani-dúdou"). O autor de referência não fez isso e errou em vários dos 23 vídeos — o defeito é audível e barato de evitar.
Voz PT-BR, 150–175 palavras/min, sem pausas internas; pausa só na virada de beat.

### 3. Timeline
A duração real de cada arquivo de voz **define** o beat. Nunca estique a fala para caber no vídeo.
Alvo: 26–40 s (mediana da referência: 32 s); 7–15 beats; 60–110 s só no formato C.

### 4. Render
Formato A tem renderer pronto: `scripts/render-readme-scroll.mjs` (canvas + ffmpeg, sem browser).
Demais formatos: `references/formato-b-motion-editorial.md` e `references/formato-c-d-e-dashboard-footage-slide.md`
trazem o esqueleto de cena em canvas/HTML e os tokens (cor, tipo, movimento) de cada um.

### 5. Áudio final e QA
Trilha −22/−26 dB sob a voz, fade-out 1,5 s, loudness −14 LUFS, pico −1 dB.
Checklist de QA em `references/qa-checklist.md` — rodar antes de entregar.

## Tokens visuais do padrão (formato A)

- fundo/moldura: magenta `#ff4fa3` → roxo `#7b5cff` → azul `#3f7dff`, sangria de 2,5% da largura;
- janela: `#0d1117`, raio 3% da largura, barra de navegador falsa (favicon + título + "+" + pílula de URL);
- destaque: contorno `#ffd400` 3 px (escala 1080) raio 10 px, entra em 150 ms;
- legenda: caixa alta, peso 800, 1 linha por 0,8–1,3 s, ≤3 palavras por linha, acento em `#ffd84d`;
- scrim preto em gradiente sob a legenda;
- fecho: pílula do repo + "NOS COMENTÁRIOS".

## Motor de movimento (`scripts/lib/mov.mjs`)

A camada que separa "slide" de vídeo. Importe e use em **todo** bloco:

```js
import { grain, camShot, typeStep, cursorTravel, ringClick, stagger, sway, M, p } from "./lib/mov.mjs";
```

- `grain(g, t, { alpha })` — piso de movimento em todo quadro (0,12–0,15 no escuro, 0,05 no creme).
- `camShot(g, lt, dur, { keys, focus, drift, jit, entryAmp }, fn)` — câmera com keyframes de zoom + handheld;
  aplica também a **entrada deslizante** do corte.
- `typeStep(g, [[t, "texto"], …], lt, o)` — texto cumulativo sem sobrepor o passo anterior (o bug clássico).
- `cursorTravel(g, lt, [{t,x,y,click}], o)` — arco, antecipação, trail e ripple.
- `M` — curvas: `outExpo, outCubic, outQuint, smooth, outBack, inBack, inElastic`.

Referência de leitura obrigatória antes de animar: `references/mov-perfil-de-movimento.md`
(metas medidas) e `references/mov-beats-transicoes.md` (os 4 estados de todo elemento).

## Ferramentas do projeto

`@napi-rs/canvas`, `sharp`, `ffmpeg-static`, `puppeteer-core` e as fontes Montserrat em `fonts/` já estão instalados na raiz. Não instale alternativas.
