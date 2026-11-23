# Réplica de vídeo específico — pipeline de calibragem

> Fluxo usado na réplica do reel "meta-demo" (81,41 s, `_replica/ref/ref.mp4`).
> A primeira versão tirou 2/10: os stills "batiam", mas o vídeo parecia copiado e
> colado — porque **still não mede movimento**. Este pipeline corrige isso.

## Fases

### 0. Antes de tudo: assistir em 0,1 s (não em 0,5 s)
```bash
node _replica/analise/dez.mjs            # 814 quadros por vídeo a 10 fps, folhas de 1 s (REF cima / NOSSO baixo)
node _replica/analise/casar.mjs          # CASAMENTO frame a frame: nosso[i] × ref[i] no mesmo t
node _replica/analise/sheets-cmp.mjs     # (grosseira) folhas de 0,5 s — só para visão geral
```
O meio segundo ESCONDE o que importa: em t=5 ele mostrava "duas cenas parecidas" e
escondeva que o ref usa um insert inteiramente diferente. A 0,1 s a cadência e o
dispositivo aparecem. O casamento frame a frame pega o que nenhuma folha pega:
**conteúdo diferente no mesmo instante** (nosso corte 0,3 s adiantado = desvio 212
nos frames 12,1–12,4, invisível no perfil de movimento).

Depois, para o detalhe fino de um beat suspeito, extrair tiras de 0,1 s:
```bash
node_modules/ffmpeg-static/ffmpeg.exe -ss 43.0 -i _replica/ref/ref.mp4 -t 1.0 -vf "fps=10,scale=240:-1" quadro_%02d.png
```

### 1. Medir o movimento (não opinar sobre ele)
```bash
node _replica/analise/movimento.mjs                 # perfil dos 81 s, aponta segundos mortos
node _replica/analise/cmp-mov.mjs minha.mp4 0 20    # compara com o ref por segundo
node _replica/analise/cmp-mov.mjs trecho.mp4 49 53.3 49   # trecho isolado: 4º arg = offset no ref
```
Ver `mov-perfil-de-movimento.md` para os valores-alvo. **Nenhuma iteração é aprovada
sem rodar isto.**

### 2. Desmontar o ref
```bash
node _replica/analise/diff.mjs        # grupos de movimento => edital de beats
node _replica/analise/sheets-key.mjs  # contact sheet dos frames de maior mudança
node _replica/analise/medir.mjs       # posições/tamanhos em timestamps-chave
node _replica/analise/fontes.mjs      # comparação de fontes lado a lado
```

### 3. Cena em blocos
- 1 bloco = 1 beat, `add(t0, t1, nome, draw)`; o motor aplica câmera, entrada, grão e saída.
- cada bloco desenha `bg()` próprio: nada de estado entre blocos.
- toda animação é função de `lt` (tempo dentro do bloco). Zero estado acumulado.

### 4. Loop de ver sem renderizar
```bash
node .agents/skills/reels-dev-tech/scripts/render-meta-demo.mjs --stills 1.3,21.4,43.8
node _replica/analise/colar.mjs 1.3,21.4,43.8     # REF em cima, NOSSO embaixo, mesmo tempo
node _replica/analise/compara.mjs 1.3 21.4        # jpg lado a lado
node _replica/analise/overlay.mjs 1.3             # 50% translúcido para medir desvio de posição
```
Segundos por still, não minutos.

### 5. Render e aceitação
```bash
node .agents/skills/reels-dev-tech/scripts/render-meta-demo.mjs --out _replica/replica-final.mp4
node _replica/analise/cmp-mov.mjs _replica/replica-final.mp4 0 81
```
Aprovar com média 85–115% do ref e **zero segundos mortos** (ver §4 do perfil).

## Defeitos que custam caro (todos pegos nesta réplica)

1. **Texto cumulativo desenhado por cima do anterior** — `textT("são feitas")` e depois
   `textT("são feitas em")` sem apagar o primeiro. Resultado: letras emboladas.
   Corrigir com `typeStep()` (`mov-texto-e-typing.md`).
2. **Melt cedo demais em bloco curto** — `MELT_DUR = 0,30` num bloco de 2,0 s fazia o
   plano começar a derreter em 1,7 s e o still "batia" com o ref **por acidente**
   (mostrava dois elementos sobrepostos). Usar 0,16 s em blocos <2,5 s.
3. **`globalAlpha` é absoluto** — dentro de um `save()`, `g.globalAlpha = a` mata o fade
   da camada externa. Sempre `*=`.
4. **Stills na fronteira do bloco ficam vazios** — calibrar a fronteira com prova nos
   dois lados (`t0-0,1` e `t0+0,1`).
5. **Elementos que se sobrepõem sem perceber** — conferir por sobreposição de alpha,
   não só presença/ausência (a marca do card em cima do título foi um caso real).
6. **Zoom >1,1 em título grande** corta a borda do 9:16 (o "%" do "99%").
7. **Emoji desenhado à mão** nunca iguala o do ref: desenhar como vetor próprio
   (carinha com óculos, lágrima) e aceitar a diferença de estilo.
8. **Parede de cards** não é ortogonal: rotate global ≈ -0,08 rad + rotação ±0,02 por
   card + escala menor nas linhas de baixo.
9. **Gráfico de onda que decai** — o ref mantém envelope cheio até ~85% da largura.
   Envelope `exp(-fx*2,6)` deixa o lado direito vazio e "morto".
10. **Recursão (telefone dentro de telefone) desenhada de dentro para fora** — o fill
    do nível externo pinta por cima de todo o conteúdo interno; em zoom alto o frame
    fica VAZIO. Sempre `for (d = 0; d <= 7; d++)` (fora → dentro).
11. **Íris em corte de fundo trocado (creme→preto)** — o anel de fechamento muda pouco
    por frame (~1,6 medido); o ref derrete o frame inteiro (melt pesado: 8,4). Íris só
    quando o ref realmente fecha íris.
12. **Pico sustentado de 2 s não se faz com zoom só** — a escala satura (o conteúdo
    visível para de mudar) e o movimento morre no meio. Duas fases: zoom exponencial
    acelerando (1→9) + **scroll interno com wrap** (texto rolando dentro do card,
    ~3.000 px/s) + tilt crescendo. É o scroll que sustenta os 28 do ref em t=51.
13. **Cortar do elemento grande para o pequeno denuncia** — quando o ref encolhe a
    parede até virar a grade (32,5–33,2), encolher de verdade (scale contínuo + fade)
    com a digitação acontecendo por cima; nunca corte seco entre os dois layouts.
14. **Beat cinético de letras** — `kineticLine`/`wordReveal` (palavra-a-palavra) é fraco
    demais para os picos de 3,7/6,4; usar `lettersFly()` (letras espalhadas + rastro,
    `mov.mjs`).
15. **Palavra que "sofre o efeito"** (trema/tremer.) — não basta digitar: as letras se
    dispersam em alta frequência (`selectionText({shake})` / `tremendoTexto()`), e a
    toolbar some quando o efeito começa (ref 68,8–70,0, pico de 7,5).
16. **Câmera não disputa com o conteúdo** — um snap de zoom 1,9× da RIG por cima de um
    beat que já tem efeito próprio estoura a regra dos 250% (t=68 ficou a 294%). Quando
    o bloco tem efeito grande, a RIG fica quieta (zoom ~1,0–1,1).
17. **Picos do ref podem ser INSERTS, não zoom de câmera** — a 0,1 s ficou claro:
    t=5 é um flood laranja com buraco elíptico abrindo (o "O"), t=26 é o "99%"
    explodindo DO MODAL (escala 0,24→1 em 0,14 s com ghosts). Punch de câmera por
    cima mostra a cena crescendo — dispositivo errado mesmo com o número certo.
    Regra: câmera empurra ≤12% em moves longos; mudança grande de escala é insert
    do elemento (punch-in com snap no corte).
18. **Recursão/telefone-em-telefone é DESCENDENTE** — cada filho fica na parte de
    BAIXO da tela do pai (câmera apontando para a tela) e o foco do zoom acompanha
    a cadeia (origin no alvo): a escala sempre revela conteúdo novo. Túnel
    concêntrico de 8 níveis lê como bagunça e o texto nunca é legível.
19. **Cascata entre beats** — a cena seguinte entra enquanto a atual sai (8–14
    frames de overlap). A entrada padrão de 0,18 s criou um vazio em 62,6 s (o ref
    já tem o gráfico no primeiro frame). Blocos que entram a seco: `CUT_IN`.
20. **Mockup tem staging** — o site do ref entra BRANCO E VAZIO (35,5–36,3) e o
    conteúdo aparece depois; editor de código mostra código REAL colorido e as
    pílulas carregam o valor do ref ("Linha 80", não "Linha 02"). Detalhe de
    conteúdo no frame errado = desvio de casamento alto mesmo com movimento bom.
21. **Valores das fontes** (aplicáveis a canvas): stagger de caracteres 20–40 ms
    (1–2 frames), reveal total ≤800 ms; overshoot de impacto 1,18→1,0 em ~0,18 s
    com flash; rastro = desenhar o glifo 2–4x em posições passadas com alpha
    decrescente (ou smear esticado na direção do movimento); hold de ≥0,3 s após
    cada beat é SPEC — congelar fora dele é vazamento, não cadência.
22. **Strobe de padrão rolando (regra de Nyquist)** — num zoom auto-similar,
    deslocamento por frame EM LINHAS = scroll/900, independente do zoom e do
    nível: 5,0 linhas/frame realinham o padrão e o diff vai a ZERO (medido: scroll
    4500 derrubou t=51 de 85% para 14%). Faixa útil: 0,5–1,5 linha/frame.
23. **Texto de rolagem preenche o CORPO** — linhas = altura_do_card/espaçamento + 2
    (~22 num card 520 com lh 30); desenhar 9 deixava 60% do telefone vazio no zoom
    alto e tetava o diff (11→32 em t=51 ao corrigir).
24. **Motion blur por fantasmas: ordem importa** — desenhar o mais velho primeiro
    (alpha 0,22 → 0,45) e o principal POR ÚLTIMO a alpha 1; ao contrário, os fills
    escuros dos fantasmas cobrem o texto do principal e o contraste desaba
    (t=50/51 caíram para 30%/11% na primeira tentativa).
25. **Foco da recursão: marco = quando o PRÓXIMO nível toma a tela** (zz·w_{d+1} =
    720). Marcos adiantados (frações da razão) deixam o nível que preenche
    deslocado e um nível pequeno centrado — o "telefone pequeno e parado" da
    folha d51. E o zoom não para no meio: o nível corrente cresce até estourar.
26. **Sweep de 2π exato some** — `arc(..., start, start + 2π, anticlockwise)` pode
    renderizar ZERO em alguns canvas; limite o sweep a 1,995·π.
27. **Números que CONTAM, não piscam** — versões/contadores do ref rolam do valor
    anterior até o alvo (~0,4 s, outCubic, 1 casa); trocar texto pronto lê como bug.
28. **Efeito "só o que sofre o efeito treme"** — no trema, as LETRAS tremem e o
    chip fica parado; sacudir o contêiner junto suja o efeito e o usuário percebe.

## Report da réplica

- Cena: `scripts/cena-meta-demo.mjs` (22 blocos) + `scripts/lib/kit.mjs` (mockups;
  `cardHero({morf})` troca a paleta, `selectionText({shake})`) + `scripts/lib/mov.mjs`
  (motor de movimento; `lettersFly` e `tremendoTexto` para beats cinéticos).
- Renderer: `scripts/render-meta-demo.mjs`.
- Ferramentas de análise: `_replica/analise/*.mjs` (e cópias em `scripts/qa-replica/`).
- Comparativos: `_replica/folhas/` (0,5 s) e `_replica/teste/colados/`.
