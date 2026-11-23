# Formatos C, D e E

## C — Dashboard de feature (60–110 s)

Usado quando o produto tem UI real e há mais de 6 recursos para mostrar (v19, OpenCode 2.0 — 106 s, 29 beats).

- fundo `#0a0a0c` com spotlight radial atrás do título;
- topo esquerdo: nome do produto + **contador de capítulo** `01 / 09` em mono caixa alta, com régua horizontal azul;
- headline centralizada: sans display + **palavra-chave em serifada itálica azul** (`#4f7cff`);
- abaixo: gravação real da UI em cartão arredondado 16 px, borda 1 px, com anel de seleção azul onde o mouse está;
- transição: fade 300 ms com blur no quadro que sai; corte dentro do capítulo é seco;
- duração por capítulo: 8–14 s; por beat: 3–4 s.

Estrutura de roteiro: um capítulo por recurso, sempre na mesma ordem — **o que é → como se faz → o que muda para você**. O capítulo 1 sempre apresenta o "guarda-chuva" da atualização ("a maior atualização do agente open source").

Cuidado medido na referência: capítulos com 4 recursos em 8 s viram sopa. Um recurso por beat, no máximo 3 informações por capítulo.

## D — Footage + overlay de UI (25–41 s, sem ou com pouca narração)

Filmagem (banco, IA ou tela de celular) tratada com vinheta e leve blur nas bordas, e por cima:

- legenda em **bolha** ancorada perto do objeto (não centralizada), com a palavra-chave em chip colorido;
- cartões de UI flutuantes: notificação de SMS, cartão de código, diagrama de fluxo, contadores;
- **sticker de mascote** persistente no canto (assinatura de marca);
- cor de acento por vídeo (laranja, teal), usada em chips, botões e na palavra do acento;
- cortes a cada 2–4 s entre planos do footage; a UI é a continuidade.

Variante econômica comprovada (v11): **sem narração**. Só trilha + legendas em bolha + cartões. Útil quando a voz não agrega (ou o orçamento de TTS é zero) — mas exige legenda ainda mais enxuta (2–3 palavras).

## E — Slide estático 4:5 exportado como vídeo (8 s)

Para volume e para carrossel (v14, v17, v20). Layout:

- 720×900, `01/09` no topo esquerdo em mono e "arraste →" no rodapé direito;
- headline de 3–5 linhas com uma palavra em cor de acento;
- um dado visual: barra de benchmark com valores, grade de logos em chips, ou selo (CVSS/URGENTE);
- linha de fonte no rodapé ("Fontes: BBC · php.net");
- 8 s de duração apenas para o Instagram tratar como vídeo; zero animação (ou 1 pulso de escala de 1,0 → 1,01 no acento).

Regra: o slide 1 vende o carrossel inteiro — a headline precisa fazer sentido sozinha, sem o áudio.
