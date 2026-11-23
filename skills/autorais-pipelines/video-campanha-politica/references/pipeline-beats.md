# Pipeline de BEATS — super ataque com clipes, carimbos sobre vídeo e mapa de dados

Arquitetura validada no vídeo `nordeste/video-final/SUPER-ATAQUE-v3.mp4` (3:22, 21/10/2026),
aprovado de primeira pelo usuário após duas versões rejeitadas. É o pipeline padrão para
vídeo de ATAQUE com clipes de vídeo reais + carimbos de manchete + seção de dados/mapa.

## As 6 leis (cobradas pelo usuário — quebrar qualquer uma volta como refação)

1. **1 fala = 1 beat = 1 bloco visual, e a fala é CURTA**: alvo 3–7s (máx. absoluto 11s,
   ~40–120 caracteres). Bloco de 20–40s faz a informação chegar em velocidade diferente da
   fala e o usuário rejeita o vídeo inteiro. No v3: 38 falas, maior = 7,1s.
2. **TODOS os cortes enviados entram no vídeo.** O usuário manda "pancada de vídeo" e
   confere um por um. Antes de entregar, liste cada corte enviado e o beat onde aparece.
3. **Carimbo/card NUNCA em fundo chapado** ("fundo azul tosco", "fundo moroxo"): sempre
   overlay sobre vídeo mudo escurecido (ou sobre o mapa). A notícia chega DENTRO da cena.
4. **Seção de estados/números = MAPA ou visual de dados, não quadrinhos empilhados.**
   Ex.: mapa do Brasil com estados ficando vermelhos na ordem cronológica real + ano
   gigante + manchete daquele estado por cima.
5. **Pessoa real fala com o ÁUDIO ORIGINAL dela.** Beat SEM TTS: o clipe toca com som;
   a narração entra DEPOIS, sobre o freeze ou sobre vídeo mudo. Depois do discurso,
   corte seco: o som ambiente MORRE JUNTO (o drone/bed para no mesmo instante).
6. **Espírito**: o vídeo tem que gerar revolta ("querer arrancar o presidente na base da
   pancada"). Ritmo seco, boom em cada pouso, zero respiro longo.

## Arquitetura: o BEATMAP é a fonte única de tempos

Um único gerador produz a tabela de beats que alimenta o mapa, os overlays e a mixagem.
Nunca espalhe tempos à mão em vários arquivos.

```
falas (blocos.json) ──► ElevenLabs (1 MP3 por beat) ──► beatmap.py ──► beatmap.json + beatmap.js
                                                                              │
   ┌──────────────────────────────────────────────────────────────────────────┘
   ▼
render-v3.mjs (puppeteer) ──► gráficos .mp4 (mapa, bandeira, stats) + cards .png
   ▼
build-v3.py ──► PARTES (bg mudo + overlays) ──► concat ──► mix por offsets ──► FINAL
```

### 1. `beatmap.py` — fonte única

- Lê as durações REAIS dos MP3s com ffprobe e monta a tabela: `id, audio, adur, gap, dur (= adur+gap), t (global)`.
- Beats podem ser SEM áudio (`audio: null`) — clipes com áudio original (Lula/Nikolas) e
  stamps de carimbo; a duração é fixa.
- Gera DOIS artefactos: `beatmap.json` (o build lê) e `beatmap.js` = `window.BEATMAP={...}`
  (o HTML do mapa lê via `<script src>` — **fetch() não funciona em file://**).
- Vantagem decisiva: mudou um gap, roda de novo e mapa/overlays/áudio se realinham sozinhos.

### 2. Gráficos HTML→vídeo (puppeteer determinístico)

- Canvas 1080×1920, `window.RENDER(t)` puro e um loop que respeita `window.__STOP`
  (o capturador seta `__STOP`, chama `RENDER(f/24)` e faz screenshot por frame):
  ```js
  let t0=performance.now();
  (function loop(){if(window.__STOP)return;const t=((performance.now()-t0)/1000)%DUR;window.RENDER(t);requestAnimationFrame(loop);})();
  ```
- **`X.setTransform(1,0,0,1,0,0)` na primeira linha de RENDER** — shake/translate do frame
  anterior polui o estado e desloca tudo para sempre.
- Mapa: GeoJSON dos estados (ex.: `codeforamerica/click_that_hood` brazil-states —
  `properties.sigla`) convertido para `.js` (`window.BRASIL_GEO=...`). Projeção
  equiretangular com x×cos(lat média); **atenção ao sinal do CY**:
  `CY = centro_y + ((LAT0+LAT1)/2)*K` (sinal trocado = mapa some do canvas).
- Flip de estado = fill vermelho + glow + flash 0,45s + shake decaindo + ano gigante
  (scale pop) + placa com nome do estado. Datas SEMPRE da tabela documentada no dossiê.
- Fontes via `document.fonts.load()` antes do primeiro screenshot (sem isso o frame 0
  sai com fonte fallback serif).

### 3. `build.py` — partes com overlay + concat + mix

Helpers obrigatórios (padrão build-v3.py):

- **`part()`**: um bg (vídeo mudo, gráfico ou preto) + N overlays, num único ffmpeg.
  Modos de bg: `v` (608×1080 → scale+crop 1080×1920), `h` (1920×1080 → scale altura +
  crop central), `vdark`/`hdark` (mesmo + `eq=brightness=-0.30:saturation=0.85`),
  `chart`, `black`. Saída limitada por `-frames:v round(dur*24)` (**nunca `-t`** — com
  tpad o `-t` corta o freeze).
- **Overlay de carimbo (o coração do visual v3)** — PNG transparente, fade alpha,
  entrada em T0 exata:
  ```
  [i:v]format=rgba,scale=950:-2,
       fade=t=in:st=0:d=0.18:alpha=1,
       fade=t=out:st={d-0.22}:d=0.22:alpha=1,
       setpts=PTS+{T0}/TB[ov{i}];
  {prev}[ov{i}]overlay=x=(W-w)/2:y=(H-h)/2:enable='between(t,{T0},{T0+d})'[oc{i}]
  ```
  Cadeia de N overlays exige **rótulo intermediário por passo** (`[oc0]`, `[oc1]`…);
  concatenar os filtros sem rótulo dá "No such filter: ''".
- **`freeze`**: `tpad=stop_mode=clone:stop_duration={freeze}` no fim do bg; o freeze tem
  que ser ≥ (preciso − lido) + 0,25 de folga.
- **`skip-if-exists`**: cada parte verifica se o MP4 já existe e pula. É isso que torna a
  revisão cirúrgica ("refaz só o beat 12") em vez de refazer o vídeo.
- **Durações reais → `Treal`**: medir cada parte com ffprobe e reescalar os offsets dos
  beats dentro da parte (`off * real/nominal`). Arredondamento de frame acumula drift —
  sem isso a narração sai do lugar com o tempo.
- **Concat** por lista de arquivos (`-c copy`).

### 4. Áudio (mix por offsets)

- Narração: `adelay={Treal[beat]*1000}` por beat, `amix=inputs=N:normalize=0` +
  `alimiter=limit=0.95`.
- Clipe com áudio original: `atrim={a}:{b},asetpts=PTS-STARTPTS` e adelay no beat.
- VT com voz ambiente de fundo: volume 0.15.
- **Leito de silêncio no fim do mix**: `anullsrc` com `-t {duração do vídeo + 0.6}`
  misturado no amix. Sem ele, se o input mais longo do mix acabar antes do vídeo,
  o `-shortest` do mux CORTA o vídeo (caso real: final perdeu o hold de 4s do card).
- **Corte seco**: o bed/drone é adicionado DUAS vezes — `atrim=0:{instante do corte}` e
  de novo mais baixo depois do corte. Silêncio de verdade é o que vende o "derrubaram o áudio".
- SFX: boom no pouso de cada carimbo/flip, riser antes das viradas, drone sob mapas/ATO escuro.

### 5. QC (antes de entregar — sempre)

1. **Folha de contato**: `ffmpeg -i final.mp4 -vf "fps=1/8.4,scale=270:480,tile=4x6" -frames:v 1 sheet.jpg`
   + segunda passada no último ato. OLHE cada tile.
2. **Frames nos pontos críticos** (gancho, carimbo batendo, mapa, stamp, bandeira,
   final) em resolução cheia.
3. **Áudio por janela** com volumedetect: narração presente no início de 2–3 beats,
   áudio original do clipe na janela dele, janela do corte seco ~ −20 dB só com o boom,
   máx global ≤ −0,3 dB.
4. Checklist de entrega: todos os cortes usados? carimbo sem fundo chapado? manchete
   cabe? mapa bate com a tabela do dossiê? blindagem checada (formulções defensáveis)?

## Falas: template de blocos

```json
[{"arquivo":"v3-b01","texto":"Depois desse vídeo, você não vota mais no Lula."},
 {"arquivo":"v3-b02","texto":"O Pê Tê. Partido dos trabalhadores."}]
```

- Números/datas por extenso ("dois mil e sete"); sigla perigosa soletrada ("Pê Tê").
- Sem travessões, sem jargões, sem reticências.
- 1 linha = 1 beat. Se a fala pede 3 informações, são 3 beats.
- Regenerar: `node gerar-v3.mjs --pular-primeiro` (pula os MP3 que já existem).

## Blindagem (manteve o v3 inteiro sem fact-check)

- Nunca "votou contra" sem roll call; use o que a manchete DIZ ("derrota para o governo").
- Atribuição vira força: "o próprio governador do PT admitiu" > afirmar direto.
- Claim forte do aliado ("ameaça soberania") atribuído a quem falou.
- Números arredondados para baixo quando duvidoso ("mais de duzentas famílias" p/ 219).
- Toda manchete de carimbo tem veículo + data + fonte no fontes.txt do projeto.
