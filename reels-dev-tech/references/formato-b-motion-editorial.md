# Formato B — Motion editorial (e VSL de venda)

Tudo é desenhado: não há captura de tela. Cada peça tem **um design system** com 3 cores,
2 famílias tipográficas e um vocabulário de 4–6 movimentos, repetido até o fim.
É o formato das peças mais autorais da referência (v18, v04, v05, v22) e o único que vende.

## Anatomia de um beat no formato B

Todo beat é um *card*:
1. **fundo** (cor chapada, ou textura/marquee repetida, ou colagem em perspectiva);
2. **headline** com 2–6 palavras, uma delas no acento (serifada itálica, ou caixa alta colorida);
3. **objeto** (mockup de app, logo, contador, gráfico, cartão de UI, manuscrito, escultura);
4. **micro-legenda** de 2–4 palavras embaixo, em caixa alta pequena e cor apagada;
5. entrada em 250–400 ms (fade + 12–24 px de deslocamento vertical, ou scale de 1,04 → 1,0).

O cut seco entre beats coincide com a virada de fala (v04: 10 cortes; v18: 8; v22: 3).

## Três design systems medidos (copiar em vez de reinventar)

### B1 — Editorial creme (v18, Claude Duet)
- fundo `#f2efe9` com vinheta suave;
- tipografia: serifada de display (Playfair/Instrument) para a headline, com a palavra-chave em coral `#e8734a`; sans pequena para rótulos;
- objetos: busto grego (imagem gerada) + mockup de iPhone, ícone de app, cartões de notificação, contadores ("5 andando / 2 precisam de você"), logos de integração (Stripe/Paddle) em cards 3D com rotação de perspectiva, cartão de aprovação com valores + botões Approve/Not now e uma mão entrando do canto, Estátua da Liberdade, e um **card-tese preto** com a frase de fechamento;
- mascote pixel de 40–60 px como assinatura de marca, reaparecendo em quase todo beat.

### B2 — Esportivo escuro (v04, 7 clones da Adobe)
- fundo escuro, azul de marca `#2563eb`;
- headline palavra a palavra em caixa alta pesada; wordmark em formato de escudo;
- movimentos-assinatura: **tachado que risca e troca de palavra** ("do zero" → "em 11 dias"), grid de logos que troca de nome (Photoshop → PhotoCraft), contador que sobe com gráfico de barras, seção de cor cheia com chips, textura de palavra repetida atrás de 2–3 linhas grandes;
- CTA com pergunta binária ("comenta SIM ou NÃO").

### B3 — VSL preto e laranja (v22, venda)
- fundo preto, acento laranja `#ff6a00`;
- colagem de janelas de navegador em perspectiva 3D ao fundo (dá profundidade sem custo);
- terminal falso com linhas `✓ repositório testado` aparecendo uma a uma (1 por 0,4 s) — é o "gráfico" da prova;
- pilares: **prova → objeção → preço → garantia → CTA**, um por beat;
- números gigantes (8/10, US$ 0,00) com a mesma família do headline;
- mockup de celular com a página de preço; botão final "QUERO A SKILL" como pílula laranja;
- última linha com sublinhado laranja animado ("SEU PRIMEIRO VÍDEO HOJE").

## Tokens de movimento (usar este repertório, nada além)

| movimento | uso | duração |
|---|---|---|
| fade + subida 16 px | entrada padrão de headline/objeto | 300 ms |
| tachado que risca da esquerda | correção/negação | 400 ms |
| troca de palavra (swap) | substituição de nome/valor | 250 ms |
| contador numérico | prova quantitativa | 600–900 ms |
| cards em perspectiva | profundidade/fundo | estático com parallax de 8 px |
| pílula que entra do rodapé | CTA | 350 ms |
| marquee de textura | fundo de seção longa | 8–20 s em loop |

## Regras de layout

- margem de segurança: 8% nas laterais, 12% no topo, 18% no rodapé (a UI do Instagram cobre);
- no máximo 2 blocos de texto por quadro, 3 no modo "card de UI";
- cor de acento em **uma** palavra por headline, nunca duas;
- fundo nunca compete com o texto: contraste mínimo 4,5:1 e, se necessário, vinheta.

## Copy do formato B

Frase curta + número + verbo de ação. Exemplos da referência:
"Um dev recriou sete programas da Adobe. Do zero, em Rust." · "Em 11 dias, 45 mil estrelas." ·
"Você pede. Ele faz." · "Toda manhã: 5 andando, 2 precisam de você." ·
"Mas antes de enviar, pagar ou apagar, ele pergunta." · "Quem delega primeiro, sai na frente."
