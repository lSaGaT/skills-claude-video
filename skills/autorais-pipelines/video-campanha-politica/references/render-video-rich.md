# render-video-rich.mjs — vídeo rico em evidência (clipes, fotos, manchetes grandes)

Segundo renderizador da skill, para vídeos com **clipes de vídeo com áudio próprio** (falas do adversário), **fotos em tela cheia** e **manchetes grandes com tempo de leitura**. Validado no vídeo Flávio 22 (out/2026). O render clássico (`render-video.mjs`) continua sendo a opção para vídeo 100% tipográfico.

```bash
node render-video-rich.mjs [--preview <segundo>]
```

Tudo vem de `cenas.json` na pasta do projeto (o script é data-driven, sem nada específico de projeto). Dependências iguais às do render clássico + ffmpeg/ffprobe completos (o projeto pode ter o ffmpeg full em `tools/ffmpeg/bin/` — apontar os caminhos no `cenas.json`).

## Arquitetura (por que é diferente do render clássico)

Render em **SEGMENTOS**: cada parte vira um MP4 e no fim tudo é concatenado + muxado com o áudio mestre.

1. **Partes canvas** (foto, contador, reportagem, checklist, campanha, intro): frames desenhados no @napi-rs/canvas → pipe RGBA → seg MP4.
2. **Partes clipe**: o corte do adversário passa pelo ffmpeg (scale 9:16 + crop com deslocamento + grade de cor por tom + overlay PNG com legenda/chip/vinheta) → seg MP4.
3. **Áudio mestre**: narrações + áudios originais dos clipes + SFX de pousos, tudo posicionado por `adelay` e somados com `amix normalize=0` sobre uma base `anullsrc` (a base É o input 0 e precisa entrar no amix).
4. `concat` (demuxer, `-c copy`) → mux com `-c copy`.

Consequência prática: **clipes só existem no MP4 final** — o `--preview` só desenhará partes canvas. Para QA de clipe, extraia frame do MP4 final (`ffmpeg -ss T -i final.mp4 -frames:v 1 f.png`).

## Regras de direção embutidas (não reinventar — foram correções do usuário)

- **1 fala = 1 beat visual.** Cada cena/bloco de narração cobre UMA imagem, UM carimbo ou UM clipe. Bloco longo passando por cima de várias manchetes = correção garantida na revisão.
- **Manchete GRANDE e com tempo de leitura:** card a ~86% da largura (930–1000 px), mínimo 3 s na tela, narração + 1 s de silêncio. NADA de carimbo piscando por 1 s.
- **Bloco centralizado verticalmente:** calcular a altura total (cards + gaps) e centralizar na zona útil (320–1570). NUNCA ancorar cards no topo com destaque em linha fixa — cria o "buraco" no meio que o usuário aponta.
- **Gap generoso entre cards:** ~95 px.
- **Fundo nunca chapado:** foto real em tela cheia com movimento (Ken Burns) + gradiente escuro; gradação emocional por ato (`tom: "quente"` dourado / `"frio"` dessaturado azulado); flash + shake no pouso de cada card; grão de filme + vinheta em tudo.
- **Clipes do adversário em tela cheia**, com moldura de vinheta, barra de chip (veículo · ano) e legenda da frase; narração entra ANTES do clipe (intro) ou por cima com o áudio do clipe abaixado (`duck: true`, volume 0.25).
- **Atribuição no ÁUDIO, não só na tela:** o nome de quem fez vai falado ("O Bolsonaro pegou em 190 e elevou para 600"), nunca "quando ele chegou".

## cenas.json — estrutura

Campos globais: `saida`, `lead` (0.5), `gap` (0.15), `tail` (2.0), `fontesDir`, `ffmpeg`, `ffprobe`, `somCarimbo`, `cenas[]`.

Campos comuns de cena: `id`, `tipo`, `audio` (MP3 do bloco), `hold` (silêncio depois da narração, usar ≥ 1.5 em cenas com card para leitura), `tom` (`"quente"` | `"frio"`), `kicker` (pill no topo).

### tipo: "reportagem" — manchetes grandes (o carro-chefe)
`cards[]` {imagem, fonte, data, t0 (SEGUNDOS na cena, não fração)} — card de papel branco, linha vermelha, rodapé com fonte à esquerda e data à direita (nunca sobrepõe o print), pouso com escala 1.9→1 + flash + shake + SFX automático. `destaque` {texto, cor, t0} — frase-forte embaixo (y 1660).

### tipo: "foto" — tela cheia com Ken Burns
`bg` (foto retrato = Ken Burns nítido; paisagem = vira fundo desfocado automaticamente), `linhas[]` {texto, cor, y, size, t0}, `arte` {caminho, t0} (card da arte oficial subindo).

### tipo: "contador" — número impacto sobre fundo desfocado
`bg`, `rotulo`, `de`, `para`, `prefixo`, `sub[]` (linhas no topo), `chip` (fonte), `kicker`.

### tipo: "checklist" — conquistas com ✓ + provas
`cabecalho`, `itens[]` (pills com check verde, SFX por item), `carimbos[]` {imagem, t0} — desenhados como CARDS centralizados de 930 px empilhados abaixo dos itens (mesmo padrão das reportagens; os campos x/y/largura/rotacao são ignorados nessa versão).

### tipo: "clipe" — clipe com áudio próprio + narração por cima
`duck: true`, `clipes[]` {arquivo, ss, t, chip, legenda[] (frases da fala, 1–2 pills no topo), cropF (0.5 = centro; maior empurra a janela para a DIREITA da imagem original — usar quando o sujeito está deslocado no quadro)}.

### tipo: "falas" — intro falada + sequência de cortes
`intro` {bg, linhas[]} (parte canvas com a narração) + `clipes[]` (mesmo schema do clipe, sem duck) — os cortes tocam com o áudio original integral, frase completa sempre.

### tipo: "campanha" — fechamento
`bg`, `linhasTopo[]`, `voto` {numero, t0}, `arte` {caminho, t0}, `pill` {texto, t0}.

## Gotchas que custaram horas (não repetir)

- `colorbalance` usa `bs`/`bm` (shadows/midtones) — `ms` não existe e derruba o filtro.
- A lista global de pousos (flash/shake) precisa ser salva/restaurada ao renderizar cada parte — sem isso só a primeira cena treme.
- A base `anullsrc` precisa entrar explicitamente no `amix` (`[0:a]anull[base]` + primeiro na lista) — `duration=first` depende dela.
- Fotos PAISAGEM como fundo viram zoom horroroso com Ken Burns 9:16 — fundo paisagem deve ser pré-processado com blur (`makeBg`).
- Montserrat não tem glifo ✓ — desenhar o check como path.
- Narración ElevenLabs sai ~0 dBFS; mix em até 0 dB de pico é o padrão aprovado.
- JSON com acentos sempre via arquivo, nunca inline no shell do Windows.
- Regenerar: editar `blocos.json`/`cenas.json` → `gerar-narracao.mjs --so-faltando` (só os blocos apagados) → `render-video-rich.mjs`.

## QA obrigatório

Frames de TODOS os tipos de cena extraídos do MP4 FINAL (incluindo os clipes!) + `volumedetect` em três janelas (clipe com áudio original, cena com duck, pouso de SFX). O usuário revisa frame a frame e cobra: texto estourado, card pequeno, buraco no meio, sujeito cortado no clipe, atribuição ambígua no áudio.
