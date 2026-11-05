# Parede de telinhas em loop infinito (fundo denso de cards)

Fundo de cards/telinhas dispostos em colunas, umas subindo outras descendo, estilo
abertura de portfólio (referência de projeto: `projetos/nodo-prime-site/prints/diferença/Screenshot_2.png`).
Este documento existe porque uma parede com buracos custou 8 versões de revisão (v3–v10
do promo Nodo Prime, 29/10/2026) — o defeito é intermitente e o QA "de olho" em
quadros do início do vídeo não o pega.

## O padrão da referência (medido)

- **3 colunas gigantes** — cada card ~37–40% da largura do quadro; as colunas das
  laterais estouram POUCO fora (~60–70 px por lado em 1080 px).
- Grid denso com **vãos finos e uniformes** (10–14 px) entre cards — o vão fino é
  parte do design; o que reprova é buraco grande.
- Colunas **desalinhadas entre si** (masonry: cada coluna começa numa altura diferente).
- Cards com proporção do print original (ex.: 421×575); conteúdo ciclando em
  sequência mista de 15 por coluna (sem card igual vizinho do irmão).
- Movimento: uma coluna sobe, a próxima desce, a próxima sobe (~70–80 px/s).
- Parede inteira **levemente rotacionada** (~3°).
- Cards escuros ganham **lift de branco por print** (os prints dark precisam de
  +0,25/0,30 de branco para não virarem manchas pretas).

## As 3 leis da parede sem buraco

### 1. A janela de cards é calculada PELO OFFSET — nunca `j` fixo

Com `for (j = 0; j < N; j++)` e offset animado, cedo ou tarde todos os cards
desenhados estão fora do quadro e o pé/topo vira preto. O intervalo de `j` que
cobre o quadro **depende do offset do instante**:

```js
const jMax = Math.floor((H + margem + off - base) / pitchY);
const jMin = Math.ceil((-margem - ch + off - base) / pitchY);
for (let j = jMin; j <= jMax; j++) {
  const y = j * pitchY - off + base; // topo do card em coordenada absoluta
  // card cobre [y, y+ch] — por construção intersecta o quadro
}
```

### 2. Geometria em coordenada absoluta — sem translate "armadilha"

Um `ctx.translate(x, -pitchR)` antes do loop desloca o sistema de coordenadas e a
condição de culling feita com o `y` do loop (relativo) pula cards que estariam
visíveis: no caso real, `y > H + 40` com translate de −551 px descartava todo card
cujo topo ficasse abaixo de y≈1408 — faixa preta crescente no rodapé a partir de
~21 s de vídeo. Desenhe em coordenada absoluta e faça o culling com o mesmo número.

### 3. Colunas sangram os dois lados + rotação exige sobra nos cantos

A rotação de 3° leva os cantos do quadro até ~±50 px além da largura em coordenadas
da parede. As 3 colunas somadas (largura + vãos) devem cobrir `W + 2·(H/2)·sin(θ)`
com folga, senão aparecem cunhas pretas nos cantos:

```js
const sangria = (H / 2) * Math.sin((3 * Math.PI) / 180); // ≈ 50 px em 1920 de altura
const totalX = cols * cw + (cols - 1) * gapX;             // ≥ W + 2·sangria
const x0 = (W - totalX) / 2;                              // negativo = sangra dos dois lados
```

## Loop infinito sem emenda

- `periodo = 15 * pitchY` (comprimento da sequência × passo vertical) — o offset
  usa `((t * speed) % periodo + periodo) % periodo` e a emenda cai sempre no mesmo
  padrão: invisível.
- Índice da sequência aguenta `j` negativo: `seq[((j % 15) + 15) % 15]`.
- **Toda propriedade por card (brilho, lift, tilt) indexa pela posição na sequência
  ou pelo print — nunca pelo `j` absoluto.** Se o brilho variar com `j`, o mesmo
  card muda de tom ao dar a volta e a emenda fica visível.

```js
const k15 = ((j % 15) + 15) % 15;
const img = PRINTS[seq[k15] - 1];
ctx.fillStyle = `rgba(255,255,255,${LIFT_POR_PRINT[seq[k15] - 1]})`;
```

## Scrim: a parede é fundo, não área morta

- **Nunca pintar gradiente a 100% de preto por cima da parede** (o caso real tinha
  `rgba(0,0,0,1)` no rodapé — um "buraco" permanente de ~340 px em todas as cenas).
  Véu máximo sensato: ~0.5 na base, ~0.8 no topo (contraste do headline).
- Legenda com faixa preta: a faixa é da legenda e **nasce junto com a primeira
  palavra falada da linha** — filtrar palavras ainda não faladas antes de montar as
  linhas, senão retângulos pretos vazios flutuam na zona da legenda:

```js
const ps = captionDaBeat(b, t).filter((p) => p.dt > -0.02); // só palavra já falada
```

## QA objetivo — probe de pixels (não confiar no olho)

Contar pixels pretos puros (r,g,b < 10) em frames extraídos **do MP4 final**, por
faixa (topo/centro/base), em tempos com offset avançado (fim do vídeo — é lá que o
buraco de janela fixa aparece), não só no início:

- limite calibrado **medindo a própria referência** com o mesmo probe (no caso real:
  4,67% de pretos na faixa central da referência nota 8 — limite por faixa central);
- pretos residuais aceitáveis: vãos finos entre cards, cards escuros com lift,
  espaço de composição entre cards grandes em cenas de leque/fan.

## Código de referência validado

`projetos/nodo-prime-site/scripts/render-nodo2.mjs`, função `parede(t)` (v11, 29/10/2026)
— 41,2 s renderizados, probe central 3,8–4,1% (abaixo do limite da referência),
zero buraco em todos os tempos testados (1,2 / 8,5 / 12,5 / 18,5 / 26,5 / 31 / 36 / 40,5 s).
Stills de prova: `projetos/nodo-prime-site/qa/v11.png-t*.png`.
