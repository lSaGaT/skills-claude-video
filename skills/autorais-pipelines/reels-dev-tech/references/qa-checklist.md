# QA — rodar antes de entregar

## Estrutura
- [ ] 26–40 s (formato A/B/D) ou 60–110 s (formato C). Fora disso, justificar.
- [ ] 7–15 beats (A/B/D), 20–30 (C); nenhum beat com mais de 5 s nem menos de 1,5 s.
- [ ] Gancho de dor/contradição nos primeiros 1,5 s — sem nome de projeto.
- [ ] Prova quantitativa em pelo menos 2 beats.
- [ ] Ressalva/licença/uso autorizado tem beat próprio, quando aplicável.
- [ ] Fecho: cartão de link + fala "link fixado no primeiro comentário", 2,5–3,5 s.

## Movimento (medido, não opinado — `references/mov-perfil-de-movimento.md`)
- [ ] `cmp-mov.mjs` rodado no MP4 final: média entre 85% e 115% do ref de mesmo formato.
- [ ] Zero segundos abaixo de 0,3 (nenhum quadro morto).
- [ ] Cada pico do ref tem pico equivalente em ±0,3 s (transições com peso).
- [ ] Nenhum segundo acima de ~250% do ref naquele mesmo segundo (movimento gratuito = nervoso).
- [ ] Grão aplicado em todos os blocos, inclusive no claro (alpha menor).
- [ ] Todo bloco tem câmera (keyframes) + entrada de corte + saída (derrete/whip/iris).
- [ ] Nenhum texto desenhado duas vezes no mesmo `y` (usar `typeStep`).
- [ ] Caret piscando em todo beat de escrita; cursor em ≥80% dos beats.
- [ ] Nenhum elemento pousa com velocidade ≠ 0.

## Legenda
- [ ] 1 linha por 0,8–1,3 s; nenhuma linha com mais de 3 palavras.
- [ ] Uma ideia por linha; nada de número + nome + verbo juntos.
- [ ] Acento em uma só palavra; nada de duas cores no mesmo quadro.
- [ ] Nenhuma palavra cortada ou quebrando em duas linhas por acidente.
- [ ] Legenda não cobre a área de UI do Instagram (18% do rodapé) — exceto a legenda do vídeo, que fica acima dela.

## Imagem
- [ ] Moldura/glow sem banding; sem slate/título de template visível.
- [ ] Barra de rolagem do navegador escondida.
- [ ] Cada caixa de destaque aponta para algo que a fala citou naquele beat, e só aparece depois do scroll.
- [ ] O contorno de cada caixa desenha UMA vez — se a fala seguinte mantém a caixa, ele não refaz o círculo.
- [ ] Scroll para durante a troca de legenda; nenhum tranco/reverso no movimento entre beats.
- [ ] Salto de seção rola (rápido, proporcional à distância) — não corta seco nem teletransporta.
- [ ] Contraste do texto ≥ 4,5:1 sobre o fundo.
- [ ] Mascote/assinatura presente (se o padrão da marca pedir).
- [ ] Headline, conteúdo central e legenda em camadas separadas — nada sobreposto (`references/hierarquia-vertical.md`).
- [ ] Conteúdo central centrado na faixa livre (vão de cima = vão de baixo); tag como badge semi-sobreposta, não flutuante.
- [ ] Conteúdo no maior tamanho que couber — compactar gaps internos antes de reduzir escala.
- [ ] Stills de colisão extraídos no FIM de cada beat (headline longo + legenda cheia), não só no início.

## Fundo denso / parede de cards (quando houver — `references/parede-telinhas-loop.md`)
- [ ] Janela de cards calculada PELO OFFSET (j = floor/ceil do intervalo visível), nunca `j` fixo.
- [ ] Culling com coordenada absoluta — nenhum `translate` antes do loop que o `if` de culling não compensa.
- [ ] Colunas sangram os dois lados com folga ≥ `H/2·sin(θ)` da rotação aplicada.
- [ ] Propriedades por card (brilho/lift/tilt) indexam pela sequência, nunca pelo `j` absoluto (emenda invisível).
- [ ] Nenhum scrim a mais de ~0.5/0.8 pintado por cima da parede; faixa da legenda nasce junto da 1ª palavra falada.
- [ ] Probe de pixels pretos puros no MP4 FINAL em tempos de offset avançado, limite calibrado na referência.

## Áudio
- [ ] Termos técnicos escritos foneticamente; ouvir e conferir um por um.
- [ ] Nenhum beat com fala esticada para caber na cena.
- [ ] Voz −15 a −12 LUFS; trilha audible mas subordinada; fade 1,5 s.
- [ ] Master −14 LUFS, true peak −1 dB (medir com `ffmpeg -af loudnorm=print_format=summary`).

## Entrega
- [ ] 1080×1920, 30 fps, H.264 yuv420p, faststart.
- [ ] Arquivo com nome `reel-<slug>-<AAAAMMDD>.mp4`.
- [ ] Legenda do post escrita separadamente (bullets + hashtags + CTA de seguir).
