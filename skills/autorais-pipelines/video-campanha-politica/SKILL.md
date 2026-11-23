---
name: video-campanha-politica
description: Produz vídeos de campanha e ataque político em formato Reels/Stories (9:16) — tipografia cinética, narração ElevenLabs em beats curtos, carimbos de manchetes reais sobre vídeo mudo, mapa de dados, clipes com áudio original e fechamento de campanha. Use sempre que o usuário pedir vídeo político, vídeo de campanha, vídeo de ataque, super ataque, reels sobre vacinação/eleições/política/criminalidade, ou mencionar "vídeo no modelo TESOURAÇÃO", "carimbos", "narração da ElevenLabs" ou "pipeline de beats" — mesmo que não diga a palavra "skill".
---

# Vídeo de campanha política — pipeline completo

Pipeline validado de ponta a ponta (primeiro vídeo produzido: `video-vacina-vote22.mp4`, out/2026). O fluxo tem 5 fases. Os arquivos do projeto ficam numa pasta de trabalho (ex.: a pasta raiz do projeto), e os scripts da skill rodam de dentro dela.

## Requisitos do ambiente (verificar no início de cada projeto novo)

```bash
node -v   # precisa de Node 18+
cd <pasta-do-projeto>
npm init -y
npm install @napi-rs/canvas ffmpeg-static ffprobe-static @elevenlabs/elevenlabs-js --no-fund --no-audit
# ffmpeg-static precisa do passo manual de download (o npm bloqueia o postinstall):
node node_modules/ffmpeg-static/install.js
```

Fontes (Montserrat, pesos Black/ExtraBold/Bold/SemiBold) em `fonts/`:
```bash
mkdir -p fonts && for w in ExtraBold Black Bold SemiBold; do
  curl -sL -o "fonts/Montserrat-$w.ttf" "https://raw.githubusercontent.com/JulietaUla/Montserrat/master/fonts/ttf/Montserrat-$w.ttf"; done
```

Copie os scripts da skill para a pasta do projeto (`scripts/`) — eles usam caminhos relativos.

## Fase 1 — Roteiro (fatos → blocos)

Leia `references/roteiro-e-blindagem.md` antes de escrever o primeiro roteiro de um tema novo.

1. Levante com o usuário: tese central, comparações desejadas (países/concorrentes), fechamento de campanha (candidato + número).
2. Pesquise e anote FATOS COM DATAS verificáveis e fontes reais. Peça ao usuário as prints das manchetes da época (salvar em `fontes/` com padrão `NN-veiculo-AAAAMMDD-descricao.png`) — elas viram carimbos no vídeo.
3. Estruture o vídeo em blocos no modelo visual (leia `references/modelo-visual.md`): gancho → dados → oposição → impacto → campanha. Salve o roteiro em `roteiro.md` com uma seção "blindagem contra fact-check": onde a tese pode ser atacada e qual formulação defensável usar.
4. **1 fala = 1 beat visual, e a fala é CURTA (3–7s, máx. 11s)** — cada bloco cobre UMA imagem/carimbo/clipe e tem ~40–120 caracteres. Bloco de 20–40s quebra a sincronia (a informação chega numa velocidade e a fala noutra) e volta como refação do vídeo inteiro. Se a fala pede 3 informações, são 3 beats.
5. **Atribuição no ÁUDIO, não só na tela** — o nome de quem fez vai falado; "quando ele chegou" soa ambíguo e volta como correção.
6. Liste também "o que NÃO usar": temas que o próprio material mostra favorecer o adversário ficam fora do vídeo.

## Fase 2 — Falas (narração por blocos)

Transforme o roteiro em `audio/blocos.json`:

```json
[
  { "arquivo": "01-gancho", "titulo": "Gancho", "texto": "As doses de vacina pousaram no Brasil antes de..." },
  { "arquivo": "02-ranking", "titulo": "Ranking", "texto": "Reino Unido: oito de dezembro. ..." }
]
```

Regras de escrita das falas (importam para a voz sintética):
- Números e datas POR EXTENSO ("dezenove de novembro", "cinquenta e nove dias") — garante pronúncia correta.
- Frases curtas, ritmo de denúncia, pausa implícita antes do número forte.
- 1 bloco = 1 cena do vídeo. Em vídeos ricos, 1 bloco = 1 beat (1 manchete, 1 clipe, 1 foto). Total típico: 9 a 24 blocos.
- Frase de ponte abrindo cada ato ("Agora, olha o que o governo X entregou...").

## Fase 3 — ElevenLabs (testar e gerar narração)

Leia `references/elevenlabs.md` antes da primeira execução num projeto novo (tem limites de plano e pegadinhas de Windows).

1. Teste a chave: `node scripts/testar-elevenlabs.mjs` (edita a chave no topo do script ou usa `ELEVENLABS_API_KEY`).
2. Confirme qual voz/modelo passou no teste e preencha `audio/config.json`.
3. Gere a narração: `node scripts/gerar-narracao.mjs` → um MP3 por bloco em `audio/narracao/`.
4. Para mudar qualquer fala: edite `audio/blocos.json` e rode de novo (barato — só os blocos mudados, ou todos, custam poucos caracteres).

## Fase 4 — Render do vídeo

**Escolha o renderizador pelo tipo de vídeo:**

- **Super ataque com clipes + carimbos + mapa de dados (pipeline de BEATS):** leia
  `references/pipeline-beats.md` e use essa arquitetura — beatmap como fonte única de
  tempos, carimbo SEMPRE overlay sobre vídeo mudo escurecido (nunca fundo chapado),
  mapa de dados para seção de estados/números, beats sem TTS para clipe com áudio
  original, corte seco de som nas viradas, build em PARTES com skip-if-exists (revisão
  refaz só o beat quebrado). Scripts: `gerar-narracao.mjs --blocos X --out Y --pular-primeiro`,
  `render-chart.mjs --html g.html --dur 14.5 [--tudo]`, `capturar-carimbos.mjs` (o build.py
  é por-projeto — o padrão completo está na referência). Vídeo de referência:
  `nordeste/video-final/SUPER-ATAQUE-v3.mp4`.
- **Vídeo RICO** (clipes com áudio próprio, fotos em tela cheia, manchetes grandes com tempo de leitura): `scripts/render-video-rich.mjs` — render em segmentos (canvas + clipes ffmpeg + áudio mestre por offsets). Schema e regras de layout em `references/render-video-rich.md`. Regras duras: manchete GRANDE (~86% da largura) com mínimo 3 s de leitura; bloco de cards CENTRALIZADO verticalmente (nunca ancorado no topo); fundo nunca chapado (foto real + Ken Burns + gradiente + gradação quente/frio por ato); clipes cortados em frase completa com chip de fonte/ano e `cropF` conferido (onde o sujeito está no quadro).
- **Vídeo clássico 100% tipográfico:** o fluxo abaixo.

1. Gere o som de carimbo (uma vez por projeto): `node scripts/sintetizar-carimbo.mjs` → `audio/carimbo.mp3`.
2. Escreva `cenas.json` (uma cena por bloco, com os carimbos e seus instantes). O schema completo de cada tipo de cena está em `references/render-video.md`; exemplo real completo em `assets/cenas-exemplo.json`.
3. Renderize: `node scripts/render-video.mjs` → `video-final.mp4` (1080×1920, 30 fps, narração + carimbos sonoros mixados). Render típico: 1 a 2 min para ~3 min de vídeo.
4. Preview de um frame isolado: `node scripts/render-video.mjs --preview <segundo>` → `preview.png`.

## Fase 5 — QA e publicação

1. Extraia frames de CADA cena do MP4 final e OLHE: `ffmpeg -ss <t> -i video-final.mp4 -frames:v 1 f-<t>.png`. Procure: texto estourando laterais/topo, sobreposição, cor trocada, **card pequeno ou ancorado no topo deixando buraco no meio**, **sujeito cortado no clipe (crop)**. Em vídeos ricos, os clipes SÓ existem no MP4 final — QA sem eles não é QA.
2. Atalho de varredura: folha de contato com um tile a cada ~8 s (`-vf "fps=1/8.4,scale=270:480,tile=4x6"`) + frames em resolução cheia nos pontos críticos (gancho, carimbo batendo, mapa, stamp, bandeira, final).
3. Confirme os carimbos no áudio: pico de volume ~0 dB na janela do pouso vs -6 dB na narração (`ffmpeg -ss <t> -t 0.5 -i video.mp4 -af volumedetect -f null -`). Em clipes com narração por cima, confira se o áudio original do clipe continua audível (duck ~0.25). Se houver corte seco de som, a janela do corte deve medir ~−20 dB (só o boom).
4. **Checklist "todos os cortes entraram"**: liste cada vídeo/print enviado pelo usuário e o beat onde aparece — o usuário confere um por um e devolve o vídeo se faltar um.
5. Gere a legenda de Instagram JUNTO com a entrega do vídeo (não como pedido separado): sem travessões nem jargões, linguagem direta + hashtags + CTA de compartilhar + lembrete de identificação de propaganda eleitoral (regra do TSE). Exemplo em `assets/legenda-exemplo.txt`.

## Regras que evitam retrabalho (aprendidas na prática)

- JSON com acentos NUNCA inline no curl no Windows (Git Bash corrompe UTF-8) — sempre gravar corpo em arquivo e enviar com `-d @arquivo`.
- Toda linha de texto desenhada usa auto-ajuste de largura (`fitSize`) — texto fixo estoura as laterais do 9:16.
- Nos previews, confira as cores ANTES do render completo: se azul/amarelo saírem trocados, o pixel format do pipe está errado (usar `rgba` com `getImageData`).
- Filtro de áudio do ffmpeg: labels de entrada do concat/amix SEMPRE entre colchetes `[a1][a2]concat=...`; faltou colchete e o ffmpeg reporta "No such filter".
- Você não consegue ouvir o MP3 — valide pronúncia escrevendo números por extenso e deixe o usuário ouvir o resultado.
- Transcrição (Whisper/YouTube) pode errar palavra: quando houver **legenda queimada** no vídeo original, ela vence a transcrição (caso real: "compra salada" transcrito como "compra farinha").
- `colorbalance` do ffmpeg usa `bs`/`bm`/`rs`/`rm` — `ms` não existe e derruba o filtro inteiro.
- Prints são sagrados para o usuário: tamanho grande, centralizados verticalmente, com fonte e data legíveis, e NUNCA sobrepõem o texto do próprio print (reserve rodapé no card).
- Ao entregar, apresente as correções com frame extraído do MP4 final como prova — "conferi no arquivo" evita loop de revisão.
- `fade=t=out:st={d-0.22}` exige `d > 0.3` — overlay menor que isso some antes de aparecer (cortar o fade, não o overlay).
- Cadeia de overlays no ffmpeg precisa de rótulo intermediário por passo (`[oc0]`, `[oc1]`…) — emendar `overlay...overlay...` sem rótulo dá "No such filter: ''".
- Saída de parte com `tpad` (freeze) usa `-frames:v round(dur*24)` no OUTPUT; `-t` corta o freeze e a parte sai menor.
- HTML que lê dados via `<script src="arquivo.js">` funciona em file://; `fetch()` não. Dados do beatmap para o HTML viram `window.NOME={...}`.
- `window.RENDER(t)` determinístico começa com `setTransform(1,0,0,1,0,0)` e o loop respeita `window.__STOP` — sem isso shake/translate de um frame polui o seguinte e o autoplay disputa com o capturador.
- Projeção de mapa em canvas: `CY = centro + ((LAT0+LAT1)/2)*K` — sinal trocado e o mapa renderiza fora do canvas (frame "vazio" sem erro no console).
- No mix final, garanta um leito de silêncio (`anullsrc -t <duração do vídeo>`) dentro do amix — se o input mais longo acabar antes do vídeo, o `-shortest` do mux corta o hold final do card.
- Beatmap JSON é a fonte única de tempos: mapa, overlays, SFX e narração leem dele; nunca chumbe tempo igual em dois lugares.
