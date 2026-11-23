# Hierarquia vertical: headline / conteúdo / legenda (9:16)

Caso real (promo Nodo Prime v11–v12, 29/10/2026): o headline de 2 linhas gigantes
sobrepujava a tag do produto ("PRÓPRIOS" em cima do badge "SONARE") e o bloco
central encostava na legenda. O cliente mede VÃO, não só colisão — e reprova
conteúdo pequeno ("colocou muito pequeno").

## As 3 camadas

1. **Headline (topo)** — linhas em `y = 218 + li·(tam·1.16)`, baseline middle;
   bottom real = última linha + `0.55·tam` (+26 de sombra).
2. **Legenda (base)** — ancorada em y≈1660, 1–3 linhas de 92px; topo da faixa =
   `yBase − lh/2 − 14`.
3. **Conteúdo (centro)** — cabe EXCLUSIVAMENTE na faixa livre entre 1 e 2.

## Regras

- **Faixa calculada, não chutada.** Computar `yHeadBottom` e `yLegTop` por beat.
  O nº de linhas da legenda usa as palavras QUE CAEM NO BEAT (mesmo filtro do
  caption), não a fala inteira do bloco — a fala inteira superestima as linhas e
  encolhe o conteúdo à toa.
- **Conteúdo centrado na faixa**: vão de cima = vão de baixo. Se não couber:
  1º COMPACTAR gaps internos (ex.: vão entre fileiras de um leque: 152px → 40px
  recuperou ~90px sem encolher card), 2º reduzir de escala. Nunca invadir texto.
- **Tag do produto = badge semi-sobreposta** na borda superior do card (metade
  dentro, metade fora): rouba ~32px em vez dos ~118px de tag flutuante — é o que
  permite manter o card GRANDE (640px em 1080 de largura) sem colidir.
- **Card grande é requisito do cliente**: encolher é o ÚLTIMO recurso; compactar
  gap e mover a tag para badge vêm antes.
- **QA visual nos piores beats**: extrair stills onde o headline é longo E a
  legenda tem mais palavras (fim de cada beat) — é lá que colide; stills só do
  início do beat não pegam.

## Código de referência validado

`projetos/nodo-prime-site/scripts/render-nodo2.mjs` — `tamHeadline()`,
`faixaConteudo()` e o fit em `produto()` / `objetos()` / `numero()` / `fan()`
(v13, 29/10/2026). Stills de prova: `projetos/nodo-prime-site/qa/v13.png-t*.png`.
